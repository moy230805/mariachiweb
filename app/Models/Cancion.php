<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cancion extends Model
{
    protected $table = 'cancion';
    protected $fillable = ['nombre', 'artista', 'categoria', 'url', 'tipo_url', 'emoji'];
    public $timestamps = false;
}
