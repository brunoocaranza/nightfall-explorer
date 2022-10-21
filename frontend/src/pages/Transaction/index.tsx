import { Navigate, useParams } from "react-router-dom";
import { CardHeader, CardHeaderPlaceholder } from "../../components/CardHeader";
import { TransactionInfo, TransactionInfoPlaceholder } from "../../components/TransactionInfo";
import { useTransactionQuery } from "../../app/query/transaction/useTransactionQuery";
import IconTransfer from "jsx:../../assets/images/icons/transaction-transfer.svg";
import IconWithdraw from "jsx:../../assets/images/icons/transaction-withdraw.svg";
import IconDeposit from "jsx:../../assets/images/icons/transaction-deposit.svg";
import { ITransactionResponse, TransactionStatus, TransactionType } from "../../app/consts/transactions";

const Transaction = () => {
    const { hash } = useParams();

    const { data: transactionData, isLoading: isLoadingTransaction, isFetching: isFetchingTransaction } = useTransactionQuery(String(hash));

    const renderLoading = () => {
        return (
            <>
                <CardHeaderPlaceholder />
                <TransactionInfoPlaceholder numOfItems={8} showMore />
            </>
        );
    };

    const getRelevantIcon = (transactionType: TransactionType) => {
        if (transactionType === "withdraw") {
            return <IconWithdraw className="w-14 h-14" />;
        } else if (transactionType === "deposit") {
            return <IconDeposit className="w-14 h-14" />;
        }

        return <IconTransfer className="w-14 h-14" />;
    };

    const generateIndicator = (status: TransactionStatus) => {
        if (status === "available") {
            return <div className="bg-green-600 rounded-full border-3 border-white w-5 h-5 mr-2"></div>;
        } else if (status === "pending") {
            return <div className="bg-orange-500 rounded-full border-3 border-white w-5 h-5 mr-2"></div>;
        }
    };

    const getStatus = (transactionType: TransactionType, status: TransactionStatus) => {
        if (transactionType === "withdraw" && status) {
            return (
                <div className="capitalize flex items-center text-white">
                    {generateIndicator(status)} {status}
                </div>
            );
        }
    };

    const renderItem = (transactionData: ITransactionResponse) => {
        const { transactionType, status } = transactionData;

        return (
            <>
                <CardHeader title={transactionType} icon={getRelevantIcon(transactionType)} status={getStatus(transactionType, status)} />
                <TransactionInfo transaction={transactionData} />
            </>
        );
    };

    const render = () => {
        if (isLoadingTransaction || isFetchingTransaction) {
            return renderLoading();
        }

        if (transactionData) {
            return renderItem(transactionData);
        }

        return <Navigate to="not-found" />;
    };

    return render();
};

export default Transaction;
