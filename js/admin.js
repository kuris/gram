/* 문법아 놀자! - admin.html 최소 관리자 패널 (phiskim@gmail.com 폴백) */
(function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  var loading = document.getElementById('admin-loading');
  var authView = document.getElementById('admin-auth-view');
  var deniedView = document.getElementById('admin-denied-view');
  var dashView = document.getElementById('admin-dashboard-view');
  if (!loading) return;

  function show(el) { [authView, deniedView, dashView].forEach(function (v) { if (v) v.style.display = 'none'; }); if (el) el.style.display = 'block'; loading.style.display = 'none'; }

  var googleBtn = document.getElementById('admin-google-btn');
  if (googleBtn) googleBtn.addEventListener('click', function () {
    if (window.GramAuth) window.GramAuth.signInWithGoogle(location.origin + location.pathname);
  });
  document.querySelectorAll('.js-admin-logout').forEach(function (b) {
    b.addEventListener('click', async function () { if (window.GramAuth) await window.GramAuth.signOut(); location.reload(); });
  });

  async function check() {
    await new Promise(function (r) { setTimeout(r, 800); });
    if (window.CGAuth && window.CGAuth.ready) { try { await window.CGAuth.ready(); } catch (e) {} }
    var isAdmin = window.GramAuth && window.GramAuth.isAdmin();
    var user = window.GramAuth && window.GramAuth.getUser();
    if (!user) { show(authView); return; }
    if (!isAdmin) {
      var em = document.getElementById('denied-user-email');
      if (em) em.textContent = user.email || '';
      show(deniedView);
      return;
    }
    show(dashView);
    loadStats();
  }

  async function loadStats() {
    var box = document.getElementById('admin-stats');
    if (!box) return;
    var db = window.gramDb ? window.gramDb() : null;
    if (!db) { box.innerHTML = '<p class="muted">Supabase 연결 없음 - 로컬 모드예요.</p>'; return; }
    try {
      var tables = ['concept_progress', 'quiz_results', 'study_log', 'wrong_notes'];
      var rows = await Promise.all(tables.map(async function (t) {
        try {
          var r = await db.from(t).select('id', { count: 'exact', head: true });
          if (r && r.error) return { t: t, n: '오류', err: r.error.message || r.error.code || '조회 실패' };
          return { t: t, n: (r && r.count != null) ? r.count : '?' };
        } catch (e) { return { t: t, n: '연결 실패', err: (e && e.message) || '' }; }
      }));
      var recent = [];
      var recentErr = '';
      try {
        var q = await db.from('study_log').select('*').order('created_at', { ascending: false }).limit(10);
        if (q && q.error) recentErr = q.error.message || q.error.code || '조회 실패';
        else recent = (q && q.data) || [];
      } catch (e) { recentErr = (e && e.message) || '조회 실패'; }
      box.innerHTML = '<div class="stat-grid">' + rows.map(function (r) {
        return '<div class="stat-card"><strong>' + esc(r.n) + '</strong><span>' + esc(r.t) + '</span>' +
          (r.err ? '<small style="color:#dc2626;">' + esc(r.err) + '</small>' : '') + '</div>';
      }).join('') + '</div>' +
      ((rows.some(function (r) { return r.err; }) || recentErr) ?
        '<div class="warn-box"><strong>⚠️ 집계 조회에 실패했어요.</strong><br>Supabase 대시보드 → Settings → API → Exposed schemas에 <strong>gram</strong>이 추가됐는지, SQL Editor에서 마이그레이션(001_gram_schema.sql)을 실행했는지 확인하세요.' +
        (recentErr ? '<br><small>' + esc(recentErr) + '</small>' : '') + '</div>' : '') +
      '<div class="info-box"><h3>최근 학습 현황 (최대 10개)</h3>' +
      (recent.length ? recent.map(function (l) {
        return '<div class="dash-hist-row"><span>' + esc(l.activity_type) + ' · ' + esc(l.category || '-') + '</span><span class="muted">' + esc(String(l.created_at || '').slice(0, 16).replace('T', ' ')) + '</span></div>';
      }).join('') : '<p class="muted">최근 기록이 없어요.</p>') + '</div>';
    } catch (e) {
      box.innerHTML = '<p class="muted">통계를 불러오지 못했어요.</p>';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check);
  else check();
})();
