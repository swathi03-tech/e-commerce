import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./features/productsSlice";
import { addToCart, increase, decrease, removeFromCart, clearCart, selectTotalItems, selectTotalPrice } from "./features/cartSlice";
import { toggleWishlist, removeWishlistItem } from "./features/wishlistSlice";
import { applyPromo, removePromo } from "./features/promoSlice";
import "./styles.css";

const money = (n) => `$${Number(n || 0).toFixed(2)}`;
const categoryName = (category) => ({
  "men's clothing": "Men's clothing", "women's clothing": "Women's clothing",
  electronics: "Electronics", jewelery: "Jewellery"
}[category] || category || "Everyday essentials");

function Header() {
  const cartCount = useSelector(selectTotalItems);
  const favorites = useSelector((s) => s.wishlist.items.length);
  const [query, setQuery] = useState("");
  return <header className="header">
    <div className="header-inner">
      <Link className="brand" to="/"><span className="brand-mark">S</span>shopkart<span className="brand-dot">.</span></Link>
      <form className="search" onSubmit={(e) => { e.preventDefault(); window.location.href = query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : "/"; }}>
        <span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands and more" aria-label="Search products"/>
        <button aria-label="Search">Search</button>
      </form>
      <nav className="header-links">
        <NavLink to="/offers">Offers</NavLink>
        <NavLink to="/wishlist">♡ <span className="nav-label">Saved</span><b className="mini-count">{favorites}</b></NavLink>
        <NavLink to="/cart" className="cart-link">Bag <span className="count">{cartCount}</span></NavLink>
        <NavLink to="/login" className="account-link">Sign in</NavLink>
      </nav>
    </div>
  </header>;
}

function Footer() {
  return <footer className="footer"><div className="footer-inner"><div><Link className="brand footer-brand" to="/"><span className="brand-mark">S</span>shopkart<span className="brand-dot">.</span></Link><p>Everyday finds, elevated.</p></div><div className="footer-note">A frontend demo built with React + Redux Toolkit.<br/>Products provided by Fake Store API.</div></div></footer>;
}

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.id === product.id)
  );

  const isFavorite = useSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id)
  );

  return (
    <article className="product-card">
      <button
        className={`heart ${isFavorite ? "is-favorite" : ""}`}
        onClick={() => dispatch(toggleWishlist(product))}
        aria-label="Toggle favourite"
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      {/* Clicking the image opens the product details */}
      <Link
        to={`/product/${product.id}`}
        className="product-image"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
        />
      </Link>

      <div className="product-info">
        <p className="eyebrow">
          {categoryName(product.category)}
        </p>

        {/* Clicking the title also opens the details */}
        <Link
          to={`/product/${product.id}`}
          className="product-title"
        >
          {product.title}
        </Link>

        <p className="rating">
          ★ <strong>{product.rating?.rate ?? "New"}</strong>{" "}
          <span>({product.rating?.count ?? 0} reviews)</span>
        </p>

        <div className="price-row">
          <strong>{money(product.price)}</strong>
          <span className="old-price">
            {money(product.price * 1.18)}
          </span>
          <span className="deal">-15%</span>
        </div>

        {cartItem ? (
          <div className="stepper">
            <button onClick={() => dispatch(decrease(product.id))}>
              −
            </button>
            <strong>{cartItem.quantity}</strong>
            <button onClick={() => dispatch(increase(product.id))}>
              +
            </button>
          </div>
        ) : (
          <button
            className="button button-dark add-button"
            onClick={() => dispatch(addToCart(product))}
          >
            Add to bag <span>＋</span>
          </button>
        )}
      </div>
    </article>
  );
}

function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.products);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  useEffect(() => { if (status === "idle") dispatch(fetchProducts()); }, [dispatch, status]);
  const categories = ["all", "electronics", "jewelery", "men's clothing", "women's clothing"];
  const filtered = useMemo(() => {
    let result = items.filter((p) => (category === "all" || p.category === category) && p.title.toLowerCase().includes(query.toLowerCase()));
    if (sort === "low") result = [...result].sort((a,b) => a.price-b.price);
    if (sort === "high") result = [...result].sort((a,b) => b.price-a.price);
    if (sort === "rating") result = [...result].sort((a,b) => (b.rating?.rate || 0)-(a.rating?.rate || 0));
    return result;
  }, [items, category, sort, query]);
  return <main className="page-shell">
    <section className="hero">
      <div className="hero-copy"><span className="hero-kicker">THE EVERYDAY EDIT · 2026</span><h1>Good finds.<br/><em>Great feeling.</em></h1><p>Thoughtfully picked essentials for your everyday — all in one place.</p><a className="button button-orange" href="#products">Explore the collection <span>↘</span></a><div className="hero-trust"><span>✦ Curated picks</span><span>↗ Easy browsing</span><span>♡ Save your favourites</span></div></div>
      <div className="hero-art"><div className="art-circle"></div><div className="art-tag tag-top">YOUR NEXT<br/>FAVOURITE THING</div><div className="art-card"><span>THE EDIT</span><strong>Little upgrades.<br/>Big everyday joy.</strong><div className="art-shapes"><i></i><i></i><i></i></div></div><div className="art-tag tag-bottom">SHOP SMART<br/>FEEL GOOD.</div><span className="art-spark">✳</span></div>
    </section>
    <section className="benefits"><div><span>↗</span><p><strong>Easy to explore</strong><small>Find your next favourite</small></p></div><div><span>♡</span><p><strong>Save what you love</strong><small>Your wishlist stays with you</small></p></div><div><span>⌁</span><p><strong>Free shipping</strong><small>On orders over $100</small></p></div><div><span>✓</span><p><strong>Demo checkout</strong><small>Practice the full journey</small></p></div></section>
    <section className="catalog" id="products">
      <div className="section-heading"><div><p className="eyebrow">MADE FOR YOUR EVERYDAY</p><h2>Shop the collection<span>.</span></h2><p className="muted">A few good things, waiting to be discovered.</p></div><label className="sort-control">Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></label></div>
      <div className="filter-row">{categories.map((c) => <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c === "all" ? "All products" : categoryName(c)}</button>)}</div>
      {status === "loading" && <div className="state-panel"><div className="loader"></div><h3>Finding the good stuff…</h3><p>Loading products from the store.</p></div>}
      {status === "failed" && <div className="state-panel"><div className="state-icon">!</div><h3>We couldn't load the collection</h3><p>{error}</p><button className="button button-dark" onClick={() => dispatch(fetchProducts())}>Try again</button></div>}
      {status === "succeeded" && <>
        <div className="results-line"><span>{query ? `Results for “${query}”` : "The current collection"}</span><span>{filtered.length} products</span></div>
        {filtered.length ? <div className="product-grid">{filtered.map((p) => <ProductCard key={p.id} product={p}/>)}</div> : <div className="state-panel"><div className="state-icon">⌕</div><h3>No products found</h3><p>Try another search or choose a different category.</p><button className="button button-dark" onClick={() => {setQuery("");setCategory("all");}}>Clear filters</button></div>}
      </>}
    </section>
    <section className="promo-strip"><div><span className="promo-label">A LITTLE TREAT</span><h2>Good things get even better.</h2><p>Use <strong>SHOP10</strong> at checkout for 10% off your demo order.</p></div><Link to="/offers" className="button button-light">Explore offers ↗</Link></section>
  </main>;
}


function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.products);

  const cartItem = useSelector((s) =>
    s.cart.items.find((p) => p.id === Number(id))
  );

  const [qty, setQty] = useState(1);
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailStatus, setDetailStatus] = useState("loading");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setDetailStatus("loading");
      setDetailProduct(null);

      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/${id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load product");
        }

        const data = await response.json();
        setDetailProduct(data);
        setDetailStatus("succeeded");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Product details error:", error);
          setDetailStatus("failed");
        }
      }
    }

    loadProduct();

    return () => controller.abort();
  }, [id]);

  // Prefer the detail API result; fall back to the Redux product list.
  const product =
    detailProduct || items.find((p) => p.id === Number(id));

  if (detailStatus === "loading" && !product) {
    return (
      <div className="state-panel page-state">
        <div className="loader" />
        <h3>Loading product…</h3>
      </div>
    );
  }

  if (detailStatus === "failed" && !product) {
    return (
      <div className="state-panel page-state">
        <h3>Unable to load this product</h3>
        <button
          className="button button-dark"
          onClick={() => {
            setDetailStatus("loading");
            setDetailProduct(null);
            // Change the ID to retry the request.
            window.location.reload();
          }}
        >
          Try again
        </button>
        <Link to="/" className="button button-dark">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="state-panel page-state">
        <h3>Product not found</h3>
        <Link to="/" className="button button-dark">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <main className="page-shell inner-page">
      <div className="breadcrumbs">
        <Link to="/">Products</Link> / {categoryName(product.category)} /{" "}
        {product.title}
      </div>

      <section className="detail-layout">
        <div className="detail-image">
          <span className="detail-badge">THE EVERYDAY EDIT</span>
          <img src={product.image} alt={product.title} />
        </div>

        <div className="detail-copy">
          <p className="eyebrow">{categoryName(product.category)}</p>
          <h1>{product.title}</h1>

          <p className="rating large-rating">
            ★ <strong>{product.rating?.rate}</strong>{" "}
            <span>({product.rating?.count} reviews)</span>
          </p>

          <div className="detail-price">
            {money(product.price)}
            <span>{money(product.price * 1.18)}</span>
            <small>DEMO 15% OFF</small>
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-perks">
            <span>✓ Free shipping on orders $100+</span>
            <span>↺ 30-day easy returns (demo)</span>
          </div>

          <div className="quantity-label">Quantity</div>

          <div className="stepper detail-stepper">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>
              −
            </button>
            <strong>{qty}</strong>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          <button
            className="button button-orange detail-add"
            onClick={() =>
              dispatch(addToCart({ ...product, quantity: qty }))
            }
          >
            Add {qty > 1 ? `${qty} items` : "to bag"} ·{" "}
            {money(product.price * qty)}
          </button>

          {cartItem && (
            <p className="success-note">
              ✓ {cartItem.quantity} currently in your bag.{" "}
              <Link to="/cart">View bag →</Link>
            </p>
          )}

          <p className="secure-note">
            ♡ Add to favourites from the product card on the collection page.
          </p>
        </div>
      </section>

      <section className="you-may-like">
        <div className="section-heading">
          <div>
            <p className="eyebrow">KEEP EXPLORING</p>
            <h2>
              You may also like<span>.</span>
            </h2>
          </div>
          <Link to="/" className="text-link">
            View all products ↗
          </Link>
        </div>

        <div className="product-grid mini-grid">
          {items
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}


function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const subtotal = useSelector(selectTotalPrice);
  const count = useSelector(selectTotalItems);
  const promo = useSelector((s) => s.promo);
  const [code, setCode] = useState("");
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 5;
  const discount = subtotal * promo.discount;
  const total = Math.max(0, subtotal - discount + shipping);
  return <main className="page-shell inner-page cart-page"><div className="section-heading cart-heading"><div><p className="eyebrow">YOUR PICKS, ALL TOGETHER</p><h1>Your shopping bag<span>.</span></h1><p className="muted">{count} {count === 1 ? "item" : "items"} ready for their next chapter.</p></div><Link to="/" className="text-link">← Continue shopping</Link></div>
    {!items.length ? <div className="empty-state"><div className="empty-art"><span>♡</span><i></i><b></b></div><p className="eyebrow">A FRESH START</p><h2>Your bag is taking a little break.</h2><p>Looks like you haven't added anything yet. Browse the collection and find something you love.</p><Link to="/" className="button button-orange">Browse products ↗</Link></div> :
    <div className="cart-layout"><section className="cart-items"><div className="cart-list-top"><span>PRODUCT DETAILS</span><button className="text-button" onClick={() => dispatch(clearCart())}>Clear bag</button></div>{items.map((item) => <article className="cart-row" key={item.id}><Link className="cart-thumb" to={`/product/${item.id}`}><img src={item.image} alt={item.title}/></Link><div className="cart-product-info"><p className="eyebrow">{categoryName(item.category)}</p><Link to={`/product/${item.id}`} className="cart-product-title">{item.title}</Link><p className="unit-price">{money(item.price)} each</p><button className="text-button remove-button" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button></div><div className="cart-row-end"><div className="stepper"><button onClick={() => dispatch(decrease(item.id))}>−</button><strong>{item.quantity}</strong><button onClick={() => dispatch(increase(item.id))}>+</button></div><strong className="line-total">{money(item.price*item.quantity)}</strong></div></article>)}</section>
      <aside className="summary-card"><p className="eyebrow">THE BREAKDOWN</p><h2>Order summary</h2><div className="summary-line"><span>Items ({count})</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Shipping</span><strong className={shipping === 0 ? "free-shipping" : ""}>{shipping === 0 ? "FREE" : money(shipping)}</strong></div>{promo.discount > 0 && <div className="summary-line discount-line"><span>Discount ({promo.code})</span><strong>−{money(discount)}</strong></div>}<div className="shipping-hint">{subtotal >= 100 ? "✓ You've unlocked free shipping!" : `You're ${money(100-subtotal)} away from free shipping.`}</div><div className="coupon-box"><label htmlFor="coupon">Have a promo code?</label><div className="coupon-input"><input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code"/><button onClick={() => {dispatch(applyPromo(code));setCode("");}}>Apply</button></div>{promo.message && <p className={promo.discount ? "coupon-message good" : "coupon-message"}>{promo.message} {promo.discount > 0 && <button className="text-button" onClick={() => dispatch(removePromo())}>Remove</button>}</p>}<small>Try SHOP10 or WELCOME15</small></div><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div><button className="button button-orange checkout-button" onClick={() => window.location.href="/checkout"}>Continue to checkout <span>→</span></button><p className="demo-disclaimer">Demo checkout only · no payment is collected.</p><div className="summary-trust">✓ Secure demo flow <span>·</span> ↺ Easy returns</div></aside></div>}
  </main>;
}

function Wishlist() {
  const items = useSelector((s) => s.wishlist.items);
  const dispatch = useDispatch();
  return <main className="page-shell inner-page"><div className="section-heading"><div><p className="eyebrow">THE THINGS YOU LOVE</p><h1>Your wishlist<span>.</span></h1><p className="muted">{items.length} saved {items.length === 1 ? "find" : "finds"} for later.</p></div><Link className="text-link" to="/">Discover more ↗</Link></div>
    {items.length ? <div className="product-grid">{items.map((p) => <ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state compact-empty"><div className="empty-heart">♡</div><h2>Keep the good ones close.</h2><p>Tap the heart on any product to save it here for later.</p><Link to="/" className="button button-orange">Find your favourites ↗</Link></div>}
    {items.length > 0 && <button className="text-button clear-wishlist" onClick={() => items.forEach((p) => dispatch(removeWishlistItem(p.id)))}>Clear wishlist</button>}
  </main>;
}

function Offers() {
  const dispatch = useDispatch();
  const promo = useSelector((s) => s.promo);
  const [copied, setCopied] = useState("");
  const offers = [{code:"SHOP10", title:"A little something extra", description:"Take 10% off your demo cart.", detail:"For everyday finds and small upgrades."},{code:"WELCOME15",title:"A warm welcome",description:"Enjoy 15% off your demo cart.",detail:"Your first-shop treat, just for practice."}];
  return <main className="page-shell inner-page"><section className="offers-hero"><p className="eyebrow">GOOD THINGS, BETTER VALUE</p><h1>A little treat<br/><em>goes a long way.</em></h1><p>Pick an offer, apply it in your bag, and watch your demo total update.</p></section><div className="offer-grid">{offers.map((o,i)=><article className={`offer-card offer-${i}`} key={o.code}><div className="offer-card-top"><span>{i===0?"EVERYDAY FAVOURITE":"NEW HERE?"}</span><b>{i===0?"10%":"15%"}</b></div><h2>{o.title}</h2><p>{o.description}</p><small>{o.detail}</small><div className="offer-code"><code>{o.code}</code><button className="button button-dark" onClick={()=>{dispatch(applyPromo(o.code));setCopied(o.code);}}>Apply offer ↗</button></div>{copied===o.code && <p className="success-note">✓ Offer selected. <Link to="/cart">View your bag →</Link></p>}</article>)}</div><div className="offer-bottom"><span>Ready when you are.</span><Link className="button button-orange" to="/cart">Go to your bag →</Link></div><p className="demo-disclaimer center">Offers are frontend demo coupons and do not represent real promotions.</p></main>;
}

function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const submit = (e) => { e.preventDefault(); if (mode==="register" && name.trim().length < 2) {setMessage("Please enter your name.");return;} if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {setMessage("Enter a valid email address.");return;} if(password.length<6){setMessage("Password must be at least 6 characters.");return;} localStorage.setItem("shopkart-demo-user", JSON.stringify({name:name||email.split("@")[0],email})); navigate("/"); };
  return <main className="login-page"><div className="login-art"><Link className="brand login-brand" to="/"><span className="brand-mark">S</span>shopkart<span className="brand-dot">.</span></Link><div className="login-art-content"><span className="hero-kicker">A BETTER KIND OF BROWSE</span><h1>Find the little<br/><em>things that</em><br/>make your day.</h1><p>Your next favourite thing is closer than you think.</p><div className="login-orbit"><div className="orbit-circle"></div><span>✳</span><b>THE EVERYDAY<br/>EDIT</b></div></div><small className="login-foot">Everyday finds, elevated.</small></div><section className="login-form-side"><div className="login-form-wrap"><Link to="/" className="mobile-brand brand"><span className="brand-mark">S</span>shopkart<span className="brand-dot">.</span></Link><p className="eyebrow">{mode==="login"?"WELCOME BACK":"START SOMETHING GOOD"}</p><h2>{mode==="login"?"Good to see you.":"Join the good finds."}</h2><p className="muted">{mode==="login"?"Sign in to continue exploring.":"Create a demo profile to get started."}</p><div className="mode-switch"><button className={mode==="login"?"selected":""} onClick={()=>{setMode("login");setMessage("");}}>Sign in</button><button className={mode==="register"?"selected":""} onClick={()=>{setMode("register");setMessage("");}}>Create account</button></div><form onSubmit={submit} className="login-form">{mode==="register" && <label>Your name<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Alex Morgan" required/></label>}<label>Email address<input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required/></label><label>Password<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="At least 6 characters" minLength="6" required/></label>{mode==="login" && <div className="forgot-row"><span>Demo account only</span><span>Secure-looking, frontend-only</span></div>}{message && <p className="form-error">{message}</p>}<button className="button button-orange login-submit">{mode==="login"?"Sign in to ShopKart":"Create demo account"} <span>→</span></button></form><p className="login-switch">{mode==="login"?"New to ShopKart?":"Already have a profile?"} <button onClick={()=>{setMode(mode==="login"?"register":"login");setMessage("");}}>{mode==="login"?"Create an account":"Sign in"}</button></p><p className="demo-disclaimer">Demo only: this form does not verify credentials or create a real account.</p></div></section></main>;
}

function Checkout() {
  const count = useSelector(selectTotalItems);
  const subtotal = useSelector(selectTotalPrice);
  const promo = useSelector((s) => s.promo);
  const dispatch = useDispatch();
  const [placed, setPlaced] = useState(false);
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 5;
  const total = Math.max(0, subtotal*(1-promo.discount)+shipping);
  if (placed) return <main className="page-shell inner-page"><div className="empty-state"><div className="success-check">✓</div><p className="eyebrow">DEMO COMPLETE</p><h2>Your practice order is all set!</h2><p>No payment was taken and no real order was created. This is a frontend-only confirmation.</p><Link to="/" className="button button-orange">Back to shopping ↗</Link></div></main>;
  return <main className="page-shell inner-page checkout-page"><p className="eyebrow">ONE LAST STEP</p><h1>Checkout <span className="orange-dot">.</span></h1><div className="checkout-box"><div><h2>Review your demo order</h2><p className="muted">This screen simulates checkout. It does not collect payment details.</p><div className="summary-line"><span>Items ({count})</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Shipping</span><strong>{shipping===0?"FREE":money(shipping)}</strong></div>{promo.discount>0&&<div className="summary-line"><span>Discount</span><strong>−{money(subtotal*promo.discount)}</strong></div>}<div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div><button disabled={!count} className="button button-orange checkout-button" onClick={()=>{dispatch(clearCart());dispatch(removePromo());setPlaced(true);}}>Place demo order ✓</button><p className="demo-disclaimer">Clicking this only shows a confirmation and clears the demo cart.</p></div></div></main>;
}

function NotFound() { return <div className="state-panel page-state"><h2>Page not found</h2><Link className="button button-dark" to="/">Back to ShopKart</Link></div>; }

export default function App() {
  return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductDetail/>}/><Route path="/cart" element={<Cart/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/offers" element={<Offers/>}/><Route path="/login" element={<Login/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/></>;
}