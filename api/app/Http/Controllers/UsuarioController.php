<?php

namespace App\Http\Controllers;

use App\Enums\UserAccess;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuario = $this->getUser();
        if (!$usuario || $usuario->access != UserAccess::USER_ACCESS_ADMINISTRATOR)
            return response()->json("Usuário sem acesso.", Response::HTTP_FORBIDDEN);

        $usuarios = User::where('access', '<>', UserAccess::USER_ACCESS_ADMINISTRATOR)
            ->orderBy('name')
            ->get(['id', 'name']);
        return response()->json($usuarios);
    }

    public function pegarUsuario($id)
    {
        $usuario = $this->getUser();
        if (!$usuario || $usuario->access != UserAccess::USER_ACCESS_ADMINISTRATOR)
            return response()->json("Usuário sem acesso.", Response::HTTP_FORBIDDEN);

        $find = User::find($id, ['id', 'email', 'name', 'access']);
        if (!$find)
            return response()->json("Usuário não encontrado.", Response::HTTP_NOT_FOUND);

        return response()->json($find);
    }

    public function deletarUsuario($id)
    {
        $usuario = $this->getUser();
        if (!$usuario || $usuario->access != UserAccess::USER_ACCESS_ADMINISTRATOR)
            return response()->json("Usuário sem acesso.", Response::HTTP_FORBIDDEN);

        User::where('id', $id)->delete();
        return response()->json();
    }
    
}
