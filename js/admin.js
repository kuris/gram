/* ============================================================
   문법아 놀자! - 관리자 센터 스크립트 (admin.js)
   - 관리자 전용 권한 확인 (phiskim@gmail.com 및 Google 로그인)
   - 방문자 및 화면별 조회수, 접속 시간대 통계 분석
   - 회원 목록 및 최근 접속 현황 (Supabase service_members 연동)
   - 시험/퀴즈/모의고사 로그 및 영문법 콘텐츠 검색기
   - playhanja admin.js 구조 참고, gram 스키마에 맞춤
   ============================================================ */

document.addEventListener('DOMContentLoaded', async function () {
  var ADMIN_EMAIL = 'phiskim@gmail.com';
  var AUTH = window.GramAuth;
  var sb = function () { return window.sb || null; };
  var SERVICE = 'gram';

  var SERVICES = [
    { key: 'hanja',    name: '한자야 놀자!',   emoji: '漢', url: 'https://hanja.chatgpts.kr/admin' },
    { key: 'voca',     name: '단어야 놀자!',   emoji: '單', url: 'https://voca.chatgpts.kr/admin' },
    { key: 'gram',     name: '문법아 놀자!',   emoji: '文', url: 'https://gram.chatgpts.kr/admin' },
    { key: 'math',     name: '수학아 놀자!',   emoji: '數', url: 'https://math.chatgpts.kr/admin' },
    { key: 'science',  name: '과학아 놀자!',   emoji: '科', url: 'https://science.chatgpts.kr/admin' },
    { key: 'history',  name: '역사야 놀자!',   emoji: '史', url: 'https://history.chatgpts.kr/admin' },
    { key: 'fortune',  name: '운세야 놀자!',   emoji: '運', url: 'https://fortune.chatgpts.kr/admin' },
    { key: 'mindtest', name: '마인드테스트',   emoji: '心', url: 'https://mind.chatgpts.kr/admin' },
    { key: 'work',     name: '워크야 놀자!',   emoji: '職', url: 'https://work.chatgpts.kr/admin' },
    { key: 'money',    name: '머니야 놀자!',   emoji: '財', url: 'https://money.chatgpts.kr/admin' },
    { key: 'tools',    name: '문서야 놀자!',   emoji: '文', url: 'https://tools.chatgpts.kr/admin' }
  ];

  var loadingView = document.getElementById('admin-loading');
  var authView = document.getElementById('admin-auth-view');
  var deniedView = document.getElementById('admin-denied-view');
  var dashboardView = document.getElementById('admin-dashboard-view');
  var deniedEmailEl = document.getElementById('denied-user-email');
  var adminEmailBadge = document.getElementById('admin-current-email');

  var googleBtn = document.getElementById('admin-google-btn');
  var authMsg = document.getElementById('admin-auth-msg');

  var tabBtns = document.querySelectorAll('.admin-tab-btn');
  var tabPanels = document.querySelectorAll('.admin-tab-panel');

  var currentAdminUser = null;
  var cachedMembers = [];
  var cachedPageViews = [];
  var cachedQuizLogs = [];
  var cachedTotalCount = null;

  var selectedPeriod = 'all';
  var selectedTimeSlot = 'all';
  var selectedExactHour = null;

  function showMsg(text, type) {
    if (!authMsg) return;
    authMsg.className = 'admin-msg show ' + (type || 'info');
    authMsg.innerHTML = text;
  }

  // ---------- 1. 관리자 권한 확인 및 뷰 전환 ----------
  var currentAdminRole = null;

  async function fetchAdminRole(user) {
    if (!user || !sb()) return null;
    try {
      var r = await sb().schema('public')
        .from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (r.error) throw r.error;
      return (r.data && r.data.role) || null;
    } catch (e) {
      return null;
    }
  }

  async function checkAdminAccess(user) {
    if (loadingView) loadingView.style.display = 'none';
    if (!user) {
      if (authView) authView.style.display = 'block';
      if (deniedView) deniedView.style.display = 'none';
      if (dashboardView) dashboardView.style.display = 'none';
      return false;
    }
    currentAdminRole = await fetchAdminRole(user);
    var email = (user.email || '').toLowerCase().trim();
    if (currentAdminRole === 'admin' || email === ADMIN_EMAIL.toLowerCase()) {
      currentAdminUser = user;
      if (authView) authView.style.display = 'none';
      if (deniedView) deniedView.style.display = 'none';
      if (dashboardView) dashboardView.style.display = 'block';
      if (adminEmailBadge) adminEmailBadge.textContent = email;
      loadAllDashboardData();
      return true;
    } else {
      if (authView) authView.style.display = 'none';
      if (deniedView) deniedView.style.display = 'block';
      if (dashboardView) dashboardView.style.display = 'none';
      if (deniedEmailEl) deniedEmailEl.textContent = email;
      return false;
    }
  }

  if (googleBtn) {
    googleBtn.addEventListener('click', async function () {
      try {
        showMsg('Google 로그인 창으로 이동합니다...', 'info');
        var redirectUrl = location.origin + '/admin.html';
        await AUTH.signInWithGoogle(redirectUrl);
      } catch (err) {
        showMsg((err && err.message) || 'Google 로그인에 실패했습니다.', 'error');
      }
    });
  }

  document.querySelectorAll('.js-admin-logout').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      await AUTH.signOut();
      location.reload();
    });
  });

  var refreshBtn = document.getElementById('admin-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 갱신 중';
      loadAllDashboardData().finally(function () {
        setTimeout(function () {
          refreshBtn.disabled = false;
          refreshBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> 새로고침';
        }, 500);
      });
    });
  }

  // ---------- 서비스 전환 ----------
  function renderServiceSwitcher() {
    var menu = document.getElementById('admin-switch-menu');
    if (!menu) return;
    var items = SERVICES.map(function (s) {
      var isCurrent = s.key === SERVICE;
      if (isCurrent) {
        return '<div class="admin-switch-item is-current">' +
          '<span class="admin-switch-emoji">' + s.emoji + '</span><span>' +
          '<span class="admin-switch-name">' + escapeHtml(s.name) + '</span><br>' +
          '<span class="admin-switch-host">' + escapeHtml(s.url.replace('https://', '')) + '</span></span>' +
          '<span class="admin-switch-current-tag">현재 위치</span></div>';
      }
      return '<a class="admin-switch-item" href="' + s.url + '">' +
        '<span class="admin-switch-emoji">' + s.emoji + '</span><span>' +
        '<span class="admin-switch-name">' + escapeHtml(s.name) + '</span><br>' +
        '<span class="admin-switch-host">' + escapeHtml(s.url.replace('https://', '')) + '</span></span></a>';
    }).join('');
    menu.innerHTML = '<div class="admin-switch-menu-head">관리자 페이지 전환</div>' + items +
      '<div class="admin-switch-note">서비스마다 도메인이 다르므로, 이동한 사이트에서 관리자 로그인을 한 번 더 해야 할 수 있습니다.</div>';
    var wrap = document.getElementById('admin-switch');
    var btn = document.getElementById('admin-switch-btn');
    if (btn && wrap) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        wrap.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) wrap.classList.remove('open');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') wrap.classList.remove('open');
      });
    }
  }
  renderServiceSwitcher();

  // ---------- 탭 전환 ----------
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabPanels.forEach(function (p) { p.style.display = 'none'; });
      btn.classList.add('active');
      var activePanel = document.getElementById('panel-' + targetTab);
      if (activePanel) activePanel.style.display = 'block';
    });
  });
  setupFilters();

  // ---------- 대시보드 전체 데이터 로딩 ----------
  async function loadAllDashboardData() {
    await Promise.allSettled([
      loadTrafficAndAnalytics(),
      loadMembersData(),
      loadQuizLogs(),
      loadContentSummary()
    ]);
  }

  function gdb() {
    try {
      if (window.gramDb) return window.gramDb();
      if (window.sb && typeof window.sb.schema === 'function') return window.sb.schema('gram');
      return window.sb;
    } catch (e) { return window.sb; }
  }

  // ---------- [탭 1] 방문자 & 화면 조회수 ----------
  async function loadTrafficAndAnalytics() {
    var pvList = [];
    if (sb()) {
      try {
        var r = await gdb().from('page_views')
          .select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5000);
        if (!r.error && r.data && r.data.length > 0) {
          pvList = r.data;
          cachedTotalCount = r.count;
          cachedPageViews = r.data;
        }
      } catch (e) {}
    }
    applyTrafficFilters();
  }

  function setupFilters() {
    var periodPills = document.querySelectorAll('#admin-period-filter .admin-pill-btn');
    periodPills.forEach(function (btn) {
      btn.addEventListener('click', function () {
        periodPills.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        selectedPeriod = btn.getAttribute('data-period');
        selectedExactHour = null;
        applyTrafficFilters();
      });
    });
    var timeSlotPills = document.querySelectorAll('#admin-time-slot-filter .admin-pill-btn');
    timeSlotPills.forEach(function (btn) {
      btn.addEventListener('click', function () {
        timeSlotPills.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        selectedTimeSlot = btn.getAttribute('data-slot');
        selectedExactHour = null;
        applyTrafficFilters();
      });
    });
  }

  function applyTrafficFilters() {
    var today = new Date();
    var todayStr = today.toISOString().slice(0, 10);
    var localStats = getLocalPvStats();
    var filteredList = cachedPageViews.slice();
    if (selectedPeriod === 'today') {
      filteredList = filteredList.filter(function (r) { return (r.day || (r.created_at || '').slice(0, 10)) === todayStr; });
    } else if (selectedPeriod === 'week') {
      var seven = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      filteredList = filteredList.filter(function (r) { return (r.day || (r.created_at || '').slice(0, 10)) >= seven; });
    } else if (selectedPeriod === 'month') {
      var thirty = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      filteredList = filteredList.filter(function (r) { return (r.day || (r.created_at || '').slice(0, 10)) >= thirty; });
    }
    if (selectedExactHour !== null) {
      filteredList = filteredList.filter(function (r) { return Number(r.hour) === selectedExactHour; });
    } else if (selectedTimeSlot === 'morning') {
      filteredList = filteredList.filter(function (r) { return Number(r.hour) >= 6 && Number(r.hour) < 12; });
    } else if (selectedTimeSlot === 'afternoon') {
      filteredList = filteredList.filter(function (r) { return Number(r.hour) >= 12 && Number(r.hour) < 18; });
    } else if (selectedTimeSlot === 'evening') {
      filteredList = filteredList.filter(function (r) { return Number(r.hour) >= 18 && Number(r.hour) < 24; });
    } else if (selectedTimeSlot === 'night') {
      filteredList = filteredList.filter(function (r) { return Number(r.hour) >= 0 && Number(r.hour) < 6; });
    }
    updateFilterSummaryText(filteredList.length);
    var isAll = selectedPeriod === 'all' && selectedTimeSlot === 'all' && selectedExactHour === null;
    var countToUse = isAll && cachedTotalCount != null ? cachedTotalCount : filteredList.length;
    renderTrafficAnalytics(filteredList, localStats, countToUse);
  }

  function updateFilterSummaryText(count) {
    var summaryEl = document.getElementById('admin-filter-summary');
    if (!summaryEl) return;
    var periodNames = { all: '전체 누적', month: '최근 30일(월간)', week: '최근 7일(주간)', today: '오늘 당일' };
    var slotNames = { all: '전 시간대', morning: '아침(06~12시)', afternoon: '오후(12~18시)', evening: '저녁/밤(18~24시)', night: '새벽(00~06시)' };
    var label = '[' + (periodNames[selectedPeriod] || '전체') + ']';
    if (selectedExactHour !== null) label += ' · [' + selectedExactHour + '시 정밀 조회]';
    else if (selectedTimeSlot !== 'all') label += ' · [' + slotNames[selectedTimeSlot] + ']';
    label += ' 조건 필터링 결과: 총 ' + count.toLocaleString() + '회 조회';
    if (selectedExactHour !== null) label += ' (시간대 막대를 다시 누르면 필터가 해제됩니다)';
    summaryEl.textContent = label;
  }

  function getLocalPvStats() {
    try {
      return JSON.parse(localStorage.getItem('gram_local_pv_stats') || '{"pages":{},"hours":{},"days":{},"recent":[]}');
    } catch (e) {
      return { pages: {}, hours: {}, days: {}, recent: [] };
    }
  }

  function pageTitleOf(path) {
    var map = {
      'index.html': '🏠 홈 메인',
      'concepts.html': '📖 개념 보기',
      'concept-view.html': '📖 개념 상세',
      'practice.html': '✏️ 문제 풀기',
      'quiz.html': '🧩 오늘의 퀴즈',
      'mock.html': '🏆 GTELP 모의고사',
      'worksheet.html': '📄 학습지 만들기',
      'progress.html': '🗺️ 내 진도',
      'stats.html': '📈 학습 통계',
      'login.html': '👤 로그인 & 내 기록'
    };
    return map[path] || path;
  }

  function renderTrafficAnalytics(pvList, localStats, serverTotalCount) {
    var todayStr = new Date().toISOString().slice(0, 10);
    var pagesMap = {};
    var hoursMap = [];
    var daysMap = {};
    var totalPv = 0, todayPv = 0, i;
    for (i = 0; i < 24; i++) hoursMap.push(0);
    if (pvList.length > 0) {
      totalPv = serverTotalCount != null ? serverTotalCount : pvList.length;
      pvList.forEach(function (r) {
        var p = (r.path || '').replace(/^\//, '') || 'index.html';
        var title = r.page_title || p;
        if (!pagesMap[p]) pagesMap[p] = { path: p, title: title, count: 0 };
        pagesMap[p].count++;
        var h = Number(r.hour);
        if (!isNaN(h) && h >= 0 && h < 24) hoursMap[h]++;
        var day = (r.day || (r.created_at || '').slice(0, 10)) || todayStr;
        daysMap[day] = (daysMap[day] || 0) + 1;
        if (day === todayStr) todayPv++;
      });
    } else {
      var pObj = localStats.pages || {};
      for (var p in pObj) {
        if (!Object.prototype.hasOwnProperty.call(pObj, p)) continue;
        pagesMap[p] = { path: p, title: pageTitleOf(p), count: pObj[p] };
        totalPv += pObj[p];
      }
      var hObj = localStats.hours || {};
      for (i = 0; i < 24; i++) hoursMap[i] = hObj[i] || 0;
      var dObj = localStats.days || {};
      for (var d in dObj) {
        if (!Object.prototype.hasOwnProperty.call(dObj, d)) continue;
        daysMap[d] = dObj[d];
      }
      todayPv = (localStats.days && localStats.days[todayStr]) || 0;
    }
    var el1 = document.getElementById('stat-total-pv');
    if (el1) el1.textContent = totalPv.toLocaleString() + '회';
    var el2 = document.getElementById('stat-today-pv');
    if (el2) el2.textContent = todayPv.toLocaleString() + '회';
    var maxHour = 0, maxHourVal = 0;
    hoursMap.forEach(function (val, h) {
      if (val > maxHourVal) { maxHourVal = val; maxHour = h; }
    });
    var peakEl = document.getElementById('stat-peak-hour');
    if (peakEl) {
      peakEl.textContent = maxHourVal > 0
        ? (String(maxHour).padStart(2, '0') + '시 ~ ' + String((maxHour + 1) % 24).padStart(2, '0') + '시')
        : '데이터 없음';
    }
    renderHourlyChart(hoursMap, maxHourVal);
    renderDailyChart(daysMap);
    var pages = Object.keys(pagesMap).map(function (k) { return pagesMap[k]; });
    renderPageRanking(pages, totalPv);
    renderRecentVisits(pvList, localStats.recent || []);
  }

  function renderHourlyChart(hoursMap, maxVal) {
    var chartEl = document.getElementById('admin-hourly-chart');
    if (!chartEl) return;
    var safeMax = Math.max(maxVal, 1);
    chartEl.innerHTML = hoursMap.map(function (cnt, h) {
      var pct = Math.max(4, Math.round((cnt / safeMax) * 100));
      var isPeak = cnt === maxVal && maxVal > 0;
      var isSelected = selectedExactHour === h;
      return '<div class="admin-hour-bar-wrap" title="' + h + '시: ' + cnt + '회 조회 (클릭하여 이 시간대만 필터링)">' +
        '<span class="admin-hour-count">' + (cnt > 0 ? cnt : '') + '</span>' +
        '<div class="admin-hour-bar' + (isPeak ? ' is-peak' : '') + (isSelected ? ' is-selected' : '') + '"' +
        ' data-hour="' + h + '" style="height:' + pct + '%;"></div>' +
        '<span class="admin-hour-label">' + h + '</span></div>';
    }).join('');
    chartEl.querySelectorAll('.admin-hour-bar').forEach(function (bar) {
      bar.addEventListener('click', function () {
        var h = Number(bar.getAttribute('data-hour'));
        selectedExactHour = (selectedExactHour === h) ? null : h;
        applyTrafficFilters();
      });
    });
  }

  function renderDailyChart(daysMap) {
    var el = document.getElementById('admin-daily-chart');
    if (!el) return;
    var sortedDays = Object.keys(daysMap).sort().reverse().slice(0, 14);
    if (sortedDays.length === 0) {
      el.innerHTML = '<p style="color:#64748b;font-size:.86rem;margin:6px 0;">아직 일자별 누적 데이터가 없습니다. (page_views 테이블 생성 후 기록됩니다)</p>';
      return;
    }
    var maxVal = Math.max.apply(null, sortedDays.map(function (d) { return daysMap[d]; }).concat([1]));
    var todayStr = new Date().toISOString().slice(0, 10);
    el.innerHTML = sortedDays.map(function (d) {
      var cnt = daysMap[d];
      var pct = Math.max(5, Math.round((cnt / maxVal) * 100));
      var isToday = d === todayStr;
      return '<div style="display:flex;align-items:center;gap:12px;font-size:.88rem;">' +
        '<span style="min-width:96px;font-weight:' + (isToday ? '800' : '600') + ';color:' + (isToday ? '#dc2626' : '#334155') + ';">' + d +
        (isToday ? ' <small style="background:#fee2e2;color:#b91c1c;padding:1px 6px;border-radius:999px;font-size:.7rem;margin-left:2px;">오늘</small>' : '') + '</span>' +
        '<div style="flex:1;height:12px;background:#f1f5f9;border-radius:999px;overflow:hidden;">' +
        '<div style="width:' + pct + '%;height:100%;background:' + (isToday ? '#10b981' : '#0284c7') + ';border-radius:999px;"></div></div>' +
        '<span style="min-width:60px;text-align:right;font-weight:800;color:#0f172a;">' + cnt.toLocaleString() + '회</span></div>';
    }).join('');
  }

  function renderPageRanking(pages, totalPv) {
    var listEl = document.getElementById('admin-page-ranking');
    if (!listEl) return;
    pages.sort(function (a, b) { return b.count - a.count; });
    if (pages.length === 0) {
      listEl.innerHTML = '<p class="text-soft">아직 수집된 페이지뷰 데이터가 없습니다.</p>';
      return;
    }
    listEl.innerHTML = pages.slice(0, 10).map(function (p, idx) {
      var share = totalPv > 0 ? Math.round((p.count / totalPv) * 100) : 0;
      return '<div class="admin-page-rank-item"><span class="admin-rank-num">' + (idx + 1) + '</span>' +
        '<div class="admin-rank-info"><div class="admin-rank-title">' + escapeHtml(pageTitleOf(p.path)) + '</div>' +
        '<div class="admin-rank-path">/' + escapeHtml(p.path) + '</div></div>' +
        '<div class="admin-rank-bar-bg" title="점유율 ' + share + '%"><div class="admin-rank-bar-fill" style="width:' + share + '%;"></div></div>' +
        '<span class="admin-rank-val">' + p.count + '회 <small style="color:#64748b;font-weight:400;">(' + share + '%)</small></span></div>';
    }).join('');
  }

  function renderRecentVisits(pvList, localRecent) {
    var feedEl = document.getElementById('admin-recent-visits');
    if (!feedEl) return;
    var items = [];
    if (pvList && pvList.length > 0) {
      items = pvList.slice(0, 15).map(function (r) {
        return { path: (r.path || '').replace(/^\//, ''), title: r.page_title || r.path, time: r.created_at };
      });
    } else {
      items = (localRecent || []).slice(0, 15);
    }
    if (items.length === 0) {
      feedEl.innerHTML = '<p class="text-soft">최근 방문 내역이 없습니다.</p>';
      return;
    }
    feedEl.innerHTML = items.map(function (item) {
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid #f1f5f9;font-size:.86rem;">' +
        '<div><strong>' + escapeHtml(pageTitleOf(item.path)) + '</strong>' +
        '<span style="color:#94a3b8;margin-left:6px;font-size:.78rem;">/' + escapeHtml(item.path) + '</span></div>' +
        '<span style="color:#64748b;font-size:.78rem;">' + escapeHtml(formatTimeAgo(item.time)) + '</span></div>';
    }).join('');
  }

  // ---------- [탭 2] 회원 및 접속 현황 ----------
  async function loadMembersData() {
    if (!sb()) { renderMembersTable([]); return; }
    try {
      var r = await sb().schema('public').from('service_members')
        .select('*').eq('service', 'gram')
        .order('last_seen_at', { ascending: false, nullsFirst: false });
      if (r.error) throw r.error;
      cachedMembers = r.data || [];
      renderMembersTable(cachedMembers);
    } catch (e) {
      renderMembersTable(cachedMembers);
    }
  }

  function renderMembersTable(members) {
    var tbody = document.getElementById('admin-members-tbody');
    var totalCountEl = document.getElementById('stat-total-users');
    var activeTodayEl = document.getElementById('stat-active-today');
    var active7DaysEl = document.getElementById('stat-active-week');
    var total = members.length, activeToday = 0, active7Days = 0;
    var now = Date.now(), oneDay = 24 * 60 * 60 * 1000, sevenDays = 7 * oneDay;
    members.forEach(function (m) {
      if (m.last_seen_at) {
        var diff = now - new Date(m.last_seen_at).getTime();
        if (diff <= oneDay) activeToday++;
        if (diff <= sevenDays) active7Days++;
      }
    });
    if (totalCountEl) totalCountEl.textContent = total.toLocaleString() + '명';
    if (activeTodayEl) activeTodayEl.textContent = activeToday.toLocaleString() + '명';
    if (active7DaysEl) active7DaysEl.textContent = active7Days.toLocaleString() + '명';
    if (!tbody) return;
    if (members.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:26px;color:#64748b;">등록된 회원이 없거나 Supabase RLS 정책 설정이 필요합니다.<br><small style="color:#94a3b8;">(아래 \'시스템 정보 & SQL\' 탭의 안내를 참고해 주세요)</small></td></tr>';
      return;
    }
    tbody.innerHTML = members.map(function (m) {
      var isAdm = m.role === 'admin';
      var statusBadge = m.status === 'suspended'
        ? '<span class="admin-badge admin-badge-danger">정지됨</span>'
        : '<span class="admin-badge admin-badge-success">정상 활성</span>';
      var roleBadge = isAdm
        ? '<span class="admin-badge admin-badge-warning"><i class="fa-solid fa-crown"></i> 관리자</span>'
        : '<span class="admin-badge admin-badge-gray">일반회원</span>';
      var shortId = (m.user_id || '').slice(0, 8) + '...';
      return '<tr><td><strong>' + escapeHtml(m.nickname || '익명') + '</strong>' + (isAdm ? ' 👑' : '') + '</td>' +
        '<td style="font-family:monospace;font-size:.8rem;color:#64748b;" title="' + escapeHtml(m.user_id || '') + '">' + escapeHtml(shortId) + '</td>' +
        '<td>' + statusBadge + '</td><td>' + roleBadge + '</td>' +
        '<td><span title="' + escapeHtml(m.joined_at || m.created_at || '') + '">' + escapeHtml(formatTimeAgo(m.joined_at || m.created_at)) + '</span></td>' +
        '<td><span title="' + escapeHtml(m.last_seen_at || '') + '">' + escapeHtml(m.last_seen_at ? formatTimeAgo(m.last_seen_at) : '접속 기록 없음') + '</span></td></tr>';
    }).join('');
  }

  var memberSearchInput = document.getElementById('admin-member-search');
  if (memberSearchInput) {
    memberSearchInput.addEventListener('input', function (e) {
      var q = e.target.value.toLowerCase().trim();
      var filtered = cachedMembers.filter(function (m) {
        return (m.nickname || '').toLowerCase().indexOf(q) !== -1 || (m.user_id || '').toLowerCase().indexOf(q) !== -1;
      });
      renderMembersTable(filtered);
    });
  }

  // ---------- [탭 3] 시험 & 학습 활동 로그 ----------
  var QUIZ_TYPE_LABEL = { gtelp_mock: '🏆 GTELP 모의고사', mixed: '🧩 종합 퀴즈', concept: '📖 개념 퀴즈', blank: '✏️ 빈칸 퀴즈', confusing: '🔀 헷갈림 퀴즈' };

  async function loadQuizLogs() {
    if (!sb()) { renderQuizLogs([]); renderStudyLog([]); return; }
    try {
      var r = await gdb().from('quiz_results')
        .select('*').order('created_at', { ascending: false }).limit(50);
      if (r.error) throw r.error;
      cachedQuizLogs = r.data || [];
      renderQuizLogs(cachedQuizLogs);
    } catch (e) {
      renderQuizLogs([]);
    }
    try {
      var s = await gdb().from('study_log')
        .select('*').order('created_at', { ascending: false }).limit(20);
      renderStudyLog(!s.error ? (s.data || []) : []);
    } catch (e) {
      renderStudyLog([]);
    }
  }

  function renderQuizLogs(logs) {
    var tbody = document.getElementById('admin-quiz-tbody');
    var totalCountEl = document.getElementById('stat-total-quizzes');
    var avgScoreEl = document.getElementById('stat-avg-score');
    var mockCountEl = document.getElementById('stat-mock-count');
    if (totalCountEl) totalCountEl.textContent = logs.length.toLocaleString() + '건';
    if (logs.length > 0 && avgScoreEl) {
      var avg = Math.round(logs.reduce(function (a, c) { return a + (c.score || 0); }, 0) / logs.length);
      avgScoreEl.textContent = avg + '점';
    }
    if (mockCountEl) {
      var mocks = logs.filter(function (q) { return q.quiz_type === 'gtelp_mock'; }).length;
      mockCountEl.textContent = mocks.toLocaleString() + '건';
    }
    if (!tbody) return;
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:26px;color:#64748b;">최근 응시된 시험 기록이 없습니다. (RLS 범위 내 본인 기록만 보입니다)</td></tr>';
      return;
    }
    tbody.innerHTML = logs.map(function (q) {
      var modeLabel = QUIZ_TYPE_LABEL[q.quiz_type] || escapeHtml(q.quiz_type || '퀴즈');
      var schoolLabel = window.GramPlayData ? window.GramPlayData.schoolLabel(q.school_level) : (q.school_level || '—');
      var score = q.score != null ? q.score : 0;
      var passBadge = score >= 75
        ? '<span class="admin-badge admin-badge-success">Mastery (' + score + '점)</span>'
        : '<span class="admin-badge admin-badge-danger">' + score + '점</span>';
      return '<tr><td><span title="' + escapeHtml(q.created_at || '') + '">' + escapeHtml(formatTimeAgo(q.created_at)) + '</span></td>' +
        '<td><strong>' + modeLabel + '</strong></td><td>' + escapeHtml(schoolLabel) + '</td>' +
        '<td>' + (q.correct_count != null ? q.correct_count : '—') + ' / ' + (q.total_questions != null ? q.total_questions : '—') + '</td>' +
        '<td>' + passBadge + '</td><td>' + (q.total_questions != null ? q.total_questions : '—') + '문항</td></tr>';
    }).join('');
  }

  function renderStudyLog(logs) {
    var box = document.getElementById('admin-study-log');
    if (!box) return;
    if (!logs.length) {
      box.innerHTML = '<p class="text-soft">최근 학습 활동이 없습니다.</p>';
      return;
    }
    box.innerHTML = logs.map(function (l) {
      return '<div class="dash-hist-row"><span>' + escapeHtml(l.activity_type || '-') + ' · ' +
        escapeHtml(l.category || l.school_level || '-') + '</span>' +
        '<span class="muted">' + escapeHtml(String(l.created_at || '').slice(0, 16).replace('T', ' ')) + '</span></div>';
    }).join('');
  }

  // ---------- [탭 4] 콘텐츠 현황 & 영문법 검색기 ----------
  function loadContentSummary() {
    var concepts = window.GramConceptData || [];
    var problems = window.GramProblemData || [];
    var rules = window.GramRuleData || [];
    var examples = window.GramExampleData || [];
    var cc = document.getElementById('stat-content-concept');
    if (cc) cc.textContent = concepts.length + '개';
    var pc = document.getElementById('stat-content-problem');
    if (pc) pc.textContent = problems.length + '문제';
    var rc = document.getElementById('stat-content-rule');
    if (rc) rc.textContent = rules.length + '개';
    var ec = document.getElementById('stat-content-example');
    if (ec) ec.textContent = examples.length + '개';

    var searchInput = document.getElementById('admin-gram-query');
    var searchBtn = document.getElementById('admin-gram-search-btn');
    var searchResult = document.getElementById('admin-gram-result');

    function searchGram() {
      var q = (searchInput.value || '').trim().toLowerCase();
      if (!q) { searchResult.innerHTML = ''; return; }
      var hitC = concepts.filter(function (c) {
        return (c.title + ' ' + c.unit + ' ' + c.shortDescription + ' ' + c.memoryTip).toLowerCase().indexOf(q) !== -1;
      }).slice(0, 8);
      var hitP = problems.filter(function (p) {
        return (p.question + ' ' + p.answer).toLowerCase().indexOf(q) !== -1;
      }).slice(0, 5);
      var hitR = rules.filter(function (r) {
        return (r.pair + ' ' + r.correct + ' ' + r.explain).toLowerCase().indexOf(q) !== -1;
      }).slice(0, 5);
      var hitE = examples.filter(function (e) {
        return (e.en + ' ' + e.ko).toLowerCase().indexOf(q) !== -1;
      }).slice(0, 5);
      var total = hitC.length + hitP.length + hitR.length + hitE.length;
      if (!total) {
        searchResult.innerHTML = '<div class="admin-callout"><p>“<strong>' + escapeHtml(searchInput.value) + '</strong>” 관련 데이터를 찾지 못했습니다.</p></div>';
        return;
      }
      var html = '<div style="background:#fff;border:2px solid #e2e8f0;border-radius:18px;padding:20px;margin-top:14px;">' +
        '<p style="font-weight:900;margin-top:0;">🔍 검색 결과 총 ' + total + '건</p>';
      if (hitC.length) {
        html += '<h4 style="margin:12px 0 6px;">📖 개념 (' + hitC.length + ')</h4><ul style="margin:0;padding-left:20px;font-size:.88rem;line-height:1.7;">' +
          hitC.map(function (c) {
            return '<li><a href="concept-view.html?id=' + encodeURIComponent(c.id) + '" target="_blank"><strong>' + escapeHtml(c.title) + '</strong></a> <small style="color:#64748b;">' + escapeHtml(c.unit) + ' · ' + escapeHtml(c.shortDescription.slice(0, 40)) + '…</small></li>';
          }).join('') + '</ul>';
      }
      if (hitP.length) {
        html += '<h4 style="margin:12px 0 6px;">✏️ 문제 (' + hitP.length + ')</h4><ul style="margin:0;padding-left:20px;font-size:.88rem;line-height:1.7;">' +
          hitP.map(function (p) {
            return '<li>' + escapeHtml(p.question.slice(0, 60)) + '… → <strong>' + escapeHtml(p.answer) + '</strong></li>';
          }).join('') + '</ul>';
      }
      if (hitR.length) {
        html += '<h4 style="margin:12px 0 6px;">🔀 헷갈리는 표현 (' + hitR.length + ')</h4><ul style="margin:0;padding-left:20px;font-size:.88rem;line-height:1.7;">' +
          hitR.map(function (r) {
            return '<li><strong>' + escapeHtml(r.pair) + '</strong> → ' + escapeHtml(r.correct) + ' <small style="color:#64748b;">' + escapeHtml(r.explain.slice(0, 40)) + '…</small></li>';
          }).join('') + '</ul>';
      }
      if (hitE.length) {
        html += '<h4 style="margin:12px 0 6px;">💬 예문 (' + hitE.length + ')</h4><ul style="margin:0;padding-left:20px;font-size:.88rem;line-height:1.7;">' +
          hitE.map(function (e) {
            return '<li>' + escapeHtml(e.en) + '<br><small style="color:#64748b;">' + escapeHtml(e.ko) + '</small></li>';
          }).join('') + '</ul>';
      }
      searchResult.innerHTML = html + '</div>';
    }
    if (searchBtn) searchBtn.addEventListener('click', searchGram);
    if (searchInput) searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') searchGram(); });
  }

  // ---------- 유틸리티 ----------
  function formatTimeAgo(isoString) {
    if (!isoString) return '—';
    var d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    var diff = Date.now() - d.getTime();
    var min = Math.floor(diff / 60000);
    if (min < 1) return '방금 전';
    if (min < 60) return min + '분 전';
    var hr = Math.floor(min / 60);
    if (hr < 24) return hr + '시간 전';
    var days = Math.floor(hr / 24);
    if (days < 7) return days + '일 전';
    return d.toISOString().slice(0, 10);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var copySqlBtn = document.getElementById('admin-copy-sql');
  if (copySqlBtn) {
    copySqlBtn.addEventListener('click', function () {
      var code = document.getElementById('admin-sql-code').textContent;
      navigator.clipboard.writeText(code).then(function () {
        copySqlBtn.textContent = '복사 완료! ✓';
        setTimeout(function () { copySqlBtn.textContent = 'SQL 복사'; }, 2000);
      });
    });
  }

  // ---------- 초기 실행 ----------
  var waited = 0;
  var interval = setInterval(function () {
    waited += 100;
    var user = AUTH && AUTH.getUser ? AUTH.getUser() : null;
    if (user || waited >= 800) {
      clearInterval(interval);
      checkAdminAccess(user);
    }
  }, 100);

  document.addEventListener('gram:auth-changed', function (e) {
    checkAdminAccess(e.detail && e.detail.user);
  });
});
