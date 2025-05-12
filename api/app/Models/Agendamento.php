<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agendamento extends Model
{
    use HasFactory;

    protected $table = 'agendamentos';
    public $timestamps = true;

    protected $fillable = [
       'usuario_id',
       'servico_id',
       'data',
       'hora',
       'status'
    ];

    public function servico()
    {
        return $this->belongsTo(Servico::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }
}
