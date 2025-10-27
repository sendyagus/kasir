let cart = [];

function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();
  animateAddButton(event.target);
}

function animateAddButton(button) {
  button.style.transform = 'scale(0.9)';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 100);
}

function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCart();
    }
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function clearCart() {
  if (cart.length === 0) return;

  if (confirm('Hapus semua item dari keranjang?')) {
    cart = [];
    updateCart();
  }
}

function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Keranjang masih kosong</p></div>';
    updateSummary(0, 0, 0);
    return;
  }

  let html = '';
  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatRupiah(item.price)}</div>
        </div>
        <div class="cart-item-quantity">
          <button class="btn-qty" onclick="updateQuantity('${item.id}', -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="btn-qty" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <button class="btn-remove" onclick="removeFromCart('${item.id}')">Hapus</button>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = html;

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  updateSummary(subtotal, tax, total);
}

function updateSummary(subtotal, tax, total) {
  document.getElementById('subtotal').textContent = formatRupiah(subtotal);
  document.getElementById('tax').textContent = formatRupiah(tax);
  document.getElementById('total').textContent = formatRupiah(total);




  const checkoutBtn = document.querySelector('.btn-checkout');
  checkoutBtn.disabled = cart.length === 0;
}

function checkout() {
  if (cart.length === 0) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const transactionNumber = 'TRX' + Date.now();
  const transactionTime = new Date().toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  document.getElementById('modal-total').textContent = formatRupiah(total);
  document.getElementById('transaction-number').textContent = transactionNumber;
  document.getElementById('transaction-time').textContent = transactionTime;

  const modal = document.getElementById('modal');
  modal.classList.add('active');

  cart = [];
  updateCart();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('active');
}

function printReceipt() {
  const transactionNumber = document.getElementById('transaction-number').textContent;
  const transactionTime = document.getElementById('transaction-time').textContent;
  const total = document.getElementById('modal-total').textContent;

  const printWindow = window.open('', '', 'height=600,width=400');

  printWindow.document.write(`
    <html>
    <head>
      <title>Struk Pembayaran</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          max-width: 300px;
          margin: 20px auto;
          padding: 20px;
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .divider {
          border-bottom: 2px dashed #333;
          margin: 15px 0;
        }
        .info {
          margin: 10px 0;
        }
        .total {
          font-size: 1.5em;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <h2>STRUK PEMBAYARAN</h2>
      <div class="divider"></div>
      <div class="info">
        <strong>No. Transaksi:</strong><br>
        ${transactionNumber}
      </div>
      <div class="info">
        <strong>Tanggal & Waktu:</strong><br>
        ${transactionTime}
      </div>
      <div class="divider"></div>
      <div class="total">
        TOTAL PEMBAYARAN<br>
        ${total}
      </div>
      <div class="divider"></div>
      <div class="footer">
        Terima kasih atas kunjungan Anda!<br>
        Sampai jumpa lagi
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateCart();
});
