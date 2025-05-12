<?php

namespace App\Http\Controllers;

use App\Enums\UserAccess;
use App\Models\Agendamento;
use App\Models\Servico;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ServicoController extends Controller
{
    public function index()
    {
        $servicos = Servico::orderByDesc('id')->get();
        return response()->json($servicos);
    }

    public function pegarServico($id)
    {
        $usuario = $this->getUser();        
        if (!$usuario || $usuario->access != UserAccess::USER_ACCESS_ADMINISTRATOR)
            return response()->json("Usuário sem acesso.", Response::HTTP_FORBIDDEN);

        $servico = Servico::where('id', $id)->first();
        if (!$servico)
            return response("Serviço não encontrado.", Response::HTTP_NOT_FOUND);

        return response()->json($servico);
    }

    public function criar(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'time' => 'required',
            'price' => 'required',
        ],[
            'name.required' => 'O campo Nome de serviço está vazio!',
            'time.required' => 'O campo Tempo de estimado está vázio!',
            'price.required' => 'O campo Tempo de estimado está vázio!',
        ]);

        $usuario = $this->getUser();
        if (!$usuario || $usuario->access != UserAccess::USER_ACCESS_ADMINISTRATOR)
            return response()->json("Usuário sem acesso.", Response::HTTP_FORBIDDEN);

        $servico = new Servico([
            'nome' => $request->name,
            'tempo' => $request->time,
            'preco' => $request->price,
        ]);
        $servico->save();

        return response()->json();
    }

    public function editar(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'name' => 'required',
            'time' => 'required',
            'price' => 'required',
        ],[
            'name.required' => 'O campo Nome de serviço está vazio!',
            'time.required' => 'O campo Tempo de estimado está vázio!',
            'price.required' => 'O campo Tempo de estimado está vázio!',
        ]);

        $usuario = $this->getUser();        
        if (!$usuario || $usuario->access != UserAccess::USER_ACCESS_ADMINISTRATOR)
            return response()->json("Usuário sem acesso.", Response::HTTP_FORBIDDEN);

        $servico = Servico::find($request->id);
        if (!$servico)
            return response()->json("Serviço não encontrado.", Response::HTTP_NOT_FOUND);

        $servico->update([
            'nome' => $request->name,
            'tempo' => $request->time,
            'preco' => $request->price,
        ]);

        return response()->json();
    }

    function horasDisponiveis(Request $request)
    {        
        $request->validate(['data' => 'required', 'servico' => 'required']);

        $data = Carbon::parse($request->data);
        $servico = Servico::find($request->servico);

        if (!$servico)
            return response()->json("Serviço não encontrado.", Response::HTTP_NOT_FOUND);

        $now = Carbon::now();
        $min = 8;
        $max = 18;
        
        if ($now == $data && $now->format('HH') > $min) 
            $min = $now->format('HH');

        $horas = [];
        for($i = $min; $i <= $max; $i += floatval(0.5))
        {
            $have_minutos = ($i * 10) % 10 === 5;
            $hora = floor($i);

            if ($hora == 12) continue;
            if ($have_minutos)
            {
                if ($hora == 0)
                {
                    $horas[] = [ 'tempo' => $i, 'display' => '30 minutos'];
                    continue;
                }

                $horas[] = [ 'tempo' => $i, 'display' => $hora . ' Horas e 30 minutos'];
                continue;
            }

            $horas[] = [ 'tempo' => $i, 'display' => $hora . ' Horas'];   
        }
        //$horas = collect($horas);

        $agendamentos = Agendamento::with('servico')->where('data', $data)->get();        
        
        foreach($agendamentos as $agendamento)
        {
            $servico = $agendamento->servico;
            if (!$servico) continue;

            $start = floatval($agendamento->hora);
            $end = $start + floatval($servico->tempo) - floatval(.5);

            $horas = array_values(array_filter($horas, function($hora) use ($start, $end){
                return !(floatval($hora['tempo']) >= $start && floatval($hora['tempo']) <= $end);
            }));
        }

        return response()->json($horas);
    }

    public function deletar($id)
    {
        $usuario = $this->getUser();
        if (!$usuario || $usuario->access != UserAccess::USER_ACCESS_ADMINISTRATOR)
            return response()->json("Usuário sem acesso.", Response::HTTP_FORBIDDEN);

        Servico::where('id', $id)->delete();
        return response()->json();
    }
}
