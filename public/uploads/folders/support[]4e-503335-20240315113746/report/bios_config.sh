#!/bin/sh

#
# Set custom BIOS config if it not has been done during installation 
# Save BIOS config for support package at each reboot
#

CONFIG_BIOS_FLAG=/opt/envivio/BIOS/.notconfigured
CONFIG_SAVE_FLAG=/opt/envivio/BIOS/.notsaved
UPDATE_BIOS_FLAG=/opt/envivio/BIOS/.toupdate
CURRENT_BIOS_FLAG=/opt/envivio/BIOS/.current.ver

BOM_VENDOR=`dmidecode -s baseboard-manufacturer | sed '/^#/ d' | sed -n 1p`
BIOS_VENDOR=`dmidecode -s bios-vendor | sed '/^#/ d' | sed -n 1p`
PLATFORM=`dmidecode -s system-product-name | sed '/^#/ d' | sed -n 1p`

tty --quiet
BACKGROUND=$?
if [[ $BACKGROUND -ne 0 ]]; then
    echo ============== Reboot at `date` ==============
else
    echo ============== Log-in at `date` ==============
fi

warning_flashing () {
    echo "#########################################"
    echo "#            *** WARNING ***            #"
    echo "#             FLASHING BIOS             #"
    echo "#########################################"
    echo ""
    echo "      *** DO NOT CUT THE POWER !! ***"
    echo ""
}

warning_rebooting () {
    echo "#########################################"
    echo "#             BIOS updated              #"
    echo "#            REBOOTING NOW!             #"
    echo "#########################################"
}

update_firmware()
{
    echo " => BIOS updating ! "
    /opt/envivio/BIOS/smc-sum/sum -c UpdateBios --file /opt/envivio/BIOS/$BIOS_SUB_DIR/smc_bios.rom --reboot
    RET=$?
    if [ ! $RET -eq 0 ]; then
        echo "!!! ERROR : Updating BIOS !!!"
        echo "Press a key to continue ..."
        read
    fi
}

setconferror()
{
    if [ ! $1 -eq 0 ]; then 
        echo "!!! ERROR : set BIOS config !!!"  >> /opt/envivio/BIOS/error.log
        exit 1
    fi
}

check_bios_config ()
{
    if [ ! $1 -eq 0 ]; then 
        echo "!!! ERROR : Saving BIOS config !!!"  >> /opt/envivio/BIOS/error.log
        exit 1
    fi
}

apply_bios_parameter_and_log_error ()
{
    parameter="$1"
    value="$2"
    /opt/envivio/BIOS/syscfg /bcs "" "$parameter" $value
    if [ ! $? -eq 0 ]; then 
        echo "!!! ERROR : Fail to apply BIOS parameter: $parameter with value $value !!!"
        echo "Continuing in 60 seconds... Press a key to proceed immediately ..."
        read -t 60
    fi
}

check_current_bios_parameter_value() 
{
    parameter="$1"
    expected_value="$2"
    current_value=$(/opt/envivio/BIOS/syscfg /d biossettings "$parameter" | grep "Current Value" | cut -d \: -f2)
    echo "Current value for parameter: $parameter is $current_value (expected:$expected_value)"
    [[ $current_value == *$expected_value* ]] && return 0 || return 1
}

apply_bios_parameters_and_log_error ()
{
    parameter1="$1"
    parameter2="$2"
    value="$3"
    /opt/envivio/BIOS/syscfg /bcs "" "$parameter1" "$parameter2" $value
    if [ ! $? -eq 0 ]; then 
        echo "!!! ERROR : Fail to apply BIOS parameters: $parameter1 $parameter2 with value $value !!!"
        echo "Continuing in 60 seconds... Press a key to proceed immediately ..."
        read -t 60
    fi
}

intel_save_bios_config ()
{
    file=$1
    rm -f $file
    /opt/envivio/BIOS/syscfg /s $file
    RET=$?
    check_bios_config $RET
}

# Demote LAN and EFI to be the last 2 entries
intel_set_boot_order()
{
  # Capture current boot order. Ignore header of syscfg output
  /opt/envivio/BIOS/syscfg /bbosys | tail -n +4 > /tmp/boot-order.txt
  IFS=$'\n' read -d '' -r -a lines < /tmp/boot-order.txt

  nb_boot_devs=${#lines[@]}
  lan_entry=0
  efi_entry=0
  new_order=""
  for (( i=0; i<$nb_boot_devs; i++ )); do
    j=$(( $i + 1 ))
    if [[ ${lines[$i]} =~ "IBA ".*" Slot" ]]; then
      lan_entry=$j
    elif [[ ${lines[$i]} =~ "Launch EFI Shell" ]]; then
      efi_entry=$j
    else
      new_order="$new_order $j"
    fi
  done
  # Append LAN and EFI
  new_order="$new_order $lan_entry"
  new_order="$new_order $efi_entry"
  
  echo "Old boot order: ${lines[@]}"
  echo "Boot order mod: $new_order"

  /opt/envivio/BIOS/syscfg /bbosys "" $new_order

  final_order=`/opt/envivio/BIOS/syscfg /bbosys | tail -n +4`

  echo "New boot order: $final_order"
}

case $BIOS_VENDOR in
    *Megatrends*)
        case $PLATFORM in 

                Kontron)
                    echo "No BIOS configuration to do for $BIOS_VENDOR ($PLATFORM)"
                    ;;

                VEGA-7010)
                   echo "No BIOS configuration to do for $BIOS_VENDOR ($PLATFORM)"
                   ;;

	        RS300-E8-PS4)
		        # Whe are on RS300-E8-PS4
		        echo "$PLATFORM platform detected"

		        cd /opt/envivio/BIOS/ 

                # set custom conf only if nedded
                if [ -e $CONFIG_BIOS_FLAG ]; then
                    # set custom config
                    ./SCELNX_64 /i /s x1_bios_conf.txt /b /r
                    RET=$?
                    if [ ! $RET -eq 0 ]; then 
                        echo "!!! ERROR : set BIOS config !!!"  >> /opt/envivio/BIOS/error.log
                        exit 1
                    fi
                    rm -f $CONFIG_BIOS_FLAG
					sync
					reboot --force
                fi
                rm -f bios_conf_current.txt
		        # save config
		        ./SCELNX_64 /o /s bios_conf_current.txt /h hii_dump.db /b
		        RET=$?
                if [ ! $RET -eq 0 ]; then 
                    echo "!!! ERROR : Saving BIOS config !!!"  >> /opt/envivio/BIOS/error.log
                    exit 1
                fi
		        cd - # get back where we from
	        ;;
	        
            SYS-8028B-TR4F)
                # Whe are on SYS-8028B-TR4F
                echo "$PLATFORM platform detected for bios config"
                BIOS_SUB_DIR="SYS-8028B-TR4F"
                
                if [ -e $UPDATE_BIOS_FLAG ]; then
                    #check again the bios version and update it if needed
                    rm -f $UPDATE_BIOS_FLAG
                    touch $CONFIG_BIOS_FLAG
                    sync
                    CURRENT_BIOS_VERSION=`dmidecode -s bios-version | sed '/^#/ d'`
                    BIOS_FILE_VERSION=`sed q /opt/envivio/BIOS/$BIOS_SUB_DIR/bios_version.txt`
                    
                    #Specific patch due to SMC engineering version
                    BIOS_PATCH_VERSION=`sed q /opt/envivio/BIOS/$BIOS_SUB_DIR/bios_patch.txt`                   
                    if [ "$CURRENT_BIOS_VERSION" = "$BIOS_PATCH_VERSION" ]; then
                        echo " Patch version provided by SMC = $CURRENT_BIOS_VERSION is replaced with $BIOS_FILE_VERSION"
                        CURRENT_BIOS_VERSION=$BIOS_FILE_VERSION
                    fi

                    echo " => current ver = $CURRENT_BIOS_VERSION"
                    echo " => file ver    = $BIOS_FILE_VERSION"
                    
                    let "CUR_BIOS_VERSION=`echo $CURRENT_BIOS_VERSION| awk -F "." '{printf("%02d\n"  , $1); }'`* 100 + \
                                          $((16#`echo $CURRENT_BIOS_VERSION | awk -F "." '{printf("%s\n", $2); }'`))"
                                                                            
                    let "NEW_BIOS_VERSION=`echo $BIOS_FILE_VERSION | awk -F "." '{printf("%02d\n"  , $1); }'`* 100 + \
                                          $((16#`echo $BIOS_FILE_VERSION  | awk -F "." '{printf("%s\n", $2); }'`))"

                    if [ $NEW_BIOS_VERSION -gt $CUR_BIOS_VERSION ] ; then
                        update_firmware
                    elif [ $NEW_BIOS_VERSION -eq $CUR_BIOS_VERSION ] ; then
                        CURRENT_BIOS_DATE=`dmidecode -s bios-release-date | sed '/^#/ d'`
                        BIOS_FILE_DATE=`sed '2q;d' /opt/envivio/BIOS/$BIOS_SUB_DIR/bios_version.txt`

                        echo " => current date = $CURRENT_BIOS_DATE"
                        echo " => file date    = $BIOS_FILE_DATE"

                        cur_date=$(date -d $CURRENT_BIOS_DATE +"%Y%m%d")
                        new_date=$(date -d $BIOS_FILE_DATE +"%Y%m%d")

                        if [ $new_date -gt $cur_date ]; then
                            update_firmware
                        fi   
                    fi
                fi

                #Apply new BIOS configuration
                if [ -e $CONFIG_BIOS_FLAG ]; then
                    # set custom config
                    NEW_CONFIG_FILE=/opt/envivio/BIOS/$BIOS_SUB_DIR/bios_new_config.txt
                    /opt/envivio/BIOS/smc-sum/sum -c ChangeBiosCfg --file $NEW_CONFIG_FILE
                    RET=$?
                    touch $CONFIG_SAVE_FLAG
                    rm -f $CONFIG_BIOS_FLAG
                    sync

                    if [ $RET -eq 0 ]; then 
                        reboot --force
                    else
                        echo "!!! ERROR : Applying new BIOS config !!!"  >> /opt/envivio/BIOS/error.log
                    fi
                fi

                #Save BIOS configuration after installation
                if [ -e $CONFIG_SAVE_FLAG ]; then
                    /opt/envivio/BIOS/smc-sum/sum -c GetCurrentBiosCfgTextFile --file /opt/envivio/BIOS/bios_config_after_install.txt --overwrite
                    RET=$?
                    if [ ! $RET -eq 0 ]; then 
                        echo "!!! ERROR : Saving BIOS config after installation !!!"  >> /opt/envivio/BIOS/error.log
                    fi
                    rm -f $CONFIG_SAVE_FLAG
                fi

                # save config
                /opt/envivio/BIOS/smc-sum/sum -c GetCurrentBiosCfgTextFile --file /opt/envivio/BIOS/bios_conf_current.txt --overwrite
                RET=$?
                if [ ! $RET -eq 0 ]; then 
                    echo "!!! ERROR : Saving BIOS config !!!"  >> /opt/envivio/BIOS/error.log
                else
                    echo '----------- CheckOOBSupport ---------------' > /opt/envivio/BIOS/smc-sum/BIOS_SEL.txt
                    /opt/envivio/BIOS/smc-sum/sum -c CheckOOBSupport >> /opt/envivio/BIOS/smc-sum/BIOS_SEL.txt
                    echo '----------- GetBmcInfo ---------------' >> /opt/envivio/BIOS/smc-sum/BIOS_SEL.txt
                    /opt/envivio/BIOS/smc-sum/sum -c GetBmcInfo >> /opt/envivio/BIOS/smc-sum/BIOS_SEL.txt
                    echo '----------- GetEventLog ---------------' >> /opt/envivio/BIOS/smc-sum/BIOS_SEL.txt
                    /opt/envivio/BIOS/smc-sum/sum -c GetEventLog >> /opt/envivio/BIOS/smc-sum/BIOS_SEL.txt
                    /opt/envivio/BIOS/smc-sum/sum -c GetDmiInfo --file /opt/envivio/BIOS/smc-sum/BIOS_DMI.txt --overwrite
                fi
            ;;
	        
            *)
		        # unknown platform 
		        echo "unknown platform : $PLATFORM, so no bios configured" >> /opt/envivio/BIOS/error.log
		        exit 0
        esac
    ;;

    Intel*)
        #You need to start up OpenIPMI driver for intel tools 	
        systemctl start ipmi
        systemctl enable ipmi

        case $PLATFORM in 
            S2600WF*|S2600BP*)
                # G8 1U / 2U
                # We are on G8 1U/2U (S2600WF/S2600BP respectively)

                if [[ -e $UPDATE_BIOS_FLAG && $BACKGROUND -eq 0 ]]; then

                    echo "Updating BIOS and rebooting... "
                    echo "G8 INTEL $PLATFORM platform detected"

                    BIOS_SUB_DIR=/opt/envivio/BIOS/updates/`cat $UPDATE_BIOS_FLAG`
                    rm -f $UPDATE_BIOS_FLAG

                    if [ -e $BIOS_SUB_DIR ] ; then
                        if [ -f $CURRENT_BIOS_FLAG ]
                        then
                            echo "BMC/BIOS will not be flashed."
                        else
                            ### Echo instead of run, to avoid BIOS installation at all costs, eg with IDS/PXE
                            ### echo "SKIPPING flashupdt -nac -u $BIOS_SUB_DIR/flashupdt.cfg"
                            warning_flashing
                            /opt/envivio/BIOS/flashupdt -nac -u $BIOS_SUB_DIR/flashupdt.cfg 2>&1 | tee /root/update.log
                        fi
                        RET=$?
                        cat /root/update.log >> /root/bios_config.log
                        rm -f /root/update.log
                        if [ ! $RET -eq 0 ]; then
                            echo "!!! ERROR : BIOS not updated !!!"
                            exit 1
                        fi
                        echo " => BIOS update procedure complete "
                    else
                        echo "!!! ERROR : BIOS '$BIOS_SUB_DIR' not found !!!"
                        exit 1
                    fi

                    # Trigger BIOS config after any reboot(s) needed by firmware upgrade
                    touch $CONFIG_BIOS_FLAG

                    warning_rebooting
                    # Pause just to permit reading the "rebooting" warning
                    sleep 5 
                    sync
                    ipmitool chassis power cycle
                    reboot --force
                fi

                if [ -e $CONFIG_BIOS_FLAG ]; then
                    # set custom config
                    apply_bios_parameter_and_log_error "C1E"                0 # Disabled=00: Enabled=01
                    apply_bios_parameter_and_log_error "Set Fan Profile"    1 # Performance=01: Acoustic=02
                    /opt/envivio/BIOS/syscfg /prp restore || setconferror $?  # Options: On, Off or Restore
                    apply_bios_parameter_and_log_error "Boot Mode"          0 # Legacy=00: UEFI=01

                    # Parameter only accessible via syscfg in 1.0010 BIOS, so don't fail if we can't set it
                    /opt/envivio/BIOS/syscfg /bcs "" "CPU Power and Performance Policy" 1  #Balanced Performance=00: Performance=01: Balanced Power=02: Power=03
                    apply_bios_parameter_and_log_error "Energy Efficient Turbo"    1 # Enabled=00: Disabled=01

                    # UEFI config only present if boot mode is UEFI. Which it won't be. But if it were,
                    # we want to disable the UEFI network stack.
                    if check_current_bios_parameter_value "Boot Mode" "UEFI" ; then
                        apply_bios_parameter_and_log_error "UEFI Network Stack" 0 # Disabled=00: Enabled=01
                    fi

                    # Check and modify boot order
                    intel_set_boot_order

                    intel_save_bios_config /opt/envivio/BIOS/bios_conf_after_install.ini

                    rm -f $CONFIG_BIOS_FLAG
                    sync
                    ipmitool chassis power cycle
                    reboot --force
                fi

                if [[ $BACKGROUND -ne 0 ]]; then
                    intel_save_bios_config /opt/envivio/BIOS/bios_conf_current.ini
                fi
            ;;

	        S2600WT2*|S2600KP*|GRANTLEY)
		        # We are on G6 1U/2U (S2600WT2/S2600KP respectively)
		        echo "G6/G7 INTEL $PLATFORM platform detected"

                if [ -e $CONFIG_BIOS_FLAG ]; then
                    # set custom config

                    /opt/envivio/BIOS/syscfg /bcs "" "CPU Power and Performance Policy" 1  #Balanced Performance=00: Performance=01: Balanced Power=02: Power=03
                    apply_bios_parameter_and_log_error "PXE 1GbE Option ROM" 0 # Disabled=00: Enabled=01
                    apply_bios_parameter_and_log_error "Set Fan Profile" 1  # Performance=01: Acoustic=02
                    if [[ $BOM_TYPE != "G6_HALO_STD" ]] ; then
                        if ! check_current_bios_parameter_value "NUMA Optimized" "Enabled" ; then
                            /opt/envivio/BIOS/syscfg /bcs "" "Cluster-on-Die" 1 # Disabled=00: Enabled=01
                            /opt/envivio/BIOS/syscfg /bcs "" "NUMA Optimized" 1 # Disabled=00: Enabled=01
                            # if NUMA is readonly parameter: modification will be effective on next reboot: no need to check it now
                            # ! check_current_bios_parameter_value "NUMA Optimized" "Enabled" && apply_bios_parameter_and_log_error "NUMA Optimized" 1 # Reapply parameter to rise error on screen
                        fi
                    fi
                    apply_bios_parameter_and_log_error "Plug & Play BMC Detection" 1 # Disabled=00: Enabled=01
                    # Following command allows setting "Resume on AC Power Loss" to "Last State" (see Release Note for syscfg utility))
                    if [[ $PLATFORM != "GRANTLEY" ]] ; then
                        /opt/envivio/BIOS/syscfg /prp restore || setconferror $? #  Options: On, Off or Restore
                    fi
                    apply_bios_parameter_and_log_error "Fan PWM Offset" 0 #Options: 100=Max: 0=Min: 1=Step

                    intel_save_bios_config /opt/envivio/BIOS/bios_conf_after_install.ini

                    rm -f $CONFIG_BIOS_FLAG
                    sync
                    ipmitool chassis power cycle
                    reboot --force
                fi
                intel_save_bios_config /opt/envivio/BIOS/bios_conf_current.ini
	        ;;
	        *)
                    # unknown platform 
                    echo "unknown platform : $PLATFORM, so no bios configured"  >> /opt/envivio/BIOS/error.log
                    exit 0
        esac
    ;;
esac

exit 0
