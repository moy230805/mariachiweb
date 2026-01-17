<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galeria extends Model
{
    protected $table = 'galeria';
    protected $fillable = ['id', 'titulo', 'url', 'orden'];
    public $timestamps = false;
}
