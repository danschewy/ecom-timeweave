import weaviate, { ApiKey, WeaviateClient } from "weaviate-client";
let client: WeaviateClient;

export async function getClient() {
  if (!client) {
    if (!process.env.WEAVIATE_URL) {
      throw new Error("WEAVIATE_URL environment variable is not set");
    }

    console.log(
      "Initializing Weaviate client with URL:",
      process.env.WEAVIATE_URL
    );

    try {
      client = await weaviate.connectToWeaviateCloud(process.env.WEAVIATE_URL, {
        authCredentials: new weaviate.ApiKey(
          process.env.WEAVIATE_API_KEY || ""
        ),
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
    const client = await getClient();
    const productsCollection = client.collections.get("Products");

    const result = await productsCollection.query.nearText(query);
    console.log("Raw Weaviate response:", JSON.stringify(result, null, 2));

    if (!result.objects || result.objects.length === 0) {
      console.log("No products found in Weaviate response");
      return [];
    }

    // Convert the results to match our product interface
    const products = result.objects.map((product: any) => ({
      id: product.properties.productId,
      name: product.properties.name,
      description: product.properties.description,
      price: parseFloat(product.properties.price),
      image_url: product.properties.image_url,
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
    const client = await getClient();
    const reviewsCollection = client.collections.get("Reviews");

    const result = await reviewsCollection.query.nearText(query);
    return result.objects || [];
  } catch (error) {
    console.error("Review search error:", error);
    throw error;
  }
}

// Function to initialize the schema
// export async function initializeSchema() {
//   try {
//     const client = await getClient();

//     // Create Products collection
//     await client.collections.create({
//       name: "Products",
//       vectorizers: {
//         text2vecOpenAI: {
//           model: "ada",
//           modelVersion: "002",
//           type: "text",
//         },
//       },
//       properties: [
//         {
//           name: "name",
//           dataType: "text",
//         },
//         {
//           name: "description",
//           dataType: "text",
//         },
//         {
//           name: "price",
//           dataType: "number",
//         },
//         {
//           name: "productId",
//           dataType: "int",
//         },
//         {
//           name: "image_url",
//           dataType: "text",
//         },
//       ],
//     });

//     // Create Reviews collection
//     await client.collections.create({
//       name: "Reviews",
//       vectorizers: {
//         text2vecOpenAI: {
//           model: "ada",
//           modelVersion: "002",
//           type: "text",
//         },
//       },
//       properties: [
//         {
//           name: "content",
//           dataType: "text",
//         },
//         {
//           name: "rating",
//           dataType: "number",
//         },
//         {
//           name: "productId",
//           dataType: "int",
//         },
//         {
//           name: "createdAt",
//           dataType: "date",
//         },
//       ],
//     });

//     console.log("Schema initialized successfully");
//   } catch (error) {
//     console.error("Schema initialization error:", error);
//     throw error;
//   }
// }

// Function to import sample data
export async function importSampleData() {
  try {
    const client = await getClient();
    const productsCollection = client.collections.get("Products");
    const reviewsCollection = client.collections.get("Reviews");

    // Sample products data
    const products = [
      {
        name: "Running Shoes",
        price: 89.99,
        description:
          "Lightweight and durable running shoes perfect for daily training",
        image_url: "https://picsum.photos/id/1/400",
      },
      {
        name: "Wireless Earbuds",
        price: 129.99,
        description: "High-quality sound with active noise cancellation",
        image_url: "https://picsum.photos/id/2/400",
      },
      {
        name: "Smart Watch",
        price: 199.99,
        description:
          "Track your fitness and stay connected with this stylish smartwatch",
        image_url: "https://picsum.photos/id/3/400",
      },
      {
        name: "Laptop Backpack",
        price: 49.99,
        description: "Water-resistant backpack with multiple compartments",
        image_url: "https://picsum.photos/id/4/400",
      },
      {
        name: "Coffee Maker",
        price: 79.99,
        description: "Programmable coffee maker with thermal carafe",
        image_url: "https://picsum.photos/id/5/400",
      },
      {
        name: "Yoga Mat",
        price: 29.99,
        description: "Extra thick and comfortable yoga mat with carrying strap",
        image_url: "https://picsum.photos/id/6/400",
      },
      {
        name: "Desk Lamp",
        price: 39.99,
        description:
          "LED desk lamp with adjustable brightness and color temperature",
        image_url: "https://picsum.photos/id/7/400",
      },
      {
        name: "Water Bottle",
        price: 24.99,
        description: "Insulated stainless steel water bottle",
        image_url: "https://picsum.photos/id/8/400",
      },
      {
        name: "Wireless Mouse",
        price: 34.99,
        description: "Ergonomic wireless mouse with long battery life",
        image_url: "https://picsum.photos/id/9/400",
      },
      {
        name: "Plant Pot",
        price: 19.99,
        description: "Ceramic plant pot with drainage hole and saucer",
        image_url: "https://picsum.photos/id/10/400",
      },
    ];

    // Sample reviews data
    const reviews = [
      {
        product_id: 1,
        rating: 5,
        content: "Very comfortable and durable!",
        created_at: "2024-01-01",
      },
      {
        product_id: 1,
        rating: 4,
        content: "Good for running, but a bit pricey",
        created_at: "2024-01-15",
      },
      {
        product_id: 2,
        rating: 5,
        content: "Amazing sound quality!",
        created_at: "2024-01-02",
      },
      {
        product_id: 2,
        rating: 3,
        content: "Battery life could be better",
        created_at: "2024-01-16",
      },
      {
        product_id: 3,
        rating: 4,
        content: "Great fitness tracking features",
        created_at: "2024-02-03",
      },
      {
        product_id: 3,
        rating: 5,
        content: "Love the design and functionality",
        created_at: "2024-02-17",
      },
      {
        product_id: 4,
        rating: 4,
        content: "Perfect for daily commute",
        created_at: "2024-02-04",
      },
      {
        product_id: 4,
        rating: 5,
        content: "Lots of storage space",
        created_at: "2024-02-18",
      },
      {
        product_id: 5,
        rating: 3,
        content: "Makes good coffee but slow",
        created_at: "2024-03-05",
      },
      {
        product_id: 5,
        rating: 4,
        content: "Easy to clean and use",
        created_at: "2024-03-19",
      },
      {
        product_id: 6,
        rating: 5,
        content: "Very comfortable for yoga",
        created_at: "2024-03-06",
      },
      {
        product_id: 6,
        rating: 4,
        content: "Good grip and thickness",
        created_at: "2024-03-20",
      },
      {
        product_id: 7,
        rating: 5,
        content: "Perfect desk lighting",
        created_at: "2024-04-07",
      },
      {
        product_id: 7,
        rating: 4,
        content: "Love the color options",
        created_at: "2024-04-21",
      },
      {
        product_id: 8,
        rating: 4,
        content: "Keeps drinks cold for hours",
        created_at: "2024-04-08",
      },
      {
        product_id: 8,
        rating: 5,
        content: "Great size and design",
        created_at: "2024-04-22",
      },
      {
        product_id: 9,
        rating: 3,
        content: "Comfortable but connection issues",
        created_at: "2024-05-09",
      },
      {
        product_id: 9,
        rating: 4,
        content: "Good value for money",
        created_at: "2024-05-23",
      },
      {
        product_id: 10,
        rating: 5,
        content: "Beautiful design",
        created_at: "2024-05-10",
      },
      {
        product_id: 10,
        rating: 4,
        content: "Perfect size for small plants",
        created_at: "2024-05-24",
      },
    ];

    // Import products
    console.log("Importing products...");
    const productObjects = products.map((product, index) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      productId: index + 1,
      image_url: product.image_url,
    }));

    await productsCollection.data.insertMany(productObjects);
    console.log("Products imported successfully");

    // Import reviews
    console.log("Importing reviews...");
    const reviewObjects = reviews.map((review) => ({
      content: review.content,
      rating: review.rating,
      productId: review.product_id,
      createdAt: review.created_at,
    }));

    await reviewsCollection.data.insertMany(reviewObjects);
    console.log("Reviews imported successfully");
  } catch (error) {
    console.error("Data import error:", error);
    throw error;
  }
}

export default {
  semanticSearch,
  searchReviews,
  //initializeSchema,
  importSampleData,
};
