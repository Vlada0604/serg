// cart.js

/**
 * Отримує вміст кошика з localStorage.
 * @returns {Array} Масив товарів у кошику.
 */
function getCart() {
    const cartJSON = localStorage.getItem('cart');
    // Повертає масив, якщо дані є, або пустий масив, якщо немає
    return cartJSON ? JSON.parse(cartJSON) : [];
}

/**
 * Зберігає поточний вміст кошика у localStorage.
 * @param {Array} cart - Масив товарів.
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Оновлює лічильник товарів у шапці сайту.
 */
function updateCartDisplay() {
    const cart = getCart();
    // Підраховує загальну кількість товарів у кошику
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Знаходить посилання на кошик у шапці (наприклад, [🛒 Кошик (0)](cart.html))
    const cartLink = document.querySelector('a[href="cart.html"]'); 

    if (cartLink) {
        // Оновлює текст посилання
        cartLink.textContent = `🛒 Кошик (${totalItems})`;
    }
}

/**
 * Додає товар до кошика або збільшує його кількість.
 * @param {string} name - Назва товару.
 * @param {string} price - Ціна товару (як рядок, буде перетворена на число).
 */
function addToCart(name, price) {
    const cart = getCart();
    const priceFloat = parseFloat(price);

    if (isNaN(priceFloat)) {
        console.error("Недійсна ціна:", price);
        return;
    }

    // Перевіряємо, чи товар вже є в кошику
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1; // Товар знайдено, збільшуємо кількість
    } else {
        // Товар новий, додаємо його
        cart.push({
            name: name,
            price: priceFloat,
            quantity: 1
        });
    }

    saveCart(cart); // Зберігаємо оновлений кошик
    updateCartDisplay(); // Оновлюємо лічильник
    alert(`"${name}" додано до кошика!`); // Повідомлення для користувача
}

// Запускається після завантаження всього HTML
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay(); // Оновлюємо лічильник при завантаженні сторінки

    // Знаходимо всі кнопки з класом 'add-to-cart'
    const addButtons = document.querySelectorAll('.add-to-cart');

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Отримуємо дані про товар з атрибутів кнопки
            const productName = button.getAttribute('data-name');
            const productPrice = button.getAttribute('data-price');

            if (productName && productPrice) {
                addToCart(productName, productPrice);
            } else {
                console.error("Відсутні атрибути data-name або data-price на кнопці.");
            }
        });
    });
});
