import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>

  <React.StrictMode>
    <Auth0Provider
      domain="dev-4xlxb5a75bgzk3js.us.auth0.com"
      clientId="PeOyumRL4iDT8d1HwsS3d1BHeZh7oi1L"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://text-to-learn-api",
      }}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
    </BrowserRouter>
);
