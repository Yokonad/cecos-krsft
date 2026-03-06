<?php

namespace Modulos_ERP\CecosKrsft\Services;

use Illuminate\Support\Facades\DB;
use Modulos_ERP\CecosKrsft\Models\Ceco;

class CecoHierarchyService
{
    private const GRUPOS_VALIDOS = ['0101', '0102', '0103', '0104', '0105', '0106', '0107', '108', '109'];

    private const SUBCUENTAS = [
        ['tipo' => '01', 'nombre_suffix' => 'MO (Mano de Obra)'],
        ['tipo' => '02', 'nombre_suffix' => 'Gastos Directos'],
        ['tipo' => '03', 'nombre_suffix' => 'Gastos Indirectos'],
    ];

    public function getTree(): array
    {
        $rootClients = Ceco::whereNull('parent_id')
            ->where('nivel', 1)
            ->orderBy('codigo', 'asc')
            ->get();

        return $rootClients
            ->map(fn (Ceco $client) => $this->buildTreeNode($client))
            ->toArray();
    }

    public function createWithSubcuentas(array $validated, ?int $userId = null): array
    {
        return DB::transaction(function () use ($validated, $userId) {
            $codigo = $this->getNextConsecutiveCode($validated['tipo_cliente']);

            $existingCeco = Ceco::where('codigo', $codigo)->first();
            if ($existingCeco) {
                throw new \Exception(
                    "El código {$codigo} ya existe (ID: {$existingCeco->id}, Estado: " .
                    ($existingCeco->estado ? 'Activo' : 'Inactivo') .
                    '). No se puede crear el cliente.'
                );
            }

            $clientePadre = Ceco::create([
                'codigo' => $codigo,
                'codigo_auto_generado' => true,
                'nombre' => $validated['nombre'],
                'razon_social' => $validated['razon_social'] ?? null,
                'descripcion' => $validated['descripcion'] ?? null,
                'estado' => $validated['estado'] ?? true,
                'tipo_cliente' => $validated['tipo_cliente'],
                'nivel' => 1,
                'parent_id' => null,
                'tipo_subcuenta' => null,
                'created_by_user_id' => $userId,
            ]);

            $subcuentasCreadas = [];
            foreach (self::SUBCUENTAS as $subcuenta) {
                $codigoSubcuenta = $codigo . $subcuenta['tipo'];

                if (Ceco::where('codigo', $codigoSubcuenta)->exists()) {
                    throw new \Exception("La subcuenta {$codigoSubcuenta} ya existe.");
                }

                $subcuentasCreadas[] = Ceco::create([
                    'codigo' => $codigoSubcuenta,
                    'codigo_auto_generado' => true,
                    'nombre' => $clientePadre->nombre . ' - ' . $subcuenta['nombre_suffix'],
                    'razon_social' => $clientePadre->razon_social,
                    'descripcion' => $subcuenta['nombre_suffix'],
                    'estado' => $validated['estado'] ?? true,
                    'tipo_cliente' => $validated['tipo_cliente'],
                    'nivel' => 2,
                    'parent_id' => $clientePadre->id,
                    'tipo_subcuenta' => $subcuenta['tipo'],
                    'created_by_user_id' => $userId,
                ]);
            }

            $this->validateHierarchyIntegrity($clientePadre);

            return [
                'cliente' => $clientePadre->load('children', 'createdBy'),
                'subcuentas' => $subcuentasCreadas,
                'codigo_generado' => $codigo,
            ];
        });
    }

    private function getNextConsecutiveCode(string $tipoCliente): string
    {
        $isBaseGroup = in_array($tipoCliente, self::GRUPOS_VALIDOS, true);
        $isCustomParent = Ceco::where('codigo', $tipoCliente)
            ->where('nivel', 1)
            ->whereNull('parent_id')
            ->whereNull('tipo_subcuenta')
            ->exists();

        if (!$isBaseGroup && !$isCustomParent) {
            throw new \Exception("Grupo no válido: {$tipoCliente}. Debe ser 0101-0109 o un CECO padre existente");
        }

        // La secuencia se calcula por prefijo de código del grupo (ej: 0101xx, 0102xx)
        // para respetar la lógica histórica de codificación.
        $lastParent = Ceco::where('codigo', 'like', $tipoCliente . '__')
            ->where('nivel', 1)
            ->whereNull('parent_id')
            ->orderBy('codigo', 'desc')
            ->first();

        if (!$lastParent) {
            return $tipoCliente . '01';
        }

        $lastCode = $lastParent->codigo;
        $lastNumber = (int) substr($lastCode, -2);
        $nextNumber = $lastNumber + 1;

        if ($nextNumber > 99) {
            throw new \Exception("No se pueden crear más clientes en el grupo {$tipoCliente}. Límite de 99 alcanzado.");
        }

        $newCode = $tipoCliente . str_pad((string) $nextNumber, 2, '0', STR_PAD_LEFT);

        if (Ceco::where('codigo', $newCode)->exists()) {
            throw new \Exception("El código {$newCode} ya existe en la base de datos. No se puede reutilizar.");
        }

        return $newCode;
    }

    private function validateHierarchyIntegrity(Ceco $cliente): void
    {
        $children = $cliente->children()->get();

        if ($children->count() !== 3) {
            throw new \Exception('El cliente debe tener exactamente 3 subcuentas. Se encontraron: ' . $children->count());
        }

        $tiposSubcuentas = $children
            ->pluck('tipo_subcuenta')
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        if ($tiposSubcuentas !== ['01', '02', '03']) {
            throw new \Exception('Las subcuentas deben tener tipos 01, 02, 03. Se encontraron: ' . implode(',', $tiposSubcuentas));
        }

        $nodosRama = collect([$cliente])->merge($children);

        $codigosEnRama = $nodosRama->pluck('codigo')->unique();
        if ($codigosEnRama->count() !== 4) {
            throw new \Exception('Se detectaron códigos duplicados en la estructura');
        }

        $tiposEnRama = $nodosRama->pluck('tipo_cliente')->unique();
        if ($tiposEnRama->count() !== 1) {
            throw new \Exception('El tipo de cliente debe ser consistente en toda la rama');
        }
    }

    private function buildTreeNode(Ceco $ceco): array
    {
        $children = $ceco->children()->orderBy('codigo', 'asc')->get();

        return [
            'id' => $ceco->id,
            'codigo' => $ceco->codigo,
            'nombre' => $ceco->nombre,
            'descripcion' => $ceco->descripcion,
            'estado' => $ceco->estado,
            'tipo_cliente' => $ceco->tipo_cliente,
            'nivel' => $ceco->nivel,
            'tipo_subcuenta' => $ceco->tipo_subcuenta,
            'parent_id' => $ceco->parent_id,
            'children' => $children->map(fn (Ceco $child) => $this->buildTreeNode($child))->toArray(),
        ];
    }
}
