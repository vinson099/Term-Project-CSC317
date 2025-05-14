document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.display = 'none';
    document.querySelector('.search-bar').appendChild(searchResults);

    let timeoutId;

    // Handle search input with debouncing
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        const query = e.target.value.trim();

        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        timeoutId = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Handle form submission
    document.querySelector('.search-bar').addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    });

    // Perform search
    async function performSearch(query) {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                displayResults(data.results);
            } else {
                searchResults.innerHTML = '<p class="no-results">No results found</p>';
            }
            searchResults.style.display = 'block';
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = '<p class="error">Search failed. Please try again.</p>';
        }
    }

    // Display search results
    function displayResults(results) {
        if (!results.length) {
            searchResults.innerHTML = '<p class="no-results">No results found</p>';
            return;
        }

        const html = results.map(item => `
            <div class="search-item">
                <img src="${item.imageUrl}" alt="${item.title}">
                <div class="search-item-info">
                    <h3>${item.title}</h3>
                    <p class="price">$${item.price.toLocaleString()}</p>
                </div>
                <a href="/product/${item.id}" class="btn btn-primary">View</a>
            </div>
        `).join('');

        searchResults.innerHTML = html;
    }

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });
});