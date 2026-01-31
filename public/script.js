document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on
    const isPortfolioPage = window.location.pathname.includes('portfolio.html');

    if (isPortfolioPage) {
        initPortfolio();
    } else {
        initLanding();
    }
});

function initLanding() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function initPortfolio() {
    fetchUserData();
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// UI Toggles
function toggleAuth(view) {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const alertBox = document.getElementById('auth-alert');

    if (alertBox) {
        alertBox.className = 'hidden';
        alertBox.textContent = '';
    }

    if (view === 'register') {
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    } else {
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    }
}

function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('auth-alert');
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = type === 'error' ? 'error-message' : 'success-message';
    alertBox.style.display = 'block';
}

// API Handlers
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            showAlert('Registration successful! Please sign in.', 'success');
            setTimeout(() => toggleAuth('login'), 2000);
            document.getElementById('register-form').reset();
        } else {
            showAlert(data.error || data.message || 'Registration failed');
        }
    } catch (err) {
        showAlert('An error occurred. Check your Vercel logs/connection.');
        console.error(err);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            window.location.href = '/portfolio.html';
        } else {
            showAlert(data.error || data.message || 'Login failed');
        }
    } catch (err) {
        showAlert('An error occurred. Check your Vercel logs/connection.');
        console.error(err);
    }
}

async function fetchUserData() {
    try {
        const res = await fetch('/api/me');
        if (!res.ok) {
            throw new Error('Not authenticated');
        }
        const data = await res.json();

        document.getElementById('user-name').textContent = data.user.name;
        document.getElementById('user-email').textContent = data.user.email;
        document.getElementById('user-initials').textContent = data.user.name.charAt(0).toUpperCase();
    } catch (err) {
        console.error(err);
        window.location.href = '/index.html';
    }
}

async function handleLogout() {
    try {
        await fetch('/api/logout');
        window.location.href = '/index.html';
    } catch (err) {
        console.error('Logout failed', err);
    }
}
