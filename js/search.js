// Khởi tạo trang sản phẩm
function initProductsPage() {
  renderCategories();
  renderProducts();
  if (typeof setupSearch === "function") {
    setupSearch(); // Gọi từ search.js
  }
}

// Render danh mục
function renderCategories() {
  const list = document.querySelector(".category-list");
  const categories = ["Tất cả", ...new Set(products.map((p) => p.category))];
  list.innerHTML = categories
    .map(
      (c, i) => `
    <li class="category-item">
      <button class="category-btn ${
        i === 0 ? "active" : ""
      }" data-cat="${c}">${c}</button>
    </li>
  `
    )
    .join("");

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.onclick = () => {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const query = document.querySelector(".search-input").value.trim();
      renderProducts(btn.dataset.cat, query);
    };
  });
}

// Render sản phẩm
function renderProducts(filter = "Tất cả", search = "") {
  const container = document.querySelector(".product-items");
  let items = products;
  if (filter !== "Tất cả") items = items.filter((p) => p.category === filter);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  container.innerHTML =
    items.length === 0
      ? `<p style="grid-column: 1/-1; text-align:center; color:#999;">Không tìm thấy sản phẩm.</p>`
      : items
          .map(
            (p) => `
      <li class="product-card" data-id="${p.id}">
        <div class="product-thumb">
          <img src="${p.image}" alt="${p.name}" onerror="this.src='img/product/default.png'">
          <div class="thumb-circle"></div>
        </div>
        <div class="product-info">
          <p class="product-title"><i class="fa-solid fa-star"></i> ${p.name} <i class="fa-solid fa-star"></i></p>
          <button class="btn-buy" data-id="${p.id}">Mua ngay</button>
        </div>
      </li>
    `
          )
          .join("");

  attachProductEvents();
}

// Gắn sự kiện sản phẩm
function attachProductEvents() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.onclick = (e) => {
      if (e.target.closest(".btn-buy")) return;
      showProductDetail(parseInt(card.dataset.id));
    };
  });

  document.querySelectorAll(".btn-buy").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const p = products.find((x) => x.id === id);
      addToCart(p.name, p.price, 1);
      alert(`Đã thêm "${p.name}" vào giỏ!`);
    };
  });
}

// js/search.js
function setupSearch() {
  const input = document.querySelector(".search-input");
  const btn = document.querySelector(".search-btn");

  if (!input || !btn) return;

  const search = () => {
    const q = input.value.trim();
    const activeBtn = document.querySelector(".category-btn.active");
    const cat = activeBtn?.dataset.cat || "Tất cả";
    renderProducts(cat, q);
  };

  btn.onclick = search;
  input.onkeypress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      search();
    }
  };
}

// Export hàm để dùng ở nơi khác
window.setupSearch = setupSearch;