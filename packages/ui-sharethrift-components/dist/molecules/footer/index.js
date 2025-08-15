import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Layout } from 'antd';
import { FacebookFilled, TwitterSquareFilled } from '@ant-design/icons';
import styles from './index.module.css';
export const Footer = ({ onFacebookClick, onTwitterClick }) => {
    return (_jsxs(Layout.Footer, { className: styles["footer"], children: [_jsxs("div", { className: styles["row"], children: [_jsx("a", { href: "https://facebook.com", target: "_blank", rel: "noopener noreferrer", "aria-label": "Facebook", onClick: onFacebookClick, children: _jsx(FacebookFilled, { className: styles["icon"] }) }), _jsx("a", { href: "https://twitter.com", target: "_blank", rel: "noopener noreferrer", "aria-label": "Twitter", onClick: onTwitterClick, children: _jsx(TwitterSquareFilled, { className: styles["icon"] }) })] }), _jsxs("div", { className: styles["row"], children: [_jsx("a", { href: "/privacy", className: styles["link"], children: "Privacy Policy" }), _jsx("span", { className: styles["divider"], children: "|" }), _jsx("a", { href: "/terms", className: styles["link"], children: "Terms and Conditions" }), _jsx("span", { className: styles["divider"], children: "|" }), _jsx("a", { href: "/contact", className: styles["link"], children: "Contact" })] }), _jsx("div", { className: styles["row"], children: _jsx("span", { className: styles["copyright"], children: "\u00A92024 sharethrift All Rights Reserved" }) })] }));
};
//# sourceMappingURL=index.js.map