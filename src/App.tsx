import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { RouterProvider } from "react-router";
import "./index.css";
import { router } from "./routes";

export function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster richColors />
      </ThemeProvider>
    </>
  );
}
