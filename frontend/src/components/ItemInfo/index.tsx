import { ReactNode } from "react";

interface IBlockProps {
    children: ReactNode;
}

const ItemInfo = ({ children }: IBlockProps) => {
    return (
        <div className="bg-gray-50 py-16">
            <div className="container mx-auto max-w-7xl">{children}</div>
        </div>
    );
};

export default ItemInfo;
