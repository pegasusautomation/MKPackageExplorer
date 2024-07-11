import React, { useState } from "react";
import logo from "./././images.png"
// import { ThemeProvider } from 'styled-components';
import {
    SDivider,
    SLink,
    SLinkContainer,
    SLinkIcon,
    SLinkLabel,
    SLinkNotification,
    SLogo,
    SSidebar,
} from "./styles";

import {
    // AiFillSafetyCertificate,
    // AiOutlineFieldTime,
    AiOutlineLeft,
    AiOutlineLoading3Quarters,
} from "react-icons/ai";
// import { MdLogout } from "react-icons/md";
import {  BsCloudUpload, BsTicketDetailed } from "react-icons/bs";

import { useLocation } from "react-router-dom";

const Sidebar = () => {
    const { pathname } = useLocation();

 
    return (
      
        <SSidebar style={{background:'#8482b8'}}>
            <>
                {/* <SSidebarButton isOpen={sidebarOpen} onClick={() => setSidebarOpen((p) => !p)}>
                    <AiOutlineLeft />
                </SSidebarButton> */}
            </>
            <SLogo>
                {/* <h1><br></br>MK</h1> */}
                <img src={logo} alt="Logo" style={{ width: '90%', height: '30px'}} />
                <caption style={{width:"200px",textAlign:"left",fontSize:"15px",color:"white"}}>Support</caption>
                <caption style={{width:"200px",textAlign:"left",fontSize:"15px",color:"white"}}>Package Analyser</caption>
            </SLogo>
            <SDivider />
            {linksArray.map(({ icon, label, notification, to }) => (
                <SLinkContainer key={label} isActive={pathname === to}>
                    <SLink to={to}>
                        <SLinkIcon>{icon}</SLinkIcon>
                       
                            <>
                                <SLinkLabel>{label}</SLinkLabel>
                                {/* if notifications are at 0 or null, do not display */}
                                {!!notification && (
                                    <SLinkNotification>{notification}</SLinkNotification>
                                )}
                            </>
                    </SLink>
                </SLinkContainer>
            ))}
            <SDivider />
            {/* {secondaryLinksArray.map(({ icon, label }) => (
                <SLinkContainer key={label}>
                    <SLink to="/loginhistory" style={!sidebarOpen ? { width: `fit-content` } : {}}>
                        <SLinkIcon>{icon}</SLinkIcon>
                        {sidebarOpen && <SLinkLabel>{label}</SLinkLabel>}
                    </SLink>
                </SLinkContainer>
            ))} */}
            {/* <SDivider /> */}
            {/* <STheme>
                {sidebarOpen && <SThemeLabel>Dark Mode</SThemeLabel>}
                <SThemeToggler
                    isActive={theme === "dark"}
                    onClick={() => setTheme((p) => (p === "light" ? "dark" : "light"))}
                >
                    <SToggleThumb style={theme === "dark" ? { right: "1px" } : {}} />
                </SThemeToggler>
            </STheme> */}
        </SSidebar>
    );
};

const linksArray = [
//   {
//     // {userData && (
//             label: "Profile",
//             icon: <AiOutlineProfile />,
//             to: "/Profile",
//     // )}
//         },
    {
        label: "Pkg Uploader",
        icon: <BsCloudUpload />,
        to: "/pkgupload",
    },
    // {
    //     label: "Bitrate",
    //     icon: <BsServer />,
    //     to: "/Bitrates",
    // },
    // {
    //     label: "Bitrate Graph",
    //     icon: <BsGraphUp />,
    //     to: "/graph",
    // },
    // {
    //     label: "Alarm",
    //     icon: <BsAlarmFill />,
    //     to: "/Alarm",
    // },
    // {
    //     label: "Licence",
    //     icon: <AiFillSafetyCertificate />,
    //     to: "/Licences",
    // },
    // {
    //     label: "Uptime",
    //     icon: <AiOutlineFieldTime/>,
    //     to: "/uptime",
    // },
    {
        label: "Pkg Analysis",
        icon: <AiOutlineLoading3Quarters/>,
        to: "/loganalysis",
    },
    {
        label: "Help",
        icon: <BsTicketDetailed/>,
        to: "/help",
    },
];
//     const secondaryLinksArray = [
//         // {
//         //     label: "Login History",
//         //     icon: <MdLogout />,
//         //     to:"/loginhistory"
//         // },
// ];

export default Sidebar;

