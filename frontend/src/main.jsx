import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";

import store from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TransporterBidContextProvider } from "../Context/TransporterContext.jsx";
import { ClientBidContextProvider } from "../Context/ClientBidContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <TransporterBidContextProvider>
          <ClientBidContextProvider>
            <App />
            <ToastContainer />
          </ClientBidContextProvider>
        </TransporterBidContextProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
