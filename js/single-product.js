
fetch("json/products.json")
  .then(res => res.json())
  .then(products => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));
    const product = products.find(p => p.id === productId);

    if (!product) {
      document.querySelector(".single-product-area").innerHTML =
        "<p>Product not found.</p>";
      return;
    }

    // Fill in product info
    document.querySelector(".product-details-view-content h2").textContent = product.name;
    document.querySelector(".new-price").textContent = product.price;
    document.querySelector(".product-desc span").textContent = product.description;

    // Build images + thumbs dynamically
    let imagesHtml = "";
    let thumbsHtml = "";

    product.images.forEach((img, i) => {
      imagesHtml += `
        <div class="lg-image">
          <a class="popup-img venobox vbox-item" href="${img}" data-gall="myGallery">
            <img src="${img}" alt="product image">
          </a>
        </div>
      `;

      thumbsHtml += `
        <div class="sm-image">
          <img src="${img}" alt="product thumb ${i + 1}">
        </div>
      `;
    });

    document.querySelector(".product-details-images").innerHTML = imagesHtml;
    document.querySelector(".product-details-thumbs").innerHTML = thumbsHtml;

    // Reinitialize Venobox and sliders after DOM update
    if (window.VenoBox) {
      new VenoBox({ selector: ".venobox" });
    }
    if ($ && $.fn.slick) {
      $(".slider-navigation-1").slick("unslick").slick();
      $(".slider-thumbs-1").slick("unslick").slick();

    }
   // Large image slider
$(".slider-navigation-1").slick({
  // slidesToShow: 1,
  // slidesToScroll: 1,
  arrows: true,
  prevArrow: '<button class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
  nextArrow: '<button class="slick-next"><i class="fa fa-chevron-right"></i></button>',
  asNavFor: ".slider-thumbs-1"
});

// Thumbnail slider
$(".slider-thumbs-1").slick({
  // slidesToShow: 4,
  // slidesToScroll: 4,
  asNavFor: ".slider-navigation-1",
  focusOnSelect: true,
  arrows: true,
  centerMode: true,
  prevArrow: '<button class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
  nextArrow: '<button class="slick-next"><i class="fa fa-chevron-right"></i></button>'
});

  


  })
  .catch(err => console.error("Error loading product:", err));

