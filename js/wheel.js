// Wheel Configuration
const wheelSegments = [
    { text: "10% OFF", discount: 0.1, type: "percentage", color: "#FF6B6B" },
    { text: "5% OFF", discount: 0.05, type: "percentage", color: "#4ECDC4" },
    { text: "FREE Shipping", discount: 5, type: "fixed", color: "#45B7D1" },
    { text: "20% OFF", discount: 0.2, type: "percentage", color: "#FFA07A" },
    { text: "€5 OFF", discount: 5, type: "fixed", color: "#98D8C8" },
    { text: "15% OFF", discount: 0.15, type: "percentage", color: "#F7DC6F" },
    { text: "Better Luck Next Time", discount: 0, type: "none", color: "#BB8FCE" },
    { text: "€10 OFF", discount: 10, type: "fixed", color: "#85C1E9" }
];

let isSpinning = false;
let currentRotation = 0;
let activeCoupon = null;

// Initialize Wheel
function initWheel() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    // Draw wheel segments
    const segmentAngle = (2 * Math.PI) / wheelSegments.length;
    
    wheelSegments.forEach((segment, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(segment.text, radius - 20, 5);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
}

// Spin the Wheel
function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-wheel-btn');
    const resultDiv = document.getElementById('coupon-result');

    // Disable spin button during spin
    spinBtn.disabled = true;
    resultDiv.textContent = '';

    // Random rotation (5-10 full rotations + random segment)
    const extraRotation = 5 * 360 + Math.random() * 5 * 360;
    const segmentAngle = 360 / wheelSegments.length;
    const winningSegment = Math.floor(Math.random() * wheelSegments.length);
    const targetRotation = currentRotation + extraRotation + (winningSegment * segmentAngle);

    // Apply rotation with easing
    wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
    wheel.style.transform = `rotate(${targetRotation}deg)`;

    // Show result after spin
    setTimeout(() => {
        const winningPrize = wheelSegments[winningSegment];
        showCouponResult(winningPrize);
        isSpinning = false;
        spinBtn.disabled = false;
        currentRotation = targetRotation % 360;
    }, 4200);
}

// Show Coupon Result
function showCouponResult(prize) {
    const resultDiv = document.getElementById('coupon-result');
    const couponCode = generateCouponCode();
    
    if (prize.discount > 0) {
        activeCoupon = {
            code: couponCode,
            discount: prize.discount,
            type: prize.type,
            text: prize.text
        };
        
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <h5>🎉 Congratulations!</h5>
                <p>You won: <strong>${prize.text}</strong></p>
                <p>Coupon Code: <code class="coupon-code">${couponCode}</code></p>
                <p class="small">Use this code at checkout to claim your discount!</p>
            </div>
        `;
        
        // Save to localStorage
        localStorage.setItem('activeCoupon', JSON.stringify(activeCoupon));
        showNotification(`Congratulations! You won ${prize.text}`, 'success');
    } else {
        resultDiv.innerHTML = `
            <div class="alert alert-info">
                <h5>😊 Better Luck Next Time!</h5>
                <p>Keep trying - new spins available daily!</p>
            </div>
        `;
        activeCoupon = null;
        localStorage.removeItem('activeCoupon');
    }
}

// Generate Random Coupon Code
function generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'T4R-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Apply Coupon to Checkout
function applyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const couponMessage = document.getElementById('coupon-message');
    const code = couponInput.value.trim().toUpperCase();
    
    if (!code) {
        couponMessage.innerHTML = '<div class="alert alert-warning">Please enter a coupon code</div>';
        return;
    }
    
    // Check if it's the active coupon
    if (activeCoupon && activeCoupon.code === code) {
        couponMessage.innerHTML = `
            <div class="alert alert-success">
                ✅ Coupon applied: <strong>${activeCoupon.text}</strong>
                <button type="button" class="btn-close float-end" onclick="removeCoupon()"></button>
            </div>
        `;
        updateCheckoutWithDiscount();
        showNotification('Coupon applied successfully!', 'success');
    } else {
        couponMessage.innerHTML = '<div class="alert alert-danger">Invalid or expired coupon code</div>';
    }
}

// Remove Coupon
function removeCoupon() {
    activeCoupon = null;
    localStorage.removeItem('activeCoupon');
    document.getElementById('coupon-message').innerHTML = '';
    document.getElementById('coupon-input').value = '';
    updateCheckoutWithDiscount();
    showNotification('Coupon removed', 'info');
}

// Update Checkout with Discount
function updateCheckoutWithDiscount() {
    const subtotalElement = document.getElementById('checkout-subtotal');
    const discountElement = document.getElementById('checkout-discount');
    const totalElement = document.getElementById('checkout-total');
    const shippingElement = document.getElementById('checkout-shipping');
    
    let subtotal = cartItems.reduce((total, item) => {
        const price = item.selectedPrice || getPriceForPeriod(item, item.rentalPeriod);
        return total + (price * (item.quantity || 1));
    }, 0);
    
    const shipping = 5.00;
    let discount = 0;
    
    // Apply discount if active coupon exists
    if (activeCoupon) {
        if (activeCoupon.type === 'percentage') {
            discount = subtotal * activeCoupon.discount;
        } else if (activeCoupon.type === 'fixed') {
            discount = activeCoupon.discount;
        }
        
        // Don't let discount exceed subtotal
        discount = Math.min(discount, subtotal);
    }
    
    const total = Math.max(0, subtotal + shipping - discount);
    
    // Update display
    subtotalElement.textContent = `€${subtotal.toFixed(2)}`;
    shippingElement.textContent = `€${shipping.toFixed(2)}`;
    
    if (discount > 0) {
        discountElement.innerHTML = `
            <div class="d-flex justify-content-between mb-2 text-success">
                <span>Discount (${activeCoupon.text}):</span>
                <span>-€${discount.toFixed(2)}</span>
            </div>
        `;
    } else {
        discountElement.innerHTML = '';
    }
    
    totalElement.textContent = `€${total.toFixed(2)}`;
}

// Wheel Controls
document.addEventListener('DOMContentLoaded', function() {
    // Initialize wheel
    initWheel();
    
    // Load active coupon from localStorage
    const savedCoupon = localStorage.getItem('activeCoupon');
    if (savedCoupon) {
        activeCoupon = JSON.parse(savedCoupon);
    }
    
    // Event listeners
    document.getElementById('spin-wheel-btn')?.addEventListener('click', spinWheel);
    document.getElementById('close-wheel')?.addEventListener('click', closeWheel);
    document.getElementById('apply-coupon-btn')?.addEventListener('click', applyCoupon);
    
    // Floating spin button
    document.getElementById('spin-btn')?.addEventListener('click', openWheel);
});

// Wheel Overlay Functions
function openWheel() {
    document.getElementById('wheel-overlay').style.display = 'flex';
    initWheel(); // Re-initialize wheel to ensure proper rendering
}

function closeWheel() {
    document.getElementById('wheel-overlay').style.display = 'none';
}

// Close wheel when clicking outside
document.getElementById('wheel-overlay')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeWheel();
    }
});