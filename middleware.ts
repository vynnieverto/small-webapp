import { PrismaClient} from '@prisma/client';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';

export const prisma = new PrismaClient();


export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    if (url.pathname.startsWith('/api/dev')) {
        const auth = request.headers.get('authorization');
        if (!auth) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        try {
            const token = auth.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

            if (!decoded) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }
            if (typeof decoded !== 'object' || !decoded.username) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }
            if (typeof decoded.username !== 'string') {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }
            const user = await prisma.user.findUnique({
                where: {
                    username: decoded.username,
                },
            });
            if (!user) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }

            if (user.role !== 'dev') {
                return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
            }

            return NextResponse.next();
        } catch (error) {
            console.error('Error verifying token:', error);
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
    }

}