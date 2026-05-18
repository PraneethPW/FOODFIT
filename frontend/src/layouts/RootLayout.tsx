import { Outlet } from "react-router-dom";
import { ThemeSync } from "../components/ThemeSync";

export const RootLayout = () => (
  <>
    <ThemeSync />
    <Outlet />
  </>
);
