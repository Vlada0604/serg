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

document.addEventListener('DOMContentLoaded', () => {
    // Вся ваша існуюча логіка кошика тут...

    const orderForm = document.getElementById('orderForm');
    const orderConfirmation = document.getElementById('orderConfirmation');

    // Перевіряємо, чи ми на сторінці кошика з формою
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Заборонити стандартну відправку форми

            const cartItems = getCartItems(); // Припустимо, ця функція існує
            
            // 1. Перевірка наявності товарів у кошику
            if (cartItems.length === 0) {
                alert('Не можна оформити порожнє замовлення. Додайте товари у кошик.');
                return;
            }

            // 2. Збір даних клієнта
            const customerData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                payment: document.getElementById('payment').value
            };

            // 3. Формування об'єкта замовлення
            const orderDetails = {
                customer: customerData,
                items: cartItems,
                // total: calculateTotal(), // Можна додати загальну суму, якщо у вас є функція
                timestamp: new Date().toISOString()
            };

            // 4. Симуляція відправки замовлення
            // ************
            // В реальному проєкті тут має бути запит (fetch/axios) на ваш бекенд
            // для збереження замовлення у базі даних.
            // ************
            console.log('Дані замовлення для відправки:', orderDetails);
            
            // 5. Очищення кошика та відображення підтвердження
            
            // Очищення кошика (припустимо, ця функція існує)
            clearCart(); 
            // Оновлення відображення (припустимо, ця функція існує)
            updateCartDisplay(); 

            // Сховати форму і показати повідомлення про успіх
            orderForm.style.display = 'none';
            orderConfirmation.style.display = 'block';

            // Опціонально: перенаправити користувача на головну сторінку через 5 секунд
            // setTimeout(() => {
            //     window.location.href = 'index.html';
            // }, 5000);
        });
    }

    // ПРИКЛАД: Якщо у вас ще немає цих функцій, вам потрібно їх створити
    function getCartItems() {
        // Приклад отримання кошика з localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart;
    }

    function clearCart() {
        // Приклад очищення кошика
        localStorage.removeItem('cart');
    }
  
});
