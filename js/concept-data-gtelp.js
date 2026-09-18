/* ============================================================
   문법아 놀자! - 영문법 개념 정적 데이터 (4/4: GTELP 실전 12개)
   - Level 2 문법 7개 유형 실전 포인트 + 독해·어휘·청취 연결
   ============================================================ */
(function () {
  function C(id, sl, gr, cat, un, ti, de, easy, fun, tip, use, mis1, mis2, exq, exa, qc, qa, rel) {
    return {
      id: id, schoolLevel: sl, gradeLevel: gr, category: cat, unit: un, title: ti, type: 'concept',
      shortDescription: de, easyExplanation: easy, funExplanation: fun,
      memoryTip: tip, useWhen: use, commonMistakes: [mis1, mis2],
      examples: [{ q: exq, a: exa }],
      quickCheck: { question: qc, answer: qa },
      relatedConceptIds: rel || []
    };
  }

  var GTELP = [
    C('gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','시제 실전 6문항','진행 3+완료진행 3: 시간 신호(yesterday·by·for·since)로 골라요.','for 3 months→완료진행, yesterday→과거처럼 신호어를 먼저 봐요.','시제는 신호어 사냥! yesterday·for·by를 찾아요.','신호어→시제 공식!','실전 시제 6문항에서 써요.','신호어 없이 해석으로만 푸는 것.','진행·완료를 구분 못하는 것.','She ___ here since 2020. (live, 계속) 빈칸은?','has been living','by Friday와 짝꿍은?','will have+p.p.',['hi_tense_sequence','mi_prog_perf']),
    C('gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','가정법 실전 6문항','과거 3+과거완료 3: if절 시제로 과거·완료를 나눠요.','if절 과거→would, 과거완료→would have처럼 if를 먼저 봐요.','가정법은 if 시계! 과거면 would예요.','if 과거→would!','실전 가정법 6문항에서 써요.','if절에 would를 넣는 것.','주절·if절을 바꾸는 것.','If he ___, he would help. (be, 과거) 빈칸은?','were','had+p.p. 주절은?','would have+p.p.',['hi_subj_mix','mi_subj_perf']),
    C('gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','준동사 실전 5문항','동명사 3+to부정사 2: 빈칸 앞 동사로 ~ing·to를 골라요.','finish→~ing, want→to처럼 앞 동사 20개만 외우면 돼요.','준동사는 앞 동사! finish~ing·want to예요.','앞 동사로 고르기!','실전 준동사 5문항에서 써요.','뒤 말을 보고 고르는 것.','to·ing를 뜻 없이 외우는 것.','She avoids ___ late. (be) 빈칸은?','being','decide 뒤에는?','to+원형',['hi_gerund_inf','mi_to_verbs']),
    C('gt_modal_ctx','gtelp','gtelp2','modal','GTELP 조동사 2','조동사 실전 2문항','문맥 대입: 보기 조동사를 넣어 자연스러운 것을 골라요.','규칙·허락·추측 중 문맥에 맞는 하나를 대입해 봐요.','조동사는 대입 게임! 넣어보고 자연스러우면 정답예요.','대입해서 문맥 확인!','실전 조동사 2문항에서 써요.','뜻을 안 보고 모양만 보는 것.','must를 무조건 정답으로 고르는 것.','You ___ smoke here. (금지) 빈칸은?','must not','정중한 요청은?','would·could',['mi_modal_mean','hi_modal_idiom']),
    C('gt_connector_logic','gtelp','gtelp2','connector','GTELP 연결어 2','연결어 실전 2문항','앞뒤 논리(대조·원인·결과·양보) 먼저, 보기는 나중에 봐요.','앞뒤가 반대면 but·however, 이유면 because·since처럼 논리를 봐요.','연결어는 논리 퍼즐! 앞뒤 관계를 먼저 봐요.','관계 먼저→보기!','실전 연결어 2문항에서 써요.','보기부터 보고 끼워 맞추는 것.','although+but를 함께 고르는 것.','It rained, ___ we went out. (역접) 빈칸은?','but','원인 연결어는?','because·since',['hi_conj_adv','mi_although']),
    C('gt_relative_role','gtelp','gtelp2','relative','GTELP 관계사 2','관계사 실전 2문항','선행사(사람·사물)→절 역할(주어·목적어) 3단계로 골라요.','사람+주어→who, 사물+목적어→which/that처럼 3단계를 밟아요.','관계사는 3단계! 선행사→역할→고르기예요.','사람who·사물which!','실전 관계사 2문항에서 써요.','선행사 없이 관계사를 고르는 것.','주격·목적격을 구분 못하는 것.','the man ___ lives next door 빈칸은?','who','목적격 생략 가능할 때는?','목적격 관계사',['hi_relative_what','mi_who_which']),
    C('gt_mandative','gtelp','gtelp2','mandative','GTELP 당위성 3','당위성 실전 3문항','suggest·insist·demand·necessary 뒤 (should)+원형이 정답이에요.','It is necessary that he go처럼 goes가 아니라 go예요.','당위성은 원형 도장! 시제 무시하고 원형이에요.','시제 무시+원형!','실전 당위성 3문항에서 써요.','시제 규칙으로 푸는 것.','should를 꼭 넣어야 하는 것.','They demanded that he ___. (leave) 빈칸은?','leave','당위 형용사는?','necessary·important',['mi_subj_should','hi_mand_adj']),
    C('gt_confuse_set','gtelp','gtelp2','subjunctive','GTELP 헷갈림','헷갈림 세트 정리','lie/lay·rise/raise·affect/effect·so/such를 시험 전에 훑어요.','눕다lie-놓다lay, 오르다rise-올리다raise처럼 자동·타동을 나눠요.','헷갈림은 쌍둥이 정리! 눕다lie·놓다lay예요.','자동·타동 나누기!','실전 전 마무리에서 써요.','뜻만 외우고 자동·타동을 모르는 것.','so·such 뒤 어순을 헷갈리는 것.','so ___ a kind man 빈칸 어순은?','such','raise 과거는?','raised',['hi_confuse_lie','hi_error_spot']),
    C('gt_read_main','gtelp','gtelp2','connector','GTELP 독해','독해·어휘 연결','주제→세부→추론→어휘 순서로 신호어(they·however)부터 봐요.','첫·끝 문장으로 주제, 지시어로 세부를 찾아요.','독해는 신호어! they·however 뒤예요.','첫·끝+신호어!','독해 28문항에서 써요.','보기부터 읽는 것.','모르는 낱말에 멈추는 것.','they가 가리키는 것은?','앞 문장의 명사','however 뒤는?','반대·전환',['hi_read_detail','gt_vocab_ctx']),
    C('gt_vocab_ctx','gtelp','gtelp2','pos','GTELP 독해','어휘 문맥 추측','앞뒤 문장·접속어로 모르는 낱말 뜻을 추측해요.','but 뒤 반대말, for example 뒤 예시처럼 힌트를 봐요.','어휘는 문맥 탐정! 앞뒤를 봐요.','but·for example 힌트!','어휘 문제에서 써요.','사전적 뜻 하나만 고집하는 것.','접속어를 무시하는 것.','but 뒤 낱말 뜻은 앞과?','반대','for example 뒤는?','예시',['gt_read_main','hi_vocab_root']),
    C('gt_listen_mock','gtelp','gtelp2','sentence','GTELP 청취','청취 문제 접근','질문 먼저→신호어 뒤 집중→숫자·이름 메모로 풀어요.','실제 오디오는 시험장에서! 여기서는 접근법과 신호어를 익혀요.','청취는 질문 먼저! 신호어 뒤를 들어요.','질문+신호어+메모!','청취 26문항 대비에 써요.','처음부터 다 외우려는 것.','보기를 안 보고 듣는 것.','들을 때 먼저 볼 것은?','질문','메모할 것은?','숫자·이름',['hi_listen_signal','gt_mock_grammar']),
    C('gt_mock_grammar','gtelp','gtelp2','tense','GTELP 모의고사','문법 26문항 풀기','7유형 분포(6-6-5-2-2-2-3)로 20분 타이머+분석으로 풀어요.','mock.html에서 실전처럼! 유형별 정답률과 복습 링크가 나와요.','모의고사는 실전 리허설! 20분 타이머예요.','20분+유형 분석!','모의고사에서 써요.','시간 재지 않고 푸는 것.','오답을 안 복습하는 것.','문법 26문항 시간은?','20분','합격(Mastery) 기준은?','영역별 75%+',['gt_tense_mix','gt_subj_mix'])
  ];

  window.GramConceptData = window.GramConceptData || [];
  window.GramConceptData = window.GramConceptData.concat(GTELP);
})();
