<?php

use App\Http\Controllers\AgendamentoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServicoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;


Route::post('/auth', [AuthController::class, 'login']);
Route::post('/auth/criar', [AuthController::class, 'criar']);

Route::middleware(AuthMiddleware::class)->group(function() {   

    Route::get('/', [AuthController::class, 'index']);    

    Route::prefix('servicos')->name('servicos.')->group(function() {
        Route::get('/', [ServicoController::class, 'index']);
        Route::get('/dados/{id}', [ServicoController::class, 'pegarServico']);

        Route::get('/disponivel', [ServicoController::class, 'horasDisponiveis']);

        Route::post('/criar', [ServicoController::class, 'criar']);
        Route::post('/editar', [ServicoController::class, 'editar']);
        Route::delete('/deletar/{id}', [ServicoController::class, 'deletar']);
    });

    Route::prefix('usuarios')->name('usuarios.')->group(function(){
        Route::get('/', [UsuarioController::class, 'index']);
        Route::get('/dados/{id}', [UsuarioController::class, 'pegarUsuario']);

        Route::delete('/deletar/{id}', [UsuarioController::class, 'deletarUsuario']);
    });

    Route::prefix('agendamentos')->name('agendamento.')->group(function(){
        Route::get('/', [AgendamentoController::class, 'index']);
        Route::post('/criar', [AgendamentoController::class, 'criar']);

        Route::get('/home', [AgendamentoController::class, 'home']);
        Route::get('/relatorios', [AgendamentoController::class, 'relatorios']);
    });
});

