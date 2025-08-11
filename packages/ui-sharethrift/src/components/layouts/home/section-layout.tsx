import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../../shared/molecules/footer";
import { Header } from "../../shared/molecules/header";
import { Navigation } from "../../shared/molecules/navigation";
import { useAuth } from "react-oidc-context";
import { HandleLogoutMockForMockAuth } from "../../shared/handle-logout";

export default function HomeTabsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // Map nav keys to routes as defined in index.tsx
  const routeMap: Record<string, string> = {
    home: "home",
    listings: "my-listings",
    reservations: "my-reservations",
    messages: "messages",
    account: "account",
    // subnavs can be handled in account/*
  };

  // Determine selectedKey from current location
  const getSelectedKey = () => {
    const path = location.pathname.replace(/^\//, "");
    // Account subroutes
    if (path.startsWith("account/")) {
      const subPath = path.replace("account/", "");
      if (subPath.startsWith("profile")) return "profile";
      if (subPath.startsWith("settings")) return "settings";
      // Add more subroutes as needed
      return undefined; // nothing highlighted if not a known subroute
    }
    const found = Object.entries(routeMap).find(([, route]) => path.startsWith(route));
    return found ? found[0] : "home";
  };

  const handleNavigate = (key: string) => {
    // Handle account subroutes
    const accountSubTabs = ["profile", "bookmarks", "settings"];
    if (accountSubTabs.includes(key)) {
      navigate(`/account/${key}`);
      return;
    }
    // If key is already in the form 'account/profile', 'account/settings', etc.
    if (key.startsWith("account/")) {
      navigate(`/${key}`);
      return;
    }
    const route = routeMap[key];
    if (route) navigate(`/${route}`);
  };

  const handleOnLogin = () => {
    navigate("/auth-redirect");
  };

  const handleOnSignUp = () => {
    navigate("/auth-redirect");
  };

  const handleLogOut = () => {
    HandleLogoutMockForMockAuth(auth);
  };

  return (
    <div style={{ minHeight: "100vh", width: "100vw", overflowX: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", zIndex: 1100 }}>
        <Header isAuthenticated={auth.isAuthenticated} onLogin={handleOnLogin} onSignUp={handleOnSignUp} />
      </div>
      <div style={{ display: "flex", flexDirection: "row", flex: 1, height: "100vh", paddingTop: 64 }}>
        <Navigation isAuthenticated={auth.isAuthenticated} onNavigate={handleNavigate} onLogout={handleLogOut} selectedKey={getSelectedKey()} />
        <main style={{ marginLeft: 240, width: "100%" }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
