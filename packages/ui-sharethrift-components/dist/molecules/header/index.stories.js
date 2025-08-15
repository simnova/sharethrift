import { jsx as _jsx } from "react/jsx-runtime";
import { Header } from "./index.js";
import { useState } from 'react';
const meta = {
    title: 'Molecules/Header',
    component: Header,
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
export const LoggedOut = {
    render: () => _jsx(Header, { isAuthenticated: false, onLogin: () => { }, onSignUp: () => { } }),
};
export const LoggedIn = {
    render: () => _jsx(Header, { isAuthenticated: true }),
};
export const ResponsiveHeaderDemo = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    return (_jsx(Header, { isAuthenticated: isAuthenticated, onLogin: () => setIsAuthenticated(true), onSignUp: () => setIsAuthenticated(true) }));
};
//# sourceMappingURL=index.stories.js.map