import { useContext, useEffect, useState } from "react"
import { NormalTable } from "../../../styles/components/NormalTable"
import { Dashboard } from "../../../styles/layouts/dashboard"
import { SearchIcon } from "../../../styles/svgs/SearchIcon";
import { EditIcon } from "../../../styles/svgs/EditIcon";
import { DeleteIcon } from "../../../styles/svgs/DeleteIcon";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../scripts/hooks/userProvider";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
import { useEnv } from "../../../scripts/hooks/useEnv";
import { getConfigHeaders, getHeaders } from "../../../scripts/services/userServices";

export function Customers() {
	const navigate = useNavigate();
	const {user} = useContext(UserContext);
	const swal = withReactContent(Swal);
	const env = useEnv();

	const [search, setSearch] = useState("");
	const [searchDisplay, setSearchDisplay] = useState("");
	const [items, setItems] = useState([]);
	const [itemsDisplay, setItemsDisplay] = useState([])
	
	let debounceTimeout;
	function handleSearch(event) {
		const value = event.target.value ?? "";
		setSearchDisplay(value);		
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			setSearch(value);
		}, 150)		
	}

	function handleDelete(id)
	{
		axios.delete(env.api + "usuarios/deletar/" + id, getConfigHeaders(user)).then(res => {
			swal.fire("", "Cliente deletado com sucesso.", 'success');
			loadItems();
		}).catch(err => {
			swal.fire("Ops! Aconteceu um problema.", "Erro ao deletar cliente.", 'error');
		})
	}

	function loadItems()
	{
		swal.showLoading();
		axios.get(env.api + "usuarios", {headers: getHeaders(user)}).then(res => {
			const processData = res.data.map(e => {				
				return {
					name: e.name,
					email: e.email,					
					buttons: (<div className="gap-10">
					<button className="edit-button" onClick={() => navigate("/customers/edit/" + e.id)}><EditIcon size={25} /></button>
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

	return (
		<Dashboard title={'Listagem de Clientes'}>
			<div className="container">
				<div className="search">
					{searchDisplay === "" &&
						<span><SearchIcon width={16} height={16} /> Busca de cliente</span>
					}
					<input type="text" name="search" onChange={handleSearch} autoComplete="new-password" />
				</div>
				<NormalTable items={itemsDisplay} />
			</div>
		</Dashboard>
	)
}