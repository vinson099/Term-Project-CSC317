// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        return false;
    }
}

// Load header and footer when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const headerLoaded = await loadComponent('header-container', '/html/components/header.html');
    const footerLoaded = await loadComponent('footer-container', '/html/components/footer.html');
    
    if (headerLoaded && footerLoaded) {
        // Dispatch event when both components are loaded
        document.dispatchEvent(new Event('componentsLoaded'));
    }
}); 