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