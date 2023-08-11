import "./shadcn.css";
import "./index.css";

import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "@/components/ui/toaster";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);
