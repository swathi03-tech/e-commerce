
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { clearCart } from "../redux/cartSlice";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });

  const [error, setError] = useState("");

  
const checkoutSummary = location.state || {};

const subtotal = cartItems.reduce(
  (total, item) => total + Number(item.price) * item.quantity,
  0
);

const discount = Number(checkoutSummary.discount ?? 0);

const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 5;

const total = Math.max(
  0,
  subtotal - discount + shipping
);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add products first.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    const order = {
      orderId: `SK${Date.now()}`,
      customer: form,
      items: cartItems,
      total,
      createdAt: new Date().toISOString(),
    };

    // Demo order only; this does not process a real payment.
    sessionStorage.setItem("shopkart-last-order", JSON.stringify(order));

    dispatch(clearCart());

    navigate("/", {
      state: {
        orderPlaced: true,
        orderId: order.orderId,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <section className="checkout-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Add some products before proceeding to checkout.</p>
          <Link to="/" className="checkout-button">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-heading">
        <span className="eyebrow">ALMOST YOURS</span>
        <h1>Checkout</h1>
        <p>Enter your delivery details to complete your demo order.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-panel">
            <h2>1. Delivery Information</h2>

            <div className="checkout-fields">
              <div className="form-group">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkout-email">Email address</label>
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Street address</label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  autoComplete="address-level2"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pincode">PIN code</label>
                <input
                  id="pincode"
                  name="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  autoComplete="postal-code"
                  required
                />
              </div>
            </div>
          </section>

          <section className="checkout-panel">
            <h2>2. Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={form.paymentMethod === "Cash on Delivery"}
                onChange={handleChange}
              />

              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives</small>
              </span>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="Demo Online Payment"
                checked={form.paymentMethod === "Demo Online Payment"}
                onChange={handleChange}
              />

              <span>
                <strong>Online Payment (Demo)</strong>
                <small>No real payment will be processed</small>
              </span>
            </label>
          </section>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="checkout-button">
            Place Demo Order · ${total.toFixed(2)}
          </button>

          <Link to="/cart" className="checkout-back-link">
            ← Return to cart
          </Link>
        </form>

        <aside className="checkout-panel checkout-order-summary">
          <h2>Order Summary</h2>

          <div className="checkout-product-list">
            {cartItems.map((item) => (
              <div className="checkout-product" key={item.id}>
                <img src={item.thumbnail} alt={item.title} />

                <div className="checkout-product-info">
                  <strong>{item.title}</strong>
                  <small>Qty: {item.quantity}</small>
                </div>

                <span>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

         
<div className="summary-line">
  <span>Subtotal</span>
  <span>${subtotal.toFixed(2)}</span>
</div>

<div className="summary-line discount-value">
  <span>
    Discount {checkoutSummary.coupon ? `(${checkoutSummary.coupon})` : ""}
  </span>
  <span>-${discount.toFixed(2)}</span>
</div>

<div className="summary-line">
  <span>Shipping</span>
  <span>
    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
  </span>
</div>


          <div className="summary-line summary-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <p className="checkout-security-note">
            Demo checkout only. No real payment or shipment is created.
          </p>
        </aside>
      </div>
    </section>
  );
}
