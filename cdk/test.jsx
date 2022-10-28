const App = () => {
    const [accessToken, setAccessToken] = useState(localStorage.setItem(“access_token”, token)); //// OVO JE DODATO

    const { error, isLoading, getAccessTokenSilently } = useAuth0();
    const { data, isFetched } = useQueryGetUser(!!accessToken);

    const setTokenToLocalstorage = useCallback(async () => {
        try {
            const token = await getAccessTokenSilently();
            setAccessToken(token); /// OVO JE DODATO
            localStorage.setItem('access_token', token);
        } catch (error) {}
    }, []);

    if (isFetched) {
        console.log(“data “, data);
    }

    useLayoutEffect(() => {
        setTokenToLocalstorage();
    }, []);

    if (error) {
        return <div>Oops... {error.message}</div>;
    }
    if (isLoading) {
        return <Loader />;
    }
    return <RouterProvider router={router()} />;
};
export default App;


