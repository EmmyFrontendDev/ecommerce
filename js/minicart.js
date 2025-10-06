

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateHeaderCartTrigger() {
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
      let priceNumber = parseFloat(item.price.replace(/[₦,]/g, ""));
      subtotal += priceNumber * item.quantity;
      totalItems += item.quantity;
    });

    const trigger = document.querySelector(".hm-minicart-trigger .item-text");
    if (trigger) {
      trigger.innerHTML = `₦${subtotal.toLocaleString()}
        <span class="cart-item-count">${totalItems}</span>`;
    }
  }

  // test function to add item
  function addTestProduct() {
    cart.push({ name: "Test Item", price: "₦200000", image: "test.jpg", quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateHeaderCartTrigger();
  }

  window.addEventListener("load", updateHeaderCartTrigger);

