/**
 * Extract specific component requests from the prompt
 * @param {string} prompt - The natural language prompt
 * @returns {Object} - Object with component names and intensities
 */
function extractComponentRequests(prompt) {
  const components = {};
  const promptLower = prompt.toLowerCase();
  
  // Keywords for each component with varying intensities
  const componentKeywords = {
    lipstick: [
      { keywords: ['bold lips', 'dark lips', 'red lips', 'vibrant lips', 'dramatic lips'], intensity: 1.0 },
      { keywords: ['medium lips', 'pink lips', 'coral lips', 'colored lips'], intensity: 0.7 },
      { keywords: ['subtle lips', 'light lips', 'natural lips', 'nude lips'], intensity: 0.4 }
    ],
    eyebrows: [
      { keywords: ['bold brows', 'dark brows', 'defined brows', 'strong eyebrows'], intensity: 1.0 },
      { keywords: ['medium brows', 'natural brows', 'shaped eyebrows'], intensity: 0.7 },
      { keywords: ['subtle brows', 'light brows', 'soft eyebrows'], intensity: 0.4 }
    ],
    eyeshadow: [
      { keywords: ['dramatic eyes', 'smokey eyes', 'bold eyeshadow', 'colorful eyeshadow'], intensity: 1.0 },
      { keywords: ['medium eyeshadow', 'moderate eye makeup', 'visible eyeshadow'], intensity: 0.7 },
      { keywords: ['subtle eyeshadow', 'light eyeshadow', 'natural eye makeup'], intensity: 0.4 }
    ],
    foundation: [
      { keywords: ['full coverage', 'heavy foundation', 'flawless base'], intensity: 1.0 },
      { keywords: ['medium coverage', 'foundation', 'even skin tone'], intensity: 0.7 },
      { keywords: ['light coverage', 'natural foundation', 'sheer base'], intensity: 0.4 }
    ],
    blush: [
      { keywords: ['heavy blush', 'bright cheeks', 'vibrant blush', 'rosy cheeks'], intensity: 1.0 },
      { keywords: ['medium blush', 'visible blush', 'pink cheeks'], intensity: 0.7 },
      { keywords: ['subtle blush', 'light blush', 'natural cheeks'], intensity: 0.4 }
    ],
    contour: [
      { keywords: ['defined contour', 'sharp contour', 'heavy contour', 'sculpted face'], intensity: 1.0 },
      { keywords: ['medium contour', 'visible contour', 'defined cheekbones'], intensity: 0.7 },
      { keywords: ['subtle contour', 'light contour', 'natural definition'], intensity: 0.4 }
    ],
    highlighter: [
      { keywords: ['intense highlight', 'glowing highlight', 'dramatic highlighter'], intensity: 1.0 },
      { keywords: ['medium highlight', 'visible glow', 'shimmery'], intensity: 0.7 },
      { keywords: ['subtle highlight', 'natural glow', 'light highlighter'], intensity: 0.4 }
    ]
  };
  
  // Check for each component
  Object.keys(componentKeywords).forEach(component => {
    for (const level of componentKeywords[component]) {
      for (const keyword of level.keywords) {
        if (promptLower.includes(keyword)) {
          components[component] = level.intensity;
          break;
        }
      }
      if (components[component]) break; // Skip remaining levels if already found
    }
  });
  
  return components;
}