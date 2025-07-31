import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { PrimeReactProvider } from "primereact/api";
// PrimeReact core CSS

// Theme CSS (pick one)
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or another theme

// PrimeIcons (required for icons like pi pi-check)
import 'primeicons/primeicons.css';


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>
);
