// NEW: Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
let themeIcon = null;
if (themeToggle) themeIcon = themeToggle.querySelector('i');

// Apply saved theme (default: light)
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// Toggle handler (safe-guards in case element missing)
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (themeIcon) {
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        }
    });
}

// FIXED: Mobile Menu Toggle with close button animation
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active'); // This makes the X animation work
    });
}

// View Toggle Buttons (grid/list)
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const memberDirectory = document.getElementById('memberDirectory');

// Guard defaults if buttons missing
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

        // Decide badge class + text + emoji
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

        // Build inner HTML (keeps your layout & classes)
        memberCard.innerHTML = `
            <img src="${member.image || ''}" alt="${escapeHtml(member.name)}" class="member-image" loading="lazy">
            <div class="member-info">
                <h3>${escapeHtml(member.name)}</h3>
                <p class="member-tagline">${escapeHtml(member.tagline || '')}</p>
                <div class="member-details">
                    ${member.address ?   `<p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(member.address)}</p> `  : ''}
                    ${member.phone ?  `<p><i class="fas fa-phone"></i> <a href="tel:${member.phone}">${escapeHtml(member.phone)}</a></p> ` : ''}
                    ${member.website ?  `<p><i class="fas fa-globe"></i> <a href="${member.website}" target="_blank" rel="noopener">${escapeHtml(member.website)}</a></p> ` : ''}
                    ${member.email ?  `<p><i class="fas fa-envelope"></i> <a href="mailto:${member.email}">${escapeHtml(member.email)}</a></p> ` : ''}
                </div>
                <span class="membership-badge ${badgeClass}">${badgeText}</span>
            </div>
        `;

        memberDirectory.appendChild(memberCard);
    });
}

// Small HTML escape helper to avoid accidental markup injection
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
    // Update current year
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    // Update last modified date
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

    // Fade-in effect for lazy-loaded images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.setAttribute('data-loaded', 'true');
        });
    });
});