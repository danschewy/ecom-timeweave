import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
    >
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
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
  );
}
