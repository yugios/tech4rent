// State voor huurperiode
let selectedRentalPeriod = 'day'; // Standaard op dag
const RESERVE_PRICE = 15; // Vaste reserveerprijs van €15

const products = [
  {id:1,name:"HP ProBook",category:"laptop",img:"img/hp1.jpeg",specs:"i5 / 8GB RAM / 256GB SSD",price:{day:8,week:45,month:150},available:true},
  {id:2,name:"Dell Latitude",category:"laptop",img:"img/dell.jpeg",specs:"i7 / 16GB RAM / 512GB SSD",price:{day:12,week:65,month:220},available:false},
  {id:3,name:"Asus Laptop I201",category:"laptop",img:"img/asus.jpeg",specs:"i9 / 32GB RAM / 1TB SSD",price:{day:15,week:80,month:280},available:true},
  {id:4,name:"Apple MacBook Pro",category:"laptop",img:"img/apple.jpeg",specs:"M1 / 16GB RAM / 512GB SSD",price:{day:18,week:95,month:320},available:true},
  {id:5,name:"JBL Flip 6",category:"audio",img:"img/jbl6.jpeg",specs:"Waterproof, 12h battery",price:{day:3,week:15,month:50},available:true},
  {id:6,name:"JBL Party Box",category:"audio",img:"img/jblpb.jpeg",specs:"Deep bass, Bluetooth",price:{day:5,week:25,month:80},available:true},
  {id:7,name:"PS5 Console",category:"game",img:"img/ps6.jpg",specs:"Includes DualSense Controller",price:{day:10,week:50,month:170},available:true},
  {id:8,name:"Xbox Series X",category:"game",img:"img/xboxx.jpeg",specs:"Includes Controller & Games",price:{day:9,week:45,month:150},available:false},
  {id:9,name:"PS4 Console",category:"game",img:"img/ps4.jpeg",specs:"Slim model with 1TB HDD",price:{day:6,week:30,month:100},available:true},
];

// DOM Elements
const productGrid = document.getElementById('product-grid');

// State Management
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let currentPage = 'home';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  showHomePage();
  updateBadges();
  initEventListeners();
  initSlider();
  setupCreditCardInputs();
});

// Page Management Functions
function showHomePage() {
  hideAllPages();
  document.getElementById('home-page').style.display = 'block';
  document.getElementById('benefits-section').style.display = 'block';
  document.querySelector('.reviews').style.display = 'block';
  toggleHeroSection(true);
  currentPage = 'home';
  renderProducts(products);
  updateLanguage(); // Update taal bij pagina wissel
}

function showWishlistPage() {
  hideAllPages();
  document.getElementById('wishlist-page').style.display = 'block';
  toggleHeroSection(false);
  currentPage = 'wishlist';
  renderWishlistItems();
  updateLanguage(); // Update taal bij pagina wissel
}

function showCartPage() {
  hideAllPages();
  document.getElementById('cart-page').style.display = 'block';
  toggleHeroSection(false);
  currentPage = 'cart';
  renderCartItems();
  updateOrderSummary();
  updateLanguage(); // Update taal bij pagina wissel
}

function showCheckoutPage() {
  if (cartItems.length === 0) {
    showNotification(getTranslation('emptyCartWarning'), 'warning');
    return;
  }
  
  hideAllPages();
  document.getElementById('checkout-page').style.display = 'block';
  toggleHeroSection(false);
  currentPage = 'checkout';
  renderCheckoutSummary();
  updateLanguage(); // Update taal bij pagina wissel
  
  // Set rental period in checkout
  document.getElementById('rental-type').textContent = getPeriodText(selectedRentalPeriod);
}

// Add these page navigation functions to main.js
function showAboutPage() {
  hideAllPages();
  renderAboutPage();
  currentPage = 'about';
  updateLanguage();
}

function showTermsPage() {
  hideAllPages();
  renderTermsPage();
  currentPage = 'terms';
  updateLanguage();
}

// Update the hideAllPages function to include the main-content
function hideAllPages() {
  document.getElementById('home-page').style.display = 'none';
  document.getElementById('wishlist-page').style.display = 'none';
  document.getElementById('cart-page').style.display = 'none';
  document.getElementById('checkout-page').style.display = 'none';
  document.getElementById('order-confirmation-page').style.display = 'none';
  document.getElementById('benefits-section').style.display = 'none';
  document.querySelector('.reviews').style.display = 'none';
  
  // Hide main-content if it exists
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.style.display = 'none';
  }
}

// Add this function to show main-content pages
function showMainContentPage() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.style.display = 'block';
  }
  toggleHeroSection(false);
}


function toggleHeroSection(show) {
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.style.display = show ? 'block' : 'none';
  }
}

// Price Management Functions
function getPriceForPeriod(product, period = selectedRentalPeriod) {
  return product.price[period] || product.price.day;
}

function getPriceDisplay(product, period = selectedRentalPeriod) {
  const price = getPriceForPeriod(product, period);
  const periodText = getPeriodText(period);
  return `€${price}/${periodText}`;
}

function getPeriodText(period) {
  const periods = {
    day: getTranslation('day'),
    week: getTranslation('week'),
    month: getTranslation('month')
  };
  return periods[period] || period;
}

// Product Rendering met huurperiode selector in elke product cel
function renderProducts(list) {
  productGrid.innerHTML = '';
  
  if (list.length === 0) {
    productGrid.innerHTML = `<div class="col-12 text-center"><p>${getTranslation('noProductsFound')}</p></div>`;
    return;
  }
  
  list.forEach(p => {
    const isInWishlist = wishlist.some(item => item.id === p.id);
    const isInCart = cartItems.some(item => item.id === p.id);
    const currentPrice = getPriceForPeriod(p);
    const priceDisplay = getPriceDisplay(p);
    
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card product-card h-100">
        <img src="${p.img}" class="card-img-top" alt="${p.name}" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text text-muted">${p.specs}</p>
          
          <!-- Huurperiode selector IN PRODUCT CEL -->
          <div class="rental-period-selector mb-3">
            <label class="form-label small text-muted">${getTranslation('rentalPeriod')}:</label>
            <div class="btn-group btn-group-sm w-100" role="group">
              <input type="radio" class="btn-check" name="rentalPeriod${p.id}" id="day${p.id}" autocomplete="off" ${selectedRentalPeriod === 'day' ? 'checked' : ''}>
              <label class="btn btn-outline-primary" for="day${p.id}" onclick="changeRentalPeriod('day', ${p.id})">${getTranslation('day')}</label>
              
              <input type="radio" class="btn-check" name="rentalPeriod${p.id}" id="week${p.id}" autocomplete="off" ${selectedRentalPeriod === 'week' ? 'checked' : ''}>
              <label class="btn btn-outline-primary" for="week${p.id}" onclick="changeRentalPeriod('week', ${p.id})">${getTranslation('week')}</label>
              
              <input type="radio" class="btn-check" name="rentalPeriod${p.id}" id="month${p.id}" autocomplete="off" ${selectedRentalPeriod === 'month' ? 'checked' : ''}>
              <label class="btn btn-outline-primary" for="month${p.id}" onclick="changeRentalPeriod('month', ${p.id})">${getTranslation('month')}</label>
            </div>
          </div>
          
          <div class="rental-price mb-2">
            <strong class="h5 text-primary">${priceDisplay}</strong>
          </div>
          
          <p class="availability ${p.available ? 'text-success' : 'text-danger'} mb-3">
            <strong>${p.available ? getTranslation('available') : getTranslation('notAvailable')}</strong>
          </p>
          
          <div class="product-actions mt-auto">
            <button class="btn btn-success btn-sm ${!p.available ? 'disabled' : ''}" 
                    onclick="reserveProduct(${p.id})" 
                    ${!p.available ? 'disabled' : ''}>
              ${getTranslation('reserveButton')} (€${RESERVE_PRICE})
            </button>
            <button class="btn ${isInWishlist ? 'btn-warning' : 'btn-outline-secondary'} btn-sm" 
                    onclick="toggleWishlist(${p.id})">
              ${isInWishlist ? '✓ ' + getTranslation('wishlist') : getTranslation('wishlist')}
            </button>
            <button class="btn btn-primary btn-sm ${!p.available ? 'disabled' : ''}" 
                    onclick="addToCart(${p.id})" 
                    ${!p.available ? 'disabled' : ''}>
              ${getTranslation('addToCart')} (${priceDisplay})
            </button>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// Functie om huurperiode te veranderen
function changeRentalPeriod(period, productId = null) {
  selectedRentalPeriod = period;
  
  // Update alle product cards
  const currentProducts = currentPage === 'home' ? products : 
                         currentPage === 'wishlist' ? wishlist : 
                         products;
  
  renderProducts(currentProducts);
  
  // Update cart als die open is
  if (currentPage === 'cart') {
    updateOrderSummary();
  }
}

// Reserve Product Function (vaste prijs van €15)
function reserveProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product.available) return;
  
  const existingItem = cartItems.find(item => item.id === productId && item.type === 'reserve');
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cartItems.push({
      ...product,
      quantity: 1,
      rentalPeriod: selectedRentalPeriod,
      selectedPrice: RESERVE_PRICE,
      type: 'reserve',
      displayName: `${product.name} (${getTranslation('reserved')})`
    });
  }
  
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateBadges();
  
  if (currentPage === 'home') {
    renderProducts(products);
  }
  
  showNotification(`${product.name} ${getTranslation('reservedFor')} €${RESERVE_PRICE}!`, 'success');
}

// Add to Cart Function (normale prijs)
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product.available) return;
  
  const existingItem = cartItems.find(item => item.id === productId && item.type === 'regular');
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cartItems.push({
      ...product,
      quantity: 1,
      rentalPeriod: selectedRentalPeriod,
      selectedPrice: getPriceForPeriod(product),
      type: 'regular',
      displayName: product.name
    });
  }
  
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateBadges();
  
  if (currentPage === 'home') {
    renderProducts(products);
  }
  
  showNotification(`${product.name} ${getTranslation('addedToCart')}!`, 'success');
}

// Wishlist Functions
function toggleWishlist(productId) {
  const product = products.find(p => p.id === productId);
  const existingIndex = wishlist.findIndex(item => item.id === productId);
  
  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1);
    showNotification(`${product.name} ${getTranslation('removedFromWishlist')}!`, 'info');
  } else {
    wishlist.push(product);
    showNotification(`${product.name} ${getTranslation('addedToWishlist')}!`, 'success');
  }
  
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateBadges();
  
  // Re-render current page
  if (currentPage === 'home') {
    renderProducts(products);
  } else if (currentPage === 'wishlist') {
    renderWishlistItems();
  }
}

function renderWishlistItems() {
  const container = document.getElementById('wishlist-items-grid');
  const emptyMessage = document.getElementById('empty-wishlist');
  
  if (wishlist.length === 0) {
    container.innerHTML = '';
    emptyMessage.style.display = 'block';
    return;
  }
  
  emptyMessage.style.display = 'none';
  container.innerHTML = '';
  
  wishlist.forEach(item => {
    const currentPrice = getPriceForPeriod(item);
    const priceDisplay = getPriceDisplay(item);
    
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="card product-card h-100">
        <img src="${item.img}" class="card-img-top" alt="${item.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text text-muted">${item.specs}</p>
          
          <!-- Huurperiode selector IN WISHLIST PRODUCT CEL -->
          <div class="rental-period-selector mb-3">
            <label class="form-label small text-muted">${getTranslation('rentalPeriod')}:</label>
            <div class="btn-group btn-group-sm w-100" role="group">
              <input type="radio" class="btn-check" name="rentalPeriodWishlist${item.id}" id="dayWishlist${item.id}" autocomplete="off" ${selectedRentalPeriod === 'day' ? 'checked' : ''}>
              <label class="btn btn-outline-primary" for="dayWishlist${item.id}" onclick="changeRentalPeriod('day', ${item.id})">${getTranslation('day')}</label>
              
              <input type="radio" class="btn-check" name="rentalPeriodWishlist${item.id}" id="weekWishlist${item.id}" autocomplete="off" ${selectedRentalPeriod === 'week' ? 'checked' : ''}>
              <label class="btn btn-outline-primary" for="weekWishlist${item.id}" onclick="changeRentalPeriod('week', ${item.id})">${getTranslation('week')}</label>
              
              <input type="radio" class="btn-check" name="rentalPeriodWishlist${item.id}" id="monthWishlist${item.id}" autocomplete="off" ${selectedRentalPeriod === 'month' ? 'checked' : ''}>
              <label class="btn btn-outline-primary" for="monthWishlist${item.id}" onclick="changeRentalPeriod('month', ${item.id})">${getTranslation('month')}</label>
            </div>
          </div>
          
          <div class="rental-price mb-2">
            <strong class="h5 text-primary">${priceDisplay}</strong>
          </div>
          
          <p class="availability ${item.available ? 'text-success' : 'text-danger'} mb-3">
            <strong>${item.available ? getTranslation('available') : getTranslation('notAvailable')}</strong>
          </p>
          <div class="product-actions mt-auto">
            <button class="btn btn-success btn-sm" onclick="reserveProduct(${item.id})" ${!item.available ? 'disabled' : ''}>
              ${getTranslation('reserveButton')} (€${RESERVE_PRICE})
            </button>
            <button class="btn btn-primary btn-sm" onclick="addToCart(${item.id})" ${!item.available ? 'disabled' : ''}>
              ${getTranslation('addToCart')} (${priceDisplay})
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="removeFromWishlist(${item.id})">
              ${getTranslation('remove')}
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

function removeFromWishlist(productId) {
  wishlist = wishlist.filter(item => item.id !== productId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateBadges();
  renderWishlistItems();
}

// Cart Functions
function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  const emptyMessage = document.getElementById('empty-cart');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  if (cartItems.length === 0) {
    container.innerHTML = '';
    emptyMessage.style.display = 'block';
    checkoutBtn.disabled = true;
    return;
  }
  
  emptyMessage.style.display = 'none';
  checkoutBtn.disabled = false;
  container.innerHTML = '';
  
  cartItems.forEach(item => {
    const itemPrice = item.selectedPrice || getPriceForPeriod(item, item.rentalPeriod);
    const periodText = getPeriodText(item.rentalPeriod);
    const displayName = item.displayName || item.name;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item d-flex justify-content-between align-items-center border-bottom pb-3 mb-3';
    itemElement.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.img}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
        <div class="ms-3">
          <h6 class="mb-1">${displayName}</h6>
          <small class="text-muted">${item.specs}</small>
          <div class="mt-1">
            <small class="text-primary fw-bold">€${itemPrice}/${periodText}</small>
            ${item.type === 'reserve' ? `<br><small class="text-success">✓ ${getTranslation('reserved')}</small>` : ''}
          </div>
        </div>
      </div>
      <div class="text-end">
        <div class="d-flex align-items-center mb-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, '${item.type}', -1)">-</button>
          <span class="mx-3">${item.quantity || 1}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, '${item.type}', 1)">+</button>
        </div>
        <div class="fw-bold mb-2">€${(itemPrice * (item.quantity || 1)).toFixed(2)}</div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id}, '${item.type}')">
          ${getTranslation('remove')}
        </button>
      </div>
    `;
    container.appendChild(itemElement);
  });
}

function updateQuantity(productId, type, change) {
  const item = cartItems.find(item => item.id === productId && item.type === type);
  if (!item) return;
  
  item.quantity = (item.quantity || 1) + change;
  
  if (item.quantity <= 0) {
    removeFromCart(productId, type);
  } else {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateBadges();
    renderCartItems();
    updateOrderSummary();
  }
}

function removeFromCart(productId, type) {
  const product = products.find(p => p.id === productId);
  cartItems = cartItems.filter(item => !(item.id === productId && item.type === type));
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateBadges();
  renderCartItems();
  updateOrderSummary();
  showNotification(`${product.name} ${getTranslation('removedFromCart')}!`, 'info');
}

function updateOrderSummary() {
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.selectedPrice || getPriceForPeriod(item, item.rentalPeriod);
    return total + (price * (item.quantity || 1));
  }, 0);
  
  const shipping = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + shipping;
  
  document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
  document.getElementById('shipping').textContent = `€${shipping.toFixed(2)}`;
  document.getElementById('total').textContent = `€${total.toFixed(2)}`;
}

// Checkout Functions
function renderCheckoutSummary() {
  const container = document.getElementById('checkout-items');
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.selectedPrice || getPriceForPeriod(item, item.rentalPeriod);
    return total + (price * (item.quantity || 1));
  }, 0);
  
  const shipping = 5.00;
  const total = subtotal + shipping;
  
  container.innerHTML = '';
  cartItems.forEach(item => {
    const price = item.selectedPrice || getPriceForPeriod(item, item.rentalPeriod);
    const periodText = getPeriodText(item.rentalPeriod);
    const displayName = item.displayName || item.name;
    
    const div = document.createElement('div');
    div.className = 'd-flex justify-content-between mb-2';
    div.innerHTML = `
      <div>
        <span>${displayName} (${item.quantity || 1}x)</span>
        <br>
        <small class="text-muted">€${price}/${periodText}</small>
      </div>
      <span>€${(price * (item.quantity || 1)).toFixed(2)}</span>
    `;
    container.appendChild(div);
  });
  
  document.getElementById('checkout-subtotal').textContent = `€${subtotal.toFixed(2)}`;
  document.getElementById('checkout-shipping').textContent = `€${shipping.toFixed(2)}`;
  document.getElementById('checkout-total').textContent = `€${total.toFixed(2)}`;
}

// Credit Card Input Formatting
function setupCreditCardInputs() {
  const cardNumber = document.getElementById('cardNumber');
  const expiryDate = document.getElementById('expiryDate');
  const cvv = document.getElementById('cvv');
  
  if (cardNumber) {
    cardNumber.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = '';
      
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += value[i];
      }
      
      e.target.value = formattedValue;
    });
  }
  
  if (expiryDate) {
    expiryDate.addEventListener('input', function(e) {
      let value = e.target.value.replace(/[^0-9]/g, '');
      
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      
      e.target.value = value;
    });
  }
  
  if (cvv) {
    cvv.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
    });
  }
}

function processOrder() {
  const form = document.getElementById('checkout-form');
  const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
  const cardName = document.getElementById('cardName').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const cvv = document.getElementById('cvv').value;
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Validate credit card
  if (cardNumber.length < 16) {
    showNotification(getTranslation('invalidCardNumber'), 'warning');
    return;
  }
  
  if (!expiryDate || !expiryDate.includes('/')) {
    showNotification(getTranslation('invalidExpiryDate'), 'warning');
    return;
  }
  
  if (cvv.length !== 3) {
    showNotification(getTranslation('invalidCVV'), 'warning');
    return;
  }
  
  if (!cardName) {
    showNotification(getTranslation('invalidCardName'), 'warning');
    return;
  }
  
  // Process order
  const order = {
    id: 'T4R' + Date.now(),
    items: [...cartItems],
    customer: {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      postalCode: document.getElementById('postalCode').value
    },
    payment: {
      lastFour: cardNumber.slice(-4),
      type: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
    },
    rentalPeriod: selectedRentalPeriod,
    total: document.getElementById('checkout-total').textContent,
    date: new Date().toLocaleDateString('nl-NL'),
    time: new Date().toLocaleTimeString('nl-NL')
  };
  
  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Clear cart
  cartItems = [];
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateBadges();
  
  // Show confirmation
  showOrderConfirmation(order);
}

function showOrderConfirmation(order) {
  hideAllPages();
  document.getElementById('order-confirmation-page').style.display = 'block';
  currentPage = 'confirmation';
  
  const orderDetails = document.getElementById('order-details');
  orderDetails.innerHTML = `
    <p><strong>${getTranslation('orderNumber')}:</strong> ${order.id}</p>
    <p><strong>${getTranslation('date')}:</strong> ${order.date} ${getTranslation('at')} ${order.time}</p>
    <p><strong>${getTranslation('rentalPeriod')}:</strong> ${getRentalPeriodText(order.rentalPeriod)}</p>
    <p><strong>${getTranslation('paymentMethod')}:</strong> ${order.payment.type} ****${order.payment.lastFour}</p>
    <p><strong>${getTranslation('totalAmount')}:</strong> ${order.total}</p>
    <p><strong>${getTranslation('customer')}:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
    <p><strong>${getTranslation('email')}:</strong> ${order.customer.email}</p>
    <p><strong>${getTranslation('phone')}:</strong> ${order.customer.phone}</p>
    <hr>
    <p class="text-success">${getTranslation('paymentSuccess')} ${order.customer.email}</p>
    <p><small>${getTranslation('deliveryContact')}</small></p>
  `;
}

function getRentalPeriodText(period) {
  const periods = {
    day: getTranslation('perDay'),
    week: getTranslation('perWeek'), 
    month: getTranslation('perMonth')
  };
  return periods[period] || period;
}

function printOrder() {
  window.print();
}

// Utility Functions
function updateBadges() {
  document.getElementById('wishlist-count').innerText = wishlist.length;
  document.getElementById('cart-count').innerText = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
}

function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existingAlerts = document.querySelectorAll('.alert');
  existingAlerts.forEach(alert => alert.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Search and Filter Functions
function filterCategory(cat) {
  const filtered = products.filter(p => p.category === cat);
  renderProducts(filtered);
  
  const titles = {
    laptop: getTranslation('laptops'),
    audio: getTranslation('audioEquipment'), 
    game: getTranslation('gamingConsoles')
  };
  document.getElementById('productsTitle').textContent = titles[cat] || getTranslation('products');
}

function performSearch() {
  const term = document.getElementById('searchInput').value.toLowerCase().trim();
  if (term === '') {
    renderProducts(products);
    document.getElementById('productsTitle').textContent = getTranslation('allProducts');
    return;
  }
  
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(term) || 
    p.specs.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term)
  );
  
  renderProducts(filtered);
  document.getElementById('productsTitle').textContent = `${getTranslation('searchResultsFor')} "${term}"`;
}

// Language Management
let lang = localStorage.getItem('language') || 'nl';

function toggleLanguage() {
  lang = lang === 'nl' ? 'en' : 'nl';
  localStorage.setItem('language', lang);
  updateLanguage();
}

function getTranslation(key) {
  const translations = {
    nl: {
      // Navigation
      'navHome': 'Home',
      'navLaptops': 'Laptops',
      'navAudio': 'Audio',
      'navGames': 'Games',
      'navBrands': 'Merken',
      'searchButton': 'Zoek',
      
      // Product Page
      'rentalPeriod': 'Huurperiode',
      'day': 'Dag',
      'week': 'Week',
      'month': 'Maand',
      'available': '✓ Beschikbaar',
      'notAvailable': '✗ Niet beschikbaar',
      'reserveButton': 'Reserveer',
      'wishlist': 'Wishlist',
      'addToCart': 'Toevoegen',
      'noProductsFound': 'Geen producten gevonden',
      
      // Buttons & Actions
      'reserved': 'Gereserveerd',
      'reservedFor': 'gereserveerd voor',
      'addedToCart': 'toegevoegd aan winkelwagen',
      'addedToWishlist': 'toegevoegd aan wishlist',
      'removedFromWishlist': 'verwijderd uit wishlist',
      'removedFromCart': 'verwijderd uit winkelwagen',
      'remove': 'Verwijderen',
      
      // Wishlist Page
      'wishlistPageTitle': '💚 Mijn Reserveringen',
      'backToHomeWishlist': '← Terug naar Home',
      'emptyWishlistTitle': 'Je hebt nog geen reserveringen',
      'emptyWishlistText': 'Voeg producten toe aan je wishlist om ze hier te zien',
      'exploreProductsWishlist': 'Verken Producten',
      
      // Cart Page
      'cartPageTitle': '🛒 Mijn Winkelwagen',
      'continueShopping': '← Verder Winkelen',
      'emptyCartTitle': 'Je winkelwagen is leeg',
      'emptyCartText': 'Voeg producten toe aan je winkelwagen om ze hier te zien',
      'exploreProductsCart': 'Verken Producten',
      'orderSummaryTitle': 'Bestelling Overzicht',
      'subtotalLabel': 'Subtotaal:',
      'shippingLabel': 'Verzendkosten:',
      'totalLabel': 'Totaal:',
      'proceedToCheckout': 'Doorgaan naar Afrekenen',
      'emptyCartWarning': 'Je winkelwagen is leeg!',
      
      // Checkout Page
      'checkoutPageTitle': '💰 Afrekenen',
      'backToCart': '← Terug naar Winkelwagen',
      'personalDetailsTitle': 'Persoonlijke Gegevens',
      'firstNameLabel': 'Voornaam *',
      'lastNameLabel': 'Achternaam *',
      'emailLabel': 'Email *',
      'phoneLabel': 'Telefoonnummer *',
      'addressLabel': 'Adres *',
      'cityLabel': 'Stad *',
      'postalCodeLabel': 'Postcode *',
      'paymentDetailsTitle': 'Betaalgegevens',
      'cardNumberLabel': 'Creditcard Nummer *',
      'cardNameLabel': 'Naam op Kaart *',
      'expiryDateLabel': 'Vervaldatum *',
      'cvvLabel': 'CVV *',
      'termsLabel': 'Ik ga akkoord met de algemene voorwaarden *',
      'securePaymentText': 'Veilige betaling: Je gegevens worden versleuteld verzonden en wij slaan je creditcard informatie niet op.',
      'orderTitle': 'Bestelling',
      'checkoutSubtotalLabel': 'Subtotaal:',
      'checkoutShippingLabel': 'Verzendkosten:',
      'rentalPeriodLabel': 'Huurperiode:',
      'checkoutTotalLabel': 'Totaal:',
      'confirmOrderButton': 'Bevestig Bestelling & Betaal',
      'sslText': '256-bit SSL versleuteling',
      
      // Order Confirmation
      'orderConfirmedTitle': 'Bestelling Bevestigd!',
      'orderConfirmedText': 'Bedankt voor je reservering bij Tech4Rent',
      'orderDetailsTitle': 'Order Details',
      'backToHomeConfirm': 'Terug naar Home',
      'printConfirmation': 'Print Bevestiging',
      'orderNumber': 'Ordernummer',
      'date': 'Datum',
      'at': 'om',
      'paymentMethod': 'Betaalmethode',
      'totalAmount': 'Totaalbedrag',
      'customer': 'Klant',
      'paymentSuccess': 'Betaling succesvol verwerkt! We hebben een bevestigingsmail gestuurd naar',
      'deliveryContact': 'Onze medewerkers nemen binnen 24 uur contact met je op voor de levering.',
      
      // Categories
      'laptops': 'Laptops',
      'audioEquipment': 'Audio Apparatuur',
      'gamingConsoles': 'Gaming Consoles',
      'products': 'Producten',
      'allProducts': 'Alle Producten',
      'searchResultsFor': 'Zoekresultaten voor',
      
      // Validation Messages
      'invalidCardNumber': 'Voer een geldig creditcard nummer in',
      'invalidExpiryDate': 'Voer een geldige vervaldatum in (MM/JJ)',
      'invalidCVV': 'Voer een geldige CVV code in',
      'invalidCardName': 'Voer de naam op de creditcard in',
      
      // Periods
      'perDay': 'Per Dag',
      'perWeek': 'Per Week',
      'perMonth': 'Per Maand'
    },
    en: {
      // Navigation
      'navHome': 'Home',
      'navLaptops': 'Laptops',
      'navAudio': 'Audio',
      'navGames': 'Games',
      'navBrands': 'Brands',
      'searchButton': 'Search',
      
      // Product Page
      'rentalPeriod': 'Rental Period',
      'day': 'Day',
      'week': 'Week',
      'month': 'Month',
      'available': '✓ Available',
      'notAvailable': '✗ Not Available',
      'reserveButton': 'Reserve',
      'wishlist': 'Wishlist',
      'addToCart': 'Add to Cart',
      'noProductsFound': 'No products found',
      
      // Buttons & Actions
      'reserved': 'Reserved',
      'reservedFor': 'reserved for',
      'addedToCart': 'added to cart',
      'addedToWishlist': 'added to wishlist',
      'removedFromWishlist': 'removed from wishlist',
      'removedFromCart': 'removed from cart',
      'remove': 'Remove',
      
      // Wishlist Page
      'wishlistPageTitle': '💚 My Reservations',
      'backToHomeWishlist': '← Back to Home',
      'emptyWishlistTitle': 'You have no reservations yet',
      'emptyWishlistText': 'Add products to your wishlist to see them here',
      'exploreProductsWishlist': 'Explore Products',
      
      // Cart Page
      'cartPageTitle': '🛒 My Shopping Cart',
      'continueShopping': '← Continue Shopping',
      'emptyCartTitle': 'Your cart is empty',
      'emptyCartText': 'Add products to your cart to see them here',
      'exploreProductsCart': 'Explore Products',
      'orderSummaryTitle': 'Order Summary',
      'subtotalLabel': 'Subtotal:',
      'shippingLabel': 'Shipping:',
      'totalLabel': 'Total:',
      'proceedToCheckout': 'Proceed to Checkout',
      'emptyCartWarning': 'Your cart is empty!',
      
      // Checkout Page
      'checkoutPageTitle': '💰 Checkout',
      'backToCart': '← Back to Cart',
      'personalDetailsTitle': 'Personal Details',
      'firstNameLabel': 'First Name *',
      'lastNameLabel': 'Last Name *',
      'emailLabel': 'Email *',
      'phoneLabel': 'Phone Number *',
      'addressLabel': 'Address *',
      'cityLabel': 'City *',
      'postalCodeLabel': 'Postal Code *',
      'paymentDetailsTitle': 'Payment Details',
      'cardNumberLabel': 'Credit Card Number *',
      'cardNameLabel': 'Name on Card *',
      'expiryDateLabel': 'Expiry Date *',
      'cvvLabel': 'CVV *',
      'termsLabel': 'I agree to the terms and conditions *',
      'securePaymentText': 'Secure payment: Your data is encrypted and we do not store your credit card information.',
      'orderTitle': 'Order',
      'checkoutSubtotalLabel': 'Subtotal:',
      'checkoutShippingLabel': 'Shipping:',
      'rentalPeriodLabel': 'Rental Period:',
      'checkoutTotalLabel': 'Total:',
      'confirmOrderButton': 'Confirm Order & Pay',
      'sslText': '256-bit SSL encryption',
      
      // Order Confirmation
      'orderConfirmedTitle': 'Order Confirmed!',
      'orderConfirmedText': 'Thank you for your reservation at Tech4Rent',
      'orderDetailsTitle': 'Order Details',
      'backToHomeConfirm': 'Back to Home',
      'printConfirmation': 'Print Confirmation',
      'orderNumber': 'Order Number',
      'date': 'Date',
      'at': 'at',
      'paymentMethod': 'Payment Method',
      'totalAmount': 'Total Amount',
      'customer': 'Customer',
      'paymentSuccess': 'Payment processed successfully! We have sent a confirmation email to',
      'deliveryContact': 'Our staff will contact you within 24 hours for delivery.',
      
      // Categories
      'laptops': 'Laptops',
      'audioEquipment': 'Audio Equipment',
      'gamingConsoles': 'Gaming Consoles',
      'products': 'Products',
      'allProducts': 'All Products',
      'searchResultsFor': 'Search results for',
      
      // Validation Messages
      'invalidCardNumber': 'Please enter a valid credit card number',
      'invalidExpiryDate': 'Please enter a valid expiry date (MM/YY)',
      'invalidCVV': 'Please enter a valid CVV code',
      'invalidCardName': 'Please enter the name on the card',
      
      // Periods
      'perDay': 'Per Day',
      'perWeek': 'Per Week',
      'perMonth': 'Per Month'
    }
  };
  
  return translations[lang]?.[key] || key;
}

function updateLanguage() {
  // Update all elements with translation IDs
  const elements = document.querySelectorAll('[id]');
  elements.forEach(element => {
    const translation = getTranslation(element.id);
    if (translation && translation !== element.id) {
      element.textContent = translation;
      
      // Special handling for placeholders
      if (element.id === 'searchInput') {
        element.placeholder = getTranslation('searchButton') + '...';
      }
    }
  });
  
  // Update page titles and other special cases
  document.getElementById('productsTitle').textContent = getTranslation('allProducts');
  document.getElementById('heroTitle').textContent = lang === 'nl' ? 'Huur vandaag nog een laptop!' : 'Rent a laptop today!';
  document.getElementById('heroCTA').textContent = getTranslation('reserveButton') + ' ' + (lang === 'nl' ? 'Nu' : 'Now');
  
  // Update benefits section
  document.getElementById('whyTitle').textContent = lang === 'nl' ? 'Waarom bij ons huren?' : 'Why rent with us?';
  document.getElementById('why1Title').textContent = lang === 'nl' ? 'Topkwaliteit Laptops' : 'High-Quality Laptops';
  document.getElementById('why1Text').textContent = lang === 'nl' ? 'Altijd up-to-date modellen die klaar zijn voor gebruik.' : 'Always up-to-date models ready for use.';
  document.getElementById('why2Title').textContent = lang === 'nl' ? 'Betaalbare prijzen' : 'Affordable Prices';
  document.getElementById('why2Text').textContent = lang === 'nl' ? 'Flexibele huurpakketten: per dag, week of maand.' : 'Flexible rental packages: per day, week, or month.';
  document.getElementById('why3Title').textContent = lang === 'nl' ? '24/7 Support' : '24/7 Support';
  document.getElementById('why3Text').textContent = lang === 'nl' ? 'Technische ondersteuning zodat je nooit stilvalt.' : 'Technical support so you never get stuck.';
  
  // Update reviews title
  document.getElementById('reviewsTitle').textContent = lang === 'nl' ? 'Wat klanten zeggen' : 'What customers say';
  
  // Re-render current page to update product cards
  if (currentPage === 'home') {
    renderProducts(products);
  } else if (currentPage === 'wishlist') {
    renderWishlistItems();
  } else if (currentPage === 'cart') {
    renderCartItems();
  }
}

// Hero Slider
let slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
let slideInterval;

function initSlider() {
  if (slides.length > 0) {
    slideInterval = setInterval(nextSlide, 5000);
  }
}

function nextSlide() {
  if (slides.length === 0) return;
  
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

// Theme Management
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  const themeBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
  themeBtns.forEach(btn => {
    btn.textContent = isDark ? '☀️' : '🌙';
  });
}

// Event Listeners
function initEventListeners() {
  // Theme buttons
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  
  // Language buttons  
  document.getElementById('lang-toggle')?.addEventListener('click', toggleLanguage);
  
  // Search functionality
  document.getElementById('searchBtn')?.addEventListener('click', performSearch);
  document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') performSearch();
  });
  
  // Wishlist button shows wishlist page
  document.getElementById('wishlist-btn')?.addEventListener('click', showWishlistPage);
  
  // Cart button shows cart page  
  document.getElementById('cart-btn')?.addEventListener('click', showCartPage);
  
  // Hero CTA button
  document.getElementById("heroCTA")?.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.getElementById("productsTitle");
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: "smooth"
      });
    }
  });
  
  // Hover dropdown for desktop
  document.querySelectorAll('.nav-item.dropdown').forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 992) {
        const dropdown = new bootstrap.Dropdown(item.querySelector('.dropdown-toggle'));
        dropdown.show();
      }
    });
    item.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 992) {
        const dropdown = new bootstrap.Dropdown(item.querySelector('.dropdown-toggle'));
        dropdown.hide();
      }
    });
  });
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach(btn => {
      btn.textContent = '☀️';
    });
  }
  
  // Load saved language
  const savedLang = localStorage.getItem('language');
  if (savedLang) {
    lang = savedLang;
    updateLanguage();
  }
  
  // Set default rental period
  selectedRentalPeriod = 'day';
}

function showAboutPage() {
  hideAllPages();
  renderAboutPage();
  toggleHeroSection(false); // ADD THIS LINE
  currentPage = 'about';
  updateLanguage();
}

function showTermsPage() {
  hideAllPages();
  renderTermsPage();
  toggleHeroSection(false); // ADD THIS LINE
  currentPage = 'terms';
  updateLanguage();
}