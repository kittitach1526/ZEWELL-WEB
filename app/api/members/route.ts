import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Member } from '@/types';

// GET all members
export async function GET() {
    try {
        const membersSnapshot = await db.collection('members').get();
        const members: Member[] = [];

        membersSnapshot.forEach((doc) => {
            members.push({
                id: doc.id,
                ...doc.data(),
            } as Member);
        });

        return NextResponse.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
    }
}

// POST new member
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, facebookLink, role } = body;

        if (!firstName || !lastName || !facebookLink || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const docRef = await db.collection('members').add({
            firstName,
            lastName,
            facebookLink,
            role,
        });

        return NextResponse.json({ id: docRef.id, firstName, lastName, facebookLink, role });
    } catch (error) {
        console.error('Error creating member:', error);
        return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
    }
}

// PUT update member
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, firstName, lastName, facebookLink, role } = body;

        if (!id || !firstName || !lastName || !facebookLink || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await db.collection('members').doc(id).update({
            firstName,
            lastName,
            facebookLink,
            role,
        });

        return NextResponse.json({ id, firstName, lastName, facebookLink });
    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }
}

// DELETE member
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing member ID' }, { status: 400 });
        }

        await db.collection('members').doc(id).delete();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting member:', error);
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
}
