const StatisticBlockPlaceholder = () => {
    const placeholderItems = Array.from(Array(4).keys());

    return (
        <div className="bg-gray-50 pb-14 xl:pb-28 xl:mb-32">
            <div className="container mx-auto left-0 right-0 xl:absolute">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {placeholderItems.map((item) => {
                        return (
                            <div key={item} className="mx-4 p-4 rounded-xl bg-white shadow-[0_18px_32px_rgba(18,24,46,0.15)] md:mx-0">
                                <div className="flex items-center">
                                    <div className="ml-4">
                                        <div className="bg-primary-300 w-24 h-24 flex justify-center items-center rounded-full">
                                            <div className="h-16 w-16 animate-pulse bg-gray-200 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <strong className="block mb-2">
                                            <div className="w-12 h-10 animate-pulse bg-gray-200"></div>
                                        </strong>
                                        <span className="w-24 h-4 animate-pulse block bg-gray-200"></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StatisticBlockPlaceholder;
