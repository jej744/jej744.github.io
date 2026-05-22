// js/post-loader.js

document.addEventListener('DOMContentLoaded', async () => {
    const postContent = document.getElementById('post-content');
    
    // Get file name from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');
    
    if (!fileName) {
        postContent.innerHTML = '<div class="loading">게시글을 찾을 수 없습니다.</div>';
        return;
    }
    
    try {
        const response = await fetch(`pages/${fileName}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        
        let content = await response.text();
        
        // Remove UTF-8 BOM if present
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        
        // Parse Front Matter
        const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        let metadata = {};
        let markdown = content;
        
        if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[1];
            markdown = frontMatterMatch[2];
            
            const lines = frontMatter.split(/\r?\n/);
            lines.forEach((line) => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();
                    
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    metadata[key] = value;
                }
            });
        }
        
        // Set Document Title
        if (metadata.title) {
            document.title = `${metadata.title} - My Blog`;
        }
        
        // Render Header
        const headerHtml = `
            <header class="post-header">
                <h1>${escapeHtml(metadata.title || fileName.replace('.md', ''))}</h1>
                <div class="post-meta">
                    <time datetime="${metadata.date || ''}">${formatDate(metadata.date || new Date().toISOString())}</time>
                    ${metadata.category ? ` &middot; <span>${escapeHtml(metadata.category)}</span>` : ''}
                </div>
            </header>
        `;
        
        // Parse Markdown to HTML
        const htmlContent = marked.parse(markdown);
        
        postContent.innerHTML = headerHtml + htmlContent;
        
        // Highlight Code Blocks
        if (window.Prism) {
            Prism.highlightAll();
        }
        
        // Load Giscus Comments
        loadGiscus();
        
    } catch (error) {
        console.error('Error loading post:', error);
        postContent.innerHTML = '<div class="loading">게시글을 불러오지 못했습니다.</div>';
    }
    
    function loadGiscus() {
        const commentsSection = document.getElementById('comments');
        const script = document.createElement('script');
        
        script.src = 'https://giscus.app/client.js';
        
        // IMPORTANT: User needs to replace these with their actual values
        script.setAttribute('data-repo', 'jej744/jej744.github.io');
        script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
        
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '1');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'ko');
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;
        
        commentsSection.appendChild(script);
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
