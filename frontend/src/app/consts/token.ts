export type TokenType = "erc_20" | "erc_721" | "erc_1155";

type TokenName = {
    [key in TokenType]: string;
};

export const TokenNames: TokenName = {
    erc_20: "ERC 20",
    erc_721: "ERC 721",
    erc_1155: "ERC 1155",
};
