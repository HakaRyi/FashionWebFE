import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/index";

import "./shared/styles/index.scss";
import "react-datepicker/dist/react-datepicker.css";

import reportWebVitals from "./reportWebVitals";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

reportWebVitals(console.log);