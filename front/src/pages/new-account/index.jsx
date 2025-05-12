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
import { useNavigate } from "react-router-dom"


export const NewAccount = () => {

    const swal = withReactContent(Swal);
    const {theme, setTheme} = useContext(themeContext)    
    const env = useEnv();
    const navigate = useNavigate();
    

    function onToggleTheme()
    {
        setTheme(theme === 'dark' ? 'default' : 'dark');
    }

    function onSubmit(event)
    {
        event.preventDefault();    

        const data = new FormData(event.target);

        if (data.get('senha') !== data.get('repetir_senha'))
        {
            swal.fire("Ops! Aconteceu um problema.", 'As senhas não se conferem.', 'error');
            return;
        }

        axios.post(env.api + "auth/criar", data).then(res => {                        
            swal.fire('', 'Usuário criado com sucesso!', 'success').then(res => {
                navigate("/");
            });     
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
            <form className={"relative" + (theme === 'dark' ? " translucy-desktop" : "")} onSubmit={onSubmit} autoComplete="off">
                <img className="logo" src={logo} style={{width: '100px'}} />

                <div className="content column">
                    <div className="column w-full gap-4">
                        <h1>Nova Conta</h1>                        
                    </div>
                    <div className="form-input">
                        <label for="Email">
                            E-mail:
                            <input name="usuario"  type="email" required maxLength={30} autoComplete="new-password" placeholder="Digite seu e-mail" />
                        </label>
                    </div>

                    <div className="form-input">
                        <label for="Email">
                            Nome:
                            <input name="nome"  type="text" required maxLength={30} autoComplete="new-password" placeholder="Digite seu nome" />
                        </label>
                    </div>

                    <div className="form-input">
                        <label for="Senha">
                            Senha:
                            <input name='senha' type="password" required maxLength={30} minLength={8} autoComplete="new-password" placeholder="Digite sua senha" />
                        </label>
                    </div>

                    <div className="form-input">
                        <label for="Senha">
                            Repetir Senha:
                            <input name='repetir_senha' type="password" required maxLength={30} autoComplete="new-password" placeholder="Digite sua senha" />
                        </label>
                    </div>

                    <button className="form-button">Criar conta</button>
                </div>

                <div className="footer absolute bottom" style={{justifyContent: 'center'}}>
                    <a href="/login" className="text-secondary text-secondary-hover">Voltar para o login</a>                    
                </div>
            </form>
        </main>
    )
}