<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cancion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CancionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Canciones', [
            'canciones' => Cancion::orderBy('categoria')->orderBy('nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'   => 'required|string|max:255',
            'artista'  => 'required|string|max:255',
            'categoria'=> 'required|string|max:255',
            'tipo_url' => 'required|in:link,archivo',
            'url'      => 'required_if:tipo_url,link|nullable|url',
            'archivo'  => 'required_if:tipo_url,archivo|nullable|file|mimes:mp3,wav,ogg,m4a|max:51200',
        ]);

        $url = $request->url;

        if ($request->tipo_url === 'archivo' && $request->hasFile('archivo')) {
            $path = $request->file('archivo')->store('canciones', 'public');
            $url  = Storage::disk('public')->url($path);
        }

        Cancion::create([...$request->only('nombre', 'artista', 'categoria', 'tipo_url'), 'url' => $url]);

        return redirect()->route('admin.canciones.index');
    }

    public function update(Request $request, Cancion $cancion)
    {
        $request->validate([
            'nombre'   => 'required|string|max:255',
            'artista'  => 'required|string|max:255',
            'categoria'=> 'required|string|max:255',
            'tipo_url' => 'required|in:link,archivo',
            'url'      => 'required_if:tipo_url,link|nullable|url',
            'archivo'  => 'nullable|file|mimes:mp3,wav,ogg,m4a|max:51200',
        ]);

        $url = $cancion->url;

        if ($request->tipo_url === 'link') {
            if ($cancion->tipo_url === 'archivo') $this->borrarArchivo($cancion->url);
            $url = $request->url;
        } elseif ($request->hasFile('archivo')) {
            if ($cancion->tipo_url === 'archivo') $this->borrarArchivo($cancion->url);
            $path = $request->file('archivo')->store('canciones', 'public');
            $url  = Storage::disk('public')->url($path);
        }

        $cancion->update([...$request->only('nombre', 'artista', 'categoria', 'tipo_url'), 'url' => $url]);

        return redirect()->route('admin.canciones.index');
    }

    public function destroy(Cancion $cancion)
    {
        if ($cancion->tipo_url === 'archivo') $this->borrarArchivo($cancion->url);
        $cancion->delete();
        return redirect()->route('admin.canciones.index');
    }

    private function borrarArchivo(string $url): void
    {
        $path = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));
        Storage::disk('public')->delete($path);
    }
}
