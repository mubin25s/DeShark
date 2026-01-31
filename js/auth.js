// Auth.js - Authentication Logic

document.addEventListener('DOMContentLoaded', () => {
    // Sliding Animation Logic
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && signInButton && container) {
        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
    }

    // Form Handling
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => handleAuth(e, false));
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => handleAuth(e, true));
    }
});

function handleAuth(e, isRegister) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.disabled = true;
    btn.innerText = 'Processing...';

    const email = e.target.querySelector('input[type="email"]').value;
    // Password is the first password input found
    const password = e.target.querySelector('input[type="password"]').value;

    setTimeout(() => {
        if (isRegister) {
            const name = e.target.querySelector('input[type="text"]').value;
            // For register, we might want to check confirm password if we had it, 
            // but the new design only has one password field for simplicity as per image.
            
            // If the user adds a confirm password field back, we can re-enable this:
            // const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1]?.value;
            // if (confirmPassword && password !== confirmPassword) { ... }

            const success = db.registerUser({ name, email, password, role: 'customer' });
            if (success) {
                alert('Registration successful! Please login.'); // Could auto-login or switch to login panel
                // Switch to login panel
                const container = document.getElementById('container');
                if(container) container.classList.remove("right-panel-active");
                
                // Clear form
                e.target.reset();
                btn.disabled = false;
                btn.innerText = originalText;
            } else {
                alert('Email already registered!');
                btn.disabled = false;
                btn.innerText = originalText;
            }
        } else {
            const user = db.loginUser(email, password);
            if (user) {
                if (user.role === 'admin') {
                    window.location.href = '../admin/dashboard.html';
                } else {
                    window.location.href = 'home.html';
                }
            } else {
                alert('Invalid email or password!');
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }
    }, 1000);
}
