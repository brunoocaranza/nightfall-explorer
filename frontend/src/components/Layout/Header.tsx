import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { Fragment } from "react";
import { Menu, Listbox, Transition } from "@headlessui/react";
import { env } from "../../app/utils/helpers";
import Logo from "jsx:../../assets/images/logo-white.svg";
import IconPolygon from "jsx:../../assets/images/icons/nightfall-filled-purple.svg";
import IconArrowDown from "jsx:../../assets/images/icons/chevron-down.svg";
import IconMenu from "jsx:../../assets/images/icons/menu.svg";
import IconClose from "jsx:../../assets/images/icons/close.svg";

const Header = () => {
    const { t } = useTranslation();

    const urls = env("NET_URLS")?.split(",");

    const networks = urls.map((network: string) => {
        return network.split("#");
    });

    const activeNetworkIndex = networks.findIndex((network: Array<string>) => {
        return network[1] === window.location.origin;
    });

    const changeNetwork = (index: number) => {
        window.location.href = networks[index][1];
    };

    const renderLinks = () => {
        return (
            <Link to="/challenged-blocks" className="text-base text-white lg:text-white lg:mr-10 z-10 hover:text-primary-100">
                {t("Challenged Blocks")}
            </Link>
        );
    };

    const renderNetworks = () => {
        return (
            <Listbox value={activeNetworkIndex} onChange={changeNetwork}>
                {({ open }) => (
                    <>
                        <div className="relative">
                            <Listbox.Button className="shadow-sm hover:bg-white relative w-full bg-white border border-gray-300 rounded-2xl pl-3 pr-14 py-2 cursor-pointer focus:outline-none">
                                <span className="flex items-center">
                                    <IconPolygon className="flex-shrink-0 h-6 w-6" />
                                    <span className="ml-3 block text-sm">{networks[activeNetworkIndex][0]}</span>
                                </span>
                                <span className="ml-2 absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <IconArrowDown className={classNames({ "-rotate-90": open })} />
                                </span>
                            </Listbox.Button>

                            <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <Listbox.Options className="shadow-2xl absolute z-10 top-0 w-full bg-white rounded-2xl text-base focus:outline-none sm:text-sm">
                                    {networks.map((network: Array<string>, index: number) => {
                                        return (
                                            <Listbox.Option key={index} value={index}>
                                                <div className="relative w-full bg-white rounded-2xl px-3 py-2 cursor-pointer focus:outline-none">
                                                    <div className="flex items-center">
                                                        <IconPolygon className="flex-shrink-0 h-6 w-6" />
                                                        <span className="ml-3 block text-sm">{network[0]}</span>
                                                    </div>
                                                </div>
                                            </Listbox.Option>
                                        );
                                    })}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        );
    };

    return (
        <header className="p-3 bg-primary-500">
            <div className="container mx-auto max-w-7xl flex justify-between items-center xl:container">
                <Link to="/" aria-label="Polygon Nightfall Logo" className="text-base lg:text-white mr-10 z-10">
                    <Logo />
                </Link>

                <nav className="z-20 hidden lg:flex lg:items-center">
                    {renderLinks()}
                    {renderNetworks()}
                </nav>

                <Menu>
                    {({ open }) => (
                        <>
                            <Menu.Button className="text-3xl leading-3 text-white block z-10 lg:hidden" aria-label="Toggle navigation">
                                {open ? <IconClose /> : <IconMenu />}
                            </Menu.Button>

                            <Transition
                                show={open}
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                                className={classNames(
                                    "z-20 w-full bg-primary-500 mt-3 border-b-primary-500 border-b-2 left-0 px-3 py-4 absolute top-16 lg:block lg:mt-0 lg:py-0 lg:border-0 lg:flex lg:relative lg:top-0 lg:w-auto lg:bg-transparent"
                                )}
                            >
                                <Menu.Items as="nav" className="z-20 flex flex-col lg:flex-row lg:items-center" static>
                                    <Menu.Item>{renderLinks()}</Menu.Item>

                                    <hr className="mt-3 mb-4 border-primary-100 w-full block lg:hidden" />

                                    <Menu.Item>{renderNetworks()}</Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </>
                    )}
                </Menu>
            </div>
        </header>
    );
};

export default Header;
