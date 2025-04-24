import { ENDPOINTS, CONTEXTS } from "@/lib/constants";
import { AgriParcel } from "@/lib/interfaces";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function fetchParcels(): Promise<AgriParcel[]> {
  const session = await getServerSession(authOptions);

  const searchParams = {
    type: "AgriParcel",
    limit: "10",
  };

  const urlQuery = new URLSearchParams(searchParams).toString();
  const url = `${ENDPOINTS.API_BASE_URL}?${urlQuery}`;

  const response = await fetch(url, {
    headers: {
      Link: CONTEXTS.AGRIFARM,
      Authorization: `Bearer ${session.user.accessToken}`
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}