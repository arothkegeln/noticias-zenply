"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/actions/login";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl relative z-10 backdrop-blur-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                        Bienvenido
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Ingresa a Zenply Intelligence
                    </p>
                </div>

                <form action={dispatch} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="admin@zenply.io"
                            required
                            className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all"
                        />
                    </div>

                    {errorMessage && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center dark:text-red-400">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" className="text-primary hover:underline font-medium transition-colors">
                        Regístrate
                    </Link>
                </div>
            </div>
        </div>
    );
}
