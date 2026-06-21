export const validPlatforms = [
    'br1','eun1','euw1','jp1','kr','la1','la2',
    'me1','na1','oc1','ru','sg2','tr1','tw2','vn2',
] as const;
// SEA is sg2
// turkey is tr1
// taiwan is tw2


export type Platform = (typeof validPlatforms)[number];

const platformToRegionalRoute: Record<Platform, string> = {
  'na1': 'americas',
  'br1': 'americas',
  'la1': 'americas',
  'la2': 'americas',

  'eun1': 'europe',
  'euw1': 'europe',
  'me1': 'europe',
  'tr1': 'europe',
  'ru': 'europe',

  'kr': 'asia',
  'jp1': 'asia',

  'oc1': 'sea',
  'sg2': 'sea',
  'tw2': 'sea',
  'vn2': 'sea',
}

export function isValidPlatform(value: string): value is Platform {
  return validPlatforms.includes(value as Platform);
}

export function getRegionalRoute(platform: Platform): string {
  return platformToRegionalRoute[platform];
}
