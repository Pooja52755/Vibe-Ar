/**
 * AIMakeupPresets.js
 * Provides ready-to-use AI makeup presets for quick application
 * 
 * This script defines a set of makeup presets organized by categories
 * that users can quickly apply without having to enter their own prompts.
 */

(function() {
  // Define the makeup presets
  window.MAKEUP_PRESETS = {
    // Everyday looks
    everyday: [
      {
        name: "Natural Glow",
        description: "Subtle enhancement with soft blush and light mascara",
        prompt: "Apply a natural makeup look with a subtle glow, light blush, minimal mascara, and a nude lip color that enhances natural beauty without looking obvious."
      },
      {
        name: "Office Ready",
        description: "Professional look for work environment",
        prompt: "Create a professional office makeup look with neutral eyeshadow, defined brows, subtle eyeliner, light mascara, and a natural pink lip color. Suitable for a business environment."
      },
      {
        name: "Fresh Face",
        description: "Dewy skin with minimal makeup",
        prompt: "Apply a fresh-faced makeup look with dewy skin, cream blush on the apples of the cheeks, clear brow gel, and a tinted lip balm. Should look like just-moisturized skin."
      },
      {
        name: "No-Makeup Makeup",
        description: "Polished but invisible enhancement",
        prompt: "Create a no-makeup makeup look that appears completely natural while still enhancing features. Includes concealer only where needed, tightlined eyes, brushed-up brows, and a lip color that matches natural lip tone."
      }
    ],
    
    // Glamorous evening looks
    glamorous: [
      {
        name: "Smokey Eye",
        description: "Classic evening look with dramatic eyes",
        prompt: "Create a classic smokey eye makeup look with gradient dark eyeshadow, black eyeliner, voluminous mascara, defined brows, contoured cheeks, and a nude lip. Sophisticated and evening-ready."
      },
      {
        name: "Red Carpet",
        description: "Celebrity-inspired glamour",
        prompt: "Apply a red carpet glamour makeup look with flawless matte skin, subtle contour, winged eyeliner, false-looking lashes, defined brows, and a bold red lip. High-impact and photo-ready."
      },
      {
        name: "Glitter Glam",
        description: "Sparkly evening statement",
        prompt: "Create a glittery glamorous makeup look with sparkly eyeshadow on the lids, winged liner, full lashes, highlighted cheekbones, and a glossy neutral lip. Perfect for parties and special events."
      },
      {
        name: "Bold Lip Focus",
        description: "Statement lip with balanced eyes",
        prompt: "Apply a bold lip-focused makeup look featuring a vibrant fuchsia or deep burgundy lip color, minimal eye makeup with just mascara, defined brows, and subtly highlighted cheekbones."
      }
    ],
    
    // Seasonal and trend-based looks
    seasonal: [
      {
        name: "Summer Bronze",
        description: "Sun-kissed glow for warm weather",
        prompt: "Create a summer bronze makeup look with warm-toned bronzer across cheeks and temples, golden eyeshadow, waterproof mascara, fluffy brows, and a coral lip tint. Appears sun-kissed and radiant."
      },
      {
        name: "Autumn Warmth",
        description: "Rich warm tones for fall",
        prompt: "Apply an autumn-inspired makeup look with warm rusty eyeshadow, defined crease, subtle winged liner, terracotta blush, and a brick-red lip color. Rich and seasonally appropriate."
      },
      {
        name: "Winter Frost",
        description: "Cool-toned elegant look",
        prompt: "Create a winter frost makeup look with cool-toned eyeshadow in silvers and light blues, black mascara, rosy cheeks, and a berry-tinted lip. Elegant and seasonally appropriate."
      },
      {
        name: "Spring Pastels",
        description: "Light and fresh colors",
        prompt: "Apply a spring pastel makeup look with soft lavender or mint eyeshadow, mascara, a hint of blush, and a sheer pink lip gloss. Light, fresh and youthful."
      }
    ],
    
    // Special occasion looks
    special: [
      {
        name: "Wedding Guest",
        description: "Elegant and photo-friendly",
        prompt: "Create an elegant wedding guest makeup look with soft neutral eyeshadow, subtle eyeliner, defined lashes, rosy blush, and a long-lasting mauve lip color. Sophisticated but not stealing focus."
      },
      {
        name: "Festival Ready",
        description: "Fun and creative for outdoor events",
        prompt: "Apply a festival makeup look with bright colorful eyeshadow, maybe even small gems or glitter accents, voluminous mascara, highlighted cheekbones, and a fun bright lip color. Playful and attention-grabbing."
      },
      {
        name: "Date Night",
        description: "Romantic and flattering",
        prompt: "Create a romantic date night makeup look with soft smokey eyeshadow, winged liner, fluffy lashes, peachy blush, and a kissable satin-finish rose pink lip. Flattering in intimate lighting."
      },
      {
        name: "Interview Polish",
        description: "Confidence-boosting professional look",
        prompt: "Apply a professional interview makeup look with neutral matte eyeshadow, clean eyeliner, defined but natural brows, subtle blush, and a your-lips-but-better lip color. Polished but not distracting."
      }
    ]
  };
  
  // Function to create preset UI
  function createPresetUI() {
    // Create container for preset tabs
    const tabContainer = document.createElement('div');
    tabContainer.className = 'preset-tabs';
    
    // Create tabs for each category
    for (const category in window.MAKEUP_PRESETS) {
      const tab = document.createElement('div');
      tab.className = 'preset-tab';
      tab.dataset.category = category;
      tab.textContent = formatCategoryName(category);
      tab.addEventListener('click', () => switchPresetCategory(category));
      tabContainer.appendChild(tab);
    }
    
    // Create container for preset buttons
    const presetGrid = document.createElement('div');
    presetGrid.className = 'preset-grid';
    presetGrid.id = 'preset-grid';
    
    return {
      tabContainer,
      presetGrid
    };
  }
  
  // Function to switch between preset categories
  function switchPresetCategory(category) {
    // Update active tab
    const tabs = document.querySelectorAll('.preset-tab');
    tabs.forEach(tab => {
      if (tab.dataset.category === category) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update preset grid
    const presetGrid = document.getElementById('preset-grid');
    if (presetGrid) {
      // Clear existing presets
      presetGrid.innerHTML = '';
      
      // Add presets for selected category
      const presets = window.MAKEUP_PRESETS[category] || [];
      presets.forEach(preset => {
        const button = document.createElement('div');
        button.className = 'preset-button';
        button.innerHTML = `
          <strong>${preset.name}</strong>
          <span>${preset.description}</span>
        `;
        button.addEventListener('click', () => {
          // Set the prompt in the input field
          const input = document.getElementById('ai-prompt-input');
          if (input) {
            input.value = preset.prompt;
          }
        });
        presetGrid.appendChild(button);
      });
    }
  }
  
  // Helper function to format category names
  function formatCategoryName(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  
  // Add methods to global scope
  window.AIMakeupPresets = {
    createPresetUI,
    switchPresetCategory
  };
  
  // Initialize first category when loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for the dialog to be created
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.classList && node.classList.contains('ai-prompt-dialog')) {
              // Check for preset-grid
              if (document.getElementById('preset-grid')) {
                switchPresetCategory('everyday');
                observer.disconnect();
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();