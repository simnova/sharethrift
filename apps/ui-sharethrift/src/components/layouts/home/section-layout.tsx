import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { HandleLogoutMockForMockAuth } from "../../shared/handle-logout";
import { Footer, Header, Navigation } from "@sthrift/ui-components";
import { useCreateListingNavigation } from "./components/create-listing/hooks/use-create-listing-navigation";

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
      if (subPath.startsWith("profile")) {
        return "profile";
      }
      if (subPath.startsWith("settings")) {
        return "settings";
      }
      // Add more subroutes as needed
      return undefined; // nothing highlighted if not a known subroute
    }
    const found = Object.entries(routeMap).find(([, route]) =>
      path.startsWith(route)
    );
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
    if (key === "messages") {
      navigate("/messages");
      return;
    }
    const route = routeMap[key];
    if (route) {
      navigate(`/${route}`);
    }
  };
  // Responsive margin for main content: no margin if sidebar is hidden (logged out), else responsive
  const [mainMargin, setMainMargin] = useState(auth.isAuthenticated ? 240 : 0);
  useEffect(() => {
    const handleResize = () => {
      if (!auth.isAuthenticated) {
        setMainMargin(0);
      } else {
        setMainMargin(window.innerWidth <= 768 ? 0 : 240);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [auth.isAuthenticated]);

  const handleOnLogin = () => {
    navigate("/auth-redirect");
  };

  const handleOnSignUp = () => {
    navigate("/auth-redirect");
  };

  const handleCreateListing = useCreateListingNavigation();

  const handleLogOut = () => {
    HandleLogoutMockForMockAuth(auth);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        isAuthenticated={auth.isAuthenticated}
        onLogin={handleOnLogin}
        onLogout={handleLogOut}
        onSignUp={handleOnSignUp}
        onCreateListing={handleCreateListing}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          height: "100vh",
          paddingTop: 64,
        }}
      >
        <Navigation
          isAuthenticated={auth.isAuthenticated}
          onNavigate={handleNavigate}
          onLogout={handleLogOut}
          selectedKey={getSelectedKey()}
        />
        <main style={{ marginLeft: mainMargin, width: "100%" }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
