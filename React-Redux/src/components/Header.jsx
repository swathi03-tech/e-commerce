
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
    const navigate = useNavigate();
const isLoggedIn = Boolean(sessionStorage.getItem("shopkart-user"));

const handleLogout = () => {
  sessionStorage.removeItem("shopkart-user");
  navigate("/login");
};
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { theme, toggleTheme } = useTheme();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">S</span>
          <span>ShopKart</span>
        </Link>

        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/wishlist">
            Wishlist <span className="nav-count">{wishlistItems.length}</span>
          </NavLink>
          <NavLink to="/cart">
            Cart <span className="nav-count">{cartCount}</span>
          </NavLink>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title="Toggle theme"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          
{isLoggedIn ? (
  <button
    type="button"
    className="login-link logout-button"
    onClick={handleLogout}
  >
    Logout
  </button>
) : (
  <Link to="/login" className="login-link">
    Login
  </Link>
)}

        </div>
      </div>
    </header>
  );
}
