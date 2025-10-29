function luuDuLieu() {
  // tạo biến data để lưu dữ liệu người dùng
  const data = {
    name: document.getElementById("customer-name").value, // lưu theo gọi value của id
    phone: document.getElementById("customer-phone").value,
    DOB: document.getElementById("customer-DOB").value,
    userName: document.getElementById("customer-user-name").value,
    email: document.getElementById("customer-email").value,
    address: document.getElementById("customer-address").value,
  };
  // Xuất ra màn hình đã lưu dữ liệu thành công
  console.log("Dữ liệu của bạn đã được lưu !");

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
