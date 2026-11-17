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
