import { useTranslation } from "react-i18next";
import IconInfo from "jsx:../../assets/images/icons/info.svg";
import IconCloseBlue from "jsx:../../assets/images/icons/close-blue.svg";
import { useState } from "react";

const NetworkMaintenance = () => {
    const { t } = useTranslation();

    const [isClosed, setIsClosed] = useState<string | null>(sessionStorage.getItem("maintenanceClosed"));

    const close = () => {
        sessionStorage.setItem("maintenanceClosed", "1");
        setIsClosed("1");
    };

    return (
        <>
            {!isClosed && (
                <div className="bg-white py-6">
                    <div className="container flex flex-row mx-auto justify-between max-w-7xl text-sm">
                        <div className="flex">
                            <IconInfo className="w-4 mr-5 fill-blue-500" />
                            <div>
                                <h4 className="font-bold mb-2">{t("Network is currently under maintenance")}</h4>
                                <p>
                                    {t(
                                        "Block Explorer is currently showing the blocks made before maintenance. Information about following blocks will be available soon as maintenance is completed."
                                    )}
                                </p>
                            </div>
                        </div>
                        <button className="h-fit p-0 m-0 btn-none" onClick={close}>
                            <IconCloseBlue />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default NetworkMaintenance;
