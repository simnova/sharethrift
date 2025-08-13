import { Outlet, useNavigate } from "react-router-dom";
import { Footer } from "../../shared/molecules/footer";
import { Header } from "../../shared/molecules/header";
import { useAuth } from "react-oidc-context";

export default function SignupLayout() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleOnLogin = () => {
    navigate("/auth-redirect");
  };

  const handleOnSignUp = () => {
    navigate("/auth-redirect");
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
        onSignUp={handleOnSignUp}
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
        <main style={{ width: "100%" }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}