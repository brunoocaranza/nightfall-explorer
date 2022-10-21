const SentryHandler = ({ children, error }: any) => {
    console.log(error);

    return <>{children}</>;
};

export default SentryHandler;
