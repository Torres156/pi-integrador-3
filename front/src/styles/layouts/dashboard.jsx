import { useContext } from "react"
import { Navbar } from "../components/Navbar"
import { themeContext } from "../../scripts/hooks/themeProvider"
import { NightIcon } from "../svgs/NightIcon"
import { LightIcon } from "../svgs/LightIcon"

export const Dashboard = ({ children, title, mode }) => {
    const { theme, setTheme } = useContext(themeContext)

    function onToggleTheme() {
        setTheme(theme === 'dark' ? 'default' : 'dark');
    }

    return (<main className="dashboard">
        <div className="toggle-theme header">
            <div className="close" onClick={onToggleTheme}>
                {theme === 'dark' && <LightIcon width={20} height={20} />}
                {theme !== 'dark' && <NightIcon width={20} height={20} />}
            </div>
        </div>
        <Navbar mode={mode} />

        <div className="content w-full">
            <div className="w-full mobile-center"><h1 className="title text-primary">{title}</h1></div>
            <div className="w-full column mt-40">
                {children}
            </div>
        </div>

    </main>)
}