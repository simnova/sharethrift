import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { Layout, Button } from "antd";
import styles from "./index.module.css";
import "../../styles/theme.css";
import logoIcon from "../../assets/logo/logo-icon.svg";
const { Header: AntHeader } = Layout;
export const Header = ({ isAuthenticated, onLogin, onSignUp }) => {
    const handleLogout = () => {
        // TODO: Implement logout logic
        // Example: auth.removeUser();
    };
    return (_jsxs(AntHeader, { className: styles["header"], children: [_jsxs("div", { className: styles["logoSection"], children: [_jsx("img", { src: logoIcon, alt: "Sharethrift Logo", className: styles["logo"] }), _jsx("span", { className: styles["logoText"], children: "sharethrift" })] }), _jsx("nav", { className: styles["authSection"], children: !isAuthenticated ? (_jsxs(_Fragment, { children: [_jsx(Button, { type: "link", className: styles["authButton"] ?? "", onClick: onSignUp, children: "Sign Up" }), _jsx("span", { className: styles["divider"], children: "|" }), _jsx(Button, { type: "link", className: styles["authButton"] ?? "", onClick: onLogin, children: "Log In" })] })) : (_jsx(Button, { type: "link", className: styles["authButton"] ?? "", onClick: handleLogout, children: "Log Out" })) })] }));
};
//# sourceMappingURL=index.js.map