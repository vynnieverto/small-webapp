'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';

const regions = [
  'region',
  'na1',
  'euw1',
  'eun1',
  'kr',
  'br1',
  'jp1',
  'la1',
  'la2',
  'oc1',
  'tr1',
  'ru',
];

export default function MainSearchPage() {
  const [region, setRegion] = useState<string>('region');
  const [name, setName] = useState<string>('');



  const handlePlayerSearch = async (e: React.FormEvent) => {
    if (region === 'region' || name.trim() === '') {
      alert('Please select a region and enter a name.');
      return;
    }
    e.preventDefault();
    console.log('searching for player: ', name, 'in region:', region);

    try {
      const response  = await fetch('/api/getPlayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, region }),
      })
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
        placeholder="Enter a name"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white"
      />

      <select
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
      >
        {regions.map((r) => (
          <option key={r} value={r}>{r}</option>
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