import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm, router} from '@inertiajs/react';
import {useState} from 'react';

export default function Canciones({canciones, categorias}) {
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [nuevaCategoria, setNuevaCategoria] = useState(false);
    const [openCategorias, setOpenCategorias] = useState([]);

    const {data, setData, post, processing, errors, reset} = useForm({
        nombre: '', artista: '', categoria: '', tipo_url: 'link', url: '', archivo: null, emoji: '🎵',
    });

    const abrirCrear = () => {
        reset();
        setData('emoji', '🎵');
        setEditando(null);
        setShowModal(true);
    };

    const abrirEditar = (c) => {
        setEditando(c);

        const existe = categorias.includes(c.categoria);

        setNuevaCategoria(!existe);

        setData({
            nombre: c.nombre,
            artista: c.artista,
            categoria: c.categoria,
            tipo_url: c.tipo_url ?? 'link',
            url: c.url ?? '',
            archivo: null,
            emoji: c.emoji ?? ''
        });

        setShowModal(true);
    };

    const toggle = (cat) => {
        setOpenCategorias(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    const guardar = (e) => {
        e.preventDefault();

        const payload = {
            ...data,
            emoji: data.emoji || '🎵'
        };

        if (editando) {
            router.post(route('admin.canciones.update', editando.id), {
                ...payload,
                _method: 'PUT'
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(route('admin.canciones.store'), {
                ...payload,
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const eliminar = (id) => {
        if (confirm('¿Eliminar esta canción?')) router.delete(route('admin.canciones.destroy', id));
    };

    const cancionesPorCategoria = canciones.reduce((acc, c) => {
        if (!acc[c.categoria]) acc[c.categoria] = [];
        acc[c.categoria].push(c);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Canciones</h2>}>
            <Head title="Canciones"/>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">Lista de Canciones</h3>
                            <button onClick={abrirCrear}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                                + Agregar Canción
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="space-y-3">
                                {Object.entries(cancionesPorCategoria).map(([categoria, items]) => {
                                    const abierto = openCategorias.includes(categoria);

                                    return (
                                        <div key={categoria} className="border rounded-lg overflow-hidden">

                                            {/* HEADER */}
                                            <button
                                                onClick={() => toggle(categoria)}
                                                className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200"
                                            >
                                                <span className="font-semibold text-gray-700">
                                                    {categoria} ({items.length})
                                                </span>
                                                <span>{abierto ? '▲' : '▼'}</span>
                                            </button>

                                            {/* BODY */}
                                            {abierto && (
                                                <div className="divide-y">
                                                    {items.map((c) => (
                                                        <div key={c.id} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50">

                                                            <div>
                                                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                                                    <span>{c.emoji ?? '🎵'}</span>
                                                                    {c.nombre}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {c.artista}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                                    c.tipo_url === 'archivo'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                    {c.tipo_url === 'archivo' ? 'Archivo' : 'Link'}
                                                                </span>

                                                                <button
                                                                    onClick={() => abrirEditar(c)}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                                >
                                                                    Editar
                                                                </button>

                                                                <button
                                                                    onClick={() => eliminar(c.id)}
                                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
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
                            {[['nombre', 'Nombre'], ['artista', 'Artista']].map(([field, label]) => (
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>

                                {!nuevaCategoria ? (
                                    <select
                                        value={data.categoria}
                                        onChange={e => {
                                            if (e.target.value === '__new__') {
                                                setNuevaCategoria(true);
                                                setData('categoria', '');
                                            } else {
                                                setData('categoria', e.target.value);
                                            }
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>

                                        {categorias.map((cat, i) => (
                                            <option key={i} value={cat}>{cat}</option>
                                        ))}

                                        <option value="__new__">+ Crear nueva categoría</option>
                                    </select>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={data.categoria}
                                            onChange={e => setData('categoria', e.target.value)}
                                            placeholder="Nueva categoría"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setNuevaCategoria(false)}
                                            className="px-3 py-2 text-sm bg-gray-200 rounded-lg"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}

                                {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                                <input
                                    type="text"
                                    value={data.emoji}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /\p{Extended_Pictographic}/u;

                                        if (regex.test(value)) {
                                            const match = value.match(regex);
                                            setData('emoji', match[0]);
                                        } else if (value === '') {
                                            setData('emoji', '');
                                        }
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="🎵"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de audio</label>
                                <div className="flex gap-6">
                                    {[['link', '🔗 Link externo'], ['archivo', '📁 Subir archivo']].map(([val, lbl]) => (
                                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value={val} checked={data.tipo_url === val}
                                                   onChange={() => setData('tipo_url', val)}/>
                                            <span className="text-sm">{lbl}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {data.tipo_url === 'link' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL del
                                        audio</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Archivo de
                                        audio</label>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={e => setData('archivo', e.target.files[0])}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                        required={!editando || editando.tipo_url === 'link'}
                                    />
                                    {editando?.tipo_url === 'archivo' && (
                                        <p className="text-xs text-gray-400 mt-1">Deja vacío para mantener el archivo
                                            actual</p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
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
