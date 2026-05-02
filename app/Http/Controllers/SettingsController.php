<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings', [
            'heroImage' => Settings::get('hero_image', '/images/imagenFondo.png')
        ]);
    }

    public function updateHero(Request $request)
    {
        $request->validate([
            'imagen' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        $file = $request->file('imagen');
        $name = 'hero_' . time() . '.' . $file->getClientOriginalExtension();

        $file->move(public_path('images'), $name);

        Settings::set('hero_image', '/images/' . $name);

        return back();
    }
}
