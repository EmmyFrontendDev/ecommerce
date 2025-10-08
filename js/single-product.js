
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





  // -------------------------------
// ✅ Load Single Product and Related Products
// -------------------------------

// 1️⃣ Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id")); // or string if your ids are strings

// 2️⃣ Fetch products.json
fetch("json/products.json")
  .then(res => res.json())
  .then(products => {
    // 3️⃣ Find the current product
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.error("Product not found for ID:", productId);
      return;
    }

    console.log("Current product:", product);

    // 4️⃣ Load Related Products (same category)
    const relatedProducts = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 15);

    console.log("Related products:", relatedProducts);

    // 5️⃣ Render related products into carousel
    const relatedCarousel = document.querySelector("#related-products-carousel");

    if (relatedCarousel) {
      if (relatedProducts.length === 0) {
        relatedCarousel.innerHTML = "<p>No other products in this category.</p>";
      } else {
        relatedCarousel.innerHTML = relatedProducts
          .map(p => `
            <div class="col-lg-12">
              <div class="single-product-wrap">
                <div class="product-image">
                  <a href="single-product.html?id=${p.id}">
                    <img src="${p.images[0]}" alt="${p.name}">
                  </a>
                  <span class="sticker">New</span>
                </div>
                <div class="product_desc">
                  <div class="product_desc_info">
                    <h4><a class="product_name" href="single-product.html?id=${p.id}">${p.name}</a></h4>
                    <div class="price-box">
                      <span class="new-price">${p.price}</span>
                    </div>
                  </div>
                  <div class="add-actions">
                    <ul class="add-actions-link">
                      <li class="add-cart active"><a href="#">Add to cart</a></li>
                      <li>
                        <a href="#" title="quick view" class="quick-view-btn" 
                           data-toggle="modal" data-target="#exampleModalCenter"
                           data-name="${p.name}" 
                           data-price="${p.price}"
                           data-images='${JSON.stringify(p.images)}'>
                          <i class="fa fa-eye"></i>
                        </a>
                      </li>
                      <li><a class="links-details" href="wishlist.html"><i class="fa fa-heart-o"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          `)
          .join("");

        // ✅ Reinitialize Owl Carousel
        if ($ && $.fn.owlCarousel) {
          $(relatedCarousel).owlCarousel("destroy"); // remove old one if any
          $(relatedCarousel).owlCarousel({
            loop: true,
            nav: true,
            dots: false,
            autoplay: true,
            smartSpeed: 1000,
            margin: 30,
            responsive: {
              0: { items: 1 },
              480: { items: 2 },
              768: { items: 3 },
              992: { items: 4 },
              1200: { items: 5 }
            }
          });
        }
      }
    }
  })
  .catch(err => console.error("Error loading products:", err));

