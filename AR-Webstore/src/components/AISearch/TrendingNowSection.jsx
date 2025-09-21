import React from "react";
import "./AISearch.css";

const trendingProducts = [
  {
    img: "/png images/d1.jpeg",
    brand: "Urban Vibes",
    name: "Oversized Denim Jacket - Vintage Wash",
    price: "₹1999",
    original: "₹2999",
    rating: "★ 4.5 (234)"
  },
  {
    img: "/png images/d2.jpg",
    brand: "Boho Dreams",
    name: "Floral Midi Dress - Cottagecore",
    price: "₹2499",
    original: "₹3299",
    rating: "★ 4.7 (189)"
  },
  {
    img: "/png images/d3.jpeg",
    brand: "Minimalist Co",
    name: "Classic White Button-Down Shirt",
    price: "₹1299",
    original: "₹1899",
    rating: "★ 4.3 (456)"
  },
  {
    img: "/png images/d4.jpg",
    brand: "RetroFit",
    name: "Chunky Platform Sneakers - Y2K Style",
    price: "₹3499",
    original: "₹4999",
    rating: "★ 4.6 (312)"
  },
  {
    img: "/png images/d5.webp",
    brand: "StreetStyle",
    name: "Graphic Print Hoodie - Unisex",
    price: "₹1799",
    original: "₹2299",
    rating: "★ 4.8 (210)"
  },
  {
    img: "/png images/d6.webp",
    brand: "EcoWear",
    name: "Organic Cotton T-shirt",
    price: "₹899",
    original: "₹1299",
    rating: "★ 4.9 (320)"
  }
];

const TrendingNowSection = () => (
  <section className="trending-section">
    <div className="trending-header">
      <div className="trending-title-group">
        <span className="trending-icon">🔥</span>
        <h2 className="trending-title">Trending Now</h2>
      </div>
      <a href="#" className="trending-viewall">View All</a>
    </div>
    <div className="trending-grid">
      {trendingProducts.map((product, idx) => (
        <div className="trending-card" key={idx}>
          <img src={product.img} alt={product.name} className="trending-img" />
          <div className="trending-info">
            <div className="trending-brand">{product.brand}</div>
            <div className="trending-name">{product.name}</div>
            <div className="trending-price-group">
              <span className="trending-price">{product.price}</span>
              <span className="trending-original">{product.original}</span>
            </div>
            <div className="trending-rating">{product.rating}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TrendingNowSection;
