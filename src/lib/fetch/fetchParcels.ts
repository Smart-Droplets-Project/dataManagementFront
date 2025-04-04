import { ENDPOINTS, CONTEXTS } from "@/lib/constants";
import { AgriParcel } from "@/lib/interfaces";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function fetchParcels(): Promise<AgriParcel[]> {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const searchParams = {
    type: "AgriParcel",
    limit: "10",
  };

  const urlQuery = new URLSearchParams(searchParams).toString();
  const url = `${ENDPOINTS.API_BASE_URL}?${urlQuery}`;

  const response = await fetch(url, {
    headers: {
      Link: CONTEXTS.AGRIFARM,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}