import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./app/i18n";
import "./app/axios";
import queryClient from "./app/query";
import MatomoHandler from "./components/functional/MatomoHandler";

import "./assets/scss/app.scss";

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <MatomoHandler>
                    <App />
                </MatomoHandler>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
