import React, { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Mariachi({ canciones, imagenes }) {
    console.log('Canciones desde la BD:', canciones);
    console.log('Imágenes desde la BD:', imagenes);

    // ============================================
    // ESTADOS DEL COMPONENTE
    // ============================================
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    
    // Referencia al elemento de audio
    const audioRef = useRef(null);

    // ============================================
    // FUNCIONES DEL REPRODUCTOR
    // ============================================
    
    // Reproducir una canción
    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        
        // Pequeño delay para que el audio se cargue
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
            }
        }, 100);
    };

    // Pausar/reanudar la reproducción
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    // Ir a la canción anterior
    const previousSong = () => {
        if (!currentSong) return;
        
        // Encontrar todas las canciones en orden
        const allSongs = categories.flatMap(cat => cat.songs);
        const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
        
        if (currentIndex > 0) {
            playSong(allSongs[currentIndex - 1]);
        } else {
            // Si es la primera, ir a la última
            playSong(allSongs[allSongs.length - 1]);
        }
    };

    // Ir a la siguiente canción
    const nextSong = () => {
        if (!currentSong) return;
        
        const allSongs = categories.flatMap(cat => cat.songs);
        const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
        
        if (currentIndex < allSongs.length - 1) {
            playSong(allSongs[currentIndex + 1]);
        } else {
            // Si es la última, ir a la primera
            playSong(allSongs[0]);
        }
    };

    // Actualizar tiempo actual mientras reproduce
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    // Cuando se carga la metadata del audio
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // Cuando termina la canción, pasar a la siguiente
    const handleEnded = () => {
        setIsPlaying(false);
        nextSong();
    };

    // Formatear tiempo en formato mm:ss
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Cambiar posición de la canción
    const handleSeek = (e) => {
        const progressBar = e.currentTarget;
        const clickPosition = e.nativeEvent.offsetX;
        const width = progressBar.offsetWidth;
        const newTime = (clickPosition / width) * duration;
        
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    // ============================================
    // ORGANIZAR CANCIONES POR CATEGORÍA
    // ============================================
    const categories = [];
    const categoriesMap = {};
    
    canciones.forEach((cancion) => {
        if (!categoriesMap[cancion.categoria]) {
            categoriesMap[cancion.categoria] = {
                id: Object.keys(categoriesMap).length + 1,
                name: cancion.categoria,
                songs: []
            };
        }
        categoriesMap[cancion.categoria].songs.push(cancion);
    });
    
    Object.values(categoriesMap).forEach(cat => {
        categories.push(cat);
    });
    
    console.log('Categorías organizadas:', categories);

    // ============================================
    // FUNCIONES DE LA GALERÍA
    // ============================================
    
    // Ya NO necesitamos esto porque las imágenes vienen de la BD
    // Las imágenes ahora vienen como prop desde Laravel
    const galleryImages = imagenes || []; // Si no hay imágenes, array vacío

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    return (
        <>
            <Head title="Mariachi Real Guadalajara" />
            
            <div className="min-h-screen bg-white">
                {/* ============================================ */}
                {/* SECCIÓN HERO */}
                {/* ============================================ */}
                <section className="relative h-screen bg-black">
                    <img 
                        src="/images/1.jpg" 
                        alt="Mariachi"
                        className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wider">
                                MARIACHI REAL GUADALAJARA
                            </h1>
                            <p className="text-xl md:text-2xl mb-2">
                                Nos distinguimos por ser los mejores
                            </p>
                            <p className="text-lg md:text-xl">
                                mariachis en Guadalajara
                            </p>
                            <p className="mt-6 text-2xl md:text-3xl">
                                Llámanos: +52 33 1234 5678
                            </p>
                        </div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* SECCIÓN DE VIDEO PRINCIPAL */}
                {/* ============================================ */}
                <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20 relative">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            <div className="pt-12">
                                <h2 className="text-4xl font-bold mb-6">
                                    Videos de nuestro mariachi
                                </h2>
                                <p className="text-2xl text-yellow-400 mb-6 font-semibold">
                                    Uno de los mejores mariachis de Guadalajara
                                </p>
                                <p className="text-gray-300 mb-4 leading-relaxed">
                                    Mira nuestras presentaciones en vivo y descubre por qué somos el mariachi 
                                    preferido de Guadalajara. Con años de experiencia y un repertorio extenso, 
                                    llevamos alegría y música tradicional a cada evento.
                                </p>
                                <p className="text-gray-300 mb-6">
                                    Nuestro compromiso es hacer de tu celebración un momento inolvidable, 
                                    con profesionalismo y la mejor calidad musical.
                                </p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition">
                                    Comparar planes y precios →
                                </button>
                            </div>
                            
                            {/* Video flotante con efecto elevado */}
                            <div className="relative md:-mt-32">
                                <div className="p-2 shadow-2xl transform hover:scale-105 transition duration-300">
                                    <div className="relative rounded-xl overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            width="560" 
                                            height="315" 
                                            src="/video/v1.mp4" 
                                            title="YouTube video player" 
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            referrerPolicy="strict-origin-when-cross-origin" 
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* SECCIÓN DE GALERÍA DE FOTOS */}
                {/* ============================================ */}
                <section className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                            Álbum de nuestro Mariachi
                        </h2>
                        <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
                            Conoce más sobre nuestras presentaciones. Haz clic para ver nuestro álbum completo.
                        </p>
                        
                        {/* Preview de 3 imágenes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                            {galleryImages.slice(0, 3).map((imagen) => (
                                <div
                                    key={imagen.id}
                                    onClick={() => setShowAlbumModal(true)}
                                    className="relative cursor-pointer group overflow-hidden rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                                >
                                    <img
                                        src={imagen.url}
                                        alt={imagen.titulo}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <div>
                                            <p className="text-white font-semibold text-sm">{imagen.titulo}</p>
                                            {imagen.descripcion && (
                                                <p className="text-gray-300 text-xs mt-1">{imagen.descripcion}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <button 
                                onClick={() => setShowAlbumModal(true)}
                                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 transition"
                            >
                                Ver álbum completo →
                            </button>
                        </div>
                    </div>
                </section>

                {/* Modal de Álbum Completo */}
                {showAlbumModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto">
                        <div className="min-h-screen p-8">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-4xl font-bold text-white">Álbum Completo</h2>
                                    <button
                                        onClick={() => setShowAlbumModal(false)}
                                        className="text-white hover:text-gray-300 transition bg-red-600 hover:bg-red-700 p-3 rounded-full"
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                {/* Grid de todas las imágenes */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {galleryImages.map((imagen, index) => (
                                        <div
                                            key={imagen.id}
                                            onClick={() => {
                                                setShowAlbumModal(false);
                                                setSelectedImage(index);
                                            }}
                                            className="relative cursor-pointer group overflow-hidden rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                                        >
                                            <img
                                                src={imagen.url}
                                                alt={imagen.titulo}
                                                className="w-full h-64 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <div>
                                                    <p className="text-white font-semibold text-sm">{imagen.titulo}</p>
                                                    {imagen.descripcion && (
                                                        <p className="text-gray-300 text-xs mt-1">{imagen.descripcion}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Imagen Individual (Lightbox) */}
                {selectedImage !== null && (
                    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 text-white hover:text-gray-300 transition bg-black bg-opacity-50 p-2 rounded-full"
                        >
                            ✕
                        </button>
                        
                        <button
                            onClick={() => setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                            className="absolute left-6 text-white hover:text-gray-300 transition bg-black bg-opacity-50 p-2 rounded-full text-3xl"
                        >
                            ←
                        </button>
                        
                        <div className="max-w-6xl max-h-full flex flex-col items-center">
                            <img
                                src={galleryImages[selectedImage].url}
                                alt={galleryImages[selectedImage].title}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            />
                            <div className="mt-6 text-center">
                                <p className="text-white text-2xl font-bold mb-2">
                                    {galleryImages[selectedImage].title}
                                </p>
                                <p className="text-gray-400 text-lg">
                                    {selectedImage + 1} / {galleryImages.length}
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setSelectedImage((prev) => (prev + 1) % galleryImages.length)}
                            className="absolute right-6 text-white hover:text-gray-300 transition bg-black bg-opacity-50 p-2 rounded-full text-3xl"
                        >
                            →
                        </button>
                    </div>
                )}

                {/* ============================================ */}
                {/* SECCIÓN DE REPERTORIO Y EVENTOS */}
                {/* ============================================ */}
                <section className="relative bg-black text-white py-32 overflow-hidden">
                    {/* Fondo decorativo */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500 rounded-full filter blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        {/* Header */}
                        <div className="text-center mb-20">
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full text-sm font-semibold mb-4">
                                🎵 NUESTRO REPERTORIO
                            </span>
                            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                                Música para Cada Ocasión
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                Selecciona el tipo de evento y descubre nuestras canciones especiales
                            </p>
                        </div>
                        
                        {/* Grid de categorías */}
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-32">
                            {categories.map((category) => (
                                <div key={category.id} className="group">
                                    {/* Tarjeta de categoría */}
                                    <div 
                                        onClick={() => toggleCategory(category.id)}
                                        className={`
                                            relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300
                                            ${expandedCategory === category.id 
                                                ? 'bg-gradient-to-br from-yellow-500 via-red-500 to-pink-500 scale-105 shadow-2xl shadow-yellow-500/50' 
                                                : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:scale-105 hover:shadow-xl'
                                            }
                                        `}
                                    >
                                        {/* Brillo animado */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
                                        
                                        {/* Contenido de la tarjeta */}
                                        <div className="relative p-8">
                                            {/* Ícono decorativo */}
                                            <div className={`
                                                w-20 h-20 mb-4 rounded-xl flex items-center justify-center text-4xl
                                                ${expandedCategory === category.id 
                                                    ? 'bg-white/20 backdrop-blur-sm' 
                                                    : 'bg-gradient-to-br from-yellow-500/20 to-red-500/20'
                                                }
                                            `}>
                                                {category.id === 1 && '👑'}
                                                {category.id === 2 && '🎂'}
                                                {category.id === 3 && '❤️'}
                                                {category.id === 4 && '💔'}
                                            </div>
                                            
                                            {/* Título */}
                                            <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                                            <p className="text-base opacity-90 mb-4">
                                                {category.songs.length} canciones disponibles
                                            </p>
                                            
                                            {/* Indicador */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold uppercase tracking-wider">
                                                    {expandedCategory === category.id ? 'Ocultar canciones' : 'Ver canciones'}
                                                </span>
                                                <span className="text-2xl">
                                                    {expandedCategory === category.id ? '▲' : '▼'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lista expandida de canciones */}
                                    {expandedCategory === category.id && (
                                        <div className="mt-6 animate-fadeIn">
                                            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-2xl border-2 border-yellow-500/50">
                                                <h4 className="text-yellow-400 font-bold mb-6 text-xl flex items-center gap-2">
                                                    <span className="text-2xl">♪</span> Canciones incluidas
                                                </h4>
                                                <div className="space-y-3">
                                                    {category.songs.map((song, index) => (
                                                        <div key={song.id}>
                                                            {/* Tarjeta de la canción */}
                                                            <div 
                                                                onClick={() => playSong(song)}
                                                                className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-red-500/20 transition-all duration-300 cursor-pointer border border-transparent hover:border-yellow-500/30"
                                                            >
                                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-red-500 flex items-center justify-center text-sm font-bold shadow-lg">
                                                                    {index + 1}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <span className="text-white text-lg group-hover:text-yellow-400 transition-colors block">
                                                                        {song.nombre}
                                                                    </span>
                                                                    <span className="text-gray-400 text-sm">
                                                                        {song.artista}
                                                                    </span>
                                                                </div>
                                                                <div className="transition-opacity">
                                                                    {currentSong?.id === song.id && isPlaying ? (
                                                                        <span className="text-green-400 text-xl animate-pulse">♪</span>
                                                                    ) : (
                                                                        <span className="text-yellow-400 text-xl opacity-0 group-hover:opacity-100">▶</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* REPRODUCTOR INLINE - Solo aparece si esta canción está seleccionada */}
                                                            {currentSong?.id === song.id && (
                                                                <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-yellow-500/50 animate-fadeIn">
                                                                    <div className="flex items-center gap-4">
                                                                        {/* Controles de reproducción */}
                                                                        <div className="flex items-center gap-3">
                                                                            {/* Botón Anterior */}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    previousSong();
                                                                                }}
                                                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                                                                            >
                                                                                <span className="text-lg">⏮</span>
                                                                            </button>

                                                                            {/* Botón Play/Pausa */}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    togglePlayPause();
                                                                                }}
                                                                                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 transition shadow-lg"
                                                                            >
                                                                                <span className="text-xl">
                                                                                    {isPlaying ? '⏸' : '▶'}
                                                                                </span>
                                                                            </button>

                                                                            {/* Botón Siguiente */}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    nextSong();
                                                                                }}
                                                                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                                                                            >
                                                                                <span className="text-lg">⏭</span>
                                                                            </button>
                                                                        </div>

                                                                        {/* Barra de progreso y tiempo */}
                                                                        <div className="flex-1 flex items-center gap-3">
                                                                            <span className="text-xs text-gray-400 min-w-[40px] text-right">
                                                                                {formatTime(currentTime)}
                                                                            </span>
                                                                            
                                                                            {/* Barra de progreso */}
                                                                            <div
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleSeek(e);
                                                                                }}
                                                                                className="flex-1 h-2 bg-gray-700 rounded-full cursor-pointer overflow-hidden group relative"
                                                                            >
                                                                                <div
                                                                                    className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all"
                                                                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                                                                ></div>
                                                                            </div>
                                                                            
                                                                            <span className="text-xs text-gray-400 min-w-[40px]">
                                                                                {formatTime(duration)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                            <button className="group relative inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 rounded-full text-xl font-bold text-white shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110">
                                <span>Solicita tu Cotización</span>
                                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                                
                                {/* Efecto de brillo */}
                                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </button>
                            <p className="mt-6 text-gray-400 text-lg">
                                ⚡ Respuesta en menos de 24 horas • 🎼 Paquetes personalizables
                            </p>
                        </div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* FOOTER */}
                {/* ============================================ */}
                <footer className="bg-black text-white py-12 border-t border-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-yellow-400">
                                    MARIACHI REAL GUADALAJARA
                                </h3>
                                <p className="text-gray-400">Los mejores mariachis de Guadalajara</p>
                            </div>
                            
                            <div>
                                <h4 className="font-bold mb-4 text-lg">Contacto</h4>
                                <div className="space-y-3 text-gray-400">
                                    <p>📞 +52 33 1234 5678</p>
                                    <p>📧 contacto@mariachiguadalajara.com</p>
                                    <p>📍 Guadalajara, Jalisco, México</p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-bold mb-4 text-lg">Síguenos</h4>
                                <div className="flex gap-4">
                                    <button className="bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center transition">
                                        F
                                    </button>
                                    <button className="bg-pink-600 hover:bg-pink-700 w-12 h-12 rounded-full flex items-center justify-center transition">
                                        IG
                                    </button>
                                    <button className="bg-red-600 hover:bg-red-700 w-12 h-12 rounded-full flex items-center justify-center transition">
                                        YT
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                            <p>&copy; 2026 Mariachi Real Guadalajara. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </footer>

                {/* Elemento de audio (oculto) */}
                <audio
                    ref={audioRef}
                    src={currentSong?.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>

            {/* Estilos CSS personalizados */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}