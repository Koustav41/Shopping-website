let cart = [];
document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach((button, idx) => {
        button.addEventListener('click', function () {
            const cardBody = button.closest('.card-body');
            const title = cardBody.querySelector('.card-title').innerText;
            const price = parseFloat(cardBody.querySelector('.card-text').innerText.replace(/[^\d.]/g, ''));
            const quantityInput = cardBody.querySelector('input[type="number"]');
            const quantity = parseInt(quantityInput.value);

            addToCart(title, price, quantity);
            alert(`${quantity} x ${title} added to cart!`);
        });
    });
});


function addToCart(title, price, quantity) {
    const existing = cart.find(item => item.title === title);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ title, price, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart)); // <-- Add this line
}


function showCart() {
    console.clear();
    console.log("Cart Contents:");
    cart.forEach(item => {
        console.log(`${item.title} - ₹${item.price} x ${item.quantity}`);
    });
    console.log(`Total: ₹${cart.reduce((total, item) => total + item.price * item.quantity, 0)}`);
    alert("Check console for cart contents!");
    console.table(cart);
    console.log("Total Amount: ₹" + cart.reduce((total, item) => total
        + item.price * item.quantity, 0));
    cart = []; 
    console.log("Cart has been cleared.");
    alert("Cart has been cleared.");
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = 1);
    console.log("All quantity inputs reset to 1.");
    console.log("Thank you for shopping with us!");
    alert("Thank you for shopping with us!");
    console.log("Visit us again!");
    alert("Visit us again!");
    console.log("Have a great day!");
    alert("Have a great day!");
    console.log("Goodbye!");
    alert("Goodbye!");

}