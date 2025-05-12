import { useContext, useEffect, useState } from "react"
import { Dashboard } from "../../../styles/layouts/dashboard"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { useEnv } from "../../../scripts/hooks/useEnv";
import { getConfigHeaders, getHeaders } from "../../../scripts/services/userServices";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { UserContext } from "../../../scripts/hooks/userProvider";

export function CreateSchedule() {
	const navigate = useNavigate();
	const env = useEnv();
	const swal = withReactContent(Swal);
	const { user } = useContext(UserContext);

	const [servicos, setServicos] = useState([])

	const agora = new Date();
	const amanham = new Date();
	amanham.setDate(agora.getDate() + 1)
	const hojeDisable = amanham.toISOString().split('T')[0];
	let hoje = agora;
	if (hoje.getHours() >= 18) hoje.setDate(hoje.getDate() + 1);

	hoje = hoje.toISOString().split('T')[0];


	// Loadings
	useEffect(() => {
		swal.showLoading();
		axios.get(env.api + "servicos", getConfigHeaders(user)).then(res => {
			setServicos(res.data);
			swal.close();
		}).catch(err => {
			console.log(err.data);
			swal.close();
			swal.fire('Ops! Aconteceu um problema.', 'Erro ao carregar dados de serviços', 'error');
		})

	}, []);

	const [price, setPrice] = useState("R$ 0.00");
	const [horas, setHoras] = useState([])
	function updateInfos(e) {
		const id = e.target.value;
		const find = servicos.find(x => x.id == id);
		if (!find) return;

		setPrice('R$ ' + find.preco);
		updateHoras();
	}

	function updateHoras() {

		const dia = document.getElementById('dia').value;
		const id = document.getElementById('servico').value;
		const find = servicos.find(x => x.id == id);

		if (!find || !dia) {
			setHoras([]);
			return;
		}

		const query = new URLSearchParams({ data: dia, servico: id });

		axios.get(env.api + "servicos/disponivel?" + query, getConfigHeaders(user)).then(res => {
			setHoras(res.data);
		}).catch(err => {
			setHoras([]);
		})
	}

	function onSubmit() {
		const servico = document.getElementById('servico').value;
		const data = document.getElementById('dia').value;
		const hora = document.getElementById('hora').value;

		if (!servico) {
			swal.fire('Ops! Aconteceu um problema.', 'Serviço não foi selecionado', 'error');
			return;
		}

		if (!data) {
			swal.fire('Ops! Aconteceu um problema.', 'Data não foi selecionada', 'error');
			return;
		}

		if (!hora) {
			swal.fire('Ops! Aconteceu um problema.', 'Horário não foi selecionado', 'error');
			return;
		}

		swal.showLoading();
		axios.post(env.api + "agendamentos/criar", {servico: servico, data: data, hora: hora}, getConfigHeaders(user)).then(res => {
			swal.close();
			swal.fire('', 'Agendamento feito com sucesso.', 'success').then(e => {
				navigate('/');
			});
		}).catch(err => {
			swal.close();
			swal.fire('Ops! Aconteceu um problema.', err.data, 'error');
		})
	}

	return (

		<Dashboard title={'Novo agendamento'} mode='customer'>
			<div className="container gap-20">
				<div className="gap-10">
					<button className="novo" onClick={() => onSubmit()}>Criar</button>
					<button className="back" onClick={() => { navigate("/") }}>Voltar</button>
				</div>

				<div className="form-input">
					<label>
						Serviço:
						<select id='servico' onChange={updateInfos}>
							<option hidden>Selecione um serviço</option>
							{servicos.length > 0 && servicos.map(x => (
								<option value={x.id}>{x.nome}</option>
							))}
						</select>
					</label>
					<label for="time">
						Data do agendamento:
						<input type='date' id='dia' min={hojeDisable} onClick={(e) => e.target.showPicker()} onChange={() => updateHoras()} autoComplete="new-password" />
					</label>
				</div>
				<div className="form-input">
					<label for="time">
						Horário do agendamento:
						<select id='hora' required>
							<option hidden>Selecione um horario</option>
							{horas.length > 0 && horas.map(x => (
								<option value={x.tempo}>{x.display}</option>
							))}
						</select>
					</label>
					<label>
						Valor:
						<input required maxLength={30} autoComplete="new-password" value={price} readOnly />
					</label>
				</div>
			</div>
		</Dashboard>
	)
}