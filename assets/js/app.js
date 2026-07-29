/* =========================================================
   PATEPLUMA'S COFFEE — Lógica de la aplicación
   Carrito ligero + modal de producto. El pedido se envía
   directo por WhatsApp (no hay checkout con pago en línea).
   El carrito se persiste en localStorage (no hay backend real).
   ========================================================= */

const STORE_KEY = "pateplumas_cart";
const WHATSAPP_NUMBER = "50495619191";

// ---------------------------------------------------------
// Estado
// ---------------------------------------------------------
let cart = loadCart();
let activeProduct = null; // producto abierto en el modal
let modalState = { size: null, extras: [], qty: 1 };
let checkoutStep = "cart"; // cart | details | confirm

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveCart() {
  localStorage.setItem(STORE_KEY, JSON.stringify(cart));
  renderCartCount();
}

function formatMoney(n) {
  return "L " + n.toFixed(2);
}

function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// ---------------------------------------------------------
// Efecto de entrada al hacer scroll (imágenes y tarjetas)
// ---------------------------------------------------------
let revealObserver = null;
function observeReveals(root = document) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
  }
  root.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
}

// ---------------------------------------------------------
// Toast
// ---------------------------------------------------------
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

// ---------------------------------------------------------
// Header cart count
// ---------------------------------------------------------
function renderCartCount() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = totalQty;
    el.style.display = totalQty > 0 ? "flex" : "none";
  });
}

// ===========================================================
// PRODUCT MODAL
// ===========================================================
function openProductModal(id) {
  const p = getProductById(id);
  if (!p) return;
  activeProduct = p;
  modalState = {
    size: p.sizes && p.sizes.length ? p.sizes[Math.min(1, p.sizes.length - 1)].name : null,
    extras: [],
    qty: 1,
  };
  renderProductModal();
  document.getElementById("overlay").classList.add("show");
  document.getElementById("product-modal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  document.getElementById("product-modal").classList.remove("show");
  if (!document.getElementById("cart-drawer").classList.contains("show")) {
    document.getElementById("overlay").classList.remove("show");
    document.body.style.overflow = "";
  }
  activeProduct = null;
}

function computeModalUnitPrice() {
  if (!activeProduct) return 0;
  let total = activeProduct.price;
  if (activeProduct.sizes && activeProduct.sizes.length) {
    const s = activeProduct.sizes.find((s) => s.name === modalState.size);
    if (s) total += s.delta;
  }
  modalState.extras.forEach((exName) => {
    const ex = (activeProduct.extras || []).find((e) => e.name === exName);
    if (ex) total += ex.delta;
  });
  return total;
}

function renderProductModal() {
  const p = activeProduct;
  if (!p) return;
  const cat = CATEGORIES.find((c) => c.id === p.category);

  document.getElementById("modal-photo").src = p.img;
  document.getElementById("modal-photo").alt = p.name;
  document.getElementById("modal-cat").textContent = cat ? cat.name : "";
  document.getElementById("modal-name").textContent = p.name;
  document.getElementById("modal-desc").textContent = p.longDesc;

  // Sizes
  const sizeWrap = document.getElementById("modal-sizes");
  if (p.sizes && p.sizes.length) {
    sizeWrap.style.display = "";
    sizeWrap.querySelector(".option-pills").innerHTML = p.sizes
      .map(
        (s) => `
        <button type="button" class="option-pill ${s.name === modalState.size ? "selected" : ""}" data-size="${s.name}">
          ${s.name}${s.delta ? ` (${s.delta > 0 ? "+" : ""}${s.delta})` : ""}
        </button>`
      )
      .join("");
  } else {
    sizeWrap.style.display = "none";
  }

  // Extras
  const extraWrap = document.getElementById("modal-extras");
  if (p.extras && p.extras.length) {
    extraWrap.style.display = "";
    extraWrap.querySelector(".extras-list").innerHTML = p.extras
      .map(
        (e, idx) => `
        <div class="extra-row">
          <label>
            <input type="checkbox" data-extra="${e.name}" ${modalState.extras.includes(e.name) ? "checked" : ""} />
            ${e.name}
          </label>
          <span class="extra-delta">${e.delta ? (e.delta > 0 ? "+" : "") + e.delta : "Sin costo"}</span>
        </div>`
      )
      .join("");
  } else {
    extraWrap.style.display = "none";
  }

  document.getElementById("modal-qty").textContent = modalState.qty;
  updateModalTotal();
}

function updateModalTotal() {
  const unit = computeModalUnitPrice();
  const total = unit * modalState.qty;
  document.getElementById("modal-total").textContent = formatMoney(total);
}

function addActiveProductToCart() {
  if (!activeProduct) return;
  const unit = computeModalUnitPrice();
  const cartLineId = [
    activeProduct.id,
    modalState.size || "",
    modalState.extras.slice().sort().join("|"),
  ].join("::");

  const existing = cart.find((i) => i.lineId === cartLineId);
  if (existing) {
    existing.qty += modalState.qty;
  } else {
    cart.push({
      lineId: cartLineId,
      id: activeProduct.id,
      name: activeProduct.name,
      img: activeProduct.img,
      size: modalState.size,
      extras: modalState.extras.slice(),
      unitPrice: unit,
      qty: modalState.qty,
    });
  }
  saveCart();
  showToast(`${activeProduct.name} agregado al pedido`);
  closeProductModal();
  openCartDrawer();
}

// ===========================================================
// CART DRAWER
// ===========================================================
function openCartDrawer() {
  checkoutStep = "cart";
  renderDrawer();
  document.getElementById("overlay").classList.add("show");
  document.getElementById("cart-drawer").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  document.getElementById("cart-drawer").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
  document.body.style.overflow = "";
}

function cartSubtotal() {
  return cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
}

function changeCartQty(lineId, delta) {
  const item = cart.find((i) => i.lineId === lineId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.lineId !== lineId);
  }
  saveCart();
  renderDrawer();
}

function optsLabel(item) {
  const parts = [];
  if (item.size) parts.push(item.size);
  if (item.extras && item.extras.length) parts.push(item.extras.join(", "));
  return parts.join(" · ");
}

function renderDrawer() {
  document.querySelectorAll(".checkout-step").forEach((s) => s.classList.remove("active"));
  const stepEl = document.getElementById("step-" + checkoutStep);
  if (stepEl) stepEl.classList.add("active");

  if (checkoutStep === "cart") {
    const body = document.getElementById("drawer-cart-body");
    if (cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="icon">🛍️</div>
          <p>Aún no has agregado nada.<br/>Explora el menú y arma tu pedido.</p>
        </div>`;
    } else {
      body.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" />
          <div class="cart-item-info">
            <div class="ci-name">${item.name}</div>
            <div class="ci-opts">${optsLabel(item)}</div>
            <div class="cart-item-controls">
              <div class="mini-qty">
                <button type="button" onclick="changeCartQty('${item.lineId}', -1)">−</button>
                <span>${item.qty}</span>
                <button type="button" onclick="changeCartQty('${item.lineId}', 1)">+</button>
              </div>
              <span class="cart-item-price">${formatMoney(item.unitPrice * item.qty)}</span>
            </div>
          </div>
        </div>`
        )
        .join("");
    }

    const sub = cartSubtotal();
    document.getElementById("drawer-subtotal").textContent = formatMoney(sub);
    document.getElementById("cart-checkout-btn").disabled = cart.length === 0;
  }

  if (checkoutStep === "details") {
    document.getElementById("details-subtotal").textContent = formatMoney(cartSubtotal());
  }

  renderCartCount();
}

// ---------------------------------------------------------
// Pasos del pedido
// ---------------------------------------------------------
function goToStep(step) {
  checkoutStep = step;
  renderDrawer();
}

function startCheckout() {
  if (cart.length === 0) return;
  goToStep("details");
}

function submitOrderDetails(e) {
  e.preventDefault();
  const name = document.getElementById("field-name").value.trim();
  const time = document.getElementById("field-time").value;
  const payment = document.getElementById("field-payment").value;
  const notes = document.getElementById("field-notes").value.trim();

  if (!name || !time) return;

  const pickupLabels = {
    asap: "Lo antes posible (20-25 min)",
    "30": "En 30 minutos",
    "60": "En 1 hora",
    "120": "En 2 horas",
  };

  const order = {
    id: "PP-" + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toISOString(),
    customer: { name },
    pickupTime: time,
    pickupLabel: pickupLabels[time] || time,
    payment,
    notes,
    items: cart.map((i) => ({
      name: i.name,
      opts: optsLabel(i),
      qty: i.qty,
      unitPrice: i.unitPrice,
    })),
    subtotal: cartSubtotal(),
  };

  const waText =
    `¡Hola Pateplumas Coffee! 👋 Quiero hacer este pedido *${order.id}*\n` +
    order.items.map((i) => `• ${i.qty} x ${i.name}${i.opts ? " (" + i.opts + ")" : ""}`).join("\n") +
    `\nTotal: ${formatMoney(order.subtotal)}` +
    `\nRecoger: ${order.pickupLabel}` +
    `\nPago en tienda: ${order.payment}` +
    `\nNombre: ${order.customer.name}` +
    (order.notes ? `\nNotas: ${order.notes}` : "");

  const link = waLink(waText);

  renderConfirmation(order, link);
  cart = [];
  saveCart();
  goToStep("confirm");

  // Abrir WhatsApp directamente (gesto del usuario: envío del formulario)
  window.open(link, "_blank", "noopener");
}

function renderConfirmation(order, link) {
  document.getElementById("confirm-order-no").textContent = order.id;
  document.getElementById("confirm-pickup").textContent = order.pickupLabel;

  const rows = order.items
    .map(
      (i) => `
      <div class="r-row">
        <span>${i.qty} × ${i.name}${i.opts ? " (" + i.opts + ")" : ""}</span>
        <span>${formatMoney(i.unitPrice * i.qty)}</span>
      </div>`
    )
    .join("");
  document.getElementById("confirm-receipt").innerHTML =
    rows + `<div class="r-row total"><span>Total</span><span>${formatMoney(order.subtotal)}</span></div>`;

  document.getElementById("whatsapp-link").href = link;
}

function finishCheckout() {
  closeCartDrawer();
  checkoutStep = "cart";
}

// ===========================================================
// EVENTOS GLOBALES
// ===========================================================
document.addEventListener("DOMContentLoaded", () => {
  renderCartCount();
  observeReveals();

  // Botón flotante de WhatsApp (saludo genérico)
  document.querySelectorAll(".whatsapp-float").forEach((el) => {
    el.href = waLink("¡Hola Pateplumas Coffee! 👋 Quiero hacer un pedido.");
  });

  document.querySelectorAll("[data-open-cart]").forEach((el) =>
    el.addEventListener("click", openCartDrawer)
  );
  document.querySelectorAll("[data-close-cart]").forEach((el) =>
    el.addEventListener("click", closeCartDrawer)
  );

  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.addEventListener("click", () => {
      closeCartDrawer();
      closeProductModal();
    });
  }

  const modalCloseBtn = document.getElementById("modal-close-btn");
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProductModal);

  // Delegación: tarjetas de producto (grid principal)
  document.querySelectorAll("[data-product-id]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".add-btn");
      const id = el.getAttribute("data-product-id");
      if (addBtn) {
        e.stopPropagation();
        quickAdd(id);
      } else {
        openProductModal(id);
      }
    });
  });

  // Modal: tallas
  const sizeContainer = document.getElementById("modal-sizes");
  if (sizeContainer) {
    sizeContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".option-pill");
      if (!btn) return;
      modalState.size = btn.getAttribute("data-size");
      renderProductModal();
    });
  }

  // Modal: extras
  const extraContainer = document.getElementById("modal-extras");
  if (extraContainer) {
    extraContainer.addEventListener("change", (e) => {
      const cb = e.target.closest("input[data-extra]");
      if (!cb) return;
      const name = cb.getAttribute("data-extra");
      if (cb.checked) modalState.extras.push(name);
      else modalState.extras = modalState.extras.filter((n) => n !== name);
      updateModalTotal();
    });
  }

  const qtyMinus = document.getElementById("modal-qty-minus");
  const qtyPlus = document.getElementById("modal-qty-plus");
  if (qtyMinus)
    qtyMinus.addEventListener("click", () => {
      modalState.qty = Math.max(1, modalState.qty - 1);
      document.getElementById("modal-qty").textContent = modalState.qty;
      updateModalTotal();
    });
  if (qtyPlus)
    qtyPlus.addEventListener("click", () => {
      modalState.qty += 1;
      document.getElementById("modal-qty").textContent = modalState.qty;
      updateModalTotal();
    });

  const addToCartBtn = document.getElementById("modal-add-btn");
  if (addToCartBtn) addToCartBtn.addEventListener("click", addActiveProductToCart);

  // Navegación del pedido
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", startCheckout);

  document.querySelectorAll("[data-back-to]").forEach((el) =>
    el.addEventListener("click", () => goToStep(el.getAttribute("data-back-to")))
  );

  const detailsForm = document.getElementById("details-form");
  if (detailsForm) detailsForm.addEventListener("submit", submitOrderDetails);

  const newOrderBtn = document.getElementById("new-order-btn");
  if (newOrderBtn) newOrderBtn.addEventListener("click", finishCheckout);

  // Filtros de categoría en menu.html
  document.querySelectorAll(".filter-pill[data-filter]").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      filterMenu(pill.getAttribute("data-filter"));
    });
  });

  // Nav toggle (móvil)
  const navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      document.querySelector(".main-nav").classList.toggle("show-mobile");
    });
  }

  // Si venimos con ?cat= en la URL, aplicar filtro inicial
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  if (cat) {
    const target = document.querySelector(`.filter-pill[data-filter="${cat}"]`);
    if (target) target.click();
  }
});

function quickAdd(id) {
  const p = getProductById(id);
  if (!p) return;
  const size = p.sizes && p.sizes.length ? p.sizes[Math.min(1, p.sizes.length - 1)].name : null;
  const unit = p.price + (size ? p.sizes.find((s) => s.name === size).delta : 0);
  const lineId = [id, size || "", ""].join("::");
  const existing = cart.find((i) => i.lineId === lineId);
  if (existing) existing.qty += 1;
  else
    cart.push({
      lineId,
      id: p.id,
      name: p.name,
      img: p.img,
      size,
      extras: [],
      unitPrice: unit,
      qty: 1,
    });
  saveCart();
  showToast(`${p.name} agregado al pedido`);
}

function filterMenu(catId) {
  document.querySelectorAll(".menu-category-block").forEach((block) => {
    const show = catId === "todos" || block.getAttribute("data-category") === catId;
    block.style.display = show ? "" : "none";
  });
}
