<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

abstract class Controller
{
    protected function getUser()
    {
        $token = request()->header('Authorization');
        if (!$token)
            return null;

        $usuario = User::where('remember_token', $token)->first();
        return $usuario;
    }
}
