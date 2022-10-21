import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import { ChildrenProp } from "../../app/consts/props";

const ScrollToTop = ({ children }: ChildrenProp) => {
    const location = useLocation();

    useLayoutEffect(() => {
        document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);

    return <>{children}</>;
};

export default ScrollToTop;
