import { NextResponse } from "next/server";
import { Pool } from "pg";
import { semanticSearch } from "@/lib/weaviate";

const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "products";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    if (type === "products") {
      try {
        // Use semantic search for products
        const results = await semanticSearch(query);
        return NextResponse.json(results);
      } catch (error) {
        console.error(
          "Semantic search failed, falling back to regular search:",
          error
        );
        // Fallback to regular search if semantic search fails
        const result = await pgPool.query(
          `SELECT * FROM products 
           WHERE name ILIKE $1 
           OR description ILIKE $1 
           ORDER BY id ASC`,
          [`%${query}%`]
        );

        const products = result.rows.map((row) => ({
          ...row,
          price: parseFloat(row.price),
        }));

        return NextResponse.json(products);
      }
    } else if (type === "reviews") {
      // Regular text search for reviews
      const result = await pgPool.query(
        `SELECT * FROM reviews 
         WHERE content ILIKE $1 
         ORDER BY created_at DESC`,
        [`%${query}%`]
      );
      return NextResponse.json(result.rows);
    }

    return NextResponse.json({ error: "Invalid search type" }, { status: 400 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
