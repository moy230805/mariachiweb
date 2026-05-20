import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const sections = [
    {
        title: 'Canciones',
        description: 'Gestiona el catálogo musical',
        href: route('admin.canciones.index'),
        icon: '🎵',
    },
    {
        title: 'Galería',
        description: 'Administra fotos y álbumes',
        href: route('admin.galeria.index'),
        icon: '🖼️',
    },
    {
        title: 'Videos',
        description: 'Controla el contenido de video',
        href: route('admin.videos.index'),
        icon: '🎬',
    },
    {
        title: 'Configuración',
        description: 'Ajusta el hero y opciones generales',
        href: route('admin.settings.index'),
        icon: '⚙️',
    },
];

export default function Dashboard({ counts }) {
    const sections = [
        { title: 'Canciones',     description: 'Gestiona el catálogo musical',        href: route('admin.canciones.index'), icon: '🎵', count: counts.canciones },
        { title: 'Galería',       description: 'Administra fotos y álbumes',           href: route('admin.galeria.index'),   icon: '🖼️', count: counts.galeria   },
        { title: 'Videos',        description: 'Controla el contenido de video',       href: route('admin.videos.index'),    icon: '🎬', count: counts.videos    },
        { title: 'Configuración', description: 'Ajusta el hero y opciones generales',  href: route('admin.settings.index'),  icon: '⚙️', count: null             },
    ];


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Administrador de Contenido
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {sections.map((section) => (
                            <Link
                                key={section.title}
                                href={section.href}
                                className="group flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md hover:ring-gray-300"
                            >
                                <span className="text-3xl">{section.icon}</span>
                                <div>
                                    <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {section.title}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {section.description}
                                    </p>
                                </div>

                                {section.count !== null && (
                                    <p className="mt-2 text-xs font-medium text-indigo-600">
                                        {section.count} {section.title.toLowerCase()}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
