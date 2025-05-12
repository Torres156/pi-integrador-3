<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

use const App\Helpers\HTTP_BAD_REQUEST;

class AuthController extends Controller
{
    function index(Request $request)
    {
        $token = $request->header('Authorization');
        $usuario = User::where('remember_token', $token)->first();
        return response()->json(['name' => $usuario->name, 'email' => $usuario->email, 'token' => $token, 'access' => $usuario->access]);
    }

    function login(Request $request)
    {
        $request->validate([
            'usuario' => 'required',
            'senha' => 'required',
        ],[
            'usuario.required' => 'O campo Usuário está vazio!',
            'senha.required' => 'O campo Senha está vázio!'
        ]);

        $email = $request->usuario;
        $senha = $request->senha;

        $usuario = User::where('email', $email)->first();
        if (!$usuario)
            return response()->json('Usuário não encontrado!', Response::HTTP_BAD_REQUEST);

        $password = $usuario->password;        
        if (!Hash::check($senha, $password))
            return response()->json('Usuário ou senha inválida!', Response::HTTP_BAD_REQUEST);
            
        $token = Str::random(32);

        $usuario->remember_token = $token;
        $usuario->save();

        return response()->json(['name' => $usuario->name, 'email' => $usuario->email, 'token' => $token, 'access' => $usuario->access]);
    }

    public function criar(Request $request)
    {
        $request->validate([
            'usuario' => 'required',
            'nome' => 'required',
            'senha' => 'required|min:8',            
        ],[
            'usuario.required' => 'O campo E-mail está vazio!',
            'nome.required' => 'O campo Nome está vazio!',
            'senha.required' => 'O campo Senha está vázio!',
            'senha.min' => 'O campo Senha precisa de 8 caracteres.',
        ]);

        if (User::where('email', strtolower($request->usuario))->exists())        
            return response()->json('Este email já está em uso.', Response::HTTP_BAD_REQUEST);

        $password = Hash::make($request->senha);
        $usuario = new User([
            'email' => $request->usuario,
            'name' => $request->nome,
            'password' => $password,
        ]);
        $usuario->save();
        
        return response()->json();
    }
}
