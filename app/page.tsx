import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a192f] text-white">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute w-full h-full object-cover opacity-30 z-0"
            >
                <source src="https://cdn.coverr.co/videos/coverr-typing-on-computer-keyboard-2646/1080p.mp4" type="video/mp4" />
            </video>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a192f] via-transparent to-[#0a192f]/80" />

            {/* Content */}
            <div className="relative z-20 max-w-5xl mx-auto px-6 text-center space-y-8">
                <div className="animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-emerald-200">
                        Zenply Intelligence
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                        Claridad en un mundo de ruido. Monitoreo estratégico de noticias para tomadores de decisiones.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                    <Link
                        href="/dashboard"
                        className="group relative px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-900/50 flex items-center gap-2"
                    >
                        Acceder a la Plataforma
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                        href="#"
                        className="px-8 py-3 border border-zinc-500 hover:border-white text-zinc-300 hover:text-white rounded-full font-medium transition-all duration-300"
                    >
                        Solicitar Demo
                    </a>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                        <h3 className="text-xl font-semibold mb-2 text-blue-300">Monitoreo 24/7</h3>
                        <p className="text-zinc-400 text-sm">Seguimiento continuo de fuentes RSS y web scraping personalizado.</p>
                    </div>
                    <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                        <h3 className="text-xl font-semibold mb-2 text-emerald-300">Inteligencia de Actores</h3>
                        <p className="text-zinc-400 text-sm">Identificación automática de empresas y personas clave en las noticias.</p>
                    </div>
                    <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                        <h3 className="text-xl font-semibold mb-2 text-purple-300">Análisis Estratégico</h3>
                        <p className="text-zinc-400 text-sm">Filtrado inteligente para destacar lo que realmente importa a su negocio.</p>
                    </div>
                </div>
            </div>

            <footer className="absolute bottom-4 text-xs text-zinc-600 z-20">
                © 2025 Zenply News Intelligence. All rights reserved.
            </footer>
        </div>
    );
}
