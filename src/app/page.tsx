"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import ProductModal from "@/components/ProductModal";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

interface Review {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  product_name: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState("products");
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((productsData) => {
        setProducts(productsData);
        setLoading(false);
      });
  }, []);

  const handleProductClick = async (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);

    try {
      const res = await fetch(`/api/reviews?productId=${product.id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch reviews: ${res.status}`);
      }
      const reviewsData = await res.json();
      setProductReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setProductReviews([]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setProductReviews([]);
  };

  const handleAddToCart = (productId: number) => {
    setCartCount((prev) => prev + 1);
  };

  const handleSearch = async (query: string, type: string) => {
    setLoading(true);
    setError(null);
    setSearchType(type);

    try {
      console.log("Searching for:", query, "type:", type);
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}`
      );
      if (!res.ok) {
        throw new Error(`Search failed with status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Search results:", data);

      if (type === "products") {
        setProducts(data);
        setReviews([]);
      } else {
        setReviews(data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to perform search. Please try again.");
      if (type === "products") {
        setProducts([]);
      } else {
        setReviews([]);
      }
    }
    setLoading(false);
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

        {error && (
          <div
            style={{
              textAlign: "center",
              color: "#EF4444",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: "#6B7280",
              marginTop: "2rem",
            }}
          >
            Loading...
          </div>
        ) : searchType === "products" ? (
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
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: "pointer" }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              Reviews
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    backgroundColor: "white",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ fontWeight: "500" }}>
                      Rating: {review.rating}/5
                    </div>
                    <div style={{ color: "#6B7280" }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p style={{ color: "#4B5563" }}>{review.content}</p>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    Product: {review.product_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        reviews={productReviews}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

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
