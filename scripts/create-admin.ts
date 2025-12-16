// Script para crear usuario admin en producción
// Ejecutar con: npx tsx scripts/create-admin.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@zenply.io';
    const password = 'Zenply2024!'; // Cambia esto por una contraseña segura

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Admin Zenply',
            password: hashedPassword,
        },
    });

    console.log('✅ Usuario creado:', user.email);
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
