/* ============================================================
   문법아 놀자! - 정적 문제 데이터 (4/4: GTELP 실전 52개)
   - 7유형 분포 반영: 시제12·가정법12·준동사10·조동사4·연결어4·관계사4·당위성6
   - 실제 시험은 2~3문장 지문 빈칸 4지선다. 모의고사 26문항 풀 구성 가능.
   ============================================================ */
(function () {
  function P(id, cid, sl, gl, cat, un, lv, ty, q, ch, a, ex, hi, wr) {
    return { id: id, conceptId: cid, schoolLevel: sl, gradeLevel: gl, category: cat,
      unit: un, level: lv, type: ty, question: q,
      choices: ch ? ch.split('|') : null, answer: a,
      explanation: ex, hint: hi || '', wrongReason: wr || '' };
  }
  var GT = [
    P('p_gt_t1','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','The team ___ in this city since 2010.','has been playing|played|will play|plays','has been playing','since 2010 계속! 현재완료진행 has been+~ing예요.','since=계속!','played는 끝난 과거예요.'),
    P('p_gt_t2','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','She ___ for three hours when he arrived.','had been waiting|waits|will wait|is waiting','had been waiting','도착 전 계속 기다림! 과거완료진행 had been예요.','먼저 계속=had been!','waits 현재형은 안 돼요.'),
    P('p_gt_t3','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','By next Friday, they ___ the bridge.','will have completed|complete|completed|are completing','will have completed','By+미래 마감! 미래완료 will have+p.p.예요.','by=미래완료!','completed 과거는 안 돼요.'),
    P('p_gt_t4','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','He ___ the report yesterday, so he is free today.','finished|finishes|will finish|has finish','finished','yesterday 끝남! 과거 finished예요.','yesterday=과거!','finishes 현재형은 안 돼요.'),
    P('p_gt_t5','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','Look! The kids ___ in the yard.','are playing|played|will play|have played','are playing','Look! 지금! 현재진행 are+~ing예요.','Look=지금!','played 과거는 안 돼요.'),
    P('p_gt_t6','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','She ___ English for five years, so she speaks well.','has been learning|learned|will learn|learns','has been learning','5년간 계속! 완료진행 has been예요.','for+계속!','learned 끝난 과거는 뉘앙스가 달라요.'),
    P('p_gt_t7','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','When I got home, the movie ___.','had already started|starts|will start|is starting','had already started','도착 전 이미 시작! 과거완료 had+p.p.예요.','먼저 끝남=had!','starts 현재형은 안 돼요.'),
    P('p_gt_t8','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','The train ___ at 9 every morning.','leaves|left|will leave|has left','leaves','시간표·습관은 현재 leaves예요.','시간표=현재!','left 과거는 안 돼요.'),
    P('p_gt_t9','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','I ___ my keys. Can you help me find them?','have lost|lost yesterday|will lose|lose','have lost','지금 분실 상태! 현재완료 have lost예요.','지금 결과=have!','lost yesterday는 신호가 없어요.'),
    P('p_gt_t10','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','They ___ the new mall next month.','will open|opened|open|have opened','will open','next month 미래! will open예요.','next=미래!','opened 과거는 안 돼요.'),
    P('p_gt_t11','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','He ___ here for a year before he moved.','had been living|has been living|lives|will live','had been living','이사 전 1년간 계속! 과거완료진행예요.','before+계속!','has been은 현재 기준이에요.'),
    P('p_gt_t12','gt_tense_mix','gtelp','gtelp2','tense','GTELP 시제 6','hard','multiple_choice','The sun ___ in the east. It is a fact.','rises|rose|will rise|has risen','rises','사실은 현재 rises예요.','사실=현재!','rose 과거는 안 돼요.'),
    P('p_gt_s1','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','If I ___ rich, I would travel the world.','were|am|will be|have been','were','가정법 과거! I were+would예요.','were+would!','am 현재형은 현실이에요.'),
    P('p_gt_s2','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','If she ___ harder, she would have passed.','had studied|studies|will study|has studied','had studied','과거 후회! had+p.p.+would have예요.','had+would have!','studies 현재형은 안 돼요.'),
    P('p_gt_s3','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','I wish I ___ taller.','were|am|will be|have been','were','wish 뒤 과거! were예요.','wish+과거!','am은 안 돼요.'),
    P('p_gt_s4','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','If he had left earlier, he ___ the bus.','would have caught|will catch|catches|catch','would have caught','과거완료 주절은 would have+p.p.예요.','would have!','will catch 미래는 안 돼요.'),
    P('p_gt_s5','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','He talks as if he ___ everything.','knew|knows|will know|has known','knew','as if 뒤 과거! knew예요.','as if+과거!','knows 현재형은 안 돼요.'),
    P('p_gt_s6','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','If it ___ tomorrow, we would cancel the trip.','rained|rains|will rain|has rained','rained','가정법 과거! rained+would예요.','과거+would!','rains 현재형은 현실 조건이에요.'),
    P('p_gt_s7','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','___ I rich, I would help the poor.','Were|Was|Am|If was','Were','If 생략 도치! Were+주어예요.','Were 도치!','Was 도치는 안 돼요.'),
    P('p_gt_s8','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','If you had asked, I ___ you.','would have helped|will help|help|helped','would have helped','과거 후회 주절은 would have예요.','would have!','helped 과거는 뉘앙스가 달라요.'),
    P('p_gt_s9','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','I wish it ___ raining now.','would stop|stops|will stop|stop','would stop','지금 소망은 would+원형이에요.','now 소망=would!','stops 현재형은 안 돼요.'),
    P('p_gt_s10','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','If she ___ the map, she would not have lost her way.','had brought|brings|will bring|has brought','had brought','과거 후회! had+p.p.예요.','had+후회!','brings 현재형은 안 돼요.'),
    P('p_gt_s11','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','It is time we ___.','left|leave|leaves|will leave','left','It is time 뒤 과거! left예요.','time+과거!','leave 원형은 안 돼요.'),
    P('p_gt_s12','gt_subj_mix','gtelp','gtelp2','subjunctive','GTELP 가정법 6','hard','multiple_choice','If I ___ you, I would apologize.','were|am|will be|have been','were','가정법 공식! I were+would예요.','were+would!','am은 현실이에요.'),
    P('p_gt_n1','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','She avoids ___ late.','being|to be|be|is','being','avoid 뒤 ~ing! being예요.','avoid+ing!','to be는 안 돼요.'),
    P('p_gt_n2','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','They decided ___ early.','to leave|leaving|leave|leaves','to leave','decide 뒤 to+원형이에요.','decide+to!','leaving은 안 돼요.'),
    P('p_gt_n3','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','I enjoy ___ novels.','reading|to read|read|reads','reading','enjoy 뒤 ~ing! reading예요.','enjoy+ing!','to read는 안 돼요.'),
    P('p_gt_n4','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','He hopes ___ a doctor.','to become|becoming|become|becomes','to become','hope 뒤 to+원형이에요.','hope+to!','becoming은 안 돼요.'),
    P('p_gt_n5','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','Would you mind ___ the window?','opening|to open|open|opens','opening','mind 뒤 ~ing! opening예요.','mind+ing!','to open은 안 돼요.'),
    P('p_gt_n6','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','She finished ___ the report.','writing|to write|write|writes','writing','finish 뒤 ~ing! writing예요.','finish+ing!','to write는 안 돼요.'),
    P('p_gt_n7','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','He promised ___ on time.','to come|coming|come|comes','to come','promise 뒤 to+원형이에요.','promise+to!','coming은 안 돼요.'),
    P('p_gt_n8','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','Stop ___ noise! The baby sleeps.','making|to make|make|makes','making','그만둠 stop+~ing! making예요.','그만둠=ing!','to make는 멈추고 ~하기예요.'),
    P('p_gt_n9','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','She stopped ___ a rest on the way.','to take|taking|take|takes','to take','멈추고 ~하기는 to! to take예요.','멈추고=to!','taking은 그만둠이에요.'),
    P('p_gt_n10','gt_nonfinite','gtelp','gtelp2','nonfinite','GTELP 준동사 5','hard','multiple_choice','I remember ___ him once. It was fun.','meeting|to meet|meet|meets','meeting','했던 것 기억은 ~ing! meeting예요.','했던 것=ing!','to meet는 할 것이예요.'),
    P('p_gt_m1','gt_modal_ctx','gtelp','gtelp2','modal','GTELP 조동사 2','hard','multiple_choice','You ___ smoke here. It is forbidden.','must not|do not have to|cannot swim|should not to','must not','금지는 must not! 강한 금지예요.','금지=must not!','do not have to는 ~할 필요 없다는 뜻이에요.'),
    P('p_gt_m2','gt_modal_ctx','gtelp','gtelp2','modal','GTELP 조동사 2','hard','multiple_choice','___ you help me with this box? (정중한 요청)','Would|Must|Should have|Will have','Would','정중 요청은 Would예요.','정중=Would!','Must는 의무예요.'),
    P('p_gt_m3','gt_modal_ctx','gtelp','gtelp2','modal','GTELP 조동사 2','hard','multiple_choice','He ___ be sick. He looks pale. (강한 추측)','must|might only|can swim|should to','must','강한 추측은 must! ~임에 분명해예요.','확신=must!','might는 약한 추측이에요.'),
    P('p_gt_m4','gt_modal_ctx','gtelp','gtelp2','modal','GTELP 조동사 2','hard','multiple_choice','You ___ see a doctor. (충고)','should|must smoke|can swim|will to','should','충고는 should예요.','충고=should!','must는 의무예요.'),
    P('p_gt_c1','gt_connector_logic','gtelp','gtelp2','connector','GTELP 연결어 2','hard','multiple_choice','It rained, ___ we went out. (역접) The trip was fun.','but|because|so that|since','but','앞뒤 반대! but예요.','반대=but!','because는 이유예요.'),
    P('p_gt_c2','gt_connector_logic','gtelp','gtelp2','connector','GTELP 연결어 2','hard','multiple_choice','He stayed home ___ he was sick. The cold was bad.','because|but|or|so','because','앞뒤 이유! because예요.','이유=because!','but은 반대예요.'),
    P('p_gt_c3','gt_connector_logic','gtelp','gtelp2','connector','GTELP 연결어 2','hard','multiple_choice','___ tired, she kept working. She never gives up.','Although|Because|So|And','Although','양보 비록 ~이지만! Although예요.','양보=Although!','Because는 이유예요.'),
    P('p_gt_c4','gt_connector_logic','gtelp','gtelp2','connector','GTELP 연결어 2','hard','multiple_choice','Study hard; ___, you will fail. (그렇지 않으면)','otherwise|however|moreover|therefore','otherwise','그렇지 않으면 otherwise예요.','경고=otherwise!','however는 반대예요.'),
    P('p_gt_r1','gt_relative_role','gtelp','gtelp2','relative','GTELP 관계사 2','hard','multiple_choice','The man ___ lives next door is kind.','who|which|where|when','who','사람 주어! who예요.','사람who!','which는 사물이에요.'),
    P('p_gt_r2','gt_relative_role','gtelp','gtelp2','relative','GTELP 관계사 2','hard','multiple_choice','The book ___ I bought is interesting.','which|who|where|when','which','사물 목적어! which(that)예요.','사물which!','who는 사람이에요.'),
    P('p_gt_r3','gt_relative_role','gtelp','gtelp2','relative','GTELP 관계사 2','hard','multiple_choice','This is the house ___ I grew up. It is old.','where|who|which person|when time','where','장소! where예요.','장소where!','who는 사람이에요.'),
    P('p_gt_r4','gt_relative_role','gtelp','gtelp2','relative','GTELP 관계사 2','hard','multiple_choice','I remember the day ___ we first met.','when|where|who|which person','when','때! when예요.','때when!','where는 장소예요.'),
    P('p_gt_d1','gt_mandative','gtelp','gtelp2','mandative','GTELP 당위성 3','hard','multiple_choice','They demanded that he ___. He must obey.','leave|leaves|left|leaving','leave','당위 demand 뒤 원형! leave예요.','demand+원형!','leaves는 틀려요.'),
    P('p_gt_d2','gt_mandative','gtelp','gtelp2','mandative','GTELP 당위성 3','hard','multiple_choice','It is necessary that she ___ early. It is a rule.','come|comes|came|coming','come','당위 necessary 뒤 원형! come예요.','necessary+원형!','comes는 틀려요.'),
    P('p_gt_d3','gt_mandative','gtelp','gtelp2','mandative','GTELP 당위성 3','hard','multiple_choice','She suggested that he ___ a doctor. It helps.','see|sees|saw|seeing','see','당위 suggest 뒤 원형! see예요.','suggest+원형!','sees는 틀려요.'),
    P('p_gt_d4','gt_mandative','gtelp','gtelp2','mandative','GTELP 당위성 3','hard','multiple_choice','It is important that every student ___ the rule.','follow|follows|followed|following','follow','당위 important 뒤 원형! follow예요.','important+원형!','follows는 틀려요.'),
    P('p_gt_d5','gt_mandative','gtelp','gtelp2','mandative','GTELP 당위성 3','hard','multiple_choice','The doctor insisted that he ___ smoking.','quit|quits|quitted to|quitting must','quit','당위 insist 뒤 원형! quit예요.','insist+원형!','quits는 틀려요.'),
    P('p_gt_d6','gt_mandative','gtelp','gtelp2','mandative','GTELP 당위성 3','hard','multiple_choice','They require that all guests ___ masks.','wear|wears|wore|wearing','wear','당위 require 뒤 원형! wear예요.','require+원형!','wears는 틀려요.')
  ];
  window.GramProblemData = window.GramProblemData || [];
  window.GramProblemData = window.GramProblemData.concat(GT);
})();
