document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const appContainer = document.querySelector('.app-container');
    const subNavContainer = document.querySelector('.sub-nav-container');
    const toggleSubNavBtn = document.querySelector('.toggle-subnav');
    const subNavCollapseBtn = document.querySelector('.subnav-collapse-btn');
    const mainNavItems = document.querySelectorAll('.main-nav a');
    const subNavItems = document.querySelectorAll('.sub-nav a');
    const contentTitle = document.getElementById('content-title');
    const contentDesc = document.getElementById('content-desc');
    const mainContent = document.querySelector('main.content');

    // Helper: does this main nav have a subnav?
    function hasSubNav(pageName) {
        return pageName === 'Guests';
    }

    // Load page content dynamically
    async function loadPageContent(pageName) {
        const folder = pageName.toLowerCase();
        const url = `pages/${folder}/content.html`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Not found');
            const html = await response.text();
            mainContent.innerHTML = html;
        } catch (err) {
            mainContent.innerHTML = `<div class="content-inner"><div class="content-title-block"><h1 class="content-title">${pageName}</h1><div class="content-desc">No content found for this page.</div></div></div>`;
        }
    }

    // Adjust content margin based on sub nav state
    function adjustContentMargin() {
        // No adjustment needed in the new design as content is always in the same place
    }
    
    // Initial adjustment
    adjustContentMargin();

    // Toggle sub navigation visibility (old button)
    toggleSubNavBtn.addEventListener('click', function() {
        subNavContainer.classList.toggle('open');
        adjustContentMargin();
    });

    // Toggle sub navigation visibility (new button)
    if (subNavCollapseBtn) {
        subNavCollapseBtn.addEventListener('click', function() {
            subNavContainer.classList.toggle('open');
            // Optionally rotate the chevron
            const chevron = subNavCollapseBtn.querySelector('img');
            if (subNavContainer.classList.contains('open')) {
                chevron.style.transform = 'rotate(0deg)';
            } else {
                chevron.style.transform = 'rotate(180deg)';
            }
            adjustContentMargin();
        });
    }

    // Handle main navigation click
    mainNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            mainNavItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the page name
            const pageName = this.closest('li').getAttribute('data-name');

            if (hasSubNav(pageName)) {
                subNavContainer.classList.add('open');
                appContainer.classList.add('show-subnav-btn');
                // Programmatically trigger click on Overview subnav
                const overviewSubnav = document.getElementById('subnav-overview');
                if (overviewSubnav) {
                    overviewSubnav.click();
                }
            } else {
                // Load the page content dynamically for non-subnav pages
                loadPageContent(pageName);
                subNavContainer.classList.remove('open');
                appContainer.classList.remove('show-subnav-btn');
            }
            
            adjustContentMargin();
        });
    });

    // Initial state: show button only if Guests is active
    const initialActive = document.querySelector('.main-nav a.active');
    if (initialActive && hasSubNav(initialActive.closest('li').getAttribute('data-name'))) {
        appContainer.classList.add('show-subnav-btn');
        // Programmatically trigger click on Overview subnav for initial load
        const overviewSubnav = document.getElementById('subnav-overview');
        if (overviewSubnav) {
            overviewSubnav.click();
        }
    } else {
        appContainer.classList.remove('show-subnav-btn');
    }

    // Load initial content
    if (initialActive) {
        const initialPage = initialActive.closest('li').getAttribute('data-name');
        loadPageContent(initialPage);
    }

    // Handle sub navigation click
    subNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            subNavItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get subnav id (e.g., 'overview', 'directory', etc.)
            const subnavId = this.id ? this.id.replace('subnav-', '') : null;
            if (subnavId) {
                // Load the subnav content dynamically
                const url = `pages/guests/${subnavId}/content.html`;
                fetch(url)
                    .then(response => {
                        if (!response.ok) throw new Error('Not found');
                        return response.text();
                    })
                    .then(html => {
                        mainContent.innerHTML = html;
                    })
                    .catch(() => {
                        mainContent.innerHTML = `<div class="content-inner"><div class="content-title-block"><h1 class="content-title">${this.textContent}</h1><div class="content-desc">No content found for this section.</div></div></div>`;
                    });
            }
        });
    });

    // Settings link (no specific functionality for the prototype)
    const settingsLink = document.querySelector('.settings-link');
    if (settingsLink) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Settings clicked');
        });
    }
}); 