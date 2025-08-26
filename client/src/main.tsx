import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/auth/AuthContexts.tsx";
import { AuthMessProvider } from "./contexts/auth/AuthMessContexts.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthMessProvider>
          <App />
        </AuthMessProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
