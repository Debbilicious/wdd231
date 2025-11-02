// NEW: Theme Dropdown Functionality
const themeToggle = document.getElementById('themeToggle');
const themeDropdown = document.getElementById('themeDropdown');

// Create dropdown menu if it doesn't exist
function createThemeDropdown() {
    if (!themeToggle) return;
    
    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.id = 'themeDropdown';
    dropdown.className = 'theme-dropdown';
    dropdown.innerHTML = `
        <button class="theme-option" data-theme="light">
            <span class="theme-icon">☀</span> Light
        </button>
        <button class="theme-option" data-theme="dark">
            <span class="theme-icon">🌙</span> Dark
        </button>
        <button class="theme-option" data-theme="auto">
            <span class="theme-icon">🌓</span> Auto
        </button>
    `;
    
    // Insert dropdown after theme toggle button
    themeToggle.parentNode.insertBefore(dropdown, themeToggle.nextSibling);
    
    return dropdown;
}

// Apply theme based on preference
function applyTheme(theme) {
    if (theme === 'auto') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-mode');
            updateThemeIcon('🌙');
        } else {
            document.body.classList.remove('dark-mode');
            updateThemeIcon('☀');
        }
    } else if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon('🌙');
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon('☀');
    }
}

// Update theme toggle icon
function updateThemeIcon(icon) {
    if (themeToggle) {
        themeToggle.textContent = icon;
    }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'auto';
applyTheme(savedTheme);

// Toggle dropdown visibility
if (themeToggle) {
    const dropdown = createThemeDropdown();
    
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    
    // Handle theme selection
    dropdown.addEventListener('click', (e) => {
        const button = e.target.closest('.theme-option');
        if (!button) return;
        
        const selectedTheme = button.dataset.theme;
        localStorage.setItem('theme', selectedTheme);
        applyTheme(selectedTheme);
        dropdown.classList.remove('show');
        
        // Update active state
        dropdown.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.remove('active');
        });
        button.classList.add('active');
    });
    
    // Set initial active state
    const activeOption = dropdown.querySelector(`[data-theme="${savedTheme}"]`);
    if (activeOption) activeOption.classList.add('active');
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== themeToggle) {
            dropdown.classList.remove('show');
        }
    });
}

// Listen for system theme changes when auto mode is selected
if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'auto') {
            applyTheme('auto');
        }
    });
}

// FIXED: Mobile Menu Toggle with close button animation
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// View Toggle Buttons (grid/list)
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const memberDirectory = document.getElementById('memberDirectory');

if (gridBtn && listBtn && memberDirectory) {
    gridBtn.addEventListener('click', () => {
        memberDirectory.className = 'member-grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });

    listBtn.addEventListener('click', () => {
        memberDirectory.className = 'member-list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });
}

// Fetch and Display Members
async function loadMembers() {
    if (!memberDirectory) return;
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error loading members:', error);
        memberDirectory.innerHTML = '<p>Error loading member directory. Please try again later.</p>';
    }
}

function displayMembers(members) {
    if (!memberDirectory) return;
    memberDirectory.innerHTML = '';

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';

        const badgeClass =
            member.membershipLevel === 4 ? 'badge-diamond' :
            member.membershipLevel === 3 ? 'badge-gold' :
            member.membershipLevel === 2 ? 'badge-silver' :
            member.membershipLevel === 1 ? 'badge-bronze' :
            'badge-member';

        const badgeText =
            member.membershipLevel === 4 ? '💎 Diamond Member' :
            member.membershipLevel === 3 ? '🥇 Gold Member' :
            member.membershipLevel === 2 ? '🥈 Silver Member' :
            member.membershipLevel === 1 ? '🥉 Bronze Member' :
            'Member';

        memberCard.innerHTML = `
            <img src="${member.image || ''}" alt="${escapeHtml(member.name)}" class="member-image" loading="lazy">
            <div class="member-info">
                <h3>${escapeHtml(member.name)}</h3>
                <p class="member-tagline">${escapeHtml(member.tagline || '')}</p>
                <div class="member-details">
                    ${member.address ? `<p>📍 ${escapeHtml(member.address)}</p>` : ''}
                    ${member.phone ? `<p>📞 <a href="tel:${member.phone}">${escapeHtml(member.phone)}</a></p>` : ''}
                    ${member.website ? `<p>🌐 <a href="${member.website}" target="_blank" rel="noopener">${escapeHtml(member.website)}</a></p>` : ''}
                    ${member.email ? `<p>✉ <a href="mailto:${member.email}">${escapeHtml(member.email)}</a></p>` : ''}
                </div>
                <span class="membership-badge ${badgeClass}">${badgeText}</span>
            </div>
        `;

        memberDirectory.appendChild(memberCard);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Footer Dynamic Content
function updateFooter() {
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    const lastModifiedEl = document.getElementById('lastModified');
    if (lastModifiedEl) {
        const lastModified = new Date(document.lastModified);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        lastModifiedEl.textContent = lastModified.toLocaleDateString('en-US', options);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    updateFooter();

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.setAttribute('data-loaded', 'true');
        });
    });
});