'use client'
import React from 'react';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import HomePageButton from './HomePageButton';


export default function Header() {

    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold">MyApp</h1>
                <HomePageButton title="Home" />
            </div>
            <div className="flex space-x-4">
                <LoginButton title="Login" onClick={() => {}} />
                <RegisterButton title="Register" />
            </div>
        </header>
    )
    



    
}