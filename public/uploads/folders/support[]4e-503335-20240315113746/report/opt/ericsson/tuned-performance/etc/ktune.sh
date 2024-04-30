#!/bin/bash

. /usr/lib/tuned/functions

start() {
        #modprobe -v cpufreq_conservative  > /dev/null > /dev/null || :
        #modprobe -v cpufreq_userspace  > /dev/null || :
        #modprobe -v cpufreq_performance   > /dev/null || :
        #modprobe -v speedstep-lib   > /dev/null || :
        #modprobe -v p4-clockmod   > /dev/null || :
        modprobe -v acpi-cpufreq  > /dev/null || :
        #set_cpu_governor performance  || :
        #echo never > /sys/kernel/mm/transparent_hugepage/defrag  || :
        #echo never > /sys/kernel/mm/transparent_hugepage/enabled  || :
        #echo 40 > /proc/sys/net/ipv4/igmp_max_msf  || :
        #echo 40 > /proc/sys/net/ipv4/igmp_max_memberships  || :
        for d in /proc/sys/net/ipv4/conf/* ; do echo 2 > "$d"/force_igmp_version; done  || :
        #multicast ingest rp_filter issue : https://dev.azure.com/mediakind/MPD/_workitems/edit/1524847
        while read file ; do echo 0 > $file  ; done < <(find /proc/sys/net/ipv4/conf/ -iname rp_filter)
        #Default is 1 and 0 is the lowest setting but higher might benefit latency
        #echo 0 | tee /proc/sys/kernel/sched_domain/cpu*/domain*/cache_nice_tries || :
        #Maximum balance interval ms
        #Default is 4 and I'd assume that smaller values would be better for latency
        #echo 1 | tee /proc/sys/kernel/sched_domain/cpu*/domain*/max_interval || :
        #The processor does not sacrifice performance for the sake of saving energy. This is the default value.
        x86_energy_perf_policy performance || :
        cpupower frequency-set --governor performance  || :
        #set maximum performance sets kernel configurations or directly accesses hardware registers affecting processor power saving policies
        cpupower set -b 0   || :
        # for cpupower to performance mode
        #https://wiki.archlinux.org/index.php/CPU_frequency_scaling
        #force the kernel to ignore the warning from the BIOS:
        # dynamic change
        #echo "0" > /sys/module/processor/parameters/ignore_ppc || :

        # Set maximal freq of gpu T1 kontron/M1/SG1 for minimal also, so gpu stay at max freq
        for card in /sys/class/drm/card?; do
            if [ -f $card/gt_max_freq_mhz ] ; then
                cat $card/gt_max_freq_mhz > $card/gt_min_freq_mhz  || :
            fi
        done

        # If the frequency of your machine gets wrongly limited by BIOS, this should help
        rm -rf /etc/modprobe.d/ignore_ppc.conf   || :
        
        echo 100 > /sys/devices/system/cpu/intel_pstate/min_perf_pct || :

        sed -i "s|ondemand|performance|" "/etc/sysconfig/cpupower" || : 
        sed -i "s|powersave|performance|" "/etc/sysconfig/cpupower" || : 
        #systemctl enable cpupower || : 
        #systemctl restart cpupower || : 

        # Set maximal freq of cpu for minimal also, so cpu stay at max freq
        for i in $(ls /sys/devices/system/cpu/*/cpufreq/scaling_min_freq); do cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq  > $i ; done
                
        # set watchdog_thresh to 60 to prevent nmi watchdog soft lookup, by default set to 10
        #echo 60 > /proc/sys/kernel/watchdog_thresh

        # Tune up receive (TX) and transmit (RX) buffers on network interface
        #Setting rx-usecs to 8000 will limit interrupts to about 125 interrupts per second per queue
        #Setting rx-usecs to 4000 will limit interrupts to about 250 interrupts per second per queue
        #Setting rx-usecs to 2000 will limit interrupts to about 500 interrupts per second per queue
        #Setting rx-usecs to 1000 will limit interrupts to about 1000 interrupts per second per queue
        #Setting rx-usecs to 250 will limit interrupts to about 4000 interrupts per second per queue
        #Setting rx-usecs to 125 will limit interrupts to about 8000 interrupts per second per queue

        # Perf with vlan issue SDI/IP https://dev.azure.com/mediakind/MPD/_workitems/edit/1497429
        # for device in $(find /sys/class/net/ -maxdepth 1 -mindepth 1 -type l -not -name "lo" -not -name "veth*" -not -name "flannel*" -not -name "cni*"  -not -name "vlan*" -exec basename {} \;) ;
        for device in $(find /sys/class/net/ -maxdepth 1 -mindepth 1 -type l -not -name "lo" -not -name "veth*" -not -name "flannel*" -not -name "cni*"  -exec basename {} \;) ;
        do
            # get max buffer card value RX en TX value to set this value and reduce interrupt
            rx_pre_set_max=$(ethtool -g ${device} | grep RX -m 1 | awk '{print $2}') || :
            tx_pre_set_max=$(ethtool -g ${device} | grep TX -m 1 | awk '{print $2}') || :

            export combined_max=$(ethtool -l ${device} | grep Combined -m 1 | awk '{print $2}') || :

            if  cat /proc/net/vlan/config | grep ${device} > /dev/null ; then

                # fix "high level of cc errors from T1 multicast flows" : https://dev.azure.com/mediakind/MPD/_workitems/edit/1090667
                # Perf with vlan issue SDI/IP https://dev.azure.com/mediakind/MPD/_workitems/edit/1497429
                # export combined_max=1

                # fix "Continuity Count errors at service output" : https://dev.azure.com/mediakind/MPD/_workitems/edit/1120264

                if ethtool -i ${device} | grep ixgbe > /dev/null ; then
                    ethtool -A ${device} autoneg off tx off rx off || :
                    # Perf with vlan issue SDI/IP https://dev.azure.com/mediakind/MPD/_workitems/edit/1497429
                    export combined_max=1
                fi
                if ethtool -i ${device} | grep igb > /dev/null ; then
                    ethtool -A ${device} autoneg off tx off rx off || :
                    # Perf with vlan issue SDI/IP https://dev.azure.com/mediakind/MPD/_workitems/edit/1497429
                    export combined_max=1
                fi

                if ethtool -i ${device} | grep VLAN > /dev/null ; then
                    # Perf with vlan issue SDI/IP https://dev.azure.com/mediakind/MPD/_workitems/edit/1497429
                    export combined_max=1
                fi

            fi

            ((ethtool -L ${device} combined ${combined_max} > /dev/null || : ) && (ethtool -G ${device} rx ${rx_pre_set_max} > /dev/null || : ) && (ethtool -G ${device} tx ${tx_pre_set_max} > /dev/null || : )) &

            # Large enabling interrupt mitigation reduces interrupt processing load dramatically, try to set 125, 250, 500, 1000, 2000, 4000, 8000 max supported by device
            # if rx-usecs up to 125, ping decrease to 0.250ms, so limit to 125 (https://redmine.envivio.com/issues/66986) for nic 1Go, but set max for nic 10g
            if [ $(ethtool ${device} | grep Speed | awk '{print $2}' | sed 's/Mb\/s//g') -gt 1000 ]; then 
                ((ethtool -C ${device} adaptive-rx off rx-usecs 125 > /dev/null || : ) && (ethtool -C ${device} adaptive-rx off rx-usecs 250 > /dev/null || : ) && (ethtool -C ${device} adaptive-rx off rx-usecs 500 > /dev/null || : ) && (ethtool -C ${device} adaptive-rx off rx-usecs 1000 > /dev/null || : ) && (ethtool -C ${device} adaptive-rx off rx-usecs 2000 > /dev/null || : ) && (ethtool -C ${device} adaptive-rx off rx-usecs 4000 > /dev/null || : ) && (ethtool -C ${device} adaptive-rx off rx-usecs 8000 > /dev/null || : )) &
            fi

            #The following settings will distribute the IRQs across all the cores that are local to the adapter (same NUMA node)
            (/etc/tuned/ericsson-tuned-performance/set_irq_affinity.sh -X local ${device} || :)

            #For very CPU intensive workloads, we recommend pinning the IRQs to all cores
            #(/etc/tuned/ericsson-tuned-performance/set_irq_affinity.sh -X all ${device} || :)
        done

        #disable swap by default
        swapoff -a || :

        # Set the memlock user limit to unlimited for operation of Mellanox Rivermax (ST 2110/2022-7)
        # Currently there is no Helm chart setting for ulimits, so we'll set the ulimit here
        ulimit -l unlimited || :
        
        return 0
}

stop() {
       return 0
}

process "$@"

