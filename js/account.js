function switchToLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
}

function switchToRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}

function switchToAccount() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("accountForm").style.display = "flex";
}

function registerToLogin(event) {
  event.preventDefault();

  const userName = document.getElementById("registerInput").value;

  if (!userName) {
    alert("vui lòng nhập tên đăng nhập!");
    return false;
  }

  const password = document.getElementById("password").value;
  const repeatedPassword = document.getElementById("repeatedPassword").value;

  if (password !== repeatedPassword) {
    alert("vui lòng nhập đúng mật khẩu!");
    return false;
  }

  alert("Đăng ký thành công");

  localStorage.setItem("userName", userName);
  localStorage.setItem("password", password);

  switchToLogin();
}

function Login(event) {
  event.preventDefault();

  const loginUserName = document.getElementById("loginUserName").value;
  const loginPassword = document.getElementById("loginPassword").value;

  const userName = localStorage.getItem("userName");
  const password = localStorage.getItem("password");

  if (userName === loginUserName && loginPassword === password) {
    alert("Đăng nhập thành công!");
    switchToAccount();
  } else {
    alert("Tên đăng nhập hoặc mật khẩu không đúng!");
  }
}

function luuDuLieu() {
  // LẤY DỮ LIỆU CŨ (để giữ lại mảng orders)
  const existingData = JSON.parse(localStorage.getItem("thongTinKhachHang")) || {};

  // CẬP NHẬT CHỈ CÁC TRƯỜNG MỚI, GIỮ NGUYÊN orders
  const data = {
    ...existingData,  // ← QUAN TRỌNG: Giữ lại orders và các dữ liệu khác
    name: document.getElementById("customer-name").value,
    phone: document.getElementById("customer-phone").value,
    DOB: document.getElementById("customer-DOB").value,
    userName: localStorage.getElementById("userName"),
    email: document.getElementById("customer-email").value,
    address: document.getElementById("customer-address").value,
  };

  alert("Lưu dữ liệu thành công!");

  // Lưu lại toàn bộ (giờ có cả orders)
  localStorage.setItem("thongTinKhachHang", JSON.stringify(data));
}

function hienThiDuLieu() {
  const data = JSON.parse(localStorage.getItem("thongTinKhachHang"));

  if (!data) return;

  document.getElementById("customer-name").value = data.name;
  document.getElementById("customer-phone").value = data.phone;
  document.getElementById("customer-DOB").value = data.DOB;
  document.getElementById("customer-user-name").value = data.userName;
  document.getElementById("customer-email").value = data.email;
  document.getElementById("customer-address").value = data.address;
}

window.onload = function () {
  const data = JSON.parse(localStorage.getItem("thongTinKhachHang"));
  if (!data) return;

  document.getElementById("customer-name").value = data.name;
  document.getElementById("customer-phone").value = data.phone;
  document.getElementById("customer-DOB").value = data.DOB;
  document.getElementById("customer-user-name").value = data.userName;
  document.getElementById("customer-email").value = data.email;
  document.getElementById("customer-address").value = data.address;
};

function updateAfterLogin() {
  if ((document.getElementById("accountForm").display = "none")) {
    // DÙNG HÀM MỚI
    alert("Hãy đăng nhập trước khi mua hàng nhé!");
    switchPage(document.querySelector('[data-page="account"]'), "account");
  }

  // Đã đăng nhập → mở thanh toán
  document.querySelector(".cart-page").style.display = "none";
  document.querySelector(".checkout-page").style.display = "block";
  if (typeof renderCheckoutSummary === "function") renderCheckoutSummary();
}

/**
 * Kiểm tra người dùng đã đăng nhập chưa
 * @returns {boolean} true nếu đã đăng nhập
 */
function isLoggedIn() {
  return (
    localStorage.getItem("userName") !== null &&
    localStorage.getItem("password") !== null
  );
}

// THÊM HÀM ĐĂNG XUẤT
function logout() {
  localStorage.removeItem("userName");
  localStorage.removeItem("password");
  // localStorage.removeItem("thongTinKhachHang"); // (tùy chọn)

  alert("Đã đăng xuất thành công!");
  switchToLogin();

  // Tự động cập nhật nút giỏ hàng (nếu bạn ẩn nó)
  if (typeof updateCartButtonVisibility === "function") {
    updateCartButtonVisibility();
  }
}

function savingAddress() {
  const data = JSON.parse(localStorage.getItem("thongTinKhachHang"));

  document.getElementById("default-address").innerText = data.address;
}

//lịch sử đơn hàng
// Hiển thị trang lịch sử đơn hàng
function showOrderHistory() {
  document.getElementById("accountForm").style.display = "none";
  document.getElementById("order-history").style.display = "block";
  renderOrderHistory();
}

// Quay lại form thông tin cá nhân
function backToAccount() {
  document.getElementById("order-history").style.display = "none";
  document.getElementById("accountForm").style.display = "flex";
}

// Render danh sách đơn hàng
function renderOrderHistory() {
  const data = JSON.parse(localStorage.getItem("thongTinKhachHang"));
  const historyContainer = document.getElementById("order-history");
  if (!historyContainer || !data || !data.orders || data.orders.length === 0) {
    historyContainer.innerHTML = '<p style="text-align:center; color:#999;">Chưa có đơn hàng nào.</p>';
    return;
  }

  let html = '<div style="margin-bottom:15px;"><button onclick="backToAccount()" class="submit-button">Quay lại</button></div>';
  data.orders.forEach((order, index) => {
    let total = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    html += `
      <div class="order-item">
        <h3>Đơn hàng #${index + 1} <small style="color:#666;">(${order.date})</small></h3>
        <div class="order-items">
          ${order.items.map(item => `
            <div>
              <span>${item.name} × ${item.qty}</span>
              <span>${(item.price * item.qty).toLocaleString()} VNĐ</span>
            </div>
          `).join('')}
        </div>
        <p><strong>Tổng cộng:</strong> ${total.toLocaleString()} VNĐ</p>
        <p><strong>Thanh toán:</strong> ${order.payment}</p>
        <p><strong>Địa chỉ:</strong> ${order.address}</p>
      </div>
    `;
  });
  historyContainer.innerHTML = html;
}
