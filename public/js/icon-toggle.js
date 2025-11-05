// Toggle between images and FontAwesome icons for better visibility
function toggleServiceIcons() {
  const services = document.querySelectorAll('.service');
  
  services.forEach(service => {
    const img = service.querySelector('.service-icon');
    const fallback = service.querySelector('.service-icon-fallback');
    
    if (img && fallback) {
      if (img.style.display === 'none') {
        // Show image, hide fallback
        img.style.display = 'block';
        fallback.style.display = 'none';
      } else {
        // Hide image, show fallback
        img.style.display = 'none';
        fallback.style.display = 'flex';
      }
    }
  });
}

// Add button to toggle icons (for testing)
function addToggleButton() {
  const button = document.createElement('button');
  button.textContent = '🔄 Toggle Icons';
  button.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    background: var(--brand-grad);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  
  button.onclick = toggleServiceIcons;
  document.body.appendChild(button);
  
  // Auto remove button after 10 seconds
  setTimeout(() => {
    if (button.parentNode) {
      button.remove();
    }
  }, 10000);
}

// Add toggle button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addToggleButton);
} else {
  addToggleButton();
}