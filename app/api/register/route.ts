import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const now = new Date();
    const date = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
    const time = now.toLocaleTimeString("en-GB"); // HH:MM:SS
    // Do not rename or alter field names, just add date and time
    const dataWithDate = { ...data, date, time };
    const googleSheetsUrl = "https://script.google.com/macros/s/AKfycbyoLL8lQyXfjYkL0nyaWnbpYFcIyXzFC-Tjv9SKv-slCfWlMAP3W19IjtbTTwziRbgk/exec";

    const response = await fetch(googleSheetsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataWithDate),
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit data" }, { status: 500 });
  }
} 