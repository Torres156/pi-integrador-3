<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('agendamentos', function (Blueprint $table) {
            // Primeiro removemos a constraint atual
            $table->dropForeign(['usuario_id']);

            // Depois adicionamos a nova com 'on delete cascade'
            $table->foreign('usuario_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('agendamentos', function (Blueprint $table) {
            // Reverte a alteração, removendo a constraint com 'cascade'
            $table->dropForeign(['usuario_id']);

            // Restaura a foreign key original (sem onDelete)
            $table->foreign('usuario_id')
                ->references('id')->on('users');
        });
    }
};
