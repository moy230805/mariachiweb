<?php

use App\Http\Controllers\Admin\CancionController;
use App\Http\Controllers\Admin\GaleriaController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
// Importar modelos
use App\Models\Cancion;
use App\Models\Galeria;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/', [\App\Http\Controllers\PrincipalController::class, 'index'])->name('home');

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    Route::resource('canciones', CancionController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('galeria', GaleriaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('videos', VideoController::class)->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__.'/auth.php';
