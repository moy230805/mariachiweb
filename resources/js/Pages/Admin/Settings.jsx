import Layout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'

export default function Settings({ heroImage }) {
    const { data, setData, post, processing } = useForm({
        imagen: null
    });

    const [preview, setPreview] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.hero.update'));
    };

    const handleFile = (file) => {
        setData('imagen', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <Layout>
            <Head title="Configuración" />

            <div className="min-h-screen p-8 bg-gray-100">
                <div className="max-w-3xl mx-auto">

                    {/* HEADER */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold mb-2">
                            Configuración
                        </h1>
                        <p className="text-sm text-gray-500">
                            Cambia la imagen principal del sitio
                        </p>
                    </div>

                    {/* CARD */}
                    <div className="p-6 rounded-xl border bg-white shadow">

                        {/* PREVIEW */}
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-widest mb-2 text-gray-500">
                                Imagen actual
                            </p>

                            <div className="relative group rounded-lg border overflow-hidden bg-black">

                                <img
                                    src={preview || heroImage}
                                    className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center bg-black/40">
                                    <span className="text-sm text-white">
                                        Vista previa
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}
                        <form onSubmit={submit} className="space-y-5">

                            {/* INPUT FILE */}
                            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition hover:bg-gray-50">
                                <span className="text-sm mb-2">
                                    Seleccionar imagen
                                </span>

                                <span className="text-xs text-gray-500">
                                    JPG, PNG, WEBP
                                </span>

                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFile(e.target.files[0])}
                                />
                            </label>

                            {/* BOTÓN */}
                            <button
                                disabled={processing}
                                className="w-full py-3 font-semibold bg-black text-white rounded hover:opacity-90 transition"
                            >
                                {processing ? 'Guardando...' : 'Guardar cambios'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
