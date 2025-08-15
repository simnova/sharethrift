import React from 'react';
export interface AppLayoutProps {
    isAuthenticated: boolean;
    onLogin?: () => void;
    onLogout?: () => void;
    onSignUp?: () => void;
    onNavigate?: (route: string) => void;
    selectedKey?: string;
    children: React.ReactNode;
}
export declare const AppLayout: React.FC<AppLayoutProps>;
//# sourceMappingURL=index.d.ts.map