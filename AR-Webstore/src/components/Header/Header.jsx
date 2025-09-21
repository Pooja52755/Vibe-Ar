import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import "./styles.css";

const Header = () => {
  const navigationLinks = [
    { label: "Home", Path: "/home" },
    { label: "Magic Items", Path: "/" },
    { label: "Hunt", Path: "/ai-search" },
    { label: "Beauty Lab", Path: "/ai-suggester" }
  ];

  const [showMobileSidebar, setShowMobileSidebar] = useState(true);

  const handleItemClick = () => {
    setShowMobileSidebar(true);
  };

  return (
    <header>
      <div className="header-flex" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem 0 1rem", position: "relative" }}>
        <Link to="/home" onClick={() => showMobileSidebar && setShowMobileSidebar(false)}>
          <img src="/png images/logo.png" alt="Logo" style={{ height: "70px", width: "auto", marginRight: "1rem", marginTop: "0" }} />
        </Link>
        <nav style={{ flex: 1 }}>
          <ul className={`desktop-nav ${showMobileSidebar ? "" : "show"}`} style={{ display: "flex", alignItems: "center", margin: 0 }}>
            {navigationLinks.map((items, key) => (
              <li key={key} onClick={handleItemClick} style={{ marginLeft: "1rem" }}>
                <Link to={items.Path}>{items.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-icons-corner">
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Profile">
            <FaRegUser size={24} style={{ color: '#222' }} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Wishlist">
            <FaRegHeart size={24} style={{ color: '#222' }} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Cart">
            <MdOutlineShoppingCart size={28} style={{ color: '#222' }} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
