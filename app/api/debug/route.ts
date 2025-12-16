import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        AUTH_URL: process.env.AUTH_URL,
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
        AUTH_SECRET: process.env.AUTH_SECRET ? '✅ Set' : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV,
    });
}
