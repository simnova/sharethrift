import { Outlet } from "react-router-dom";
import { Footer } from "../../shared/molecules/footer";
import { Header } from "../../shared/molecules/header";

export default function SignupLayout() {
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
      <Header isAuthenticated={true} />
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