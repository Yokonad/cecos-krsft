<?php

namespace Modulos_ERP\CecosKrsft\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Modulos_ERP\CecosKrsft\Models\Ceco;
use Modulos_ERP\CecosKrsft\Services\CecoHierarchyService;

class CecosController extends Controller
{
    protected string $cecosTable = 'cecos';

    public function __construct(private readonly CecoHierarchyService $cecoHierarchyService)
    {
    }

    public function index()
    {
        return Inertia::render('cecoskrsft/Index');
    }

    public function list(Request $request)
    {
        $query = Ceco::query()
            ->leftJoin('projects', 'cecos.id', '=', 'projects.ceco_id')
            ->select('cecos.*', 'projects.id as project_id');

        if ($request->has('search') && $request->search) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('cecos.codigo', 'like', $search)
                    ->orWhere('cecos.nombre', 'like', $search)
                    ->orWhere('cecos.razon_social', 'like', $search);
            });
        }

        if ($request->has('sort_by')) {
            $direction = $request->get('sort_direction', 'asc');
            $query->orderBy('cecos.' . $request->sort_by, $direction);
        } else {
            $query->orderBy('cecos.codigo', 'asc');
        }

        $cecos = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $cecos->items(),
            'pagination' => [
                'total' => $cecos->total(),
                'per_page' => $cecos->perPage(),
                'current_page' => $cecos->currentPage(),
                'last_page' => $cecos->lastPage(),
            ],
        ]);
    }

    /**
     * Obtiene el árbol jerárquico para visualización
     */
    public function getTree()
    {
        return response()->json([
            'success' => true,
            'data' => $this->cecoHierarchyService->getTree(),
        ]);
    }

    /**
     * Crea un cliente con sus 3 subcuentas obligatorias en una transacción
     */
    public function storeWithSubcuentas(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'razon_social' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'tipo_cliente' => 'required|string|max:50',
            'estado' => 'boolean',
        ]);

        try {
            $result = $this->cecoHierarchyService->createWithSubcuentas(
                $validated,
                $request->user()->id ?? null,
            );

            return response()->json([
                'success' => true,
                'message' => 'Cliente y subcuentas creados exitosamente',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el cliente: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Crear CECO simple (sin subcuentas)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:50|unique:' . $this->cecosTable,
            'nombre' => 'required|string|max:255',
            'razon_social' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        $id = DB::table($this->cecosTable)->insertGetId([
            'codigo' => $validated['codigo'],
            'codigo_auto_generado' => false,
            'nombre' => $validated['nombre'],
            'razon_social' => $validated['razon_social'] ?? null,
            'descripcion' => $validated['descripcion'] ?? null,
            'estado' => $validated['estado'] ?? true,
            'created_by_user_id' => $request->user()->id ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Centro de costo creado exitosamente',
            'data' => DB::table($this->cecosTable)->find($id),
        ]);
    }

    /**
     * Actualizar CECO
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:50|unique:' . $this->cecosTable . ',codigo,' . $id,
            'nombre' => 'required|string|max:255',
            'razon_social' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        DB::table($this->cecosTable)->where('id', $id)->update([
            'codigo' => $validated['codigo'],
            'nombre' => $validated['nombre'],
            'razon_social' => $validated['razon_social'] ?? null,
            'descripcion' => $validated['descripcion'] ?? null,
            'estado' => $validated['estado'] ?? true,
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Centro de costo actualizado exitosamente',
            'data' => DB::table($this->cecosTable)->find($id),
        ]);
    }

    /**
     * Eliminar CECO (con validaciones)
     */
    public function destroy($id)
    {
        $ceco = Ceco::find($id);

        if (!$ceco) {
            return response()->json([
                'success' => false,
                'message' => 'Centro de costo no encontrado',
            ], 404);
        }

        // No permitir eliminar subcuentas individuales
        if ($ceco->isSubcuenta()) {
            return response()->json([
                'success' => false,
                'message' => 'No se pueden eliminar subcuentas generadas del sistema',
            ], 422);
        }

        DB::transaction(function () use ($ceco) {
            // Si es cabeza, eliminar primero subcuentas y luego la cabeza
            if ($ceco->children()->exists()) {
                $ceco->children()->delete();
            }
            $ceco->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Cabeza de CECO y subcuentas eliminadas exitosamente',
        ]);
    }

    /**
     * Mostrar un CECO específico
     */
    public function show($id)
    {
        $ceco = Ceco::find($id);

        if (!$ceco) {
            return response()->json([
                'success' => false,
                'message' => 'Centro de costo no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ceco
        ]);
    }
}
