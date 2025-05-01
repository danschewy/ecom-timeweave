import { ShoppingCartIcon } from "@heroicons/react/24/outline";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "0.5rem",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", paddingTop: "75%" }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <div
        style={{
          padding: "0.75rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            marginBottom: "0.25rem",
            color: "#111827",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6B7280",
            marginBottom: "0.5rem",
            flex: 1,
          }}
        >
          {product.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product.id)}
            style={{
              backgroundColor: "#3B82F6",
              color: "white",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
