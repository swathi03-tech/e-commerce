
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        display: "block",
        width: "100%",
        boxSizing: "border-box",
        background: "#1B1F2A",
        color: "#FFFFFF",
        padding: "32px 6% 16px",
        marginTop: "48px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "28px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              color: "#FFFFFF",
              fontSize: "26px",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            ShopKart<span style={{ color: "#C2410C" }}>.</span>
          </Link>
          <p style={{ color: "#D0D3DA", lineHeight: "1.7" }}>
            Discover products you love and enjoy a simple shopping experience.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <p><Link to="/" style={{ color: "#D0D3DA" }}>Home</Link></p>
          <p><Link to="/cart" style={{ color: "#D0D3DA" }}>Shopping Cart</Link></p>
          <p><Link to="/wishlist" style={{ color: "#D0D3DA" }}>Wishlist</Link></p>
        </div>

        <div>
          <h3>Customer Experience</h3>
          <p style={{ color: "#D0D3DA" }}>Easy shopping</p>
          <p style={{ color: "#D0D3DA" }}>Browse your favourite products</p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "24px auto 0",
          paddingTop: "16px",
          borderTop: "1px solid #454956",
          textAlign: "center",
          color: "#D0D3DA",
          fontSize: "13px",
        }}
      >
        © {new Date().getFullYear()} ShopKart. All rights reserved.
      </div>
    </footer>
  );
}
