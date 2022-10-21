import ReactPaginate from "react-paginate";
import IconArrowLeft from "jsx:../../assets/images/icons/arrow-left.svg";
import IconArrowRight from "jsx:../../assets/images/icons/arrow-right.svg";
import { useTranslation } from "react-i18next";

import "./Pagination.scss";
import { IPageChange } from "../../app/consts/page";

interface IPaginationProps {
    page: number;
    totalPages: number;
    onPaginateChange: (selectedPage: IPageChange) => void;
}

const Pagination = ({ page, totalPages, onPaginateChange }: IPaginationProps) => {
    const { t } = useTranslation();

    const pageLabel = (name: number) => {
        return (
            <div>
                {name} <span className="md:hidden">/ {totalPages}</span>
            </div>
        );
    };

    return (
        <ReactPaginate
            previousLabel={
                <div className="page-item--prev-content">
                    <IconArrowLeft /> <span>{t("Prev")}</span>
                </div>
            }
            nextLabel={
                <div className="page-item--next-content">
                    <span>{t("Next")}</span> <IconArrowRight />
                </div>
            }
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item page-item--prev"
            previousLinkClassName="page-link"
            nextClassName="page-item page-item--next"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={totalPages}
            marginPagesDisplayed={3}
            pageRangeDisplayed={3}
            onPageChange={onPaginateChange}
            pageLabelBuilder={(name) => pageLabel(name)}
            containerClassName="pagination flex justify-center text-sm"
            activeClassName="active"
            forcePage={page}
        />
    );
};

export default Pagination;
