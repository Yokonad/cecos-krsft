<?php

namespace Modulos_ERP\Cecos\Models;

use Illuminate\Database\Eloquent\Model;

class Ceco extends Model
{
    protected $table = 'cecos';

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'estado',
    ];

    protected $casts = [
        'estado' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
