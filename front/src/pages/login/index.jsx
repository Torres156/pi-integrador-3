import { useContext } from "react"
import { themeContext } from "../../scripts/hooks/themeProvider"
import { useEffect } from "react"
import logo from "@/assets/imgs/logo-black.png"
import background from "@/assets/imgs/background.jpeg"
import { LightIcon } from "../../styles/svgs/LightIcon"
import { NightIcon } from "../../styles/svgs/NightIcon"
import { useEnv } from "../../scripts/hooks/useEnv"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import axios from "axios"
import { UserContext } from "../../scripts/hooks/userProvider"


export const Login = () => {

    const swal = withReactContent(Swal);
    const {theme, setTheme} = useContext(themeContext)
    const {user, setUser} = useContext(UserContext)
    const env = useEnv();
    

    function onToggleTheme()
    {
        setTheme(theme === 'dark' ? 'default' : 'dark');
    }

    function onSubmit(event)
    {
        event.preventDefault();    
        const data = new FormData(event.target);

        axios.post(env.api + "auth", data).then(res => {
            setUser(res.data);
        }).catch(err => {
            if (err.response)            
                swal.fire('', err.response.data, 'error');            
        })
    }

    return (
        <main className="login" style={{ backgroundImage: `url(${background})` }} >
            <div className="toggle-theme header">
                <div className="close" onClick={onToggleTheme}>
                    {theme === 'dark' && <LightIcon width={20} height={20} />}
                    {theme !== 'dark' && <NightIcon width={20} height={20} />}
                </div>
            </div>
            <form className={"relative" + (theme === 'dark' ? " translucy-desktop" : "")} onSubmit={onSubmit}>
                <img className="logo" src={logo} />

                <div className="content column">
                    <div className="column w-full gap-4">
                        <h1>Entrar</h1>
                        <h2>Olá! Bom te ver novamente.</h2>
                    </div>
                    <div className="form-input">
                        <label for="Email">
                            E-mail:
                            <input name="usuario"  type="email" required maxLength={30} autoComplete="new-password" placeholder="Digite seu e-mail" />
                        </label>
                    </div>

                    <div className="form-input">
                        <label for="Senha">
                            Senha:
                            <input name='senha' type="password" required maxLength={30} autoComplete="new-password" placeholder="Digite sua senha" />
                        </label>
                    </div>

                    <button className="form-button">Entrar</button>
                </div>

                <div className="footer absolute bottom" style={{justifyContent: 'center'}}>                    
                    <a href="/new-account" className="text-button">Criar conta</a>
                </div>
            </form>
        </main>
    )
}