import { useRouter } from "next/navigation";

export default function TourList({ tours }) {
  const router = useRouter();

  if (!tours || tours.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
        <label>No tours yet</label>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {tours.map((tour) => (
        <div
          key={tour.id}
          onClick={() => router.push(`/trips/${tour.id}`)}
          style={{
            backgroundColor: "white",
            border: "2px solid #d1fae5",
            borderRadius: "12px",
            padding: "20px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#10b981";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#d1fae5";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#059669",
                display: "block",
                marginBottom: "4px",
              }}
            >
              {tour.name}
            </label>
            {tour.city && (
              <label style={{ fontSize: "14px", color: "#6b7280" }}>
                {tour.city}
              </label>
            )}
          </div>

          {tour.description && (
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "14px", color: "#4b5563" }}>
                {tour.description}
              </label>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            {tour.stops !== null && tour.stops !== undefined && (
              <label
                style={{
                  backgroundColor: "#d1fae5",
                  color: "#047857",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {tour.stops} stops
              </label>
            )}

            {tour.type && (
              <label
                style={{
                  backgroundColor: "#f0fdf4",
                  color: "#15803d",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  border: "1px solid #bbf7d0",
                }}
              >
                {tour.type}
              </label>
            )}
          </div>

          <div
            style={{
              borderTop: "1px solid #d1fae5",
              paddingTop: "8px",
            }}
          >
            <label style={{ fontSize: "12px", color: "#9ca3af" }}>
              Created {formatDate(tour.created_at)}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
