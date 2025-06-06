import { createBrowserRouter } from "react-router";
import { Operator } from "./app/operator";
import { Quotes } from "./app/quotes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Quotes />,
    errorElement: <div>Ops! Algo deu errado.</div>,
  },
  {
    path: "/operador-404",
    element: <Operator />,
    errorElement: <div>Ops! Algo deu errado.</div>,
  },
]);
