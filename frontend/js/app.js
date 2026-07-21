// Application State Management
const AppState = {
  cart: JSON.parse(localStorage.getItem('safesteps_cart')) || [],
  
  // Add product or course to cart
  addToCart(item) {
    this.cart.push(item);
    this.saveCart();
    this.updateCartUI();
    this.showToast(`${item.name} added to cart!`);
  },

  // Save cart in browser storage
  saveCart() {
    localStorage.setItem('safesteps_cart', JSON.stringify(this.cart));
  },

  // Sync cart UI counters and side drawer
  updateCartUI() {
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(el => el.textContent = this.cart.length);

    const drawerBody = document.getElementById('cartDrawerItems');
    const drawerTotal = document.getElementById('cartDrawerTotal');

    if (drawerBody && drawerTotal) {
      if (this.cart.length === 0) {
        drawerBody.innerHTML = '<p style="color:var(--black); opacity:0.7; text-align:center; padding:2rem 0;">Your cart is currently empty.</p>';
        drawerTotal.textContent = 'UGX 0';
        return;
      }

      let total = 0;
      drawerBody.innerHTML = this.cart.map((item, idx) => {
        total += item.price;
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding:14px; background:var(--bg-light); border-radius:var(--radius-sm);">
            <div>
              <strong style="color:var(--primary-blue);">${item.name}</strong>
              <div style="font-size:0.85rem; color:var(--black); opacity:0.8;">UGX ${item.price.toLocaleString()}</div>
            </div>
            <button onclick="AppState.removeFromCart(${idx})" style="background:none; border:none; color:#dc2626; cursor:pointer; font-weight:bold; font-size:1.2rem; padding:4px 8px;">✕</button>
          </div>
        `;
      }).join('');

      drawerTotal.textContent = `UGX ${total.toLocaleString()}`;
    }
  },

  // Remove item from cart
  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.updateCartUI();
  },

  // Animated notification toast
  showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed; bottom:30px; right:30px; background:var(--primary-blue); color:var(--gold); padding:16px 28px; border-radius:var(--radius-pill); font-weight:bold; box-shadow:var(--shadow-hover); z-index:2000; transition:var(--transition);';
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  }
};

// Toggle Dropdown Menu Visibility
function toggleDropdown() {
  const menu = document.getElementById('dropdownMenu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

// Close Dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.querySelector('.dropdown');
  const menu = document.getElementById('dropdownMenu');
  if (dropdown && menu && !dropdown.contains(event.target)) {
    menu.classList.remove('active');
  }
});

// Toggle Cart Drawer
function toggleCartDrawer(open) {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    if (open) {
      drawer.classList.add('open');
      backdrop.style.display = 'block';
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      backdrop.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
}

// Submit contact form data to API
async function submitContactToBackend(contactData) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return { success: false, message: err.message };
  }
}

// Submit order payload to API
async function submitOrderToBackend(orderData) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...orderData, items: AppState.cart })
    });
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return { success: false, message: err.message };
  }
}

// Initialize application state on page load
document.addEventListener('DOMContentLoaded', () => {
  AppState.updateCartUI();
});