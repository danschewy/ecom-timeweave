import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  onSearch: (query: string, type: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("products");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchType);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setSearchType("products")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            backgroundColor: searchType === "products" ? "#3B82F6" : "#F3F4F6",
            color: searchType === "products" ? "white" : "#374151",
            border: "none",
            cursor: "pointer",
          }}
        >
          Products
        </button>
        <button
          onClick={() => setSearchType("reviews")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            backgroundColor: searchType === "reviews" ? "#3B82F6" : "#F3F4F6",
            color: searchType === "reviews" ? "white" : "#374151",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reviews
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${searchType}...`}
            style={{
              width: "100%",
              padding: "0.5rem 2.5rem 0.5rem 2rem",
              fontSize: "0.875rem",
              border: "1px solid #E5E7EB",
              borderRadius: "0.375rem",
              outline: "none",
            }}
          />
          <MagnifyingGlassIcon
            style={{
              position: "absolute",
              left: "0.5rem",
              width: "1rem",
              height: "1rem",
              color: "#9CA3AF",
            }}
          />
          <button
            type="submit"
            style={{
              position: "absolute",
              right: "0.25rem",
              padding: "0.25rem 0.5rem",
              fontSize: "0.75rem",
              color: "white",
              backgroundColor: "#3B82F6",
              borderRadius: "0.25rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
