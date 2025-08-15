import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Layout } from 'antd';
import { Header } from '../../molecules/header/index.js';
import { Navigation } from '../../molecules/navigation/index.js';
import { Footer } from '../../molecules/footer/index.js';
import styles from './index.module.css';
export const AppLayout = ({ isAuthenticated, onLogin, onLogout, onSignUp, onNavigate, selectedKey, children, }) => {
    return (_jsxs(Layout, { className: styles['appLayout'], children: [_jsx(Header, { isAuthenticated: isAuthenticated, onLogin: onLogin ?? (() => { }), onSignUp: onSignUp ?? (() => { }) }), _jsxs("div", { className: styles['bodyWrapper'], children: [_jsx(Navigation, { isAuthenticated: isAuthenticated, onLogout: onLogout ?? (() => { }), onNavigate: onNavigate ?? (() => { }), selectedKey: selectedKey ?? "" }), _jsx("main", { className: styles['content'], children: children })] }), _jsx(Footer, {})] }));
};
//# sourceMappingURL=index.js.map