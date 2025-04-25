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

    // Helper: does this main nav have a subnav?
    function hasSubNav(pageName) {
        return pageName === 'Guests';
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
            
            // If Guests is clicked, show subnav and button, else hide both
            if (hasSubNav(pageName)) {
                subNavContainer.classList.add('open');
                appContainer.classList.add('show-subnav-btn');
                // Set content to the active subnav item
                const activeSub = document.querySelector('.sub-nav a.active');
                if (activeSub && contentTitle && contentDesc) {
                    contentTitle.textContent = activeSub.textContent;
                    contentDesc.textContent = `This is the content for ${activeSub.textContent}`;
                }
            } else {
                subNavContainer.classList.remove('open');
                appContainer.classList.remove('show-subnav-btn');
                // Set content to the main nav title
                if (contentTitle && contentDesc) {
                    contentTitle.textContent = this.querySelector('span')?.textContent || pageName;
                    contentDesc.textContent = `This is the content for ${this.querySelector('span')?.textContent || pageName}`;
                }
            }
            
            adjustContentMargin();
        });
    });

    // Initial state: show button only if Guests is active
    const initialActive = document.querySelector('.main-nav a.active');
    if (initialActive && hasSubNav(initialActive.closest('li').getAttribute('data-name'))) {
        appContainer.classList.add('show-subnav-btn');
    } else {
        appContainer.classList.remove('show-subnav-btn');
    }

    // Handle sub navigation click
    subNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            subNavItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update content title and description
            if (contentTitle) {
                contentTitle.textContent = this.textContent;
            }
            if (contentDesc) {
                contentDesc.textContent = `This is the content for ${this.textContent}`;
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