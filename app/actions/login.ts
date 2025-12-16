"use server"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        console.log("🚀 Attempting sign in via action...");
        await signIn("credentials", formData);
        console.log("✅ Sign in successful (should have redirected)");
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
