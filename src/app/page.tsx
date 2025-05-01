"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((productsData) => {
        setProducts(productsData);
        setLoading(false);
      });
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      console.log("Searching for:", query);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error(`Search failed with status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Search results:", data);
      setProducts(data);
    } catch (error) {
      console.error("Search error:", error);
      // Show error state to user
      setProducts([]);
    }
    setLoading(false);
  };

  const handleAddToCart = (productId: number) => {
    setCartCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            border: "2px solid #3B82F6",
            borderTop: "2px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <header
        style={{
          backgroundColor: "white",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            TimeWeave Shop
          </h1>
          <Cart itemCount={cartCount} />
        </div>
      </header>

      <main
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#111827",
            }}
          >
            Products
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
