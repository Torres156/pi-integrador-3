import { useContext, useEffect, useState } from "react"
import { Dashboard } from "../../../styles/layouts/dashboard"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import { useEnv } from "../../../scripts/hooks/useEnv";
import { getConfigHeaders, getHeaders } from "../../../scripts/services/userServices";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { handleInputNumber } from "../../../scripts/utils/inputNumber";
import { UserContext } from "../../../scripts/hooks/userProvider";

export function EditCustomers() {
	const navigate = useNavigate();
	const env = useEnv();
	const swal = withReactContent(Swal);
	const { user } = useContext(UserContext)

	const { id } = useParams();
	const [dados, setDados] = useState();

	useEffect(() => {
		if (!id) return;
		swal.showLoading();
		axios.get(env.api + "usuarios/dados/" + id, { headers: getHeaders(user) }).then(res => {			
			setDados(res.data);
			swal.close();
		}).catch(err => {
			console.log(err);
			swal.close();
			swal.fire("Ops! Aconteceu um problema.", "Erro ao carregar dados do cliente.", 'error').then(e => {
				navigate("/customers")
			});
		})
	}, [id])


	function handleSubmit(e) {
		e.preventDefault();

		const name = document.getElementById('name').value;
		const access = document.getElementById('access').value;		

		if (!name || name.length === 0) {
			swal.fire('Ops! Aconteceu um problema.', 'Campo do Nome está vazio.');
			return;
		}

		const formData = new FormData();
		formData.append('id', id);
		formData.append('name', name);
		formData.append('access', time);		

		axios.post(env.api + "usuarios/editar", formData, getConfigHeaders(user)).then(res => {
			swal.fire("Cliente editado com sucesso.").then(e => {
				navigate("/customers");
			})
		}).catch(err => {
			swal.fire('Ops! Aconteceu um problema.', 'Erro ao editar cliente.');
		})
	}

	return (
		<Dashboard title={'Editar cliente'}>
			<div className="container gap-20">
				<div className="gap-10">
					<button className="novo" onClick={(e) => { handleSubmit(e) }}>Salvar</button>
					<button className="back" onClick={() => { navigate("/customers") }}>Voltar</button>
				</div>

				<div className="form-input">
					<label for="Email">
						Nome do cliente:
						<input id="name" required maxLength={30} autoComplete="new-password" placeholder="Digite o nome do serviço" value={dados?.name} />
					</label>
					<label for="Email">
						Email do cliente:
						<input id="email" readOnly maxLength={30} autoComplete="new-password" placeholder="Email do cliente" value={dados?.email} />
					</label>
				</div>
				<div className="form-input col-2">
					<label for="time">
						Nivel de acesso:
						<select id='access' required value={dados?.access} onChange={e => {
							const value = e.target.value;
							setDados(prev => ({ ...prev, access: value }));
						}} >
							<option value='' hidden>Selecione o acesso</option>
							<option value="0">Normal</option>
							<option value="1">Administrador</option>							
						</select>
					</label>
				</div>
			</div>
		</Dashboard>
	)
}