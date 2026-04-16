const products = [
    { id: 1, name: "iPhone 17 Pro Max", price: 999, img: "images/iphone_17_pro_1card.png", storage: [256, 512, 1024], colors: ["Natural Titanium", "Black", "White"] },
    { id: 2, name: "MacBook Neo", price: 999, img: "images/MacBook_2card.png", storage: [512, 1024, 2048], colors: ["Space Gray", "Silver"] },
    { id: 3, name: "Apple Watch Ultra 3", price: 999, img: "images/Apple_Watch_Ultra_3_3card.jpg", storage: [], colors: ["Orange", "Black", "Natural"] },
    { id: 4, name: "MacBook Air 13", price: 999, img: "images/MacBook_Air_4card.png", storage: [512, 1024, 2048], colors: ["Midnight", "Starlight", "Space Gray"] },
    { id: 5, name: "AirPods Max 2", price: 999, img: "images/AirPods_Max_2_5card.png", storage: [], colors: ["Sky Blue", "Green", "Pink", "Silver"] },
    { id: 6, name: "iPhone 17e", price: 999, img: "images/iphone_17e_6card.png", storage: [128, 256, 512, 1024], colors: ["Black", "White", "Yellow"] }
];

let cart = [];

const main = document.querySelector('main');
const homePage = document.getElementById('home-page');
const catalogContainer = document.getElementById('catalog-container');
const productContainer = document.getElementById('product-container');

function hideAll() {
    homePage.classList.add('hidden');
    catalogContainer.classList.add('hidden');
    productContainer.classList.add('hidden');
    document.querySelectorAll('.temp-page').forEach(p => p.remove());
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const text = e.target.textContent.toLowerCase();
        if (text === 'home') { hideAll(); homePage.classList.remove('hidden'); }
        else if (text === 'store' || text === 'sale') { e.preventDefault(); showCatalog(); }
    });
});

document.querySelectorAll('.btn').forEach(btn => {
    if (btn.textContent.trim() === "Shop All") btn.addEventListener('click', showCatalog);
});

document.querySelector('.fa-cart-shopping').closest('a').onclick = (e) => { e.preventDefault(); showCart(); };
document.querySelector('.user-actions a:last-child').onclick = (e) => { e.preventDefault(); showLogin(); };

function showCatalog() {
    hideAll();
    catalogContainer.classList.remove('hidden');
    catalogContainer.innerHTML = `
        <section class="content-section">
            <h2>All Products</h2>
            <div class="items-grid">
                ${products.map(p => `
                    <div class="item-card" onclick="showDetails(${p.id})">
                        <div class="item-image" style="background-image: url('${p.img}')"></div>
                        <div class="item-info"><span>${p.name}</span><b>$${p.price}</b></div>
                    </div>
                `).join('')}
            </div>
        </section>`;
}

window.showDetails = function(id) {
    hideAll();
    const p = products.find(prod => prod.id === id);
    productContainer.classList.remove('hidden');
    
    productContainer.innerHTML = `
        <section class="content-section">
            <div style="display: flex; gap: 3rem; text-align: left; flex-wrap: wrap; justify-content: center; align-items: center;">
                <div style="flex: 1; max-width: 650px;">
                    <img src="${p.img}" style="width: 100%; border: 1px solid #888; box-shadow: 0 15px 30px rgba(0,0,0,0.1);">
                </div>
                <div style="flex: 1; min-width: 320px;">
                    <h1 style="font-size: 2.8rem;">${p.name}</h1>
                    <p style="font-size: 2.2rem; font-weight: bold; margin: 1.5rem 0; color: #000;">$${p.price}</p>
                    
                    ${p.storage.length ? `
                        <div style="margin: 1.5rem 0;">
                            <label style="display:block; margin-bottom:5px; font-weight:bold;">Storage:</label>
                            <select id="stSel" style="padding: 10px; width: 100%; border: 1px solid #888;">
                                ${p.storage.map(s => `<option value="${s}">${s}GB</option>`).join('')}
                            </select>
                        </div>` : ''}
                    
                    <div style="margin: 1.5rem 0;">
                        <label style="display:block; margin-bottom:5px; font-weight:bold;">Color:</label>
                        <select id="coSel" style="padding: 10px; width: 100%; border: 1px solid #888;">
                            ${p.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>
                    
                    <button class="btn" id="addBtn" style="width: 100%; margin-top: 25px; background: #000; color: #fff;">Add to Cart</button>
                    <button class="btn" onclick="showCatalog()" style="width: 100%; margin-top: 10px;">Back to Catalog</button>
                </div>
            </div>
        </section>`;

    document.getElementById('addBtn').onclick = () => {
        const s = document.getElementById('stSel')?.value || "Standard";
        const c = document.getElementById('coSel').value;
        cart.push({ ...p, s, c });
        alert(`${p.name} added!`);
    };
};

function showLogin() {
    hideAll();
    const page = document.createElement('div');
    page.className = 'content-section temp-page';
    page.innerHTML = `
        <div class="modal-content" style="margin: 0 auto; text-align: left; background: #fff; padding: 40px; border: 1px solid #888;">
            <h2 style="font-size: 2rem; margin-bottom: 20px;">Login</h2>
            <form id="lForm">
                <input type="email" id="lEmail" placeholder="Email Address" required style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #888;">
                <input type="password" id="lPass" placeholder="Password" required style="width:100%; padding:12px; margin-bottom:20px; border:1px solid #888;">
                <button type="submit" class="btn" style="width:100%; background: #000; color: #fff;">Sign In</button>
            </form>
            <p style="margin-top: 20px;">New customer? <a href="#" onclick="showRegister()" style="text-decoration: underline; font-weight:bold;">Create an account</a></p>
        </div>`;
    main.appendChild(page);

    document.getElementById('lForm').onsubmit = (e) => {
        e.preventDefault(); // No reload [cite: 39]
        const saved = JSON.parse(localStorage.getItem('user'));
        const email = document.getElementById('lEmail').value;
        const pass = document.getElementById('lPass').value;

        if (saved && saved.email === email && saved.pass === pass) {
            alert(`Welcome, ${saved.name}!`);
            document.querySelector('.user-actions a:last-child').textContent = saved.name;
            hideAll(); homePage.classList.remove('hidden');
        } else {
            alert("Invalid credentials.");
        }
    };
}

window.showRegister = function() {
    hideAll();
    const page = document.createElement('div');
    page.className = 'content-section temp-page';
    page.innerHTML = `
        <div class="modal-content" style="margin: 0 auto; text-align: left; background: #fff; padding: 40px; border: 1px solid #888;">
            <h2 style="font-size: 2rem; margin-bottom: 20px;">Register</h2>
            <form id="rForm">
                <input type="text" id="rName" placeholder="Full Name" required style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #888;">
                <input type="email" id="rEmail" placeholder="Email Address" required style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #888;">
                <input type="password" id="rPass" placeholder="Password" required style="width:100%; padding:12px; margin-bottom:20px; border:1px solid #888;">
                <div id="rError" style="color: red; margin-bottom: 10px; min-height: 1.2rem; font-weight: bold;"></div>
                <button type="submit" class="btn" style="width:100%; background: #000; color: #fff;">Register Account</button>
            </form>
            <p style="margin-top: 20px;">Already have an account? <a href="#" onclick="showLogin()" style="text-decoration: underline; font-weight:bold;">Login here</a></p>
        </div>`;
    main.appendChild(page);
    
    const rForm = document.getElementById('rForm');
    const error = document.getElementById('rError');
    
    rForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            error.textContent = "";
            });
        });
    
    rForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('rName').value.trim();
        const email = document.getElementById('rEmail').value.trim();
        const pass = document.getElementById('rPass').value.trim();

        if (!name || !email || !pass){
            error.textContent = "All fields must be filled!";
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            error.textContent = "Invalid email format!"
            return;
        }
        
        localStorage.setItem('user', JSON.stringify({name, email, pass}));
        alert(`Welcome, ${name}!`);
        showLogin();
    };
};

function showCart() {
    hideAll();
    const page = document.createElement('div');
    page.className = 'content-section temp-page';
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    page.innerHTML = `
        <h2>Shopping Cart</h2>
        <div style="max-width: 700px; margin: 0 auto; background: #fff; padding: 30px; border: 1px solid #888;">
            ${cart.length === 0 ? '<p style="text-align:center;">Your cart is empty.</p>' : cart.map(i => `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding: 15px 0; align-items:center;">
                    <span style="font-weight:bold;">${i.name} <br> <small style="font-weight:normal; color:#666;">${i.s}GB | ${i.c}</small></span>
                    <b style="font-size:1.2rem;">$${i.price}</b>
                </div>`).join('')}
            <div style="margin-top: 30px; display:flex; justify-content:space-between; align-items:center;">
                <h3>Total Order:</h3>
                <h3 style="font-size:1.8rem;">$${total}</h3>
            </div>
            <button class="btn" style="width:100%; margin-top:25px; background:#000; color:#fff;" onclick="alert('Order placed!')">Complete Checkout</button>
            <button class="btn" style="width:100%; margin-top:10px;" onclick="showCatalog()">Continue Shopping</button>
        </div>`;
    main.appendChild(page);
}
