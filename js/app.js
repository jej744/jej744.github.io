/**
 * HGD.dev - Main Interactive Application & Analytics Controller
 * Implements interactive project simulators, statistical calculators, n8n webhook binding,
 * and a global fetch interception engine to power real-time visitor logs and dashboards.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. GLOBAL n8n WEBHOOK SETTINGS CONTROLLER
     ========================================================================== */
  const webhookInput = document.getElementById('n8n-webhook-url-input');
  const saveWebhookBtn = document.getElementById('n8n-save-url-btn');
  const settingsStatus = document.getElementById('settings-status-msg');
  const modeRadios = document.querySelectorAll('input[name="chat-mode"]');
  const webhookGroup = document.getElementById('settings-webhook-group');

  // 로컬 스토리지에서 저장된 설정 로드 및 매핑
  const savedMode = localStorage.getItem('n8n_chat_mode') || 'simulation';
  const savedUrl = localStorage.getItem('n8n_webhook_url');

  if (savedUrl && webhookInput) {
    webhookInput.value = savedUrl;
  }

  // 초기 라디오 선택값 설정 및 패널 노출 여부
  modeRadios.forEach(radio => {
    if (radio.value === savedMode) {
      radio.checked = true;
    }
  });

  if (webhookGroup) {
    webhookGroup.style.display = savedMode === 'live' ? 'block' : 'none';
  }

  // 라디오 변경 시 패널 노출 전환
  modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (webhookGroup) {
        webhookGroup.style.display = e.target.value === 'live' ? 'block' : 'none';
      }
    });
  });

  if (saveWebhookBtn) {
    saveWebhookBtn.addEventListener('click', () => {
      const selectedMode = document.querySelector('input[name="chat-mode"]:checked')?.value || 'simulation';
      localStorage.setItem('n8n_chat_mode', selectedMode);

      if (selectedMode === 'live' && webhookInput) {
        let urlValue = webhookInput.value.trim();
        urlValue = urlValue.replace(/^<|>/g, '');

        if (!urlValue) {
          showStatus('올바른 URL을 입력해 주세요.', 'error-msg');
          return;
        }

        try {
          new URL(urlValue); // URL 유효성 검사
          localStorage.setItem('n8n_webhook_url', urlValue);
        } catch (err) {
          showStatus('유효한 웹훅 URL 형식이 아닙니다. 확인 후 다시 입력해 주세요.', 'error-msg');
          return;
        }
      }

      showStatus('성공적으로 설정되었습니다! 적용을 위해 2초 후 페이지를 새로고침합니다. 🎉', 'success-msg');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  function showStatus(msg, className) {
    if (!settingsStatus) return;
    settingsStatus.textContent = msg;
    settingsStatus.className = `settings-status ${className}`;
  }


  /* ==========================================================================
     2. PROJECT 1: RESEARCH NOTE BUILDER SIMULATOR
     ========================================================================== */
  const simCompanyInput = document.getElementById('sim-company-input');
  const simRunBtn = document.getElementById('sim-run-btn');
  const simPipeline = document.querySelector('.sim-pipeline');
  const simOutputBox = document.getElementById('sim-output-box');

  if (simRunBtn) {
    simRunBtn.addEventListener('click', () => {
      const company = simCompanyInput.value.trim();
      if (!company) {
        alert('대상 회사 이름을 입력해 주세요!');
        return;
      }

      // 시뮬레이터 초기화 및 가시화
      simRunBtn.disabled = true;
      simOutputBox.style.display = 'none';
      simPipeline.style.display = 'flex';
      
      const nodes = {
        webhook: document.getElementById('sim-node-webhook'),
        gemini: document.getElementById('sim-node-gemini'),
        publish: document.getElementById('sim-node-publish')
      };

      // 모든 노드 리셋
      Object.values(nodes).forEach(node => {
        node.className = 'sim-node';
        const conn = node.nextElementSibling;
        if (conn && conn.classList.contains('sim-connector')) {
          conn.classList.remove('active-link');
        }
      });

      // 1단계: Webhook Node 활성화 (1.2초)
      nodes.webhook.classList.add('running');
      
      setTimeout(() => {
        nodes.webhook.classList.remove('running');
        nodes.webhook.classList.add('success');
        nodes.webhook.nextElementSibling.classList.add('active-link');
        
        // 2단계: Gemini Node 활성화 (1.8초)
        setTimeout(() => {
          nodes.gemini.classList.add('running');
          
          setTimeout(() => {
            nodes.gemini.classList.remove('running');
            nodes.gemini.classList.add('success');
            nodes.gemini.nextElementSibling.classList.add('active-link');
            
            // 3단계: Publish Node 활성화 (1.2초)
            setTimeout(() => {
              nodes.publish.classList.add('running');
              
              setTimeout(() => {
                nodes.publish.classList.remove('running');
                nodes.publish.classList.add('success');
                
                // 결과 보고서 출력
                renderMockReport(company);
                simRunBtn.disabled = false;
              }, 1200);
            }, 500);
          }, 1800);
        }, 800);
      }, 1200);
    });
  }

  function renderMockReport(company) {
    simOutputBox.style.display = 'block';
    simOutputBox.innerHTML = `
      <p style="color: var(--secondary); font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 12px;">
        🚀 [COMPLETED] n8n AI 분석 결과 보고서 - ${company}
      </p>
      <strong>[1. 경쟁사 동향 분석]</strong><br>
      • 주요 강점: 강력한 시장 점유율 및 고효율 마케팅 기법 운용<br>
      • 위협 요인: 신규 AI 대체 기술 등장으로 인한 전환 고객 증대 가능성<br><br>
      <strong>[2. 홍길동 데이터 분석가의 AX 제언]</strong><br>
      • 현 시점에서는 브랜드 마케팅 노출량 위주에서 **마이크로 인플루언서 중심의 고참여 전환 마케팅**으로 선회하는 것이 효율적입니다.<br>
      • n8n을 통한 경쟁사 소셜 미디어 인덱스 크롤링 및 Gemini API 기반 모니터링 자동화를 통해 분석 리소스를 추가 확보하는 것을 권장합니다.<br><br>
      <span style="color: var(--text-muted); font-size: 0.75rem;">(n8n 봇이 결과를 성공적으로 생성하고 Markdown 형태로 GitHub Pages에 퍼블리싱을 완료했습니다. - 소요 시간: 4.2초)</span>
    `;
    // 스크롤 이동
    simOutputBox.scrollTop = 0;
  }


  /* ==========================================================================
     3. PROJECT 2: INSTAGRAM ROI CHART SIMULATOR
     ========================================================================== */
  const budgetRange = document.getElementById('budget-range');
  const budgetValue = document.getElementById('budget-value');
  const influencerType = document.getElementById('influencer-type');
  
  const resReach = document.getElementById('res-reach');
  const resEng = document.getElementById('res-eng');
  const resRoi = document.getElementById('res-roi');

  if (budgetRange && influencerType) {
    const updateCalculations = () => {
      const budget = parseInt(budgetRange.value, 10);
      budgetValue.textContent = budget.toLocaleString();
      
      const type = influencerType.value;
      let reach = 0;
      let eng = 0;
      let roi = 0;

      if (type === 'micro') {
        // 마이크로 인플루언서: 도달률 낮음, 인게이지먼트 3배 높음 (9%), 단가 합리적
        reach = budget * 12;
        eng = Math.round(reach * 0.09);
        roi = Math.round(eng * 2.8);
      } else {
        // 메가 인플루언서: 도달률 높음, 인게이지먼트 평이함 (3%), 단가 비쌈
        reach = budget * 26;
        eng = Math.round(reach * 0.03);
        roi = Math.round(eng * 1.35);
      }

      // 숫자 카운트 애니메이션 효과와 함께 반영
      animateNumber(resReach, reach, true);
      animateNumber(resEng, eng, true);
      animateNumber(resRoi, roi, false, '$');
    };

    budgetRange.addEventListener('input', updateCalculations);
    influencerType.addEventListener('change', updateCalculations);
    
    // 초기 로딩 시 1회 연산
    updateCalculations();
  }

  function animateNumber(element, target, isLocale, prefix = '') {
    let current = parseInt(element.textContent.replace(/[^0-9]/g, ''), 10) || 0;
    const duration = 300; // ms
    const stepTime = 30;
    const steps = duration / stepTime;
    const stepVal = (target - current) / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      current += stepVal;
      stepCount++;
      
      if (stepCount >= steps) {
        clearInterval(timer);
        element.textContent = prefix + (isLocale ? Math.round(target).toLocaleString() : Math.round(target));
      } else {
        element.textContent = prefix + (isLocale ? Math.round(current).toLocaleString() : Math.round(current));
      }
    }, stepTime);
  }


  /* ==========================================================================
     4. REAL-TIME VISITOR LOGS & DASHBOARD SYNC (FETCH MONKEYPATCH)
     ========================================================================== */
  
  // 초기 통계 상태 구성
  const categoriesCount = {
    '프로젝트': 18,
    '기술': 11,
    '경력': 9,
    '기타': 4
  };

  let totalChatsCount = 42;
  const liveLogsBody = document.getElementById('live-logs-body');
  const statsTotalChats = document.getElementById('stats-total-chats');
  const statsTopCategory = document.getElementById('stats-top-category');

  // 전역 fetch 인터셉터 구축
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const url = args[0];
    const options = args[1];

    const currentWebhookUrl = localStorage.getItem('n8n_webhook_url') || 'https://본인주소.app.n8n.cloud/webhook/chat';

    // 요청 URL이 설정한 n8n 웹훅 주소이거나 n8n의 챗봇 엔드포인트일 때 매칭
    if (typeof url === 'string' && (url.includes('webhook/chat') || url === currentWebhookUrl)) {
      
      try {
        const payload = JSON.parse(options.body);
        const userMessage = (payload.chatInput || payload.message || '').trim();
        const sessionId = payload.sessionId || 'default';
        const action = payload.action || 'sendMessage';

        // 1. 만약 시뮬레이션 모드이거나 n8n 서버가 연결되어 있지 않은 모의 주소인 경우,
        // 오프라인 에러 및 CORS preflight 에러 방지를 위해 가상의 Gemini AI 포트폴리오 에이전트 응답을 인터셉팅하여 바로 전달!
        const isSimulationMode = (localStorage.getItem('n8n_chat_mode') || 'simulation') === 'simulation';
        const isMockUrl = isSimulationMode || url.includes('본인주소.app.n8n.cloud') || url.includes('<') || url.includes('localhost');
        
        if (isMockUrl) {
          // 로컬 에뮬레이션 응답 지연 (현실감을 위한 1.2초 대기)
          await new Promise(resolve => setTimeout(resolve, 1100));
          
          const simulatedAnswer = getSimulatedAnswer(userMessage);
          
          // 가상 데이터 대시보드 로깅 트리거
          recordChatLog(userMessage, simulatedAnswer);

          // n8n chatbot widget이 기대하는 response body mock 생성 주입
          const responseBody = JSON.stringify({ output: simulatedAnswer });
          return new Response(responseBody, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 2. 실제 n8n 라이브 웹훅 요청 진행
        const response = await originalFetch.apply(this, args);
        
        // 정상 수신 시 응답을 복사해서 분석 대시보드 로그에 실시간 축적
        if (response.ok) {
          const clonedResponse = response.clone();
          const jsonRes = await clonedResponse.json();
          const aiAnswer = jsonRes.output || '';
          
          // 실제 수신 응답 로깅 트리거
          recordChatLog(userMessage, aiAnswer);
        }

        return response;

      } catch (err) {
        console.warn('n8n 웹훅 통신 또는 인터셉터 파싱 과정에서 우회 처리되었습니다.', err);
        
        // 에러 발생 시 최후의 방어 수단으로 로컬 시뮬레이션 응답 작동
        const userMessage = options && options.body ? (JSON.parse(options.body).chatInput || '') : '';
        const simulatedAnswer = getSimulatedAnswer(userMessage);
        recordChatLog(userMessage, simulatedAnswer);
        
        return new Response(JSON.stringify({ output: simulatedAnswer }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 일반 fetch 호출은 통과
    return originalFetch.apply(this, args);
  };

  /**
   * 홍길동 페르소나 매칭 로컬 응답 제네레이터 (n8n Workflow Agent System Message 완벽 복사)
   */
  function getSimulatedAnswer(message) {
    const msg = message.toLowerCase().trim();

    if (msg === '' || msg === 'init' || msg.match(/안녕|하이|반가|시작/)) {
      return "안녕하세요! 홍길동의 포트폴리오 AI 어시스턴트입니다 😊 저에 대해 궁금하신 점을 물어보세요. 예시:\n• 어떤 프로젝트를 하셨나요?\n• 마케터 경력이 있으신가요?\n• 기술 스택이 어떻게 되나요?";
    }
    
    if (msg.match(/프로젝트|만든|개발|구현|결과물/)) {
      return "저는 주요 프로젝트로 경쟁사 분석을 4분으로 단축시키는 AI 시스템인 'Research Note Builder'와 마이크로 인플루언서의 높은 광고 효율을 입증한 '인스타그램 인플루언서 효율 분석'을 수행했습니다. 비즈니스 이면의 비효율을 진단하고, Python과 n8n 기반의 기술 스택으로 해결책을 도출하는 데 최적화되어 있습니다.";
    }

    if (msg.match(/경력|마케터|이전|과거|직장/)) {
      return "저는 소비재 브랜드에서 5년간 캠페인 집행 및 예산 성과를 분석하던 전문 마케터 출신입니다. 소비자의 행동 데이터를 비즈니스 관점에서 이해하는 탁월한 직관을 갖고 있으며, 이를 정량적인 데이터 분석가 스킬셋과 연결하기 위해 전환을 완료했습니다.";
    }

    if (msg.match(/기술|스택|도구|언어|파이썬|sql|tableau/)) {
      return "데이터 분석을 위해 Python (pandas, NumPy)과 SQL (BigQuery, MySQL)을 능숙하게 다루며, Tableau와 Power BI로 인터랙티브한 대시보드를 시각화합니다. 또한 n8n과 Gemini/ChatGPT API를 결합한 고효율 AI 업무 자동화 라인을 직접 빌드할 수 있는 독보적인 통합 역량을 보유하고 있습니다.";
    }

    if (msg.match(/강점|차별|왜|장점|특별/)) {
      return "저의 최대 차별점은 '현업 비즈니스 맥락(마케팅 5년)'과 '최첨단 AX 자동화 스킬(n8n, Python)'의 융합입니다. 단순 데이터 조회에 머물지 않고 현업 담당자들의 비효율을 직접 자동화하여 고부가가치 의사결정에 집중할 수 있는 인프라를 만듭니다.";
    }

    if (msg.match(/지원|동기|왜.*분석|관심/)) {
      return "5년간 마케팅 성과를 직접 모니터링하며, 직관에만 의존하기보다 데이터 속에서 명확한 ROI 개선 지점을 찾는 일에 큰 흥미를 갖게 되었습니다. 데이터를 비즈니스 성장 전략으로 변환시키는 정밀한 데이터 전문가가 되고자 데이터 분석가로 전향했습니다.";
    }

    if (msg.match(/연락|이메일|github|블로그|링크/)) {
      return "제 연락처는 jej744@email.com 이며, 깃허브 주소는 https://github.com/jej744 입니다. 포트폴리오 사이트는 https://jej744.github.io 입니다. 편하게 연락 부탁드립니다!";
    }

    // 기본 답변 규칙 (Fallback)
    return "질문해 주신 내용에 대해 더 자세한 안내가 필요하시다면 jej744@email.com으로 문의해 주세요. 신속하고 성실하게 답변을 드리도록 하겠습니다. 감사합니다.";
  }

  /**
   * 챗봇 이벤트 발생 시 분석 대시보드 데이터 그리드에 동적 저장 및 차트 갱신
   */
  function recordChatLog(question, answer) {
    if (!liveLogsBody) return;

    // 카테고리 실시간 자동 분류 (n8n 4번 노드 코드 모사)
    let category = '기타';
    const msg = question.toLowerCase();

    if (msg === '' || msg === 'init') {
      return; // 첫 인사 호출은 의미없는 로그 축적 방지를 위해 제외
    }

    if (msg.match(/프로젝트|만든|개발|구현|결과물/)) {
      category = '프로젝트';
    } else if (msg.match(/경력|마케터|이전|과거|직장/)) {
      category = '경력';
    } else if (msg.match(/기술|스택|도구|언어|파이썬|sql|tableau/)) {
      category = '기술';
    } else if (msg.match(/강점|차별|왜|장점|특별/)) {
      category = '강점';
    } else if (msg.match(/지원|동기|왜.*분석|관심/)) {
      category = '지원동기';
    } else if (msg.match(/연락|이메일|github|블로그|링크/)) {
      category = '연락처';
    } else if (msg.match(/안녕|하이|반가|시작/)) {
      category = '인사';
    }

    // 1. 카테고리 분포 카운터 추가
    const chartCat = ['프로젝트', '기술', '경력'].includes(category) ? category : '기타';
    categoriesCount[chartCat] = (categoriesCount[chartCat] || 0) + 1;
    totalChatsCount++;

    // 2. 대시보드 누적 질문수 갱신
    if (statsTotalChats) {
      statsTotalChats.textContent = totalChatsCount;
    }

    // 3. 최고 빈도 카테고리 계산 및 반영
    let topCat = '프로젝트';
    let maxVal = 0;
    Object.entries(categoriesCount).forEach(([cat, val]) => {
      if (val > maxVal) {
        maxVal = val;
        topCat = cat;
      }
    });
    if (statsTopCategory) {
      statsTopCategory.textContent = topCat;
    }

    // 4. SVG 도넛 차트 동적 업데이트
    updateDonutChart();

    // 5. 대시보드 그리드에 슬라이드 애니메이션과 함께 로그행 삽입
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    
    let catClass = 'cat-other';
    if (category === '프로젝트') catClass = 'cat-project';
    if (category === '기술') catClass = 'cat-tech';
    if (category === '경력') catClass = 'cat-career';

    const newRow = document.createElement('tr');
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(-10px)';
    newRow.style.transition = 'all 0.5s ease';

    newRow.innerHTML = `
      <td class="log-time">${timeStr}</td>
      <td><span class="log-cat ${catClass}">${category}</span></td>
      <td class="log-q">${escapeHTML(question)}</td>
      <td class="log-a" title="${escapeHTML(answer)}">${escapeHTML(answer)}</td>
    `;

    // 최상단 배치
    liveLogsBody.insertBefore(newRow, liveLogsBody.firstChild);
    
    // 리플로우 후 슬라이드인 효과 활성화
    setTimeout(() => {
      newRow.style.opacity = '1';
      newRow.style.transform = 'translateY(0)';
    }, 50);

    // 로그가 너무 많아지면 하단부 제거 (최대 10개 유지)
    if (liveLogsBody.children.length > 10) {
      liveLogsBody.removeChild(liveLogsBody.lastChild);
    }
  }

  function updateDonutChart() {
    const total = Object.values(categoriesCount).reduce((a, b) => a + b, 0);
    
    const pProj = (categoriesCount['프로젝트'] / total) * 100;
    const pTech = (categoriesCount['기술'] / total) * 100;
    const pCareer = (categoriesCount['경력'] / total) * 100;
    const pOther = (categoriesCount['기타'] / total) * 100;

    // SVG 서클 세그먼트 매핑
    const r = 40;
    const c = 2 * Math.PI * r; // 둘레 (약 251.32)

    const segProj = document.querySelector('.seg-project');
    const segTech = document.querySelector('.seg-tech');
    const segCareer = document.querySelector('.seg-career');
    const segOther = document.querySelector('.seg-other');

    if (!segProj) return;

    // 대시어레이 연산
    const dProj = (pProj / 100) * c;
    const dTech = (pTech / 100) * c;
    const dCareer = (pCareer / 100) * c;
    const dOther = (pOther / 100) * c;

    segProj.setAttribute('stroke-dasharray', `${dProj} ${c}`);
    
    segTech.setAttribute('stroke-dasharray', `${dTech} ${c}`);
    segTech.setAttribute('stroke-dashoffset', -dProj);

    segCareer.setAttribute('stroke-dasharray', `${dCareer} ${c}`);
    segCareer.setAttribute('stroke-dashoffset', -(dProj + dTech));

    segOther.setAttribute('stroke-dasharray', `${dOther} ${c}`);
    segOther.setAttribute('stroke-dashoffset', -(dProj + dTech + dCareer));

    // 퍼센트 텍스트 갱신
    const totalText = document.querySelector('.donut-total');
    if (totalText) {
      totalText.textContent = `Total: ${total}`;
    }

    // 범례의 퍼센트 수치도 실시간 갱신
    const legendItems = document.querySelectorAll('.legend-item');
    if (legendItems.length >= 4) {
      legendItems[0].innerHTML = `<span class="legend-dot" style="background: #5c6bc0"></span> 프로젝트 (${Math.round(pProj)}%)`;
      legendItems[1].innerHTML = `<span class="legend-dot" style="background: #00bfa5"></span> 기술 스택 (${Math.round(pTech)}%)`;
      legendItems[2].innerHTML = `<span class="legend-dot" style="background: #ff8f00"></span> 경력/도메인 (${Math.round(pCareer)}%)`;
      legendItems[3].innerHTML = `<span class="legend-dot" style="background: #8d6e63"></span> 기타 (${Math.round(pOther)}%)`;
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

});
