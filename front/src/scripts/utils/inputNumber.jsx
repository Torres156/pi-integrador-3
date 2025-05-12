
export function handleInputNumber(event)
{
	const input = event.target;
	
    let valor = input.value.replace(/[^0-9.]/g, '');

    // Permite apenas um ponto
    const partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }

    // Limita a duas casas decimais se houver ponto
    if (partes.length === 2) {
      partes[1] = partes[1].slice(0, 2);
      valor = partes[0] + '.' + partes[1];
    }

    input.value = valor;	
}