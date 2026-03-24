import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Canciones({ canciones }) {
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '', artista: '', categoria: '', tipo_url: 'link', url: '', archivo: null,
    });

    const abrirCrear = () => {
        reset(); setEditando(null); setShowModal(true);
    };

    const abrirEditar = (c) => {
        setEditando(c);
        setData({ nombre: c.nombre, artista: c.artista, categoria: c.categoria, tipo_url: c.tipo_url ?? 'link', url: c.url ?? '', archivo: null });
        setShowModal(true);
    };

    const guardar = (e) => {
        e.preventDefault();
        if (editando) {
            router.post(route('admin.canciones.update', editando.id), { ...data, _method: 'PUT' }, {
                forceFormData: true,
                onSuccess: () => { setShowModal(false); reset(); },
            });
        } else {
            post(route('admin.canciones.store'), {
                forceFormData: true,
                onSuccess: () => { setShowModal(false); reset(); },
            });
        }
    };

    const eliminar = (id) => {
        if (confirm('¿Eliminar esta canción?')) router.delete(route('admin.canciones.destroy', id));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Canciones</h2>}>
            <Head title="Canciones" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">Lista de Canciones</h3>
                            <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                                + Agregar Canción
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="py-3 px-4">Nombre</th>
                                    <th className="py-3 px-4">Artista</th>
                                    <th className="py-3 px-4">Categoría</th>
                                    <th className="py-3 px-4">Tipo</th>
                                    <th className="py-3 px-4">Acciones</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {canciones.length === 0 && (
                                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">Sin canciones registradas</td></tr>
                                )}
                                {canciones.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">{c.nombre}</td>
                                        <td className="py-3 px-4 text-gray-600">{c.artista}</td>
                                        <td className="py-3 px-4 text-gray-600">{c.categoria}</td>
                                        <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.tipo_url === 'archivo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {c.tipo_url === 'archivo' ? '📁 Archivo' : '🔗 Link'}
                                                </span>
                                        </td>
                                        <td className="py-3 px-4 flex gap-3">
                                            <button onClick={() => abrirEditar(c)} className="text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                                            <button onClick={() => eliminar(c.id)} className="text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-5 text-gray-800">
                            {editando ? 'Editar Canción' : 'Nueva Canción'}
                        </h3>
                        <form onSubmit={guardar} className="space-y-4">
                            {[['nombre', 'Nombre'], ['artista', 'Artista'], ['categoria', 'Categoría']].map(([field, label]) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                    <input
                                        type="text"
                                        value={data[field]}
                                        onChange={e => setData(field, e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    />
                                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                                </div>
                            ))}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de audio</label>
                                <div className="flex gap-6">
                                    {[['link', '🔗 Link externo'], ['archivo', '📁 Subir archivo']].map(([val, lbl]) => (
                                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value={val} checked={data.tipo_url === val} onChange={() => setData('tipo_url', val)} />
                                            <span className="text-sm">{lbl}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {data.tipo_url === 'link' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL del audio</label>
                                    <input
                                        type="url"
                                        value={data.url}
                                        onChange={e => setData('url', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Archivo de audio</label>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={e => setData('archivo', e.target.files[0])}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                        required={!editando || editando.tipo_url === 'link'}
                                    />
                                    {editando?.tipo_url === 'archivo' && (
                                        <p className="text-xs text-gray-400 mt-1">Deja vacío para mantener el archivo actual</p>
                                    )}
                                </div>
                            )}

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
