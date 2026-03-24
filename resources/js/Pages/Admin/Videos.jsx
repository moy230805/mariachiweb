import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

// Convierte cualquier URL de YouTube a embed
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

export default function Videos({ videos }) {
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando]   = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        titulo: '', descripcion: '', url: '', orden: 0,
    });

    const abrirCrear = () => {
        reset(); setEditando(null); setShowModal(true);
    };

    const abrirEditar = (v) => {
        setEditando(v);
        setData({ titulo: v.titulo, descripcion: v.descripcion ?? '', url: v.url, orden: v.orden });
        setShowModal(true);
    };

    const guardar = (e) => {
        e.preventDefault();
        if (editando) {
            put(route('admin.videos.update', editando.id), {
                onSuccess: () => { setShowModal(false); reset(); },
            });
        } else {
            post(route('admin.videos.store'), {
                onSuccess: () => { setShowModal(false); reset(); },
            });
        }
    };

    const eliminar = (id) => {
        if (confirm('¿Eliminar este video?')) router.delete(route('admin.videos.destroy', id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Videos</h2>}>
            <Head title="Videos" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">Videos</h3>
                            <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                                + Agregar Video
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.length === 0 && (
                                <p className="col-span-3 text-center text-gray-400 py-8">Sin videos registrados</p>
                            )}
                            {videos.map((v) => (
                                <div key={v.id} className="rounded-lg overflow-hidden shadow border border-gray-100">
                                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={toEmbedUrl(v.url)}
                                            title={v.titulo}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="p-3 bg-white">
                                        <p className="font-medium text-gray-800 text-sm truncate">{v.titulo}</p>
                                        {v.descripcion && <p className="text-xs text-gray-400 mt-1 truncate">{v.descripcion}</p>}
                                        <p className="text-xs text-gray-400 mt-1">Orden: {v.orden}</p>
                                        <div className="flex gap-3 mt-3">
                                            <button onClick={() => abrirEditar(v)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                                                Editar
                                            </button>
                                            <button onClick={() => eliminar(v.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-5 text-gray-800">
                            {editando ? 'Editar Video' : 'Nuevo Video'}
                        </h3>
                        <form onSubmit={guardar} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={data.titulo}
                                    onChange={e => setData('titulo', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                                {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={e => setData('descripcion', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL del video</label>
                                <input
                                    type="url"
                                    value={data.url}
                                    onChange={e => setData('url', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                />
                                {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
                                {/* Preview en tiempo real */}
                                {data.url && (
                                    <div className="mt-3 relative w-full rounded-lg overflow-hidden border" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={toEmbedUrl(data.url)}
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                                <input
                                    type="number"
                                    value={data.orden}
                                    onChange={e => setData('orden', parseInt(e.target.value))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    min={0}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
