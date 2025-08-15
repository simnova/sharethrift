import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppLayout } from "./index.js";
const meta = {
    title: 'Organisms/AppLayout',
    component: AppLayout,
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
const DemoContent = () => (_jsxs("div", { children: [_jsx("h1", { children: "Welcome to the App Layout" }), _jsx("p", { children: "This is the main content area. Add your page content here." })] }));
export const LoggedOut = {
    render: () => (_jsx(AppLayout, { isAuthenticated: false, children: _jsx(DemoContent, {}) })),
};
export const LoggedIn = {
    render: () => (_jsx(AppLayout, { isAuthenticated: true, onLogout: () => { }, onLogin: () => { }, onSignUp: () => { }, onNavigate: () => { }, children: _jsx(DemoContent, {}) })),
};
//# sourceMappingURL=index.stories.js.map