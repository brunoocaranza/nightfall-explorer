interface ITransactionHistoryPlaceholder {
    numOfItems: number;
}

const TransactionHistoryPlaceholder = ({ numOfItems }: ITransactionHistoryPlaceholder) => {
    const placeholderItems = Array.from(Array(numOfItems).keys());

    return (
        <div className="container mx-auto my-16 max-w-7xl w-11/12 xl:w-full">
            <h2 className="flex justify-between font-bold text-3xl mb-10">
                <div>
                    <div className="font-light animate-pulse opacity-50 bg-gray-200 w-44 h-7"></div>
                </div>
                <div>
                    <div className="font-light animate-pulse opacity-50 bg-gray-200 w-12 h-7"></div>
                </div>
            </h2>

            <table className="table-transactions">
                <thead>
                    <tr>
                        <th>
                            <div className="font-light animate-pulse opacity-50 bg-gray-200 w-32 h-5"></div>
                        </th>
                        <th>
                            <div className="font-light animate-pulse opacity-50 bg-gray-200 w-24 h-5"></div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {placeholderItems.map((item) => {
                        return (
                            <tr key={item}>
                                <td>
                                    <div className="flex items-center font-bold border-b border-transparent transition-all border-b-4 animate-pulse opacity-50 bg-gray-200 w-4/12 h-7"></div>
                                </td>
                                <td>
                                    <div className="font-light animate-pulse opacity-50 bg-gray-200 w-24 h-7"></div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistoryPlaceholder;
