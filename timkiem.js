const header = document.createElement('header');
const logo = document.createElement('img');
logo.src = 'images/logo.png';
logo.alt = 'Logo';
logo.className = 'logo';
const title = document.createElement('h1');
title.textContent = 'Quản lý sản phẩm';
header.appendChild(logo);
header.appendChild(title);
document.body.prepend(header);

const products = [
  { id: 1, name: 'Coca-Cola', category: 'Có ga', price: 10000, image: 'images/coca-cola.png', description: 'Nước ngọt có ga Coca-Cola, dung tích 330ml.', volume: '330ml', brand: 'Coca-Cola' },
  { id: 2, name: 'Pepsi', category: 'Có ga', price: 10000, image: 'images/pepsi.png', description: 'Nước ngọt có ga Pepsi, dung tích 330ml.', volume: '330ml', brand: 'PepsiCo' },
  { id: 3, name: 'Sprite', category: 'Có ga', price: 10000, image: 'images/Sprite.png', description: 'Nước ngọt có ga Sprite, vị chanh, dung tích 330ml.', volume: '330ml', brand: 'Coca-Cola' },
  { id: 4, name: 'Trà xanh C2', category: 'Trà', price: 8000, image: 'images/C2.png', description: 'Trà xanh C2, dung tích 455ml.', volume: '500ml', brand: 'URC' },
  { id: 5, name: 'Red Bull', category: 'Nước tăng lực', price: 15000, image: 'images/Redbull.png', description: 'Red Bull, dung tích 250ml.', volume: '250ml', brand: 'Red Bull' },
  { id: 6, name: 'Aquafina', category: 'Không ga', price: 7000, image: 'images/Aquafina.png', description: 'Nước tinh khiết Aquafina, dung tích 500ml.', volume: '500ml', brand: 'PepsiCo' },
  { id: 7, name: 'Fanta', category: 'Có ga', price: 10000, image: 'images/Fanta.png', description: 'Nước ngọt có ga Fanta, vị cam, dung tích 330ml.', volume: '330ml', brand: 'Coca-Cola' },
  { id: 8, name: 'Trà Ô Long', category: 'Trà', price: 12000, image: 'images/OLong.png', description: 'Trà Ô Long thơm ngon, dung tích 450ml.', volume: '450ml', brand: 'THP' },
  { id: 9, name: 'Coca-Cola không calo', category: 'Có ga', price: 10000, image: 'images/coca-cola-khongcalo.png', description: 'Nước ngọt có ga Coca-Cola không calo , dung tích 330ml.', volume: '330ml', brand: 'Coca-Cola' },
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortPrice = document.getElementById("sortPrice");
const resetFilters = document.getElementById("resetFilters");
const searchButton = document.getElementById("searchButton");
const orderList = document.getElementById("orderList");
let orders = [];

function displayProducts(filteredProducts) {
  productGrid.innerHTML = "";
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<p>Không tìm thấy sản phẩm</p>';
    return;
  }
  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
      <div class="info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Thể tích: ${product.volume}</p>
        <p>Thương hiệu: ${product.brand}</p>
        <p>Giá: ${product.price.toLocaleString()}₫</p>
        <button onclick="addToOrder(${product.id})">Thêm</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function applyFilters() {
  productGrid.innerHTML = 'Đang tải...';
  let filtered = [...products];
  const keyword = searchInput.value.toLowerCase();
  if (keyword) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword));
  }
  const category = categoryFilter.value;
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  const sortOption = sortPrice.value;
  if (sortOption === "asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "desc") {
    filtered.sort((a, b) => b.price - a.price);
  }
  setTimeout(() => displayProducts(filtered), 250);
}

function addToOrder(productId) {
  const existing = orders.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    const product = products.find(p => p.id === productId);
    orders.push({ ...product, quantity: 1 });
  }
  updateOrderList();
}

function removeFromOrder(productId) {
  orders = orders.filter(item => item.id !== productId);
  updateOrderList();
}

function updateOrderList() {
  orderList.innerHTML = "";
  let total = 0;
  orders.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity} - ${itemTotal.toLocaleString()}₫
      <button onclick="removeFromOrder(${item.id})">✖</button>
    `;
    orderList.appendChild(li);
  });
  if (orders.length > 0) {
    const totalLi = document.createElement("li");
    totalLi.style.fontWeight = "bold";
    totalLi.innerHTML = `Tổng cộng: ${total.toLocaleString()}₫`;
    orderList.appendChild(totalLi);
  }
}

searchButton.addEventListener("click", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
sortPrice.addEventListener("change", applyFilters);
resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "";
  sortPrice.value = "";
  displayProducts(products);
});

displayProducts(products);