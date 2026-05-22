// js/search.js

export function setupSearch(posts, onFilter) {
    const searchInput = document.getElementById('search-input');
    const tagsContainer = document.getElementById('tags-container');
    
    let currentSearchTerm = '';
    let currentSelectedTag = null;
    
    // Extract unique tags
    const allTags = new Set();
    posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    // Render tags
    tagsContainer.innerHTML = '';
    const allTagBtn = document.createElement('button');
    allTagBtn.className = 'tag active';
    allTagBtn.textContent = 'All';
    allTagBtn.addEventListener('click', () => {
        currentSelectedTag = null;
        updateActiveTag(allTagBtn);
        filterPosts();
    });
    tagsContainer.appendChild(allTagBtn);
    
    Array.from(allTags).sort().forEach(tag => {
        const tagBtn = document.createElement('button');
        tagBtn.className = 'tag';
        tagBtn.textContent = tag;
        tagBtn.addEventListener('click', () => {
            currentSelectedTag = tag;
            updateActiveTag(tagBtn);
            filterPosts();
        });
        tagsContainer.appendChild(tagBtn);
    });
    
    // Search input event
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        filterPosts();
    });
    
    function updateActiveTag(activeBtn) {
        const btns = tagsContainer.querySelectorAll('.tag');
        btns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    function filterPosts() {
        const filtered = posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(currentSearchTerm) || 
                                  post.excerpt.toLowerCase().includes(currentSearchTerm);
            
            const matchesTag = currentSelectedTag === null || 
                               (post.tags && post.tags.includes(currentSelectedTag));
                               
            return matchesSearch && matchesTag;
        });
        
        onFilter(filtered);
    }
}
