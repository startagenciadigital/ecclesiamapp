"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLiturgicalSeason, LiturgicalSeason } from '@/lib/liturgical-calendar';

interface LiturgicalContextType {
  season: LiturgicalSeason;
}

const LiturgicalContext = createContext<LiturgicalContextType>({ season: 'ordinary' });

export const useLiturgy = () => useContext(LiturgicalContext);

export function LiturgicalProvider({ children }: { children: React.ReactNode }) {
  const [season, setSeason] = useState<LiturgicalSeason>('ordinary');

  useEffect(() => {
    // Computa a temporada baseada no dia atual
    const currentSeason = getLiturgicalSeason(new Date());
    setSeason(currentSeason);
    
    // Injeta o data-attribute no <html> para o Tailwind/CSS capturar
    document.documentElement.setAttribute('data-liturgy', currentSeason);
  }, []);

  return (
    <LiturgicalContext.Provider value={{ season }}>
      {children}
    </LiturgicalContext.Provider>
  );
}
