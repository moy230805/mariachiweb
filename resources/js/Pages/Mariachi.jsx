import React, {useState, useRef, useEffect} from 'react';
import {Head} from '@inertiajs/react';

export default function Mariachi({canciones, imagenes, videos}) {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [videoActivo, setVideoActivo] = useState(null);
    const [videoIndex, setVideoIndex] = useState(0);
    const [showThumbs, setShowThumbs] = useState(true);
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

    const nextVideo = () => {
        if (!videos?.length) return;

        const nextIndex = (videoIndex + 1) % videos.length;
        setVideoIndex(nextIndex);
        setVideoActivo(videos[nextIndex]);
    };

    const prevVideo = () => {
        if (!videos?.length) return;

        const prevIndex = (videoIndex - 1 + videos.length) % videos.length;
        setVideoIndex(prevIndex);
        setVideoActivo(videos[prevIndex]);
    };

    useEffect(() => {
        if (videos?.length > 0) {
            setVideoActivo(videos[0]);
            setVideoIndex(0);
        }
    }, [videos]);
    return (
        <>
            <Head title="Mariachi Real Guadalajara"/>

            {/* Botones sticky */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {/* WhatsApp */}
                <a
                    href="https://wa.me/5213339490021?text=Estoy%20interesado%2C%20%C2%BFme%20regalas%20informaci%C3%B3n%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-green-400/50 hover:scale-110 transition-all duration-300"
                    title="Escríbenos por WhatsApp"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path
                            d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.826L.057 23.571a.75.75 0 00.921.921l5.744-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.725 9.725 0 01-4.964-1.36l-.355-.211-3.685.941.957-3.593-.232-.37A9.725 9.725 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                    </svg>
                </a>

                {/* Llamar */}
                <a
                    href="tel:+523339490021"
                    className="w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-amber-400/50 hover:scale-110 transition-all duration-300"
                    title="Llámanos"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.18 21 3 13.82 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>
                    </svg>
                </a>
            </div>

            <div className="w-full flex justify-center bg-black">
                <div className="w-full max-w-[2560px] aspect-[16/9] bg-white">

                    {/*Titulo*/}
                    <section className="relative bg-black">
                        <img
                            src="/images/imagenFondo.png"
                            alt="Mariachi"
                            className="w-full h-auto md:h-screen md:object-cover opacity-70"
                        />

                        {/* Overlay contenido central */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white px-6">
                                <h1 className="text-4xl sm:text-5xl md:text-8xl font-extrabold mb-6 tracking-wide">
                                    MARIACHI COLOMBIA SHOW
                                </h1>

                                <p className="text-xl sm:text-2xl md:text-4xl mb-3 font-medium">
                                    Nos distinguimos como uno de los mejores
                                </p>

                                <p className="text-lg sm:text-xl md:text-3xl opacity-90">
                                    mariachis en Guadalajara
                                </p>
                            </div>
                        </div>

                        {/* Caja contacto */}
                        <div className="absolute bottom-6 left-6">
                            <div className="bg-black/60 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-lg border border-white/20">
                                <p className="text-xs sm:text-sm uppercase tracking-widest opacity-80">
                                    Contáctanos
                                </p>
                                <p className="text-base sm:text-lg md:text-xl font-semibold">
                                    (33) 3949 0021
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
                                    <h2 className="text-[#C8FA15] text-5xl font-bold mb-6">
                                        Videos de nuestro mariachi
                                    </h2>
                                    <p className="text-2xl mb-6 font-semibold">
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
                                    <a href="https://wa.me/5213339490021?text=Estoy%20interesado%2C%20%C2%BFme%20regalas%20informaci%C3%B3n%3F"
                                       target="_blank"
                                    >
                                        <button
                                            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center gap-2 transition">
                                            No pierdas esta oportunidad, contactanos →
                                        </button>
                                    </a>

                                    {/* Miniaturas de otros videos */}
                                    {/*{videos.length > 1 && (*/}
                                    {/*    <div className="flex gap-3 mt-8 flex-wrap">*/}
                                    {/*        {videos.map((v, i) => (*/}
                                    {/*            <button*/}
                                    {/*                key={v.id}*/}
                                    {/*                onClick={() => setVideoActivo(v)}*/}
                                    {/*                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border ${*/}
                                    {/*                    videoActivo?.id === v.id*/}
                                    {/*                        ? 'bg-yellow-400 text-black border-yellow-400'*/}
                                    {/*                        : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'*/}
                                    {/*                }`}*/}
                                    {/*            >*/}
                                    {/*                {i + 1}. {v.titulo}*/}
                                    {/*            </button>*/}
                                    {/*        ))}*/}
                                    {/*    </div>*/}
                                    {/*)}*/}
                                </div>

                                {/* Video derecha — flotante */}
                                <div className="relative z-50 md:-mt-32">
                                    <div
                                        className="relative p-2 shadow-2xl shadow-black/60 transform hover:scale-105 transition duration-300 rounded-2xl bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm"
                                        style={{filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))'}}
                                    >
                                        <div className="relative rounded-xl overflow-hidden"
                                             style={{paddingBottom: '56.25%'}}>
                                            {videoActivo ? (
                                                <>
                                                    <iframe
                                                        key={videoActivo.id}
                                                        className="absolute top-0 left-0 w-full h-full"
                                                        src={toEmbedUrl(videoActivo.url)}
                                                        title={videoActivo.titulo}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                    />

                                                    {/* Flecha izquierda */}
                                                    {videos.length > 1 && (
                                                        <button
                                                            onClick={prevVideo}
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 group"
                                                        >
                                                            <div
                                                                className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg shadow-amber-500/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-400/70">
                                                                <svg className="w-6 h-6 text-black" fill="none"
                                                                     stroke="currentColor" strokeWidth="3"
                                                                     viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="M15 19l-7-7 7-7"/>
                                                                </svg>
                                                            </div>
                                                        </button>
                                                    )}

                                                    {/* Flecha derecha */}
                                                    {videos.length > 1 && (
                                                        <button
                                                            onClick={nextVideo}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 group"
                                                        >
                                                            <div
                                                                className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg shadow-amber-500/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-400/70">
                                                                <svg className="w-6 h-6 text-black" fill="none"
                                                                     stroke="currentColor" strokeWidth="3"
                                                                     viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="M9 5l7 7-7 7"/>
                                                                </svg>
                                                            </div>
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400 text-sm">
                                                    Sin videos disponibles
                                                </div>
                                            )}
                                        </div>
                                        {videoActivo?.titulo && (
                                            <>
                                                <p className="text-center text-sm text-gray-400 mt-2 pb-1">{videoActivo.titulo}</p>
                                                <p className="text-center text-xs text-gray-400 mt-2">
                                                    {videoIndex + 1} / {videos.length}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*Album*/}
                    <section className="bg-gradient-to-br from-indigo-900 to-[#166e41] text-white py-20">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                                Álbum de nuestro Mariachi
                            </h2>
                            <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
                                Conoce más sobre nuestras presentaciones. Haz clic para ver nuestro álbum completo.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                                {galleryImages.slice(0, 3).map((imagen, index) => (
                                    <div
                                        key={imagen.id}
                                        onClick={() => {
                                            setSelectedImage(index);
                                            setShowThumbs(true);
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
                                <div className="max-w-7xl mx-auto">`
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
                                                    setShowThumbs(false);
                                                }}
                                                className="relative cursor-pointer group overflow-hidden rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                                            >
                                                <img
                                                    src={imagen.url}
                                                    alt={imagen.titulo}
                                                    className="w-full h-64 object-cover"
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
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
                        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center p-4">

                            {/* Cerrar */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-6 right-6 text-white bg-black/60 hover:bg-red-600 transition p-3 rounded-full"
                            >
                                ✕
                            </button>

                            {/* Flecha izquierda */}
                            <button
                                onClick={() => setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-10"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg flex items-center justify-center hover:scale-110 transition">
                                    <svg className="w-6 h-6 text-black" fill="none"
                                         stroke="currentColor" strokeWidth="3"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 19l-7-7 7-7"/>
                                    </svg>
                                </div>
                            </button>

                            {/* Imagen principal */}
                            <div className="max-w-6xl w-full flex flex-col items-center">
                                <img
                                    key={galleryImages[selectedImage].url}
                                    src={galleryImages[selectedImage].url}
                                    alt={galleryImages[selectedImage].titulo}
                                    className="max-h-[75vh] object-contain rounded-xl shadow-2xl mb-6 transition-opacity duration-500 opacity-100"
                                />

                                {/* Info */}
                                <div className="text-center mb-4">
                                    <p className="text-white text-xl font-bold">
                                        {galleryImages[selectedImage].titulo}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {selectedImage + 1} / {galleryImages.length}
                                    </p>
                                </div>

                                {/* 🔥 Miniaturas (solo si showThumbs) */}
                                {showThumbs && (
                                    <div className="absolute bottom-20 left-0 w-full px-6">
                                        <div className="max-w-5xl mx-auto">
                                            <div className="flex gap-3 overflow-x-auto py-3 px-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">

                                                {galleryImages.map((img, index) => (
                                                    <img
                                                        key={img.id}
                                                        src={img.url}
                                                        alt={img.titulo}
                                                        onClick={() => setSelectedImage(index)}
                                                        className={`
                            flex-shrink-0 w-20 h-20 object-cover rounded-lg cursor-pointer transition-all duration-300
                            ${selectedImage === index
                                                            ? 'ring-2 ring-amber-400 scale-110 opacity-100'
                                                            : 'opacity-50 hover:opacity-100 hover:scale-105'
                                                        }
                        `}
                                                    />
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Botón toggle miniaturas */}
                            <button
                                onClick={() => setShowThumbs(prev => !prev)}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-600 text-black px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition"
                            >
                                {showThumbs ? 'Ocultar galería' : 'Ver galería'}
                            </button>

                            {/* Flecha derecha */}
                            <button
                                onClick={() => setSelectedImage((prev) => (prev + 1) % galleryImages.length)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-10"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg flex items-center justify-center hover:scale-110 transition rotate-180">
                                    <svg className="w-6 h-6 text-black" fill="none"
                                         stroke="currentColor" strokeWidth="3"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 19l-7-7 7-7"/>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    )}

                    {/*Musica*/}
                    <section
                        className="relative bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white py-24 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                        <div className="container mx-auto px-4 relative z-10">
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                    <span className="text-2xl font-medium text-amber-500/90 tracking-wide">
                                    NUESTRO REPERTORIO
                                </span>
                                </div>

                                <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                <span
                                    className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
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
                                                    <div
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
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
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                              d="M19 9l-7 7-7-7"/>
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Efecto hover sutil */}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                                        </div>

                                        {/* Lista expandida de canciones - Diseño profesional */}
                                        {expandedCategory === category.id && (
                                            <div className="mt-4 animate-fadeIn">
                                                <div
                                                    className="rounded-2xl bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-sm border border-white/10 p-6 shadow-2xl">
                                                    {/* Header del playlist */}
                                                    <div
                                                        className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                                        <div
                                                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-white" fill="currentColor"
                                                                 viewBox="0 0 20 20">
                                                                <path
                                                                    d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
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
                                                                    <div
                                                                        className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-zinc-400 group-hover/song:bg-amber-500 group-hover/song:text-white transition-all">
                                                                        {currentSong?.id === song.id && isPlaying ? (
                                                                            <svg className="w-4 h-4 text-amber-500"
                                                                                 fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd"
                                                                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                      clipRule="evenodd"/>
                                                                            </svg>
                                                                        ) : (
                                                                            <span
                                                                                className="group-hover/song:hidden">{index + 1}</span>
                                                                        )}
                                                                        {currentSong?.id !== song.id && (
                                                                            <svg
                                                                                className="w-4 h-4 hidden group-hover/song:block"
                                                                                fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd"
                                                                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                                                      clipRule="evenodd"/>
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
                                                                                <div
                                                                                    className="w-0.5 h-3 bg-amber-500 animate-pulse"></div>
                                                                                <div
                                                                                    className="w-0.5 h-4 bg-amber-500 animate-pulse"
                                                                                    style={{animationDelay: '0.2s'}}></div>
                                                                                <div
                                                                                    className="w-0.5 h-3 bg-amber-500 animate-pulse"
                                                                                    style={{animationDelay: '0.4s'}}></div>
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
                                                                    <div
                                                                        className="mt-3 p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-black border border-amber-500/20 animate-fadeIn">
                                                                        <div className="flex flex-col gap-4">
                                                                            <div className="flex items-center gap-3">
                                                                            <span
                                                                                className="text-xs text-zinc-400 font-mono min-w-[45px] text-right">
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
                                                                                        style={{width: `${(currentTime / duration) * 100}%`}}
                                                                                    >
                                                                                        <div
                                                                                            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"></div>
                                                                                    </div>
                                                                                </div>

                                                                                <span
                                                                                    className="text-xs text-zinc-400 font-mono min-w-[45px]">
                                                                                {formatTime(duration)}
                                                                            </span>
                                                                            </div>

                                                                            {/* Controles de reproducción */}
                                                                            <div
                                                                                className="flex items-center justify-center gap-3">
                                                                                {/* Botón Anterior */}
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        previousSong();
                                                                                    }}
                                                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group/btn"
                                                                                >
                                                                                    <svg
                                                                                        className="w-5 h-5 text-zinc-400 group-hover/btn:text-white transition-colors"
                                                                                        fill="currentColor"
                                                                                        viewBox="0 0 20 20">
                                                                                        <path
                                                                                            d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
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
                                                                                        <svg className="w-5 h-5 text-white"
                                                                                             fill="currentColor"
                                                                                             viewBox="0 0 20 20">
                                                                                            <path fillRule="evenodd"
                                                                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                                  clipRule="evenodd"/>
                                                                                        </svg>
                                                                                    ) : (
                                                                                        <svg
                                                                                            className="w-5 h-5 text-white ml-0.5"
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20">
                                                                                            <path fillRule="evenodd"
                                                                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                                                                  clipRule="evenodd"/>
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
                                                                                    <svg
                                                                                        className="w-5 h-5 text-zinc-400 group-hover/btn:text-white transition-colors"
                                                                                        fill="currentColor"
                                                                                        viewBox="0 0 20 20">
                                                                                        <path
                                                                                            d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
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
                            {/*<div className="text-center max-w-2xl mx-auto">*/}
                            {/*    <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10">*/}
                            {/*        <h3 className="text-2xl font-bold mb-3 text-white">*/}
                            {/*            ¿Listo para contratar?*/}
                            {/*        </h3>*/}
                            {/*        <p className="text-zinc-400 mb-6">*/}
                            {/*            Solicita una cotización personalizada y recibe una respuesta en menos de 24 horas.*/}
                            {/*        </p>*/}

                            {/*        <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 rounded-full font-semibold text-white shadow-lg hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105">*/}
                            {/*            <span>Solicitar Cotización</span>*/}
                            {/*            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
                            {/*                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />*/}
                            {/*            </svg>*/}
                            {/*        </button>*/}
                            {/*        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-zinc-400">*/}
                            {/*            <div className="flex items-center gap-2">*/}
                            {/*                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">*/}
                            {/*                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />*/}
                            {/*                </svg>*/}
                            {/*                <span>Respuesta rápida</span>*/}
                            {/*            </div>*/}
                            {/*            <div className="flex items-center gap-2">*/}
                            {/*                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">*/}
                            {/*                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />*/}
                            {/*                </svg>*/}
                            {/*                <span>Paquetes personalizables</span>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </section>
                    <footer
                        className="bg-gradient-to-b from-black via-gray-900 to-black text-white pt-16 pb-10 border-t border-gray-800">
                        <div className="container mx-auto px-6">

                            {/* Top */}
                            <div className="grid md:grid-cols-4 gap-10">

                                {/* Marca */}
                                <div className="md:col-span-2">
                                    <h3 className="text-4xl font-extrabold mb-4 text-[#C8FA15] tracking-wide">
                                        MARIACHI COLOMBIA SHOW
                                    </h3>
                                    <p className="text-gray-400 max-w-md mb-6">
                                        Uno de los mejores mariachis de Guadalajara. Llevamos música, emoción y tradición a
                                        tus eventos.
                                    </p>

                                    {/* CTA */}
                                    <a
                                        href="https://wa.me/5213339490021?text=Estoy%20interesado%2C%20%C2%BFme%20regalas%20informaci%C3%B3n%3F"
                                        target="_blank"
                                        className="inline-block bg-[#C8FA15] text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition"
                                    >
                                        Cotizar ahora
                                    </a>
                                </div>

                                {/* Contacto */}
                                <div>
                                    <h4 className="font-bold mb-4 text-lg text-white">Contacto</h4>
                                    <div className="space-y-3 text-gray-400 text-sm">
                                        <p>📞 +52 33 3949 0021</p>
                                        <p>📧 contacto@mariachiguadalajara.com</p>
                                        <p>📍 Guadalajara, Jalisco</p>
                                    </div>
                                </div>

                                {/* Redes */}
                                <div>
                                    <h4 className="font-bold mb-4 text-lg text-white">Síguenos</h4>
                                    <div className="flex gap-4">

                                        <a href="#"
                                           className="bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white"
                                                 fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.02H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.88 3.78-3.88 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33V22c4.78-.8 8.43-4.94 8.43-9.93z"/>
                                            </svg>
                                        </a>

                                        <a href="#"
                                           className="bg-pink-600 hover:bg-pink-700 w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white"
                                                 fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm4.25 2.5A5.5 5.5 0 1017.5 12 5.5 5.5 0 0012 6.5zm0 2A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 8.5z"/>
                                            </svg>
                                        </a>

                                        <a href="#"
                                           className="bg-red-600 hover:bg-red-700 w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white"
                                                 fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M21.8 8.001s-.2-1.4-.8-2.02c-.76-.8-1.6-.8-2-.85C16.2 4.9 12 4.9 12 4.9h-.01s-4.19 0-6.99.23c-.4.05-1.24.05-2 .85-.6.62-.8 2.02-.8 2.02S2 9.7 2 11.4v1.2c0 1.7.2 3.4.2 3.4s.2 1.4.8 2.02c.76.8 1.76.77 2.2.86 1.6.15 6.8.22 6.8.22s4.2-.01 6.99-.24c.4-.05 1.24-.05 2-.85.6-.62.8-2.02.8-2.02s.2-1.7.2-3.4v-1.2c0-1.7-.2-3.4-.2-3.4zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
                                <p>&copy; 2026 Mariachi Colombia Show. Todos los derechos reservados.</p>
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
