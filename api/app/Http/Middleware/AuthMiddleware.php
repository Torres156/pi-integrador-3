<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {    
        $token = $request->header('Authorization');        
        if (!$token)
            return response('Not Authorizated!', 401);

        $usuario = User::where('remember_token', $token)->first();
        
        if (!$usuario || $token !== $usuario->remember_token)
            return response('Not Authorizated!', 401);
        
        return $next($request);
    }
}
