/* ============================================================
   문법아 놀자! - 과정/학년/카테고리/난이도 기준 데이터 (영문법)
   - AI 없이 정적 데이터 + 규칙 기반 생성만 사용합니다.
   - "학교급" 표현 금지. "초등·중등·고등", "단계", "과정" 사용.
   - 과정: 초등·중등·고등 기초 + GTELP 실전 코스
   - GTELP Level 2 문법 26문항 7개 유형 반영:
     시제 6 · 가정법 6 · 준동사 5 · 조동사 2 · 연결어 2 · 관계사 2 · 당위성 3
   ============================================================ */
(function () {
  var SCHOOL_LEVELS = [
    { value: 'elementary', label: '초등', emoji: '🌱', color: '#16a34a', desc: 'be동사·일반동사·기초 문장' },
    { value: 'middle', label: '중등', emoji: '🌿', color: '#2563eb', desc: '시제·조동사·문장 구조' },
    { value: 'high', label: '고등', emoji: '🌳', color: '#7c3aed', desc: '가정법·준동사·관계사 심화' },
    { value: 'gtelp', label: 'GTELP 실전', emoji: '🏆', color: '#ea580c', desc: '실전 26문항 모의고사' }
  ];

  var GRADE_LEVELS = [
    { value: 'elementary3', schoolLevel: 'elementary', label: '초3' },
    { value: 'elementary4', schoolLevel: 'elementary', label: '초4' },
    { value: 'elementary5', schoolLevel: 'elementary', label: '초5' },
    { value: 'elementary6', schoolLevel: 'elementary', label: '초6' },
    { value: 'middle1', schoolLevel: 'middle', label: '중1' },
    { value: 'middle2', schoolLevel: 'middle', label: '중2' },
    { value: 'middle3', schoolLevel: 'middle', label: '중3' },
    { value: 'high1', schoolLevel: 'high', label: '고1' },
    { value: 'high2', schoolLevel: 'high', label: '고2' },
    { value: 'high3', schoolLevel: 'high', label: '고3' },
    { value: 'gtelp2', schoolLevel: 'gtelp', label: 'Level 2' }
  ];

  var CATEGORIES = [
    { value: 'sentence', label: '문장 구조', emoji: '🏗️', color: '#0d9488' },
    { value: 'tense', label: '시제', emoji: '⏰', color: '#b45309' },
    { value: 'subjunctive', label: '가정법', emoji: '💭', color: '#7c3aed' },
    { value: 'nonfinite', label: '준동사', emoji: '🔗', color: '#1d4ed8' },
    { value: 'modal', label: '조동사', emoji: '💪', color: '#4d7c0f' },
    { value: 'connector', label: '연결어', emoji: '🧲', color: '#0284c7' },
    { value: 'relative', label: '관계사', emoji: '🔍', color: '#be185d' },
    { value: 'mandative', label: '당위성', emoji: '📢', color: '#dc2626' },
    { value: 'pos', label: '품사', emoji: '🧩', color: '#6d28d9' },
    { value: 'voice', label: '수동태', emoji: '🔄', color: '#0891b2' },
    { value: 'comparison', label: '비교', emoji: '⚖️', color: '#ea580c' },
    { value: 'article', label: '관사·명사', emoji: '📖', color: '#16a34a' }
  ];

  var LEVELS = [
    { value: 'basic', label: '기초' },
    { value: 'easy', label: '쉬움' },
    { value: 'normal', label: '보통' },
    { value: 'hard', label: '어려움' },
    { value: 'advanced', label: '심화' }
  ];

  // GTELP Level 2 문법 실전 분포 (총 26문항 / 20분)
  var GTELP_MOCK = {
    total: 26, minutes: 20,
    dist: [
      { gtype: 'tense', count: 6, label: '시제' },
      { gtype: 'subjunctive', count: 6, label: '가정법' },
      { gtype: 'nonfinite', count: 5, label: '준동사' },
      { gtype: 'modal', count: 2, label: '조동사' },
      { gtype: 'connector', count: 2, label: '연결어' },
      { gtype: 'relative', count: 2, label: '관계사' },
      { gtype: 'mandative', count: 3, label: '당위성' }
    ],
    passScore: 75,
    info: '문법 26문항/20분 · 청취 26문항/약30분 · 독해·어휘 28문항/40분 (총 80문항/약 90분)'
  };

  var PRAISE = [
    'Correct! 문법 자신감이 쑥쑥 자라요. 🎉',
    'Great job! 영어 문장 박사에 한 걸음 더! 🏅',
    'Perfect! 이렇게 쓰면 영어가 훨씬 자연스러워요. 💌',
    'Excellent! 오늘의 문법 미션 클리어! 🚀',
    'Well done! GTELP 고득점에 가까워졌어요. 🏆'
  ];

  var COMFORT = [
    '괜찮아요. 예문을 한 번 더 읽어볼까요? 🌱',
    '거의 다 왔어요. 기억 꿀팁을 떠올려 봐요. 💡',
    '틀려도 괜찮아요. 지금 외운 게 진짜 실력이에요. 💪',
    '영어 고수는 틀리면서 크는 거예요. 🔍'
  ];

  var ALLOWED = {
    schoolLevel: ['elementary', 'middle', 'high', 'gtelp'],
    gradeLevel: GRADE_LEVELS.map(function (g) { return g.value; }),
    category: CATEGORIES.map(function (c) { return c.value; }),
    level: LEVELS.map(function (l) { return l.value; })
  };

  function labelOf(list, value) {
    var f = list.filter(function (x) { return x.value === value; })[0];
    return f ? f.label : value;
  }
  function colorOf(list, value, fb) {
    var f = list.filter(function (x) { return x.value === value; })[0];
    return f ? f.color : fb;
  }

  window.GramPlayData = {
    SCHOOL_LEVELS: SCHOOL_LEVELS,
    GRADE_LEVELS: GRADE_LEVELS,
    CATEGORIES: CATEGORIES,
    FIELDS: CATEGORIES,
    LEVELS: LEVELS,
    PRAISE: PRAISE,
    COMFORT: COMFORT,
    ALLOWED: ALLOWED,
    GTELP_MOCK: GTELP_MOCK,
    schoolLabel: function (v) { return labelOf(SCHOOL_LEVELS, v); },
    gradeLabel: function (v) { return labelOf(GRADE_LEVELS, v); },
    categoryLabel: function (v) { return labelOf(CATEGORIES, v); },
    fieldLabel: function (v) { return labelOf(CATEGORIES, v); },
    levelLabel: function (v) { return labelOf(LEVELS, v); },
    categoryColor: function (v) { return colorOf(CATEGORIES, v, '#0d9488'); },
    fieldColor: function (v) { return colorOf(CATEGORIES, v, '#0d9488'); },
    schoolColor: function (v) { return colorOf(SCHOOL_LEVELS, v, '#0d9488'); },
    pickPraise: function () { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; },
    pickComfort: function () { return COMFORT[Math.floor(Math.random() * COMFORT.length)]; }
  };
})();
