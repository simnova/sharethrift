import { jsx as _jsx } from "react/jsx-runtime";
import { Navigation } from "./index.js";
import { useState } from 'react';
const meta = {
    title: 'Molecules/Navigation',
    component: Navigation,
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
export const LoggedOut = {
    render: () => _jsx(Navigation, { isAuthenticated: false, onNavigate: () => { } }),
};
const LoggedInDemo = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    return (_jsx(Navigation, { isAuthenticated: isAuthenticated, onLogout: () => setIsAuthenticated(false), onNavigate: () => { } }));
};
export const LoggedIn = {
    render: () => _jsx(LoggedInDemo, {}),
};
//# sourceMappingURL=index.stories.js.map