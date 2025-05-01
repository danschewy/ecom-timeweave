import { importSampleData } from "../src/lib/weaviate";

async function main() {
  try {
    console.log("Starting data import...");
    await importSampleData();
    console.log("Data import completed successfully");
  } catch (error) {
    console.error("Data import failed:", error);
    process.exit(1);
  }
}

main();
