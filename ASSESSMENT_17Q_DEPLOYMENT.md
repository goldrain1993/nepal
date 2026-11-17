# 2026학년도 엔트리 개발자 모드 2차 수행평가 — 17문항 / AI 1차 채점

## 수정 내용
- 17문항(객관식 11·서술형 6)을 학생용 수행평가에 반영. 기존 Firebase `fields` 9개 묶음 구조는 유지하므로 기존 DB 데이터는 삭제하거나 이동하지 않음.
- 객관식은 Cloud Functions 서버에 있는 정답표로 정확히 채점하고, 서술형 6문항만 OpenAI API를 통해 의미 중심의 1차 판단.
- 영역별 총점: 기초 개념 30/25/20/15, 알고리즘 적용 30/25/20/15, 이해·설명 40/30/20/10. 총 40~100점, 5점 간격.
- 교사 대시보드에 '선택 학급 AI 일괄 채점' 추가. 미제출·성적 확정 학생 제외, 중지/진행 상태/반복 오류 차단 제공.
- 교사 확인 체크 3개와 채점 근거 필수는 계속 유지. AI가 공식 성적을 자동 확정하지 않음.
- 기존 9문항 형식 제출본은 새 17문항으로 임의 변환하거나 자동 채점하지 않음. 확인 대상으로 남김.
- `assessment-preview.html`은 브라우저 로컬 데이터만 사용하는 독립 미리보기로 그대로 유지.

## 웹 파일
- `assessment.html`에서 `nepal_assessment_guided_v2.js`를 읽음.
- `nepal_assessment.js`의 평가 기준 버전은 `mission-comprehension-2026-v3`.
- `nepal_assessment_guided_v2.js`에 17문항 표시·입력·저장 연동 구현.

## 중요: Firebase Functions 서버 별도 배포
GitHub Pages 웹 파일을 반영하는 것만으로 AI 채점 서버가 바뀌지 않습니다. **학교의 외부 AI 서비스 이용 및 개인정보 처리 기준을 확인한 뒤** 관리자 환경에서 Firebase CLI로 다음을 배포해야 합니다.

```bash
firebase login
firebase deploy --project nepal-entry-classroom --only functions:gradeNepalAssessment,functions:getNepalAssessmentGradebook
```

기존 서버가 정상 배포된 경우 `OPENAI_API_KEY` Secret은 Firebase 서버에만 보관합니다. 브라우저 또는 GitHub Pages에 API 키를 입력하거나 노출하지 마세요.

## 운영 전 검증 순서
1. 학교 시험용 계정과 교사 계정으로 로그인. 학생 공개 설정이 의도한 상태인지 확인
2. 테스트용 조의 엔트리 코드를 먼저 서버 저장한 뒤 학생용 17문항 모두 작성 및 임시 저장
3. 새로고침 후 답안 복원 및 17문항 최종 제출을 확인 (제출 후 재제출 차단)
4. 교사 화면에서 해당 제출본 조회, 'AI 1차 채점' 1명 실행하여 버전 v3·17개 판단 확인
5. 선택한 1개 학급 대상으로 일괄 채점(실제 학생 답안 전송 전에 학교 지침 및 개인정보 처리 확인 필요)
6. 서술형 정답·부분정답·오개념 예시를 교사가 확인하고 확정점수 및 CSV 출력 검증
7. 옛날 9문항 제출본과 이미 확정된 성적이 바뀌거나 삭제되지 않았는지 확인

## 주의 및 롤백
- 이미 최종 제출한 학생 답안은 교사가 임의로 수정하지 않음.
- `aiReviews`에 생성되는 v3 기록은 AI 제안이며 `reviews`의 교사 확정 기록을 덮어쓰지 않음.
- GitHub Pages 변경을 되돌려도 Firebase Functions 배포는 별도 관리해야 함.


## 2026-11-17 추가 변경: 반 추가 및 조 없는 개인 수행평가

- 현황판 반 추가 경로를 보안 규칙과 동일한 \`nepal-v27/public/settings/classCount\`로 정정했습니다. 기존 \`nepal-v27/public/classes/settings/classCount\`는 잘못된 경로였습니다.
- 개인 수행평가 로그인은 학교 Google 계정 + 반 + 이름만 사용합니다. 메인 네팔/엔트리의 조별 로그인과 편집기는 그대로 유지합니다.
- 개인 수행평가 임시 저장·제출에는 \`groupId\`, \`codeSnapshot\`, \`codeBytes\`가 필요하지 않습니다. 신규 제출물 \`version: 2\`는 학교 계정 UID별 1회만 작성됩니다.
- 과거에 제출된 \`version: 1\`의 조별 코드 포함 문서는 그대로 남겨 둡니다. 기존 데이터 삭제·마이그레이션은 하지 않습니다.
- \`firebase.rules.json\`을 수정했으므로 **Firebase Realtime Database 보안 규칙 게시가 필수**입니다. 웹 코드만 갱신하면 새 형식의 임시 저장·제출이 거부됩니다.
- AI 채점 기준은 \`mission-comprehension-2026-v4\`로 변경되었습니다. Cloud Functions도 다시 배포해야 합니다.

### 기존 Windows 환경에서 재배포

기존 \`C:\nepal\` 환경에서 우선 로컬의 Firebase 규칙과 함수 코드를 백업한 뒤 최신 파일을 내려받습니다.

\`\`\`bat
cd /d C:\nepal
copy firebase.rules.json firebase.rules.json.bak
copy functions\index.js functions\index.js.bak
curl.exe -fL "https://raw.githubusercontent.com/goldrain1993/nepal/main/firebase.rules.json" -o "C:\nepal\firebase.rules.json"
curl.exe -fL "https://raw.githubusercontent.com/goldrain1993/nepal/main/functions/index.js" -o "C:\nepal\functions\index.js"
node --check functions\index.js
firebase deploy --project nepal-entry-classroom --only database
firebase deploy --project nepal-entry-classroom --only "functions:gradeNepalAssessment,functions:getNepalAssessmentGradebook"
\`\`\`

**중요:** 데이터베이스 규칙 파일을 배포하면 Firebase의 현재 규칙 전체를 파일 내용으로 교체합니다. 학교에서 Firebase 콘솔에서 직접 수정한 미반영 규칙이 있다면 먼저 백업·비교·병합하세요. 배포는 학생 데이터 자체를 삭제하지 않으나 보안 접근 동작에 영향을 줍니다.

### 확인

1. 교사 로그인 → 현황판 → [＋ 반 추가] → 반 선택에 12반 등이 나타나는지 확인
2. 조 로그인 없이 학교 Google 계정 + 반·이름으로 개인 수행평가에 입장
3. 테스트 답안 임시 저장 → 새로고침 → 복원 확인 → 최종 제출 (조별 코드 없어도 가능)
4. 교사 제출목록에서 반·학생 이름만 표시되는지 확인
5. 테스트 제출물 1건에 AI 1차 채점 실행 → v4 결과와 서술형 판단 확인
6. 기존 네팔 홍수·엔트리 조별 로그인, 조별 코드 및 진행도 저장 확인

성적과 실제 학생 기록에 영향을 주는 테스트는 사용하지 않는 테스트 계정에서만 실시합니다.
