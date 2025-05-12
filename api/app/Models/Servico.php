<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servico extends Model
{
    use HasFactory;

    protected $table = 'servicos';
    public $timestamps = true;

    protected $fillable = [
        'nome',
        'tempo',
        'preco',
    ];
}
