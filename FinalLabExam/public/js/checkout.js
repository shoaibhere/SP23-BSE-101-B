document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
    input.addEventListener('change', function() {
        const cardDetails = document.getElementById('card-details');
        cardDetails.style.display = this.value === 'Card' ? 'block' : 'none';
    });
});

// Function to add a slash between month and year
function formatCardExpiry(e) {
    var inputChar = String.fromCharCode(event.keyCode);
    var code = event.keyCode;
    var allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
        return;
    }

    event.target.value = event.target.value.replace(
        /^([1-9]\/|[2-9])$/g, '0$1/' // when 3 > 1 then it prefixes 0 before the digit and adds slash
    ).replace(
        /^(0[1-9]|1[0-2])$/g, '$1/' // adds a slash after the month
    ).replace(
        /^([0-1])([3-9])$/g, '0$1/$2' // prefixes 0 before month if typed value is greater than 12 and adds slash
    ).replace(
        /^(\d{2})\/(\d{2})$/g, '$1/$2' // prevents from typing more than 4 digits at the end
    ).replace(
        /\/\//g, '/' // prevents adding more than one slashes
    );
}

document.getElementById('cardExpiry').addEventListener('keyup', formatCardExpiry, false);

// Add form submission handling
document.querySelector('form').addEventListener('submit', function(e) {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    if (paymentMethod === 'Card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVC = document.getElementById('cardCVC').value;
        if (!cardNumber || !cardExpiry || !cardCVC) {
            e.preventDefault(); // Prevent form from submitting
            alert('Please fill in all card details.');
        }
        // Optionally, add more sophisticated validation here
    }
});