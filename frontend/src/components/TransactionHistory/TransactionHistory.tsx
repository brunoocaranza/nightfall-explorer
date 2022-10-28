import { useTranslation } from "react-i18next";
import IconWithdraw from "jsx:../../assets/images/icons/withdraw.svg";
import IconDeposit from "jsx:../../assets/images/icons/deposit.svg";
import IconTransfer from "jsx:../../assets/images/icons/transfer.svg";
import { ITransaction } from "../../app/consts/transactions";
import { Link } from "react-router-dom";

import "./TransactionHistory.scss";

interface ITransactionHistory {
    numberOfTransactions: number;
    transactions: Array<ITransaction>;
}

const TransactionHistory = ({ numberOfTransactions, transactions }: ITransactionHistory) => {
    const { t } = useTranslation();

    const getIcon = (item: ITransaction) => {
        if (item.transactionType === "withdraw") return <IconWithdraw />;
        if (item.transactionType === "transfer") return <IconTransfer />;

        return <IconDeposit />;
    };

    return (
        <div className="container mx-auto my-16 max-w-7xl w-11/12 xl:w-full">
            <h2 className="flex justify-between font-bold text-3xl mb-10">
                {t("Transactions")} <span>{numberOfTransactions}</span>
            </h2>

            <table className="table-transactions">
                <thead>
                    <tr>
                        <th>{t("Transaction Hash")}</th>
                        <th>{t("Type")}</th>
                    </tr>
                </thead>
                <tbody>
                    {numberOfTransactions > 0 ? (
                        transactions.map((item, key) => {
                            return (
                                <tr key={`${key}-${item.transactionHash}`}>
                                    <td>
                                        <Link to={`/transaction/${item.transactionHash}`}>{item.transactionHash}</Link>
                                    </td>
                                    <td>
                                        <div className="tag-transaction-type">
                                            {getIcon(item)}
                                            {item.transactionType}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={2}>
                                <div className="empty"> {t("Empty results.")}</div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistory;
