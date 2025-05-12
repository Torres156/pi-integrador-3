import logo from "@/assets/imgs/logo-black.png"
import logoWhite from "@/assets/imgs/logo-white.png"
import { HomeIcon } from "../svgs/HomeIcon"
import { themeContext } from "../../scripts/hooks/themeProvider"
import { useContext, useEffect, useState } from "react"
import { ReportIcon } from "../svgs/ReportIcon"
import { ClientIcon } from "../svgs/ClientIcon"
import { ProductIcon } from "../svgs/ProductIcon"
import { ArrowLeftIcon } from "../svgs/ArrowLeftIcon"
import { MenuIcon } from "../svgs/MenuIcon"
import { useNavigate } from "react-router-dom"
import { ScheduleIcon } from "../svgs/ScheduleIcon"
import { UserContext } from "../../scripts/hooks/userProvider"
import { ExitIcon } from "../svgs/ExitIcon"

export const Navbar = ({ mode }) => {

    const { theme, setTheme } = useContext(themeContext)
    const [menuState, setMenuState] = useState(false)
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const openMenu = () => {
        setMenuState(true);
    }

    const closeMenu = () => {
        setMenuState(false);
    }

    function currentMenu() {
        if (window.location.pathname.includes("/reports"))
            return "reports";

        if (window.location.pathname.includes("/customers"))
            return "customers"

        if (window.location.pathname.includes("/products"))
            return "products"

        if (window.location.pathname.includes("/agendar"))
            return "agendar"

        return "home";
    }

    return (
        <>
            <div className={"menu-open header" + (!menuState ? "" : " hidden")}>
                <div className="close" onClick={openMenu}>
                    <MenuIcon width={20} height={20} />
                </div>
            </div>
            <nav>
                <div className={'menu w-full column' + (menuState ? "" : " hidden")}>
                    <div className="w-full">
                        <div className="close" onClick={closeMenu}>
                            <ArrowLeftIcon width={20} height={20} />
                        </div>
                    </div>

                    <img className="logo" src={theme === 'dark' ? logoWhite : logo} />

                    <h1 className="text-primary">{user.name}</h1>
                    <h2 className="text-secondary">{user.email}</h2>

                    <ul>
                        {user?.access === 1 ? (<>
                            <li className={currentMenu() === 'home' ? 'selected' : ''} onClick={() => { navigate("/") }} >
                                <div>
                                    <HomeIcon width={20} height={20} /> Home
                                </div>
                            </li>
                            <li className={currentMenu() === 'reports' ? 'selected' : ''} onClick={() => { navigate("/reports") }} >
                                <div>
                                    <ReportIcon width={20} height={20} /> Relatórios
                                </div>
                            </li>
                            <li className={currentMenu() === 'customers' ? 'selected' : ''} onClick={() => { navigate("/customers") }} >
                                <div>
                                    <ClientIcon width={20} height={20} /> Clientes
                                </div>
                            </li>
                            <li className={currentMenu() === 'products' ? 'selected' : ''} onClick={() => { navigate("/products") }} >
                                <div>
                                    <ProductIcon width={20} height={20} /> Serviços
                                </div>
                            </li>
                        </>) :
                            (<>
                                <li className={currentMenu() === 'home' ? 'selected' : ''} onClick={() => { navigate("/") }} >
                                    <div>
                                        <HomeIcon width={20} height={20} /> Home
                                    </div>
                                </li>
                                <li className={currentMenu() === 'agendar' ? 'selected' : ''} onClick={() => { navigate("/agendar") }} >
                                    <div>
                                        <ScheduleIcon width={20} height={20} /> Agendar
                                    </div>
                                </li>
                            </>)}

                        <li>
                            <div onClick={() => { setUser(null); navigate('/') }}>
                                <ExitIcon width={20} height={20} /> Sair
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}