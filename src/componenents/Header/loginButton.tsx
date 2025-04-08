import React from 'react';
interface LoginButtonProps {
    title: string;
    onClick: () => void;
}


export default function LoginButton({title, onClick}: LoginButtonProps) {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {title}
    </button>
  );
}