<?php

namespace Modulos_ERP\Cecos\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CecosController extends Controller
{
    protected string $cecosTable = 'cecos';

    public function index()
    {
        return Inertia::render('cecoskrsft/Index');
    }

    public function list(Request $request)
    {
        $query = DB::table($this->cecosTable);

        if ($request->has('search') && $request->search) {
            $search = '%' . $request->search . '%';
            $query->where('codigo', 'like', $search)
                  ->orWhere('nombre', 'like', $search);
        }

        if ($request->has('sort_by')) {
            $direction = $request->get('sort_direction', 'asc');
            $query->orderBy($request->sort_by, $direction);
        } else {
            $query->orderBy('codigo', 'asc');
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:50|unique:' . $this->cecosTable,
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        $id = DB::table($this->cecosTable)->insertGetId([
            'codigo' => $validated['codigo'],
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
            'estado' => $validated['estado'] ?? true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Centro de costo creado exitosamente',
            'data' => DB::table($this->cecosTable)->find($id),
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'codigo' => 'required|string|max:50|unique:' . $this->cecosTable . ',codigo,' . $id,
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        DB::table($this->cecosTable)->where('id', $id)->update([
            'codigo' => $validated['codigo'],
            'nombre' => $validated['nombre'],
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

    public function destroy($id)
    {
        DB::table($this->cecosTable)->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Centro de costo eliminado exitosamente',
        ]);
    }

    public function show($id)
    {
        $ceco = DB::table($this->cecosTable)->find($id);

        if (!$ceco) {
            return response()->json(['success' => false, 'message' => 'Centro de costo no encontrado'], 404);
        }

        return response()->json(['success' => true, 'data' => $ceco]);
    }
}
