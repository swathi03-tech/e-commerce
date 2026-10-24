
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { removeFromWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";

export default function Wishlist() {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.wishlist.items);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (items.length === 0) {
    return (
      <section className="wishlist-page">
        <div className="empty-wishlist">
          <div className="wishlist-empty-icon">♡</div>
          <h1>Your wishlist is empty</h1>
          <p>Save the products you love and find them here later.</p>
          <Link to="/" className="hero-button">
            Explore Products →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="wishlist-page">
      <div className="wishlist-heading">
        <div>
          <span className="eyebrow">YOUR FAVORITES</span>
          <h1>My Wishlist ♡</h1>
          <p>{items.length} saved product(s)</p>
        </div>

        <Link to="/" className="continue-shopping">
          ← Continue Shopping
        </Link>
      </div>

      <div className="wishlist-grid">
        {items.map((product) => (
          <article className="wishlist-card" key={product.id}>
            <Link
              to={`/product/${product.id}`}
              className="wishlist-image"
            >
              <img src={product.thumbnail} alt={product.title} />
            </Link>

            <div className="wishlist-card-info">
              <span className="product-category">
                {product.category?.replace(/-/g, " ")}
              </span>

              <Link
                to={`/product/${product.id}`}
                className="product-title"
              >
                {product.title}
              </Link>

              <div className="wishlist-price">
                ${product.price.toFixed(2)}
              </div>

              <div className="wishlist-actions">
                <button
                  className="add-cart-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>

                <button
                  className="remove-wishlist-button"
                  onClick={() =>
                    dispatch(removeFromWishlist(product.id))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
