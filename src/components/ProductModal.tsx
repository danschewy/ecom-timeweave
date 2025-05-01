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

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicks inside modal from closing it
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        overflowY: "auto",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClose}
    >
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
          onClick={handleModalClick}
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
              border: "none",
              background: "none",
              fontSize: "1.25rem",
              padding: "0.5rem",
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
              Reviews ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <p style={{ color: "#6B7280", fontStyle: "italic" }}>
                No reviews yet for this product.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  maxHeight: "400px",
                  overflowY: "auto",
                  padding: "0.5rem",
                }}
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
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
                              fill: i < review.rating ? "#FBBF24" : "none",
                              color: i < review.rating ? "#FBBF24" : "#D1D5DB",
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ color: "#6B7280", fontSize: "0.875rem" }}>
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                    <p style={{ color: "#4B5563" }}>{review.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
