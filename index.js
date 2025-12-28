const productsData = [
  { id: 101, name: "کاپشن چرم اسپرت", price: 1200000, category: "پوشاک", image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Jacket" },
  { id: 102, name: "عینک آفتابی اورجینال", price: 450000, category: "اکسسوری", image: "https://via.placeholder.com/300x200/ffc107/333333?text=Sunglasses" },
  { id: 103, name: "لپ‌تاپ گیمینگ X1", price: 45000000, category: "دیجیتال", image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Laptop" },
  { id: 104, name: "شلوار جین جذب", price: 310000, category: "پوشاک", image: "https://via.placeholder.com/300x200/007bff/ffffff?text=Jeans" },
  { id: 105, name: "ساعت هوشمند Pro 2025", price: 2800000, category: "دیجیتال", image: "https://via.placeholder.com/300x200/6c757d/ffffff?text=Smartwatch" },
  { id: 106, name: "کمربند چرمی کلاسیک", price: 180000, category: "اکسسوری", image: "https://via.placeholder.com/300x200/17a2b8/ffffff?text=Belt" },
  { id: 107, name: "کفش کتانی نایکی", price: 950000, category: "پوشاک", image: "https://via.placeholder.com/300x200/343a40/ffffff?text=Sneaker" },
];

let cart = JSON.parse(localStorage.getItem('finalCart')) || [];
let currentFilter = 'همه'; // نگهداری وضعیت فیلتر فعلی

const productsContainer = document.getElementById('products');
const cartItemsContainer = document.getElementById('cart-items');
const totalDisplay = document.getElementById('total');
const cartSidebar = document.getElementById('cart-sidebar');
const searchInput = document.getElementById('search');


document.addEventListener('DOMContentLoaded', () => {
    applyFilterAndRender(currentFilter); // اجرای فیلتر اولیه
    setupEventListeners();
    renderCart();
});

function setupEventListeners() {
    searchInput.addEventListener('input', () => handleSearch());
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
}

// --- منطق اصلی نمایش (فیلتر + جستجو) ---

function applyFilterAndRender(filter) {
    currentFilter = filter;
    const query = searchInput.value.toLowerCase();
    
    // 1. فیلتر اولیه بر اساس دسته بندی
    let filtered = productsData.filter(p => 
        filter === 'همه' || p.category === filter
    );

    // 2. اعمال جستجو روی نتایج فیلتر شده
    const searchResults = filtered.filter(p => 
        p.name.toLowerCase().includes(query)
    );
    
    renderProducts(searchResults);
}

function handleSearch() {
    applyFilterAndRender(currentFilter); // فراخوانی مجدد با وضعیت فیلتر فعلی
}

// --- رندرینگ محصولات ---
function renderProducts(list) {
  productsContainer.innerHTML = '<div class="loader" style="grid-column: 1 / -1; text-align: center;">در حال بارگذاری...</div>';
  
  // شبیه سازی تاخیر کوچک برای نمایش افکت "بارگذاری"
  setTimeout(() => {
      productsContainer.innerHTML = '';
      if (list.length === 0) {
          productsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #777;">موردی با این مشخصات یافت نشد.</p>';
          return;
      }

      list.forEach(p => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.price.toLocaleString()} ت</p>
          <button class="add" onclick="addToCart(${p.id})">افزودن به سبد</button>
        `;
        productsContainer.appendChild(div);
      });
  }, 150); // تاخیر کوتاه
}

// --- مدیریت سبد خرید ---

function saveCart() {
  localStorage.setItem('finalCart', JSON.stringify(cart));
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<li style="text-align: center; color: #aaa; padding: 20px 0;">سبد خرید خالی است.</li>';
  } else {
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} (x${item.qty})</span>
            <div>
                <span style="font-weight: bold;">${subtotal.toLocaleString()} ت</span>
                <button data-id="${item.id}" class="remove-item">✖</button>
            </div>
        `;
        cartItemsContainer.appendChild(li);
        total += subtotal;
        totalItems += item.qty;
    });
  }
  
  totalDisplay.textContent = total.toLocaleString();
  document.getElementById('cart-toggle').textContent = `🛒 سبد خرید (${totalItems})`;
  saveCart();
}

function addToCart(id) {
  const prod = productsData.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ 
        id: prod.id, 
        name: prod.name, 
        price: prod.price, 
        qty: 1 
    });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function clearCart() {
    if (confirm("آیا از پاک کردن کامل سبد خرید مطمئن هستید؟")) {
        cart = [];
        renderCart();
    }
}

function handleCheckout() {
    if (cart.length === 0) {
        alert("لطفاً ابتدا محصولی به سبد خرید اضافه کنید.");
        return;
    }
    alert(`موفقیت! سفارش شما به مبلغ ${totalDisplay.textContent} تومان در حال پردازش است (شبیه سازی).`);
    cart = [];
    renderCart();
    toggleCart();
}

function toggleCart() {
    cartSidebar.classList.toggle('hidden');
    if (!cartSidebar.classList.contains('hidden')) {
        // در صورت باز شدن، مجدد رندر کن تا اعداد لحظه‌ای باشند
        renderCart();
    }
}

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const id = parseInt(e.target.dataset.id);
        removeFromCart(id);
    }
});
