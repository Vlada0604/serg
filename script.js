// =========================================================
// ФУНКЦІЇ ДЛЯ РОБОТИ З КОШИКОМ
// =========================================================

// 1. Отримати товари з localStorage
function getCartItems() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart;
    } catch (e) {
        console.error("Помилка читання кошика з localStorage:", e);
        return [];
    }
}

// 2. Зберегти товари в localStorage
function saveCartItems(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 3. Очистити кошик у localStorage
function clearCart() {
    localStorage.removeItem('cart');
}

// 4. Оновити відображення кошика (працює на cart.html та index.html)
function updateCartDisplay() {
    const cartItems = getCartItems();
    const cartList = document.querySelector('.cart-items');
    const totalElement = document.getElementById('cart-total');
    const checkoutSection = document.getElementById('checkout-section');

    if (!cartList || !totalElement) return; // Вихід, якщо елементи не знайдені (наприклад, ми на index.html без міні-кошика)

    cartList.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
        cartList.innerHTML = '<li>Кошик порожній. Перейдіть на <a href="index.html">головну сторінку</a>, щоб додати товари.</li>';
        totalElement.textContent = '0.00 грн';
        
        // Приховуємо секцію оформлення, якщо кошик порожній
        if (checkoutSection) {
            checkoutSection.style.display = 'none';
        }
        return;
    }

    // Відображення товарів у кошику
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            ${item.name} - ${item.quantity} шт. x ${item.price.toFixed(2)} грн = 
            <span>${itemTotal.toFixed(2)} грн</span>
        `;
        cartList.appendChild(li);
    });

    totalElement.textContent = total.toFixed(2) + ' грн';

    // Показуємо секцію оформлення, якщо кошик не порожній
    if (checkoutSection) {
        checkoutSection.style.display = 'block';
    }
}

// =========================================================
// ЛОГІКА ДОДАВАННЯ ТОВАРУ (для index.html)
// =========================================================

function addToCart(productName, productPrice) {
    let cart = getCartItems();
    
    // Перевіряємо, чи товар уже є в кошику
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    saveCartItems(cart);
    alert(`${productName} додано до кошика!`);
    
    // Якщо ми на cart.html, оновлюємо відображення
    if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay();
    }
}

// =========================================================
// ІНІЦІАЛІЗАЦІЯ ТА ОБРОБКА ПОДІЙ
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Ініціалізація кошика на сторінці cart.html
    if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay();
    }
    
    // Обробка натискання кнопки "Очистити кошик"
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Ви впевнені, що хочете очистити кошик?')) {
                clearCart();
                updateCartDisplay();
            }
        });
    }

    // Додавання обробників "Додати до кошика" на index.html
    const productButtons = document.querySelectorAll('.product button');
    productButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            const name = productElement.querySelector('h3').textContent;
            // Припускаємо, що ціна вказана в тексті і її потрібно витягнути
            const priceText = productElement.querySelector('p').textContent.replace('Ціна: ', '').replace(' грн', '').trim();
            const price = parseFloat(priceText);

            if (!isNaN(price)) {
                addToCart(name, price);
            } else {
                alert('Помилка: Не вдалося визначити ціну товару.');
            }
        });
    });

    // =========================================================
    // ЛОГІКА ОФОРМЛЕННЯ ЗАМОВЛЕННЯ (працює лише на cart.html)
    // =========================================================
    const orderForm = document.getElementById('orderForm');
    const orderConfirmation = document.getElementById('orderConfirmation');

    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Заборонити стандартну відправку форми

            const cartItems = getCartItems();
            
            // 1. Перевірка наявності товарів у кошику
            if (cartItems.length === 0) {
                alert('Не можна оформити порожнє замовлення.');
                return;
            }

            // 2. Збір даних клієнта
            const customerData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                payment: document.getElementById('payment').value
            };
            
            // Розрахунок загальної суми для замовлення
            let totalOrderAmount = 0;
            cartItems.forEach(item => {
                totalOrderAmount += item.price * item.quantity;
            });

            // 3. Формування об'єкта замовлення
            const orderDetails = {
                customer: customerData,
                items: cartItems,
                total: totalOrderAmount.toFixed(2),
                timestamp: new Date().toLocaleString()
            };

            // 4. СИМУЛЯЦІЯ ВІДПРАВКИ
            // У реальному проєкті тут відправляється запит на сервер!
            console.log('--- НОВЕ ЗАМОВЛЕННЯ ---');
            console.log(orderDetails);
            
            // 5. Очищення кошика та відображення підтвердження
            clearCart(); 
            updateCartDisplay(); // Оновлює кошик та приховує форму
            
            // Сховати форму і показати повідомлення про успіх
            orderForm.style.display = 'none';
            orderConfirmation.style.display = 'block';
        });
    }
});
