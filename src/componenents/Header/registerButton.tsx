import React from 'react';

interface RegisterButtonProps {
    title: string;
    onClick: () => void;
}

export default function RegisterButton() {
    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Register
        </button>
    );
    }
