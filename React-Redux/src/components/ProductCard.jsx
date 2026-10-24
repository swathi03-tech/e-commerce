
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  if (!product) return null;

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-card-image"
      >
        <img
          src={product.thumbnail || product.image}
          alt={product.title}
          loading="lazy"
        />
      </Link>

      <div className="product-card-content">
        <span className="product-category">
          {String(product.category || "Product").replace(/-/g, " ")}
        </span>

        <Link
          to={`/product/${product.id}`}
          className="product-card-title"
        >
          <h3>{product.title}</h3>
        </Link>

        <p className="product-card-rating">
          ★ {product.rating ?? "N/A"}
        </p>

        <div className="product-card-bottom">
          <strong>${Number(product.price || 0).toFixed(2)}</strong>

          <button
            type="button"
            className="add-cart-button"
            onClick={() => dispatch(addToCart(product))}
          >
            Add to Cart
          </button>
        </div>

        <button
          type="button"
          className={`wishlist-button ${isWishlisted ? "wishlisted" : ""}`}
          onClick={handleWishlist}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          {isWishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
        </button>
      </div>
    </article>
  );
}
