import { Pool } from "pg";

// PostgreSQL connection pool
const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// TimescaleDB connection pool
const timescalePool = new Pool({
  connectionString: process.env.TIMESCALE_URL,
});

export async function getProducts() {
  try {
    console.log("Fetching products from PostgreSQL...");
    const result = await pgPool.query("SELECT * FROM products ORDER BY id ASC");
    console.log("Found products in PostgreSQL:", result.rows.length);
    return result.rows.map((row) => ({
      ...row,
      price: parseFloat(row.price),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// export async function getReviewAnalytics() {
//   const query = `
//     WITH monthly_stats AS (
//       SELECT
//         time_bucket('1 month', created_at) as month,
//         AVG(rating) as average_rating,
//         COUNT(*) as review_count,
//         COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_reviews,
//         COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_reviews
//       FROM reviews
//       GROUP BY month
//       ORDER BY month DESC
//       LIMIT 12
//     )
//     SELECT
//       month,
//       ROUND(average_rating::numeric, 2) as average_rating,
//       review_count,
//       ROUND((positive_reviews::float / review_count * 100)::numeric, 1) as positive_percentage,
//       ROUND((negative_reviews::float / review_count * 100)::numeric, 1) as negative_percentage
//     FROM monthly_stats
//     ORDER BY month ASC;
//   `;
//   const result = await timescalePool.query(query);
//   return result.rows;
// }

export async function addToCart(productId: number) {
  // In a real app, this would interact with a cart table
  // For this hackathon, we'll just return success
  return { success: true };
}

export default {
  getProducts,
  // getReviewAnalytics,
  addToCart,
};
