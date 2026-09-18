/* 문법아 놀자! - mock.html GTELP 실전 모의고사 로직
   - 26문항/20분 실전형: OMR + 이전/다음 + 7유형별 분석 + 복습 링크 */
(function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var setupBox = document.getElementById('mock-setup');
  if (!setupBox) return;
  var playBox = document.getElementById('mock-play');
  var resultBox = document.getElementById('mock-result');
  var D = window.GramPlayData;

  var queue = [], idx = 0, picked = {}, startTime = 0, timer = null, remain = 0, submitted = false;

  function gtypeLabel(p) {
    var map = { tense: '시제', subjunctive: '가정법', nonfinite: '준동사', modal: '조동사', connector: '연결어', relative: '관계사', mandative: '당위성' };
    var g = p.gtype || inferGtype(p);
    return map[g] || D.categoryLabel(p.category);
  }
  function inferGtype(p) {
    var c = { tense: 'tense', subjunctive: 'subjunctive', nonfinite: 'nonfinite', modal: 'modal', connector: 'connector', relative: 'relative', mandative: 'mandative' };
    return c[p.category] || null;
  }

  document.getElementById('mock-start').addEventListener('click', function () {
    var count = parseInt(document.getElementById('mock-count').value || '26', 10);
    queue = window.GramGenerator.mockExam(count);
    if (!queue.length) { alert('모의고사 문제를 만들지 못했어요.'); return; }
    idx = 0; picked = {}; submitted = false;
    startTime = Date.now();
    setupBox.style.display = 'none';
    resultBox.style.display = 'none';
    playBox.style.display = 'block';
    var t = parseInt(document.getElementById('mock-time').value || '1200', 10);
    var timeBox = document.getElementById('mock-timer');
    if (timer) clearInterval(timer);
    if (t > 0) {
      remain = t;
      var tick = function () {
        var m = Math.floor(remain / 60), s = remain % 60;
        timeBox.textContent = '⏱️ 남은 시간 ' + m + ':' + (s < 10 ? '0' : '') + s;
        if (remain <= 0) { clearInterval(timer); finish(true); return; }
        remain--;
      };
      tick();
      timer = setInterval(tick, 1000);
    } else timeBox.textContent = '⏱️ 연습 모드 (시간 제한 없음)';
    showQ();
  });

  function renderOmr() {
    var box = document.getElementById('mock-omr');
    box.innerHTML = queue.map(function (p, i) {
      var cls = 'omr' + (i === idx ? ' current' : '') + (picked[i] != null ? ' done' : '');
      return '<button class="' + cls + '" data-i="' + i + '">' + (i + 1) + '</button>';
    }).join('');
    box.querySelectorAll('.omr').forEach(function (b) {
      b.addEventListener('click', function () { idx = parseInt(b.getAttribute('data-i'), 10); showQ(); });
    });
  }

  function showQ() {
    var p = queue[idx];
    document.getElementById('mock-progress').textContent = (idx + 1) + ' / ' + queue.length + ' · ' + gtypeLabel(p);
    document.getElementById('mock-question').innerHTML = '<strong>Q' + (idx + 1) + '.</strong> ' + esc(p.question);
    var ansBox = document.getElementById('mock-answers');
    var fb = document.getElementById('mock-feedback');
    fb.style.display = 'none';
    ansBox.innerHTML = p.choices.map(function (ch, j) {
      var sel = picked[idx] === ch ? ' selected' : '';
      return '<button class="opt-btn' + sel + '" data-a="' + esc(ch) + '"><span class="opt-no">' + '①②③④'[j] + '</span> ' + esc(ch) + '</button>';
    }).join('');
    ansBox.querySelectorAll('.opt-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        picked[idx] = b.getAttribute('data-a');
        showQ();
      });
    });
    var nav = document.getElementById('mock-nav');
    var answered = Object.keys(picked).length;
    nav.innerHTML =
      '<button class="btn btn-outline btn-sm" id="mock-prev"' + (idx === 0 ? ' disabled' : '') + '>← 이전</button>' +
      '<button class="btn btn-outline btn-sm" id="mock-next"' + (idx === queue.length - 1 ? ' disabled' : '') + '>다음 →</button>' +
      '<button class="btn btn-primary btn-sm" id="mock-submit">제출하기 (' + answered + '/' + queue.length + ')</button>';
    document.getElementById('mock-prev').addEventListener('click', function () { if (idx > 0) { idx--; showQ(); } });
    document.getElementById('mock-next').addEventListener('click', function () { if (idx < queue.length - 1) { idx++; showQ(); } });
    document.getElementById('mock-submit').addEventListener('click', function () {
      var un = queue.length - answered;
      if (un > 0 && !confirm('아직 ' + un + '문항을 안 풀었어요. 그래도 제출할까요?')) return;
      finish(false);
    });
    renderOmr();
  }

  function finish(timeUp) {
    if (submitted) return;
    submitted = true;
    if (timer) clearInterval(timer);
    playBox.style.display = 'none';
    resultBox.style.display = 'block';
    var secs = Math.round((Date.now() - startTime) / 1000);
    var correct = 0;
    var byType = {};
    queue.forEach(function (p, i) {
      var g = p.gtype || inferGtype(p) || p.category;
      byType[g] = byType[g] || { total: 0, correct: 0 };
      byType[g].total++;
      var ok = picked[i] != null && picked[i] === p.answer;
      if (ok) { correct++; byType[g].correct++; }
      if (window.GramProgress) {
        window.GramProgress.recordAttempt(p.conceptId, ok, p);
        if (!ok) window.GramProgress.addWrongNote(p, picked[i] || '(미응답)');
      }
    });
    var score = Math.round(correct / queue.length * 100);
    var pass = score >= 75;
    var wrong = queue.map(function (p, i) { return { p: p, i: i, given: picked[i], ok: picked[i] != null && picked[i] === p.answer }; })
      .filter(function (w) { return !w.ok; });
    var typeOrder = ['tense', 'subjunctive', 'nonfinite', 'modal', 'connector', 'relative', 'mandative'];
    resultBox.innerHTML = '<h3>🏆 모의고사 결과: ' + score + '점 (' + correct + '/' + queue.length + ')' + (timeUp ? ' · 시간 종료' : '') + '</h3>' +
      '<p class="muted">⏱️ 걸린 시간 약 ' + Math.floor(secs / 60) + '분 ' + (secs % 60) + '초 · ' +
      (pass ? 'Mastery(75%+) 달성! 🎉' : 'Near Mastery! 약한 유형부터 복습해요. 💪') + '</p>' +
      '<div class="info-box"><h3>📊 유형별 분석</h3>' + typeOrder.filter(function (g) { return byType[g]; }).map(function (g) {
        var r = byType[g];
        var pct = Math.round(r.correct / r.total * 100);
        var label = { tense: '⏰ 시제', subjunctive: '💭 가정법', nonfinite: '🔗 준동사', modal: '💪 조동사', connector: '🧲 연결어', relative: '🔍 관계사', mandative: '📢 당위성' }[g] || g;
        return '<div class="bar-row"><span class="bar-label">' + label + '</span><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;' + (pct < 60 ? 'background:#dc2626;' : '') + '"></div></div><span style="width:90px;text-align:right;font-size:.85rem;">' + r.correct + '/' + r.total + ' (' + pct + '%)</span></div>';
      }).join('') + '</div>' +
      (wrong.length ? '<div class="warn-box"><strong>틀린 문제 ' + wrong.length + '개 (오답노트 저장됨)</strong><ul>' +
        wrong.slice(0, 10).map(function (w) {
          var c = (window.GramConceptData || []).filter(function (x) { return x.id === w.p.conceptId; })[0];
          return '<li><strong>Q' + (w.i + 1) + '.</strong> ' + esc(w.p.question) + '<br>→ 정답: ' + esc(w.p.answer) + ' / 내 답: ' + esc(w.given || '(미응답)') + '<br><small>📖 ' + esc(w.p.explanation) + '</small>' +
            (c ? '<br><a class="btn btn-outline btn-sm" href="concept-view.html?id=' + encodeURIComponent(c.id) + '">📖 ' + esc(c.title) + ' 복습</a>' : '') + '</li>';
        }).join('') + '</ul></div>' : '<div class="tip-box">💡 만점이에요! 실전에서도 이 페이스로! 🏆</div>') +
      '<div class="detail-controls"><button class="btn btn-primary btn-sm" id="mock-retry">다시 풀기</button><a class="btn btn-secondary btn-sm" href="progress.html">오답노트 보기</a><button class="btn btn-outline btn-sm" id="mock-back">설정으로</button></div>';
    if (window.GramProgress) {
      window.GramProgress.saveQuizResult({
        quiz_type: 'gtelp_mock', school_level: 'gtelp', total_questions: queue.length,
        correct_count: correct, score: score, duration_seconds: secs,
        result_data: queue.slice(0, 26).map(function (p, i) { return { q: p.question, ok: picked[i] === p.answer, gtype: p.gtype || inferGtype(p) }; })
      });
    }
    document.getElementById('mock-retry').addEventListener('click', function () { location.reload(); });
    document.getElementById('mock-back').addEventListener('click', function () {
      resultBox.style.display = 'none'; setupBox.style.display = 'block';
    });
  }
})();
