import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Galeria({ imagenes }) {
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '', descripcion: '', orden: 0, imagen: null,
    });

    const abrirCrear = () => {
        reset(); setEditando(null); setPreview(null); setShowModal(true);
    };

    const abrirEditar = (img) => {
        setEditando(img);
        setData({ titulo: img.titulo, descripcion: img.descripcion ?? '', orden: img.orden, imagen: null });
        setPreview(img.url);
        setShowModal(true);
    };

    const handleImagen = (e) => {
        const file = e.target.files[0];
        setData('imagen', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const guardar = (e) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => { setShowModal(false); reset(); setPreview(null); },
        };

        if (editando) {
            router.post(route('admin.galeria.update', editando.id), { ...data, _method: 'PUT' }, options);
        } else {
            post(route('admin.galeria.store'), options);
        }
    };

    const eliminar = (id) => {
        console.log(id)
        if (confirm('¿Eliminar esta imagen?')) router.delete(route('admin.galeria.destroy', id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Galería</h2>}>
            <Head title="Galería" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">Fotos de Galería</h3>
                            <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                                + Agregar Foto
                            </button>
                        </div>

                        {/* Grid de imágenes */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {imagenes.length === 0 && (
                                <p className="col-span-4 text-center text-gray-400 py-8">Sin imágenes registradas</p>
                            )}
                            {imagenes.map((img) => (
                                <div key={img.id} className="relative group rounded-lg overflow-hidden shadow border border-gray-100">
                                    <img src={img.url} alt={img.titulo} className="w-full h-48 object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <button onClick={() => abrirEditar(img)} className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100">
                                            Editar
                                        </button>
                                        <button onClick={() => eliminar(img.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700">
                                            Eliminar
                                        </button>
                                    </div>
                                    <div className="p-2 bg-white">
                                        <p className="text-xs font-medium text-gray-700 truncate">{img.titulo}</p>
                                        <p className="text-xs text-gray-400">Orden: {img.orden}</p>
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
                            {editando ? 'Editar Imagen' : 'Nueva Imagen'}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                                <input
                                    type="number"
                                    value={data.orden}
                                    onChange={e => setData('orden', parseInt(e.target.value))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImagen}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    required={!editando}
                                />
                                {editando && <p className="text-xs text-gray-400 mt-1">Deja vacío para mantener la imagen actual</p>}
                                {errors.imagen && <p className="text-red-500 text-xs mt-1">{errors.imagen}</p>}
                                {preview && (
                                    <img src={preview} className="mt-3 w-full h-40 object-cover rounded-lg border" alt="Vista previa" />
                                )}
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
