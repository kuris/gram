/* ============================================================
   문법아 놀자! - 영문법 규칙 기반 문제 생성기 (AI API 사용 없음)
   - 정적 문제(GramProblemData) 우선 + 개념/규칙으로 빈칸 4지선다 보충
   - 실제 시험 형식: 2~3문장 지문 빈칸 채우기 4지선다
   - 모의고사: GTELP_MOCK 분포(6-6-5-2-2-2-3)로 26문항 구성
   ============================================================ */
(function () {
  function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function makeChoices(answer, distract) {
    var set = [String(answer)];
    (distract || []).forEach(function (d) {
      d = String(d);
      if (set.indexOf(d) === -1 && set.length < 4) set.push(d);
    });
    // 영어 문법 오답 풀 (정답과 헷갈리는 형태)
    var pool = ['is', 'are', 'was', 'were', 'have', 'has', 'had', 'will',
      'would', 'to go', 'going', 'goes', 'went', 'being', 'been'];
    var k = 0;
    while (set.length < 4 && k < pool.length) {
      if (set.indexOf(pool[k]) === -1) set.push(pool[k]);
      k++;
    }
    return shuffle(set.slice(0, 4));
  }
  function base(conceptId, schoolLevel, gradeLevel, category, unit, level, gtype) {
    return {
      id: 'generated_' + conceptId + '_' + Date.now().toString(36) + '_' + rndInt(100, 999),
      conceptId: conceptId, schoolLevel: schoolLevel, gradeLevel: gradeLevel,
      category: category, unit: unit, level: level || 'easy', type: 'multiple_choice',
      gtype: gtype || null,
      choices: null, answer: '', explanation: '', hint: '', wrongReason: ''
    };
  }
  function concepts() { return window.GramConceptData || []; }
  function statics() { return window.GramProblemData || []; }
  function rules() { return window.GramRuleData || []; }

  function conceptKeyword(c) {
    if (!c) return '';
    var qa = (c.quickCheck && c.quickCheck.answer) || '';
    if (qa && qa.length <= 16) return qa;
    return c.title;
  }

  function siblingAnswers(c, n) {
    // 같은 카테고리 다른 개념의 quickCheck 정답을 오답으로 활용
    var pool = shuffle(concepts().filter(function (x) {
      return x.id !== c.id && x.category === c.category;
    }));
    var out = [];
    pool.forEach(function (x) {
      var a = (x.quickCheck && x.quickCheck.answer) || x.title;
      if (out.indexOf(a) === -1 && a !== conceptKeyword(c)) out.push(a);
    });
    if (out.length < n) {
      pool = shuffle(concepts().filter(function (x) { return x.id !== c.id; }));
      pool.forEach(function (x) {
        var a = x.title;
        if (out.length < n && out.indexOf(a) === -1) out.push(a);
      });
    }
    return out.slice(0, n);
  }

  // GTELP식 빈칸 4지선다: 예문 속 정답 부분을 빈칸으로
  function generateBlankProblem(c, level) {
    var p = base(c.id, c.schoolLevel, c.gradeLevel, c.category, c.unit, level);
    var ex = (c.examples && c.examples[0]) || null;
    var answer = conceptKeyword(c);
    var q;
    if (ex && ex.a && String(ex.a).length <= 20 && ex.q.indexOf('___') !== -1) {
      // 개념 예문에 이미 빈칸이 있으면 그대로 출제
      q = '(문장) ' + ex.q + (ex.q.indexOf('?') === -1 ? '' : '');
      answer = String(ex.a);
    } else if (ex) {
      q = '(문장) ' + ex.q + ' — 밑줄·빈칸에 들어갈 말은?';
      answer = String(ex.a);
    } else {
      q = '"' + c.shortDescription + '" — 이 설명에 해당하는 것은?';
      answer = c.title;
    }
    p.question = q;
    p.answer = answer;
    p.choices = makeChoices(answer, siblingAnswers(c, 3));
    p.explanation = c.title + ': ' + c.shortDescription + ' 💡 ' + c.memoryTip;
    p.hint = '💡 힌트: ' + c.memoryTip;
    return p;
  }

  // OX 문제: 개념 설명 판단
  function generateOxProblem(c, level) {
    var p = base(c.id, c.schoolLevel, c.gradeLevel, c.category, c.unit, level);
    p.type = 'ox';
    var truthy = Math.random() < 0.5;
    var statement, answer;
    if (truthy) {
      statement = c.shortDescription;
      answer = 'O';
    } else {
      var sibs = siblingAnswers(c, 1);
      statement = c.shortDescription.replace(/^[^\.]+\./, (sibs[0] || '비교') + '.');
      if (statement === c.shortDescription) statement = '반대: ' + (sibs[0] || '과거형') + '을(를) 써야 한다.';
      answer = 'X';
    }
    p.question = '다음 설명이 맞으면 O, 틀리면 X를 고르세요. [' + c.title + '] ' + statement;
    p.choices = ['O', 'X'];
    p.answer = answer;
    p.explanation = (answer === 'O' ? '맞아요. ' : '틀려요. ') + c.title + ': ' + c.shortDescription + ' 💡 ' + c.memoryTip;
    p.hint = '💡 힌트: ' + c.memoryTip;
    return p;
  }

  // 헷갈리는 표현 규칙 기반 문제
  function generateRuleProblem(rule, level) {
    var p = base(rule.conceptId || 'rule_' + rule.id, rule.schoolLevel || 'elementary',
      rule.gradeLevel || 'elementary4', rule.category || 'sentence', rule.unit || '헷갈리는 표현', level);
    var variant = rndInt(0, 1);
    if (variant === 0) {
      p.question = '빈칸에 들어갈 올바른 표현을 고르세요. "' + rule.sentence.replace('___', '( ? )') + '"';
      p.answer = rule.correct;
      p.choices = makeChoices(rule.correct, [rule.wrong, rule.alt1, rule.alt2].filter(Boolean));
    } else {
      p.question = '다음 중 바른 문장을 고르세요. (' + rule.pair + ')';
      p.answer = rule.sentence.replace('___', rule.correct);
      var wrongOne = rule.sentence.replace('___', rule.wrong);
      var opts = [p.answer, wrongOne];
      if (rule.alt1) opts.push(rule.sentence.replace('___', rule.alt1));
      if (rule.alt2) opts.push(rule.sentence.replace('___', rule.alt2));
      p.choices = shuffle(opts.slice(0, 4));
    }
    p.explanation = rule.explain + (rule.tip ? ' 💡 ' + rule.tip : '');
    p.hint = '💡 힌트: ' + (rule.tip || rule.explain);
    return p;
  }

  function generateByConcept(conceptId, level) {
    var list = concepts();
    var c = list.filter(function (x) { return x.id === conceptId; })[0];
    if (!c) return null;
    return Math.random() < 0.3 ? generateOxProblem(c, level) : generateBlankProblem(c, level);
  }

  function byConcept(conceptId, count, level) {
    var list = statics().filter(function (p) {
      return p.conceptId === conceptId && (!level || level === 'all' || p.level === level);
    });
    var out = shuffle(list).slice(0, count);
    var guard = 0;
    while (out.length < count && guard < count * 3) {
      var q = generateByConcept(conceptId, level === 'all' ? undefined : level);
      if (q) out.push(q);
      guard++;
    }
    return out.slice(0, count);
  }

  // GTELP 실전 모의고사 26문항: 7유형 분포로 구성
  function mockExam(count) {
    var D = window.GramPlayData;
    var dist = (D && D.GTELP_MOCK && D.GTELP_MOCK.dist) || [];
    var want = count || 26;
    var out = [];
    var usedIds = {};
    function take(pool, n) {
      var r = [];
      for (var i = 0; i < pool.length && r.length < n; i++) {
        if (!usedIds[pool[i].id]) { usedIds[pool[i].id] = 1; r.push(pool[i]); }
      }
      return r;
    }
    var scale = want / 26;
    dist.forEach(function (g) {
      var n = Math.max(1, Math.round(g.count * scale));
      var cat = gtypeToCategory(g.gtype);
      var pool = shuffle(statics().filter(function (p) {
        return p.schoolLevel === 'gtelp' && p.category === cat;
      }));
      var picked = take(pool, n);
      // 부족분은 같은 카테고리 전체에서 보충
      if (picked.length < n) {
        var extra = shuffle(statics().filter(function (p) {
          return p.category === cat && !usedIds[p.id];
        }));
        picked = picked.concat(take(extra, n - picked.length));
      }
      picked.forEach(function (p) {
        var cp = Object.assign({}, p);
        cp.gtype = g.gtype;
        out.push(cp);
      });
    });
    // 그래도 부족하면 GTELP 문제 전체에서 채우기
    if (out.length < want) {
      var rest = shuffle(statics().filter(function (p) {
        return p.schoolLevel === 'gtelp' && !usedIds[p.id];
      }));
      take(rest, want - out.length).forEach(function (p) { out.push(p); });
    }
    return shuffle(out).slice(0, want);
  }
  function gtypeToCategory(gtype) {
    var map = { tense: 'tense', subjunctive: 'subjunctive', nonfinite: 'nonfinite',
      modal: 'modal', connector: 'connector', relative: 'relative', mandative: 'mandative' };
    return map[gtype] || gtype;
  }

  function byFilter(o) {
    o = o || {};
    // 모의고사 모드
    if (o.mock) return mockExam(o.count || 26);
    var list = concepts().filter(function (c) {
      return (!o.category || o.category === 'all' || c.category === o.category) &&
             (!o.schoolLevel || o.schoolLevel === 'all' || c.schoolLevel === o.schoolLevel) &&
             (!o.gradeLevel || o.gradeLevel === 'all' || c.gradeLevel === o.gradeLevel) &&
             (!o.conceptId || o.conceptId === 'all' || c.id === o.conceptId);
    });
    var count = o.count || 10;
    var out = [];
    var per = Math.max(1, Math.ceil(count / Math.max(1, list.length)));
    list.forEach(function (c) {
      if (out.length >= count) return;
      byConcept(c.id, Math.min(per, count - out.length), o.level || 'all').forEach(function (p) { out.push(p); });
    });
    // 규칙 기반 보충: 헷갈리는 표현 섞기
    var rl = rules();
    if (rl.length && out.length < count) {
      var rc = shuffle(rl.filter(function (r) {
        return (!o.schoolLevel || o.schoolLevel === 'all' || !r.schoolLevel || r.schoolLevel === o.schoolLevel) &&
               (!o.category || o.category === 'all' || !r.category || r.category === o.category);
      }));
      var ri = 0;
      while (out.length < count && ri < rc.length) {
        out.push(generateRuleProblem(rc[ri], o.level === 'all' ? undefined : o.level));
        ri++;
      }
    }
    return shuffle(out).slice(0, count);
  }

  window.GramGenerator = {
    generateProblems: byFilter,
    generateByConcept: byConcept,
    generateBlankProblem: generateBlankProblem,
    generateOxProblem: generateOxProblem,
    generateRuleProblem: generateRuleProblem,
    mockExam: mockExam,
    makeChoices: makeChoices,
    shuffle: shuffle
  };
})();
