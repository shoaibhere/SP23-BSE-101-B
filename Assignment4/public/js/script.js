document.addEventListener('DOMContentLoaded', () => {
  const cartBody = document.querySelector('#cart-body');
  const totalPriceField = document.querySelector('#total-price');

  // Function to calculate the total price of the cart
  function calculateTotal() {
      let total = 0;

      // Iterate over each cart row
      document.querySelectorAll('.cart-row').forEach(row => {
          const price = parseFloat(row.querySelector('.price').textContent); // Get price per item
          const quantity = parseInt(row.querySelector('.quantity').value); // Get quantity
          const subtotalField = row.querySelector('.subtotal'); // Subtotal cell

          // Calculate subtotal and update DOM
          const subtotal = price * quantity;
          subtotalField.textContent = subtotal.toFixed(2);

          // Add subtotal to total
          total += subtotal;
      });

      // Update the total price in the footer
      totalPriceField.textContent = total.toFixed(2);
  }

  // Event Listener: Quantity Change
  cartBody.addEventListener('input', (event) => {
      if (event.target.classList.contains('quantity')) {
          const quantity = parseInt(event.target.value);

          // Prevent zero or negative quantities
          if (quantity < 1) {
              event.target.value = 1;
          }

          // Recalculate totals
          calculateTotal();
      }
  });

  // Initial Calculation: Calculate totals when the page loads
  calculateTotal();
});
