// lib/liturgical-calendar.ts

export type LiturgicalSeason = 
  | 'ordinary' 
  | 'advent' 
  | 'christmas' 
  | 'lent' 
  | 'easter' 
  | 'gaudete' 
  | 'laetare' 
  | 'pentecost' 
  | 'passion'
  | 'solemnity';

// Algoritmo Computus simplificado para calcular a Páscoa (Meeus/Jones/Butcher)
function getEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed month
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

export function getLiturgicalSeason(date: Date = new Date()): LiturgicalSeason {
  const year = date.getFullYear();
  const time = date.getTime();
  
  const easter = getEaster(year);
  
  // Datas Móveis Baseadas na Páscoa
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46); // Quarta-feira de Cinzas
  
  const palmSunday = new Date(easter);
  palmSunday.setDate(easter.getDate() - 7); // Domingo de Ramos
  
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2); // Sexta-feira Santa
  
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49); // Pentecostes
  
  const laetareSunday = new Date(easter);
  laetareSunday.setDate(easter.getDate() - 21); // 4º Domingo da Quaresma

  // Datas Fixas
  const christmas = new Date(year, 11, 25); // 25 de Dezembro
  const baptismOfLord = new Date(year + 1, 0, 9); // Aproximadamente 9 Jan
  
  // Calcular o 1º Domingo do Advento (4 domingos antes do Natal)
  const christmasDayOfWeek = christmas.getDay();
  const daysToSubtract = christmasDayOfWeek === 0 ? 28 : 21 + christmasDayOfWeek;
  const adventStart = new Date(year, 11, 25 - daysToSubtract);
  
  const gaudeteSunday = new Date(adventStart);
  gaudeteSunday.setDate(adventStart.getDate() + 14); // 3º Domingo do Advento
  
  // Lógica de Determinação
  
  // Natal (25 Dez até Batismo do Senhor)
  if (time >= christmas.getTime() || time <= new Date(year, 0, 9).getTime()) {
    return 'christmas';
  }
  
  // Advento
  if (time >= adventStart.getTime() && time < christmas.getTime()) {
    // Verificar Gaudete (Rosa)
    if (date.toDateString() === gaudeteSunday.toDateString()) return 'gaudete';
    return 'advent';
  }
  
  // Quaresma (Cinzas até Quinta-Feira Santa, antes da Missa da Ceia)
  if (time >= ashWednesday.getTime() && time < goodFriday.getTime()) {
    // Verificar Laetare (Rosa)
    if (date.toDateString() === laetareSunday.toDateString()) return 'laetare';
    return 'lent';
  }
  
  // Tríduo / Paixão
  if (time >= goodFriday.getTime() && time < easter.getTime()) {
    return 'passion';
  }
  
  // Tempo Pascal (Páscoa até Pentecostes)
  if (time >= easter.getTime() && time < pentecost.getTime()) {
    return 'easter';
  }
  
  // Pentecostes
  if (date.toDateString() === pentecost.toDateString()) {
    return 'pentecost';
  }

  // Padrão: Tempo Comum
  return 'ordinary';
}
