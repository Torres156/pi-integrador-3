import { useContext } from "react"
import { themeContext } from "../../scripts/hooks/themeProvider"
import { useEffect } from "react"
import logo from "@/assets/imgs/logo-black.png"

export const NotFound = () => {

    const { theme, setTheme } = useContext(themeContext)

    useEffect(() => {
        setTheme("dark")
    }, [])

    return (
        <main className="not-found column">
            <h1>404</h1>
            <h2>Página não encontrada!</h2>
        </main>
    )
}