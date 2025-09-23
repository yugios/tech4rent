const products = [
  {id:1,name:"HP ProBook",category:"laptop",img:"img/hp1.jpeg",specs:"i5 / 8GB RAM / 256GB SSD",price:{day:15,week:90,month:350},available:true},
  {id:2,name:"Dell Latitude",category:"laptop",img:"img/dell.jpeg",specs:"i7 / 16GB RAM / 512GB SSD",price:{day:20,week:120,month:450},available:false},
  {id:3,name:"Asus Laptop I201",category:"laptop",img:"img/asus.jpeg",specs:"i9 / 32GB RAM / 1TB SSD",price:{day:20,week:120,month:450},available:true},
  {id:4,name:"Apple MacBook Pro",category:"laptop",img:"img/apple.jpeg",specs:"M1 / 16GB RAM / 512GB SSD",price:{day:25,week:150,month:550},available:true},
  {id:5,name:"JBL Flip 6",category:"audio",img:"img/jbl6.jpeg",specs:"Waterproof, 12h battery",price:{day:5,week:25,month:80},available:true},
  {id:6,name:"JBL Party Box",category:"audio",img:"img/jblpb.jpeg",specs:"Deep bass, Bluetooth",price:{day:8,week:45,month:150},available:true},
  {id:7,name:"PS5 Console",category:"game",img:"img/ps6.jpg",specs:"Includes DualSense Controller",price:{day:20,week:120,month:400},available:true},
  {id:8,name:"Xbox Series X",category:"game",img:"img/xboxx.jpeg",specs:"Includes Controller & Games",price:{day:18,week:110,month:380},available:false},
  {id:9,name:"PS4 Console",category:"game",img:"img/ps4.jpeg",specs:"Slim model with 1TB HDD",price:{day:12,week:70,month:250},available:true},
];

const productGrid = document.getElementById('product-grid');

function renderProducts(list) {
  productGrid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card product-card">
        <img src="${p.img}" class="card-img-top" alt="${p.name}">
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">${p.specs}</p>
          <p class="rental-price">€${p.price.day}/dag | €${p.price.week}/week | €${p.price.month}/maand</p>
          <p class="availability ${p.available ? 'text-success' : 'text-danger'}">
            ${p.available ? 'Beschikbaar' : 'Niet beschikbaar'}
          </p>
          <div class="product-actions">
            <button class="btn btn-outline-primary">Reserveer</button>
            <button class="btn btn-outline-secondary">Wishlist</button>
            <button class="btn btn-outline-success">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

renderProducts(products);

function filterCategory(cat) {
  const filtered = products.filter(p => p.category === cat);
  renderProducts(filtered);
}

// Hero slider
let slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}
setInterval(nextSlide, 5000);

// ✅ Dark mode toggle (desktop + mobile)
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);

// ✅ Language toggle (desktop + mobile)
let lang = 'nl';
function toggleLanguage() {
  const langDesktop = document.getElementById('lang-toggle');
  const langMobile = document.getElementById('lang-toggle-mobile');

  const texts = {
    nl: {
      lang: 'NL',
      heroTitle: 'Huur vandaag nog een laptop!',
      heroCTA: 'Reserveer Nu',
      productsTitle: 'Populaire Laptops',
      whyTitle: 'Waarom bij ons huren?',
      why1Title: 'Topkwaliteit Laptops',
      why1Text: 'Altijd up-to-date modellen die klaar zijn voor gebruik.',
      why2Title: 'Betaalbare prijzen',
      why2Text: 'Flexibele huurpakketten: per dag, week of maand.',
      why3Title: '24/7 Support',
      why3Text: 'Technische ondersteuning zodat je nooit stilvalt.',
      reviewsTitle: 'Wat klanten zeggen'
    },
    en: {
      lang: 'EN',
      heroTitle: 'Rent a Laptop Today!',
      heroCTA: 'Reserve Now',
      productsTitle: 'Popular Products',
      whyTitle: 'Why Rent With Us?',
      why1Title: 'High-Quality Laptops',
      why1Text: 'Always up-to-date with all models ready to use.',
      why2Title: 'Affordable Prices',
      why2Text: 'Flexible rental packages: per day, week, or month.',
      why3Title: '24/7 Support',
      why3Text: 'Technical support so you never get stuck or bamboozled.',
      reviewsTitle: 'Customer Reviews'
    }
  };

  lang = lang === 'nl' ? 'en' : 'nl';
  const current = texts[lang];

  langDesktop && (langDesktop.innerText = current.lang);
  langMobile && (langMobile.innerText = current.lang);

  for (const [id, text] of Object.entries(current)) {
    if (id === 'lang') continue; // skip lang button
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  }
}

document.getElementById('lang-toggle')?.addEventListener('click', toggleLanguage);
document.getElementById('lang-toggle-mobile')?.addEventListener('click', toggleLanguage);

document.getElementById("heroCTA").addEventListener("click", function (e) {
  e.preventDefault(); // prevent default jump
  const target = document.getElementById("productsTitle");
  window.scrollTo({
    top: target.offsetTop - 70, // adjust for navbar height if needed
    behavior: "smooth"
  });
});

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


// Search filter
document.getElementById('searchBtn').addEventListener('click', () => {
  const term = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(term) || p.specs.toLowerCase().includes(term)
  );
  renderProducts(filtered);
});

let wishlistItems = [];
let cartItems = [];

// Update badges
function updateBadges() {
  document.getElementById('wishlist-count').innerText = wishlistItems.length;
  document.getElementById('cart-count').innerText = cartItems.length;
}

// Add event listeners for product buttons
productGrid.addEventListener('click', e => {
  const card = e.target.closest('.product-card');
  if (!card) return;
  const title = card.querySelector('.card-title').innerText;

  // Reserveer button adds to wishlist
  if (e.target.classList.contains('btn-outline-secondary')) {
    if (!wishlistItems.includes(title)) wishlistItems.push(title);
    updateBadges();
    alert(`"${title}" is toegevoegd aan je reserveringen!`);
  }

  // Add to Cart button
  if (e.target.classList.contains('btn-outline-success')) {
    if (!cartItems.includes(title)) cartItems.push(title);
    updateBadges();
    alert(`"${title}" is toegevoegd aan je winkelwagen!`);
  }
});

// Show wishlist modal or alert
document.getElementById('wishlist-btn').addEventListener('click', () => {
  if (wishlistItems.length === 0) alert("Je hebt nog geen reserveringen.");
  else alert("Gereseveerde items:\n" + wishlistItems.join("\n"));
});

// Show cart modal or alert
document.getElementById('cart-btn').addEventListener('click', () => {
  if (cartItems.length === 0) alert("Je winkelwagen is leeg.");
  else alert("Winkelwagen items:\n" + cartItems.join("\n"));
});

// --- Wishlist Logic ---
let wishlist = [];

// Function to add product to wishlist
function addToWishlist(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Avoid duplicates
  if (!wishlist.find(p => p.id === productId)) {
    wishlist.push(product);
  }

  // Update wishlist count
  document.getElementById('wishlist-count').innerText = wishlist.length;
}

// Example: Attach click event to all Reserveer buttons (or heart buttons)
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('btn-add-wishlist')) {
    const id = parseInt(e.target.dataset.id);
    addToWishlist(id);
    alert(`Added ${products.find(p=>p.id===id).name} to wishlist!`);
  }
});

// Wishlist button in navbar
document.getElementById('wishlist-btn').addEventListener('click', function() {
  if (wishlist.length === 0) {
    alert('Je wishlist is leeg!');
  } else {
    let list = wishlist.map(p => p.name).join('\n');
    alert('Je wishlist:\n' + list);
  }
});
