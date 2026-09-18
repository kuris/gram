/* ============================================================
   문법아 놀자! - 자주 헷갈리는 영어 표현 50개 (정적 데이터)
   - generator.js 규칙 기반 문제 생성에 활용됩니다.
   - fields: id, pair, correct, wrong, sentence(___ 빈칸),
     explain, tip, category, schoolLevel, gradeLevel, conceptId
   ============================================================ */
(function () {
  function R(id, pair, correct, wrong, sentence, explain, tip, cat, sl, gl, cid, alt1, alt2) {
    return { id: id, pair: pair, correct: correct, wrong: wrong,
      sentence: sentence, explain: explain, tip: tip || '',
      category: cat, schoolLevel: sl, gradeLevel: gl, conceptId: cid,
      unit: '헷갈리는 표현', alt1: alt1 || null, alt2: alt2 || null };
  }
  window.GramRuleData = [
    R('rule_its',"it's / its",'it’s','its',"___ my book. (이것은 내 책이야)",'it’s는 it is의 준말! 소유는 its예요.','’가 있으면 it is!', 'sentence','elementary','elementary4','el_be_is','it is','its own'),
    R('rule_your',"your / you're",'you’re','your',"___ welcome! (천만에요)",'you’re는 you are의 준말! 너의 것은 your예요.','’가 있으면 you are!', 'sentence','elementary','elementary4','el_be_are','you are','yours'),
    R('rule_their',"their / there / they're",'they’re','their',"___ playing soccer. (그들은 축구 중이야)",'they’re는 they are! 장소는 there, 그들의 것은 their예요.','’가 있으면 they are!', 'sentence','elementary','elementary5','el_be_are','there','their own'),
    R('rule_than_then',"than / then",'than','then',"She is taller ___ me.",'비교 ~보다(+than)! 그때는 then예요.','비교는 than!', 'comparison','elementary','elementary5','el_wh_how','then','ten'),
    R('rule_too_two',"too / two / to",'two','too',"I have ___ apples.",'둘은 two! ~도·너무는 too, ~하러는 to예요.','개수는 two!', 'sentence','elementary','elementary3','el_intro_self','too','to'),
    R('rule_a_an',"a / an",'an','a',"___ hour (한 시간)",'h는 묵음! 모음 소리 앞에는 an이에요.','소리로 고르기!', 'article','elementary','elementary4','el_article_a','a','the'),
    R('rule_is_are',"is / are",'are','is',"They ___ happy.",'they 뒤에는 are! he·she·it 뒤 is예요.','they-are 짝꿍!', 'sentence','elementary','elementary3','el_be_are','is','am'),
    R('rule_am_is',"am / is",'am','is',"I ___ ten years old.",'I 뒤에는 am! he·she 뒤 is예요.','I-am 짝꿍!', 'sentence','elementary','elementary3','el_be_am','is','are'),
    R('rule_dont_doesnt',"don't / doesn't",'doesn’t','don’t',"He ___ like milk.",'he 부정은 doesn’t! I·you는 don’t예요.','he=doesn’t!', 'sentence','elementary','elementary4','el_dont_neg','don’t','isn’t'),
    R('rule_do_does',"do / does",'Does','Do',"___ she swim?",'she 질문은 Does! I·you는 Do예요.','she=Does!', 'sentence','elementary','elementary4','el_does_q','Do','Is'),
    R('rule_have_has',"have / has",'has','have',"She ___ a dog.",'she 뒤 have는 has! I·they는 have예요.','she=has!', 'sentence','elementary','elementary4','el_verb_have','have','had'),
    R('rule_this_these',"this / these",'These','This',"___ are my shoes.",'여럿 가까이는 these! 하나는 this예요.','복수these!', 'pos','elementary','elementary3','el_this_that','This','Those'),
    R('rule_that_those',"that / those",'Those','That',"___ are stars.",'멀리 여럿은 those! 하나는 that예요.','멀리 복수those!', 'pos','elementary','elementary3','el_this_that','That','These'),
    R('rule_child',"child / children",'children','childs',"Two ___ are playing.",'child 복수는 children! -s가 아니에요.','변신 외우기!', 'article','elementary','elementary5','el_plural_irregular','childs','childes'),
    R('rule_man',"man / men",'men','mans',"Three ___ came.",'man 복수는 men! -s가 아니에요.','a→e 변신!', 'article','elementary','elementary5','el_plural_irregular','mans','mens'),
    R('rule_went',"go / went / gone",'went','goed',"We ___ home yesterday.",'go 과거는 went! goed는 없어요.','went 외우기!', 'tense','elementary','elementary5','el_past_irregular','goed','goes'),
    R('rule_ate',"eat / ate / eaten",'ate','eated',"I ___ lunch.",'eat 과거는 ate! eated는 없어요.','eat-ate!', 'tense','elementary','elementary5','el_past_irregular','eated','eats'),
    R('rule_saw',"see / saw / seen",'saw','seed',"I ___ a movie.",'see 과거는 saw! seed는 씨앗이에요.','see-saw!', 'tense','elementary','elementary5','el_past_irregular','seed','sees'),
    R('rule_was_were',"was / were",'were','was',"They ___ tired.",'they 과거는 were! I·he는 was예요.','they-were!', 'tense','elementary','elementary5','el_past_was','was','are'),
    R('rule_in_on_at',"in / on / at (장소)",'on','in',"___ the desk (책상 위에)",'위에는 on! 안에는 in, 점은 at예요.','위on!', 'pos','elementary','elementary4','el_prep_in','in','under'),
    R('rule_on_sunday',"on / in (시간)",'on','in',"___ Sunday morning",'요일 앞은 on! 월·년 앞 in예요.','요일on!', 'pos','elementary','elementary5','el_prep_time','in','at'),
    R('rule_many_much',"many / much",'many','much',"How ___ apples?",'셀 수 있음 many! 없음 much예요.','셀 수 있음many!', 'comparison','elementary','elementary5','el_wh_how','much','more'),
    R('rule_good_well',"good / well",'well','good',"She sings ___.",'동사 꾸밈은 well! 명사 꾸밈은 good예요.','동사+well!', 'pos','elementary','elementary5','el_adv','good','best'),
    R('rule_can_could',"can / could",'could','can',"I wish I ___ fly.",'wish 뒤 과거 could! 현재 can은 안 돼요.','wish+과거!', 'modal','middle','middle3','mi_subj_wish','can','will'),
    R('rule_must_have',"must have / must",'must have forgotten','must forget',"She ___ her keys. (분실 추측)",'과거 추측은 must have+p.p.!','과거=have!', 'modal','middle','middle3','mi_modal_past','must forget','must forgetting'),
    R('rule_should_have',"should have / should",'should not have','should not',"You ___ lied.",'과거 후회는 should have! 현재 should가 아니에요.','후회=have!', 'modal','middle','middle3','mi_modal_past','should not','must not have'),
    R('rule_enjoy_to',"enjoy ~ing / to",'reading','to read',"I enjoy ___ books.",'enjoy 뒤 ~ing! to는 안 돼요.','enjoy+ing!', 'nonfinite','middle','middle2','mi_gerund_verbs','to read','read'),
    R('rule_want_to',"want to / ~ing",'to go','going',"I want ___ home.",'want 뒤 to+원형! ~ing는 안 돼요.','want+to!', 'nonfinite','middle','middle2','mi_to_verbs','going','go'),
    R('rule_finish',"finish ~ing",'eating','to eat',"She finished ___.",'finish 뒤 ~ing! to는 안 돼요.','finish+ing!', 'nonfinite','middle','middle2','mi_gerund_verbs','to eat','eat'),
    R('rule_mind',"mind ~ing",'opening','to open',"Mind ___ the door?",'mind 뒤 ~ing! to는 안 돼요.','mind+ing!', 'nonfinite','middle','middle3','mi_possessive_ing','to open','open'),
    R('rule_stop',"stop ~ing / to",'smoking','to smoke',"He stopped ___. (금연)",'그만둠은 ~ing! 멈추고 ~하기는 to예요.','그만둠ing!', 'nonfinite','high','high1','hi_gerund_inf','to smoke','smoke'),
    R('rule_remember',"remember ~ing / to",'meeting','to meet',"I remember ___ him. (지난 일)",'했던 것 기억은 ~ing! 할 것은 to예요.','했던 것ing!', 'nonfinite','high','high1','hi_gerund_inf','to meet','meet'),
    R('rule_who_which',"who / which",'who','which',"The girl ___ sings is Sue.",'사람 주어는 who! 사물은 which예요.','사람who!', 'relative','middle','middle2','mi_who_which','which','where'),
    R('rule_where_when',"where / when",'when','where',"the day ___ we met",'때는 when! 장소는 where예요.','때when!', 'relative','middle','middle2','mi_whose_where','where','who'),
    R('rule_because_but',"because / but",'because','but',"He stayed home ___ sick.",'이유는 because! 반대는 but예요.','이유because!', 'connector','middle','middle1','mi_because','but','so'),
    R('rule_although',"although / because",'Although','Because',"___ tired, he ran.",'양보는 Although! 이유는 Because예요.','양보Although!', 'connector','middle','middle2','mi_although','Because','So'),
    R('rule_were',"were / was (가정법)",'were','was',"If I ___ rich, I would travel.",'가정법 be는 were! was는 안 돼요.','I were!', 'subjunctive','middle','middle3','mi_subj_past','was','am'),
    R('rule_would_have',"would have / will",'would have helped','will help',"If asked, I ___ you. (과거)",'과거 후회는 would have! will은 안 돼요.','후회=would have!', 'subjunctive','middle','middle3','mi_subj_perf','will help','helped'),
    R('rule_suggest',"suggest 원형",'go','goes',"They suggested he ___.",'suggest 뒤 that절 원형! -s 안 돼요.','당위=원형!', 'mandative','middle','middle3','mi_subj_should','goes','went'),
    R('rule_necessary',"necessary 원형",'be','is',"It is necessary she ___.",'necessary 뒤 원형! is 안 돼요.','INE+원형!', 'mandative','high','high2','hi_mand_adj','is','was'),
    R('rule_lie_lay',"lie / lay",'lie','lay',"I ___ down. (눕는다)",'눕다lie! 놓다lay예요.','눕다lie!', 'subjunctive','high','high1','hi_confuse_lie','lay','laid'),
    R('rule_rise_raise',"rise / raise",'raise','rise',"___ your hand. (들다)",'올리다raise! 오르다rise예요.','올리다raise!', 'subjunctive','high','high1','hi_confuse_rise','rise','rose'),
    R('rule_affect',"affect / effect",'affect','effect',"Smoking ___ health. (동사)",'동사는 affect! 명사는 effect예요.','A동사!', 'subjunctive','high','high2','hi_confuse_affect','effect','affects to'),
    R('rule_return',"return / return back",'return','return back',"Please ___ the book.",'return back 중복! return만 써요.','중복 빼기!', 'subjunctive','high','high2','hi_confuse_affect','return back','return again'),
    R('rule_each_is',"each is / are",'is','are',"Each ___ ready.",'each는 단수! is예요.','each+단수!', 'sentence','middle','middle3','mi_concise','are','were'),
    R('rule_never',"never 단독",'never smoke','never don’t smoke',"I ___ smoke.",'never 하나면 not 금지! 이중부정 안 돼요.','부정 하나!', 'sentence','middle','middle1','mi_neg_basic','never don’t smoke','never not smoke'),
    R('rule_either_too',"either / too",'either','too',"I don’t like it, ___.",'부정 동의 either! 긍정 too예요.','부정either!', 'sentence','middle','middle2','mi_too_either','too','also'),
    R('rule_the_piano',"the piano / piano",'the','(무관사)',"play ___ piano",'악기는 the piano! 운동은 무관사예요.','악기the!', 'article','middle','middle2','mi_article_use','(무관사)','a'),
    R('rule_breakfast',"breakfast 무관사",'breakfast','a breakfast',"have ___",'식사는 무관사! a 금지예요.','식사×!', 'article','middle','middle2','mi_article_use','a breakfast','the breakfast'),
    R('rule_some_any',"some / any",'any','some',"Do you have ___ milk?",'질문·부정은 any! 긍정은 some예요.','질문any!', 'article','middle','middle2','mi_some_any','some','no'),
    R('rule_so_such',"so / such",'such','so',"___ a kind man!",'a+형용사+명사 앞 such! so 뒤 형용사예요.','such+a!', 'subjunctive','high','high1','hi_confuse_lie','so','very')
  ];
})();
