import { importSampleData } from "@/lib/weaviate";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await importSampleData();
    return NextResponse.json({
      success: true,
      message: "Data imported successfully",
    });
  } catch (error) {
    console.error("Import failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import data" },
      { status: 500 }
    );
  }
}
