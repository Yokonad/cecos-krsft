<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cecos', function (Blueprint $table) {
            // Razón social separada del nombre comercial
            $table->string('razon_social', 255)->nullable()->after('nombre');
            
            // Auditoría de creación
            $table->unsignedBigInteger('created_by_user_id')->nullable()->after('estado');
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('set null');
            
            // Código generado automáticamente (para auditoría)
            $table->boolean('codigo_auto_generado')->default(false)->after('codigo');
            
            // Índice para búsquedas por razón social
            $table->index('razon_social');
        });
    }

    public function down(): void
    {
        Schema::table('cecos', function (Blueprint $table) {
            $table->dropForeign(['created_by_user_id']);
            $table->dropIndex(['razon_social']);
            
            $table->dropColumn(['razon_social', 'created_by_user_id', 'codigo_auto_generado']);
        });
    }
};
