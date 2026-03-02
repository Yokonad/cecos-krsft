<?php

use Illuminate\Support\Facades\Route;
use Modulos_ERP\CecosKrsft\Controllers\CecosController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/list', [CecosController::class, 'list'])->name('cecos.list');
    Route::get('/tree', [CecosController::class, 'getTree'])->name('cecos.tree');
    Route::post('/store', [CecosController::class, 'store'])->name('cecos.store');
    Route::post('/store-with-subcuentas', [CecosController::class, 'storeWithSubcuentas'])->name('cecos.store-with-subcuentas');
    Route::get('/{id}', [CecosController::class, 'show'])->name('cecos.show');
    Route::put('/{id}', [CecosController::class, 'update'])->name('cecos.update');
    Route::delete('/{id}', [CecosController::class, 'destroy'])->name('cecos.destroy');
});
