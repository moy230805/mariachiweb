<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $table = 'video';
    protected $fillable = ['titulo', 'descripcion', 'url', 'orden'];
    public $timestamps = false;
}
