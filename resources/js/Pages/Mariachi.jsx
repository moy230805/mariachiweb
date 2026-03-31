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

    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setTimeout(() => { if (audioRef.current) audioRef.current.play(); }, 100);
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
            else { audioRef.current.play(); setIsPlaying(true); }
        }
    };

    const previousSong = () => {
        if (!currentSong) return;
        const allSongs = categories.flatMap(cat => cat.songs);
        const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
        playSong(currentIndex > 0 ? allSongs[currentIndex - 1] : allSongs[allSongs.length - 1]);
    };

    const nextSong = () => {
        if (!currentSong) return;
        const allSongs = categories.flatMap(cat => cat.songs);
        const currentIndex = allSongs.findIndex(song => song.id === currentSong.id);
        playSong(currentIndex < allSongs.length - 1 ? allSongs[currentIndex + 1] : allSongs[0]);
    };

    const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
    const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
    const handleEnded = () => { setIsPlaying(false); nextSong(); };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const progressBar = e.currentTarget;
        const clickPosition = e.nativeEvent.offsetX;
        const newTime = (clickPosition / progressBar.offsetWidth) * duration;
        if (audioRef.current) { audioRef.current.currentTime = newTime; setCurrentTime(newTime); }
    };

    const categories = [];
    const categoriesMap = {};
    canciones.forEach((cancion) => {
        if (!categoriesMap[cancion.categoria]) {
            categoriesMap[cancion.categoria] = { id: Object.keys(categoriesMap).length + 1, name: cancion.categoria, songs: [] };
        }
        categoriesMap[cancion.categoria].songs.push(cancion);
    });
    Object.values(categoriesMap).forEach(cat => categories.push(cat));

    const galleryImages = imagenes || [];
    const toggleCategory = (categoryId) => setExpandedCategory(expandedCategory === categoryId ? null : categoryId);

    const nextVideo = () => {
        if (!videos?.length) return;
        const nextIndex = (videoIndex + 1) % videos.length;
        setVideoIndex(nextIndex); setVideoActivo(videos[nextIndex]);
    };

    const prevVideo = () => {
        if (!videos?.length) return;
        const prevIndex = (videoIndex - 1 + videos.length) % videos.length;
        setVideoIndex(prevIndex); setVideoActivo(videos[prevIndex]);
    };

    useEffect(() => {
        if (videos?.length > 0) { setVideoActivo(videos[0]); setVideoIndex(0); }
    }, [videos]);

    return (
        <>
            <Head title="Mariachi Colombia Show">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
            </Head>

            {/* Botones sticky */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                <a
                    href="https://wa.me/5213339490021?text=Estoy%20interesado%2C%20%C2%BFme%20regalas%20informaci%C3%B3n%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-green-400/50 hover:scale-110 transition-all duration-300"
                    title="Escríbenos por WhatsApp"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.826L.057 23.571a.75.75 0 00.921.921l5.744-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.725 9.725 0 01-4.964-1.36l-.355-.211-3.685.941.957-3.593-.232-.37A9.725 9.725 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                    </svg>
                </a>

                <a
                    href="tel:+523339490021"
                    className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                    style={{background: 'linear-gradient(135deg, #C9963B, #8B6914)', boxShadow: '0 4px 20px rgba(201,150,59,0.4)'}}
                    title="Llámanos"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.18 21 3 13.82 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>
                    </svg>
                </a>
            </div>

            <div className="w-full" style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}>

                {/* ══════════════════════ HERO ══════════════════════ */}
                <section className="relative bg-black overflow-hidden">
                    {/* Franja dorada superior */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{background: 'linear-gradient(90deg, transparent, #C9963B, #E8C46A, #C9963B, transparent)'}} />

                    <img
                        src="/images/imagenFondo.png"
                        alt="Mariachi"
                        className="w-full h-auto md:h-screen md:object-cover"
                        // style={{opacity: 0.45}}
                    />

                    {/* Overlay degradado dramático */}
                    <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(8,5,0,0.55) 50%, rgba(0,0,0,0.85) 100%)'}} />

                    {/* Contenido central */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white px-6">
                            {/* Ornamento superior */}
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="h-px w-16 md:w-32" style={{background: 'linear-gradient(90deg, transparent, #C9963B)'}} />
                                <span style={{color: '#C9963B', fontSize: '1.5rem'}}>♪</span>
                                <div className="h-px w-16 md:w-32" style={{background: 'linear-gradient(90deg, #C9963B, transparent)'}} />
                            </div>

                            <h1 className="font-black mb-4 tracking-widest uppercase"
                                style={{fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 7vw, 6rem)', lineHeight: 1.1, textShadow: '0 4px 40px rgba(201,150,59,0.3)'}}>
                                MARIACHI COLOMBIA SHOW
                            </h1>

                            <div className="flex items-center justify-center gap-4 my-5">
                                <div className="h-px w-12 md:w-24" style={{background: 'linear-gradient(90deg, transparent, #C9963B)'}} />
                                <div className="w-2 h-2 rounded-full" style={{background: '#C9963B'}} />
                                <div className="h-px w-12 md:w-24" style={{background: 'linear-gradient(90deg, #C9963B, transparent)'}} />
                            </div>

                            <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-light tracking-wide" style={{color: '#E8C46A', fontFamily: "'Cinzel', serif"}}>
                                Nos distinguimos como uno de los mejores
                            </p>
                            <p className="text-lg sm:text-xl md:text-2xl font-light tracking-widest" style={{color: 'rgba(232,196,106,0.75)'}}>
                                mariachis en Guadalajara
                            </p>
                        </div>
                    </div>

                    {/* Caja contacto */}
                    <div className="absolute bottom-6 left-6">
                        <div className="text-white px-6 py-4 rounded-xl border"
                             style={{background: 'rgba(8,5,0,0.75)', backdropFilter: 'blur(12px)', borderColor: 'rgba(201,150,59,0.35)'}}>
                            <p className="text-xs uppercase tracking-widest mb-1" style={{color: '#C9963B', letterSpacing: '0.2em'}}>
                                Contáctanos
                            </p>
                            <p className="text-base sm:text-xl font-semibold" style={{fontFamily: "'Cinzel', serif"}}>
                                (33) 3949 0021
                            </p>
                        </div>
                    </div>

                    {/* Franja dorada inferior */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{background: 'linear-gradient(90deg, transparent, #C9963B 30%, #E8C46A 50%, #C9963B 70%, transparent)'}} />
                </section>

                {/* ══════════════════════ VIDEOS ══════════════════════ */}
                <section className="text-white py-20 relative overflow-hidden"
                         style={{background: 'linear-gradient(135deg, #0D0B06 0%, #111009 50%, #080806 100%)'}}>
                    {/* Textura sutil */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'repeating-linear-gradient(45deg, #C9963B 0, #C9963B 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px'}} />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* Texto izquierda */}
                            <div className="pt-12">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
                                     style={{background: 'rgba(201,150,59,0.08)', borderColor: 'rgba(201,150,59,0.25)'}}>
                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background: '#C9963B'}} />
                                    <span className="text-sm tracking-widest uppercase" style={{color: '#C9963B', fontFamily: "'Cinzel', serif"}}>
                                        En escena
                                    </span>
                                </div>

                                <h2 className="font-bold mb-6 leading-tight"
                                    style={{fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#E8C46A'}}>
                                    Videos de nuestro mariachi
                                </h2>
                                <p className="text-xl mb-4 font-light" style={{color: '#F5E8D0'}}>
                                    Uno de los mejores mariachis de Guadalajara
                                </p>
                                <p className="mb-4 leading-relaxed font-light" style={{color: 'rgba(245,232,208,0.65)'}}>
                                    Mira nuestras presentaciones en vivo y descubre por qué somos el mariachi
                                    preferido de Guadalajara. Con años de experiencia y un repertorio extenso,
                                    llevamos alegría y música tradicional a cada evento.
                                </p>
                                <p className="mb-8 font-light" style={{color: 'rgba(245,232,208,0.55)'}}>
                                    Nuestro compromiso es hacer de tu celebración un momento inolvidable,
                                    con profesionalismo y la mejor calidad musical.
                                </p>
                                <a href="https://wa.me/5213339490021?text=Estoy%20interesado%2C%20%C2%BFme%20regalas%20informaci%C3%B3n%3F"
                                   target="_blank">
                                    <button className="text-white px-8 py-4 rounded-lg text-base font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 border"
                                            style={{
                                                fontFamily: "'Cinzel', serif",
                                                background: 'linear-gradient(135deg, #7B1E2D, #5E1621)',
                                                borderColor: 'rgba(201,150,59,0.3)',
                                                boxShadow: '0 4px 24px rgba(123,30,45,0.4)',
                                                letterSpacing: '0.05em'
                                            }}>
                                        No pierdas esta oportunidad, contáctanos →
                                    </button>
                                </a>
                            </div>

                            {/* Video derecha */}
                            <div className="relative z-50 md:-mt-32">
                                <div className="relative shadow-2xl transform hover:scale-[1.02] transition duration-500 rounded-2xl"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(201,150,59,0.15), rgba(139,105,20,0.05))',
                                         padding: '2px',
                                         boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,150,59,0.2)'
                                     }}>
                                    <div className="rounded-2xl overflow-hidden" style={{background: '#0D0B06'}}>
                                        <div className="relative rounded-xl overflow-hidden" style={{paddingBottom: '56.25%'}}>
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
                                                    {videos.length > 1 && (
                                                        <button onClick={prevVideo} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 group">
                                                            <div className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                                                 style={{background: 'linear-gradient(135deg, #C9963B, #8B6914)', boxShadow: '0 4px 16px rgba(201,150,59,0.5)'}}>
                                                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                                                                </svg>
                                                            </div>
                                                        </button>
                                                    )}
                                                    {videos.length > 1 && (
                                                        <button onClick={nextVideo} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 group">
                                                            <div className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                                                 style={{background: 'linear-gradient(135deg, #C9963B, #8B6914)', boxShadow: '0 4px 16px rgba(201,150,59,0.5)'}}>
                                                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                                                                </svg>
                                                            </div>
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-sm" style={{background: '#111', color: 'rgba(201,150,59,0.5)'}}>
                                                    Sin videos disponibles
                                                </div>
                                            )}
                                        </div>
                                        {videoActivo?.titulo && (
                                            <div className="px-4 py-3 border-t" style={{borderColor: 'rgba(201,150,59,0.15)'}}>
                                                <p className="text-center text-sm font-light" style={{color: '#C9963B', fontFamily: "'Cinzel', serif"}}>
                                                    {videoActivo.titulo}
                                                </p>
                                                <p className="text-center text-xs mt-1" style={{color: 'rgba(201,150,59,0.5)'}}>
                                                    {videoIndex + 1} / {videos.length}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════ ÁLBUM ══════════════════════ */}
                <section className="text-white py-20 relative overflow-hidden"
                         style={{background: 'linear-gradient(180deg, #0A0805 0%, #14100A 50%, #0A0805 100%)'}}>
                    {/* Ornamento lateral */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{background: 'linear-gradient(180deg, transparent, #C9963B 30%, #C9963B 70%, transparent)'}} />
                    <div className="absolute right-0 top-0 bottom-0 w-[3px]" style={{background: 'linear-gradient(180deg, transparent, #C9963B 30%, #C9963B 70%, transparent)'}} />

                    <div className="container mx-auto px-4 relative z-10">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="h-px w-20" style={{background: 'linear-gradient(90deg, transparent, #C9963B)'}} />
                                <span style={{color: '#C9963B'}}>✦</span>
                                <div className="h-px w-20" style={{background: 'linear-gradient(90deg, #C9963B, transparent)'}} />
                            </div>
                            <h2 className="font-bold mb-4" style={{fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: '#E8C46A'}}>
                                Álbum de nuestro Mariachi
                            </h2>
                            <p className="font-light max-w-2xl mx-auto" style={{color: 'rgba(245,232,208,0.6)'}}>
                                Conoce más sobre nuestras presentaciones. Haz clic para ver nuestro álbum completo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
                            {galleryImages.slice(0, 3).map((imagen, index) => (
                                <div
                                    key={imagen.id}
                                    onClick={() => { setSelectedImage(index); setShowThumbs(true); }}
                                    className="relative cursor-pointer group overflow-hidden shadow-2xl"
                                    style={{borderRadius: '4px', border: '1px solid rgba(201,150,59,0.2)'}}
                                >
                                    <img src={imagen.url} alt={imagen.titulo} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-end p-4"
                                         style={{background: 'linear-gradient(to top, rgba(8,5,0,0.9) 0%, transparent 60%)'}}>
                                        <div>
                                            <p className="text-white font-semibold text-sm" style={{fontFamily: "'Cinzel', serif"}}>{imagen.titulo}</p>
                                            {imagen.descripcion && <p className="text-xs mt-1" style={{color: '#C9963B'}}>{imagen.descripcion}</p>}
                                        </div>
                                    </div>
                                    {/* Esquinas decorativas */}
                                    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity" style={{borderColor: '#C9963B'}} />
                                    <div className="absolute top-2 right-2 w-4 h-4 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity" style={{borderColor: '#C9963B'}} />
                                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity" style={{borderColor: '#C9963B'}} />
                                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity" style={{borderColor: '#C9963B'}} />
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => setShowAlbumModal(true)}
                                className="text-white px-10 py-4 text-base font-semibold inline-flex items-center gap-3 transition-all duration-300 hover:scale-105 border"
                                style={{
                                    fontFamily: "'Cinzel', serif",
                                    background: 'linear-gradient(135deg, rgba(201,150,59,0.15), rgba(139,105,20,0.1))',
                                    borderColor: 'rgba(201,150,59,0.5)',
                                    letterSpacing: '0.1em',
                                    borderRadius: '2px',
                                    boxShadow: '0 4px 24px rgba(201,150,59,0.15)'
                                }}
                            >
                                <span style={{color: '#C9963B'}}>✦</span>
                                Ver álbum completo
                                <span style={{color: '#C9963B'}}>✦</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Modal álbum completo */}
                {showAlbumModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" style={{background: 'rgba(0,0,0,0.97)'}}>
                        <div className="min-h-screen p-8">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-bold" style={{fontFamily: "'Cinzel', serif", color: '#E8C46A'}}>
                                        Álbum Completo
                                    </h2>
                                    <button onClick={() => setShowAlbumModal(false)}
                                            className="text-white p-3 rounded-full transition-all hover:scale-110"
                                            style={{background: 'rgba(123,30,45,0.8)', border: '1px solid rgba(201,150,59,0.3)'}}>
                                        ✕
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {galleryImages.map((imagen, index) => (
                                        <div
                                            key={imagen.id}
                                            onClick={() => { setShowAlbumModal(false); setSelectedImage(index); setShowThumbs(false); }}
                                            className="relative cursor-pointer group overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300"
                                            style={{border: '1px solid rgba(201,150,59,0.15)'}}
                                        >
                                            <img src={imagen.url} alt={imagen.titulo} className="w-full h-64 object-cover" />
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                                                 style={{background: 'linear-gradient(to top, rgba(8,5,0,0.9), transparent)'}}>
                                                <div>
                                                    <p className="text-white font-semibold text-sm" style={{fontFamily: "'Cinzel', serif"}}>{imagen.titulo}</p>
                                                    {imagen.descripcion && <p className="text-xs mt-1" style={{color: '#C9963B'}}>{imagen.descripcion}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lightbox imagen */}
                {selectedImage !== null && (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4" style={{background: 'rgba(0,0,0,0.97)'}}>
                        <button onClick={() => setSelectedImage(null)}
                                className="absolute top-6 right-6 text-white p-3 rounded-full transition-all hover:scale-110"
                                style={{background: 'rgba(123,30,45,0.8)', border: '1px solid rgba(201,150,59,0.3)'}}>
                            ✕
                        </button>

                        <button onClick={() => setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition"
                                 style={{background: 'linear-gradient(135deg, #C9963B, #8B6914)', boxShadow: '0 4px 20px rgba(201,150,59,0.4)'}}>
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </div>
                        </button>

                        <div className="max-w-6xl w-full flex flex-col items-center">
                            <img
                                key={galleryImages[selectedImage].url}
                                src={galleryImages[selectedImage].url}
                                alt={galleryImages[selectedImage].titulo}
                                className="max-h-[75vh] object-contain shadow-2xl mb-6"
                                style={{border: '1px solid rgba(201,150,59,0.2)'}}
                            />
                            <div className="text-center mb-4">
                                <p className="text-xl font-bold" style={{fontFamily: "'Cinzel', serif", color: '#E8C46A'}}>
                                    {galleryImages[selectedImage].titulo}
                                </p>
                                <p className="text-sm mt-1" style={{color: 'rgba(201,150,59,0.6)'}}>
                                    {selectedImage + 1} / {galleryImages.length}
                                </p>
                            </div>

                            {showThumbs && (
                                <div className="absolute bottom-20 left-0 w-full px-6">
                                    <div className="max-w-5xl mx-auto">
                                        <div className="flex gap-3 overflow-x-auto py-3 px-2 rounded-xl border"
                                             style={{background: 'rgba(8,5,0,0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(201,150,59,0.2)'}}>
                                            {galleryImages.map((img, index) => (
                                                <img
                                                    key={img.id}
                                                    src={img.url}
                                                    alt={img.titulo}
                                                    onClick={() => setSelectedImage(index)}
                                                    className="flex-shrink-0 w-20 h-20 object-cover cursor-pointer transition-all duration-300"
                                                    style={{
                                                        borderRadius: '2px',
                                                        opacity: selectedImage === index ? 1 : 0.45,
                                                        transform: selectedImage === index ? 'scale(1.1)' : 'scale(1)',
                                                        border: selectedImage === index ? '2px solid #C9963B' : '2px solid transparent'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowThumbs(prev => !prev)}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-black px-6 py-2 text-sm font-semibold shadow-lg hover:scale-105 transition"
                            style={{fontFamily: "'Cinzel', serif", background: 'linear-gradient(135deg, #C9963B, #8B6914)', borderRadius: '2px', letterSpacing: '0.05em'}}>
                            {showThumbs ? 'Ocultar galería' : 'Ver galería'}
                        </button>

                        <button onClick={() => setSelectedImage((prev) => (prev + 1) % galleryImages.length)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition rotate-180"
                                 style={{background: 'linear-gradient(135deg, #C9963B, #8B6914)', boxShadow: '0 4px 20px rgba(201,150,59,0.4)'}}>
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </div>
                        </button>
                    </div>
                )}

                {/* ══════════════════════ MÚSICA / REPERTORIO ══════════════════════ */}
                <section className="relative text-white py-24 overflow-hidden"
                         style={{background: 'linear-gradient(180deg, #080604 0%, #0D0A07 50%, #080604 100%)'}}>
                    <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage: 'radial-gradient(circle, #C9963B 1px, transparent 1px)', backgroundSize: '32px 32px'}} />

                    <div className="container mx-auto px-4 relative z-10">
                        {/* Header repertorio */}
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6 border"
                                 style={{background: 'rgba(201,150,59,0.06)', borderColor: 'rgba(201,150,59,0.2)'}}>
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{background: '#C9963B'}} />
                                <span className="text-sm tracking-[0.25em] uppercase" style={{color: '#C9963B', fontFamily: "'Cinzel', serif"}}>
                                    Nuestro Repertorio
                                </span>
                            </div>

                            <h2 className="font-bold mb-6 leading-tight" style={{fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 4rem)'}}>
                                <span style={{
                                    background: 'linear-gradient(135deg, #E8C46A 0%, #F5E8D0 40%, #C9963B 70%, #E8C46A 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    Música para Cada Ocasión
                                </span>
                            </h2>

                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="h-px w-16" style={{background: 'linear-gradient(90deg, transparent, #C9963B)'}} />
                                <span style={{color: '#C9963B'}}>✦</span>
                                <div className="h-px w-16" style={{background: 'linear-gradient(90deg, #C9963B, transparent)'}} />
                            </div>

                            <p className="text-lg font-light leading-relaxed" style={{color: 'rgba(245,232,208,0.55)'}}>
                                Explora nuestro extenso repertorio organizado por tipo de evento.
                                Cada categoría incluye canciones cuidadosamente seleccionadas.
                            </p>
                        </div>

                        {/* Categorías */}
                        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-20">
                            {categories.map((category) => (
                                <div key={category.id} className="group">
                                    <div
                                        onClick={() => toggleCategory(category.id)}
                                        className="relative overflow-hidden cursor-pointer transition-all duration-500"
                                        style={{
                                            borderRadius: '4px',
                                            background: expandedCategory === category.id
                                                ? 'linear-gradient(135deg, rgba(201,150,59,0.12), rgba(139,105,20,0.06))'
                                                : 'rgba(255,255,255,0.03)',
                                            border: expandedCategory === category.id
                                                ? '1px solid rgba(201,150,59,0.4)'
                                                : '1px solid rgba(255,255,255,0.07)',
                                            boxShadow: expandedCategory === category.id ? '0 8px 40px rgba(201,150,59,0.12)' : 'none'
                                        }}
                                    >
                                        <div className="relative p-8">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-14 h-14 rounded flex items-center justify-center text-3xl transition-all duration-300"
                                                     style={{
                                                         background: expandedCategory === category.id ? 'rgba(201,150,59,0.15)' : 'rgba(255,255,255,0.04)',
                                                         border: '1px solid rgba(201,150,59,0.2)'
                                                     }}>
                                                    {category.id === 1 && '👑'}
                                                    {category.id === 2 && '🎂'}
                                                    {category.id === 3 && '❤️'}
                                                    {category.id === 4 && '💔'}
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                                                     style={{background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(201,150,59,0.2)'}}>
                                                    <span className="text-xs font-medium" style={{color: '#C9963B', fontFamily: "'Cinzel', serif"}}>
                                                        {category.songs.length} canciones
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold mb-2 text-white" style={{fontFamily: "'Cinzel', serif"}}>
                                                {category.name}
                                            </h3>

                                            <div className="flex items-center gap-2 text-sm mt-4" style={{color: 'rgba(201,150,59,0.7)'}}>
                                                <span className="font-medium tracking-wide">
                                                    {expandedCategory === category.id ? 'Ocultar repertorio' : 'Ver repertorio completo'}
                                                </span>
                                                <svg className={`w-4 h-4 transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lista canciones expandida */}
                                    {expandedCategory === category.id && (
                                        <div className="mt-3 animate-fadeIn">
                                            <div className="p-6 border"
                                                 style={{
                                                     background: 'linear-gradient(135deg, #0D0A07, #080604)',
                                                     border: '1px solid rgba(201,150,59,0.15)',
                                                     borderRadius: '4px'
                                                 }}>
                                                {/* Header playlist */}
                                                <div className="flex items-center gap-3 mb-6 pb-4 border-b"
                                                     style={{borderColor: 'rgba(201,150,59,0.15)'}}>
                                                    <div className="w-10 h-10 rounded flex items-center justify-center"
                                                         style={{background: 'linear-gradient(135deg, #C9963B, #8B6914)'}}>
                                                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-bold" style={{fontFamily: "'Cinzel', serif", color: '#E8C46A'}}>
                                                            Lista de reproducción
                                                        </h4>
                                                        <p className="text-sm font-light" style={{color: 'rgba(201,150,59,0.6)'}}>
                                                            {category.songs.length} canciones disponibles
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {category.songs.map((song, index) => (
                                                        <div key={song.id}>
                                                            <div
                                                                onClick={() => playSong(song)}
                                                                className="group/song flex items-center gap-4 p-4 cursor-pointer transition-all duration-300"
                                                                style={{
                                                                    borderRadius: '2px',
                                                                    background: currentSong?.id === song.id ? 'rgba(201,150,59,0.08)' : 'transparent',
                                                                    border: currentSong?.id === song.id ? '1px solid rgba(201,150,59,0.25)' : '1px solid transparent',
                                                                }}
                                                            >
                                                                <div className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center text-sm font-bold transition-all"
                                                                     style={{
                                                                         background: currentSong?.id === song.id ? 'rgba(201,150,59,0.2)' : 'rgba(255,255,255,0.04)',
                                                                         color: currentSong?.id === song.id ? '#C9963B' : 'rgba(255,255,255,0.4)',
                                                                         fontFamily: "'Cinzel', serif"
                                                                     }}>
                                                                    {currentSong?.id === song.id && isPlaying ? (
                                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#C9963B'}}>
                                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                                                                        </svg>
                                                                    ) : index + 1}
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="text-base font-semibold truncate transition-colors"
                                                                        style={{color: currentSong?.id === song.id ? '#C9963B' : '#F5E8D0', fontFamily: "'Cinzel', serif"}}>
                                                                        {song.nombre}
                                                                    </h5>
                                                                    <p className="text-sm truncate font-light" style={{color: 'rgba(245,232,208,0.45)'}}>
                                                                        {song.artista}
                                                                    </p>
                                                                </div>

                                                                <div className="flex-shrink-0">
                                                                    {currentSong?.id === song.id && isPlaying ? (
                                                                        <div className="flex items-center gap-1">
                                                                            <div className="w-0.5 h-3 animate-pulse" style={{background: '#C9963B'}} />
                                                                            <div className="w-0.5 h-4 animate-pulse" style={{background: '#C9963B', animationDelay: '0.2s'}} />
                                                                            <div className="w-0.5 h-3 animate-pulse" style={{background: '#C9963B', animationDelay: '0.4s'}} />
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-sm" style={{color: 'rgba(255,255,255,0.2)', fontFamily: "'Cinzel', serif"}}>
                                                                            {Math.floor(Math.random() * 2) + 3}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Reproductor inline */}
                                                            {currentSong?.id === song.id && (
                                                                <div className="mt-2 p-4 animate-fadeIn border"
                                                                     style={{
                                                                         background: 'linear-gradient(135deg, #0D0A07, #080604)',
                                                                         borderColor: 'rgba(201,150,59,0.2)',
                                                                         borderRadius: '2px'
                                                                     }}>
                                                                    <div className="flex flex-col gap-4">
                                                                        {/* Barra de progreso */}
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-xs font-mono min-w-[45px] text-right" style={{color: 'rgba(201,150,59,0.7)'}}>
                                                                                {formatTime(currentTime)}
                                                                            </span>
                                                                            <div
                                                                                onClick={(e) => { e.stopPropagation(); handleSeek(e); }}
                                                                                className="flex-1 h-1 rounded-full cursor-pointer overflow-hidden"
                                                                                style={{background: 'rgba(255,255,255,0.08)'}}>
                                                                                <div className="h-full transition-all relative"
                                                                                     style={{
                                                                                         width: `${(currentTime / duration) * 100}%`,
                                                                                         background: 'linear-gradient(90deg, #C9963B, #E8C46A)'
                                                                                     }} />
                                                                            </div>
                                                                            <span className="text-xs font-mono min-w-[45px]" style={{color: 'rgba(201,150,59,0.7)'}}>
                                                                                {formatTime(duration)}
                                                                            </span>
                                                                        </div>

                                                                        {/* Controles */}
                                                                        <div className="flex items-center justify-center gap-4">
                                                                            <button onClick={(e) => { e.stopPropagation(); previousSong(); }}
                                                                                    className="w-10 h-10 flex items-center justify-center rounded transition-all hover:scale-110 border"
                                                                                    style={{background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,150,59,0.2)'}}>
                                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{color: 'rgba(245,232,208,0.6)'}}>
                                                                                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
                                                                                </svg>
                                                                            </button>

                                                                            <button onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                                                                                    className="w-12 h-12 flex items-center justify-center rounded transition-all hover:scale-110"
                                                                                    style={{background: 'linear-gradient(135deg, #C9963B, #8B6914)', boxShadow: '0 4px 20px rgba(201,150,59,0.4)'}}>
                                                                                {isPlaying ? (
                                                                                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                                                                                    </svg>
                                                                                ) : (
                                                                                    <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                                                                                    </svg>
                                                                                )}
                                                                            </button>

                                                                            <button onClick={(e) => { e.stopPropagation(); nextSong(); }}
                                                                                    className="w-10 h-10 flex items-center justify-center rounded transition-all hover:scale-110 border"
                                                                                    style={{background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,150,59,0.2)'}}>
                                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{color: 'rgba(245,232,208,0.6)'}}>
                                                                                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
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
                    </div>
                </section>

                {/* ══════════════════════ FOOTER ══════════════════════ */}
                <footer className="text-white pt-16 pb-10"
                        style={{background: 'linear-gradient(180deg, #080604 0%, #050402 100%)', borderTop: '1px solid rgba(201,150,59,0.2)'}}>
                    <div className="container mx-auto px-6">
                        {/* Franja ornamental */}
                        <div className="flex items-center gap-4 mb-12">
                            <div className="flex-1 h-px" style={{background: 'linear-gradient(90deg, transparent, rgba(201,150,59,0.4))'}} />
                            <span style={{color: '#C9963B', fontSize: '1.25rem'}}>♪</span>
                            <div className="flex-1 h-px" style={{background: 'linear-gradient(90deg, rgba(201,150,59,0.4), transparent)'}} />
                        </div>

                        <div className="grid md:grid-cols-4 gap-10">
                            {/* Marca */}
                            <div className="md:col-span-2">
                                <h3 className="text-3xl font-extrabold mb-2 tracking-widest"
                                    style={{fontFamily: "'Cinzel', serif", color: '#E8C46A'}}>
                                    MARIACHI
                                </h3>
                                <h3 className="text-xl font-bold mb-5 tracking-widest"
                                    style={{fontFamily: "'Cinzel', serif", color: '#C9963B'}}>
                                    COLOMBIA SHOW
                                </h3>
                                <p className="font-light max-w-md mb-6 leading-relaxed" style={{color: 'rgba(245,232,208,0.5)'}}>
                                    Uno de los mejores mariachis de Guadalajara. Llevamos música, emoción y tradición a
                                    tus eventos.
                                </p>
                                <a href="https://wa.me/5213339490021?text=Estoy%20interesado%2C%20%C2%BFme%20regalas%20informaci%C3%B3n%3F"
                                   target="_blank"
                                   className="inline-block text-black font-semibold px-7 py-3 hover:scale-105 transition-all"
                                   style={{
                                       fontFamily: "'Cinzel', serif",
                                       background: 'linear-gradient(135deg, #C9963B, #8B6914)',
                                       borderRadius: '2px',
                                       letterSpacing: '0.05em',
                                       boxShadow: '0 4px 20px rgba(201,150,59,0.3)'
                                   }}>
                                    Cotizar ahora
                                </a>
                            </div>

                            {/* Contacto */}
                            <div>
                                <h4 className="font-bold mb-5 text-base tracking-widest uppercase"
                                    style={{fontFamily: "'Cinzel', serif", color: '#C9963B'}}>
                                    Contacto
                                </h4>
                                <div className="space-y-3 text-sm font-light" style={{color: 'rgba(245,232,208,0.55)'}}>
                                    <p>📞 +52 33 3949 0021</p>
                                    <p>📧 contacto@mariachiguadalajara.com</p>
                                    <p>📍 Guadalajara, Jalisco</p>
                                </div>
                            </div>

                            {/* Redes */}
                            <div>
                                <h4 className="font-bold mb-5 text-base tracking-widest uppercase"
                                    style={{fontFamily: "'Cinzel', serif", color: '#C9963B'}}>
                                    Síguenos
                                </h4>
                                <div className="flex gap-3">
                                    <a href="#" className="w-11 h-11 rounded flex items-center justify-center transition hover:scale-110 border"
                                       style={{background: 'rgba(24,119,242,0.15)', borderColor: 'rgba(24,119,242,0.3)'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{color: '#4A9EFF'}}>
                                            <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.02H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.88 3.78-3.88 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33V22c4.78-.8 8.43-4.94 8.43-9.93z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="w-11 h-11 rounded flex items-center justify-center transition hover:scale-110 border"
                                       style={{background: 'rgba(193,53,132,0.15)', borderColor: 'rgba(193,53,132,0.3)'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{color: '#E8629A'}}>
                                            <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm4.25 2.5A5.5 5.5 0 1017.5 12 5.5 5.5 0 0012 6.5zm0 2A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 8.5z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="w-11 h-11 rounded flex items-center justify-center transition hover:scale-110 border"
                                       style={{background: 'rgba(255,0,0,0.15)', borderColor: 'rgba(255,0,0,0.3)'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{color: '#FF6B6B'}}>
                                            <path d="M21.8 8.001s-.2-1.4-.8-2.02c-.76-.8-1.6-.8-2-.85C16.2 4.9 12 4.9 12 4.9h-.01s-4.19 0-6.99.23c-.4.05-1.24.05-2 .85-.6.62-.8 2.02-.8 2.02S2 9.7 2 11.4v1.2c0 1.7.2 3.4.2 3.4s.2 1.4.8 2.02c.76.8 1.76.77 2.2.86 1.6.15 6.8.22 6.8.22s4.2-.01 6.99-.24c.4-.05 1.24-.05 2-.85.6-.62.8-2.02.8-2.02s.2-1.7.2-3.4v-1.2c0-1.7-.2-3.4-.2-3.4zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-6 text-center border-t" style={{borderColor: 'rgba(201,150,59,0.1)'}}>
                            <p className="text-sm font-light" style={{color: 'rgba(245,232,208,0.3)', letterSpacing: '0.05em'}}>
                                © 2026 Mariachi Colombia Show · Todos los derechos reservados
                            </p>
                        </div>
                    </div>
                </footer>

                {/* Audio oculto */}
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
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </>
    );
}
