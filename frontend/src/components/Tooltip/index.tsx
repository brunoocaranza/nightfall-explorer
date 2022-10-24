import { ReactNode } from "react";
import classNames from "classnames";

interface ITooltipProps {
    children: ReactNode;
    message: string;
    position: "left" | "right";
}

const Tooltip = ({ children, position, message }: ITooltipProps) => {
    return (
        <div className="relative flex flex-col items-center group">
            {children}
            <div
                className={classNames(
                    "absolute mb-6 flex font-normal hidden group-hover:flex lg:bottom-0 lg:right-0 lg:left-0 lg:top-auto lg:flex-col lg:items-center",
                    {
                        "right-8 top-[-8] md:mr-3 md:top-[-8]": position === "left",
                        "left-8 top-[-8] md:ml-5 md:top-[-8]": position === "right",
                    }
                )}
            >
                <div className="relative z-10 py-2 px-2 text-xs leading-4 text-white whitespace-no-wrap bg-gray-700 shadow-lg rounded-md w-44 text-center">
                    {message}
                </div>
                <div
                    className={classNames("w-3 h-3 absolute top-2.5 rounded-sm rotate-45 bg-gray-700 lg:top-0 lg:relative lg:ml-0 lg:-mt-2", {
                        "right-[-5]": position === "left",
                        "left-[-5]": position === "right",
                    })}
                ></div>
            </div>
        </div>
    );
};

export default Tooltip;
