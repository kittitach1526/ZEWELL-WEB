export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Admin } from '@/types';
import crypto from 'crypto';

// Helper to hash password
function hashPassword(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// GET all admins (without passwords)
export async function GET() {
    try {
        const adminsSnapshot = await db.collection('admins').get();
        const admins: Admin[] = [];

        adminsSnapshot.forEach((doc) => {
            const data = doc.data();
            // Exclude password from response
            admins.push({
                id: doc.id,
                username: data.username,
            } as Admin);
        });

        return NextResponse.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
    }
}

// POST new admin
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
        }

        // Check if admin already exists
        const existingAdmin = await db.collection('admins').where('username', '==', username).get();
        if (!existingAdmin.empty) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        const hashedPassword = hashPassword(password);

        const docRef = await db.collection('admins').add({
            username,
            password: hashedPassword,
        });

        return NextResponse.json({ id: docRef.id, username });
    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
    }
}
