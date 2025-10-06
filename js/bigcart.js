
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    let tbody = document.querySelector(".table tbody");
    let subtotalElement = document.querySelector(".cart-page-total ul li:first-child span");
    let totalElement = document.querySelector(".cart-page-total ul li:last-child span");

    tbody.innerHTML = ""; // clear table rows
    let subtotal = 0;

    if (cart.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Your cart is empty</td></tr>`;
      subtotalElement.textContent = "₦0.00";
      totalElement.textContent = "₦0.00";
      return;
    }

    cart.forEach((item, index) => {
      let priceNumber = parseFloat(item.price.replace(/[₦,]/g, ""));
      let itemTotal = priceNumber * item.quantity;
      subtotal += itemTotal;

      let row = document.createElement("tr");
      row.innerHTML = `
        <td class="li-product-remove">
          <a href="#" onclick="removeItem(${index}); return false;">
            <i class="fa fa-times"></i>
          </a>
        </td>
        <td class="li-product-thumbnail">
          <a href="#"><img src="${item.image}" alt="${item.name}" width="60"></a>
        </td>
        <td class="li-product-name"><a href="#">${item.name}</a></td>
        <td class="li-product-price"><span class="amount">${item.price}</span></td>
        <td class="quantity">
          <label>Quantity</label>
          <div class="cart-plus-minus">
            <input class="cart-plus-minus-box" value="${item.quantity}" type="number" min="1" onchange="updateQuantity(${index}, this.value)">
          </div>
        </td>
        <td class="product-subtotal"><span class="amount">₦${itemTotal.toLocaleString()}</span></td>
      `;
      tbody.appendChild(row);
    });

    subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
    totalElement.textContent = `₦${subtotal.toLocaleString()}`;

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
  }

  function updateQuantity(index, newQty) {
    let qty = parseInt(newQty);
    if (qty > 0) {
      cart[index].quantity = qty;
    } else {
      cart[index].quantity = 1;
    }
    renderCart();
  }

  // Initial render when page loads
  window.onload = renderCart;

