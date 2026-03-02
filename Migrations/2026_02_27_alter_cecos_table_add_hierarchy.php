<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cecos', function (Blueprint $table) {
            // Relación jerárquica
            $table->unsignedBigInteger('parent_id')->nullable()->after('id');
            $table->foreign('parent_id')->references('id')->on('cecos')->onDelete('restrict');
            
            // Tipo de cliente: '0105' = Otros Clientes, '0106' = Red Interna
            $table->string('tipo_cliente', 4)->nullable()->after('parent_id');
            
            // Nivel en la jerarquía (0 = raíz, 1 = padre principal, 2 = cliente, 3 = subcuenta)
            $table->unsignedSmallInteger('nivel')->default(0)->after('tipo_cliente');
            
            // Tipo de subcuenta generada: null = no es subcuenta, '01' = MO, '02' = Gastos Directos, '03' = Gastos Indirectos
            $table->string('tipo_subcuenta', 2)->nullable()->after('nivel');
            
            // Índices para búsquedas jerárquicas
            $table->index('parent_id');
            $table->index('tipo_cliente');
            $table->index(['parent_id', 'tipo_subcuenta']);
        });
    }

    public function down(): void
    {
        Schema::table('cecos', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id']);
            $table->dropIndex(['tipo_cliente']);
            $table->dropIndex(['parent_id', 'tipo_subcuenta']);
            
            $table->dropColumn(['parent_id', 'tipo_cliente', 'nivel', 'tipo_subcuenta']);
        });
    }
};
