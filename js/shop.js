
document.addEventListener("DOMContentLoaded", function() {
    let products = Array.from(document.querySelectorAll(".product-item"));
    let currentPage = 1;
    let perPage = 12;

    let searchInput = document.querySelector(".hm-searchbox input[type='text']");
    let categorySelect = document.querySelector(".select-search-category");

    // 🔍 Filter products (by search + category + manufacturer)
    function filterProducts() {
        let searchText = searchInput.value.toLowerCase().trim();
        let selectedCategory = categorySelect.value;

        return products.filter(prod => {
            let name = prod.querySelector(".product_name").textContent.toLowerCase();
            let manufacturer = prod.querySelector(".manufacturer").textContent.toLowerCase();
            let category = prod.dataset.category; // needs to be set in your HTML

            let matchesSearch = name.includes(searchText) || manufacturer.includes(searchText);
            let matchesCategory = (selectedCategory === "0" || selectedCategory === category);

            return matchesSearch && matchesCategory;
        });
    }

    // 📑 Show products for current page
    function showPage(page, filtered) {
        let total = filtered.length;
        let totalPages = Math.ceil(total / perPage);
        if (page > totalPages) page = totalPages || 1;

        let start = (page - 1) * perPage;
        let end = start + perPage;

        products.forEach(p => p.style.display = "none");
        filtered.slice(start, end).forEach(p => p.style.display = "block");

        currentPage = page;
        updatePagination(total, page);
    }

    // 🔄 Update pagination UI
    function updatePagination(total, page) {
        let totalPages = Math.ceil(total / perPage);
        let startItem = (page - 1) * perPage + 1;
        let endItem = Math.min(page * perPage, total);

        document.querySelector(".pagination-info").innerText =
            total > 0 ? `Showing ${startItem}–${endItem} of ${total} item(s)` : `No items found`;

        document.querySelectorAll(".pagination-box li").forEach(li => li.classList.remove("active"));

        let activeLink = document.querySelector(`.pagination-box a[data-page="${page}"]`);
        if (activeLink) activeLink.parentElement.classList.add("active");

        document.querySelector(".Previous").parentElement.classList.toggle("disabled", page === 1);
        document.querySelector(".Next").parentElement.classList.toggle("disabled", page === totalPages || totalPages === 0);
    }

    // 🎛 Handle pagination clicks
    document.querySelectorAll(".pagination-box a[data-page]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            let page = parseInt(link.dataset.page);
            showPage(page, filterProducts());
        });
    });

    document.querySelector(".Previous").addEventListener("click", e => {
        e.preventDefault();
        if (currentPage > 1) showPage(currentPage - 1, filterProducts());
    });

    document.querySelector(".Next").addEventListener("click", e => {
        e.preventDefault();
        let total = filterProducts().length;
        let totalPages = Math.ceil(total / perPage);
        if (currentPage < totalPages) showPage(currentPage + 1, filterProducts());
    });

    // 🔍 Handle search + category
    searchInput.addEventListener("input", () => showPage(1, filterProducts()));
    categorySelect.addEventListener("change", () => showPage(1, filterProducts()));

    // 🎯 Manufacturer click filter
    document.querySelectorAll(".filter-company").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            let selectedCompany = link.dataset.company.toLowerCase();

            searchInput.value = selectedCompany; // show it in the search bar
            showPage(1, filterProducts());
        });
    });

    // 🛑 Stop form from submitting (avoid reload)
    document.querySelector(".hm-searchbox").addEventListener("submit", function(e) {
        e.preventDefault();
        showPage(1, filterProducts());
    });

    // Initial load
    showPage(1, filterProducts());
});

// 🔄 Update pagination UI dynamically
function updatePagination(total, page) {
    let totalPages = Math.ceil(total / perPage);
    let startItem = (page - 1) * perPage + 1;
    let endItem = Math.min(page * perPage, total);

    // Update "Showing X–Y of Z items"
    document.querySelector(".pagination-info").innerText =
        total > 0 ? `Showing ${startItem}–${endItem} of ${total} item(s)` : `No items found`;

    let paginationBox = document.querySelector(".pagination-box");
    paginationBox.innerHTML = ""; // clear old buttons

    // Previous button
    let prev = document.createElement("li");
    prev.innerHTML = `<a href="#" class="Previous"><i class="fa fa-chevron-left"></i> Previous</a>`;
    if (page === 1) prev.classList.add("disabled");
    prev.addEventListener("click", e => {
        e.preventDefault();
        if (page > 1) showPage(page - 1, filterProducts());
    });
    paginationBox.appendChild(prev);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        let li = document.createElement("li");
        li.innerHTML = `<a href="#" data-page="${i}">${i}</a>`;
        if (i === page) li.classList.add("active");
        li.querySelector("a").addEventListener("click", e => {
            e.preventDefault();
            showPage(i, filterProducts());
        });
        paginationBox.appendChild(li);
    }

    // Next button
    let next = document.createElement("li");
    next.innerHTML = `<a href="#" class="Next">Next <i class="fa fa-chevron-right"></i></a>`;
    if (page === totalPages || totalPages === 0) next.classList.add("disabled");
    next.addEventListener("click", e => {
        e.preventDefault();
        if (page < totalPages) showPage(page + 1, filterProducts());
    });
    paginationBox.appendChild(next);
}



