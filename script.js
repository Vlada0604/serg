let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Додавання товару
function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${name} додано до кошика!`);
}

// Оновлення лічильника
function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  if (countElement) countElement.textContent = cart.length;
}

// Відображення кошика на cart.html
function displayCart() {
  const cartList = document.getElementById("cart-items");
  if (!cartList) return;

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} — ${item.price} грн`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = () => removeFromCart(index);

    li.appendChild(removeBtn);
    cartList.appendChild(li);
    total += item.price;
  });

  document.getElementById("total").textContent = `Всього: ${total} грн`;
}

// Видалення товару
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// Очистка кошика
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  displayCart();
  updateCartCount();
}

// Оформлення замовлення
function submitOrder(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;

  if (cart.length === 0) {
    alert("Ваш кошик порожній!");
    return;
  }

  alert(`Дякуємо, ${name}! Ваше замовлення оформлено.`);
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

// Показати суму на сторінці оформлення
function showOrderTotal() {
  const totalElement = document.getElementById("order-total");
  if (totalElement) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalElement.textContent = `Всього до сплати: ${total} грн`;
  }
}

// Ініціалізація при завантаженні сторінки
updateCartCount();
displayCart();
showOrderTotal();
