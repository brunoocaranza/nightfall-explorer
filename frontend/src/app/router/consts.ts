import React from "react";

const LANDING_PAGE = "home";
const BLOCK_PAGE = "block";
const TRANSACTION_PAGE = "transaction";
const PROPOSER_PAGE = "proposer";
const CHALLENGED_BLOCK_PAGE = "challenged-blocks";
const SEARCH_NOT_FOUND = "search-not-found";
const ERROR_PAGE = "errors";
const NOT_FOUND_PAGE = "not-found";

export { LANDING_PAGE, BLOCK_PAGE, TRANSACTION_PAGE, PROPOSER_PAGE, CHALLENGED_BLOCK_PAGE, SEARCH_NOT_FOUND, ERROR_PAGE, NOT_FOUND_PAGE };

export interface RouteMeta {
    title: string;
    description: string;
}

export interface RouteObject {
    id: number;
    path: string;
    component: React.ComponentType;
    meta: RouteMeta;
}
