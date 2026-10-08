/* ===== Settings you can change ===== */
const CONFIG = {
  currency: "₹",
  taxRate: 0.05,            // 5% GST
  deliveryFee: 40,          // flat delivery fee
  freeDeliveryAbove: 500,   // free delivery above this subtotal
  // Optional: your WhatsApp number with country code, digits only (e.g. "919876543210").
  // If set, a "Send order on WhatsApp" button appears after checkout.
  whatsappNumber: ""
};

/* ===== Menu data: edit freely ===== */
const MENU = [
  { id: 1,  cat: "Biryani", name: "Chicken Dum Biryani", veg: false, price: 249, emoji: "🍗", desc: "Basmati rice slow-cooked with marinated chicken and whole spices." },
  { id: 2,  cat: "Biryani", name: "Mutton Biryani",      veg: false, price: 349, emoji: "🍖", desc: "Tender mutton layered with fragrant rice and saffron." },
  { id: 3,  cat: "Biryani", name: "Veg Biryani",         veg: true,  price: 189, emoji: "🥕", desc: "Seasonal vegetables and paneer in aromatic dum-style rice." },
  { id: 4,  cat: "Biryani", name: "Egg Biryani",         veg: false, price: 169, emoji: "🥚", desc: "Boiled eggs tossed in spicy masala over golden rice." },

  { id: 5,  cat: "Curries", name: "Butter Chicken",      veg: false, price: 289, emoji: "🍛", desc: "Creamy tomato gravy with charred tandoori chicken." },
  { id: 6,  cat: "Curries", name: "Gongura Chicken",     veg: false, price: 279, emoji: "🌿", desc: "A tangy, fiery Andhra-style curry made with sorrel leaves." },
  { id: 7,  cat: "Curries", name: "Paneer Butter Masala",veg: true,  price: 239, emoji: "🧀", desc: "Soft paneer cubes in a rich, mildly sweet tomato gravy." },
  { id: 8,  cat: "Curries", name: "Dal Tadka",           veg: true,  price: 149, emoji: "🥣", desc: "Yellow lentils tempered with garlic, cumin and red chilli." },

  { id: 9,  cat: "Tiffins", name: "Masala Dosa",         veg: true,  price: 99,  emoji: "🥞", desc: "Crisp rice crepe with spiced potato filling, chutneys and sambar." },
  { id: 10, cat: "Tiffins", name: "Pesarattu Upma",      veg: true,  price: 89,  emoji: "🍃", desc: "Green gram dosa stuffed with upma, served with ginger chutney." },
  { id: 11, cat: "Tiffins", name: "Idli (3 pcs)",        veg: true,  price: 59,  emoji: "⚪", desc: "Soft steamed idlis with sambar and coconut chutney." },
  { id: 12, cat: "Tiffins", name: "Medu Vada (2 pcs)",   veg: true,  price: 69,  emoji: "🍩", desc: "Golden, crunchy lentil doughnuts with chutney." },

  { id: 13, cat: "Starters", name: "Chicken 65",         veg: false, price: 219, emoji: "🔥", desc: "Spicy deep-fried chicken bites with curry leaves." },
  { id: 14, cat: "Starters", name: "Paneer Tikka",       veg: true,  price: 199, emoji: "🍢", desc: "Chargrilled paneer marinated in yogurt and spices." },
  { id: 15, cat: "Starters", name: "Gobi Manchurian",    veg: true,  price: 159, emoji: "🥦", desc: "Crispy cauliflower in a tangy Indo-Chinese sauce." },

  { id: 16, cat: "Desserts", name: "Gulab Jamun (2 pcs)",veg: true,  price: 79,  emoji: "🍮", desc: "Warm milk dumplings soaked in rose-cardamom syrup." },
  { id: 17, cat: "Desserts", name: "Double Ka Meetha",   veg: true,  price: 99,  emoji: "🍞", desc: "Hyderabadi bread pudding with saffron and nuts." },
  { id: 18, cat: "Drinks",   name: "Sweet Lassi",        veg: true,  price: 69,  emoji: "🥛", desc: "Chilled thick yogurt drink, lightly sweetened." },
  { id: 19, cat: "Drinks",   name: "Fresh Lime Soda",    veg: true,  price: 49,  emoji: "🍋", desc: "Sweet, salted or mixed. Refreshing and fizzy." },
  { id: 20, cat: "Drinks",   name: "Filter Coffee",      veg: true,  price: 45,  emoji: "☕", desc: "Strong South Indian decoction coffee with frothy milk." }
];

/* ===== Helpers ===== */
const $ = (id) => document.getElementById(id);
const money = (n) => CONFIG.currency + Math.round(n).toLocaleString("en-IN");
const CART_KEY = "src_cart_v1";
const ORDERS_KEY = "src_orders_v1";

let cart = loadCart();      // { [id]: qty }
let activeCat = "All";
let searchText = "";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { return {}; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage blocked */ }
}

/* ===== Menu rendering ===== */
function renderTabs() {
  const cats = ["All", ...new Set(MENU.map((m) => m.cat))];
  const wrap = $("tabs");
  wrap.innerHTML = "";
  cats.forEach((c) => {
    const b = document.createElement("button");
    b.className = "tab" + (c === activeCat ? " active" : "");
    b.textContent = c;
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => { activeCat = c; renderTabs(); renderMenu(); });
    wrap.appendChild(b);
  });
}

function renderMenu() {
  const grid = $("menuGrid");
  grid.innerHTML = "";
  const q = searchText.trim().toLowerCase();
  const items = MENU.filter((m) =>
    (activeCat === "All" || m.cat === activeCat) &&
    (!q || m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q))
  );
  $("emptyMsg").hidden = items.length > 0;

  items.forEach((m) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-art" aria-hidden="true">${m.emoji}</div>
      <div class="card-body">
        <div class="card-title"><span class="${m.veg ? "veg" : "nonveg"}" title="${m.veg ? "Vegetarian" : "Non-vegetarian"}"></span><span>${m.name}</span></div>
        <p class="card-desc">${m.desc}</p>
        <div class="card-foot">
          <span class="price">${money(m.price)}</span>
          <button class="add-btn" data-id="${m.id}">Add</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

/* ===== Cart logic ===== */
function addItem(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart(); renderCart();
  const item = MENU.find((m) => m.id === id);
  toast(item.name + " added");
}
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(); renderCart();
}
function cartLines() {
  return Object.keys(cart)
    .map((id) => ({ item: MENU.find((m) => m.id === Number(id)), qty: cart[id] }))
    .filter((l) => l.item);
}
function totals() {
  const lines = cartLines();
  const subtotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const tax = subtotal * CONFIG.taxRate;
  const delivery = subtotal === 0 || subtotal >= CONFIG.freeDeliveryAbove ? 0 : CONFIG.deliveryFee;
  return { lines, subtotal, tax, delivery, total: subtotal + tax + delivery };
}

function renderCart() {
  const t = totals();
  const count = t.lines.reduce((s, l) => s + l.qty, 0);
  $("cartCount").textContent = count;

  const body = $("cartItems");
  body.innerHTML = "";
  if (!t.lines.length) {
    body.innerHTML = '<div class="cart-empty">🍽️<br>Your cart is empty.<br>Add something tasty!</div>';
  } else {
    t.lines.forEach(({ item, qty }) => {
      const row = document.createElement("div");
      row.className = "cart-line";
      row.innerHTML = `
        <span class="name">${item.name}</span>
        <span class="lp">${money(item.price * qty)}</span>
        <div class="qty">
          <button data-dec="${item.id}" aria-label="Decrease">−</button>
          <span>${qty}</span>
          <button data-inc="${item.id}" aria-label="Increase">+</button>
        </div>`;
      body.appendChild(row);
    });
  }
  $("subtotal").textContent = money(t.subtotal);
  $("tax").textContent = money(t.tax);
  $("delivery").textContent = t.delivery === 0 && t.subtotal > 0 ? "Free" : money(t.delivery);
  $("total").textContent = money(t.total);
  $("coTotal").textContent = money(t.total);
  $("checkoutBtn").disabled = !t.lines.length;
  $("clearCart").disabled = !t.lines.length;
}

/* ===== Drawer + modals ===== */
function openDrawer() {
  $("overlay").hidden = false;
  $("drawer").classList.add("open");
  $("drawer").setAttribute("aria-hidden", "false");
}
function closeDrawer() {
  $("overlay").hidden = true;
  $("drawer").classList.remove("open");
  $("drawer").setAttribute("aria-hidden", "true");
}
function openModal(id) { $(id).hidden = false; }
function closeModal(id) { $(id).hidden = true; }

let toastTimer;
function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
}

/* ===== Checkout ===== */
function placeOrder(form) {
  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  const phone = String(data.get("phone")).trim();
  const address = String(data.get("address")).trim();
  const notes = String(data.get("notes")).trim();
  const pay = String(data.get("pay"));
  const err = $("formError");

  if (name.length < 2) return showErr("Please enter your name.");
  if (!/^[6-9][0-9]{9}$/.test(phone)) return showErr("Enter a valid 10-digit mobile number.");
  if (address.length < 8) return showErr("Please enter a complete delivery address.");
  err.hidden = true;

  const t = totals();
  const id = "SRK" + Date.now().toString().slice(-8);
  const order = {
    id, name, phone, address, notes, pay,
    items: t.lines.map((l) => ({ name: l.item.name, qty: l.qty, price: l.item.price })),
    subtotal: t.subtotal, tax: t.tax, delivery: t.delivery, total: t.total,
    placedAt: new Date().toISOString()
  };

  try {
    const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    all.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  } catch (e) { /* ignore */ }

  $("orderId").textContent = id;
  $("doneMsg").textContent = `Thanks, ${name}! We'll call ${phone} to confirm. Total to pay: ${money(order.total)} (${pay}).`;

  const wa = $("waLink");
  if (CONFIG.whatsappNumber) {
    const lines = order.items.map((i) => `• ${i.name} × ${i.qty}`).join("\n");
    const text = `New order ${id}\n${lines}\nTotal: ${money(order.total)}\nName: ${name}\nPhone: ${phone}\nAddress: ${address}` +
      (notes ? `\nNotes: ${notes}` : "") + `\nPayment: ${pay}`;
    wa.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    wa.hidden = false;
  } else {
    wa.hidden = true;
  }

  cart = {}; saveCart(); renderCart();
  form.reset();
  closeModal("checkoutModal");
  closeDrawer();
  openModal("doneModal");

  function showErr(msg) { err.textContent = msg; err.hidden = false; }
}

/* ===== Events ===== */
$("menuGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (btn) addItem(Number(btn.dataset.id));
});
$("cartItems").addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  if (inc) changeQty(Number(inc.dataset.inc), 1);
  if (dec) changeQty(Number(dec.dataset.dec), -1);
});
$("search").addEventListener("input", (e) => { searchText = e.target.value; renderMenu(); });
$("openCart").addEventListener("click", openDrawer);
$("closeCart").addEventListener("click", closeDrawer);
$("overlay").addEventListener("click", closeDrawer);
$("clearCart").addEventListener("click", () => { cart = {}; saveCart(); renderCart(); });
$("checkoutBtn").addEventListener("click", () => { $("formError").hidden = true; openModal("checkoutModal"); });
$("closeCheckout").addEventListener("click", () => closeModal("checkoutModal"));
$("checkoutForm").addEventListener("submit", (e) => { e.preventDefault(); placeOrder(e.target); });
$("doneClose").addEventListener("click", () => closeModal("doneModal"));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeDrawer(); closeModal("checkoutModal"); closeModal("doneModal"); }
});

/* ===== Init ===== */
$("year").textContent = new Date().getFullYear();
renderTabs();
renderMenu();
renderCart();
