// Khởi tạo trang sản phẩm
function initProductsPage() {
  renderCategories();
  currentPage = 1; // ← Thêm dòng này
  renderProducts("Tất cả", "", currentPage); // ← Gọi với trang 1
  setupSearch();
}

// Cấu hình phân trang: 8 sản phẩm mỗi trang
const PRODUCTS_PER_PAGE = 8;
let currentPage = 1;

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
      document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const query = document.querySelector(".search-input").value.trim();
      currentPage = 1;
      renderProducts(btn.dataset.cat, query, currentPage, {}); // Xóa bộ lọc nâng cao
    };
  });
}

// Render sản phẩm
function renderProducts(filter = "Tất cả", search = "", page = 1, advancedFilters = {}) {
  const container = document.querySelector(".product-items");
  const paginationContainer = document.querySelector(".pagination") || createPaginationContainer();

  let items = products;

  // 1. Lọc danh mục
  if (filter !== "Tất cả") {
    items = items.filter((p) => p.category === filter);
  }

  // 2. Lọc tìm kiếm (fuzzy)
  if (search) {
    items = items.filter(p =>
      fuzzyMatch(search, p.name) || fuzzyMatch(search, p.description)
    );
  }

  // 3. LỌC NÂNG CAO (mới)
  if (advancedFilters.brand) {
    items = items.filter(p => fuzzyMatch(advancedFilters.brand, p.brand));
  }
  if (advancedFilters.minPrice > 0) {
    items = items.filter(p => p.price >= advancedFilters.minPrice);
  }
  if (advancedFilters.maxPrice < Infinity) {
    items = items.filter(p => p.price <= advancedFilters.maxPrice);
  }
  if (advancedFilters.volume) {
    items = items.filter(p => fuzzyMatch(advancedFilters.volume, p.volume));
  }

  // 4. Phân trang
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / PRODUCTS_PER_PAGE);
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalItems);
  const paginatedItems = items.slice(startIndex, endIndex);

  currentPage = page > totalPages ? totalPages : page < 1 ? 1 : page;

  // 5. Render sản phẩm
  container.innerHTML =
    paginatedItems.length === 0
      ? `<p style="grid-column: 1/-1; text-align:center; color:#999; padding: 20px;">Không tìm thấy sản phẩm nào phù hợp.</p>`
      : paginatedItems.map(p => `
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
      `).join("");

  attachProductEvents();
  // Lưu lại để phân trang dùng
window.lastFilter = filter;
window.lastSearch = search;
window.lastAdvanced = advancedFilters;
  renderPagination(totalPages, currentPage, filter, search, advancedFilters);
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
    currentPage = 1;
    renderProducts(cat, q, currentPage, {}); // Reset bộ lọc nâng cao
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

// ==================== THÊM MỚI: TÌM KIẾM NÂNG CAO (CUỐI search.js) ====================
// ==================== CẬP NHẬT: TÌM KIẾM NÂNG CAO HIỂN THỊ NGAY KHI NHẤN ====================

// Hàm tính khoảng cách Levenshtein (fuzzy search)
function levenshteinDistance(a, b) {
  const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyMatch(query, text) {
  if (!query || !text) return false;
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase().trim();
  if (t.includes(q)) return true;
  return levenshteinDistance(q, t) <= 2;
}

// Hàm lọc nâng cao
function applyAdvancedFilters(items, filters) {
  let filtered = [...items];

  if (filters.search) {
    filtered = filtered.filter(p =>
      fuzzyMatch(filters.search, p.name) ||
      fuzzyMatch(filters.search, p.description)
    );
  }

  if (filters.brand) {
    filtered = filtered.filter(p => fuzzyMatch(filters.brand, p.brand));
  }

  if (filters.minPrice > 0) {
    filtered = filtered.filter(p => p.price >= filters.minPrice);
  }

  if (filters.maxPrice < Infinity) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice);
  }

  if (filters.volume) {
    filtered = filtered.filter(p => fuzzyMatch(filters.volume, p.volume));
  }

  return filtered;
}

// Khởi tạo tìm kiếm nâng cao
function initAdvancedSearch() {
  const toggleBtn = document.querySelector('.advanced-toggle-btn');
  const advancedBox = document.querySelector('.advanced-search-box');
  const applyBtn = document.querySelector('.apply-advanced');
  const clearBtn = document.querySelector('.clear-advanced');

  if (!toggleBtn || !advancedBox) return;

  // Nhấn "+ Nâng cao" → mở toàn bộ form ngay
  toggleBtn.onclick = () => {
    const isHidden = advancedBox.style.display === 'none';
    advancedBox.style.display = isHidden ? 'block' : 'none';
    toggleBtn.textContent = isHidden ? '− Thu gọn' : '+ Nâng cao';
  };

  // Áp dụng bộ lọc
if (applyBtn) {
  applyBtn.onclick = () => {
  const search = document.querySelector('.search-input').value.trim();
  const cat = document.querySelector('.category-btn.active')?.dataset.cat || 'Tất cả';
  const brand = document.getElementById('brand-input').value.trim();
  const minPrice = parseInt(document.getElementById('min-price').value) || 0;
  const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
  const volume = document.getElementById('volume-input').value.trim();

  const advancedFilters = { brand, minPrice, maxPrice, volume };

  currentPage = 1;
  renderProducts(cat, search, currentPage, advancedFilters); // ĐÚNG 4 tham số
};
}

// Xóa bộ lọc
if (clearBtn) {
  clearBtn.onclick = () => {
    document.getElementById('brand-input').value = '';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('volume-input').value = '';

    const activeCat = document.querySelector('.category-btn.active')?.dataset.cat || 'Tất cả';
    const search = document.querySelector('.search-input').value.trim();

    currentPage = 1;
    renderProducts(activeCat, search, currentPage, {}); // Không có bộ lọc nâng cao
  };
}
}

// Tích hợp vào initProductsPage
if (typeof initProductsPage === 'function') {
  const originalInit = initProductsPage;
  initProductsPage = function() {
    originalInit();
    initAdvancedSearch();
  };
}

window.initAdvancedSearch = initAdvancedSearch;

// ==================== KẾT THÚC CẬP NHẬT ====================

//container phân trang
function createPaginationContainer() {
  const main = document.querySelector(".products-main");
  let pagination = main.querySelector(".pagination");
  if (!pagination) {
    pagination = document.createElement("div");
    pagination.className = "pagination";
    pagination.style.cssText = "margin-top: 30px; text-align: center;";
    main.querySelector(".products-grid").after(pagination);
  }
  return pagination;
}



//thêm hàm chuyển trang và render phân trang
function renderPagination(totalPages, currentPage, filter, search, advancedFilters = {}) {
  const pagination = document.querySelector(".pagination");
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = `<div class="pagination-controls">`;

  const buildOnClick = (page) => `changePage(${page})`;

// Nút Trước
  if (currentPage > 1) {
    html += `<button class="page-btn" onclick="${buildOnClick(currentPage - 1)}">Trước</button>`;
  } else {
    html += `<button class="page-btn disabled">Trước</button>`;
  }

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    html += `<button class="page-btn" onclick="${buildOnClick(1)}">1</button>`;
    if (startPage > 2) html += `<span class="page-dots">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `
      <button class="page-btn ${i === currentPage ? 'active' : ''}" 
              onclick="${buildOnClick(i)}">${i}</button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += `<span class="page-dots">...</span>`;
    html += `<button class="page-btn" onclick="${buildOnClick(totalPages)}">${totalPages}</button>`;
  }

  // Nút Sau
  if (currentPage < totalPages) {
    html += `<button class="page-btn" onclick="${buildOnClick(currentPage + 1)}">Sau</button>`;
  } else {
    html += `<button class="page-btn disabled">Sau</button>`;
  }
  html += `</div>`;
  pagination.innerHTML = html;
}

function changePage(page) {
  // Lấy dữ liệu từ lần render trước
  const filter = window.lastFilter || "Tất cả";
  const search = window.lastSearch || "";
  const advancedFilters = window.lastAdvanced || {};

  currentPage = page;
  renderProducts(filter, search, page, advancedFilters);
  document.querySelector(".products-main").scrollIntoView({ behavior: "smooth" });
}

// Export hàm để dùng ở nơi khác
window.setupSearch = setupSearch;

