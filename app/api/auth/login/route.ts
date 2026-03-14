export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import crypto from 'crypto';

// Helper to hash password
function hashPassword(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // Check for Root User (Hardcoded or Env)
        // Default Root User: admin / admin123 (Change in production!)
        const rootUser = process.env.ROOT_USERNAME || 'admin';
        const rootPass = process.env.ROOT_PASSWORD || 'admin123';

        if (username === rootUser && password === rootPass) {
            return NextResponse.json({
                success: true,
                user: { username: 'Root Admin', role: 'root' }
            });
        }

        // Check Firestore for other admins
        const hashedPassword = hashPassword(password);
        const adminQuery = await db.collection('admins')
            .where('username', '==', username)
            .where('password', '==', hashedPassword)
            .get();

        if (!adminQuery.empty) {
            const adminDoc = adminQuery.docs[0];
            return NextResponse.json({
                success: true,
                user: { id: adminDoc.id, username: adminDoc.data().username, role: 'admin' }
            });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
