// app.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- SELECTORES DEL DOM (sin cambios) ---
    const productContainer = document.getElementById('product-container');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCounter = document.getElementById('cart-counter');
    const subtotalPriceElement = document.getElementById('subtotal-price');
    const sendOrderButton = document.getElementById('send-order-button');
    const customerForm = document.getElementById('customer-form');
    const deliveryRadios = document.querySelectorAll('input[name="delivery-type"]');
    const addressGroup = document.getElementById('address-group');
    
    // Selectores para el modal del carrito
    const cartButton = document.querySelector('.cart-button');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    
    const whatsappNumber = '5214771234567';

    // --- ESTADO DE LA APLICACIÓN ---
    let cart = [];
    
    // ======================= 1. NUEVA VARIABLE =======================
    // Define el costo de envío. Puedes cambiar este valor fácilmente.
    const deliveryCost = 15.00;
    // ================================================================

    // --- FUNCIONES ---

    function openCart() { /* ... sin cambios ... */ }
    function closeCart() { /* ... sin cambios ... */ }
    function renderProducts() { /* ... sin cambios ... */ }

    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío.</p>';
        } else {
            cartItemsContainer.innerHTML = '';
            cart.forEach(item => {
                const cartItemHTML = `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.nombre}</h4>
                            <p>$${(item.precio * item.quantity).toFixed(2)}</p>
                        </div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                            <button class="remove-btn" data-id="${item.id}"><i data-feather="trash-2"></i></button>
                        </div>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
            feather.replace();
        }
        // Llamamos a updateCartState para que el total se actualice al renderizar
        updateCartState();
    }
    
    // ======================= 2. FUNCIÓN MODIFICADA =======================
    // Ahora esta función calculará el total incluyendo el envío.
    function updateCartState() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        
        // Verifica qué opción de entrega está seleccionada
        const isDelivery = document.querySelector('#delivery').checked;
        let finalTotal = subtotal;

        // Si es a domicilio y hay productos en el carrito, suma el costo de envío
        if (isDelivery && subtotal > 0) {
            finalTotal += deliveryCost;
        }

        cartCounter.textContent = totalItems;
        // Mostramos el total final, que puede incluir el costo de envío
        subtotalPriceElement.textContent = `$${finalTotal.toFixed(2)}`;
        
        sendOrderButton.disabled = cart.length === 0;
        localStorage.setItem('brasasDoradasCart', JSON.stringify(cart));
    }
    // ================================================================

    function addToCart(productId) { /* ... sin cambios ... */ }
    function changeQuantity(productId, action) { /* ... sin cambios ... */ }
    function removeFromCart(productId) { /* ... sin cambios ... */ }
    
    // Función de mensaje de WhatsApp actualizada para reflejar el costo de envío
    function generateWhatsAppMessage() {
        const customerName = document.getElementById('customer-name').value;
        const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
        const address = document.getElementById('customer-address').value;

        let message = `¡Hola *Brasas Doradas*! 🔥 Quisiera hacer el siguiente pedido:\n\n`;
        message += `*CLIENTE:*\n${customerName}\n\n`;

        if (deliveryType === 'delivery') {
            message += `*TIPO DE ENTREGA:*\nEntrega a Domicilio 🛵\n\n`;
            message += `*DIRECCIÓN:*\n${address}\n\n`;
        } else {
            message += `*TIPO DE ENTREGA:*\nRecoger en Sucursal 🏃‍♂️\n\n`;
        }

        message += `*MI PEDIDO:*\n-----------------\n`;
        cart.forEach(item => {
            message += `(${item.quantity}) ${item.nombre} - $${(item.precio * item.quantity).toFixed(2)}\n`;
        });
        
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        let finalTotal = subtotal;

        if (deliveryType === 'delivery') {
            finalTotal += deliveryCost;
            message += `Costo de envío - $${deliveryCost.toFixed(2)}\n`;
        }
        
        message += `-----------------\n\n`;
        message += `*TOTAL DEL PEDIDO: $${finalTotal.toFixed(2)}*\n\n`;
        message += `Quedo en espera de la confirmación. ¡Gracias!`;
        
        return encodeURIComponent(message);
    }
    
    function loadCartFromStorage() { /* ... sin cambios ... */ }


    // --- EVENT LISTENERS ---
    
    cartButton.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    productContainer.addEventListener('click', e => { /* ... sin cambios ... */ });
    cartItemsContainer.addEventListener('click', e => { /* ... sin cambios ... */ });

    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            // Muestra u oculta el campo de dirección
            const isDelivery = radio.value === 'delivery';
            addressGroup.style.display = isDelivery ? 'block' : 'none';

            // ======================= 3. NUEVA LÓGICA =======================
            // Muestra una alerta y actualiza el total cada vez que cambia la opción.
            if (isDelivery) {
                alert(`Se agregará un cargo de $${deliveryCost.toFixed(2)} por envío a domicilio.`);
            }
            updateCartState();
            // ================================================================
        });
    });

    customerForm.addEventListener('submit', e => { /* ... sin cambios ... */ });

    // --- INICIALIZACIÓN ---
    loadCartFromStorage();
    renderProducts();
});
