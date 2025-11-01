// js/purchase.js
function renderCheckoutSummary() {
  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total-price");
  if (!container || !totalEl) return;

  const userName = localStorage.getItem("userName");
  if (!userName) {
    container.innerHTML = '<p class="cart-empty">Vui lòng đăng nhập.</p>';
    totalEl.textContent = "0 VNĐ";
    return;
  }

  const cartKey = `cart_${userName}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Giỏ hàng trống.</p>';
    totalEl.textContent = "0 VNĐ";
    return;
  }

  container.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const qty = item.qty || 1;
    const itemTotal = item.price * qty;
    total += itemTotal;
    const div = document.createElement("div");
    div.className = "summary-row";
    div.innerHTML = `<span>${item.name} × ${qty}</span><span>${itemTotal.toLocaleString()} VNĐ</span>`;
    container.appendChild(div);
  });
  totalEl.textContent = total.toLocaleString() + " VNĐ";
}

// js/purchase.js – CHỈ SỬA PHẦN NÀY

document.querySelector(".btn-confirm").onclick = () => {
  const userName = localStorage.getItem("userName");
  if (!userName) {
    alert("Vui lòng đăng nhập trước khi thanh toán!");
    switchToLogin();
    return;
  }

  const cartKey = `cart_${userName}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  // ... (phần còn lại giữ nguyên)
  // Dùng cart từ cartKey
  const order = {
    items: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty || 1 })),
    // ...
  };

  // XÓA GIỎ HÀNG SAU KHI ĐẶT HÀNG
  localStorage.removeItem(cartKey);

  // ... lưu đơn hàng, chuyển trang
};

document.querySelector(".btn-checkout").onclick = function () {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) { alert("Giỏ hàng trống!"); return; }
  document.querySelector(".cart-page").style.display = "none";
  document.querySelector(".checkout-page").style.display = "flex";
  updateDefaultAddress();
  renderCheckoutSummary();
};

document.querySelector(".btn-back").onclick = function () {
  document.querySelector(".checkout-page").style.display = "none";
  document.querySelector(".cart-page").style.display = "block";
  renderCart();
};

document.addEventListener("DOMContentLoaded", renderCheckoutSummary);

function updateDefaultAddress() {
  // THAY ĐỔI 10: Hiển thị địa chỉ của user hiện tại
  const userName = localStorage.getItem("userName");
  const defaultAddrEl = document.getElementById("default-address");
  if (!userName || !defaultAddrEl) return;

  const key = `user_${userName}`;
  const data = JSON.parse(localStorage.getItem(key));
  defaultAddrEl.textContent = data?.address ? data.address : "Vui lòng nhập địa chỉ trong phần Tài khoản.";
}
