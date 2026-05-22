/**
 * HGD.dev - Theme Management System
 * Handles elegant transitioning between dark and light modes, saving preference in localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const toggleIcon = themeToggleBtn.querySelector('.toggle-icon');
  
  // 1. 초기 테마 설정 확인
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 기본 테마 설정 적용 (저장된 테마가 없으면 시스템 설정 따름, 디폴트는 다크)
  if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
    setTheme('light');
  } else {
    setTheme('dark');
  }

  // 2. 테마 전환 버튼 이벤트 리스너
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 테마 토글 시 회전 애니메이션 효과 극대화
    themeToggleBtn.style.transform = 'rotate(360deg) scale(0.9)';
    
    setTimeout(() => {
      setTheme(newTheme);
      themeToggleBtn.style.transform = '';
    }, 150);
  });

  /**
   * 테마 적용 함수
   * @param {'dark'|'light'} theme 
   */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // 아이콘 및 UI 피드백 변경
    if (theme === 'light') {
      toggleIcon.textContent = '☀️';
      themeToggleBtn.setAttribute('aria-label', '다크 모드로 전환');
    } else {
      toggleIcon.textContent = '🌙';
      themeToggleBtn.setAttribute('aria-label', '라이트 모드로 전환');
    }
    
    // 글로벌 테마 전환 시 미세한 전환 효과 부여를 위한 바디 리플래시 (선택 사항)
    document.body.classList.add('theme-transitioning');
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 400);
  }
});
