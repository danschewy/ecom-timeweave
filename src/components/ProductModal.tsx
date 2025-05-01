import { StarIcon } from "@heroicons/react/24/outline";

interface Review {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  product_name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface ProductModalProps {
  product: Product | null;
  reviews: Review[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  reviews,
  isOpen,
  onClose,
}: ProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "48rem",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              right: "1rem",
              top: "1rem",
              color: "#9CA3AF",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          <div style={{ display: "flex", gap: "2rem" }}>
            <div
              style={{
                position: "relative",
                width: "16rem",
                height: "16rem",
                flexShrink: 0,
              }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "0.5rem",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#111827",
                }}
              >
                {product.name}
              </h2>
              <p
                style={{
                  color: "#4B5563",
                  marginBottom: "1rem",
                }}
              >
                {product.description}
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              Reviews
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                    paddingBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            color: i < review.rating ? "#FBBF24" : "#D1D5DB",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#6B7280",
                      }}
                    >
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: "#374151" }}>{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
