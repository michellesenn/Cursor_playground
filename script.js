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

    // Show/hide guests overview content and decor
    function showGuestsOverviewContent(show) {
        const overviewContent = document.getElementById('guests-overview-content');
        const defaultContent = document.getElementById('default-content');
        const decorLeft = document.getElementById('decor-lines-left');
        const decorRight = document.getElementById('decor-lines-right');
        const appContainer = document.querySelector('.app-container');
        if (overviewContent && defaultContent) {
            if (show) {
                overviewContent.style.display = '';
                defaultContent.style.display = 'none';
                if (decorLeft) decorLeft.style.display = '';
                if (decorRight) decorRight.style.display = '';
                if (appContainer) appContainer.classList.add('show-subnav-btn');
            } else {
                overviewContent.style.display = 'none';
                defaultContent.style.display = '';
                if (decorLeft) decorLeft.style.display = 'none';
                if (decorRight) decorRight.style.display = 'none';
                if (appContainer) appContainer.classList.remove('show-subnav-btn');
            }
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

    // Initial state: show guests overview if Guests > Overview is active
    const initialActive = document.querySelector('.main-nav a.active');
    const initialSubActive = document.querySelector('.sub-nav a.active');
    if (initialActive && hasSubNav(initialActive.closest('li').getAttribute('data-name')) && initialSubActive && initialSubActive.id === 'subnav-overview') {
        showGuestsOverviewContent(true);
    } else {
        showGuestsOverviewContent(false);
    }

    // Helper: get dynamic greeting
    function getGreeting() {
        const now = new Date();
        const hour = now.getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }

    // Set dynamic greeting for guests overview
    function setDynamicGreeting() {
        const greetingTitle = document.getElementById('greeting-title');
        if (greetingTitle) {
            greetingTitle.textContent = `${getGreeting()} Lisa,`;
        }
    }

    // Call on load and when switching to guests overview
    setDynamicGreeting();
    setInterval(setDynamicGreeting, 60000); // Update greeting every minute

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
                // Show guests overview if Overview is active
                if (activeSub && activeSub.id === 'subnav-overview') {
                    showGuestsOverviewContent(true);
                    setDynamicGreeting();
                } else {
                    showGuestsOverviewContent(false);
                }
            } else {
                subNavContainer.classList.remove('open');
                appContainer.classList.remove('show-subnav-btn');
                // Set content to the main nav title
                if (contentTitle && contentDesc) {
                    contentTitle.textContent = this.querySelector('span')?.textContent || pageName;
                    contentDesc.textContent = `This is the content for ${this.querySelector('span')?.textContent || pageName}`;
                }
                showGuestsOverviewContent(false);
            }
            
            adjustContentMargin();
        });
    });

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
            // Show guests overview if Overview is active
            if (this.id === 'subnav-overview') {
                showGuestsOverviewContent(true);
                setDynamicGreeting();
            } else {
                showGuestsOverviewContent(false);
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

    // 3D hover effect for guests overview cards (CodePen style)
    function handleCard3DTilt(card) {
        let requestId = null;
        function onMove(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 15; // max 15deg
            const rotateY = ((x - centerX) / centerX) * -15; // max 15deg
            if (requestId) cancelAnimationFrame(requestId);
            requestId = requestAnimationFrame(() => {
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
            });
        }
        function onLeave() {
            if (requestId) cancelAnimationFrame(requestId);
            card.style.transform = '';
        }
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
    }
    document.querySelectorAll('.guests-overview-card').forEach(card => {
        handleCard3DTilt(card);
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            // Find the card's main label (font-weight: 600)
            const labelDiv = Array.from(card.querySelectorAll('div')).find(div => div.style.fontWeight === '600' || div.style.fontWeight === '600');
            if (!labelDiv) return;
            const label = labelDiv.textContent.trim();
            // Find the subnav link with matching text
            const subnavLinks = document.querySelectorAll('.sub-nav a');
            for (const link of subnavLinks) {
                if (link.textContent.trim() === label) {
                    link.click();
                    break;
                }
            }
        });
    });
}); 