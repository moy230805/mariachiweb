import React from 'react';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <>
            <Head title="Inicio" />
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-6xl font-bold mb-4">MARIACHI REAL GUADALAJARA</h1>
                    <p className="text-2xl mb-6">Laravel + React + Inertia</p>
                    <p className="text-xl">¡Funciona perfectamente! 🎉</p>
                </div>
            </div>
        </>
    );
}