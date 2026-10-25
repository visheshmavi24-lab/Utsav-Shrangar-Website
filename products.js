"use strict";

const shopConfig = {
  name: "Utsav Shrangar & Garments",
  instagram: "https://www.instagram.com/utsav_garments_showroom_?obrf=aG05bnl0bGF2dnhw",
  whatsappNumber: ""
};

const productCategories = [
  { id: "sarees", name: "Sarees", section: "fashion", verified: false },
  { id: "suits", name: "Suits & Salwar Suits", section: "fashion", verified: false },
  { id: "kurtis", name: "Kurtis", section: "fashion", verified: false },
  { id: "shirts", name: "Shirts", section: "fashion", verified: false },
  { id: "pants", name: "Pants & Trousers", section: "fashion", verified: false },
  { id: "tshirts", name: "T-Shirts", section: "fashion", verified: false },
  { id: "mens-wear", name: "Men's Wear", section: "fashion", verified: false },
  { id: "kids-wear", name: "Kids' Wear", section: "fashion", verified: false },
  { id: "chudi", name: "Chudi & Bangles", section: "beauty", verified: false },
  { id: "earrings", name: "Earrings & Jhumkas", section: "beauty", verified: false },
  { id: "jewellery", name: "Jewellery & Accessories", section: "beauty", verified: false },
  { id: "creams", name: "Creams", section: "beauty", verified: false },
  { id: "oils", name: "Hair & Beauty Oils", section: "beauty", verified: false },
  { id: "skincare", name: "Skincare", section: "beauty", verified: false },
  { id: "makeup", name: "Makeup & Lipsticks", section: "beauty", verified: false },
  { id: "nail-polish", name: "Nail Polish", section: "beauty", verified: false }
];

const localImage = (folder, filename) =>
  `assets/images/${folder}/${filename}`;

const demoDescription =
  "Illustrative photo for the website. Please contact the shop to confirm actual designs and availability.";

const demoItems = [
  { category: "sarees", name: "Traditional Saree Style", image: localImage("fashion", "saree-traditional.jpg"), imageAlt: "Illustrative traditional saree" },
  { category: "sarees", name: "Elegant Saree Collection", image: localImage("fashion", "saree-demo.jpg"), imageAlt: "Illustrative elegant saree" },
  { category: "kurtis", name: "Kurti Style", image: localImage("fashion", "kurti-style.jpg"), imageAlt: "Illustrative kurti fashion" },
  { category: "shirts", name: "Casual Shirt Style", image: localImage("fashion", "mens-shirt.jpg"), imageAlt: "Illustrative casual shirt" },
  { category: "pants", name: "Trouser Style", image: localImage("fashion", "mens-trousers.jpg"), imageAlt: "Illustrative trousers" },
  { category: "tshirts", name: "T-Shirt Style", image: localImage("fashion", "tshirt-style.jpg"), imageAlt: "Illustrative T-shirt" },
  { category: "mens-wear", name: "Men's Fashion", image: localImage("fashion", "mens-fashion.jpg"), imageAlt: "Illustrative men's fashion" },
  { category: "kids-wear", name: "Kids' Fashion", image: localImage("fashion", "kids-fashion.jpg"), imageAlt: "Illustrative kids' clothing" },
  { category: "chudi", name: "Bangles & Chudi Style", image: localImage("jewellery", "gold-bangles.jpg"), imageAlt: "Illustrative bangles" },
  { category: "earrings", name: "Jhumka Earring Style", image: localImage("jewellery", "jhumka-earrings.jpg"), imageAlt: "Illustrative earrings" },
  { category: "jewellery", name: "Jewellery Set", image: localImage("jewellery", "jewellery-set.jpg"), imageAlt: "Illustrative jewellery set" },
  { category: "creams", name: "Beauty Cream Display", image: localImage("beauty", "skincare-products.jpg"), imageAlt: "Illustrative skincare products" },
  { category: "oils", name: "Beauty Oil Display", image: localImage("beauty", "beauty-oils.jpg"), imageAlt: "Illustrative beauty oils" },
  { category: "skincare", name: "Skincare Collection", image: localImage("beauty", "skincare-products.jpg"), imageAlt: "Illustrative skincare collection" },
  { category: "makeup", name: "Makeup Collection", image: localImage("beauty", "makeup-products.jpg"), imageAlt: "Illustrative makeup products" },
  { category: "nail-polish", name: "Nail Polish Colours", image: localImage("beauty", "nail-polish.jpg"), imageAlt: "Illustrative nail polish products" }
];

const products = demoItems.map((item, index) => ({
  id: `demo-${item.category}-${index + 1}`,
  category: item.category,
  name: item.name,
  description: demoDescription,
  image: item.image,
  imageAlt: item.imageAlt,
  demo: true
}));

if (typeof window !== "undefined") {
  window.shopConfig = shopConfig;
  window.productCategories = productCategories;
  window.products = products;
}
