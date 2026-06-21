'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import { validPlatforms, type Platform } from '@/lib/regions';
export default function MainSearchPage() {
  const [p, setPlatform] = useState<Platform | 'region'>('region');
  const [name, setName] = useState<string>('');



  const handlePlayerSearch = async (e: React.FormEvent) => {
    // if (platform === 'region' || name.trim() === '') {
    //   alert('Please select a region and enter a name.');
    //   return;
    // }
    e.preventDefault();

    const riotId = name.trim();
    if (!p || !riotId) {
      alert('Please select a region and enter a name.');
      return;
    }

    console.log('searching for player: ', name, 'in region:', p);

    // I want to change this later since op.gg does some shenannigans with autofilling a particular tagline by default
    const hashIndex = riotId.lastIndexOf('#');
    if (hashIndex <= 0 || hashIndex === riotId.length - 1) {
      alert('enter in format of gameName#tagline');
      return;
    }

    const gameName = riotId.slice(0, hashIndex);
    const tagLine = riotId.slice(hashIndex + 1);
    try {
      const response  = await fetch('/api/getPlayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameName, tagLine, platform: p }),
      })

      const data = await response.json();

      if (!response.ok) {
        alert(data.error ?? 'lookup failed');
        return;
      }

      console.log('Player data:', data);
    }
    catch (error) {console.error('Error fetching player data:', error);
      alert('An error occurred while searching for the player. Please try again later.');
    }
    
  }
  return (
    <form
      onSubmit={handlePlayerSearch}
      className="max-w-xl mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4"
    >
      <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">Search by Name & Region</h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Game name + #tagline (e.g., RocketEscape#GLHF)"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white"
      />

      <select
        value={p}
        onChange={(e) => setPlatform(e.target.value as Platform)}
        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
      >
        {validPlatforms.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}