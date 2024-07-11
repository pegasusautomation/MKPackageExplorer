import { Link } from "react-router-dom";
import styled from "styled-components";

import { btnReset, v } from "../../styles/variables";

export const SSidebar = styled.div`
    width: calc(${() => v.sidebarWidth} + 13px);
    background: ${({ theme }) => theme.bg};
    padding: ${v.lgSpacing};
    position: relative;
    height:100vh;
`;

export const SLogo = styled.div`
    width: 52px;
    img {
        max-width: 100%;
        height: auto;
    }
    cursor: pointer;
    margin-bottom: ${v.lgSpacing};
`;

export const SDivider = styled.div`
    height: 1px;
    width: 100%;
    background: ${({ theme }) => theme.bg3};
    margin: ${v.lgSpacing} 0;
`;

export const SLinkContainer = styled.div`
    background: ${({ theme, isActive }) => (!isActive ? `transparent` : theme.bg3)};
    border-radius: ${v.borderRadius};
    margin: 4px 0;
    height: 10px;
    width: 120px;
    padding-bottom: 40px;
    padding-left: 5px;
    :hover {
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.bg3};
    }
`;

export const SLink = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    font-size: 13px;
    padding: calc(${v.smSpacing} - 2px) 0;
`;

export const SLinkIcon = styled.div`
    padding: ${v.smSpacing} ${v.mdSpacing};
    display: flex;
    svg {
        font-size: 18px;
    }
`;

export const SLinkLabel = styled.span`
    margin-left: calc(${v.smSpacing} - 2px);
    font-size: 13px;
`;

export const SLinkNotification = styled.div`
    font-size: 14px;
    padding: calc(${v.smSpacing} / 2) ${v.smSpacing};
    border-radius: calc(${v.borderRadius} / 2);
    background: ${({ theme }) => theme.primary};
    color: white;
    margin-right: ${v.mdSpacing};
`;

export const STheme = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
`;

export const SThemeLabel = styled.span`
    display: block;
    flex: 1;
`;

export const SThemeToggler = styled.button`
    ${btnReset};
    margin: 0 auto;
    cursor: pointer;
    width: 40px;  // Adjust the size as needed
    height: 20px;  // Adjust the size as needed
    border-radius: 20px;
    background: ${({ theme, isActive }) => (!isActive ? theme.bg3 : theme.bg3)};
    position: relative;
    zoom: 0.6;
`;

export const SToggleThumb = styled.div`
    height: 18px;
    width: 18px;
    position: absolute;
    top: 1px;
    bottom: 1px;
    transition: 0.2s ease right;
    right: ${({ isActive }) => (isActive ? '1px' : 'calc(100% - 18px - 1px)')};  // Adjusted the logic for thumb position
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
`;
