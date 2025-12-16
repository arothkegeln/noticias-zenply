"use client";

import { registerUser } from "@/app/actions/register";
import Link from "next/link";
import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);
        setSuccess(null);
        setFieldErrors({});

        const formData = new FormData(e.currentTarget);
        const result = await registerUser(formData);

        if (result.error) {
            if (typeof result.error === "string") {
                setError(result.error);
            } else {
                setFieldErrors(result.error);
            }
        } else if (result.success) {
            setSuccess(result.success);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        }
        setIsPending(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl relative z-10 backdrop-blur-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                        Crear Cuenta
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Únete a Zenply Intelligence
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Juan Pérez"
                            required
                            className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all"
                        />
                        {fieldErrors.name && <p className="text-xs text-red-500 mt-1 dark:text-red-400">{fieldErrors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="juan@empresa.com"
                            required
                            className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all"
                        />
                        {fieldErrors.email && <p className="text-xs text-red-500 mt-1 dark:text-red-400">{fieldErrors.email[0]}</p>}
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
                        {fieldErrors.password && <p className="text-xs text-red-500 mt-1 dark:text-red-400">{fieldErrors.password[0]}</p>}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-sm text-center flex flex-col items-center dark:text-emerald-400">
                            <p>{success}</p>
                            <span className="text-xs opacity-70 mt-1">Redirigiendo...</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <>
                                Registrarse
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium transition-colors">
                        Inicia Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
