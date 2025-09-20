/**
 * MakeupProducts.js
 * This file contains a dataset of makeup products that can be recommended
 * by the AI makeup assistant based on the generated makeup looks.
 */

const makeupProducts = [
  // Lipsticks
  {
    id: 'lipstick-001',
    name: 'Classic Red Lipstick',
    brand: 'Glam Beauty',
    type: 'lipstick',
    color: 'red',
    shade: 'Classic Red',
    price: '19.99',
    image: '/assets/makeup/lipstick-red.jpg',
    description: 'A timeless, bold red lipstick that suits all skin tones.'
  },
  {
    id: 'lipstick-002',
    name: 'Nude Matte Lipstick',
    brand: 'Glam Beauty',
    type: 'lipstick',
    color: 'nude',
    shade: 'Soft Nude',
    price: '18.99',
    image: '/assets/makeup/lipstick-nude.jpg',
    description: 'A versatile nude lipstick perfect for everyday wear.'
  },
  {
    id: 'lipstick-003',
    name: 'Pink Fusion Lipstick',
    brand: 'Glam Beauty',
    type: 'lipstick',
    color: 'pink',
    shade: 'Rosy Pink',
    price: '19.99',
    image: '/assets/makeup/lipstick-pink.jpg',
    description: 'A bright and vibrant pink lipstick for a fresh look.'
  },
  {
    id: 'lipstick-004',
    name: 'Berry Bliss Lipstick',
    brand: 'Glam Beauty',
    type: 'lipstick',
    color: 'berry',
    shade: 'Deep Berry',
    price: '21.99',
    image: '/assets/makeup/lipstick-berry.jpg',
    description: 'A rich berry-toned lipstick for a bold, dramatic look.'
  },
  {
    id: 'lipstick-005',
    name: 'Coral Crush Lipstick',
    brand: 'Glam Beauty',
    type: 'lipstick',
    color: 'coral',
    shade: 'Coral Reef',
    price: '19.99',
    image: '/assets/makeup/lipstick-coral.jpg',
    description: 'A bright coral lipstick perfect for summer looks.'
  },
  
  // Eyeshadows
  {
    id: 'eyeshadow-001',
    name: 'Neutral Palette',
    brand: 'Glam Beauty',
    type: 'eyeshadow',
    color: 'brown',
    shade: 'Neutral Brown',
    price: '29.99',
    image: '/assets/makeup/eyeshadow-neutral.jpg',
    description: 'A versatile neutral eyeshadow palette for everyday looks.'
  },
  {
    id: 'eyeshadow-002',
    name: 'Smoky Night Eyeshadow',
    brand: 'Glam Beauty',
    type: 'eyeshadow',
    color: 'black',
    shade: 'Smoky Black',
    price: '24.99',
    image: '/assets/makeup/eyeshadow-smoky.jpg',
    description: 'An intense black eyeshadow for creating smoky eye looks.'
  },
  {
    id: 'eyeshadow-003',
    name: 'Golden Shimmer Eyeshadow',
    brand: 'Glam Beauty',
    type: 'eyeshadow',
    color: 'gold',
    shade: 'Gold Rush',
    price: '22.99',
    image: '/assets/makeup/eyeshadow-gold.jpg',
    description: 'A shimmering gold eyeshadow for a glamorous touch.'
  },
  {
    id: 'eyeshadow-004',
    name: 'Sunset Hues Palette',
    brand: 'Glam Beauty',
    type: 'eyeshadow',
    color: 'orange',
    shade: 'Sunset Orange',
    price: '32.99',
    image: '/assets/makeup/eyeshadow-sunset.jpg',
    description: 'A warm-toned eyeshadow palette with sunset-inspired hues.'
  },
  {
    id: 'eyeshadow-005',
    name: 'Purple Reign Eyeshadow',
    brand: 'Glam Beauty',
    type: 'eyeshadow',
    color: 'purple',
    shade: 'Royal Purple',
    price: '24.99',
    image: '/assets/makeup/eyeshadow-purple.jpg',
    description: 'A rich purple eyeshadow for creating bold eye looks.'
  },
  
  // Blush
  {
    id: 'blush-001',
    name: 'Peachy Keen Blush',
    brand: 'Glam Beauty',
    type: 'blush',
    color: 'peach',
    shade: 'Peachy Glow',
    price: '18.99',
    image: '/assets/makeup/blush-peach.jpg',
    description: 'A soft peach blush for a natural-looking flush.'
  },
  {
    id: 'blush-002',
    name: 'Rosy Glow Blush',
    brand: 'Glam Beauty',
    type: 'blush',
    color: 'pink',
    shade: 'Rosy Pink',
    price: '18.99',
    image: '/assets/makeup/blush-pink.jpg',
    description: 'A bright pink blush for a youthful, rosy glow.'
  },
  {
    id: 'blush-003',
    name: 'Coral Pop Blush',
    brand: 'Glam Beauty',
    type: 'blush',
    color: 'coral',
    shade: 'Coral Pop',
    price: '19.99',
    image: '/assets/makeup/blush-coral.jpg',
    description: 'A vibrant coral blush for a fresh, sun-kissed look.'
  },
  {
    id: 'blush-004',
    name: 'Berry Flush Blush',
    brand: 'Glam Beauty',
    type: 'blush',
    color: 'berry',
    shade: 'Berry Flush',
    price: '19.99',
    image: '/assets/makeup/blush-berry.jpg',
    description: 'A deep berry blush for a dramatic, flushed look.'
  },
  
  // Foundation
  {
    id: 'foundation-001',
    name: 'Matte Perfection Foundation',
    brand: 'Glam Beauty',
    type: 'foundation',
    color: 'beige',
    shade: 'Light Beige',
    price: '29.99',
    image: '/assets/makeup/foundation-light.jpg',
    description: 'A matte finish foundation for light skin tones.'
  },
  {
    id: 'foundation-002',
    name: 'Matte Perfection Foundation',
    brand: 'Glam Beauty',
    type: 'foundation',
    color: 'beige',
    shade: 'Medium Beige',
    price: '29.99',
    image: '/assets/makeup/foundation-medium.jpg',
    description: 'A matte finish foundation for medium skin tones.'
  },
  {
    id: 'foundation-003',
    name: 'Matte Perfection Foundation',
    brand: 'Glam Beauty',
    type: 'foundation',
    color: 'beige',
    shade: 'Deep Beige',
    price: '29.99',
    image: '/assets/makeup/foundation-deep.jpg',
    description: 'A matte finish foundation for deep skin tones.'
  },
  {
    id: 'foundation-004',
    name: 'Dewy Glow Foundation',
    brand: 'Glam Beauty',
    type: 'foundation',
    color: 'beige',
    shade: 'Light Beige',
    price: '32.99',
    image: '/assets/makeup/foundation-dewy-light.jpg',
    description: 'A dewy finish foundation for light skin tones.'
  },
  {
    id: 'foundation-005',
    name: 'Dewy Glow Foundation',
    brand: 'Glam Beauty',
    type: 'foundation',
    color: 'beige',
    shade: 'Medium Beige',
    price: '32.99',
    image: '/assets/makeup/foundation-dewy-medium.jpg',
    description: 'A dewy finish foundation for medium skin tones.'
  },
  {
    id: 'foundation-006',
    name: 'Dewy Glow Foundation',
    brand: 'Glam Beauty',
    type: 'foundation',
    color: 'beige',
    shade: 'Deep Beige',
    price: '32.99',
    image: '/assets/makeup/foundation-dewy-deep.jpg',
    description: 'A dewy finish foundation for deep skin tones.'
  },
  
  // Eyeliner
  {
    id: 'eyeliner-001',
    name: 'Precision Liquid Eyeliner',
    brand: 'Glam Beauty',
    type: 'eyeliner',
    color: 'black',
    shade: 'Jet Black',
    price: '15.99',
    image: '/assets/makeup/eyeliner-black.jpg',
    description: 'A precise liquid eyeliner for creating sharp cat-eye looks.'
  },
  {
    id: 'eyeliner-002',
    name: 'Smudge-Proof Gel Eyeliner',
    brand: 'Glam Beauty',
    type: 'eyeliner',
    color: 'brown',
    shade: 'Brown',
    price: '16.99',
    image: '/assets/makeup/eyeliner-brown.jpg',
    description: 'A smudge-proof gel eyeliner for a softer look.'
  },
  {
    id: 'eyeliner-003',
    name: 'Precision Liquid Eyeliner',
    brand: 'Glam Beauty',
    type: 'eyeliner',
    color: 'blue',
    shade: 'Navy Blue',
    price: '15.99',
    image: '/assets/makeup/eyeliner-blue.jpg',
    description: 'A navy blue liquid eyeliner for a unique twist on classic looks.'
  },
  
  // Highlighter
  {
    id: 'highlighter-001',
    name: 'Golden Glow Highlighter',
    brand: 'Glam Beauty',
    type: 'highlighter',
    color: 'gold',
    shade: 'Golden Glow',
    price: '22.99',
    image: '/assets/makeup/highlighter-gold.jpg',
    description: 'A warm gold highlighter for a sun-kissed glow.'
  },
  {
    id: 'highlighter-002',
    name: 'Pearl Essence Highlighter',
    brand: 'Glam Beauty',
    type: 'highlighter',
    color: 'pearl',
    shade: 'Pearl Essence',
    price: '22.99',
    image: '/assets/makeup/highlighter-pearl.jpg',
    description: 'A pearly white highlighter for a subtle, natural glow.'
  },
  {
    id: 'highlighter-003',
    name: 'Rose Gold Highlighter',
    brand: 'Glam Beauty',
    type: 'highlighter',
    color: 'rose',
    shade: 'Rose Gold',
    price: '24.99',
    image: '/assets/makeup/highlighter-rose.jpg',
    description: 'A rose gold highlighter for a radiant, rosy glow.'
  }
];

export default makeupProducts;
