# 2차 수행평가 AI 1차 채점 · Firebase Cloud Functions 배포 안내

> GitHub Pages(학생/교사 화면)와 Firebase Cloud Functions(AI 서버)는 **서로 다른 배포 대상**입니다.
> GitHub에 `functions/index.js`를 수정해도 실제 Cloud Functions 서버가 자동 갱신되지는 않습니다.

## 배포 전
- Firebase 프로젝트: `nepal-entry-classroom`
- 함수 이름: `gradeNepalAssessment` / 리전: `asia-northeast3`
- Firebase CLI 로그인 권한, Cloud Functions 사용 권한 및 Blaze 요금제 확인
- 학교의 학생 개인정보 처리·외부 AI 서비스 이용 지침을 확인한 후, 익명화된 시험용 답안으로 우선 검증
- OpenAI API 키는 GitHub, HTML/JS, 수업 자료, 채팅에 **기재하지 않음**

## 최신 `main` 소스를 내려받아 프로젝트 루트에서 실행
```bash
npm install -g firebase-tools
firebase login
npm --prefix functions install
firebase functions:secrets:set OPENAI_API_KEY --project nepal-entry-classroom
firebase deploy --only functions:gradeNepalAssessment --project nepal-entry-classroom
firebase functions:list --project nepal-entry-classroom
```

`firebase functions:secrets:set` 명령이 비밀 값을 안전하게 입력받습니다.
값을 명령행 옵션, 터미널 스크립트, GitHub 저장소에 직접 넣지 마세요.

## 배포 후 교사 검증 절차
1. 학교 지침에 따라 이용 가능한 **시험용 학생 답안**을 최종 제출합니다.
2. 교사 계정으로 로그인 → **수행평가** → 해당 제출자 **보기**.
3. **AI 1차 채점 실행**에서 개인정보 처리 확인 후 AI 결과 요청.
4. AI 결과에 `mission-comprehension-2026-v1` 기준을 사용하는지 확인.
5. 9개 문항별 판단과 3개 영역의 채점 근거를 원본 답안·엔트리 코드와 대조합니다.
6. 필요한 경우 교사 점수를 변경하고, **3가지 교사 검증 확인**에 체크합니다.
7. 채점 근거를 작성한 뒤 **교사 최종 점수 확정**을 누릅니다.

## 점수와 안전장치
- 개념 설계: 30 / 25 / 20 / 15
- 알고리즘 적용: 30 / 25 / 20 / 15
- 이해·설명: 40 / 30 / 20 / 10
- 최저점 40 / 최고점 100
- AI는 제안 결과를 `aiReviews`에 기록하고, 공식 확정점수는 교사가 `reviews`에 별도로 저장합니다.
- 최신 AI 기준과 다른 이전 제안은 화면에서 사용이 차단됩니다.
- 학생 이름/연락처 패턴은 서버에서 가리고, 엔트리 코드는 원문을 전송하지 않고 블록 종류·개수만 전송합니다. **자유서술에 있는 모든 식별정보가 자동 제거된다고 보장할 수 없으므로** 교사의 사전 점검이 필요합니다.
- 조별 코드 통계만으로 학생 개인 역량이나 프로그램 실행 성공을 확정할 수 없습니다.

## 문제 발생 시
- 버튼에 이전 채점 서버 오류: 위 함수 재배포 및 캐시 강력 새로고침
- 404 / function not found: Cloud Functions 미배포 가능성
- 403 / permission-denied: 등록된 교사 계정·권한 확인
- internal: Firebase Functions 로그를 확인하고 OpenAI API 키 설정·요금·API 응답 확인
- 실패해도 **교사 직접 채점은 계속 가능**합니다.
