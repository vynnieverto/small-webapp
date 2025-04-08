import React from 'react';
import { useRouter } from 'next/navigation';

interface HomePageButtonProps {
    title: string;
}

export default function HomePageButton({title}: HomePageButtonProps) {
    const router = useRouter();
    const onClick = () => {
        router.push('/');
    }

    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
        onClick={onClick}>
            {title}
        </button>
    )

}