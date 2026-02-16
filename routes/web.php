<?php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// Importar modelos
use App\Models\Cancion;
use App\Models\Galeria;
Route::get('/', function () {
    // Obtener canciones de la BD
    $canciones = Cancion::all();
    // Obtener  imágenes de la BD ordenadas
    $imagenes = Galeria::orderBy('orden', 'asc')->get();
    // Enviarlas a React
    return Inertia::render('Mariachi', [
        'canciones' => $canciones,
        'imagenes' => $imagenes  
    ]);
});
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';