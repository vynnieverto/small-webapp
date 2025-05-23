'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';


export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>('region');

  const handlePlayerSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Selected Region:', selectedRegion);
    try {
      const queryParams = new URLSearchParams({
        region: selectedRegion || '',
      });
      
    }
  }
}