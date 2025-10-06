let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ✅ Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ✅ Update header trigger
function updateHeaderCartTrigger() {
  let subtotal = 0, totalItems = 0;

  cart.forEach(item => {
    let priceNumber = parseFloat(item.price.replace(/[^\d.]/g, "")); // clean ₦, commas, text
    subtotal += priceNumber * item.quantity;
    totalItems += item.quantity;
  });

  const trigger = document.querySelector(".hm-minicart-trigger .item-text");
  if (trigger) {
    trigger.innerHTML = `₦${subtotal.toLocaleString()}
      <span class="cart-item-count">${totalItems}</span>`;
  }
}

// ✅ Update mini cart dropdown
function updateMiniCart() {
  const miniCartList = document.querySelector(".minicart-product-list");
  const miniCartTotal = document.querySelector(".minicart-total span");

  if (!miniCartList) return;

  miniCartList.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    let priceNumber = parseFloat(item.price.replace(/[^\d.]/g, ""));
    subtotal += priceNumber * item.quantity;

    miniCartList.innerHTML += `
      <li>
        <a href="single-product.html" class="minicart-product-image">
          <img src="${item.image}" alt="${item.name}">
        </a>
        <div class="minicart-product-details">
          <h6><a href="#">${item.name}</a></h6>
          <span>${item.price} x ${item.quantity}</span>
        </div>
        <button class="close" title="Remove" onclick="removeFromCart(${index})">
          <i class="fa fa-close"></i>
        </button>
      </li>
    `;
  });

  if (miniCartTotal) {
    miniCartTotal.textContent = `₦${subtotal.toLocaleString()}`;
  }
}
function updateQuantity(index, qty) {
  cart[index].quantity = parseInt(qty) > 0 ? parseInt(qty) : 1;
  refreshCart();
}
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Call this when your page loads
loadCartFromLocalStorage();
updateMiniCart();

// ✅ Update full cart page
function updateFullCart() {
  const cartTable = document.querySelector(".Shopping-cart-area tbody");
  const cartTotals = document.querySelector(".cart-page-total ul");

  if (!cartTable) return;

  cartTable.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    let priceNumber = parseFloat(item.price.replace(/[^\d.]/g, ""));
    let total = priceNumber * item.quantity;
    subtotal += total;

    cartTable.innerHTML += `
      <tr>
        <td class="li-product-remove"><a href="#" onclick="removeFromCart(${index})"><i class="fa fa-times"></i></a></td>
        <td class="li-product-thumbnail"><a href="#"><img src="${item.image}" alt="${item.name}"></a></td>
        <td class="li-product-name"><a href="#">${item.name}</a></td>
        <td class="li-product-price"><span class="amount">${item.price}</span></td>
        <td class="quantity">
          <label>Quantity</label>
          <div class="cart-plus-minus">
            <input class="cart-plus-minus-box" value="${item.quantity}" type="text"
              onchange="updateQuantity(${index}, this.value)">
          </div>
        </td>
        <td class="product-subtotal"><span class="amount">₦${total.toLocaleString()}</span></td>
      </tr>
    `;
  });

  if (cartTotals) {
    cartTotals.innerHTML = `
      <li>Subtotal <span>₦${subtotal.toLocaleString()}</span></li>
      <li>Total <span>₦${subtotal.toLocaleString()}</span></li>
    `;
  }
}

// ✅ Master refresh
function refreshCart() {
  saveCart();
  updateHeaderCartTrigger();
  updateMiniCart();
  updateFullCart();
}

// ✅ Cart actions
function addToCart(name, price, image) {
  let existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }
  refreshCart();
  saveCartToLocalStorage();
  updateMiniCart();

  // Show success modal instead of alert
  showCartSuccessModal(name);
}


function removeFromCart(index) {
  cart.splice(index, 1);
  refreshCart();
}




// ✅ Hook all "Add to cart" buttons
function setupAddToCartButtons() {
  document.querySelectorAll(".single-product-wrap").forEach(product => {
    const btn = product.querySelector(".add-cart a");
    const name = product.querySelector(".product_name").innerText;
    const price = product.querySelector(".new-price").innerText;
    const image = product.querySelector(".product-image img").src;

    if (btn) {
      btn.addEventListener("click", e => {
        e.preventDefault();
        addToCart(name, price, image);
      });
    }
  });
}


// ✅ Run on page load
window.addEventListener("load", () => {
  refreshCart();
  setupAddToCartButtons();
});
 // Hook modal "Add to Cart" button
  document.addEventListener("DOMContentLoaded", function () {
    const modalBtn = document.getElementById("modalAddToCart");
    if (modalBtn) {
      modalBtn.addEventListener("click", function () {
        // Grab product details from modal
        const name = document.getElementById("modalName").innerText;
        const price = document.getElementById("modalPrice").innerText;
        const image = document.querySelector("#modalLargeImages img") 
                      ? document.querySelector("#modalLargeImages img").src 
                      : "";

        // Use your existing addToCart function
        addToCart(name, price, image);

       
      });
    }
  });

  function showCartSuccessModal(productName) {
  const msg = document.getElementById("cartSuccessMessage");
  if (msg) {
    msg.textContent = `${productName} has been added to your cart!`;
  }
  $('#cartSuccessModal').modal('show'); // Bootstrap 4 way
}
// ✅ Update checkout page (if present)
function updateCheckoutCart() {
  const checkoutTableBody = document.querySelector(".your-order-table tbody");
  const cartSubtotalEl = document.querySelector(".cart-subtotal .amount");
  const orderTotalEl = document.querySelector(".order-total .amount");

  if (!checkoutTableBody) return; // Only run on checkout page

  checkoutTableBody.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    let priceNumber = parseFloat(item.price.replace(/[^\d.]/g, ""));
    let total = priceNumber * item.quantity;
    subtotal += total;

    checkoutTableBody.innerHTML += `
      <tr class="cart_item">
        <td class="cart-product-name">
          ${item.name} <strong class="product-quantity"> × ${item.quantity}</strong>
        </td>
        <td class="cart-product-total">
          <span class="amount">₦${total.toLocaleString()}</span>
        </td>
      </tr>
    `;
  });

  if (cartSubtotalEl) cartSubtotalEl.textContent = `₦${subtotal.toLocaleString()}`;
  if (orderTotalEl) orderTotalEl.textContent = `₦${subtotal.toLocaleString()}`;
}
function refreshCart() {
  saveCart();
  updateHeaderCartTrigger();
  updateMiniCart();
  updateFullCart();
  updateCheckoutCart(); // ✅ keep checkout synced too
}









