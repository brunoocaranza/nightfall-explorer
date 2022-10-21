const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary-25": "#FAF8FF",
                "primary-50": "#F7F3FF",
                "primary-75": "#E6DAFF",
                "primary-100": "#D3BEFF",
                "primary-200": "#B490FF",
                "primary-300": "#9665FD",
                "primary-400": "#834AFC",
                "primary-500": "#773EF0",
                "primary-600": "#5C25D2",
                "primary-700": "#3B1293",
                "primary-800": "#250A61",
                "primary-900": "#100724",

                "gray-25": "#F8F8F8",
                "gray-50": "#F3F3F4",
                "gray-75": "#ECECED",
                "gray-100": "#E2E2E4",
                "gray-200": "#D9D8DC",
                "gray-300": "#C6C5CA",
                "gray-400": "#B3B1B8",
                "gray-500": "#8D8A95",
                "gray-600": "#676472",
                "gray-700": "#4F4B5C",
                "gray-800": "#2E293D",
                "gray-900": "#110C22",
            },
            borderWidth: {
                3: "3px",
            },
        },

        fontFamily: {
            sans: ["TWK Lausanne Family", ...defaultTheme.fontFamily.sans],
        },
    },
};
