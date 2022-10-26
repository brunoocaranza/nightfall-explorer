import { QueryCache, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 30000,
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            const status = error?.response?.status;

            if (status === 403) {
                return window.location.replace(`/errors/${status}`);
            }
        },
    }),
});

export default queryClient;
