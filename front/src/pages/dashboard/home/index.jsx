import { useContext, useState } from "react"
import { Donut } from "../../../styles/components/Donut"
import { NormalTable } from "../../../styles/components/NormalTable"
import { Subtitle } from "../../../styles/components/subtitle"
import { Dashboard } from "../../../styles/layouts/dashboard"
import axios from "axios"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { UserContext } from "../../../scripts/hooks/userProvider"
import { useEnv } from "../../../scripts/hooks/useEnv"
import { getConfigHeaders } from "../../../scripts/services/userServices"

export const Home = () => {
    const {user} = useContext(UserContext);
    const swal = withReactContent(Swal);
    const env = useEnv();
    const [items, setItems] = useState([]);
    const [totals, setTotals] = useState({
        'total' : 0,
        'totalAtendidos' : 0,
        'totalNaoAtendidos' : 0,
    });

    const now = new Date();
    const hours = now.getHours();

    useState(() => {
       swal.showLoading();
       axios.get(env.api + 'agendamentos/home', getConfigHeaders(user)).then(res => {
        setItems(res.data.ultimos);
        setTotals({
            'total' : res.data.total,
            'totalAtendidos' : res.data.totalAtendidos,
            'totalNaoAtendidos' : res.data.totalNaoAtendidos,
        })
        swal.close();
       }).catch(err => {
        console.log(err.data);
        swal.close();
       })
    },[])

    return(
        <Dashboard title={'Inicio'}>
            <div className="container">
                <Subtitle texto={hours > 18 ? "Agendamentos atendidos hoje" :"Agendamentos para hoje"} />
                <NormalTable classes='home' items={items} />
            </div>
            
            <div className="w-full gap-4 column">
                <Subtitle texto="Total de agendamentos hoje" classes="mt-40"  />
                <div className="gap-4 w-full agendamentos-home">
                    <div className="container aspect">
                        <h1>Total agendados</h1>
                        <h1 className="total">{totals.total}</h1>
                    </div>
                    <div className="container aspect">
                        <h1>Total atendidos</h1>
                        <h1 className="total">{totals.totalAtendidos}</h1>
                    </div>
                    <div className="container aspect">
                        <h1>Total não-atendidos</h1>
                        <h1 className="total">{totals.totalNaoAtendidos}</h1>
                    </div>
                </div>
            </div>
        </Dashboard>
    )
}