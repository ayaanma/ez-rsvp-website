import { NextRequest, NextResponse } from "next/server";

type NominatimResult = {
  display_name?: string;
  lat?: string;
  lon?: string;
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "us");
  url.searchParams.set("q", query);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "ez-rsvp-address-search/1.0",
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { suggestions: [], error: "Address search failed." },
        { status: 502 }
      );
    }

    const results = (await response.json()) as NominatimResult[];

    const suggestions = results
      .map((item) => ({
        label: item.display_name ?? "",
        lat: Number(item.lat),
        lon: Number(item.lon),
      }))
      .filter(
        (item) =>
          item.label && Number.isFinite(item.lat) && Number.isFinite(item.lon)
      );

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json(
      { suggestions: [], error: "Address search is temporarily unavailable." },
      { status: 500 }
    );
  }
}
