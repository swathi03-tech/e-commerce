import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../redux/productsSlice";
import { addToCart } from "../redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const product = products.find((item) => String(item.id) === id);

  const [selectedImage, setSelectedImage] = useState("");
  const [notice, setNotice] = useState("");
  const [detailLoading, setDetailLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [httpStatus, setHttpStatus] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let loadingTimer;

    const startedAt = Date.now();

    setDetailLoading(true);
    setRequestError("");
    setHttpStatus(null);

    async function checkProductRequest() {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        if (!active) return;

        setHttpStatus(response.status);

        console.info(
          `[ShopKart] Product API status: ${response.status} ${response.statusText}`
        );

        if (!response.ok) {
          console.error(
            `[ShopKart] HTTP ${response.status}: ${
              response.statusText || "Request failed"
            }`
          );

          if (response.status === 404) {
            setRequestError("Product not found.");
          }

          return;
        }

        const data = await response.json();

        if (!active) return;

        if (!data || data.id == null) {
          console.warn("[ShopKart] Product missing from API response.");
          setRequestError("Product not found.");
          setHttpStatus(404);
        }
      } catch (err) {
        if (err.name === "AbortError" || !active) return;

        console.error("[ShopKart] Network error:", err);
        console.error(
          "[ShopKart] No HTTP status received because the request failed."
        );

        setRequestError(
          "Network error. Please check your internet connection and try again."
        );
        setHttpStatus(null);
      } finally {
        if (active) {
          const remaining = Math.max(
            0,
            1500 - (Date.now() - startedAt)
          );

          loadingTimer = setTimeout(() => {
            if (active) setDetailLoading(false);
          }, remaining);
        }
      }
    }

    checkProductRequest();

    return () => {
      active = false;
      controller.abort();
      clearTimeout(loadingTimer);
    };
  }, [id]);

  useEffect(() => {
    if (products.length === 0 && !loading && !error) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length, loading, error]);

  const productImages = product
    ? [
        ...new Set(
          [product.thumbnail, ...(product.images || [])].filter(Boolean)
        ),
      ].slice(0, 4)
    : [];

  useEffect(() => {
    setSelectedImage(productImages[0] || "");
  }, [product?.id, product?.thumbnail]);


  if (detailLoading || (loading && !product)) {
    return (
      <div className="details-message">
        <div className="loading-spinner" />
        <p>Loading product details...</p>
      </div>
    );
  }


  if (requestError && httpStatus === null) {
    return (
      <div className="details-message">
        <h2>Network Error</h2>
        <p>{requestError}</p>
        <button
          className="details-cart-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
        <p>
          <Link to="/" className="details-cart-link">
            Back to Shopping
          </Link>
        </p>
      </div>
    );
  }

  if (httpStatus === 404) {
    return (
      <div className="details-message">
        <h2>Product not found</h2>
        <Link to="/" className="details-cart-link">
          Back to Shopping
        </Link>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="details-message">
        <h2>Unable to load this product</h2>
        <p>{error}</p>
        <button
          className="details-cart-button"
          onClick={() => dispatch(fetchProducts())}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="details-message">
        <h2>Product not found</h2>
        <Link to="/" className="details-cart-link">
          Back to Shopping
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setNotice("Product added to your cart!");
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      setNotice("Removed from your wishlist.");
    } else {
      dispatch(addToWishlist(product));
      setNotice("Product added to your wishlist!");
    }
  };

  return (
    <section className="details-page">
      <div className="details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{product.category?.replace(/-/g, " ")}</span>
        <span>/</span>
        <span>{product.title}</span>
      </div>

      {notice && (
        <div className="shop-notice" role="status">
          {notice}
          <button type="button" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}

      <div className="details-layout">
        <div className="details-gallery">
          <div className="details-image-panel">
            <img
              className="details-main-image"
              src={selectedImage || product.thumbnail}
              alt={product.title}
            />
          </div>

          <div className="details-thumbnails">
            {productImages.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`details-thumbnail ${
                  selectedImage === image ? "active" : ""
                }`}
                onClick={() => setSelectedImage(image)}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={selectedImage === image}
              >
                <img
                  src={image}
                  alt={`${product.title} view ${index + 1}`}
                />
              </button>
            ))}
          </div>

          <p className="details-image-caption">
            Select an image to view it larger.
          </p>
        </div>

        <div className="details-info">
          <span className="product-category">
            {product.category?.replace(/-/g, " ")}
          </span>

          <h1>{product.title}</h1>

          <div className="details-rating">
            <span>★</span> {product.rating || "N/A"}
            <span className="details-rating-label">Customer rating</span>
          </div>

          <div className="details-price">
            <strong>${Number(product.price).toFixed(2)}</strong>

            {product.discountPercentage > 0 && (
              <span className="product-discount">
                {Math.round(product.discountPercentage)}% off
              </span>
            )}
          </div>

          <p className="details-description">{product.description}</p>

          {product.brand && (
            <p className="details-brand">
              <strong>Brand:</strong> {product.brand}
            </p>
          )}

          <p className="details-stock">
            <span>✓</span> Product available
          </p>

          <div className="details-shipping">
            <div>
              <span>♧</span>
              <p>
                <strong>Easy shopping</strong>
                <small>Simple and convenient ordering</small>
              </p>
            </div>

            <div>
              <span>♡</span>
              <p>
                <strong>Your favourites</strong>
                <small>Save products to your wishlist</small>
              </p>
            </div>
          </div>

          <div className="details-actions">
            <button
              type="button"
              className="details-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              type="button"
              className="details-wishlist-button"
              onClick={handleWishlist}
            >
              {isWishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
            </button>
          </div>

          <Link to="/cart" className="details-cart-link">
            View Cart →
          </Link>
        </div>
      </div>
    </section>
  );
}
