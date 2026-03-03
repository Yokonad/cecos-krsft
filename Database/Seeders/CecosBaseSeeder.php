<?php

namespace Modulos_ERP\CecosKrsft\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CecosBaseSeeder extends Seeder
{
    /**
     * Seed the application's database with base CECOs.
     */
    public function run(): void
    {
        $baseCecos = [
            ['codigo' => '0101', 'nombre' => 'MQ'],
            ['codigo' => '0102', 'nombre' => 'MODIFICACIONES'],
            ['codigo' => '0103', 'nombre' => 'KAM'],
            ['codigo' => '0104', 'nombre' => 'GABINETE'],
            ['codigo' => '0105', 'nombre' => 'OTROS CLIENTES'],
            ['codigo' => '0106', 'nombre' => 'RED INTERNA'],
            ['codigo' => '0107', 'nombre' => 'SOLGAS'],
            ['codigo' => '0108', 'nombre' => 'PROYECTOS SUR'],
            ['codigo' => '0109', 'nombre' => 'CEYA'],
        ];

        foreach ($baseCecos as $ceco) {
            // Verificar si ya existe
            $exists = DB::table('cecos')
                ->where('codigo', $ceco['codigo'])
                ->exists();

            if (!$exists) {
                DB::table('cecos')->insert([
                    'codigo' => $ceco['codigo'],
                    'nombre' => $ceco['nombre'],
                    'tipo_cliente' => $ceco['codigo'], // El tipo_cliente es igual al código para los base
                    'nivel' => 0, // Nivel 0 para padres
                    'parent_id' => null,
                    'tipo_subcuenta' => null,
                    'estado' => true,
                    'razon_social' => null,
                    'descripcion' => 'CECO Base - ' . $ceco['nombre'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                $this->command->info("✓ CECO {$ceco['codigo']} - {$ceco['nombre']} creado");
            } else {
                $this->command->warn("⊘ CECO {$ceco['codigo']} ya existe, saltando...");
            }
        }

        $this->command->info("\n✓ Seeders de CECOs base completado");
    }
}
