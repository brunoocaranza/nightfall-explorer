import { ReactNode } from "react";

interface ITooltipProps {
    children: ReactNode;
    message: string;
}

const Tooltip = ({ children, message }: ITooltipProps) => {
    return (
        <div className="relative flex flex-col items-center group">
            {children}
            <div className="absolute right-5 top-[-6] mb-6 group-hover:flex font-normal hidden 2xl:bottom-0 2xl:right-auto 2xl:top-auto 2xl:flex-col 2xl:items-center 2xl:group-hover:flex">
                <div className="relative z-10 py-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-700 shadow-lg rounded-md w-44 text-center">
                    {message}
                </div>
                <div className="w-3 h-3 ml-[-7] mt-2 rounded-sm rotate-45 bg-gray-700 2xl:ml-0 2xl:-mt-2 "></div>
            </div>
        </div>
    );
};

export default Tooltip;
