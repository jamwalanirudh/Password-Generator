// DOM Elements
const credentialForm = document.getElementById('credential-form');
const searchInput = document.getElementById('search');
const credentialsContainer = document.getElementById('credentials-container');
const themeToggle = document.getElementById('theme-toggle');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.querySelector('.toggle-password');
const generatePasswordBtn = document.getElementById('generate-btn');
const lengthSlider = document.getElementById('password-length');
const lengthValue = document.getElementById('length-value');

// Theme handling
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Password length slider
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

// Password visibility toggle
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordBtn.innerHTML = type === 'password' ? 
        '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

// Password generation
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const useUppercase = document.getElementById('use-uppercase').checked;
    const useLowercase = document.getElementById('use-lowercase').checked;
    const useNumbers = document.getElementById('use-numbers').checked;
    const useSymbols = document.getElementById('use-symbols').checked;

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (useUppercase) charset += uppercase;
    if (useLowercase) charset += lowercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (charset === '') {
        alert('Please select at least one character type');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    passwordInput.value = password;
    passwordInput.setAttribute('type', 'text');
    togglePasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
}

generatePasswordBtn.addEventListener('click', generatePassword);

// Save credentials
function saveCredential(website, username, password) {
    const credentials = JSON.parse(localStorage.getItem('credentials') || '[]');
    credentials.push({ website, username, password, id: Date.now() });
    localStorage.setItem('credentials', JSON.stringify(credentials));
    displayCredentials();
}

// Display credentials
function displayCredentials(credentials = null) {
    const credentialsToDisplay = credentials || JSON.parse(localStorage.getItem('credentials') || '[]');
    credentialsContainer.innerHTML = '';

    credentialsToDisplay.forEach(credential => {
        const card = document.createElement('div');
        card.className = 'credential-card';
        card.innerHTML = `
            <div class="credential-header">
                <h3>${credential.website}</h3>
                <div class="credential-actions">
                    <button class="copy-password" title="Copy Password">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="edit-credential" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-credential" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="credential-details">
                <div>
                    <strong>Username:</strong>
                    <span>${credential.username}</span>
                </div>
                <div>
                    <strong>Password:</strong>
                    <span class="password-field">••••••••</span>
                </div>
            </div>
        `;

        // Add event listeners
        const copyBtn = card.querySelector('.copy-password');
        const editBtn = card.querySelector('.edit-credential');
        const deleteBtn = card.querySelector('.delete-credential');
        const passwordField = card.querySelector('.password-field');

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(credential.password);
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });

        passwordField.addEventListener('click', () => {
            passwordField.textContent = passwordField.textContent === '••••••••' ? 
                credential.password : '••••••••';
        });

        editBtn.addEventListener('click', () => {
            document.getElementById('website').value = credential.website;
            document.getElementById('username').value = credential.username;
            document.getElementById('password').value = credential.password;
            deleteCredential(credential.id);
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this credential?')) {
                deleteCredential(credential.id);
            }
        });

        credentialsContainer.appendChild(card);
    });
}

// Delete credential
function deleteCredential(id) {
    const credentials = JSON.parse(localStorage.getItem('credentials') || '[]');
    const updatedCredentials = credentials.filter(cred => cred.id !== id);
    localStorage.setItem('credentials', JSON.stringify(updatedCredentials));
    displayCredentials();
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const credentials = JSON.parse(localStorage.getItem('credentials') || '[]');
    const filteredCredentials = credentials.filter(cred => 
        cred.website.toLowerCase().includes(searchTerm)
    );
    displayCredentials(filteredCredentials);
});

// Form submission
credentialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const website = document.getElementById('website').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    saveCredential(website, username, password);
    credentialForm.reset();
});

// Initialize
displayCredentials(); 