<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emprestimo extends Model
{
    use HasFactory;

    protected $table = 'Emprestimo';
    public $timestamps = true;

    protected $fillable = [
       'id_aluno', 'id_livro', 'estado', 'dt_entrega', 'status'
    ];

    function aluno()
    {
        return $this->belongsTo(Aluno::class, 'id_aluno', 'id');
    }

    function livro()
    {
        return $this->belongsTo(Livro::class, 'id_livro', 'id');
    }
}
