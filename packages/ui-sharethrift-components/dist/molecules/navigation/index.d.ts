import React from 'react';
import '../../styles/theme.css';
export interface NavigationProps {
    isAuthenticated: boolean;
    onLogout?: () => void;
    onNavigate?: (route: string) => void;
    selectedKey?: string;
}
export declare const Navigation: React.FC<NavigationProps>;
//# sourceMappingURL=index.d.ts.map