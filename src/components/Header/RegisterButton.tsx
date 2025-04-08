'use client';
import React from 'react';
import { useRouter } from 'next/navigation';


interface RegisterButtonProps {
    title: string;
    
}

export default function RegisterButton({title}: RegisterButtonProps) {
    const router = useRouter();

    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
        onClick={() => router.push('/register')}>
            {title}
        </button>
    );
}
