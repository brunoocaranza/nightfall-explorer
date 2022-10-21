import { ReactNode } from "react";

interface ICardHeaderProps {
    title: string;
    icon: ReactNode;
    status?: ReactNode;
}

const CardHeader = ({ title, icon, status }: ICardHeaderProps) => {
    return (
        <div className="py-6 px-3 bg-primary-400">
            <div className="container mx-auto max-w-7xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-14">{icon}</div>

                        <h1 className="ml-4 text-xl font-bold text-white capitalize">{title}</h1>
                    </div>

                    {status}
                </div>
            </div>
        </div>
    );
};

export default CardHeader;
