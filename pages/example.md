---
title: '첫 번째 게시글'
date: 2026-05-08
tags: ['JavaScript', 'Web', 'GitHub Pages']
category: 'Development'
description: 'GitHub Pages를 이용한 정적 블로그 구축 테스트 게시글입니다.'
---

# GitHub Pages 정적 블로그에 오신 것을 환영합니다!

이 블로그는 복잡한 프레임워크나 빌드 도구 없이 **HTML, CSS, Vanilla JavaScript** 만을 사용하여 구축되었습니다.

## 특징

1. **완벽한 정적 페이지**: Jekyll 없이 순수 `.html`과 `.md` 파일만으로 동작합니다.
2. **클라이언트 사이드 렌더링**: `marked.js`를 사용해 브라우저에서 마크다운을 실시간으로 렌더링합니다.
3. **자동화된 메타데이터**: GitHub Actions가 배포될 때마다 `posts.json`을 자동으로 생성합니다.
4. **빠른 검색**: 태그 기반 필터링과 클라이언트 사이드 검색을 지원합니다.

## 코드 하이라이팅 테스트

Prism.js를 사용한 코드 하이라이팅이 잘 적용되는지 확인합니다.

```javascript
// Greeting function
function greet(name) {
    console.log(`Hello, ${name}! Welcome to the new blog.`);
}

greet('Developer');
```

```css
/* CSS Test */
.beautiful-button {
    background-color: var(--accent-color);
    color: white;
    border-radius: 4px;
    padding: 10px 20px;
}
```

## 마크다운 문법 테스트

- **볼드체**
- *이탤릭체*
- [링크 테스트](https://github.com)

> 인용문 블록입니다.
> 
> "가장 단순한 것이 때로는 가장 좋습니다."

### 댓글 시스템

이 게시글의 하단에는 Giscus를 이용한 GitHub Discussions 기반의 댓글 시스템이 연동되어 있습니다. 방문자들은 GitHub 계정으로 로그인하여 댓글과 반응을 남길 수 있습니다.
