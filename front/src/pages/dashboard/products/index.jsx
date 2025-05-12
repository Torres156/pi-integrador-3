import { useContext, useEffect, useState } from "react"
import { NormalTable } from "../../../styles/components/NormalTable"
import { Dashboard } from "../../../styles/layouts/dashboard"
import { SearchIcon } from "../../../styles/svgs/SearchIcon";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEnv } from "../../../scripts/hooks/useEnv";
import { getConfigHeaders, getHeaders } from "../../../scripts/services/userServices";
import { UserContext } from "../../../scripts/hooks/userProvider";
import { EditIcon } from "../../../styles/svgs/EditIcon";
import { DeleteIcon } from "../../../styles/svgs/DeleteIcon";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";


export function Products() {
	const navigate = useNavigate();
	const swal = withReactContent(Swal);
	
	// Hooks
	const env = useEnv();
	const {user} = useContext(UserContext);
	const [items, setItems] = useState([]);
	const [itemsDisplay, setItemsDisplay] = useState([])
	const [search, setSearch] = useState("");
	const [searchDisplay, setSearchDisplay] = useState("");

	let debounceTimeout;
	function handleSearch(event) {
		const value = event.target.value ?? "";
		setSearchDisplay(value);		
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			setSearch(value);
		}, 150)		
	}

	const timeDescriptor = {
		'0.5' : '30 minutos',
		'1.0' : '1 hora',
		'1.5' : '1 hora e 30 minutos',
		'2.0' : '2 horas',
		'2.5' : '2 horas e 30 minutos',
		'3.0' : '3 horas',
	}

	function loadItems()
	{
		swal.showLoading();
		axios.get(env.api + "servicos", {headers: getHeaders(user)}).then(res => {
			const processData = res.data.map(e => {				
				return {
					name: e.nome,
					//time: timeDescriptor[parseFloat(e.tempo).toFixed(1)],
					//price: e.preco,	
					buttons: (<div className="gap-10">
					<button className="edit-button" onClick={() => navigate("/products/edit/" + e.id)}><EditIcon size={25} /></button>
					<button className="delete-button" onClick={() => handleDelete(e.id)}><DeleteIcon size={25} /></button>
					</div>)														
				}
			});			
			setItems(processData);
			setItemsDisplay(processData);
			swal.close();
		}).catch(err => {
			swal.close();
			setItems([])
		})
	}

	useEffect(() => {
		loadItems();
	},[])

	useEffect(() => {
		let searchItems = items;
		if (search && search !== "")
			searchItems = items.filter(x => x.name.toLowerCase().includes(search.toLowerCase()));

		setItemsDisplay(searchItems);
	}, [search])

	function handleDelete(id)
	{
		axios.delete(env.api + "servicos/deletar/" + id, getConfigHeaders(user)).then(res => {
			swal.fire("", "Serviço deletado com sucesso.", 'success');
			loadItems();
		}).catch(err => {
			swal.fire("Ops! Aconteceu um problema.", "Erro ao deletar serviço.", 'error');
		})
	}

	return (
		<Dashboard title={'Listagem de Serviços'}>
			<div className="container">
				
				<div className="search">
					{searchDisplay === "" &&
						<span><SearchIcon width={16} height={16} /> Busca de serviços</span>
					}
					<input type="text" name="search" onChange={handleSearch} autoComplete="new-password" />
					<button className="novo" onClick={() => {navigate("/products/create")}}>Novo serviço</button>
				</div>
				<NormalTable items={itemsDisplay} classes="table-hover" />
			</div>
		</Dashboard>
	)
}