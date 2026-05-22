// js/app.js
import { setupSearch } from './search.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('posts-container');
    
    try {
        const response = await fetch('posts.json');
        if (!response.ok) throw new Error('Failed to fetch posts');
        
        const allPosts = await response.json();
        
        // Initial render
        renderPosts(allPosts);
        
        // Setup search and filtering
        setupSearch(allPosts, (filteredPosts) => {
            renderPosts(filteredPosts);
        });
        
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = '<div class="loading">게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</div>';
    }
    
    function renderPosts(postsToRender) {
        if (postsToRender.length === 0) {
            postsContainer.innerHTML = '<div class="loading">조건에 맞는 게시글이 없습니다.</div>';
            return;
        }
        
        postsContainer.innerHTML = postsToRender.map(post => `
            <article class="post-card">
                <h2 class="post-title">
                    <a href="post.html?file=${encodeURIComponent(post.file)}">${escapeHtml(post.title)}</a>
                </h2>
                <div class="post-meta">
                    <time datetime="${post.date}">${formatDate(post.date)}</time>
                    ${post.category ? ` &middot; <span>${escapeHtml(post.category)}</span>` : ''}
                </div>
                <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
                <div class="post-tags">
                    ${(post.tags || []).map(tag => `<span>#${escapeHtml(tag)}</span>`).join('')}
                </div>
            </article>
        `).join('');
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }).format(date);
    }
    
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
             .toString()
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
});
