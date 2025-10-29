// js/donhang.js
function showDonHangPage() {
  const orderData = JSON.parse(localStorage.getItem('lastOrder') || 'null');
  if (!orderData) {
    alert("Không tìm thấy thông tin đơn hàng!");
    switchPage(document.querySelector('.nav-link[data-page="home"]'), 'home');
    return;
  }

  const itemsEl = document.getElementById('donhang-items');
  const totalEl = document.getElementById('donhang-total');
  const paymentEl = document.getElementById('donhang-payment');
  const addressEl = document.getElementById('donhang-address');

  if (!itemsEl || !totalEl) return;

  let total = 0;
  const itemsHTML = orderData.items.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    return `<div>
              <span>${item.name} × ${item.qty}</span>
              <span>${itemTotal.toLocaleString()} VNĐ</span>
            </div>`;
  }).join('');

  itemsEl.innerHTML = itemsHTML || '<p>Giỏ hàng trống.</p>';
  totalEl.textContent = total.toLocaleString() + ' VNĐ';
  paymentEl.textContent = orderData.payment;
  addressEl.textContent = orderData.address;

  // Nút tiếp tục
  document.querySelector('.btn-tiep-tuc').onclick = () => {
    localStorage.removeItem('lastOrder');
    switchPage(document.querySelector('.nav-link[data-page="home"]'), 'home');
  };
}

// Tự động chạy khi vào trang donhang
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('donhang')) {
    showDonHangPage();
  }
});