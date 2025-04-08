'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Header />
      <h1 className="text-4xl font-bold">Welcome to MyApp</h1>
      <p className="mt-4 text-lg">This is a simple Next.js application.</p>
    </main>
    
  )
}