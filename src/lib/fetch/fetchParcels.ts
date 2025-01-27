import { ENDPOINTS, CONTEXTS } from '@/lib/constants';
import { AgriParcel } from '@/lib/interfaces';

export const dynamic = 'force-dynamic'

export async function fetchParcels(): Promise<AgriParcel[]> {
  const searchParams = {
    type: 'AgriParcel',
    limit: '10',
  };

  const urlQuery = new URLSearchParams(searchParams).toString();
  const url = new URL(`${ENDPOINTS.API_BASE_URL}?${urlQuery}`).toString();

  const response = await fetch(url, {
    headers: {
      Link: CONTEXTS.AGRIFARM,
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}