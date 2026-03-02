<?php

namespace Modulos_ERP\CecosKrsft\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ceco extends Model
{
    protected $table = 'cecos';

    protected $fillable = [
        'codigo',
        'nombre',
        'razon_social',
        'descripcion',
        'estado',
        'parent_id',
        'tipo_cliente',
        'nivel',
        'tipo_subcuenta',
        'created_by_user_id',
        'codigo_auto_generado',
    ];

    protected $casts = [
        'estado' => 'boolean',
        'parent_id' => 'integer',
        'nivel' => 'integer',
        'created_by_user_id' => 'integer',
        'codigo_auto_generado' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con el padre jerárquico
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Ceco::class, 'parent_id');
    }

    /**
     * Relación con el usuario que creó el CECO
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by_user_id');
    }

    /**
     * Relación con los hijos jerárquicos
     */
    public function children(): HasMany
    {
        return $this->hasMany(Ceco::class, 'parent_id')->orderBy('codigo', 'asc');
    }

    /**
     * Obtiene todos los hijos recursivamente
     */
    public function allDescendants()
    {
        return $this->children()->with('allDescendants');
    }

    /**
     * Obtiene el camino jerárquico hasta la raíz
     */
    public function getAncestorPath()
    {
        $path = [$this];
        $current = $this;
        
        while ($current->parent_id) {
            $current = $current->parent;
            $path[] = $current;
        }
        
        return array_reverse($path);
    }

    /**
     * Verifica si es un cliente de la categoría 0105 (Otros Clientes)
     */
    public function isOtrosClientes(): bool
    {
        return $this->tipo_cliente === '0105';
    }

    /**
     * Verifica si es un cliente de la categoría 0106 (Red Interna)
     */
    public function isRedInterna(): bool
    {
        return $this->tipo_cliente === '0106';
    }

    /**
     * Verifica si es una subcuenta generada
     */
    public function isSubcuenta(): bool
    {
        return !is_null($this->tipo_subcuenta);
    }

    /**
     * Obtiene el nombre del tipo de subcuenta
     */
    public function getSubcuentaNombre(): ?string
    {
        return match($this->tipo_subcuenta) {
            '01' => 'MO (Mano de Obra)',
            '02' => 'Gastos Directos',
            '03' => 'Gastos Indirectos',
            default => null,
        };
    }
}

