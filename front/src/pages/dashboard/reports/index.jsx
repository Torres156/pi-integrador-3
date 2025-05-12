import { useContext, useEffect, useState } from "react"
import { isMobile } from "../../../scripts/utils/isMobile"
import { Donut } from "../../../styles/components/Donut"
import { NormalTable } from "../../../styles/components/NormalTable"
import { Subtitle } from "../../../styles/components/subtitle"
import { Dashboard } from "../../../styles/layouts/dashboard"
import { UserContext } from "../../../scripts/hooks/userProvider"
import { useEnv } from "../../../scripts/hooks/useEnv"
import axios from "axios"
import { getConfigHeaders } from "../../../scripts/services/userServices"

export const Reports = () => {

    const {user} = useContext(UserContext);
    const env = useEnv();
    
    const [items, setItems] = useState([]);
    const [servicosHoje, setServicosHoje] = useState([]);
    const [totalHoje, setHoje] = useState(0);
    const [servicosMes, setServicosMes] = useState([]);
    const [totalMes, setMes] = useState(0);

    useEffect(() => {
        axios.get(env.api + "agendamentos/relatorios", getConfigHeaders(user)).then(res => {
            setItems(res.data.ultimos);
            setHoje(res.data.totalHoje);
            setServicosHoje(res.data.servicosHoje);
            setMes(res.data.totalMes);
            setServicosMes(res.data.servicosMes);
        }).catch(err => {

        });
    }, [])

    const cores = [
        {color: 'rgba(99, 285, 146, 0.6)', 'borderColor' :'rgb(99, 255, 125)' },
        {color: 'rgba(255, 99, 133, 0.6)', 'borderColor' :'rgb(255, 99, 125)' },
        {color: 'rgba(99, 122, 255, 0.6)', 'borderColor' :'rgb(99, 109, 255)' },
    ]

    return (
        <Dashboard title={'Relatórios'}>
            <div className="w-full gap-4 column">
                <Subtitle texto="Serviços Hoje" classes="mt-40" />
                <div className="gap-4 w-full agendamentos-relatorios">                    
                    {servicosHoje.map((x, index) => (
                        <div className="container aspect">
                        <h1>{x.nome}</h1>
                        <Donut 
                            classes="total" 
                            value={x.total} 
                            total={totalHoje} 
                            cutout={isMobile() ? 28 : 40} 
                            size={isMobile() ? 70 : 100} 
                            color={cores[index].color}
                            borderColor={cores[index].borderColor}
                        />
                    </div>
                    ))}    
                </div>
            </div>

            <div className="w-full gap-4 column">
                <Subtitle texto="Serviços mês" classes="mt-40" />
                <div className="gap-4 w-full agendamentos-relatorios">
                {servicosMes.map((x, index) => (
                        <div className="container aspect">
                        <h1>{x.nome}</h1>
                        <Donut 
                            classes="total" 
                            value={x.total} 
                            total={totalMes} 
                            cutout={isMobile() ? 28 : 40} 
                            size={isMobile() ? 70 : 100} 
                            color={cores[index].color}
                            borderColor={cores[index].borderColor}
                        />
                    </div>
                    ))}                       
                </div>
            </div>

            <div className="mt-40 container">
                <Subtitle texto="Ultimos agendamentos atendidos" />
                <NormalTable items={items} />
            </div>
        </Dashboard>
    )
}