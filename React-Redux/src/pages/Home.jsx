
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { fetchProducts } from "../redux/productsSlice";
import { addToCart } from "../redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistSlice";

export default function Home() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [orderMessage, setOrderMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (location.state?.orderPlaced) {
      setOrderMessage(
        `Order placed successfully! Your order ID is ${location.state.orderId}.`
      );

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [location.state]);

  useEffect(() => {
    if (products.length === 0 && !loading) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length, loading]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
    }

    return result;
  }, [products, search, category, sort]);


  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setNotice(`${product.title} added to cart`);
    setTimeout(() => setNotice(""), 2500);
  };

  const handleWishlist = (product) => {
    const isWishlisted = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      setNotice(`${product.title} removed from wishlist`);
    } else {
      dispatch(addToWishlist(product));
      setNotice(`${product.title} added to wishlist`);
    }

    setTimeout(() => setNotice(""), 2500);
  };

  return (
    <div className="shop-page">
      {orderMessage && (
        <div className="order-success" role="status">
          <span>✓</span>

          <div>
            <strong>Thank you for your order!</strong>
            <p>{orderMessage}</p>
          </div>

          <button
            type="button"
            onClick={() => setOrderMessage("")}
            aria-label="Dismiss order confirmation"
          >
            ×
          </button>
        </div>
      )}

      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">
            YOUR EVERYDAY SHOPPING DESTINATION
          </span>

          <h1>
            Find your next <span>favorite thing.</span>
          </h1>

          <p>
            Discover great products, explore your style, and enjoy
            a simpler way to shop.
          </p>

          <a href="#products" className="hero-button">
            Explore Products <span>→</span>
          </a>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-circle">
            <span className="hero-bag">🛍️</span>
            <span className="floating-tag tag-one">Great finds</span>
            <span className="floating-tag tag-two">♡</span>
            <span className="floating-tag tag-three">Shop your way</span>
          </div>
        </div>
      </section>

      {notice && (
        <div className="shop-notice" role="status">
          {notice}
        </div>
      )}

      <section className="products-section" id="products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">OUR COLLECTION</span>
            <h2>Explore Products</h2>
            <p>Find something you'll love.</p>
          </div>

          <span className="product-total">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="shop-toolbar">
          <input
            type="search"
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item.replace(/-/g, " ")}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Sort: Recommended</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {loading && products.length === 0 && (
          <div className="products-message">
            <div className="loading-spinner" />
            <p>Finding great products for you...</p>
          </div>
        )}

        {error && (
          <div className="products-message error-message">
            <h3>Unable to load products</h3>
            <p>{error}</p>

            <button
              className="primary-button"
              onClick={() => dispatch(fetchProducts())}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="products-message">
            <span className="empty-icon">⌕</span>
            <h3>No products found</h3>
            <p>Try another search or select a different category.</p>
          </div>
        )}

        <div className="product-grid">
          {paginatedProducts.map((product) => {
            const isWishlisted = wishlistItems.some(
              (item) => item.id === product.id
            );

            return (
              <article className="product-card" key={product.id}>
                <Link
                  to={`/product/${product.id}`}
                  className="product-image-link"
                  aria-label={`View ${product.title}`}
                >
                  <div className="product-image">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                    />
                  </div>
                </Link>

                <div className="product-info">
                  <span className="product-category">
                    {product.category.replace(/-/g, " ")}
                  </span>

                  <Link
                    to={`/product/${product.id}`}
                    className="product-title"
                  >
                    {product.title}
                  </Link>

                  <div className="product-rating">
                    <span>★</span> {product.rating ?? "N/A"}
                  </div>

                  <div className="product-price-row">
                    <strong>
                      ${Number(product.price).toFixed(2)}
                    </strong>

                    {product.discountPercentage > 0 && (
                      <span className="product-discount">
                        {Math.round(product.discountPercentage)}% off
                      </span>
                    )}
                  </div>

                  <div className="product-actions">
                    <button
                      type="button"
                      className="add-cart-button"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      className={`wishlist-button ${
                        isWishlisted ? "wishlisted" : ""
                      }`}
                      onClick={() => handleWishlist(product)}
                      aria-label={
                        isWishlisted
                          ? `Remove ${product.title} from wishlist`
                          : `Add ${product.title} to wishlist`
                      }
                      title={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      {isWishlisted ? "♥" : "♡"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!loading && !error && totalPages > 1 && (
          <>
            <div className="pagination-info">
              Showing {startIndex + 1}–
              {Math.min(
                startIndex + productsPerPage,
                filteredProducts.length
              )}{" "}
              of {filteredProducts.length} products
            </div>

            <nav className="pagination" aria-label="Product pages">
              <button
                type="button"
                className="pagination-arrow"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((page) => page - 1);
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                ← Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={
                    currentPage === page ? "active" : ""
                  }
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                  onClick={() => {
                    setCurrentPage(page);
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="pagination-arrow"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((page) => page + 1);
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Next →
              </button>
            </nav>
          </>
        )}
      </section>
    </div>
  );
}
