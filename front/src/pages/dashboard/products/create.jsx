import { useContext, useEffect, useState } from "react"
import { Dashboard } from "../../../styles/layouts/dashboard"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { useEnv } from "../../../scripts/hooks/useEnv";
import { getConfigHeaders, getHeaders } from "../../../scripts/services/userServices";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { handleInputNumber } from "../../../scripts/utils/inputNumber";
import { UserContext } from "../../../scripts/hooks/userProvider";

export function CreateProducts() {
	const navigate = useNavigate();
	const env = useEnv();
	const swal = withReactContent(Swal);
	const { user } = useContext(UserContext)

	function handleSubmit(e) {
		e.preventDefault();

		const name = document.getElementById('name').value;
		const time = document.getElementById('time').value;
		const price = document.getElementById('price').value;
		
		if (!name || name.length === 0) {
			swal.fire('Ops! Aconteceu um problema.', 'Campo do Nome está vazio.');
			return;
		}
		
		if (!time || time.length == 0) {
			swal.fire('Ops! Aconteceu um problema.', 'Campo do Tempo estimado está vazio.');
			return;
		}

		if (!price || price.length == 0) {
			swal.fire('Ops! Aconteceu um problema.', 'Campo do Preço está vazio.');
			return;
		}

		const formData = new FormData();
		formData.append('name', name);
		formData.append('time', time);
		formData.append('price', price);

		axios.post(env.api + "servicos/criar", formData, getConfigHeaders(user)).then(res => {
			swal.fire("Serviço criado com sucesso.").then(e => {
				navigate("/products");
			})
		}).catch(err => {
			swal.fire('Ops! Aconteceu um problema.', 'Erro ao criar serviço.');
		})
	}

	return (
		<Dashboard title={'Novo serviço'}>
			<div className="container gap-20">
				<div className="gap-10">
					<button className="novo" onClick={(e) => { handleSubmit(e) }}>Criar</button>
					<button className="back" onClick={() => { navigate("/products") }}>Voltar</button>
				</div>

				<div className="form-input">
					<label for="Email">
						Nome do serviço:
						<input type="name" id="name" required maxLength={30} autoComplete="new-password" placeholder="Digite o nome do serviço" />
					</label>
					<label for="time">
						Tempo estimado:
						<select id='time' required>
							<option value='' hidden>Selecione um horario</option>
							<option value="0.5">30 minutos</option>
							<option value="1.0">1 hora</option>
							<option value="1.5">1 hora e 30 minutos</option>
							<option value="2.0">2 horas</option>
							<option value="2.5">2 horas e 30 minutos</option>
							<option value="3.0">3 horas</option>
						</select>
					</label>
				</div>
				<div className="form-input col-2">
					<label for="Email">
						Preço do serviço (R$):
						<input onInput={handleInputNumber} type="text" id="price" required maxLength={10} autoComplete="new-password" placeholder="Digite o valor do serviço" />
					</label>
				</div>
			</div>
		</Dashboard>
	)
}