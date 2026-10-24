
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  
  const subtotal = items.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);

  const discountRate = appliedCoupon === "SHOP10" ? 0.10 : 0;

  const discount = Number((subtotal * discountRate).toFixed(2));

  const shipping = subtotal === 0
    ? 0
    : subtotal >= 100
      ? 0
      : 5;

  const total = Number((subtotal - discount + shipping).toFixed(2));

  const applyCoupon = () => {
    const enteredCoupon = coupon.trim().toUpperCase();

    if (enteredCoupon === "SHOP10" && subtotal > 0) {
      setAppliedCoupon("SHOP10");
      setCouponMessage("Coupon applied! You saved 10%.");
    } else {
      setAppliedCoupon("");
      setCouponMessage(
        subtotal === 0
          ? "Add a product before applying a coupon."
          : "Invalid coupon. Try SHOP10."
      );
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        subtotal,
        discount,
        shipping,
        total,
        coupon: appliedCoupon,
      },
    });
  };

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛍️</div>
          <h1>Your cart is waiting</h1>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="hero-button">
            Start Shopping →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">YOUR SHOPPING BAG</span>
          <h1>Shopping Cart</h1>
          <p>{items.length} different product(s) in your cart</p>
        </div>

        <Link to="/" className="continue-shopping">
          ← Continue Shopping
        </Link>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <img src={item.thumbnail} alt={item.title} />
              </div>

              <div className="cart-item-info">
                <span className="product-category">
                  {item.category?.replace(/-/g, " ")}
                </span>

                <Link
                  to={`/product/${item.id}`}
                  className="cart-item-title"
                >
                  {item.title}
                </Link>

                <strong className="cart-item-price">
                  ${item.price.toFixed(2)}
                </strong>

                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        dispatch(decreaseQuantity(item.id))
                      }
                      aria-label={`Decrease ${item.title} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(increaseQuantity(item.id))
                      }
                      aria-label={`Increase ${item.title} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-item"
                    onClick={() =>
                      dispatch(removeFromCart(item.id))
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>

              <strong className="cart-line-total">
                ${(item.price * item.quantity).toFixed(2)}
              </strong>
            </article>
          ))}
        </div>

        <aside className="order-summary">
          <h2>Order Summary</h2>

          <div className="coupon-section">
            <label htmlFor="coupon">Discount coupon</label>

            <div className="coupon-input-row">
              <input
                id="coupon"
                type="text"
                placeholder="Enter SHOP10"
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
              />

              <button onClick={applyCoupon}>Apply</button>
            </div>

            {couponMessage && (
              <p className="coupon-message">{couponMessage}</p>
            )}
          </div>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-line">
            <span>Discount</span>
            <span className="discount-value">
              −${discount.toFixed(2)}
            </span>
          </div>

          <div className="summary-line">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <p className="shipping-note">
            {subtotal >= 100
              ? "You've unlocked free shipping!"
              : `Add $${Math.max(0, 100 - subtotal).toFixed(2)} more for free shipping.`}
          </p>

          <button
            className="checkout-button"
            onClick={handleCheckout}
          >
            Proceed to Checkout →
          </button>

          <p className="demo-note">
            Demo checkout only. No real payment will be processed.
          </p>
        </aside>
      </div>
    </section>
  );
}
