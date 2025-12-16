"use server"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        console.log("🚀 Attempting sign in via action...");
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false, // Don't auto-redirect, we'll do it manually
        });
        console.log("✅ Sign in successful, redirecting to dashboard");
        redirect("/dashboard");
    } catch (error) {
        console.log("⚠️ Sign in error caught:", error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Credenciales inválidas (Usuario o contraseña incorrectos).";
                default:
                    return "Algo salió mal: " + error.message;
            }
        }
        throw error;
    }
}
