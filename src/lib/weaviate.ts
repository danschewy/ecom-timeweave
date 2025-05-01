import weaviate, { WeaviateClient, ApiKey } from "weaviate-ts-client";

let client: WeaviateClient;

export function getClient() {
  if (!client) {
    if (!process.env.WEAVIATE_URL) {
      throw new Error("WEAVIATE_URL environment variable is not set");
    }

    console.log(
      "Initializing Weaviate client with URL:",
      process.env.WEAVIATE_URL
    );

    try {
      client = weaviate.client({
        scheme: process.env.WEAVIATE_URL.startsWith("https") ? "https" : "http",
        host: process.env.WEAVIATE_URL.replace(/^https?:\/\//, ""),
        apiKey: new ApiKey(process.env.WEAVIATE_API_KEY || ""),
        headers: {
          "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY || "",
        },
      });
      console.log("Weaviate client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Weaviate client:", error);
      throw error;
    }
  }
  return client;
}

export async function semanticSearch(query: string) {
  try {
    console.log("Performing semantic search for:", query);
    const client = getClient();

    // First, let's check if we have any products at all
    const countResult = await client.graphql
      .aggregate()
      .withClassName("Product")
      .withFields("meta { count }")
      .do();

    console.log(
      "Total products in Weaviate:",
      countResult.data.Aggregate.Product[0].meta.count
    );

    const result = await client.graphql
      .get()
      .withClassName("Product")
      .withFields("name description price productId image_url")
      .withNearText({
        concepts: [query],
      })
      .withLimit(10)
      .do();

    console.log("Raw Weaviate response:", JSON.stringify(result, null, 2));

    if (!result.data.Get.Product) {
      console.log("No products found in Weaviate response");
      return [];
    }

    // Convert the results to match our product interface
    const products = result.data.Get.Product.map((product: any) => ({
      id: product.productId,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      image_url: product.image_url,
    }));

    console.log("Processed search results:", products);
    return products;
  } catch (error) {
    console.error("Semantic search error:", error);
    throw error;
  }
}

export async function searchReviews(query: string) {
  try {
    const client = getClient();

    const result = await client.graphql
      .get()
      .withClassName("Review")
      .withFields("content rating productId createdAt")
      .withNearText({
        concepts: [query],
      })
      .withLimit(5)
      .do();

    return result.data.Get.Review || [];
  } catch (error) {
    console.error("Review search error:", error);
    throw error;
  }
}

// Function to initialize the schema
export async function initializeSchema() {
  try {
    const client = getClient();

    // Check if schema exists
    const schema = await client.schema.getter().do();
    const productClassExists = schema.classes?.some(
      (c) => c.class === "Product"
    );
    const reviewClassExists = schema.classes?.some((c) => c.class === "Review");

    if (!productClassExists) {
      await client.schema
        .classCreator()
        .withClass({
          class: "Product",
          vectorizer: "text2vec-openai",
          moduleConfig: {
            "text2vec-openai": {
              model: "ada",
              modelVersion: "002",
              type: "text",
            },
          },
          properties: [
            {
              name: "name",
              dataType: ["text"],
            },
            {
              name: "description",
              dataType: ["text"],
            },
            {
              name: "price",
              dataType: ["number"],
            },
            {
              name: "productId",
              dataType: ["int"],
            },
            {
              name: "image_url",
              dataType: ["text"],
            },
          ],
        })
        .do();
    }

    if (!reviewClassExists) {
      await client.schema
        .classCreator()
        .withClass({
          class: "Review",
          vectorizer: "text2vec-openai",
          moduleConfig: {
            "text2vec-openai": {
              model: "ada",
              modelVersion: "002",
              type: "text",
            },
          },
          properties: [
            {
              name: "content",
              dataType: ["text"],
            },
            {
              name: "rating",
              dataType: ["number"],
            },
            {
              name: "productId",
              dataType: ["int"],
            },
            {
              name: "createdAt",
              dataType: ["date"],
            },
          ],
        })
        .do();
    }
  } catch (error) {
    console.error("Schema initialization error:", error);
    throw error;
  }
}

// Function to import data from PostgreSQL to Weaviate
export async function importData() {
  try {
    const client = getClient();
    const { Pool } = require("pg");

    const pgPool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });

    // Import products
    const products = await pgPool.query("SELECT * FROM products");
    for (const product of products.rows) {
      await client.data
        .creator()
        .withClassName("Product")
        .withProperties({
          name: product.name,
          description: product.description,
          price: product.price,
          productId: product.id,
          image_url: product.image_url,
        })
        .do();
    }

    // Import reviews
    const reviews = await pgPool.query("SELECT * FROM reviews");
    for (const review of reviews.rows) {
      await client.data
        .creator()
        .withClassName("Review")
        .withProperties({
          content: review.content,
          rating: review.rating,
          productId: review.product_id,
          createdAt: review.created_at,
        })
        .do();
    }
  } catch (error) {
    console.error("Data import error:", error);
    throw error;
  }
}

export default {
  semanticSearch,
  searchReviews,
  initializeSchema,
  importData,
};
