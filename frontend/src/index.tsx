import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./assets/scss/app.scss";
import "./app/i18n";
import "./app/axios";
import queryClient from "./app/query";
import { QueryClientProvider } from "@tanstack/react-query";

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
