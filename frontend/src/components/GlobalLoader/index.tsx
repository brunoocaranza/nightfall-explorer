import Loader from "../../assets/images/loader.gif";

const GlobalLoader = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <img src={Loader} alt="Loading..." className="w-20 h-20" />
        </div>
    );
};

export default GlobalLoader;
