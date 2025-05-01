import { importData } from "../src/lib/weaviate";

async function main() {
  try {
    console.log("Importing data from PostgreSQL to Weaviate...");
    await importData();
    console.log("Data imported successfully");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
