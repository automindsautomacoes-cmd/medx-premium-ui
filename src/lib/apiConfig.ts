import { getSystemSetting } from '@/hooks/useSystemSettings';

let cachedConfig: {
  apiBaseUrl: string;
  timeout: number;
  lastFetch: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export async function getApiBaseUrl(): Promise<string> {
  if (cachedConfig && Date.now() - cachedConfig.lastFetch < CACHE_DURATION) {
    return cachedConfig.apiBaseUrl;
  }

  const url = await getSystemSetting('api_base_url');
  
  if (!url) {
    throw new Error('Configuração "api_base_url" não encontrada no banco de dados.');
  }

  if (!cachedConfig) {
    const timeoutStr = await getSystemSetting('api_timeout');
    const timeout = timeoutStr ? parseInt(timeoutStr, 10) : 30000;
    
    cachedConfig = {
      apiBaseUrl: url,
      timeout: !isNaN(timeout) ? timeout : 30000,
      lastFetch: Date.now(),
    };
  } else {
    cachedConfig.apiBaseUrl = url;
    cachedConfig.lastFetch = Date.now();
  }
  
  return url;
}

export async function getApiTimeout(): Promise<number> {
  if (cachedConfig && Date.now() - cachedConfig.lastFetch < CACHE_DURATION) {
    return cachedConfig.timeout;
  }

  const timeout = await getSystemSetting('api_timeout');
  
  if (!timeout) {
    throw new Error('Configuração "api_timeout" não encontrada no banco de dados.');
  }

  const timeoutNum = parseInt(timeout, 10);
  
  if (isNaN(timeoutNum)) {
    throw new Error(`Configuração "api_timeout" possui valor inválido: ${timeout}.`);
  }

  if (!cachedConfig) {
    const url = await getSystemSetting('api_base_url');
    
    cachedConfig = {
      apiBaseUrl: url || '',
      timeout: timeoutNum,
      lastFetch: Date.now(),
    };
  } else {
    cachedConfig.timeout = timeoutNum;
    cachedConfig.lastFetch = Date.now();
  }
  
  return timeoutNum;
}

export function clearApiConfigCache(): void {
  cachedConfig = null;
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = await getApiBaseUrl();
  const timeout = await getApiTimeout();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
