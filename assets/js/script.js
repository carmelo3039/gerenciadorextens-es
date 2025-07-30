document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const extensionsGrid = document.getElementById('extensions-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const modal = document.getElementById('confirmation-modal');
    const cancelBtn = document.querySelector('.btn-cancel');
    const confirmBtn = document.querySelector('.btn-confirm');
    const extensionForm = document.getElementById('extension-form');
    const searchInput = document.getElementById('search-input');

    // State variables
    let currentFilter = 'all';
    let extensionsData = [];
    let extensionToRemove = null;

    // Initialize the app
    init();

    function init() {
        loadExtensions();
        setupEventListeners();
        applySavedTheme();
    }

    function loadExtensions() {
        extensionsData = [
            {
                id: 'devlens',
                name: 'DevLens',
                description: 'Quickly inspect page layouts and visualize element boundaries.',
                icon: './assets/images/logo-devlens.svg',
                active: true
            },
            {
                id: 'jsonwizard',
                name: 'JSONWizard',
                description: 'Formats, validates, and prettifies JSON responses in-browser.',
                icon: './assets/images/logo-json-wizard.svg',
                active: true
            },
            {
                id: 'markupnotes',
                name: 'Markup Notes',
                description: 'Enables annotation and notes directly onto webpages for collaborative debugging.',
                icon: './assets/images/logo-markup-notes.svg',
                active: true
            },
            {
                id: 'linkchecker',
                name: 'LinkChecker',
                description: 'Scans and highlights broken links on any page.',
                icon: './assets/images/logo-link-checker.svg',
                active: true
            },
            {
                id: 'stylespy',
                name: 'StyleSpy',
                description: 'Instantly analyze and copy CSS from any webpage element.',
                icon: './assets/images/logo-style-spy.svg',
                active: true
            },
            {
                id: 'tabmasterpro',
                name: 'TabMaster Pro',
                description: 'Organizes browser tabs into groups and sessions.',
                icon: './assets/images/logo-tab-master-pro.svg',
                active: true
            },
            {
                id: 'gridguides',
                name: 'GridGuides',
                description: 'Overlay customizable grids and alignment guides on any webpage.',
                icon: './assets/images/logo-grid-guides.svg',
                active: false
            },
            {
                id: 'domsnapshot',
                name: 'DOM Snapshot',
                description: 'Capture and export DOM structures quickly.',
                icon: './assets/images/logo-dom-snapshot.svg',
                active: false
            },
            {
                id: 'speedboost',
                name: 'SpeedBoost',
                description: 'Optimizes browser resource usage to accelerate page loading.',
                icon: './assets/images/logo-speed-boost.svg',
                active: false
            },
            {
                id: 'viewportbuddy',
                name: 'ViewportBuddy',
                description: 'Simulates various screen resolutions directly within the browser.',
                icon: './assets/images/logo-viewport-buddy.svg',
                active: false
            },
            {
                id: 'palettepicker',
                name: 'Palette Picker',
                description: 'Instantly extracts color palettes from any webpage.',
                icon: './assets/images/logo-palette-picker.svg',
                active: true
            },
            {
                id: 'consoleplus',
                name: 'ConsolePlus',
                description: 'Enhanced developer console with advanced filtering and logging.',
                icon: './assets/images/logo-console-plus.svg',
                active: true
            }
        ];

        renderExtensions();
    }

    function renderExtensions() {
        extensionsGrid.innerHTML = '';

        const filteredExtensions = extensionsData.filter(ext => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return ext.active;
            if (currentFilter === 'inactive') return !ext.active;
            return true;
        });

        if (filteredExtensions.length === 0) {
            extensionsGrid.innerHTML = '<p class="no-results">No extensions found matching the current filter.</p>';
            return;
        }

        filteredExtensions.forEach(extension => {
            const extensionCard = document.createElement('div');
            extensionCard.className = 'extension-card';
            extensionCard.innerHTML = `
                <div class="extension-card-header">
                    <img src="${extension.icon}" alt="${extension.name} icon" class="extension-icon">
                    <h2>${extension.name}</h2>
                </div>
                <p>${extension.description}</p>
                <div class="extension-actions">
                    <label class="toggle-switch">
                        <input type="checkbox" ${extension.active ? 'checked' : ''} data-id="${extension.id}">
                        <span class="toggle-slider"></span>
                    </label>
                    <button class="remove-btn" data-id="${extension.id}">Remove</button>
                </div>
            `;
            extensionsGrid.appendChild(extensionCard);
        });
    }

    function setupEventListeners() {
        // Filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentFilter = button.dataset.filter;
                renderExtensions();
            });
        });

        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        themeIcon.addEventListener('click', toggleTheme);

        // Modal buttons
        cancelBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', confirmRemoval);

        // Event delegation for dynamic elements
        extensionsGrid.addEventListener('click', function(e) {
            // Toggle switch
            if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                const extensionId = e.target.dataset.id;
                toggleExtension(extensionId, e.target.checked);
            }
            
            // Remove button
            if (e.target.classList.contains('remove-btn')) {
                e.preventDefault();
                const extensionId = e.target.dataset.id;
                openModal(extensionId);
            }
        });

        // Form submission
        extensionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewExtension();
        });

        // Search functionality
        searchInput.addEventListener('input', function() {
            filterExtensionsBySearch(searchInput.value.trim());
        });
    }

    function toggleExtension(id, isActive) {
        const extensionIndex = extensionsData.findIndex(ext => ext.id === id);
        if (extensionIndex !== -1) {
            extensionsData[extensionIndex].active = isActive;
        }
    }

    function openModal(id) {
        extensionToRemove = id;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        extensionToRemove = null;
    }

    function confirmRemoval() {
        if (extensionToRemove) {
            extensionsData = extensionsData.filter(ext => ext.id !== extensionToRemove);
            renderExtensions();
            closeModal();
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icons
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Update theme icon image
        const themeIconImg = themeIcon.querySelector('img');
        themeIconImg.src = newTheme === 'dark' ? 
            './assets/images/icon-sun.svg' : 
            './assets/images/icon-moon.svg';
    }

    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = themeToggle.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Update theme icon image
        const themeIconImg = themeIcon.querySelector('img');
        themeIconImg.src = savedTheme === 'dark' ? 
            './assets/images/icon-sun.svg' : 
            './assets/images/icon-moon.svg';
    }

    function addNewExtension() {
        const nameInput = document.getElementById('extension-name');
        const descInput = document.getElementById('extension-description');
        const activeInput = document.getElementById('extension-active');

        const newExtension = {
            id: nameInput.value.toLowerCase().replace(/\s+/g, '-'),
            name: nameInput.value,
            description: descInput.value,
            icon: './assets/images/logo-default.svg',
            active: activeInput.checked
        };

        extensionsData.unshift(newExtension);
        renderExtensions();

        // Reset form
        nameInput.value = '';
        descInput.value = '';
        activeInput.checked = true;
    }

    function filterExtensionsBySearch(searchTerm) {
        if (!searchTerm) {
            renderExtensions();
            return;
        }

        const filtered = extensionsData.filter(ext => 
            ext.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            ext.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        extensionsGrid.innerHTML = '';

        if (filtered.length === 0) {
            extensionsGrid.innerHTML = '<p class="no-results">No extensions found matching your search.</p>';
            return;
        }

        filtered.forEach(extension => {
            const extensionCard = document.createElement('div');
            extensionCard.className = 'extension-card';
            extensionCard.innerHTML = `
                <div class="extension-card-header">
                    <img src="${extension.icon}" alt="${extension.name} icon" class="extension-icon">
                    <h2>${extension.name}</h2>
                </div>
                <p>${extension.description}</p>
                <div class="extension-actions">
                    <label class="toggle-switch">
                        <input type="checkbox" ${extension.active ? 'checked' : ''} data-id="${extension.id}">
                        <span class="toggle-slider"></span>
                    </label>
                    <button class="remove-btn" data-id="${extension.id}">Remove</button>
                </div>
            `;
            extensionsGrid.appendChild(extensionCard);
        });
    }
});