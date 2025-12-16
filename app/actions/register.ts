"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function registerUser(formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    // Validate fields
    const validatedFields = RegisterSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, password } = validatedFields.data;

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Este correo electrónico ya está registrado." };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: "Usuario creado exitosamente." };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Ocurrió un error al crear la cuenta." };
    }
}
