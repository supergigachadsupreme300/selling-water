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
  // tạo biến data để lưu dữ liệu người dùng
  const data = {
    name: document.getElementById("customer-name").value, // lưu theo gọi value của id
    phone: document.getElementById("customer-phone").value,
    DOB: document.getElementById("customer-DOB").value,
    userName: localStorage.getItem("userName"),
    email: document.getElementById("customer-email").value,
    address: document.getElementById("customer-address").value,
  };

  alert("Lưu dữ liệu thành công!");

  // lưu vào localStorage: kho lưu trữ cục bộ
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
