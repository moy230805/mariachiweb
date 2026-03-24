<?php

namespace App\Http\Controllers;

use App\Models\Cancion;
use App\Models\Galeria;
use App\Models\Video;
use Inertia\Inertia;

class PrincipalController extends Controller
{
    //
    public function index()
    {
        $canciones = Cancion::all();
        $imagenes  = Galeria::orderBy('orden')->get();
        $videos    = Video::orderBy('orden')->get();
        return Inertia::render('Mariachi', compact('canciones', 'imagenes', 'videos'));
    }
}
