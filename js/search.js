/**
 * HGD.dev - Instant Project Search & Filter System
 * Dynamically filters projects on keyup matching tag names, titles, and descriptions.
 */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-card');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    projectCards.forEach(card => {
      // 카드 내부 검색 대상 텍스트 수집 (제목, 설명, 태그)
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('.project-desc').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.tech-tags span'))
                        .map(t => t.textContent.toLowerCase());
      
      const searchSource = `${title} ${desc} ${tags.join(' ')}`;

      // 검색어 매칭 검사
      const isMatch = query === '' || searchSource.includes(query);

      if (isMatch) {
        // 일치하는 경우 표시 (애니메이션 적용)
        card.classList.remove('filtered-out');
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
        card.style.pointerEvents = 'auto';
      } else {
        // 일치하지 않는 경우 숨김
        card.classList.add('filtered-out');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        card.style.pointerEvents = 'none';
      }
    });

    // 검색 결과가 아예 없을 때 피드백 카드 동적 생성/제거
    toggleNoResultsMessage();
  });

  function toggleNoResultsMessage() {
    let noResultsMsg = document.getElementById('no-search-results');
    const visibleCards = document.querySelectorAll('.project-card:not(.filtered-out)');
    const container = document.querySelector('.projects-container');

    if (visibleCards.length === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-search-results';
        noResultsMsg.className = 'glass';
        noResultsMsg.style.padding = '40px';
        noResultsMsg.style.textAlign = 'center';
        noResultsMsg.style.color = 'var(--text-muted)';
        noResultsMsg.style.marginTop = '20px';
        noResultsMsg.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
          <h4>검색 결과가 없습니다.</h4>
          <p style="font-size: 0.9rem; margin-top: 8px;">다른 키워드로 검색해 보세요. (예: n8n, python, 자동화, Tableau)</p>
        `;
        container.appendChild(noResultsMsg);
      }
    } else {
      if (noResultsMsg) {
        noResultsMsg.remove();
      }
    }
  }
});
