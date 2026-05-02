import React, {useState, useRef, useEffect} from 'react';
import {Head} from '@inertiajs/react';

export default function Mariachi({canciones, imagenes, videos, heroImage}) {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [videoActivo, setVideoActivo] = useState(null);
    const [videoIndex, setVideoIndex] = useState(0);
    const [showThumbs, setShowThumbs] = useState(true);

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
        setCurrentSong(currentSong?.id === song.id ? null : song);
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
    Object.values(categoriesMap).forEach(cat => categories.push(cat));

    const galleryImages = imagenes || [];
    const toggleCategory = (categoryId) => setExpandedCategory(expandedCategory === categoryId ? null : categoryId);

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
            <Head>
                <title>Mariachi en Guadalajara para Serenatas y Eventos</title>

                <meta
                    name="description"
                    content="Mariachi Colombia Show en Guadalajara. Contrata serenatas, cumpleaños, bodas y eventos con música en vivo. Atención inmediata por WhatsApp o llamada."
                />

                <meta property="og:title" content="Mariachi Colombia Show en Guadalajara" />
                <meta
                    property="og:description"
                    content="Serenatas y eventos con mariachi colombiano en Guadalajara. Atención inmediata."
                />
                <meta
                    property="og:image"
                    content={`https://mariachicolombiashow.com${heroImage}`}
                />
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
                        <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path
                            d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.826L.057 23.571a.75.75 0 00.921.921l5.744-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.725 9.725 0 01-4.964-1.36l-.355-.211-3.685.941.957-3.593-.232-.37A9.725 9.725 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                    </svg>
                </a>

                <a
                    href="tel:+523339490021"
                    className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, #C9963B, #8B6914)',
                        boxShadow: '0 4px 20px rgba(201,150,59,0.4)'
                    }}
                    title="Llámanos"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.18 21 3 13.82 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>
                    </svg>
                </a>
            </div>

            <div className="w-full" style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}>

                {/* ══════════════════════ HERO ══════════════════════ */}
                <section className="relative bg-black min-h-[70vh] md:min-h-screen z-0">
                    {/* Franja dorada superior */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[3px] z-20"
                        style={{
                            background:
                                'linear-gradient(90deg, transparent, #C9963B, #E8C46A, #C9963B, transparent)',
                        }}
                    />

                    <img
                        src={`${heroImage}?v=${Date.now()}`}
                        alt="Integrantes de Mariachi Colombia Show en Guadalajara"
                        className="w-full h-full object-cover absolute inset-0"
                    />

                    {/* Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(8,5,0,0.55) 50%, rgba(0,0,0,0.85) 100%)',
                        }}
                    />

                    {/* CONTENIDO */}
                    <div className="relative flex items-center justify-center min-h-[70vh] md:min-h-screen px-6">
                        <div className="max-w-6xl w-full flex flex-col items-center md:items-center gap-6">

                            {/* TEXTO */}
                            <div className="text-center text-white">
                                {/* Ornamento */}
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <div className="h-px w-16 md:w-32"
                                         style={{background: 'linear-gradient(90deg, transparent, #C9963B)'}}/>
                                    <span style={{color: '#C9963B', fontSize: '1.5rem'}}>♪</span>
                                    <div className="h-px w-16 md:w-32"
                                         style={{background: 'linear-gradient(90deg, #C9963B, transparent)'}}/>
                                </div>

                                <h2
                                    className="font-black mb-4 tracking-widest uppercase"
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 'clamp(2rem, 7vw, 6rem)',
                                        lineHeight: 1.1,
                                        textShadow: '0 4px 40px rgba(201,150,59,0.3)',
                                    }}
                                >
                                    MARIACHI COLOMBIA SHOW
                                </h2>

                                <div className="flex items-center justify-center gap-4 my-5">
                                    <div className="h-px w-12 md:w-24"
                                         style={{background: 'linear-gradient(90deg, transparent, #C9963B)'}}/>
                                    <div className="w-2 h-2 rounded-full" style={{background: '#C9963B'}}/>
                                    <div className="h-px w-12 md:w-24"
                                         style={{background: 'linear-gradient(90deg, #C9963B, transparent)'}}/>
                                </div>

                                <p
                                    className="text-xl sm:text-2xl md:text-3xl mb-2 font-light tracking-wide"
                                    style={{color: '#E8C46A', fontFamily: "'Cinzel', serif"}}
                                >
                                    Nos distinguimos como uno de los mejores
                                </p>

                                <p
                                    className="text-lg sm:text-xl md:text-2xl font-light tracking-widest"
                                    style={{color: 'rgba(232,196,106,0.75)'}}
                                >
                                    Mariachis en Guadalajara
                                </p>
                            </div>

                            {/* CONTACTO MOBILE */}
                            <div className="flex justify-center w-full md:hidden mt-4">
                                <div
                                    className="text-white px-6 py-4 rounded-xl border"
                                    style={{
                                        background: 'rgba(8,5,0,0.75)',
                                        backdropFilter: 'blur(12px)',
                                        borderColor: 'rgba(201,150,59,0.35)',
                                    }}
                                >
                                    <p
                                        className="text-xs uppercase tracking-widest mb-1"
                                        style={{color: '#C9963B', letterSpacing: '0.2em'}}
                                    >
                                        Contáctanos
                                    </p>

                                    <p
                                        className="text-base sm:text-xl font-semibold"
                                        style={{fontFamily: "'Cinzel', serif"}}
                                    >
                                        (33) 3949 0021
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* CONTACTO DESKTOP / TABLET */}
                    <div className="hidden md:block absolute bottom-6 left-6 z-20">
                        <div
                            className="text-white px-6 py-4 rounded-xl border"
                            style={{
                                background: 'rgba(8,5,0,0.75)',
                                backdropFilter: 'blur(12px)',
                                borderColor: 'rgba(201,150,59,0.35)',
                            }}
                        >
                            <p
                                className="text-xs uppercase tracking-widest mb-1"
                                style={{color: '#C9963B', letterSpacing: '0.2em'}}
                            >
                                Contáctanos
                            </p>

                            <p
                                className="text-base sm:text-xl font-semibold"
                                style={{fontFamily: "'Cinzel', serif"}}
                            >
                                (33) 3949 0021
                            </p>
                        </div>
                    </div>

                    {/* Franja dorada inferior */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{
                            background:
                                'linear-gradient(90deg, transparent, #C9963B 30%, #E8C46A 50%, #C9963B 70%, transparent)',
                        }}
                    />
                </section>
                {/* ══════════════════════ VIDEOS ══════════════════════ */}
                <section
                    className="text-white py-20 relative z-30"
                    style={{background: 'linear-gradient(135deg, #0D0B06 0%, #111009 50%, #080806 100%)'}}
                >
                    {/* Textura sutil */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #C9963B 0, #C9963B 1px, transparent 0, transparent 50%)',
                        backgroundSize: '20px 20px'
                    }}/>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* Texto izquierda */}
                            <div className="pt-12">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
                                     style={{
                                         background: 'rgba(201,150,59,0.08)',
                                         borderColor: 'rgba(201,150,59,0.25)'
                                     }}>
                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                                          style={{background: '#C9963B'}}/>
                                    <span className="text-sm tracking-widest uppercase"
                                          style={{color: '#C9963B', fontFamily: "'Cinzel', serif"}}>
                                        En escena
                                    </span>
                                </div>

                                <h2 className="font-bold mb-6 leading-tight"
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                                        color: '#E8C46A'
                                    }}>
                                    Videos de nuestro mariachi
                                </h2>
                                <p className="text-xl mb-4 font-light" style={{color: '#F5E8D0'}}>
                                    Uno de los mejores mariachis de Guadalajara
                                </p>
                                <p className="mb-4 leading-relaxed font-light"
                                   style={{color: 'rgba(245,232,208,0.65)'}}>
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
                                    <button
                                        className="text-white px-8 py-4 rounded-lg text-base font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 border"
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
                            <div className="relative md:-mt-40" style={{ zIndex: 50 }}>
                                <div
                                    className="relative shadow-2xl transform hover:scale-[1.02] transition duration-500 rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(201,150,59,0.15), rgba(139,105,20,0.05))',
                                        padding: '2px',
                                        boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,150,59,0.2)'
                                    }}>
                                    <div className="rounded-2xl overflow-hidden" style={{background: '#0D0B06'}}>
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
                                                    {videos.length > 1 && (
                                                        <button onClick={prevVideo}
                                                                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 group">
                                                            <div
                                                                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #C9963B, #8B6914)',
                                                                    boxShadow: '0 4px 16px rgba(201,150,59,0.5)'
                                                                }}>
                                                                <svg className="w-5 h-5 text-black" fill="none"
                                                                     stroke="currentColor" strokeWidth="3"
                                                                     viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                                          d="M15 19l-7-7 7-7"/>
                                                                </svg>
                                                            </div>
                                                        </button>
                                                    )}
                                                    {videos.length > 1 && (
                                                        <button onClick={nextVideo}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 group">
                                                            <div
                                                                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #C9963B, #8B6914)',
                                                                    boxShadow: '0 4px 16px rgba(201,150,59,0.5)'
                                                                }}>
                                                                <svg className="w-5 h-5 text-black" fill="none"
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
                                                    className="absolute inset-0 flex items-center justify-center text-sm"
                                                    style={{background: '#111', color: 'rgba(201,150,59,0.5)'}}>
                                                    Sin videos disponibles
                                                </div>
                                            )}
                                        </div>
                                        {videoActivo?.titulo && (
                                            <div className="px-4 py-3 border-t"
                                                 style={{borderColor: 'rgba(201,150,59,0.15)'}}>
                                                <p className="text-center text-sm font-light"
                                                   style={{color: '#C9963B', fontFamily: "'Cinzel', serif"}}>
                                                    {videoActivo.titulo}
                                                </p>
                                                <p className="text-center text-xs mt-1"
                                                   style={{color: 'rgba(201,150,59,0.5)'}}>
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
                    <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                         style={{background: 'linear-gradient(180deg, transparent, #C9963B 30%, #C9963B 70%, transparent)'}}/>
                    <div className="absolute right-0 top-0 bottom-0 w-[3px]"
                         style={{background: 'linear-gradient(180deg, transparent, #C9963B 30%, #C9963B 70%, transparent)'}}/>

                    <div className="container mx-auto px-4 relative">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="h-px w-20"
                                     style={{background: 'linear-gradient(90deg, transparent, #C9963B)'}}/>
                                <span style={{color: '#C9963B'}}>✦</span>
                                <div className="h-px w-20"
                                     style={{background: 'linear-gradient(90deg, #C9963B, transparent)'}}/>
                            </div>
                            <h2 className="font-bold mb-4" style={{
                                fontFamily: "'Cinzel', serif",
                                fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                                color: '#E8C46A'
                            }}>
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
                                    onClick={() => {
                                        setSelectedImage(index);
                                        setShowThumbs(true);
                                    }}
                                    className="relative cursor-pointer group overflow-hidden shadow-2xl"
                                    style={{borderRadius: '4px', border: '1px solid rgba(201,150,59,0.2)'}}
                                >
                                    <img src={imagen.url} alt={imagen.titulo}
                                         className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"/>
                                    <div
                                        className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-end p-4"
                                        style={{background: 'linear-gradient(to top, rgba(8,5,0,0.9) 0%, transparent 60%)'}}>
                                        <div>
                                            <p className="text-white font-semibold text-sm"
                                               style={{fontFamily: "'Cinzel', serif"}}>{imagen.titulo}</p>
                                            {imagen.descripcion && <p className="text-xs mt-1"
                                                                      style={{color: '#C9963B'}}>{imagen.descripcion}</p>}
                                        </div>
                                    </div>
                                    {/* Esquinas decorativas */}
                                    <div
                                        className="absolute top-2 left-2 w-4 h-4 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{borderColor: '#C9963B'}}/>
                                    <div
                                        className="absolute top-2 right-2 w-4 h-4 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{borderColor: '#C9963B'}}/>
                                    <div
                                        className="absolute bottom-2 left-2 w-4 h-4 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{borderColor: '#C9963B'}}/>
                                    <div
                                        className="absolute bottom-2 right-2 w-4 h-4 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{borderColor: '#C9963B'}}/>
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
                                    <h2 className="text-3xl font-bold"
                                        style={{fontFamily: "'Cinzel', serif", color: '#E8C46A'}}>
                                        Álbum Completo
                                    </h2>
                                    <button onClick={() => setShowAlbumModal(false)}
                                            className="text-white p-3 rounded-full transition-all hover:scale-110"
                                            style={{
                                                background: 'rgba(123,30,45,0.8)',
                                                border: '1px solid rgba(201,150,59,0.3)'
                                            }}>
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
                                            className="relative cursor-pointer group overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300"
                                            style={{border: '1px solid rgba(201,150,59,0.15)'}}
                                        >
                                            <img src={imagen.url} alt={imagen.titulo}
                                                 className="w-full h-64 object-cover"/>
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                                                style={{background: 'linear-gradient(to top, rgba(8,5,0,0.9), transparent)'}}>
                                                <div>
                                                    <p className="text-white font-semibold text-sm"
                                                       style={{fontFamily: "'Cinzel', serif"}}>{imagen.titulo}</p>
                                                    {imagen.descripcion && <p className="text-xs mt-1"
                                                                              style={{color: '#C9963B'}}>{imagen.descripcion}</p>}
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
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
                         style={{background: 'rgba(0,0,0,0.97)'}}>
                        <button onClick={() => setSelectedImage(null)}
                                className="absolute top-6 right-6 text-white p-3 rounded-full transition-all hover:scale-110"
                                style={{background: 'rgba(123,30,45,0.8)', border: '1px solid rgba(201,150,59,0.3)'}}>
                            ✕
                        </button>

                        <button
                            onClick={() => setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                            className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition"
                                style={{
                                    background: 'linear-gradient(135deg, #C9963B, #8B6914)',
                                    boxShadow: '0 4px 20px rgba(201,150,59,0.4)'
                                }}>
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="3"
                                     viewBox="0 0 24 24">
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
                                <p className="text-xl font-bold"
                                   style={{fontFamily: "'Cinzel', serif", color: '#E8C46A'}}>
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
                                             style={{
                                                 background: 'rgba(8,5,0,0.85)',
                                                 backdropFilter: 'blur(12px)',
                                                 borderColor: 'rgba(201,150,59,0.2)'
                                             }}>
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
                            style={{
                                fontFamily: "'Cinzel', serif",
                                background: 'linear-gradient(135deg, #C9963B, #8B6914)',
                                borderRadius: '2px',
                                letterSpacing: '0.05em'
                            }}>
                            {showThumbs ? 'Ocultar galería' : 'Ver galería'}
                        </button>

                        <button onClick={() => setSelectedImage((prev) => (prev + 1) % galleryImages.length)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition rotate-180"
                                style={{
                                    background: 'linear-gradient(135deg, #C9963B, #8B6914)',
                                    boxShadow: '0 4px 20px rgba(201,150,59,0.4)'
                                }}>
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="3"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </div>
                        </button>
                    </div>
                )}

                {/* ══════════════════════ MÚSICA / REPERTORIO ══════════════════════ */}
                <section className="relative text-white py-24 overflow-hidden"
                         style={{background: 'linear-gradient(180deg, #080604 0%, #0D0A07 50%, #080604 100%)'}}>
                    <div className="absolute inset-0 opacity-[0.025]" style={{
                        backgroundImage: 'radial-gradient(circle, #C9963B 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}/>

                    <div className="container mx-auto px-4 relative z-10">
                        {/* Header repertorio */}
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6 border"
                                 style={{background: 'rgba(201,150,59,0.06)', borderColor: 'rgba(201,150,59,0.2)'}}>
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{background: '#C9963B'}}/>
                                <span className="text-sm tracking-[0.25em] uppercase"
                                      style={{color: '#C9963B', fontFamily: "'Cinzel', serif"}}>
                                    Nuestro Repertorio
                                </span>
                            </div>

                            <h2 className="font-bold mb-6 leading-tight"
                                style={{fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 4rem)'}}>
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
                                <div className="h-px w-16"
                                     style={{background: 'linear-gradient(90deg, transparent, #C9963B)'}}/>
                                <span style={{color: '#C9963B'}}>✦</span>
                                <div className="h-px w-16"
                                     style={{background: 'linear-gradient(90deg, #C9963B, transparent)'}}/>
                            </div>

                            <p className="text-lg font-light leading-relaxed" style={{color: 'rgba(245,232,208,0.55)'}}>
                                Explora nuestro extenso repertorio organizado por tipo de evento.
                                Cada categoría incluye canciones cuidadosamente seleccionadas.
                            </p>
                        </div>

                        {/* Categorías — discos de vinilo */}
                        <div className="flex flex-wrap justify-center gap-10 max-w-4xl mx-auto mb-6">
                            {categories.map((category) => {
                                const isActive = expandedCategory === category.id;
                                return (
                                    <div key={category.id}
                                         className="flex flex-col items-center gap-3 cursor-pointer group"
                                         onClick={() => toggleCategory(category.id)}>
                                        {/* Disco */}
                                        <div className="relative transition-all duration-500 group-hover:scale-105"
                                             style={{width: 150, height: 150}}>
                                            {/* Anillo exterior giratorio */}
                                            <div className="absolute inset-0 rounded-full transition-all duration-700"
                                                 style={{
                                                     background: isActive
                                                         ? 'conic-gradient(from 0deg, #C9963B 0%, #E8C46A 25%, #8B6914 50%, #E8C46A 75%, #C9963B 100%)'
                                                         : 'conic-gradient(from 0deg, rgba(201,150,59,0.4) 0%, rgba(201,150,59,0.1) 50%, rgba(201,150,59,0.4) 100%)',
                                                     padding: '3px',
                                                     borderRadius: '50%',
                                                     boxShadow: isActive ? '0 0 40px rgba(201,150,59,0.5)' : 'none',
                                                     animation: isActive ? 'spinSlow 8s linear infinite' : 'none',
                                                 }}/>
                                            {/* Cuerpo del vinilo */}
                                            <div
                                                className="absolute inset-[3px] rounded-full flex items-center justify-center"
                                                style={{
                                                    background: 'radial-gradient(circle at 35% 35%, #1e180a, #080604)',
                                                    boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.8)',
                                                }}>
                                                {/* Surcos del disco */}
                                                {[30, 42, 54].map(r => (
                                                    <div key={r} className="absolute rounded-full border"
                                                         style={{
                                                             width: r * 2, height: r * 2,
                                                             borderColor: isActive ? 'rgba(201,150,59,0.2)' : 'rgba(255,255,255,0.05)',
                                                         }}/>
                                                ))}
                                                {/* Etiqueta central */}
                                                <div
                                                    className="relative z-10 w-16 h-16 rounded-full flex flex-col items-center justify-center"
                                                    style={{
                                                        background: isActive
                                                            ? 'radial-gradient(circle, #C9963B, #7B5210)'
                                                            : 'radial-gradient(circle, #2a2010, #0D0A07)',
                                                        border: '1px solid rgba(201,150,59,0.4)',
                                                        boxShadow: isActive ? '0 0 16px rgba(201,150,59,0.6)' : 'none',
                                                    }}>
                                                    <span className="text-3xl leading-none select-none">
                                                        {category.songs[0]?.emoji || '🎵'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Nombre */}
                                        <div className="text-center">
                                            <p className="font-bold text-sm transition-colors"
                                               style={{
                                                   fontFamily: "'Cinzel', serif",
                                                   color: isActive ? '#E8C46A' : 'rgba(245,232,208,0.6)'
                                               }}>
                                                {category.name}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{color: 'rgba(201,150,59,0.5)'}}>
                                                {category.songs.length} canciones
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Panel de canciones — panel full width debajo de los discos */}
                        {categories.map((category) =>
                                expandedCategory === category.id && (
                                    <div key={category.id}
                                         className="max-w-4xl mx-auto mb-20 animate-fadeIn"
                                         style={{
                                             background: 'linear-gradient(135deg, #0D0A07, #080604)',
                                             border: '1px solid rgba(201,150,59,0.2)',
                                             borderRadius: '4px',
                                         }}>
                                        {/* Header del panel */}
                                        <div className="flex items-center gap-3 px-6 py-4 border-b"
                                             style={{borderColor: 'rgba(201,150,59,0.15)'}}>
                                            <div className="w-9 h-9 rounded flex items-center justify-center"
                                                 style={{background: 'linear-gradient(135deg, #C9963B, #8B6914)'}}>
                                                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold"
                                                    style={{fontFamily: "'Cinzel', serif", color: '#E8C46A'}}>
                                                    {category.name}
                                                </h4>
                                                <p className="text-xs font-light" style={{color: 'rgba(201,150,59,0.6)'}}>
                                                    {category.songs.length} canciones disponibles
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-2">
                                            {category.songs.map((song, index) => (
                                                <div key={song.id}>
                                                    <div onClick={() => playSong(song)}
                                                         className="flex items-center gap-4 p-4 cursor-pointer transition-all duration-300"
                                                         style={{
                                                             borderRadius: '2px',
                                                             background: currentSong?.id === song.id ? 'rgba(201,150,59,0.08)' : 'transparent',
                                                             border: currentSong?.id === song.id ? '1px solid rgba(201,150,59,0.25)' : '1px solid transparent',
                                                         }}>
                                                        <div
                                                            className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center text-sm font-bold"
                                                            style={{
                                                                background: currentSong?.id === song.id ? 'rgba(201,150,59,0.2)' : 'rgba(255,255,255,0.04)',
                                                                color: currentSong?.id === song.id ? '#C9963B' : 'rgba(255,255,255,0.4)',
                                                                fontFamily: "'Cinzel', serif",
                                                            }}>
                                                            {currentSong?.id === song.id ? (
                                                                <div className="flex items-center gap-0.5">
                                                                    <div className="w-0.5 h-3 animate-pulse"
                                                                         style={{background: '#C9963B'}}/>
                                                                    <div className="w-0.5 h-4 animate-pulse" style={{
                                                                        background: '#C9963B',
                                                                        animationDelay: '0.2s'
                                                                    }}/>
                                                                    <div className="w-0.5 h-3 animate-pulse" style={{
                                                                        background: '#C9963B',
                                                                        animationDelay: '0.4s'
                                                                    }}/>
                                                                </div>
                                                            ) : index + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-base font-semibold truncate"
                                                                style={{
                                                                    color: currentSong?.id === song.id ? '#C9963B' : '#F5E8D0',
                                                                    fontFamily: "'Cinzel', serif"
                                                                }}>
                                                                {song.nombre}
                                                            </h5>
                                                            <p className="text-sm truncate font-light"
                                                               style={{color: 'rgba(245,232,208,0.45)'}}>
                                                                {song.artista}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {currentSong?.id === song.id && (
                                                        <div className="animate-fadeIn border"
                                                             style={{
                                                                 borderColor: 'rgba(201,150,59,0.2)',
                                                                 borderRadius: '2px',
                                                                 overflow: 'hidden',
                                                                 background: '#0D0A07'
                                                             }}>
                                                            <div style={{position: 'relative', paddingBottom: '56.25%'}}>
                                                                <iframe
                                                                    key={song.id}
                                                                    src={`${toEmbedUrl(song.url)}?autoplay=1`}
                                                                    title={song.nombre}
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: '100%',
                                                                        height: '100%'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                        )}
                    </div>
                </section>

                {/* ══════════════════════ FOOTER ══════════════════════ */}
                <footer className="text-white pt-16 pb-10"
                        style={{
                            background: 'linear-gradient(180deg, #080604 0%, #050402 100%)',
                            borderTop: '1px solid rgba(201,150,59,0.2)'
                        }}>
                    <div className="container mx-auto px-6">
                        {/* Franja ornamental */}
                        <div className="flex items-center gap-4 mb-12">
                            <div className="flex-1 h-px"
                                 style={{background: 'linear-gradient(90deg, transparent, rgba(201,150,59,0.4))'}}/>
                            <span style={{color: '#C9963B', fontSize: '1.25rem'}}>♪</span>
                            <div className="flex-1 h-px"
                                 style={{background: 'linear-gradient(90deg, rgba(201,150,59,0.4), transparent)'}}/>
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
                                <p className="font-light max-w-md mb-6 leading-relaxed"
                                   style={{color: 'rgba(245,232,208,0.5)'}}>
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
                                    <a href="#"
                                       className="w-11 h-11 rounded flex items-center justify-center transition hover:scale-110 border"
                                       style={{
                                           background: 'rgba(24,119,242,0.15)',
                                           borderColor: 'rgba(24,119,242,0.3)'
                                       }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor"
                                             viewBox="0 0 24 24" style={{color: '#4A9EFF'}}>
                                            <path
                                                d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.02H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.88 3.78-3.88 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33V22c4.78-.8 8.43-4.94 8.43-9.93z"/>
                                        </svg>
                                    </a>
                                    <a href="#"
                                       className="w-11 h-11 rounded flex items-center justify-center transition hover:scale-110 border"
                                       style={{
                                           background: 'rgba(193,53,132,0.15)',
                                           borderColor: 'rgba(193,53,132,0.3)'
                                       }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor"
                                             viewBox="0 0 24 24" style={{color: '#E8629A'}}>
                                            <path
                                                d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm4.25 2.5A5.5 5.5 0 1017.5 12 5.5 5.5 0 0012 6.5zm0 2A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 8.5z"/>
                                        </svg>
                                    </a>
                                    <a href="#"
                                       className="w-11 h-11 rounded flex items-center justify-center transition hover:scale-110 border"
                                       style={{background: 'rgba(255,0,0,0.15)', borderColor: 'rgba(255,0,0,0.3)'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor"
                                             viewBox="0 0 24 24" style={{color: '#FF6B6B'}}>
                                            <path
                                                d="M21.8 8.001s-.2-1.4-.8-2.02c-.76-.8-1.6-.8-2-.85C16.2 4.9 12 4.9 12 4.9h-.01s-4.19 0-6.99.23c-.4.05-1.24.05-2 .85-.6.62-.8 2.02-.8 2.02S2 9.7 2 11.4v1.2c0 1.7.2 3.4.2 3.4s.2 1.4.8 2.02c.76.8 1.76.77 2.2.86 1.6.15 6.8.22 6.8.22s4.2-.01 6.99-.24c.4-.05 1.24-.05 2-.85.6-.62.8-2.02.8-2.02s.2-1.7.2-3.4v-1.2c0-1.7-.2-3.4-.2-3.4zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-6 text-center border-t" style={{borderColor: 'rgba(201,150,59,0.1)'}}>
                            <p className="text-sm font-light"
                               style={{color: 'rgba(245,232,208,0.3)', letterSpacing: '0.05em'}}>
                                © 2026 Mariachi Colombia Show · Todos los derechos reservados
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
