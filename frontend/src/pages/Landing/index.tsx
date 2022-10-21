import { useRef } from "react";
import ExplorerHeader from "../../components/ExplorerHeader";
import LatestBlocks from "../../components/LatestBlocks";
import Search from "../../components/Search";
import { scrollToRef } from "../../app/utils/helpers";

const Landing = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollTo = () => {
        scrollToRef(scrollRef);
    };

    return (
        <>
            <ExplorerHeader />

            <div ref={scrollRef}>
                <Search />
            </div>

            <LatestBlocks scrollToInput={scrollTo} />
        </>
    );
};

export default Landing;
