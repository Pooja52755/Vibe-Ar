import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StyleVibeLanding.css";

const images = [
  "/png images/i1.jpg",
  "/png images/i2.jpg",
  "/png images/i3.jpg",
  "/png images/i4.jpg",
  "/png images/i5.jpg",
  "/png images/i7.jpg",
  "/png images/i8.jpg"
];

const StyleVibeLanding = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Your Vibe,<br />Your Style</h1>
          <p>Discover fashion that matches your energy. Shop with AI-powered search and try-on with AR.</p>
          <div className="cta-buttons">
            <Link to="/ai-search" className="btn btn-primary">
              Try AI Search
            </Link>
            <Link to="/ai-suggester" className="btn btn-secondary">
              Try AR Experience
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src={images[current]}
            alt="Fashion"
            style={{
              width: "480px",
              height: "600px",
              objectFit: "contain",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)"
            }}
          />
          <div className="carousel-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={"dot" + (idx === current ? " active" : "")}
                onClick={() => setCurrent(idx)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="trending-section">
        <div className="trending-header">
          <div className="trending-title-group">
            <span className="trending-icon">🔥</span>
            <h2 className="trending-title">Trending Now</h2>
          </div>
          <a href="#" className="trending-viewall">View All</a>
        </div>
        <div className="trending-grid">
          {/* Example trending products, replace with dynamic data if needed */}
          <div className="trending-card">
            <img src="/png images/d1.jpeg" alt="Denim Jacket" className="trending-img" />
            <div className="trending-info">
              <div className="trending-brand">Urban Vibes</div>
              <div className="trending-name">Oversized Denim Jacket - Vintage Wash</div>
              <div className="trending-price-group">
                <span className="trending-price">₹1999</span>
                <span className="trending-original">₹2999</span>
              </div>
              <div className="trending-rating">★ 4.5 (234)</div>
            </div>
          </div>
          <div className="trending-card">
            <img src="/png images/d2.jpg" alt="Floral Midi Dress" className="trending-img" />
            <div className="trending-info">
              <div className="trending-brand">Boho Dreams</div>
              <div className="trending-name">Floral Midi Dress - Cottagecore</div>
              <div className="trending-price-group">
                <span className="trending-price">₹2499</span>
                <span className="trending-original">₹3299</span>
              </div>
              <div className="trending-rating">★ 4.7 (189)</div>
            </div>
          </div>
          <div className="trending-card">
            <img src="/png images/d3.jpeg" alt="White Shirt" className="trending-img" />
            <div className="trending-info">
              <div className="trending-brand">Minimalist Co</div>
              <div className="trending-name">Classic White Button-Down Shirt</div>
              <div className="trending-price-group">
                <span className="trending-price">₹1299</span>
                <span className="trending-original">₹1899</span>
              </div>
              <div className="trending-rating">★ 4.3 (456)</div>
            </div>
          </div>
          <div className="trending-card">
            <img src="/png images/d4.jpg" alt="Platform Sneakers" className="trending-img" />
            <div className="trending-info">
              <div className="trending-brand">RetroFit</div>
              <div className="trending-name">Chunky Platform Sneakers - Y2K Style</div>
              <div className="trending-price-group">
                <span className="trending-price">₹3499</span>
                <span className="trending-original">₹4999</span>
              </div>
              <div className="trending-rating">★ 4.6 (312)</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StyleVibeLanding;
