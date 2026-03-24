<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galeria extends Model
{
    protected $table = 'galeria';
    protected $fillable = ['titulo', 'url', 'descripcion', 'orden'];
    public $timestamps = false;
}
