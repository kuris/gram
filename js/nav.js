/* ============================================================
   문법아 놀자! - 공통 상단 내비게이션 (science nav.js 참고)
   - 헤더 로그인 슬롯은 .auth-box 1개만 사용합니다.
   ============================================================ */
(function () {
  var MENU = [
    { label: '홈', href: 'index.html', icon: '🏠' },
    {
      label: '배우기', icon: '📚',
      children: [
        { label: '개념 보기', href: 'concepts.html', icon: '📖', desc: '초등·중등·고등 문법 개념 정리' },
        { label: '헷갈리는 표현', href: 'concepts.html?cat=spelling', icon: '🤔', desc: '되/돼, 안/않 등 자주 틀리는 말' },
        { label: '학습지 만들기', href: 'worksheet.html', icon: '📄', desc: 'A4 인쇄용 문제지' }
      ]
    },
    {
      label: '풀기', icon: '✏️',
      children: [
        { label: '문제 풀기', href: 'practice.html', icon: '✏️', desc: '개념별·과정별 연습' },
        { label: '오늘의 퀴즈', href: 'quiz.html', icon: '🧩', desc: '매일 바뀌는 5문제' },
        { label: 'GTELP 모의고사', href: 'mock.html', icon: '🏆', desc: '문법 26문항/20분 실전' }
      ]
    },
    { label: '내 진도', href: 'progress.html', icon: '🗺️' },
    { label: '통계', href: 'stats.html', icon: '📈' }
  ];

  var FAMILY = [
    { icon: '📖', label: '한자야 놀자', href: 'https://hanja.chatgpts.kr' },
    { icon: '🔢', label: '수학아 놀자', href: 'https://math.chatgpts.kr' },
    { icon: '🔬', label: '과학아 놀자', href: 'https://science.chatgpts.kr' },
    { icon: '⚡', label: '단어야 놀자', href: 'https://voca.chatgpts.kr' },
    { icon: '📜', label: '역사야 놀자', href: 'https://history.chatgpts.kr' },
    { icon: '🏠', label: 'chatgpts.kr', href: 'https://chatgpts.kr' }
  ];

  function currentFile() {
    var f = (location.pathname.split('/').pop() || 'index.html');
    return f === '' ? 'index.html' : f.split('?')[0];
  }
  function here() { return currentFile(); }

  function buildDesktop(h) {
    var html = MENU.map(function (item) {
      if (!item.children) {
        return '<li><a href="' + item.href + '"' + (item.href === h ? ' class="active"' : '') + '>' + item.icon + ' ' + item.label + '</a></li>';
      }
      var active = item.children.some(function (c) { return c.href.split('?')[0] === h; });
      return '<li class="nav-group"><button class="nav-group-btn' + (active ? ' active' : '') + '" aria-expanded="false">' +
        item.icon + ' ' + item.label + ' <i class="fa-solid fa-chevron-down"></i></button>' +
        '<div class="nav-dropdown">' + item.children.map(function (c) {
          return '<a href="' + c.href + '" class="' + (c.href.split('?')[0] === h ? 'current' : '') + '"><span class="nd-icon">' + c.icon +
            '</span><span class="nd-body"><strong>' + c.label + '</strong><small>' + (c.desc || '') + '</small></span></a>';
        }).join('') + '</div></li>';
    }).join('');
    html += '<li class="nav-family-item"><div class="family-nav-wrap"><button type="button" class="family-btn" id="family-btn" aria-expanded="false" aria-haspopup="true">다른 놀자 서비스 <span style="font-size:10px;margin-left:2px;">▾</span></button>' +
      '<div class="family-dropdown" id="family-dropdown" role="menu">' +
      FAMILY.map(function (s) {
        return '<a href="' + s.href + '" target="_blank" rel="noopener" role="menuitem"><span>' + s.icon + '</span> <span>' + s.label + '</span></a>';
      }).join('') +
      '</div></div></li>';
    return html;
  }

  function buildMobile(h) {
    var html = MENU.map(function (item) {
      if (!item.children) return '<li><a href="' + item.href + '"' + (item.href === h ? ' class="active"' : '') + '>' + item.icon + ' ' + item.label + '</a></li>';
      return '<li class="m-group"><span class="m-group-title">' + item.icon + ' ' + item.label + '</span><ul class="m-sub">' +
        item.children.map(function (c) { return '<li><a href="' + c.href + '"' + (c.href.split('?')[0] === h ? ' class="active"' : '') + '>' + c.icon + ' ' + c.label + '</a></li>'; }).join('') + '</ul></li>';
    }).join('');
    html += '<li class="m-group" style="border-top:2px solid rgba(13,148,136,.25);margin-top:10px;padding-top:10px;"><span class="m-group-title" style="color:#0d9488;font-weight:800;">🎡 다른 놀자 서비스</span><ul class="m-sub">' +
      FAMILY.map(function (s) {
        return '<li><a href="' + s.href + '" target="_blank" rel="noopener">' + s.icon + ' ' + s.label + '</a></li>';
      }).join('') + '</ul></li>';
    return html;
  }

  function initNav() {
    var navToggle = document.getElementById('nav-toggle');
    var mainNav = document.getElementById('main-nav');
    if (!navToggle || !mainNav) return;
    var h = here();
    mainNav.innerHTML = '<ul class="nav-desktop">' + buildDesktop(h) + '</ul><ul class="nav-mobile">' + buildMobile(h) + '</ul>';
    var icon = navToggle.querySelector('i');
    function closeAllDropdowns() {
      var fd = document.getElementById('family-dropdown');
      if (fd) fd.classList.remove('show');
      mainNav.querySelectorAll('.nav-group.open').forEach(function (g) { g.classList.remove('open'); });
    }
    function openNav() { mainNav.classList.add('open'); document.body.classList.add('nav-open'); if (icon) icon.className = 'fa-solid fa-xmark'; }
    function closeNav() { mainNav.classList.remove('open'); document.body.classList.remove('nav-open'); if (icon) icon.className = 'fa-solid fa-bars'; closeAllDropdowns(); }
    navToggle.addEventListener('click', function (e) { e.stopPropagation(); mainNav.classList.contains('open') ? closeNav() : openNav(); });
    var familyBtn = document.getElementById('family-btn');
    var familyDropdown = document.getElementById('family-dropdown');
    if (familyBtn && familyDropdown) {
      familyBtn.addEventListener('click', function (e) { e.stopPropagation(); closeAllDropdowns(); familyDropdown.classList.toggle('show'); });
      document.addEventListener('click', function () { familyDropdown.classList.remove('show'); });
    }
    mainNav.querySelectorAll('.nav-group-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var group = btn.closest('.nav-group');
        var wasOpen = group.classList.contains('open');
        closeAllDropdowns();
        if (!wasOpen) group.classList.add('open');
      });
    });
    mainNav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAllDropdowns(); closeNav(); } });
    window.addEventListener('resize', function () { if (!window.matchMedia('(max-width: 1024px)').matches) closeNav(); });
  }

  function trackPageView() {
    try {
      var f = here();
      if (f === 'admin.html') return;
      var STATS_KEY = 'gram_local_pv_stats';
      var stats = JSON.parse(localStorage.getItem(STATS_KEY) || '{"pages":{},"recent":[]}');
      stats.pages[f] = (stats.pages[f] || 0) + 1;
      stats.recent = (stats.recent || []).slice(0, 29);
      stats.recent.unshift({ path: f, time: new Date().toISOString() });
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initNav(); trackPageView(); });
  else { initNav(); trackPageView(); }
})();
