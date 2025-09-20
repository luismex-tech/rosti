// app.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- SELECTORES DEL DOM ---
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
    
    // ¡¡¡CAMBIA ESTE NÚMERO POR EL DE TU NEGOCIO!!!
    const whatsappNumber = '5214771234567';

    // --- ESTADO DE LA APLICACIÓN ---
    let cart = [];
    const deliveryCost = 15.00; // Costo de envío

    // --- FUNCIONES ---

    function openCart() {
        cartSidebar.classList.add('is-open');
        cartOverlay.classList.add('is-active');
        document.body.classList.add('no-scroll');
    }

    function closeCart() {
        cartSidebar.classList.remove('is-open');
        cartOverlay.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
    }
    
    function renderProducts() {
        productContainer.innerHTML = '';
        menuItems.forEach(item => {
            const productCard = `
                <div class="product-card">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="product-info">
                        <h3>${item.nombre}</h3>
                        <p>${item.descripcion}</p>
                        <div class="product-footer">
                            <span class="product-price">$${item.precio.toFixed(2)}</span>
                            <button class="add-to-cart-btn" data-id="${item.id}">Agregar</button>
                        </div>
                    </div>
                </div>
            `;
            productContainer.innerHTML += productCard;
        });
    }

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
        updateCartState();
    }
    
    function updateCartState() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        
        const isDelivery = document.querySelector('#delivery').checked;
        let finalTotal = subtotal;

        if (isDelivery && subtotal > 0) {
            finalTotal += deliveryCost;
        }

        cartCounter.textContent = totalItems;
        subtotalPriceElement.textContent = `$${finalTotal.toFixed(2)}`;
        
        sendOrderButton.disabled = cart.length === 0;
        localStorage.setItem('brasasDoradasCart', JSON.stringify(cart));
    }

    function addToCart(productId) {
        const productToAdd = menuItems.find(item => item.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        renderCart();
    }

    function changeQuantity(productId, action) {
        const itemInCart = cart.find(item => item.id === productId);
        if (!itemInCart) return;

        if (action === 'increase') {
            itemInCart.quantity++;
        } else if (action === 'decrease') {
            itemInCart.quantity--;
            if (itemInCart.quantity <= 0) {
                removeFromCart(productId);
                return;
            }
        }
        renderCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

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

        if (deliveryType === 'delivery' && subtotal > 0) {
            finalTotal += deliveryCost;
            message += `Costo de envío - $${deliveryCost.toFixed(2)}\n`;
        }
        
        message += `-----------------\n\n`;
        message += `*TOTAL DEL PEDIDO: $${finalTotal.toFixed(2)}*\n\n`;
        message += `Quedo en espera de la confirmación. ¡Gracias!`;
        
        return encodeURIComponent(message);
    }
    
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('brasasDoradasCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            renderCart();
        }
    }


    // --- EVENT LISTENERS ---
    cartButton.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    productContainer.addEventListener('click', e => {
        const target = e.target.closest('.add-to-cart-btn');
        if (target) {
            const productId = parseInt(target.dataset.id);
            addToCart(productId);
        }
    });

    cartItemsContainer.addEventListener('click', e => {
        const target = e.target.closest('button');
        if (!target) return;

        const productId = parseInt(target.dataset.id);
        
        if (target.classList.contains('quantity-btn')) {
            const action = target.dataset.action;
            changeQuantity(productId, action);
        } else if (target.classList.contains('remove-btn')) {
            removeFromCart(productId);
        }
    });

    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const isDelivery = radio.value === 'delivery';
            addressGroup.style.display = isDelivery ? 'block' : 'none';

            if (isDelivery && cart.length > 0) {
                alert(`Se agregará un cargo de $${deliveryCost.toFixed(2)} por envío a domicilio.`);
            }
            updateCartState();
        });
    });

    customerForm.addEventListener('submit', e => {
        e.preventDefault();
        const customerName = document.getElementById('customer-name').value;
        const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
        const address = document.getElementById('customer-address').value;

        if (!customerName) {
            alert('Por favor, ingresa tu nombre.');
            return;
        }
        if (deliveryType === 'delivery' && !address) {
            alert('Por favor, ingresa tu dirección para la entrega.');
            return;
        }

        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;
        
        window.open(whatsappUrl, '_blank');
    });


    // --- INICIALIZACIÓN ---
    loadCartFromStorage();
    renderProducts();
});
