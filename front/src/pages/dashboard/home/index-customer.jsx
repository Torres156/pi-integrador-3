import { useNavigate } from "react-router-dom"
import { Donut } from "../../../styles/components/Donut"
import { NormalTable } from "../../../styles/components/NormalTable"
import { Subtitle } from "../../../styles/components/subtitle"
import { Dashboard } from "../../../styles/layouts/dashboard"
import { useEnv } from "../../../scripts/hooks/useEnv"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../scripts/hooks/userProvider"
import axios from "axios"
import { getConfigHeaders } from "../../../scripts/services/userServices"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"

export const HomeCustomer = () => {

	const navigate = useNavigate();
	const env = useEnv();
	const { user } = useContext(UserContext);
	const swal = withReactContent(Swal);

	const [items, setItems] = useState([]);
	useEffect(() => {
		swal.showLoading();
		axios.get(env.api + "agendamentos", getConfigHeaders(user)).then(res => {
			swal.close();
			const datas = res.data.map(data => {
				const isDecimal = (data.hora * 10) % 10 === 5;
				const hora = Math.floor(data.hora);
				let horaDisplay = '';

				if (isDecimal)
					horaDisplay = `${hora} horas e 30 minutos`;
				else
					horaDisplay = `${hora} horas`;

				if (hora === 0) horaDisplay = '30 minutos';

				data.hora = 'às ' + horaDisplay;
				return data;
			})
			setItems(datas)
		}).catch(err => {
				console.log(err.data);
				swal.close();
				swal.fire('Ops! Aconteceu um problema.', 'Erro ao carregar agendamentos', 'error');
			})

	}, [])

	return (
		<Dashboard title={'Inicio'} mode='customer' >
			<div className="container gap-10">
				<Subtitle texto="Meus agendamentos" />
				<NormalTable items={items} />
				<button className="form-button" onClick={() => { navigate("/agendar") }}>Novo agendamento</button>
			</div>
		</Dashboard>
	)
}