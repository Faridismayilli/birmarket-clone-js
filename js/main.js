// Const

const phoneWrapper = document.querySelector(".phone__wrapper");
const cityList = document.querySelector(".city__list");
const selectedCity = document.querySelector(".city");
const locationBtn = document.querySelector(".location");
const cityModalWrapper = document.querySelector(".city__modal__wrapper");
const closeCityModalBtn = document.querySelector(".city__modal--close-btn");
const mainSection = document.querySelector(".main__showcase");
const subCategorySection = document.querySelector(".subcategory__section");
const subCategoryGridContainer = document.querySelector(
  ".subcategory__gridcontainer",
);
const subTitle = document.querySelector("h1");
const productCount = document.querySelector(".subproductcount");
const logo = document.querySelector(".logo");
const productslistSection = document.querySelector(".productslist__section");
const productListTitle = productslistSection.querySelector("h1");
const productListCount = productslistSection.querySelector(".productcount");
const productsGridContainer = document.querySelector(
  ".products__gridcontainer",
);

/* Phone modalini acmaq */

phoneWrapper.addEventListener("click", (e) => {
  e.stopPropagation();
  phoneWrapper.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".phone__wrapper")) {
    phoneWrapper.classList.remove("active");
  }

  if (e.target === cityModalWrapper) {
    cityModalWrapper.classList.remove("active");
  }
});

/* Change location modal */

const cities = [
  "Bakı",
  "Gəncə",
  "Sumqayıt",
  "Şəki",
  "Lənkəran",
  "Mingəçevir",
  "Şirvan",
  "Quba",
  "Qəbələ",
  "Ağsu",
  "Naxçıvan",
  "Biləsuvar",
  "Yevlax",
  "Salyan",
  "Bərdə",
  "Qazax",
  "Tovuz",
];

locationBtn.addEventListener("click", () => {
  cityModalWrapper.classList.add("active");
});

cities.forEach((city) => {
  const li = document.createElement("li");
  li.textContent = city;
  cityList.append(li);

  li.addEventListener("click", (e) => {
    document
      .querySelectorAll(".city__list li")
      .forEach((li) => li.classList.remove("selected"));

    selectedCity.textContent = li.textContent;
    li.classList.add("selected");
    cityModalWrapper.classList.remove("active");
  });
});

closeCityModalBtn.addEventListener("click", () => {
  cityModalWrapper.classList.remove("active");
});

/* ---- API ---- */

const state = {
  products: [],
  selectedMainCategory: null,
  selectedSubCategory: null,
  selectedProduct: null,
  liked: JSON.parse(localStorage.getItem("liked")) || [],
};

const fetchProducts = async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/mirafgan/PerfectJson/refs/heads/main/UmicoProducts.json",
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    state.products = data;
    renderMainCategories();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

fetchProducts();

const categoriesWrapper = document.querySelector(".categories__list");

function renderMainCategories() {
  categoriesWrapper.innerHTML = "";

  categoriesWrapper.innerHTML = state.products
    .map((item) => {
      return `
    <li>
      <a href="#" data-slug="${item.slugged_name}">
        ${item.category_name}
        <i class="fa-solid fa-angle-right"></i>
      </a>
    </li>
    `;
    })
    .join("");
}

function handleCategoryClick(e) {
  e.preventDefault();

  const link = e.target.closest("a");
  if (!link) return;

  if (link) {
    const slugName = link.dataset.slug;

    renderSubCategories(slugName);
  }
}

categoriesWrapper.addEventListener("click", handleCategoryClick);

function showMainSection() {
  mainSection.style.display = "block";
  subCategorySection.style.display = "none";
  productslistSection.style.display = "none";

  subTitle.textContent = "";
  productCount.textContent = "";

  updateURL("main");
}

logo.addEventListener("click", showMainSection);

const defaultSubcategoryImg = "./assets/images/default-product.png";

function renderSubCategories(slugName, pushState = true) {
  const category = state.products.find((element) => {
    return element.slugged_name === slugName;
  });

  if (!category) {
    return;
  }

  console.log(category);

  console.log(category.products);

  state.selectedMainCategory = category.products;

  const allCategoryNames = category.products.map((product) => {
    return product.category.category_name;
  });

  const uniqueCategoryNames = [...new Set(allCategoryNames)];

  subCategoryGridContainer.innerHTML = uniqueCategoryNames
    .map(
      (title) => `
                <div class="subcategory__card" data-category="${title}" tabindex="0">  
              <img
                src=${defaultSubcategoryImg}
                alt=${title}
              />
              <span>${title}</span>
            </div>
    `,
    )
    .join("");

  subTitle.textContent = category.category_name;
  productCount.textContent = `${category.products.length} məhsul`;

  mainSection.style.display = "none";
  subCategorySection.style.display = "block";
  productslistSection.style.display = "none";

  if (pushState) {
    updateURL("subcategory", slugName);
  }
}

function renderProducts(list, categoryName) {
  productsGridContainer.innerHTML = list
    .map((product) => {
      const isLiked = state.liked.includes(product.id);

      return `
                <article class="product__card" data-id="${product.id}">
              <div class="product__image">  
                <button class="wishlist-btn">
                  <i class="fa-sharp ${isLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>
                <a href="#">
                  <img
                    src="${product.img_url_standard}"
                    alt="${product.name}"
                  />
                </a>
              </div>

              <div class="product__info">
                <span class="product__price">${product.retail_price} ₼</span>
                <span class="product__title">${product.name}</span
                >
                <button class="add-to-cart">
                  <i class="fa-solid fa-cart-shopping"></i>Səbətə at
                </button>
              </div>
            </article>
    `;
    })
    .join("");

  productListTitle.textContent = categoryName;
  productListCount.textContent = `${list.length} məhsul`;

  subCategorySection.style.display = "none";
  productslistSection.style.display = "block";
}

function handleSubCategoryClick(e) {
  const card = e.target.closest(".subcategory__card");

  if (!card) {
    return;
  }

  const categoryName = card.dataset.category;

  const filteredProducts = state.selectedMainCategory.filter((product) => {
    return product.category.category_name === categoryName;
  });

  console.log(filteredProducts);
  renderProducts(filteredProducts, categoryName);
}

subCategoryGridContainer.addEventListener("click", handleSubCategoryClick);

function handleProductList(e) {
  e.preventDefault();

  const card = e.target.closest(".product__card");

  if (card) {
    const likeBtn = e.target.closest(".wishlist-btn");
    const cardId = Number(card.dataset.id);

    if (likeBtn) {
      const index = state.liked.indexOf(cardId);

      if (index === -1) {
        state.liked.push(cardId);
      } else {
        state.liked.splice(index, 1);
      }

      localStorage.setItem("liked", JSON.stringify(state.liked));

      const icon = likeBtn.querySelector("i");

      icon.classList.toggle("fa-solid");
      icon.classList.toggle("active");
    }
  }
}

productsGridContainer.addEventListener("click", handleProductList);

/* URL deyishmek */

function updateURL(page, slug = "") {
  if (page === "main") {
    history.pushState({ page: "main" }, "", "/");
  } else if (page === "subcategory") {
    history.pushState(
      { page: "subcategory", slug: slug },
      "",
      `?category=${slug}`,
    );
  }
}

window.addEventListener("popstate", (event) => {
  const stateObj = event.state;

  if (!stateObj || stateObj.page === "main") {
    showMainSection();
  } else if (stateObj.page === "subcategory") {
    renderSubCategories(stateObj.slug, false);
  }
});
