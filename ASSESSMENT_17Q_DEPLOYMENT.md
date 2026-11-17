# 2026학년도 2차 수행평가 — 17문항 / 개별 문항 화면 / 반별 공개

## 프로그램 현행 동작 (2026-11-17)

- 수행평가는 학교 Google 계정의 반과 본인 이름으로 식별되는 **개인별 평가**입니다. 메인 네팔/엔트리의 조 선택·코드 저장과 무관합니다.
- 17문항(객관식 11·서술형 6)을 한 화면에서 **한 문항씩** 이동합니다. 상단 1~17번 버튼에 작성 완료, 열람했으나 미응답, 미열람 상태가 표시됩니다.
- **미응답 제출을 허용**합니다. 단, 모든 문항 화면을 한 번씩 열어야 하며, 실제 최종 제출 버튼은 17번 문항에서만 활성화됩니다. 열람 이력은 학생 UID별 브라우저 로컬에 저장합니다.
- 기본점수는 **40점**: 기초 개념 15점 + 알고리즘 적용 15점 + 이해·설명 10점. 전부 미응답·오답이면 40점이며 최대 100점, 영역별 4단계 점수로 5점 단위입니다.
- 객관식은 Cloud Functions 정답표로 채점합니다. 서술형은 외부 AI가 1차 판단하고 교사가 최종 성적을 확정합니다. 서술형이 6문항 모두 비어 있으면 API를 호출하지 않고 기본 10점을 제안합니다. 일부 빈칸도 '보완 필요'로 처리합니다.
- 평가용 푸른색 테마를 학생·교사 평가 화면에 적용했습니다.
- 교사 공개 설정은 **반별**입니다. Firebase \`nepal-v27/private/assessments/config/enabledByClass/c1\`~\`c20\`의 Boolean으로 저장합니다. **기존 전체 공개 \`config/enabled\` 값은 무시합니다. 신규 반별 설정은 기본 비공개입니다.**
- 공개한 반만 학생의 개인별 초안·최종 제출을 허용하도록 Firebase Realtime Database 보안 규칙도 제한합니다.
- 이미 제출된 기존 version 1/2 데이터나 교사가 확정한 점수는 수정하거나 삭제하지 않습니다. 신규 제출은 기존과 동일한 학생 UID별 생성 1회 제한을 유지합니다.
- 기존 9문항 형식의 제출본은 새 17문항으로 임의 채점하지 않습니다.
- 별도 로컬 미리보기 \`assessment-preview.html\`은 실제 Firebase 데이터를 이용하지 않습니다.

## 변경 파일

- \`assessment.html\`: 수행평가 대문 및 JS 캐시 버전
- \`nepal_assessment_guided_v2.js\`: 17문항 한 화면 한 문제, 방문·작성 여부, 이전·다음 및 마지막 제출, 푸른 테마
- \`nepal_assessment.js\`: 미응답 허용, 반별 공개 교사 관리, 평가 기준 버전 v5
- \`nepal_assessment_portal.js\`: 학교 계정 반에 해당하는 공개 여부를 실시간으로 읽음
- \`firebase.rules.json\`: 반별 공개값 설정 및 학생 초안·제출 쓰기 차단
- \`functions/index.js\`: 빈 답변 파싱·채점, v5 기준

## 운영 서버 배포 — 기존 Windows C:\nepal 기준

이미 Firebase CLI, 인증, Blaze, OpenAI Secret을 설정했다면 그 작업은 반복하지 않아도 됩니다.

**주의:** \`firebase deploy --only database\`는 Realtime Database 보안 규칙 전체를 로컬 파일 내용으로 교체합니다. 현재 Firebase 콘솔에서만 적용한 별도 수정이 있다면 **먼저 규칙을 백업하고 서로 비교하여 병합**하세요. 백업 없는 전체 규칙 덮어쓰기를 피해야 합니다.

\`\`\`bat
cd /d C:\nepal
copy firebase.rules.json firebase.rules.json.bak
copy functions\index.js functions\index.js.bak
curl.exe -fL "https://raw.githubusercontent.com/goldrain1993/nepal/main/firebase.rules.json" -o firebase.rules.json
curl.exe -fL "https://raw.githubusercontent.com/goldrain1993/nepal/main/functions/index.js" -o functions\index.js
node --check functions\index.js
firebase deploy --project nepal-entry-classroom --only database
firebase deploy --project nepal-entry-classroom --only "functions:gradeNepalAssessment,functions:getNepalAssessmentGradebook"
\`\`\`

기존 \`OPENAI_API_KEY\` Secret은 서버에 보관합니다. 웹 코드·GitHub에 비밀키를 넣지 않습니다. 학교 개인정보 처리 기준상 외부 AI로 학생 서술형을 전송해도 되는지 사전에 확인합니다.

## 실제 운영 전 필수 점검

1. 규칙과 함수 배포 성공 여부 확인. 학생에게 공개하기 전 교사 로그인, 반별 버튼 1~20(현재 개설 반까지) 표시 확인
2. 예시로 1반만 공개, 2반 비공개 상태인지 학교 테스트 계정으로 확인
3. 1반 테스트 계정으로 1~17번 이동: 상단 문항 상태·이전/다음·열람수·작성수가 맞는지 확인
4. 17번으로 바로 이동하면 아직 미열람 문항이 있어 제출 버튼이 비활성화되어야 함
5. 모든 문항을 방문해 답을 빈칸으로 유지한 뒤 제출: 성공하며 AI 기준 40점이 제안되는지 확인
6. 일부 객관식/서술형 답안 제출: 정답 개수·미응답 처리·교사 최종 확정·CSV 확인
7. 학급 공개를 닫은 후 그 반에서 새로운 제출이 차단되는지 확인. 다른 반에는 영향이 없어야 함
8. 기존 네팔 홍수·엔트리 조별 로그인과 기존 학생 제출 기록이 정상 유지되는지 확인

**중요:** 서버 배포 전 GitHub 웹 화면만 바꾸면 반별 공개 설정 또는 개인별 제출이 정상 작동하지 않을 수 있습니다. 실제 학생 제출을 시작하기 전 테스트용 계정으로 전체 흐름을 확인하세요.

## 되돌리기

GitHub 웹 파일을 이전 커밋으로 되돌리는 것과 Firebase Database 규칙·Cloud Functions 배포는 서로 별개입니다. 필요하면 규칙·함수의 이전 검증본을 다시 배포해야 합니다. 실제 학생 데이터는 임의로 삭제하지 마세요.
