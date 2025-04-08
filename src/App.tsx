import { Operator } from "./app/operator";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";

export function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Operator />
      </ThemeProvider>
    </>
  );
}
