# 문법아 놀자! (gram.chatgpts.kr)

초등·중등·고등 영문법 기초부터 **GTELP 실전 모의고사**까지!
AI 없이 정적 데이터와 규칙 기반 문제로 동작하는 영문법 학습 서비스입니다.

- 서비스명: 문법아 놀자!
- 서비스 ID: `gram`
- 도메인: https://gram.chatgpts.kr
- AI 기능 없음 (Gemini/OpenAI/Claude 등 일체 사용 안 함)

## 학습 흐름

```
초등 영문법 (40개념) → 중등 영문법 (50개념) → 고등 영문법 (40개념)
→ GTELP 실전 (12개념 + 모의고사 26문항/20분)
```

## 실제 시험 반영 (GTELP Level 2)

공식 시험 구조(문법 26문항/20분 + 청취 26문항/약30분 + 독해·어휘 28문항/40분,
총 80문항/약 90분)를 확인했고, **문법 7개 유형 분포**를 그대로 재현합니다.

| 유형 | 문항 | 포인트 |
|---|---|---|
| 시제 | 6 | yesterday·for·since·by 신호어 |
| 가정법 | 6 | if절 시제로 과거/과거완료 구분 |
| 준동사 | 5 | 동명사 3 + to부정사 2, 앞 동사로 구분 |
| 조동사 | 2 | 문맥 대입 |
| 연결어 | 2 | 앞뒤 논리(대조·원인·결과·양보) |
| 관계사 | 2 | 선행사 → 절 역할 3단계 |
| 당위성 | 3 | suggest·insist·demand + 동사원형 |

청취는 오디오가 없어 제외하고, 접근법(질문 먼저→신호어→메모) 개념으로 대비합니다.

## 데이터 (정적 JS, AI 없음)

| 종류 | 개수 | 파일 |
|---|---|---|
| 개념 | 142 (초등40·중등50·고등40·GTELP12) | `js/concept-data*.js` |
| 문제 | 312 (초등80·중등100·고등80·GTELP52) | `js/problem-data-*.js` |
| 헷갈리는 표현 | 51 (it's/its~so/such) | `js/rule-data.js` |
| 예문 | 150 | `js/example-data.js` |

모든 문제는 정해진 정답으로 프론트엔드에서 바로 채점됩니다.
긴 자유 서술형·AI 첨삭 기능은 없습니다.

## 페이지

| 페이지 | 설명 |
|---|---|
| `index.html` | 홈 대시보드 (오늘의 문법·5문제·꿀팁) |
| `concepts.html` / `concept-view.html` | 개념 목록·상세 (예문·꿀팁·확인문제) |
| `practice.html` | 과정·카테고리·개념별 문제 풀이 |
| `quiz.html` | 개념·빈칸·헷갈림·종합 퀴즈 |
| `mock.html` | GTELP 실전 모의고사 (26문항/20분, OMR, 유형별 분석) |
| `worksheet.html` | A4 인쇄용 학습지 |
| `progress.html` / `stats.html` | 진도·오답노트·통계 |
| `login.html` / `admin.html` | Google 로그인·관리자 |

## Supabase 설정

공용 `auth.users` + `public.service_members(service='gram')` + `gram` 스키마.
네가 직접 실행하는 쿼리: `supabase/migrations/001_gram_schema.sql`
(Supabase 대시보드 → SQL Editor에 붙여넣고 실행)

테이블: `user_settings`, `concept_progress`, `practice_progress`,
`quiz_results` (모의고사 포함), `wrong_notes`, `study_log`
(RLS: 본인 데이터만 조회/저장)

- Exposed schemas에 `gram` 추가
- 상세: `docs/supabase-gram-setup.md`, `docs/google-login-setup.md`

## 로그인

- Google 로그인 전용 (`js/cg-auth.js`, 원본: `_shared/cg-auth.js`)
- 비로그인: localStorage만 사용 (`gram_*` 키)
- 로그인: Supabase 저장 + 로그인 시 localStorage 병합
- 헤더 로그인 슬롯 1개 (`.auth-box`)

## 광고

- `ads.txt` + `google-adsense-account` meta + `js/cg-ads.js` 조건부 로딩
- 관리자/광고제거/프리미엄은 스크립트 미로드 (`localStorage cg_adfree`)
- `admin.html`에는 광고 없음, 아동 대상 `tfat=1`

## 배포

정적 호스팅 (Vercel): 루트를 `gram` 폴더로 지정하면 됩니다.
`vercel.json` / `robots.txt` / `sitemap.xml` 포함.

## 참고한 것

- grammar-clinic (`/Users/kimjinhyung/Desktop/home/grammar-clinic`):
  Python 앱 + React 확장 구조, Gemini는 확장(`extension/src/services/gemini.ts`,
  `api/gemini.ts`)에서만 사용 → **gram에 AI 코드 일체 복사 안 함**.
  정적 문제 데이터 구조(문제·보기·정답·해설) 아이디어만 참고.
- playhanja: 카드 UI, `cg-auth.js` 로그인 구조
- math: 대시보드형 index, 오늘의 미션 카드
- science: 포털 구조, `cg-ads.js`, 페이지/JS 뼈대
- GTELP 공식 사이트 + `gtelp.pdf` (목차·7유형 흐름 참고용, git 제외)
