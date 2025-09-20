/**
 * ProductData.js - Defines makeup product data for the application
 */

// Product catalog with images and details
const MAKEUP_PRODUCTS = {
  lipstick: [
    {
      id: 'lipstick-001',
      name: 'Classic Red Lipstick',
      brand: 'BeautyGlow',
      color: '#CC0000',
      finish: 'Matte',
      description: 'Long-lasting matte red lipstick that stays all day',
      price: '$18.99',
      image: 'assets/products/lipstick/red.jpg',
      rating: 4.5,
      bestseller: true
    },
    {
      id: 'lipstick-002',
      name: 'Pink Perfection',
      brand: 'GlamourGirl',
      color: '#FF66B2',
      finish: 'Cream',
      description: 'Creamy pink lipstick with moisturizing formula',
      price: '$16.99',
      image: 'assets/products/lipstick/pink.jpg',
      rating: 4.2
    },
    {
      id: 'lipstick-003',
      name: 'Nude Elegance',
      brand: 'NaturalBeauty',
      color: '#CC9966',
      finish: 'Satin',
      description: 'Perfect everyday nude shade with satin finish',
      price: '$15.99',
      image: 'assets/products/lipstick/coral.jpg',
      rating: 4.7
    },
    {
      id: 'lipstick-004',
      name: 'Berry Blast',
      brand: 'BeautyGlow',
      color: '#990066',
      finish: 'Matte',
      description: 'Rich berry shade with full coverage matte finish',
      price: '$19.99',
      image: 'assets/textures/makeup_queen.png',
      rating: 4.4
    },
    {
      id: 'lipstick-005',
      name: 'Coral Sunset',
      brand: 'SummerGlow',
      color: '#FF6666',
      finish: 'Glossy',
      description: 'Vibrant coral with glossy finish for summer',
      price: '$17.99',
      image: 'assets/products/lipstick/coral.jpg',
      rating: 4.3
    }
  ],
  
  eyeshadow: [
    {
      id: 'eyeshadow-001',
      name: 'Smoky Night Palette',
      brand: 'GlamourGirl',
      shades: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'],
      finish: 'Shimmer & Matte Mix',
      description: 'Classic smoky eye palette with 12 versatile shades',
      price: '$32.99',
      image: 'assets/textures/makeup_smoky.png',
      rating: 4.8,
      bestseller: true
    },
    {
      id: 'eyeshadow-002',
      name: 'Neutral Essentials',
      brand: 'NaturalBeauty',
      shades: ['#F5DEB3', '#D2B48C', '#8B4513', '#A0522D', '#CD853F'],
      finish: 'Matte',
      description: 'Everyday neutral matte shades for any occasion',
      price: '$28.99',
      image: 'assets/textures/makeup_dolly.png',
      rating: 4.7
    },
    {
      id: 'eyeshadow-003',
      name: 'Summer Sunset',
      brand: 'SummerGlow',
      shades: ['#FF6347', '#FFA07A', '#FFDAB9', '#FFD700', '#FF8C00'],
      finish: 'Shimmer',
      description: 'Warm-toned shimmers inspired by summer sunsets',
      price: '$24.99',
      image: 'assets/textures/makeup_twilight.png',
      rating: 4.5
    },
    {
      id: 'eyeshadow-004',
      name: 'Berry Dreams',
      brand: 'BeautyGlow',
      shades: ['#8B008B', '#9932CC', '#BA55D3', '#D8BFD8', '#E6E6FA'],
      finish: 'Shimmer & Matte Mix',
      description: 'Purple and berry tones for creating dramatic looks',
      price: '$29.99',
      image: 'assets/textures/makeup_queen.png',
      rating: 4.3
    },
    {
      id: 'eyeshadow-005',
      name: 'Gold Luxe',
      brand: 'GlamourGirl',
      shades: ['#FFD700', '#DAA520', '#B8860B', '#CD853F', '#8B4513'],
      finish: 'Metallic',
      description: 'Luxurious gold and bronze metallic shades',
      price: '$34.99',
      image: 'assets/products/eyeshadow/smoky.jpg',
      rating: 4.6
    }
  ],
  
  foundation: [
    {
      id: 'foundation-001',
      name: 'Perfect Match Foundation',
      brand: 'BeautyGlow',
      shades: ['Fair', 'Light', 'Medium', 'Tan', 'Deep', 'Rich'],
      coverage: 'Medium to Full',
      finish: 'Natural',
      description: 'Weightless formula that adapts to your skin tone',
      price: '$29.99',
      image: 'assets/products/foundation/dewy-glow.jpg',
      rating: 4.7,
      bestseller: true
    },
    {
      id: 'foundation-002',
      name: 'Matte Velvet',
      brand: 'GlamourGirl',
      shades: ['Fair', 'Light', 'Medium', 'Tan', 'Deep'],
      coverage: 'Full',
      finish: 'Matte',
      description: 'Long-lasting matte foundation for oily skin',
      price: '$32.99',
      image: 'assets/products/foundation/matte-velvet.jpg',
      rating: 4.5
    },
    {
      id: 'foundation-003',
      name: 'Dewy Glow',
      brand: 'SummerGlow',
      shades: ['Fair', 'Light', 'Medium', 'Tan', 'Deep'],
      coverage: 'Light to Medium',
      finish: 'Dewy',
      description: 'Hydrating formula for a natural dewy finish',
      price: '$27.99',
      image: 'assets/products/foundation/dewy-glow.jpg',
      rating: 4.4
    },
    {
      id: 'foundation-004',
      name: 'Skin Perfector BB Cream',
      brand: 'NaturalBeauty',
      shades: ['Light', 'Medium', 'Medium-Deep', 'Deep'],
      coverage: 'Light',
      finish: 'Natural',
      description: 'Lightweight BB cream with SPF 30 protection',
      price: '$24.99',
      image: 'assets/products/foundation/bb-cream.jpg',
      rating: 4.6
    }
  ],
  
  blush: [
    {
      id: 'blush-001',
      name: 'Rosy Glow',
      brand: 'BeautyGlow',
      color: '#FF6699',
      finish: 'Satin',
      description: 'Natural-looking pink blush for a healthy flush',
      price: '$18.99',
      image: 'assets/products/blush/coral.png',
      rating: 4.5,
      bestseller: true
    },
    {
      id: 'blush-002',
      name: 'Peachy Keen',
      brand: 'SummerGlow',
      color: '#FFCC99',
      finish: 'Shimmer',
      description: 'Warm peach blush with subtle golden shimmer',
      price: '$19.99',
      image: 'assets/products/blush/coral.png',
      rating: 4.6
    },
    {
      id: 'blush-003',
      name: 'Berry Flush',
      brand: 'GlamourGirl',
      color: '#CC6699',
      finish: 'Matte',
      description: 'Deep berry shade for medium to deep skin tones',
      price: '$20.99',
      image: 'assets/products/blush/rosy.png',
      rating: 4.3
    },
    {
      id: 'blush-004',
      name: 'Coral Pop',
      brand: 'BeautyGlow',
      color: '#FF9966',
      finish: 'Satin',
      description: 'Bright coral blush for a vibrant pop of color',
      price: '$18.99',
      image: 'assets/products/blush/coral.png',
      rating: 4.4
    }
  ],
  
  eyeliner: [
    {
      id: 'eyeliner-001',
      name: 'Perfect Precision Liquid Liner',
      brand: 'GlamourGirl',
      color: 'Black',
      type: 'Liquid',
      description: 'Ultra-fine tip for precise application, waterproof formula',
      price: '$15.99',
      image: 'assets/products/eyeliner/liquid-black.png',
      rating: 4.8,
      bestseller: true
    },
    {
      id: 'eyeliner-002',
      name: 'Smoky Kohl Pencil',
      brand: 'BeautyGlow',
      color: 'Black',
      type: 'Pencil',
      description: 'Creamy pencil liner that smudges easily for smoky looks',
      price: '$12.99',
      image: 'assets/products/eyeliner/liquid-black.png',
      rating: 4.5
    },
    {
      id: 'eyeliner-003',
      name: 'Color Pop Gel Liner',
      brand: 'SummerGlow',
      color: 'Navy Blue',
      type: 'Gel',
      description: 'Long-lasting gel liner in vibrant navy blue',
      price: '$14.99',
      image: 'assets/products/eyeliner/gel-blue.png',
      rating: 4.4
    },
    {
      id: 'eyeliner-004',
      name: 'Bronze Shimmer Pencil',
      brand: 'NaturalBeauty',
      color: 'Bronze',
      type: 'Pencil',
      description: 'Metallic bronze liner to enhance all eye colors',
      price: '$13.99',
      image: 'assets/products/eyeliner/gel-blue.png',
      rating: 4.6
    }
  ],
  
  mascara: [
    {
      id: 'mascara-001',
      name: 'Volume Boost',
      brand: 'BeautyGlow',
      color: 'Black',
      effect: 'Volumizing',
      description: 'Dramatic volume with no clumps, smudge-proof formula',
      price: '$16.99',
      image: 'assets/products/eyeliner/liquid-black.png',
      rating: 4.7,
      bestseller: true
    },
    {
      id: 'mascara-002',
      name: 'Length Definer',
      brand: 'GlamourGirl',
      color: 'Black',
      effect: 'Lengthening',
      description: 'Lengthening mascara with fiber technology',
      price: '$18.99',
      image: 'assets/products/mascara/length.jpg',
      rating: 4.6
    },
    {
      id: 'mascara-003',
      name: 'Curl Power',
      brand: 'SummerGlow',
      color: 'Black',
      effect: 'Curling',
      description: 'Curling mascara that holds all day, waterproof formula',
      price: '$17.99',
      image: 'assets/products/mascara/curl.jpg',
      rating: 4.5
    },
    {
      id: 'mascara-004',
      name: 'Natural Definition',
      brand: 'NaturalBeauty',
      color: 'Brown',
      effect: 'Defining',
      description: 'Subtle brown mascara for a natural defined look',
      price: '$15.99',
      image: 'assets/products/mascara/natural.jpg',
      rating: 4.4
    }
  ]
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.MAKEUP_PRODUCTS = MAKEUP_PRODUCTS;
}

// Helper function to get product recommendations
function getProductRecommendations(category, count = 3) {
  if (!MAKEUP_PRODUCTS[category]) {
    return [];
  }
  
  // Sort by rating and bestseller status
  const sorted = [...MAKEUP_PRODUCTS[category]].sort((a, b) => {
    if (a.bestseller && !b.bestseller) return -1;
    if (!a.bestseller && b.bestseller) return 1;
    return b.rating - a.rating;
  });
  
  // Return the top products
  return sorted.slice(0, count);
}

// Add this function to the window object
if (typeof window !== 'undefined') {
  window.getProductRecommendations = getProductRecommendations;
}