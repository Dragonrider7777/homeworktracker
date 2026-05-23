import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/assignments.css";
import "./styles/base.css";
import "./styles/buttons.css";
import "./styles/calendar.css";
import "./styles/forms.css";
import "./styles/layout.css";
import "./styles/navbar.css";
import "./styles/responsive.css";
import "./styles/toasts.css";
import "./styles/variables.css";
import "./vendor/fontawesome/css/all.min.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
