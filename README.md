# TimeWeave Shop

A mock eCommerce website built with Next.js, Tailwind CSS, Weaviate, and TimescaleDB for a 1-hour hackathon. Features semantic search, review analytics, and a simple cart system.

## Features

- Product listing with 10 mock products
- Semantic search for products and reviews using Weaviate
- Review analytics chart using TimescaleDB
- Simple cart functionality
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, react-chartjs-2
- **Backend**: Next.js API routes
- **Databases**:
  - Weaviate (semantic search)
  - TimescaleDB (review analytics)
  - PostgreSQL (product data)

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- TimescaleDB extension
- Weaviate instance
- OpenAI API key

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment variables template:

   ```bash
   cp .env.local.template .env.local
   ```

3. Update `.env.local` with your database URLs and API keys:

   ```
   POSTGRES_URL=postgresql://user:password@localhost:5432/ecommerce
   TIMESCALE_URL=postgresql://user:password@localhost:5432/timescale
   WEAVIATE_URL=http://localhost:8080
   WEAVIATE_API_KEY=your-weaviate-api-key
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Set up the databases:

   ```bash
   # PostgreSQL and TimescaleDB
   psql -U your_user -d your_database -f schema.sql

   # Weaviate schema (using the Weaviate Console)
   # Import the schema from weaviate-schema.js
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── Cart.tsx
│   ├── ProductCard.tsx
│   ├── ReviewChart.tsx
│   └── SearchBar.tsx
├── lib/
│   ├── db.ts
│   └── weaviate.ts
└── pages/
    ├── api/
    │   ├── analytics.ts
    │   ├── products.ts
    │   └── search.ts
    └── index.tsx
```

## Development Notes

- The cart is simplified and only tracks item count
- Mock data includes 10 products and 20 reviews
- Review analytics show average ratings per month
- Semantic search uses OpenAI's text embeddings

## License

MIT
