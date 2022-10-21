import InfoParamPlaceholder from "../InfoParam/InfoParamPlaceholder";
import ItemInfo from "../ItemInfo";

interface ITransactionInfoPlaceholder {
    numOfItems: number;
    showMore?: boolean;
}

const TransactionInfoPlaceholder = ({ numOfItems, showMore }: ITransactionInfoPlaceholder) => {
    const placeholderItems = Array.from(Array(numOfItems).keys());

    return (
        <ItemInfo>
            {placeholderItems.map((item) => {
                return <InfoParamPlaceholder key={item} />;
            })}
            {showMore && (
                <div className="bg-white rounded-xl border animate-pulse border-gray-200 mt-6 flex justify-center items-center h-12 w-32 ml-4 xl:ml-0">
                    <div className="animate-pulse opacity-50 bg-gray-200 w-16 h-4"></div>
                </div>
            )}
        </ItemInfo>
    );
};

export default TransactionInfoPlaceholder;
