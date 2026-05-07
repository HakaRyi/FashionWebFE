// src/main.jsx

import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/index";

import "./shared/styles/index.scss";
import "react-datepicker/dist/react-datepicker.css";

import reportWebVitals from "./reportWebVitals";

createRoot(document.getElementById("root")).render(
  createElement(
    StrictMode,
    null,
    createElement(App)
  )
);

reportWebVitals(console.log);