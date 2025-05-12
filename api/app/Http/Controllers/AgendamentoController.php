<?php

namespace App\Http\Controllers;

use App\Enums\UserAccess;
use App\Models\Agendamento;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class AgendamentoController extends Controller
{
    public function index()
    {
        $usuario = $this->getUser();
        $agendamentos = Agendamento::with("servico")->where('usuario_id', $usuario->id)->orderByDesc('hora')->get()->all();
        $agendamentos = array_map(function ($agendamento) {
            $data = Carbon::parse($agendamento->data);
            return [
                'nome' => $agendamento->servico->nome,
                'data' => $data->format('d/m/Y'),
                'hora' => $agendamento->hora,
            ];
        }, $agendamentos);

        return response()->json($agendamentos);
    }

    public function criar(Request $request)
    {
        $request->validate([
            'servico' => 'required',
            'data' => 'required',
            'hora' => 'required',
        ], [
            'servico.required' => 'O campo Serviço está vazio!',
            'data.required' => 'O campo Data de Agendamento está vázio!',
            'hora.required' => 'O campo Horário está vázio!',
        ]);

        $usuario = $this->getUser();
        if (!$usuario)
            return response()->json('Usuário não autenticado.', Response::HTTP_BAD_REQUEST);

        $data = Carbon::parse($request->data);
        $agendamento = new Agendamento([
            'servico_id' => $request->servico,
            'usuario_id' => $usuario->id,
            'data' => $data,
            'hora' => $request->hora,
        ]);
        $agendamento->save();

        return response()->json();
    }

    public function home()
    {
        $usuario = $this->getUser();
        if ($usuario->access !== UserAccess::USER_ACCESS_ADMINISTRATOR)
            return response()->json('Usuário sem permissão.', Response::HTTP_BAD_REQUEST);

        $now = Carbon::now();
        $hora = $now->hour;
        $minuto = $now->minute;

        $time = $hora + ($minuto  / 60);
        if ($time > 18) $time = 18;

        $ultimosAgendamentos = Agendamento::with(['usuario', 'servico'])
            ->whereDate('data', $now->toDateString())
            ->where('hora', '>=', $time - 5)
            ->orderBy('hora')
            ->limit(5)
            ->get()->all();

        $ultimosAgendamentos = array_map(function ($agendamento) {
            $hora = floor($agendamento->hora);
            $hasMinuto = ($agendamento->hora * 10) % 10 === 5;

            $hora = str_pad($hora, 2, '0', STR_PAD_LEFT);
            $obj = [
                'nome' => $agendamento->usuario->name,
                'servico' => $agendamento->servico->nome,
                'tempo' => $hora . ':' . ($hasMinuto ? '30' : '00')
            ];
            return $obj;
        }, $ultimosAgendamentos);

        $agendamentos = Agendamento::whereDate('data', $now->toDateString())
            ->orderBy('hora')
            ->get();

        $total = $agendamentos->count();
        $totalAtendidos = $agendamentos->filter(function ($x) use ($time) {
            return $x->hora <= $time;
        })->count();
        $totalNaoAtendidos = $agendamentos->filter(function ($x) use ($time) {
            return $x->hora > $time;
        })->count();

        return response()->json([
            'tempo' => $time,
            'ultimos' => $ultimosAgendamentos,
            'total' => $total,
            'totalAtendidos' => $totalAtendidos,
            'totalNaoAtendidos' => $totalNaoAtendidos
        ]);
    }

    public function relatorios()
    {
        $usuario = $this->getUser();
        if ($usuario->access !== UserAccess::USER_ACCESS_ADMINISTRATOR)
            return response()->json('Usuário sem permissão.', Response::HTTP_BAD_REQUEST);

        $now = Carbon::now();
        $hora = $now->hour;
        $minuto = $now->minute;

        $time = $hora + ($minuto  / 60);
        if ($time > 18) $time = 18;

        $ultimosAgendamentos = Agendamento::with(['usuario', 'servico'])
            ->whereDate('data', $now->toDateString())
            ->where('hora', '>=', $time - 5)
            ->orderBy('hora')
            ->limit(5)
            ->get()->all();

        $ultimosAgendamentos = array_map(function ($agendamento) {
            $hora = floor($agendamento->hora);
            $hasMinuto = ($agendamento->hora * 10) % 10 === 5;

            $hora = str_pad($hora, 2, '0', STR_PAD_LEFT);
            $obj = [
                'nome' => $agendamento->usuario->name,
                'servico' => $agendamento->servico->nome,
                'tempo' => $hora . ':' . ($hasMinuto ? '30' : '00')
            ];
            return $obj;
        }, $ultimosAgendamentos);

        $totalHoje = Agendamento::whereDate('data', $now->toDateString())
            ->orderBy('hora')
            ->count();

        $top3Servicos = Agendamento::whereDate('data', $now->toDateString())
            ->join('servicos', 'servicos.id', '=', 'agendamentos.servico_id')
            ->select('servicos.nome', DB::raw('count(*) as total'))
            ->groupBy('servicos.id', 'servicos.nome')
            ->orderByDesc('total')
            ->take(3)
            ->get();

        $totalMes = Agendamento::whereMonth('data', $now->month)
            ->whereYear('data', $now->year)
            ->orderBy('hora')
            ->count();

        $top3ServicosMes = Agendamento::whereMonth('data', $now->month)
            ->whereYear('data', $now->year)
            ->join('servicos', 'servicos.id', '=', 'agendamentos.servico_id')
            ->select('servicos.nome', DB::raw('count(*) as total'))
            ->groupBy('servicos.id', 'servicos.nome')
            ->orderByDesc('total')
            ->take(3)
            ->get();

        return response()->json([            
            'ultimos' => $ultimosAgendamentos,
            'totalHoje' => $totalHoje,
            'servicosHoje' => $top3Servicos,    
            'totalMes' => $totalMes,
            'servicosMes' => $top3ServicosMes,
        ]);
    }
}
