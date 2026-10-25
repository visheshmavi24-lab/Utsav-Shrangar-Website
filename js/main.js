"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const config = window.shopConfig || {};
  const categories = window.productCategories || [];
  const demoProducts = window.products || [];
  let products = demoProducts;

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Load published products from the local API.
  try {
    const response = await fetch("/api/public/products");

    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        products = data.map((item) => {
          const amount = item.sale_price_paise ?? item.price_paise;
          const imagePath = item.image_path ? String(item.image_path).replace(/\\/g, "/") : "";

          return {
            id: item.id,
            category: item.category,
            name: item.name,
            description: item.description || "",
            price: amount != null ? `₹${(amount / 100).toFixed(2)}` : "",
            image: imagePath
              ? (imagePath.startsWith("http")
                  ? imagePath
                  : imagePath.startsWith("/uploads/")
                    ? imagePath
                    : `/uploads/${imagePath.replace(/^\/+/, "")}`)
              : "",
            imageAlt: item.name || "Shop product",
            demo: false
          };
        });
      }
    }
  } catch (error) {
    console.warn("Public API unavailable; using demo products.", error);
  }

  const pageSection =
    document.body.dataset.pageSection ||
    (currentPage === "fashion.html"
      ? "fashion"
      : currentPage === "beauty.html"
        ? "beauty"
        : "");

  const pageCategories = categories.filter(
    (category) => !pageSection || category.section === pageSection
  );

  const pageProducts = products.filter((product) => {
    const category = categories.find((item) => item.id === product.category);
    return !pageSection || (category && category.section === pageSection);
  });

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[data-shop-name]").forEach((element) => {
    element.textContent = config.name || "Utsav Shrangar & Garments";
  });

  document.querySelectorAll("[data-shop-logo]").forEach((image) => {
    image.src = "assets/images/clean/utsav-logo-clean.jpg";
    image.alt = "Utsav Shrangar & Garments logo";
  });

  function createWhatsAppLink(message) {
    const number = String(config.whatsappNumber || "").replace(/\D/g, "");
    return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
  }

  document.querySelectorAll("[data-whatsapp]").forEach((button) => {
    const message =
      button.dataset.message ||
      `Hello, I would like to enquire about ${config.name || "your shop"}.`;

    const link = createWhatsAppLink(message);

    if (link) {
      button.href = link;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.removeAttribute("aria-disabled");
    } else {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        alert("WhatsApp enquiries are not configured yet. Add the shop's verified WhatsApp number first.");
      });
    }
  });

  const filterContainer = document.querySelector("[data-category-filters]");
  const productContainer = document.querySelector("[data-product-grid]");
  const searchInput = document.querySelector("[data-product-search]");

  let activeCategory = "all";
  let searchTerm = "";

  function getCategoryName(categoryId) {
    const category = categories.find((item) => item.id === categoryId);
    return category ? category.name : "Shop item";
  }

  function renderFilters() {
    if (!filterContainer) return;

    filterContainer.replaceChildren();

    const availableCategories = pageCategories.filter((category) =>
      pageProducts.some((product) => product.category === category.id)
    );

    const filterItems = [
      { id: "all", name: "All categories" },
      ...availableCategories.map((category) => ({
        id: category.id,
        name: category.name
      }))
    ];

    filterItems.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-button";
      button.textContent = category.name;
      button.dataset.category = category.id;
      button.setAttribute("aria-pressed", String(activeCategory === category.id));

      if (activeCategory === category.id) button.classList.add("active");

      button.addEventListener("click", () => {
        activeCategory = category.id;
        renderFilters();
        renderProducts();
      });

      filterContainer.appendChild(button);
    });
  }

  function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";

    const imageArea = document.createElement("div");
    imageArea.className = "product-image";

    if (product.image) {
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.imageAlt || product.name || "Shop item";
      image.loading = "lazy";

      image.addEventListener("error", () => {
        image.remove();
        imageArea.textContent = "Image unavailable";
        imageArea.setAttribute("role", "img");
        imageArea.setAttribute("aria-label", `${product.name || "Product"} image unavailable`);
      }, { once: true });

      imageArea.appendChild(image);
    } else {
      imageArea.textContent = "Image coming soon";
      imageArea.setAttribute("aria-label", "Product image not provided");
    }

    const info = document.createElement("div");
    info.className = "product-info";

    const label = document.createElement("span");
    label.className = "product-label";
    label.textContent = product.demo
      ? "Illustrative demo — not verified stock"
      : getCategoryName(product.category);

    const title = document.createElement("h3");
    title.textContent = product.name || "Shop item";

    const description = document.createElement("p");
    description.textContent =
      product.description || "Contact the shop to ask about this item.";

    info.append(label, title, description);

    if (product.price !== undefined && product.price !== null && product.price !== "") {
      const price = document.createElement("p");
      price.textContent = `Price: ${product.price}`;
      info.appendChild(price);
    }

    const enquiry = document.createElement("button");
    enquiry.type = "button";
    enquiry.className = "button";
    enquiry.textContent = "Enquire";

    enquiry.addEventListener("click", () => {
      const message =
        `Hello, I would like to enquire about ${product.name || "an item"} at ${config.name || "your shop"}.`;

      const link = createWhatsAppLink(message);

      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        alert("WhatsApp enquiries are not configured yet. Add the shop's verified WhatsApp number before using this feature.");
      }
    });

    info.appendChild(enquiry);
    article.append(imageArea, info);
    return article;
  }

  function renderProducts() {
    if (!productContainer) return;

    productContainer.replaceChildren();

    const filteredProducts = pageProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      const searchableText = [
        product.name,
        product.description,
        getCategoryName(product.category)
      ].join(" ").toLowerCase();

      return matchesCategory && searchableText.includes(searchTerm);
    });

    if (filteredProducts.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = products.some((product) => !product.demo)
        ? "No published products match this category or search."
        : "No matching demo items found. Try another category or search term.";
      productContainer.appendChild(empty);
      return;
    }

    filteredProducts.forEach((product) => {
      productContainer.appendChild(createProductCard(product));
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value.trim().toLowerCase();
      renderProducts();
    });
  }

  renderFilters();
  renderProducts();

  // Contact form handler: prepare a WhatsApp enquiry without claiming it was sent.
  const contactForm = document.querySelector("[data-contact-form]");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const topic = String(formData.get("topic") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const status = contactForm.querySelector("[data-form-status]");

      function showStatus(text) {
        if (status) {
          status.textContent = text;
          status.setAttribute("role", "status");
          status.setAttribute("aria-live", "polite");
        } else {
          alert(text);
        }
      }

      if (!name || !message) {
        showStatus("Please enter your name and message.");
        return;
      }

      const number = String(config.whatsappNumber || "").replace(/\D/g, "");

      if (!number) {
        showStatus("Your enquiry has NOT been sent. The shop's verified WhatsApp number has not been configured yet.");
        return;
      }

      const whatsappMessage =
        `Hello, I am ${name}.` +
        (email ? `\nMy email: ${email}` : "") +
        (topic ? `\nEnquiry about: ${topic}` : "") +
        `\n\n${message}`;

      const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}`;
      const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      if (whatsappWindow) {
        showStatus("WhatsApp has been opened with your enquiry prepared. Review the message and press Send in WhatsApp. Your enquiry is not sent until you send it there.");
      } else {
        showStatus("Your enquiry has not been sent. Your browser may have blocked the WhatsApp window. Allow pop-ups for this website and try again.");
      }
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
});
