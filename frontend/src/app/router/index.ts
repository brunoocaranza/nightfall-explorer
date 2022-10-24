import { lazy } from "react";
import {
    BLOCK_PAGE,
    LANDING_PAGE,
    SEARCH_NOT_FOUND,
    NOT_FOUND_PAGE,
    RouteObject,
    PROPOSER_PAGE,
    TRANSACTION_PAGE,
    CHALLENGED_BLOCK_PAGE,
    ERROR_PAGE,
} from "./consts";

import Landing from "../../pages/Landing";
import NotFound from "../../pages/NotFound";
import ServerError from "../../pages/ServerError";

const Block = lazy(() => import("../../pages/Block"));
const SearchNotFound = lazy(() => import("../../pages/SearchNotFound"));
const Transaction = lazy(() => import("../../pages/Transaction"));
const Proposer = lazy(() => import("../../pages/Proposer"));
const ChallengedBlock = lazy(() => import("../../pages/ChallengedBlock"));

interface IRouteList {
    [key: string]: RouteObject;
}

const routeList: IRouteList = {
    [LANDING_PAGE]: {
        id: 1,
        path: "/",
        component: Landing,
        meta: {
            title: "Polygon Nightfall",
            description:
                "Polygon Nightfall Block Explorer allows you to explore and search the Polygon Nightfall transactions, blocks and other data relevant for the Polygon Nightfall network",
        },
    },
    [BLOCK_PAGE]: {
        id: 2,
        path: "/block/:hash",
        component: Block,
        meta: {
            title: "Block {PARAM} - Polygon Nightfall",
            description: "Polygon Nightfall detailed block information page.",
        },
    },
    [TRANSACTION_PAGE]: {
        id: 3,
        path: "/transaction/:hash",
        component: Transaction,
        meta: {
            title: "Transaction {PARAM} - Polygon Nightfall",
            description: "Polygon Nightfall detailed transaction information page.",
        },
    },
    [PROPOSER_PAGE]: {
        id: 4,
        path: "/proposer/:hash",
        component: Proposer,
        meta: {
            title: "Proposer {PARAM} - Polygon Nightfall",
            description: "Polygon Nightfall detailed proposer information page.",
        },
    },
    [CHALLENGED_BLOCK_PAGE]: {
        id: 5,
        path: "/challenged-blocks",
        component: ChallengedBlock,
        meta: {
            title: "Challenged Blocks - Polygon Nightfall",
            description: "Polygon Nightfall detailed challenged block information page.",
        },
    },
    [SEARCH_NOT_FOUND]: {
        id: 97,
        path: "/search-not-found/:hash",
        component: SearchNotFound,
        meta: {
            title: 'Not found "{PARAM}" - Polygon Nightfall',
            description: "",
        },
    },
    [ERROR_PAGE]: {
        id: 98,
        path: "/errors/:status",
        component: ServerError,
        meta: {
            title: "Error page - Polygon Nightfall",
            description: "",
        },
    },
    [NOT_FOUND_PAGE]: {
        id: 99,
        path: "*",
        component: NotFound,
        meta: {
            title: "Page not found - Polygon Nightfall",
            description: "",
        },
    },
};

export default routeList;
