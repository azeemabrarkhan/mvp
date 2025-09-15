import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Bounce, ToastContainer } from "react-toastify";
import App from "./App.tsx";

import "./index.css";
import "milligram/dist/milligram.min.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />
  </StrictMode>
);
