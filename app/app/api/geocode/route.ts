import { NextRequest, NextResponse } from "next/server";

type CensusMatch = {
  matchedAddress?: string;
  coordinates?: {
    x?: number;
    y?: number;
  };
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  const url = new URL(
    "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"
  );
  url.searchParams.set("address", query);
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("format", "json");

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const data = await response.json();
    const matches = (data?.result?.addressMatches ?? []) as CensusMatch[];

    const suggestions = matches
      .map((match) => ({
        label: match.matchedAddress ?? "",
        lat: match.coordinates?.y,
        lng: match.coordinates?.x,
      }))
      .filter(
        (item) =>
          item.label && typeof item.lat === "number" && typeof item.lng === "number"
      )
      .slice(0, 6);

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
