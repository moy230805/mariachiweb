<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GaleriaController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Galeria', [
            'imagenes' => Galeria::orderBy('orden')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo'      => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:500',
            'orden'       => 'nullable|integer',
            'imagen'      => 'required|file|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $path = $request->file('imagen')->store('galeria', 'public');

        Galeria::create([
            'titulo'      => $request->titulo,
            'descripcion' => $request->descripcion,
            'orden'       => $request->orden ?? 0,
            'url'         => Storage::disk('public')->url($path),
        ]);

        return redirect()->route('admin.galeria.index');
    }

    public function update(Request $request, Galeria $galeria)
    {
        $request->validate([
            'titulo'      => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:500',
            'orden'       => 'nullable|integer',
            'imagen'      => 'nullable|file|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $url = $galeria->url;

        if ($request->hasFile('imagen')) {
            $this->borrarArchivo($galeria->url);
            $path = $request->file('imagen')->store('galeria', 'public');
            $url  = Storage::disk('public')->url($path);
        }

        $galeria->update([
            'titulo'      => $request->titulo,
            'descripcion' => $request->descripcion,
            'orden'       => $request->orden ?? 0,
            'url'         => $url,
        ]);

        return redirect()->route('admin.galeria.index');
    }

    public function destroy(Galeria $galerium)
    {
        $this->borrarArchivo($galerium->url);
        $galerium->delete();
        return redirect()->route('admin.galeria.index');
    }

    private function borrarArchivo(string $url): void
    {
        $path = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));
        Storage::disk('public')->delete($path);
    }
}
