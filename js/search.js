// Elements
const searchInput = document.querySelector(".hm-searchbox input[type='text']");
const resultsBox = document.createElement("div");
resultsBox.classList.add("search-results");
document.querySelector(".hm-searchbox").appendChild(resultsBox);

let products = [];

// Load products.json
fetch("json/products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
  })
  .catch(err => console.error("Error loading products:", err));

// Live search (as user types)
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  resultsBox.innerHTML = ""; // clear old results

  if (!query) return;

  const matches = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  if (matches.length > 0) {
    matches.forEach(p => {
      const item = document.createElement("a");
      item.href = `single-product.html?id=${p.id}`; // ✅ clickable
      item.classList.add("search-item");
      item.innerHTML = `
        <img src="${p.images && p.images.length ? p.images[0] : 'images/default.jpg'}" alt="${p.name}" />
        <span>${p.name}</span>
      `;
      resultsBox.appendChild(item);
    });
  } else {
    resultsBox.innerHTML = `<p>No results found.</p>`;
  }
});


// // Elements
// const searchInput = document.querySelector(".hm-searchbox input[type='text']");
// const searchForm = document.querySelector(".hm-searchbox");
// let products = [];

// // Load products.json
// fetch("products.json")
//   .then(res => res.json())
//   .then(data => {
//     products = data;
//   })
//   .catch(err => console.error("Error loading products:", err));

// // Handle search button / form submit
// searchForm.addEventListener("submit", (e) => {
//   e.preventDefault(); // stop form refresh

//   const query = searchInput.value.toLowerCase().trim();
//   if (!query) return;

//   // Find first product that matches
//   const match = products.find(p =>
//     p.name.toLowerCase().includes(query) ||
//     p.category.toLowerCase().includes(query)
//   );

//   if (match) {
//     // ✅ Redirect to product page
//     window.location.href = match.url;
//   } else {
//     // No match → you can send them to a search results page instead
//     alert("No matching product found!");
//   }
// });


