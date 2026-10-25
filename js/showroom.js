(function () {
    "use strict";

    const oldViewer = document.getElementById("model-photo-viewer");
    if (oldViewer) oldViewer.remove();

    const viewer = document.createElement("div");
    viewer.id = "model-photo-viewer";
    viewer.className = "model-photo-viewer";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "Photo gallery");
    viewer.innerHTML = `
      <div class="model-photo-dialog">
        <button class="model-photo-close" type="button" aria-label="Close gallery">Ã—</button>
        <h2 class="model-photo-title">Photo gallery</h2>
        <div class="model-photo-stage">
          <button class="model-photo-nav model-photo-prev" type="button" aria-label="Previous photo">â€¹</button>
          <img class="model-photo-large" alt="Utsav Shrangar model photo">
          <button class="model-photo-nav model-photo-next" type="button" aria-label="Next photo">â€º</button>
        </div>
        <div class="model-photo-thumbnails" aria-label="More photos"></div>
      </div>`;
    document.body.appendChild(viewer);

    const largeImage = viewer.querySelector(".model-photo-large");
    const titleNode = viewer.querySelector(".model-photo-title");
    const thumbs = viewer.querySelector(".model-photo-thumbnails");
    let photos = [];
    let activeIndex = 0;
    let openToken = 0;

    const photoSets = [
      { re: /saree/i, files: ["assets/images/gallery/saree-worn.jpg", "assets/images/fashion/saree-traditional.jpg", "assets/images/fashion/saree-demo.jpg"] },
      { re: /suit|kurti|salwar|chudi/i, files: ["assets/images/gallery/kurti-worn.jpg", "assets/images/fashion/kurti-style.jpg", "assets/images/gallery/saree-worn.jpg"] },
      { re: /kid|child/i, files: ["assets/images/gallery/kids-worn.jpg", "assets/images/fashion/kids-fashion.jpg"] },
      { re: /men|shirt|jean|pant|trouser|t-shirt|tshirt|top|clothing/i, files: ["assets/images/gallery/mens-worn.jpg", "assets/images/fashion/mens-fashion.jpg", "assets/images/fashion/mens-shirt.jpg", "assets/images/fashion/mens-trousers.jpg", "assets/images/fashion/tshirt-style.jpg"] },
      { re: /earring|jhumka|necklace|bangle|jewell?ery|accessor/i, files: ["assets/images/gallery/jewellery-on-model.jpg", "assets/images/gallery/jewellery-detail.jpg", "assets/images/jewellery/jhumka-earrings.jpg", "assets/images/jewellery/jewellery-set.jpg", "assets/images/jewellery/gold-bangles.jpg"] },
      { re: /nail|polish/i, files: ["assets/images/gallery/nails-on-hand.jpg", "assets/images/beauty/nail-polish.jpg"] },
      { re: /skin|cream/i, files: ["assets/images/gallery/skincare-detail.jpg", "assets/images/beauty/skincare-products.jpg"] },
      { re: /makeup|lipstick|cosmetic/i, files: ["assets/images/gallery/makeup-detail.jpg", "assets/images/beauty/makeup-products.jpg"] },
      { re: /oil|hair/i, files: ["assets/images/gallery/oils-detail.jpg", "assets/images/beauty/beauty-oils.jpg"] }
    ];

    function render() {
      if (!photos.length) return;
      if (activeIndex < 0) activeIndex = photos.length - 1;
      if (activeIndex >= photos.length) activeIndex = 0;
      largeImage.src = photos[activeIndex].src;
      largeImage.alt = photos[activeIndex].alt || titleNode.textContent;
      thumbs.innerHTML = "";
      photos.forEach((photo, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "model-photo-thumb" + (index === activeIndex ? " is-active" : "");
        button.setAttribute("aria-label", "Show photo " + (index + 1));
        const image = document.createElement("img");
        image.src = photo.src;
        image.alt = "";
        button.appendChild(image);
        button.addEventListener("click", () => { activeIndex = index; render(); });
        thumbs.appendChild(button);
      });
    }

    function openGallery(image, card) {
      openToken += 1;
      const thisToken = openToken;
      const name = card.querySelector("h3, h2, .product-title, .product-name");
      titleNode.textContent = name ? name.textContent.trim() : "Utsav Shrangar Photo Gallery";
      const caption = titleNode.textContent || "Utsav Shrangar Photo Gallery";
      const primary = image.currentSrc || image.src;
      photos = [{ src: primary, alt: caption }];
      activeIndex = 0;
      render();
      viewer.classList.add("is-open");
      document.body.style.overflow = "hidden";

      const set = photoSets.find(item => item.re.test(caption + " " + image.src));
      if (!set) return;
      const seen = new Set([primary]);
      set.files.forEach(path => {
        const url = new URL(path, document.baseURI).href;
        if (seen.has(url) || url === primary) return;
        seen.add(url);
        const probe = new Image();
        probe.onload = function () {
          if (thisToken !== openToken || photos.some(item => item.src === url)) return;
          photos.push({ src: url, alt: caption });
          if (viewer.classList.contains("is-open")) render();
        };
        probe.onerror = function () {};
        probe.src = url;
      });
    }

    function closeGallery() {
      openToken += 1;
      viewer.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    document.addEventListener("click", function (event) {
      const imageBox = event.target.closest(".product-card .product-image");
      if (!imageBox) return;
      const image = imageBox.querySelector("img");
      const card = imageBox.closest(".product-card");
      if (!image || !card) return;
      event.preventDefault();
      openGallery(image, card);
    });

    viewer.querySelector(".model-photo-close").addEventListener("click", closeGallery);
    viewer.addEventListener("click", event => { if (event.target === viewer) closeGallery(); });
    viewer.querySelector(".model-photo-prev").addEventListener("click", () => { activeIndex--; render(); });
    viewer.querySelector(".model-photo-next").addEventListener("click", () => { activeIndex++; render(); });
    document.addEventListener("keydown", event => {
      if (!viewer.classList.contains("is-open")) return;
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") { activeIndex--; render(); }
      if (event.key === "ArrowRight") { activeIndex++; render(); }
    });
})();
