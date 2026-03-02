<?php

use Illuminate\Support\Facades\Route;
use Modulos_ERP\CecosKrsft\Controllers\CecosController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [CecosController::class, 'index'])->name('cecos.index');
});
