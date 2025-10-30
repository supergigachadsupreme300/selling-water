// js/script.js
const products = [
  {
    id: 1,
    name: "Strawberry Smoothie",
    category: "Sinh tố",
    price: 45000,
    image: "img/product/smoothie-strawberry.png",
    description: "Sinh tố dâu tây tươi mát, kết hợp sữa chua và đá xay mịn.",
    volume: "400ml",
    brand: "Tự làm",
},
  {
    id: 2,
    name: "Cold Brew",
    category: "Cà phê",
    price: 38000,
    image: "img/product/cafe-coldbrew.png",
    description: "Cà phê ủ lạnh 12 tiếng, đậm đà, ít chua.",
    volume: "350ml",
    brand: "Tự pha",
  },
  {
    id: 3,
    name: "nigga pee",
    category: "Cà phê",
    price: 32000,
    image: "img/product/cafe-espresso.png",
    description: "Espresso nguyên chất, đậm vị, lớp crema vàng óng.",
    volume: "30ml",
    brand: "Tự pha",
  },
  {
    id: 4,
    name: "Trà Đào",
    category: "Trà",
    price: 35000,
    image: "img/product/tea-peachtea.png",
    description: "Trà đen kết hợp đào tươi và thạch đào dai giòn.",
    volume: "500ml",
    brand: "Tự pha",
  },
  {
    id: 5,
    name: "Coca-Cola",
    category: "Có ga",
    price: 10000,
    image: "img/product/Drawing-500x500.jpg",
    description: "Nước ngọt có ga Coca-Cola, dung tích 330ml.",
    volume: "330ml",
    brand: "Coca-Cola",
  },
  {
    id: 6,
    name: "Pepsi",
    category: "Có ga",
    price: 10000,
    image: "img/product/Drawing-500x500.jpg",
    description: "Nước ngọt có ga Pepsi, dung tích 330ml.",
    volume: "330ml",
    brand: "PepsiCo",
  },
  {
    id: 7,
    name: "Sprite",
    category: "Có ga",
    price: 10000,
    image: "img/product/Drawing-500x500.jpg",
    description: "Nước ngọt có ga Sprite, vị chanh, dung tích 330ml.",
    volume: "330ml",
    brand: "Coca-Cola",
  },
  {
    id: 8,
    name: "Trà xanh C2",
    category: "Trà",
    price: 8000,
    image: "img/product/Drawing-500x500.jpg",
    description: "Trà xanh C2, dung tích 500ml.",
    volume: "500ml",
    brand: "ULV",
  },
  {
    id: 9,
    name: "Red Bull",
    category: "Nước tăng lực",
    price: 15000,
    image: "img/product/Drawing-500x500.jpg",
    description: "Red Bull, dung tích 250ml.",
    volume: "250ml",
    brand: "Red Bull",
  },
  {
    id: 10,
    name: "Aquafina",
    category: "Không ga",
    price: 7000,
    image: "img/product/Drawing-500x500.jpg",
    description: "Nước tinh khiết Aquafina, dung tích 500ml.",
    volume: "500ml",
    brand: "PepsiCo",
  },
  {
    id: 11,
    name: "Fanta",
    category: "Có ga",
    price: 10000,
    image: "img/product/Drawing-500x500.jpg",
    description: "Nước ngọt có ga Fanta, vị cam, dung tích 330ml.",
    volume: "330ml",
    brand: "Coca-Cola",
  },
  {
    id: 12,
    name: "Trà Ô Long",
    category: "Trà",
    price: 12000,
    image: "img/product/Drawing-500x500.jpg",
    description: "Trà Ô Long thơm ngon, dung tích 450ml.",
    volume: "450ml",
    brand: "THP",
  },
]; 

// Hàm addToCart toàn cục
function addToCart(name, price, qty = 1) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((i) => i.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  if (typeof renderCart === "function") renderCart();
}

// Chuyển trang
// js/script.js – SỬA HÀM switchPage


// // Export
window.switchPage = switchPage;
window.loadCart = loadCart;

// code chuyển qua lại giữa trang chủ, sản phẩm, ...
function switching_page(element, id) {
  const home_navigate = ["home", "products", "purchase", "account"];
  home_navigate.forEach(function (content) {
    document.getElementById(content).style.display = "none";
  });
  document.getElementById(id).style.display = "block";

  const buttons = document.querySelectorAll(".menu-button");
  buttons.forEach(function (button) {
    button.classList.remove("active");
  });
  element.classList.add("active");
}
