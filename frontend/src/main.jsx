import { StrictMode } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ToastProvider from "./components/shared/ToastProvider.jsx";
import "./styles/assignments.css";
import "./styles/base.css";
import "./styles/buttons.css";
import "./styles/calendar.css";
import "./styles/forms.css";
import "./styles/layout.css";
import "./styles/responsive.css";
import "./styles/settings.css";
import "./styles/toasts.css";
import "./styles/variables.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ToastProvider />
    </BrowserRouter>
  </StrictMode>
);
