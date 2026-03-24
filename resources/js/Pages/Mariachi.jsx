import React, {useState, useRef, useEffect} from 'react';
import { Head } from '@inertiajs/react';

export default function Mariachi({ canciones, imagenes, videos }) {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [videoActivo, setVideoActivo] = useState(null);
    const audioRef = useRef(null);

    const toEmbedUrl = (url) => {
        try {
            const u = new URL(url);
            let id = null;
            if (u.hostname.includes('youtube.com')) id = u.searchParams.get('v');
            else if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
            return id ? `https://www.youtube.com/embed/${id}` : url;
        } catch {
            return url;
        }
    };

    // Reproducir una canción
    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);

        // Delay para que el audio se cargue
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

    const galleryImages = imagenes || [];
    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    useEffect(() => {
        if (videos?.length > 0) setVideoActivo(videos[0]);
    }, []);
    return (
        <>
            <Head title="Mariachi Real Guadalajara" />
            <div className="min-h-screen bg-white">

                {/*Titulo*/}
                <section className="relative h-screen bg-black">
                    <img
                        src="/images/1.jpg"
                        alt="Mariachi"
                        className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wider">
                                MARIACHI COLOMBIANO GUADALAJARA
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

                {/* Videos */}
                <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20 relative">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* Texto izquierda */}
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

                                {/* Miniaturas de otros videos */}
                                {videos.length > 1 && (
                                    <div className="flex gap-3 mt-8 flex-wrap">
                                        {videos.map((v, i) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setVideoActivo(v)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border ${
                                                    videoActivo?.id === v.id
                                                        ? 'bg-yellow-400 text-black border-yellow-400'
                                                        : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
                                                }`}
                                            >
                                                {i + 1}. {v.titulo}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Video derecha — flotante */}
                            <div className="relative z-50 md:-mt-32">
                                <div className="relative p-2 shadow-2xl shadow-black/60 transform hover:scale-105 transition duration-300 rounded-2xl bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm"
                                     style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))' }}
                                >
                                    <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                                        {videoActivo ? (
                                            <iframe
                                                key={videoActivo.id}
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={toEmbedUrl(videoActivo.url)}
                                                title={videoActivo.titulo}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400 text-sm">
                                                Sin videos disponibles
                                            </div>
                                        )}
                                    </div>
                                    {videoActivo?.titulo && (
                                        <p className="text-center text-sm text-gray-400 mt-2 pb-1">{videoActivo.titulo}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/*Album*/}
                <section className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                            Álbum de nuestro Mariachi
                        </h2>
                        <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
                            Conoce más sobre nuestras presentaciones. Haz clic para ver nuestro álbum completo.
                        </p>
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
                                alt={galleryImages[selectedImage].titulo}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            />
                            <div className="mt-6 text-center">
                                <p className="text-white text-2xl font-bold mb-2">
                                    {galleryImages[selectedImage].titulo}
                                </p>
                                {galleryImages[selectedImage].descripcion && (
                                    <p className="text-gray-300 text-lg mb-2">
                                        {galleryImages[selectedImage].descripcion}
                                    </p>
                                )}
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

                {/*Musica*/}
                <section className="relative bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                <span className="text-sm font-medium text-amber-500/90 tracking-wide">
                                    NUESTRO REPERTORIO
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
                                    Música para Cada Ocasión
                                </span>
                            </h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                Explora nuestro extenso repertorio organizado por tipo de evento.
                                Cada categoría incluye canciones cuidadosamente seleccionadas.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-20">
                            {categories.map((category) => (
                                <div key={category.id} className="group">
                                    <div
                                        onClick={() => toggleCategory(category.id)}
                                        className={`
                                            relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500
                                            ${expandedCategory === category.id
                                                ? 'bg-gradient-to-br from-amber-500/20 via-red-500/10 to-transparent ring-2 ring-amber-500/50 shadow-2xl shadow-amber-500/20'
                                                : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20'
                                            }
                                        `}
                                    >
                                        {/* Contenido de la tarjeta */}
                                        <div className="relative p-8">
                                            <div className="flex items-start justify-between mb-4">
                                                {/* Ícono */}
                                                <div className={`
                                                    w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                                                    transition-all duration-300
                                                    ${expandedCategory === category.id
                                                        ? 'bg-amber-500/20 backdrop-blur-sm scale-110'
                                                        : 'bg-white/5'
                                                    }
                                                `}>
                                                    {category.id === 1 && '👑'}
                                                    {category.id === 2 && '🎂'}
                                                    {category.id === 3 && '❤️'}
                                                    {category.id === 4 && '💔'}
                                                </div>

                                                {/* Contador */}
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                                    <span className="text-xs font-medium text-zinc-400">
                                                        {category.songs.length} canciones
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Título y descripción */}
                                            <h3 className="text-2xl font-bold mb-2 text-white">
                                                {category.name}
                                            </h3>

                                            {/* Indicador de expansión */}
                                            <div className="flex items-center gap-2 text-sm text-zinc-400 mt-4">
                                                <span className="font-medium">
                                                    {expandedCategory === category.id ? 'Ocultar repertorio' : 'Ver repertorio completo'}
                                                </span>
                                                <svg
                                                    className={`w-4 h-4 transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Efecto hover sutil */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                                    </div>

                                    {/* Lista expandida de canciones - Diseño profesional */}
                                    {expandedCategory === category.id && (
                                        <div className="mt-4 animate-fadeIn">
                                            <div className="rounded-2xl bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-sm border border-white/10 p-6 shadow-2xl">
                                                {/* Header del playlist */}
                                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white">
                                                            Lista de reproducción
                                                        </h4>
                                                        <p className="text-sm text-zinc-400">
                                                            {category.songs.length} canciones disponibles
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Lista de canciones */}
                                                <div className="space-y-2">
                                                    {category.songs.map((song, index) => (
                                                        <div key={song.id}>
                                                            {/* Tarjeta de la canción */}
                                                            <div
                                                                onClick={() => playSong(song)}
                                                                className={`
                                                                    group/song flex items-center gap-4 p-4 rounded-xl
                                                                    transition-all duration-300 cursor-pointer
                                                                    ${currentSong?.id === song.id
                                                                        ? 'bg-amber-500/10 border border-amber-500/30'
                                                                        : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                                                                    }
                                                                `}
                                                            >
                                                                {/* Número/Play icon */}
                                                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-zinc-400 group-hover/song:bg-amber-500 group-hover/song:text-white transition-all">
                                                                    {currentSong?.id === song.id && isPlaying ? (
                                                                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                        </svg>
                                                                    ) : (
                                                                        <span className="group-hover/song:hidden">{index + 1}</span>
                                                                    )}
                                                                    {currentSong?.id !== song.id && (
                                                                        <svg className="w-4 h-4 hidden group-hover/song:block" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                </div>

                                                                {/* Info de la canción */}
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className={`text-base font-semibold truncate transition-colors ${
                                                                        currentSong?.id === song.id ? 'text-amber-500' : 'text-white group-hover/song:text-amber-500'
                                                                    }`}>
                                                                        {song.nombre}
                                                                    </h5>
                                                                    <p className="text-sm text-zinc-400 truncate">
                                                                        {song.artista}
                                                                    </p>
                                                                </div>

                                                                {/* Indicador de reproducción */}
                                                                <div className="flex-shrink-0">
                                                                    {currentSong?.id === song.id && isPlaying ? (
                                                                        <div className="flex items-center gap-1">
                                                                            <div className="w-0.5 h-3 bg-amber-500 animate-pulse"></div>
                                                                            <div className="w-0.5 h-4 bg-amber-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                                            <div className="w-0.5 h-3 bg-amber-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-zinc-600 text-sm">
                                                                            {Math.floor(Math.random() * 2) + 3}:
                                                                            {String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {currentSong?.id === song.id && (
                                                                <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-black border border-amber-500/20 animate-fadeIn">
                                                                    <div className="flex flex-col gap-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-xs text-zinc-400 font-mono min-w-[45px] text-right">
                                                                                {formatTime(currentTime)}
                                                                            </span>
                                                                            <div
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleSeek(e);
                                                                                }}
                                                                                className="flex-1 h-1.5 bg-zinc-800 rounded-full cursor-pointer overflow-hidden group/progress relative"
                                                                            >
                                                                                <div
                                                                                    className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all relative"
                                                                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                                                                >
                                                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"></div>
                                                                                </div>
                                                                            </div>

                                                                            <span className="text-xs text-zinc-400 font-mono min-w-[45px]">
                                                                                {formatTime(duration)}
                                                                            </span>
                                                                        </div>

                                                                        {/* Controles de reproducción */}
                                                                        <div className="flex items-center justify-center gap-3">
                                                                            {/* Botón Anterior */}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    previousSong();
                                                                                }}
                                                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group/btn"
                                                                            >
                                                                                <svg className="w-5 h-5 text-zinc-400 group-hover/btn:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                                                                </svg>
                                                                            </button>

                                                                            {/* Botón Play/Pausa principal */}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    togglePlayPause();
                                                                                }}
                                                                                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 transition-all shadow-lg hover:shadow-amber-500/50 hover:scale-110"
                                                                            >
                                                                                {isPlaying ? (
                                                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                ) : (
                                                                                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                )}
                                                                            </button>

                                                                            {/* Botón Siguiente */}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    nextSong();
                                                                                }}
                                                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group/btn"
                                                                            >
                                                                                <svg className="w-5 h-5 text-zinc-400 group-hover/btn:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                                                                                </svg>
                                                                            </button>
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
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10">
                                <h3 className="text-2xl font-bold mb-3 text-white">
                                    ¿Listo para contratar?
                                </h3>
                                <p className="text-zinc-400 mb-6">
                                    Solicita una cotización personalizada y recibe una respuesta en menos de 24 horas.
                                </p>

                                <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 rounded-full font-semibold text-white shadow-lg hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105">
                                    <span>Solicitar Cotización</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Respuesta rápida</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Paquetes personalizables</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
