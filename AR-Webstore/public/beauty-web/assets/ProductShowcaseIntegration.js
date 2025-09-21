/**
 * Product Showcase Integration Script
 * Adds a product showcase overlay to the beauty AR application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create the product showcase button
    function createProductShowcaseButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <span style="display:flex;align-items:center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/></svg>
              <span>All products</span>
            </span>
        `;
        button.className = 'product-showcase-btn';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #ff3e6c;
            color: white;
            border: none;
            border-radius: 12px;
            padding: 14px 32px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 15px rgba(255,62,108,0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });
        
        button.addEventListener('click', showProductShowcase);
        document.body.appendChild(button);
    }

    // Create the product showcase overlay
    function createProductShowcaseOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'product-showcase-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #fff4fa;
            z-index: 10001;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const container = document.createElement('div');
        container.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 90%;
            max-width: 1200px;
            height: 90%;
            background: #fff4fa;
            border-radius: 20px;
            overflow: hidden;
            transition: transform 0.3s ease;
            box-shadow: 0 20px 60px rgba(255,62,108,0.10);
        `;
        
        const header = document.createElement('div');
        header.style.cssText = `
            background: #ff3e6c;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        const title = document.createElement('h2');
        title.textContent = '✨ Makeup Collection';
        title.style.cssText = `
            margin: 0;
            font-size: 1.5rem;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
        `;
        closeBtn.addEventListener('click', hideProductShowcase);
        closeBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255,255,255,0.2)';
        });
        closeBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        const iframe = document.createElement('iframe');
        iframe.src = './product-showcase.html';
        iframe.style.cssText = `
            width: 100%;
            height: calc(100% - 80px);
            border: none;
            background: #fff4fa;
            scroll-behavior: smooth;
        `;
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        container.appendChild(header);
        container.appendChild(iframe);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        // Add smooth scroll style to document
        const smoothScrollStyle = document.createElement('style');
        smoothScrollStyle.textContent = `
            #product-showcase-overlay * {
                scroll-behavior: smooth !important;
            }
        `;
        document.head.appendChild(smoothScrollStyle);
        
        // Close on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hideProductShowcase();
            }
        });
        
        return overlay;
    }

    function showProductShowcase() {
        const overlay = document.getElementById('product-showcase-overlay') || createProductShowcaseOverlay();
        overlay.style.display = 'block';
        
        // Trigger animation
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            const container = overlay.querySelector('div');
            container.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    function hideProductShowcase() {
        const overlay = document.getElementById('product-showcase-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            const container = overlay.querySelector('div');
            container.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    // Initialize the product showcase
    function initProductShowcase() {
        // Wait for the main app to load
        setTimeout(() => {
            createProductShowcaseButton();
        }, 2000);
    }

    // Auto-initialize
    initProductShowcase();

    // Keyboard shortcut (P key) to open product showcase
    document.addEventListener('keydown', function(e) {
        if (e.key === 'p' || e.key === 'P') {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                showProductShowcase();
            }
        }
        
        // ESC to close
        if (e.key === 'Escape') {
            hideProductShowcase();
        }
    });
});