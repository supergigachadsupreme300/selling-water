// js/purchase.js
function renderCheckoutSummary() {
  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total-price");
  if (!container || !totalEl) return;

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
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

document.querySelectorAll('input[name="delivery"]').forEach(radio => {
  radio.addEventListener("change", function () {
    document.getElementById("new-address-form").classList.toggle("hidden", this.value !== "new");
  });
});

document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener("change", function () {
    document.getElementById("bank-info").classList.toggle("hidden", this.value !== "bank");
  });
});

// js/purchase.js – CHỈ SỬA PHẦN NÀY

document.querySelector(".btn-confirm").onclick = () => {
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const payment = document.querySelector('input[name="payment"]:checked').value;

  if (delivery === "new" && !document.getElementById("address-input").value.trim()) {
    alert("Vui lòng nhập địa chỉ giao hàng!");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  const userData = JSON.parse(localStorage.getItem("thongTinKhachHang")) || {};
  const address = delivery === "new" 
  ? document.getElementById("address-input").value 
  : (userData.address || "Chưa có địa chỉ mặc định");

  const paymentText = { cash: "Tiền mặt", bank: "Chuyển khoản", online: "Trực tuyến" }[payment];

  // === LƯU ĐƠN HÀNG VÀO LỊCH SỬ ===
  const order = {
    items: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty || 1 })),
    payment: paymentText,
    address: address,
    date: new Date().toLocaleString('vi-VN')
  };

  let userOrders = userData.orders || [];
  userOrders.push(order);
  userData.orders = userOrders;
  localStorage.setItem('thongTinKhachHang', JSON.stringify(userData));

  // Lưu lastOrder cho trang donhang nếu cần
  localStorage.setItem('lastOrder', JSON.stringify(order));

  alert(`Đơn hàng thành công!\nTổng: ${cart.reduce((s, i) => s + i.price * (i.qty || 1), 0).toLocaleString()} VNĐ`);

  localStorage.removeItem("cart");

  // === CHUYỂN QUA TRANG ĐƠN HÀNG (ẨN TRONG MENU) ===
  switchPage(document.querySelector('.nav-link[data-page="home"]'), 'donhang');
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
  const data = JSON.parse(localStorage.getItem("thongTinKhachHang"));
  const defaultAddrEl = document.getElementById("default-address");
  if (defaultAddrEl) {
    defaultAddrEl.textContent = data?.address ? data.address : "Vui lòng nhập địa chỉ trong phần Tài khoản.";
  }
}
