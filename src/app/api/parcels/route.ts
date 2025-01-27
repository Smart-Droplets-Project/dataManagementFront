import { NextResponse } from 'next/server';
import { fetchParcels } from '@/lib/fetch/fetchParcels';

export async function GET() {
  try {
    const data = await fetchParcels();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching parcels:', error);
    return NextResponse.json({ error: 'Failed to fetch parcels' }, { status: 500 });
  }
}