/**
 * Product Showcase Integration Script
 * Adds a product showcase overlay to the beauty AR application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create the product showcase button
    function createProductShowcaseButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="white"/>
                <path d="M9 8H11V17H9V8ZM13 8H15V17H13V8Z" fill="white"/>
            </svg>
            <span>Products</span>
        `;
        button.className = 'product-showcase-btn';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
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
            background: rgba(0,0,0,0.8);
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
            background: white;
            border-radius: 20px;
            overflow: hidden;
            transition: transform 0.3s ease;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;
        
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            background: white;
        `;
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        container.appendChild(header);
        container.appendChild(iframe);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
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