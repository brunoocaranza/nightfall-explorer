import { Suspense } from "react";
import { init } from "./app/utils/helpers";
import routeList from "./app/router";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Meta from "./components/Meta";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/functional/ScrollToTop";
import HealthCheck from "./components/functional/HealthCheck";
import SentryHandler from "./components/functional/SentryHandler";
import GlobalLoader from "./components/GlobalLoader";

const App = () => {
    init();

    return (
        <ErrorBoundary FallbackComponent={SentryHandler}>
            <HelmetProvider>
                <Meta>
                    <HealthCheck>
                        <ScrollToTop>
                            <Header />
                            <Suspense fallback={<GlobalLoader />}>
                                <Routes>
                                    {Object.values(routeList).map((route) => {
                                        return <Route path={route.path} element={<route.component />} key={route.id} />;
                                    })}
                                </Routes>
                            </Suspense>
                        </ScrollToTop>
                        <Footer />
                    </HealthCheck>
                </Meta>
            </HelmetProvider>
        </ErrorBoundary>
    );
};

export default App;
