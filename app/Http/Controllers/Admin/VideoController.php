<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Videos', [
            'videos' => Video::orderBy('orden')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo'      => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:500',
            'url'         => 'required|url',
            'orden'       => 'nullable|integer',
        ]);

        Video::create([...$request->only('titulo', 'descripcion', 'url'), 'orden' => $request->orden ?? 0]);

        return redirect()->route('admin.videos.index');
    }

    public function update(Request $request, Video $video)
    {
        $request->validate([
            'titulo'      => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:500',
            'url'         => 'required|url',
            'orden'       => 'nullable|integer',
        ]);

        $video->update([...$request->only('titulo', 'descripcion', 'url'), 'orden' => $request->orden ?? 0]);

        return redirect()->route('admin.videos.index');
    }

    public function destroy(Video $video)
    {
        $video->delete();
        return redirect()->route('admin.videos.index');
    }
}
