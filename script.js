// =========================================================
// ФУНКЦІЇ ДЛЯ РОБОТИ З КОШИКОМ (Об'єднано та виправлено)
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

/**
 * Оновлює лічильник товарів у шапці сайту.
 */
function updateCartHeaderCount() {
    const cart = getCartItems();
    // Підраховує загальну кількість товарів у кошику
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Знаходить посилання на кошик у шапці (посилання має бути <a> з href="cart.html")
    const cartLink = document.querySelector('a[href="cart.html"]'); 

    if (cartLink) {
        // Оновлює текст посилання
        cartLink.textContent = `🛒 Кошик (${totalItems})`;
    }
}


// 4. Оновити відображення кошика (працює на cart.html)
function updateCartDisplay() {
    const cartItems = getCartItems();
    // Використовуємо .cart-items для ul у cart.html
    const cartList = document.querySelector('.cart-items'); 
    const totalElement = document.getElementById('cart-total');
    const checkoutSection = document.getElementById('checkout-section');

    if (!cartList || !totalElement) return; // Вихід, якщо елементи не знайдені (наприклад, ми на index.html)

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
    
    // Ціна вже має бути числом завдяки parseFloat перед викликом
    const priceFloat = parseFloat(productPrice); 

    if (isNaN(priceFloat)) {
        console.error("Недійсна ціна:", productPrice);
        alert('Помилка: Не вдалося визначити ціну товару.');
        return;
    }
    
    // Перевіряємо, чи товар уже є в кошику
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: priceFloat, quantity: 1 });
    }

    saveCartItems(cart);
    updateCartHeaderCount(); // Оновлюємо лічильник у шапці
    alert(`"${productName}" додано до кошика!`);
}

// =========================================================
// ІНІЦІАЛІЗАЦІЯ ТА ОБРОБКА ПОДІЙ
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Ініціалізація лічильника кошика на всіх сторінках
    updateCartHeaderCount(); 
    
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
                updateCartHeaderCount(); // Оновити шапку після очищення
            }
        });
    }

    // ДОДАТКОВЕ ВИПРАВЛЕННЯ: Додавання обробників "Додати до кошика" на index.html
    const addButtons = document.querySelectorAll('.add-to-cart'); 

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Отримуємо дані про товар з атрибутів data-
            const productName = button.getAttribute('data-name');
            const productPrice = button.getAttribute('data-price');

            if (productName && productPrice) {
                // Передаємо назву і ЦІНУ (як число)
                addToCart(productName, parseFloat(productPrice)); 
            } else {
                console.error("Відсутні атрибути data-name або data-price на кнопці.");
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
            event.preventDefault(); 

            const cartItems = getCartItems();
            
            // 1. Перевірка наявності товарів у кошику
            if (cartItems.length === 0) {
                alert('Не можна оформити порожнє замовлення.');
                return;
            }

            // 2. Збір даних клієнта (залишаємо без змін)
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

            // 3. Формування об'єкта замовлення (залишаємо без змін)
            const orderDetails = {
                customer: customerData,
                items: cartItems,
                total: totalOrderAmount.toFixed(2),
                timestamp: new Date().toLocaleString()
            };

            // 4. СИМУЛЯЦІЯ ВІДПРАВКИ (залишаємо без змін)
            console.log('--- НОВЕ ЗАМОВЛЕННЯ ---');
            console.log(orderDetails);
            
            // 5. Очищення кошика та відображення підтвердження
            clearCart(); 
            updateCartDisplay(); 
            updateCartHeaderCount(); // Оновити шапку
            
            // Сховати форму і показати повідомлення про успіх
            orderForm.style.display = 'none';
            orderConfirmation.style.display = 'block';
        });
    }
});
