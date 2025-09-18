/**
 * ProductSelector.js
 * A component for selecting beauty products to try on with Banuba AR filters
 */

import React, { useState, useEffect } from 'react';
import './ProductSelector.css';

// Cosmetic product categories
const PRODUCT_CATEGORIES = {
  LIPSTICK: 'lipstick',
  FOUNDATION: 'foundation',
  BLUSH: 'blush',
  EYESHADOW: 'eyeshadow',
};

// Sample product data with colors and skin tone compatibility
const BEAUTY_PRODUCTS = {
  [PRODUCT_CATEGORIES.LIPSTICK]: [
    { id: 'l1', name: 'Ruby Red', color: '#C21807', skintones: ['warm', 'neutral'], price: '$12.99' },
    { id: 'l2', name: 'Coral Pink', color: '#F88379', skintones: ['warm'], price: '$14.99' },
    { id: 'l3', name: 'Soft Rose', color: '#F4A6C6', skintones: ['cool', 'neutral'], price: '$11.99' },
    { id: 'l4', name: 'Mauve Nude', color: '#B97A57', skintones: ['warm', 'neutral', 'cool'], price: '$13.99' },
    { id: 'l5', name: 'Berry Wine', color: '#722F37', skintones: ['cool'], price: '$15.99' },
  ],
  [PRODUCT_CATEGORIES.FOUNDATION]: [
    { id: 'f1', name: 'Warm Beige', color: '#E0C097', skintones: ['warm'], price: '$19.99' },
    { id: 'f2', name: 'Natural Sand', color: '#D1BFA7', skintones: ['neutral'], price: '$18.99' },
    { id: 'f3', name: 'Cool Ivory', color: '#E3C099', skintones: ['cool'], price: '$21.99' },
    { id: 'f4', name: 'Deep Bronze', color: '#9F7F61', skintones: ['warm', 'neutral'], price: '$20.99' },
  ],
  [PRODUCT_CATEGORIES.BLUSH]: [
    { id: 'b1', name: 'Peachy Glow', color: '#FFB6A3', skintones: ['warm', 'neutral'], price: '$16.99' },
    { id: 'b2', name: 'Rosy Flush', color: '#E57F98', skintones: ['cool'], price: '$15.99' },
    { id: 'b3', name: 'Soft Coral', color: '#F8977F', skintones: ['warm'], price: '$14.99' },
  ],
  [PRODUCT_CATEGORIES.EYESHADOW]: [
    { id: 'e1', name: 'Golden Bronze', color: '#D4AF37', skintones: ['warm'], price: '$12.99' },
    { id: 'e2', name: 'Smoky Plum', color: '#87556F', skintones: ['cool'], price: '$13.99' },
    { id: 'e3', name: 'Neutral Taupe', color: '#B6A292', skintones: ['neutral', 'warm', 'cool'], price: '$11.99' },
  ],
};

const ProductSelector = ({ 
  onSelectProduct, 
  onResetFilters, 
  selectedProduct, 
  skinTone, 
  isCameraActive 
}) => {
  const [activeCategory, setActiveCategory] = useState(PRODUCT_CATEGORIES.LIPSTICK);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filter products based on skin tone if available
  useEffect(() => {
    if (skinTone) {
      const filtered = BEAUTY_PRODUCTS[activeCategory].filter(product => 
        product.skintones.includes(skinTone)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(BEAUTY_PRODUCTS[activeCategory]);
    }
  }, [activeCategory, skinTone]);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  const handleSelectProduct = (product) => {
    if (!isCameraActive) {
      alert('Please start the camera first to try on products');
      return;
    }
    
    onSelectProduct({
      ...product,
      type: activeCategory // Add product type for Banuba integration
    });
  };
  
  return (
    <div className="product-selector">
      <div className="product-categories">
        <h3>Try On Products</h3>
        <div className="category-buttons">
          {Object.values(PRODUCT_CATEGORIES).map(category => (
            <button 
              key={category}
              className={activeCategory === category ? 'active' : ''}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="product-list">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No {activeCategory} products match your skin tone. Try another category.</p>
        ) : (
          filteredProducts.map(product => (
            <div 
              key={product.id} 
              className={`product-item ${selectedProduct && selectedProduct.id === product.id ? 'selected' : ''}`}
              onClick={() => handleSelectProduct(product)}
            >
              <div 
                className="product-color" 
                style={{ backgroundColor: product.color }}
                title={`${product.name} - ${product.price}`}
              />
              <div className="product-info">
                <span className="product-name">{product.name}</span>
                <span className="product-price">{product.price}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedProduct && (
        <div className="selected-product-info">
          <p>Currently wearing: <strong>{selectedProduct.name}</strong></p>
          <button className="reset-button" onClick={onResetFilters}>
            Remove Makeup
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;