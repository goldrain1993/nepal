/**
 * NEPAL FLOOD × EntryJS - integration v4.0 native simulator menu login · role login · flood score · 3-person groups
 * Add <script src="./nepal_entry_mode.js" defer></script> to the original index.html.
 * Keep original simulator unchanged. This overlay mounts a real EntryJS editor page in a same-origin iframe.
 * Six staged missions: water variable, water risk condition, independent flow/vibration/rain risk, list+loop alarm.
 */
(function () {
  'use strict';
  if (document.getElementById('nepal-entry-trigger')) return;
  const css = document.createElement('style');
  css.textContent = `
  #nepal-entry-trigger{position:fixed;z-index:12000;right:22px;bottom:20px;padding:15px 22px;border:2px solid #b8f480;border-radius:12px;background:#142916;color:#daffb6;font:800 15px/1.4 system-ui,'Malgun Gothic',sans-serif;box-shadow:0 8px 34px #0009;cursor:pointer}
  #nepal-entry-layer{position:fixed;inset:0;z-index:12500;background:#050b08;color:#e7f5dd;display:none;font-family:system-ui,'Malgun Gothic',sans-serif}
  #nepal-entry-layer.open{display:flex;flex-direction:column}
  #nepal-entry-layer *{box-sizing:border-box}
  .ne-header{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#0c1c13;border-bottom:1px solid #335339;padding:12px 18px}
  .ne-header strong{color:#b1ed65;font-size:19px;letter-spacing:.035em}
  .ne-header button,.ne-side button{border:1px solid #4c7150;border-radius:9px;padding:9px 13px;background:#17331d;color:#ecffe2;cursor:pointer;font-weight:800}
  .ne-main{display:grid;grid-template-columns:minmax(285px,27%) minmax(0,1fr);flex:1;min-height:0}
  .ne-side{border-right:1px solid #2a5132;background:#101e16;overflow:auto;padding:18px}
  .ne-mission-list{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin:12px 0}
  #ne-teacher-records{margin:9px 0;padding:8px 10px;background:#18331c;border:1px solid #456c3e;border-radius:8px;font-size:11px;line-height:1.55;color:#d2ffc0}
  #ne-teacher-records[hidden]{display:none!important}
  .ne-mission-list button.final-button{grid-column:span 2;background:#264d22;color:#d7ffb6;border-color:#a0e76a;letter-spacing:.05em}
  .ne-mission-list button{padding:10px 3px;font-size:12px}
  .ne-mission-list button.current{background:#9fe761;color:#11240f}
  .ne-mission-list button.passed{border-color:#8aca69;background:#173820;color:#caffb6}
  .ne-mission-list button.current.passed{background:#9fe761;color:#11240f}
  .ne-mission-list button.locked,.ne-mission-list button:disabled{background:#152019;border:1px solid #36493b;color:#697b6d;cursor:not-allowed;opacity:.82}
  .ne-mission-list button:focus-visible{outline:2px solid #b8f480;outline-offset:2px}
  #ne-next{width:100%;margin-top:9px;background:#b5f17c;color:#183013;display:none;font-size:14px;padding:11px;font-weight:900}
  #ne-next:disabled{opacity:.5;cursor:not-allowed}
  #ne-learning-note{font-size:12px;color:#d4edc3;line-height:1.55;padding:10px;background:#102919;border-left:3px solid #9cdb69;margin:7px 0}
  #ne-saved-live{margin:7px 0;padding:9px 12px;background:#0a1416;border:1px solid #437060;border-radius:8px;color:#d5e9ed;font-size:13px;line-height:1.6}
  #ne-saved-live b{color:#b4eefd}
  .ne-warning{background:#361b19;border:1px solid #e5795f;border-left:5px solid #ff8a6b;border-radius:9px;padding:16px 14px;margin:12px 0}
  .ne-warning h2{margin:3px 0 8px;font-size:22px;color:#ffbe94;line-height:1.3}
  .ne-warning p{color:#ffe4d4;font-size:13px;line-height:1.75;margin:0}
  .ne-task{background:#152d16;border:1px solid #58773c;border-radius:9px;padding:15px;margin:12px 0;line-height:1.7;font-size:14px}
  .ne-task b{display:block;color:#baf283;margin-bottom:6px}
  .ne-sample{background:#080f0e;border:1px solid #315039;border-radius:9px;padding:13px;font-size:13px;margin:12px 0}
  .ne-sample span{color:#a9dd84}
  #ne-sensor-live{margin:10px 0 4px;padding:10px 12px;background:#143021;border:1px solid #508153;border-radius:9px;color:#c8f6b0;font-size:13px;line-height:1.55}
  #ne-sensor-live strong{font-size:18px;color:#f4ffed}
  #ne-status{font-size:12px;color:#c9e2c4;white-space:pre-wrap;line-height:1.6;margin-top:12px}
  .ne-editor-stage{min-width:0;min-height:0;position:relative;overflow:hidden;background:#f8fff8}
  /* Shared 48px toolbar replaces the iframe's native title strip in both modes.
     It never overlaps the sensor sidebar, map or editor workspace. */
  #ne-workspace-toolbar{position:absolute;top:0;left:0;right:0;height:48px;z-index:15;
    display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 13px;
    background:#e9f1e6;color:#21431d;border-bottom:1px solid #c1d9bc;font-size:13px;font-weight:800}
  #ne-workspace-heading{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-right:auto}
  #ne-audio-actions{display:flex;align-items:center;gap:5px;flex:0 0 auto}
  #ne-entry-audio-toggle{min-height:31px;padding:5px 9px;font-size:11px;font-weight:800;background:#e1edd7;color:#21431d;border:1px solid #a2c293;border-radius:7px;cursor:pointer}
  #ne-arioso-credit{font-size:13px;text-decoration:none;color:inherit;padding:3px}
  @media(max-width:730px){#ne-entry-audio-toggle{font-size:10px;padding:4px 5px}#ne-arioso-credit{display:none}}
  #nepal-entry-layer.ne-sim-visible #ne-workspace-toolbar{background:#13251a;color:#e9ffc8;border-bottom-color:#46693d}
  #ne-iframe{margin-top:48px;height:calc(100% - 48px)!important}
  #ne-entry-loading{top:48px!important}
  #ne-iframe{display:block;width:100%;height:100%;border:0;background:white;visibility:hidden}
  .ne-entry-loading{position:absolute;inset:0;z-index:8;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 51% 39%,#e6ffca 0%,#f7fff1 46%,#eff8f4 100%);color:#294d2d;text-align:center;transition:opacity .22s ease}
  .ne-entry-loading.done{opacity:0;visibility:hidden;pointer-events:none}
  .ne-loading-center{display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px}
  .ne-loader-mascot{position:relative;width:136px;height:142px;animation:ne-float 1.9s ease-in-out infinite}
  .ne-mascot-face{position:absolute;left:17px;top:32px;width:102px;height:93px;background:linear-gradient(145deg,#bdfc89,#8ddb67);border:5px solid #357f4c;border-radius:38% 38% 42% 42%;box-shadow:0 13px 0 #498e57,0 18px 21px #204c2c28}
  .ne-mascot-screen{position:absolute;left:13px;top:18px;width:68px;height:43px;border-radius:19px;background:#203f38;display:flex;align-items:center;justify-content:space-evenly}
  .ne-mascot-eye{width:12px;height:16px;border-radius:50%;background:#dcffd4;animation:ne-blink 4.2s ease-in-out infinite}
  .ne-mascot-mouth{position:absolute;width:18px;height:7px;left:37px;top:67px;border-bottom:4px solid #255843;border-radius:50%}
  .ne-mascot-antenna{position:absolute;top:8px;left:65px;width:6px;height:29px;background:#357f4c;border-radius:8px}
  .ne-mascot-antenna::after{content:'';position:absolute;top:-10px;left:-5px;width:16px;height:16px;border-radius:50%;background:#96db35;border:3px solid #357f4c}
  .ne-mascot-arm{position:absolute;top:79px;width:22px;height:31px;background:#93df6e;border:4px solid #357f4c;border-radius:30px}
  .ne-mascot-arm.left{left:0;transform:rotate(21deg)}.ne-mascot-arm.right{right:0;transform:rotate(-21deg)}
  .ne-loading-title{font-size:22px;font-weight:900;letter-spacing:-.03em}.ne-loading-sub{font-size:13px;color:#65806b}
  .ne-loading-dots{display:flex;gap:7px;justify-content:center;margin-top:7px}.ne-loading-dots i{display:block;width:9px;height:9px;border-radius:50%;background:#77b933;animation:ne-dots 1.05s ease-in-out infinite}.ne-loading-dots i:nth-child(2){animation-delay:.14s}.ne-loading-dots i:nth-child(3){animation-delay:.28s}
  @keyframes ne-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  @keyframes ne-blink{0%,43%,47%,100%{transform:scaleY(1)}45%{transform:scaleY(.1)}}
  @keyframes ne-dots{0%,70%,100%{opacity:.35;transform:translateY(0)}35%{opacity:1;transform:translateY(-5px)}}
  @media(prefers-reduced-motion:reduce){.ne-loader-mascot,.ne-mascot-eye,.ne-loading-dots i{animation:none}}

  #ne-mini{font-size:12px;color:#9bbb96;line-height:1.8}
  .ne-editor-stage #ne-sim-stage{display:none;position:absolute;inset:48px 0 0;z-index:3;overflow:hidden;background:#061009}
  #nepal-entry-layer.ne-sim-visible #ne-sim-stage{display:block}
  #nepal-entry-layer.ne-sim-visible #ne-iframe,#nepal-entry-layer.ne-sim-visible #ne-entry-loading{display:none!important}
  #ne-mode-switch{display:none;position:static;flex:0 0 auto;max-width:58%;min-height:36px;background:#b9ed74;color:#122518;border:1px solid #648a48;border-radius:9px;padding:7px 14px;font-weight:900;cursor:pointer;white-space:nowrap;box-shadow:0 2px 7px #0002}
  #nepal-entry-layer.ne-sensor-mission #ne-mode-switch{display:block}
  #ne-sim-stage #app{height:100%;width:100%;min-height:0}
  #ne-sim-stage #assessmentTabBtn,#ne-sim-stage #assessmentPane,#ne-sim-stage #run,#ne-sim-stage #replay,#ne-sim-stage #design,#ne-sim-stage #nepal-design-save{display:none!important}
  /* Mission 6 shows only original observation and sensor-placement cards.
     Thresholds, operators, and the N-of-four alarm are EntryJS-only. */
  #ne-sim-stage #practicePane > section.card.ne-mission6-hidden{display:none!important}
  #ne-sim-stage .panel{padding:12px 12px 22px!important;scroll-padding-top:12px!important}
  #ne-sim-stage .panel > div:first-child,
  #ne-sim-stage .panel > .sub,
  #ne-sim-stage .panel > .tabs{display:none!important}
  #ne-sim-stage #practicePane{display:block!important}
  #ne-sim-stage #practicePane > section.card{margin-top:8px}
  #ne-mission6-sensor-tip{border:1px solid #86c958;background:#162b1a;color:#e5ffcf;
    border-radius:10px;padding:10px 12px;font-size:12px;line-height:1.6}
  /* Match the ordinary simulator: floating controls belong to bottom-right. */
  body.nepal-mission6-sim #nepal-entry-trigger,
  body.nepal-mission6-sim #nepal-class-board,
  body.nepal-mission6-sim #nepal-class-switch{
    left:auto!important;right:22px!important;
    z-index:12900!important;max-width:220px!important;
  }
  body.nepal-mission6-sim #nepal-entry-trigger{display:block!important;bottom:16px!important}
  body.nepal-mission6-sim #nepal-class-board{bottom:79px!important}
  body.nepal-mission6-sim #nepal-class-switch{bottom:133px!important}
  @media(max-width:800px){
    body.nepal-mission6-sim #nepal-entry-trigger,
    body.nepal-mission6-sim #nepal-class-board,
    body.nepal-mission6-sim #nepal-class-switch{left:auto!important;right:14px!important}
  }
  #ne-sim-stage #sensorType optgroup:last-child option:first-child{display:none!important}
  #ne-sim-stage #dataMode,#ne-sim-stage #replayControls{display:none!important}
  #ne-mission5-report{display:none;margin:12px 0;padding:15px;border:1px solid #89c95c;background:#10241a;border-radius:12px;font-size:13px;color:#dcffcf}
  #ne-mission5-report strong{font-size:28px;color:#b6f36f}
  #nepal-entry-layer.ne-graded-mission #ne-mission5-report{display:block}
  #legendOverlay.show{z-index:30000!important}
  
  @media(max-width:800px){.ne-main{grid-template-columns:1fr;grid-template-rows:minmax(220px,38%) minmax(0,1fr)}.ne-side{border-right:0;border-bottom:1px solid #355439}}
  `;
  document.head.appendChild(css);
  // Missions 1-5 use independent fictional classroom thresholds:
  // water >= 4m, flow >= 3m/s, vibration >= 16, rainfall >= 35mm/h.
  // These are learning-only values and are not read from the flood simulator.
  // Mission 6 thresholds are authored separately by students in EntryJS.
  const missions = [
    {title:'수위 측정값 저장',fault:'수위 센서값이 저장되지 않습니다!',description:'수위 센서는 계속 값을 측정하지만, 측정값을 저장할 변수가 없습니다. 먼저 값을 저장해 보세요.',task:'「수위값」 변수를 만들고 「수위 센서가 현재 측정하고 있는 실시간 값」 블록으로 현재 값을 한 번 저장하세요.',example:'수위 4.20m → 수위값 4.20',active:true},
    {title:'실시간 수위값 갱신',fault:'수위값이 계속 바뀌지 않습니다!',description:'한 번 저장한 센서값으로는 실시간 변화를 반영할 수 없습니다. 반복문으로 값을 갱신해 보세요.',task:'「계속 반복하기」 안에서 「수위값」에 최신 수위 센서값을 다시 저장하도록 만드세요. 0.2초 기다리기는 권장하지만 필수는 아닙니다.',example:'수위 1.35 → 3.60 → 2.05에 따라 수위값도 계속 변함',active:true},
    {title:'수위 위험 판단',fault:'수위 위험 여부를 판단하지 못합니다!',description:'변수와 반복문을 배웠으니 이번에는 조건문을 이용해 수위 위험 여부를 계산하세요.',task:'「수위위험」 변수를 만들고 실습용 기준 수위 4m 이상은 1(위험), 4m 미만은 0(안전)이 되도록 조건문을 작성하세요. 이 판단도 「계속 반복하기」 안에서 갱신하세요.',example:'수위 3.50m → 수위위험 0 / 수위 4.80m → 수위위험 1',active:true},
    {title:'유속·진동·강수 확장',fault:'다른 센서들의 위험 신호도 만들어야 합니다!',description:'수위의 위험 판단을 유속·진동·강수 센서로 확장해 보세요.',task:'「유속값」·「진동값」·「강수값」 및 각 위험 변수를 만들고 실습용 기준 유속 3m/s 이상·진동 16 이상·강수 35mm/h 이상이면 1, 아니면 0이 되도록 반복해서 갱신하세요.',example:'유속 3.60 → 위험 1 / 진동 15.50 → 위험 0 / 강수 40 → 위험 1',active:true},
    {title:'센서 배치·경보 알고리즘',fault:'실제 센서 데이터를 이용해 경보를 완성하세요!',description:'센서를 네팔 지형에 배치하고 4개 센서의 위험 기준·비교 방향을 엔트리 코드로 직접 정하세요. 리스트 없이 경보 알고리즘을 완성한 후 100회 평가를 받습니다.',task:'「🗺 센서 설치 화면」에서 ① 관측 지점을 살펴보고 ② 수위·유속·진동·강수 센서를 하나씩 설치하세요. 엔트리에서 실시간 센서값과 4개의 위험신호를 갱신하고, 리스트 없이 「위험개수」를 계산해 N개 이상(N=1~4) 위험하면 「경보결과」가 1이 되도록 구현하세요. 학생 코드로 100회 재난 평가를 받습니다.',example:'4개 센서 설치 → 엔트리에서 위험 기준과 경보 N 직접 설정 → 100회 평가 및 점수 획득',active:true},
    {title:'리스트로 위험신호 정리',fault:'4개의 위험신호를 리스트로 정리해 보세요!',description:'미션 5의 경보 알고리즘은 유지하면서 이번에는 리스트 자료구조와 반복문만 집중 연습합니다. 100회 평가는 다음 FINAL 미션에서 다시 진행합니다.',task:'「위험목록」 리스트를 만들고 수위위험·유속위험·진동위험·강수위험을 차례대로 4칸에 저장하세요. 매번 최신 위험신호로 리스트 항목을 바꾸고, 「반복번호」와 「반복하기」를 이용해 리스트의 1~4번째 값을 확인해 「위험개수」를 계산하세요. 기존 경보결과를 유지하면 통과합니다.',example:'위험목록 [1, 0, 1, 0] → 반복해서 1의 개수 세기 → 위험개수 2',active:true},
    {title:'FINAL 미션',fault:'지금까지 만든 재난 경보 시스템을 최종 검증하세요!',description:'센서 위치 설계·위험 조건·리스트·반복문·경보 판단을 모두 결합해 최종 재난 경보 시스템을 완성하세요.',task:'필요하면 센서 설치 화면에서 ① 관측 지점과 ② 센서 설치를 다시 확인하세요. 엔트리에서 4개의 위험신호를 「위험목록」 리스트에 저장하고 반복문으로 「위험개수」를 세어 N개 이상 위험하면 경보가 울리게 하세요. 전체 코드를 검사한 뒤 100회 재난 평가에 도전하세요.',example:'센서 위치 + 4개 위험 판단 + 리스트·반복문 + 경보 알고리즘 → FINAL 100회 평가',active:true}

  ];
  // v4.0: The NORMAL Nepal 100-run evaluation keeps its exact formula;
  // only LEGEND eligibility changes to score >= 97, with NO evac-failure limit.
  if(typeof window.calculatePerformanceRank==='function' && !window.calculatePerformanceRank.__nepalV40){
    const originalRank=window.calculatePerformanceRank;
    const relaxedRank=function(...args){
      const result=originalRank.apply(this,args);
      if(result && Number.isFinite(Number(result.score)) && Number(result.score)>=97){
        result.rank='LEGEND';result.css='rank-legend';
        result.desc='종합 성능 점수 97점 이상으로 LEGEND 등급을 달성했습니다!';
      }
      return result;
    };
    relaxedRank.__nepalV40=true;
    window.calculatePerformanceRank=relaxedRank;
  }
  // Login lives IN the original simulator start menu, not in a new overlay.
  // Prevent its original simulation actions before the classroom module is ready.
  const preAuthButtons=['enterLabBtn','enterAssessmentBtn','enterHowBtn'].map(id=>document.getElementById(id));
  if(preAuthButtons.every(Boolean)){
    ['🎒 학생 로그인','🧑‍🏫 교사 로그인','🌐 게스트 입장'].forEach((name,i)=>{
      preAuthButtons[i].textContent=name;
      preAuthButtons[i].disabled=true;
    });
  }
  const trigger = document.createElement('button'); trigger.id='nepal-entry-trigger'; trigger.textContent='🧩 엔트리 개발자 모드';trigger.style.display='none';
  const layer = document.createElement('section'); layer.id='nepal-entry-layer';
  layer.innerHTML=`<header class="ne-header"><div><strong>NEPAL FLOOD × ENTRY</strong><div style="font-size:11px;color:#b4caa9">7단계 재난 경보 코딩 미션</div></div><button id="ne-close">✕ 시뮬레이션으로 돌아가기</button></header><main class="ne-main"><aside class="ne-side"><div style="font-size:11px;color:#b2e879;font-weight:900">SYSTEM REPAIR / DEVELOPMENT CONSOLE</div><div id="ne-learning-note"><b>① 수위값 1회 저장</b> → <b>② 실시간 반복 갱신</b> → <b>③ 수위 위험 판단</b> → <b>④ 다른 센서 확장</b> → <b>⑤ 경보 알고리즘</b> → <b>⑥ 리스트 학습</b> → <b>🏆 FINAL</b></div><div id="ne-missions" class="ne-mission-list"></div><div id="ne-teacher-records" hidden></div><div class="ne-warning"><h2 id="ne-fault"></h2><p id="ne-why"></p></div><div class="ne-task"><b>🛠 복구 임무</b><div id="ne-task"></div></div><div class="ne-sample"><span>예상 입력·출력</span><br><div id="ne-example"></div></div><div id="ne-mission5-report"><div>🌊 <span id="ne-grade-title">경보 성능평가</span></div><strong id="ne-mission5-grade">미평가</strong><div id="ne-mission5-score">엔트리 코드를 검사하면 100회 재난 평가를 실행합니다.</div><div id="ne-mission5-progress" style="font-size:12px;margin-top:6px;color:#b7cfa9"></div></div><div id="ne-sensor-live">📡 수위 센서 측정값 수신 중…</div><div id="ne-saved-live">📊 엔트리 변수 상태: <b>실행 전</b></div><button id="ne-check" style="background:#adeb6f;color:#142009;width:100%;font-size:15px;padding:14px">▶ 엔트리 실행 결과 검사</button><div id="ne-status" aria-live="polite">미션을 읽고 블록을 연결해 보세요.</div><button type="button" id="ne-next">▶ 다음 라운드로 이동</button></aside><div class="ne-editor-stage"><div id="ne-workspace-toolbar"><span id="ne-workspace-heading">🧩 엔트리 코딩 편집기</span><div id="ne-audio-actions"><button id="ne-entry-audio-toggle" type="button" aria-pressed="true">♫ 아리오소 ON</button><a id="ne-arioso-credit" href="https://commons.wikimedia.org/wiki/File:Violinist_CARRIE_REHKOPF-BACH_ARIOSO.ogg" target="_blank" rel="noopener noreferrer" title="연주 Carrie Rehkopf · CC BY-SA 3.0 · 음원 출처">ⓘ</a></div><button id="ne-mode-switch" type="button">🗺 센서 설치 화면</button></div><div id="ne-sim-stage"></div><iframe id="ne-iframe" title="실제 엔트리 코딩 편집기" src="about:blank" data-src="./nepal_entry_editor.html?v=43"></iframe><div id="ne-entry-loading" class="ne-entry-loading" role="status" aria-live="polite"><div class="ne-loading-center"><div class="ne-loader-mascot" aria-hidden="true"><div class="ne-mascot-antenna"></div><div class="ne-mascot-arm left"></div><div class="ne-mascot-arm right"></div><div class="ne-mascot-face"><div class="ne-mascot-screen"><i class="ne-mascot-eye"></i><i class="ne-mascot-eye"></i></div><div class="ne-mascot-mouth"></div></div></div><div class="ne-loading-title" id="ne-loading-title">로딩중입니다</div><div class="ne-loading-sub" id="ne-loading-sub">잠깐만요, 블록을 가져올게요 ✨</div><div class="ne-loading-dots" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div></main>`;
  // Pause the original simulator's background animation loops without altering index.html.
  // The two named rAF loops are global function declarations in the original page.
  // Their drawing work is skipped while EntryJS covers the simulator; their ordinary
  // behavior resumes when the user returns.
  function pauseOriginalDrawWhileEditing(name){
    const old = window[name];
    if(typeof old!=='function' || old.__nepalPauseWrapper)return;
    function gatedFrame(...args){
      if(layer.classList.contains('open') && !layer.classList.contains('ne-sim-visible')){window.requestAnimationFrame(gatedFrame);return;}
      return old.apply(this,args);
    }
    gatedFrame.__nepalPauseWrapper=true;
    window[name]=gatedFrame;
  }
  pauseOriginalDrawWhileEditing('frame');
  pauseOriginalDrawWhileEditing('animateStartFx');

  let previousSoundEnabled=null;
  let previousAmbientPlaying=false;
  function silenceOriginalSimulator(){
    try{
      if(typeof uiSoundEnabled==='undefined')return;
      previousSoundEnabled=uiSoundEnabled;
      previousAmbientPlaying=typeof ambientStarted!=='undefined' && ambientStarted;
      uiSoundEnabled=false;
      if(typeof stopAmbient==='function')stopAmbient();
      if(typeof syncSoundButtons==='function')syncSoundButtons();
      // Prevent ongoing audio work while EntryJS runs. No new AudioContext is created.
      if(typeof audioCtx!=='undefined' && audioCtx && audioCtx.state==='running'){
        audioCtx.suspend().catch(()=>{});
      }
    }catch(error){console.warn('[NEPAL ENTRY] 배경음 중지',error)}
  }
  // Developer-only Bach Arioso BWV 156 (Carrie Rehkopf, CC BY-SA 3.0).
  // Wikimedia's MP3 transcoding avoids OGG codec problems on school devices.
  // A separate, lightweight AudioContext creates the "뾱" tap tone.
  const ariosoUrl='https://upload.wikimedia.org/wikipedia/commons/transcoded/5/53/Violinist_CARRIE_REHKOPF-BACH_ARIOSO.ogg/Violinist_CARRIE_REHKOPF-BACH_ARIOSO.ogg.mp3';
  const ariosoOggUrl='https://upload.wikimedia.org/wikipedia/commons/5/53/Violinist_CARRIE_REHKOPF-BACH_ARIOSO.ogg';
  let ariosoFallbackAttempted=false;
  const ariosoAudio=new Audio();
  ariosoAudio.preload='none';ariosoAudio.src=ariosoUrl;ariosoAudio.loop=true;ariosoAudio.volume=.27;
  let entrySoundOn=true,entryAudioCtx=null,entryTapAt=0,entryAudioError=false,entryAutoPlayBlocked=false;
  const audioButton=document.getElementById('ne-entry-audio-toggle');
  function refreshEntryAudioButton(){
    if(!audioButton)return;
    audioButton.textContent=entrySoundOn?(entryAutoPlayBlocked?'♫ 아리오소 재생':'♫ 아리오소 ON'):'♫ 아리오소 OFF';
    audioButton.title=entryAudioError?'아리오소 음원 연결 실패 · 눌러 다시 시도':'Bach Arioso BWV 156 · 연주 Carrie Rehkopf (CC BY-SA 3.0) · 켜기/끄기';
    audioButton.setAttribute('aria-pressed',String(entrySoundOn));
  }
  function unlockEntryPop(){
    try{
      const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
      const ctx=entryAudioCtx||(entryAudioCtx=new C());
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
    }catch(_){}
  }
  // Prepare sound with a REAL pointer gesture before asynchronous Firebase lock
  // acquisition; otherwise the iframe message alone may lack user activation.
  trigger.addEventListener('pointerdown',unlockEntryPop,{passive:true});
  function playEntryPop(){
    if(!entrySoundOn||!layer.classList.contains('open'))return;
    const at=performance.now();if(at-entryTapAt<42)return;
    entryTapAt=at;
    try{
      const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
      const ctx=entryAudioCtx||(entryAudioCtx=new C());
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      if(ctx.state==='closed')return;
      const now=ctx.currentTime+.007,o=ctx.createOscillator(),g=ctx.createGain();
      o.type='sine';
      o.frequency.setValueAtTime(680,now);
      o.frequency.exponentialRampToValueAtTime(360,now+.092);
      g.gain.setValueAtTime(.0001,now);
      g.gain.exponentialRampToValueAtTime(.11,now+.004);
      g.gain.exponentialRampToValueAtTime(.0001,now+.11);
      o.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+.125);
    }catch(_){}
  }
  function playEntryBgm(){
    if(!entrySoundOn||!layer.classList.contains('open'))return;
    const p=ariosoAudio.play();
    if(p&&typeof p.then==='function')p.then(()=>{
      entryAutoPlayBlocked=false;entryAudioError=false;refreshEntryAudioButton();
    }).catch(e=>{
      if(e?.name==='NotAllowedError')entryAutoPlayBlocked=true;
      else entryAudioError=true;
      refreshEntryAudioButton();
    });
  }
  function pauseEntrySounds(){
    ariosoAudio.pause();ariosoAudio.currentTime=0;
    if(entryAudioCtx?.state==='running')entryAudioCtx.suspend().catch(()=>{});
  }
  audioButton?.addEventListener('click',()=>{
    if(entrySoundOn&&(entryAutoPlayBlocked||entryAudioError)){
      if(entryAudioError){
        ariosoFallbackAttempted=false;ariosoAudio.src=ariosoUrl;ariosoAudio.load();
      }
      entryAutoPlayBlocked=false;entryAudioError=false;playEntryBgm();refreshEntryAudioButton();return;
    }
    entrySoundOn=!entrySoundOn;entryAudioError=false;entryAutoPlayBlocked=false;
    refreshEntryAudioButton();
    if(entrySoundOn){playEntryPop();playEntryBgm()}else pauseEntrySounds();
  });
  ariosoAudio.addEventListener('error',()=>{
    if(!ariosoFallbackAttempted){
      ariosoFallbackAttempted=true;ariosoAudio.src=ariosoOggUrl;
      if(layer.classList.contains('open')&&entrySoundOn)playEntryBgm();
    }else{entryAudioError=true;refreshEntryAudioButton();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)ariosoAudio.pause();else if(layer.classList.contains('open'))playEntryBgm()});
  refreshEntryAudioButton();
  // Parent overlay interactions (missions, buttons, sensor setup screen).
  layer.addEventListener('pointerdown',e=>{
    if(e.target.closest('button,select,input,label,[role="button"],.ne-mission-list'))playEntryPop();
  },true);
  // The EntryJS Blockly workspace is in a same-origin iframe. Notify the
  // parent only on a genuine pointer event to avoid idle sound floods.
  window.addEventListener('message',e=>{
    if(e.source===iframe.contentWindow&&e.origin===location.origin&&e.data?.type==='NEPAL_ENTRY_UI_TAP')playEntryPop();
  });

  function restoreOriginalSimulatorSound(){
    try{
      if(previousSoundEnabled===null || typeof uiSoundEnabled==='undefined')return;
      uiSoundEnabled=previousSoundEnabled;
      if(typeof syncSoundButtons==='function')syncSoundButtons();
      if(previousSoundEnabled && typeof audioCtx!=='undefined' && audioCtx && audioCtx.state==='suspended'){
        audioCtx.resume().then(()=>{
          if(previousAmbientPlaying && typeof startAmbient==='function')startAmbient();
        }).catch(()=>{});
      }else if(previousSoundEnabled && previousAmbientPlaying && typeof startAmbient==='function'){
        startAmbient();
      }
      previousSoundEnabled=null;
      previousAmbientPlaying=false;
    }catch(error){console.warn('[NEPAL ENTRY] 배경음 복구',error)}
  }
  let classroom=null;
  let projectRestoring=false;
  const loadingOverlay=layer.querySelector('#ne-entry-loading');
  const loadingTitle=layer.querySelector('#ne-loading-title');
  const loadingSub=layer.querySelector('#ne-loading-sub');
  const retryLoadingButton=document.createElement('button');
  retryLoadingButton.type='button';retryLoadingButton.id='ne-editor-retry';
  retryLoadingButton.textContent='↻ 엔트리 다시 불러오기';
  retryLoadingButton.style.cssText='margin-top:16px;padding:11px 20px;border:1px solid #a7e579;background:#254b31;color:#f2ffe9;border-radius:10px;font-weight:800;cursor:pointer';
  retryLoadingButton.hidden=true;
  loadingOverlay.querySelector('.ne-loading-center')?.appendChild(retryLoadingButton);
  let editorBootWatchdog=null;
  function scheduleEditorBootWatchdog(){
    clearTimeout(editorBootWatchdog);
    editorBootWatchdog=setTimeout(()=>{
      if(!ready&&layer.classList.contains('open')){
        loadingSub.textContent='연결 시간이 길어지고 있어요. 아래 버튼으로 다시 시도할 수 있습니다.';
        retryLoadingButton.hidden=false;
      }
    },45000);
  }
  function showEditorLoading(){
    if(ready&&!projectRestoring){hideEditorLoading();return}
    loadingTitle.textContent='로딩중입니다';
    loadingSub.textContent='잠깐만요, 블록을 가져올게요 ✨';
    retryLoadingButton.hidden=true;
    loadingOverlay.classList.remove('done');
    iframe.style.visibility='hidden';
  }
  function hideEditorLoading(){
    clearTimeout(editorBootWatchdog);
    retryLoadingButton.hidden=true;
    polishEntryFrame();
    iframe.style.visibility='visible';
    loadingOverlay.classList.add('done');
  }
  function polishEntryFrame(){
    try{
      const doc=iframe.contentDocument;
      if(!doc || !doc.getElementById('top'))return;
      if(!doc.getElementById('nepal-student-friendly-style')){
        const style=doc.createElement('style');style.id='nepal-student-friendly-style';
        style.textContent='#top #status,#top #assets-status,#top #nepal-sensor-preview,#top #nepal-block-inspector{display:none!important}#top>span:last-child:empty{display:none!important}#nepal-block-panel{display:none!important}';
        doc.head.appendChild(style);
      }
      const heading=doc.querySelector('#top>span:first-child');
      if(heading)heading.textContent='🧩 엔트리 코딩 편집기';
    }catch(e){console.warn('엔트리 편집기 화면 정리:',e)}
  }
  // Network-only warmup: do not run the costly EntryJS editor in the background.
  let entryWarmupQueued=false;
  function queueEntryWarmup(){
    if(entryWarmupQueued)return;
    entryWarmupQueued=true;
    for(const host of ['https://cdn.jsdelivr.net','https://entry-cdn.pstatic.net']){
      const link=document.createElement('link');
      link.rel='preconnect';link.href=host;document.head.appendChild(link);
    }
    const warm=()=>{
      const urls=[
        './nepal_entry_editor.html?v=43',
        './lib/vendor/jquery-3.7.1.min.js',
        './lib/vendor/jquery-ui-1.13.3.min.js',
        './lib/vendor/codemirror-5.65.20-show-hint.js',
        './lib/vendor/codemirror-5.65.20-javascript.js'
      ];
      urls.forEach((href,index)=>setTimeout(()=>{
        const link=document.createElement('link');
        link.rel='prefetch';link.href=href;
        document.head.appendChild(link);
      },index*250));
    };
    if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:4000});
    else setTimeout(warm,1800);
  }
  retryLoadingButton.addEventListener('click',()=>{
    if(ready||checking||projectRestoring)return;
    ready=false;
    iframe.dataset.loaded='yes';
    iframe.src='about:blank';
    showEditorLoading();
    setTimeout(()=>{
      if(!layer.classList.contains('open'))return;
      iframe.src=iframe.dataset.src;
      scheduleEditorBootWatchdog();
    },160);
  });
  const launch = () => {
    if(layer.classList.contains('open'))return;
    silenceOriginalSimulator();
    layer.classList.add('open');trigger.style.display='none';
    playEntryBgm();
    showEditorLoading();updateMissionButtons();
    if(!ready)scheduleEditorBootWatchdog();
    // Delay the costly EntryJS dependencies until the first explicit opening.
    if(iframe.dataset.loaded!=='yes'){
      iframe.dataset.loaded='yes';
      iframe.src=iframe.dataset.src;
    }else{
      iframe.contentWindow?.postMessage({type:'NEPAL_DEV_RESUME'},location.origin);
      pushSensorMeasurement();
    }
  };
  const close = () => {
    exitMission5Setup();
    if(!layer.classList.contains('open'))return;
    // The classroom module saves and releases the edit lock BEFORE hiding this editor.
    // Stop student code when leaving so an infinite repeat does not consume CPU.
    iframe.contentWindow?.postMessage({type:'NEPAL_DEV_PAUSE'},location.origin);
    layer.classList.remove('open');pauseEntrySounds();if(classroom)classroom.refreshUI?.();
    restoreOriginalSimulatorSound();
  };
  trigger.addEventListener('click',()=>{
    if(classroom)classroom.openEditor();
    else alert('학급 입장 화면을 준비 중입니다. 잠시 뒤 다시 눌러주세요.');
  });
  document.body.append(trigger,layer);
  const floatBoard=document.createElement('button');floatBoard.id='nepal-class-board';
  floatBoard.textContent='📊 조별 현황판';
  floatBoard.style.cssText='position:fixed;z-index:12000;right:22px;bottom:83px;padding:12px 18px;background:#102b22;color:#ecffd8;border:1px solid #7ebc65;border-radius:10px;font:800 13px system-ui;cursor:pointer';
  floatBoard.style.display='none';
  floatBoard.onclick=()=>classroom?.showBoard(false);
  document.body.appendChild(floatBoard);
  const floatSignout=document.createElement('button');floatSignout.id='nepal-class-switch';
  floatSignout.textContent='🚪 로그아웃';
  floatSignout.style.cssText='position:fixed;z-index:12000;right:22px;bottom:137px;padding:9px 16px;background:#152619;color:#dbf0d5;border:1px solid #507859;border-radius:10px;font:700 12px system-ui;cursor:pointer';
  floatSignout.style.display='none';
  floatSignout.onclick=()=>classroom?.isGuest?.()?classroom?.showLogin?.():classroom?.signout?.();
  document.body.appendChild(floatSignout);
  document.getElementById('ne-close').addEventListener('click',()=>{if(classroom)classroom.closeEditing();else close();});
  const iframe=document.getElementById('ne-iframe'), status=document.getElementById('ne-status');
  iframe.addEventListener('load',()=>{if(iframe.dataset.loaded==='yes')polishEntryFrame()});
  // Bridge the *actual* installed flood simulator water-level sensor to the
  // EntryJS reporter. While no sensor/scenario exists, provide changing demo
  // observations and explicitly label them as simulation training data.
  // Internal measurement values are intentionally NOT Entry variables.
  // Change once per broadcast; both the sidebar and Entry reporter see the
  // identical sample. Math.random is used only for the training sensors.
  const nepalTrainingReadings={water:2.1,flow:1.8,vibration:12.5,rain:21};
  function advanceTrainingReadings(){
    const limits={water:[1.0,4.5,.33],flow:[.5,4.2,.31],vibration:[8,17,.65],rain:[12,32,1.0]};
    for(const [key,[min,max,delta]] of Object.entries(limits)){
      const next=nepalTrainingReadings[key]+(Math.random()*2-1)*delta;
      nepalTrainingReadings[key]=Math.round(Math.max(min,Math.min(max,next))*100)/100;
    }
  }
  function getNepalWaterMeasurement(){
    try{
      if(typeof scenario!=='undefined' && scenario &&
         typeof sensors!=='undefined' && Array.isArray(sensors) &&
         typeof sensorValue==='function' && typeof stepIndex==='number'){
        const water=sensors.find(s=>s.type==='수위 센서');
        if(water){
          const val=Number(sensorValue(water,stepIndex));
          if(Number.isFinite(val))return {value:Math.round(val*100)/100,source:'원본 홍수 시뮬레이션 수위 센서'};
        }
      }
    }catch(err){console.warn('수위 센서 연결 대기',err)}
    return {value:nepalTrainingReadings.water,source:'실습용 가상 수위 센서'};
  }
  function getNepalSensorMeasurement(kind){
    if(kind==='water')return getNepalWaterMeasurement();
    const label=({flow:'유속 센서',vibration:'진동 센서',rain:'강수 센서'})[kind];
    try{
      if(typeof scenario!=='undefined' && scenario &&
         typeof sensors!=='undefined' && Array.isArray(sensors) &&
         typeof sensorValue==='function' && typeof stepIndex==='number'){
        const match=sensors.find(s=>s.type===label);
        if(match){
          const v=Number(sensorValue(match,stepIndex));
          if(Number.isFinite(v))return {value:Math.round(v*100)/100,source:'원본 홍수 시뮬레이션 '+label};
        }
      }
    }catch(err){console.warn(label+' 연결 대기',err)}
    return {value:nepalTrainingReadings[kind],source:'실습용 가상 '+label};
  }
  function pushSensorMeasurement(){
    if(!layer.classList.contains('open'))return;
    if(!layer.classList.contains('open') || !ready)return;
    advanceTrainingReadings();
    const readings={};
    for(const kind of ['water','flow','vibration','rain']){
      const reading=getNepalSensorMeasurement(kind);
      readings[kind]=reading;
      try{iframe.contentWindow?.postMessage({type:'NEPAL_SENSOR_TELEMETRY',sensor:kind,...reading},location.origin)}catch(e){console.warn(e)}
    }
    const display=document.getElementById('ne-sensor-live');
    if(display){
      const fmt=r=>Number(r.value).toFixed(2);
      display.innerHTML=(mission<=2)
       ?'📡 '+readings.water.source+'<br><strong>'+fmt(readings.water)+' m</strong> · 센서는 계속 측정 중'
       :'📡 센서 측정값 (미리 만들어진 변수 아님)<br><strong>수위 '+fmt(readings.water)+'m · 유속 '+fmt(readings.flow)+'m/s · 진동 '+fmt(readings.vibration)+' · 강수 '+fmt(readings.rain)+'mm/h</strong>';
    }
  }
  setInterval(pushSensorMeasurement,800);

  let mission=0, ready=false, checking=false, pendingMission=null, navigating=false, missionStopPending=null;
  // This progress belongs to the current browser page, not to a student account.
  // Reloading resets it so a different student does not inherit another's marks.
  const passed=Array(missions.length).fill(false);
  // EntryJS clears runtime variable values when a mission check stops the engine.
  // Preserve only the value VERIFIED during the check, not an old live snapshot.
  const verifiedWaterByMission=Array(missions.length).fill(null);
  const missionBtns=document.getElementById('ne-missions');
  const checkBtn=document.getElementById('ne-check');
  const nextBtn=document.getElementById('ne-next');
  // Show clear reasons without exposing every hidden test value or block recipe.
  // The raw diagnostic stays available to teachers in the browser console.
  function explainMissionFailure(stage,result){
    const lines=Array.isArray(result.details)?result.details.map(String):[];
    const raw=lines.join(' ');
    console.info('[NEPAL 미션 검사 세부 내용]',stage+1,lines);
    if(typeof result.studentFeedback==='string'&&result.studentFeedback.trim())
      return '확인할 부분: '+result.studentFeedback.trim();
    const missing=raw.match(/「([^」]+)」\s*변수(?:가|를|는)?(?:\s*없습니다|\s*찾지 못했습니다|\s*만들어)/);
    if(missing)return '확인할 부분: 「'+missing[1]+'」 변수를 찾지 못했어요. 미션에 적힌 이름과 만든 변수 이름을 비교해 보세요.';
    if(raw.includes('「위험목록」 리스트')&&raw.includes('필요'))
      return '확인할 부분: 이번 미션에서 사용할 「위험목록」 리스트가 아직 없어요.';
    if(raw.includes('「위험목록」 리스트')&&raw.includes('만들'))
      return '확인할 부분: 「위험목록」 리스트가 아직 만들어지지 않았어요.';
    if(raw.includes('변수')&&raw.includes('찾지 못했습니다'))
      return '확인할 부분: 미션에 필요한 변수 중 아직 만들어지지 않은 것이 있어요. 변수 이름을 비교해 보세요.';
    if(raw.includes('센서의 측정값이')||raw.includes('측정값')&&raw.includes('변수로 전달'))
      return '확인할 부분: 센서가 읽은 값이 「수위값」에 제대로 저장되지 않고 있어요.';
    if(raw.includes('반복')&&(raw.includes('안')||raw.includes('계속')||raw.includes('갱신'))){
      if(stage===1)return '확인할 부분: 수위가 바뀐 뒤에도 「수위값」이 최신 값으로 달라지지 않았어요.';
      if(stage===2)return '확인할 부분: 수위가 달라질 때마다 측정값과 위험 판단이 함께 바뀌지 않고 있어요.';
      if(stage===3)return '확인할 부분: 센서값이 바뀔 때마다 모든 센서의 값과 위험 판단이 함께 갱신되지 않아요.';
      return '확인할 부분: 센서값이 변한 뒤에도 위험신호나 경보 결과 일부가 갱신되지 않아요.';
    }
    if(stage===0)
      return '확인할 부분: 「수위값」에 저장된 숫자가 센서의 현재 측정값과 달라요.';
    if(stage===1)
      return '확인할 부분: 센서의 수위가 바뀌어도 「수위값」이 그 변화를 계속 따라가지 못해요.';
    if(stage===2){
      if(raw.includes('조건문')||raw.includes('판단'))return '확인할 부분: 수위가 바뀔 때 안전과 위험을 다시 판단하는 과정이 제대로 작동하지 않아요.';
      return '확인할 부분: 수위 측정과 「수위위험」의 결과 중 일부가 실습 기준과 맞지 않아요.';
    }
    if(stage===3)
      return '확인할 부분: 유속·진동·강수 중 일부의 측정값 또는 위험 판단 결과가 기준과 맞지 않아요.';
    if(raw.includes('이전 방식')||raw.includes('예전'))return '확인할 부분: 현재 미션에서 사용할 수 없는 예전 방식의 센서 블록이 포함되어 있어요.';
    if(raw.includes('위험목록')||raw.includes('리스트'))
      return '확인할 부분: 센서의 위험신호가 바뀌어도 리스트 또는 위험개수에 같은 내용이 반영되지 않아요.';
    if(raw.includes('경보')||raw.includes('위험개수')||raw.includes('위험 판정'))
      return '확인할 부분: 센서들의 위험신호와 최종 경보 결과가 서로 일치하지 않는 경우가 있어요.';
    if(raw.includes('실행 또는 검사 오류')||raw.includes('시간 초과'))
      return '검사 도중 기술적인 문제가 발생했어요. 코드를 저장한 뒤 다시 검사해 보세요. 계속 발생하면 선생님께 알려 주세요.';
    return '확인할 부분: 센서 측정값과 변수·판단 결과가 미션의 일부 검사 상황에서 맞지 않았어요. 마지막으로 바꾼 부분을 살펴보세요.';
  }
  function teacherPreview(){return classroom?.isTeacher?.()===true;}
  function showTeacherRecords(){
    const el=document.getElementById('ne-teacher-records');if(!el)return;
    el.hidden=!teacherPreview();
    if(el.hidden)return;
    const d=classroom?.getTeacherScores?.()||{},str=key=>{
      const score=Number(d[key]?.score);
      return Number.isFinite(score)&&d[key]?.score!=null?score.toFixed(1)+'점':'미평가';
    };
    el.textContent='🧑‍🏫 교사 모드 · 저장된 최고 점수: 형성평가 '+str('floodBest')+
      ' / 미션 5 '+str('mission5NoListBest')+' / FINAL '+str('finalBest');
  }
  function unlocked(index){return teacherPreview() || index===0 || passed[index-1]===true;}
  function updateMissionButtons(){
    [...missionBtns.children].forEach((b,i)=>{
      const locked=!unlocked(i);
      b.disabled=locked || checking || navigating;
      b.classList.toggle('locked',locked);
      b.classList.toggle('passed',passed[i]);
      b.classList.toggle('current',mission===i);
      b.textContent=(locked?'🔒 ':passed[i]?'✓ ':'')+(i===6?'FINAL':String(i+1).padStart(2,'0'));
    b.classList.toggle('final-button',i===6);
      b.setAttribute('aria-label',`${i===6?'FINAL 미션':'미션 '+(i+1)} ${locked?'잠김':passed[i]?'통과':'진행 가능'}`);
      b.title=locked?`미션 ${i}을(를) 통과하면 열립니다.`:passed[i]?'통과한 미션입니다. 다시 열 수 있습니다.':`${i===6?'FINAL 미션':'미션 '+(i+1)} 열기`;
    });
    const usable=missions[mission]?.active===true;
    checkBtn.disabled=checking || navigating || !ready || !usable;
    nextBtn.style.display=(teacherPreview()||passed[mission]) && mission+1<missions.length?'block':'none';
    nextBtn.disabled=checking || navigating || !ready;
  }
  function renderMissionButtons(){
    missionBtns.replaceChildren();
    missions.forEach((m,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.onclick=()=>changeMission(i);
      missionBtns.appendChild(b);
    });
    updateMissionButtons();
  }
  // Prevent student code from running across missions. The iframe verifies stop.
  let changeToken=0;
  function applyMission(i){
    if(i!==4&&i!==6)exitMission5Setup();
    mission=i;const m=missions[i];
    layer.classList.toggle('ne-sensor-mission',i===4||i===6);
    showTeacherRecords();
    layer.classList.toggle('ne-graded-mission',i===4||i===6);
    document.getElementById('ne-grade-title').textContent=i===4?'미션 5 성능평가':'FINAL 성능평가';
    if(i===4||i===6){
      document.getElementById('ne-mission5-grade').textContent='미평가';
      document.getElementById('ne-mission5-score').textContent='엔트리 코드를 검사하면 100회 재난 평가를 실행합니다.';
      document.getElementById('ne-mission5-progress').textContent='';
    }
    document.getElementById('ne-sensor-live').style.display='block';
    document.getElementById('ne-saved-live').style.display='block';
    document.getElementById('ne-saved-live').innerHTML='📊 엔트리 변수 상태: <b>실행 결과 대기 중</b>';
    document.getElementById('ne-fault').textContent=m.fault;
    document.getElementById('ne-why').textContent=m.description;
    document.getElementById('ne-task').textContent=m.task;
    document.getElementById('ne-example').textContent=m.example;
    checkBtn.textContent=(i===4||i===6)?'🚨 경보 알고리즘 검증 + 100회 평가':i===5?'📋 리스트·반복문 검사':'▶ 엔트리 실행 결과 검사';
    status.textContent=teacherPreview()?'🧑‍🏫 교사 모드':passed[i]?'✅ 통과한 미션입니다. 다른 코드도 시험할 수 있습니다.':'미션을 읽고 엔트리에서 블록을 연결해 보세요.';
    document.getElementById('ne-mode-switch').textContent='🗺 센서 설치 화면';
    updateMissionButtons();pushSensorMeasurement();
  }
  function changeMission(i){
    if(checking || !unlocked(i) || mission===i)return;
    if(!ready){applyMission(i);return;}
    if(navigating)return;
    navigating=true;updateMissionButtons();
    const token=++changeToken;
    const timeout=setTimeout(()=>{
      if(token===changeToken&&navigating){
        navigating=false;status.textContent='엔트리 실행 정지 확인이 지연됩니다. 잠시 뒤 다시 눌러주세요.';updateMissionButtons();
      }
    },5500);
    missionStopPending={token,target:i,timeout};
    iframe.contentWindow.postMessage({type:'NEPAL_STOP_FOR_MISSION',token},location.origin);
  }
  nextBtn.addEventListener('click',()=>{if((teacherPreview()||passed[mission]) && unlocked(mission+1) && mission+1<missions.length)changeMission(mission+1)});
  renderMissionButtons();applyMission(0);
  checkBtn.addEventListener('click',()=>{
    if(!ready){status.textContent='엔트리 편집기 로딩이 완료되지 않았습니다. 네트워크와 외부 라이브러리를 확인해 주세요.';return;}
    if(checking || navigating || !unlocked(mission) || !missions[mission]?.active)return;
    if(mission===4||mission===6){
      // Arm audio directly from the student's click (browser user gesture).
      // Background simulator music stays muted; only a LEGEND celebration uses audio.
      try{uiSoundEnabled=true;if(typeof unlockAudio==='function')unlockAudio();}catch(_){}
    }
    if(mission===4||mission===6){
      try{
        getMission5ConfiguredRules();
      }catch(err){status.textContent='⚠ '+String(err.message||err);return;}
    }
    checking=true;pendingMission=mission;updateMissionButtons();
    status.textContent='학생이 작성한 엔트리 코드를 원래 센서 기준으로 검사하는 중입니다…';
    iframe.contentWindow.postMessage({type:'NEPAL_TEST',mission},location.origin);
  });
  window.addEventListener('message',(event)=>{if(event.source!==iframe.contentWindow || event.origin!==location.origin)return; const d=event.data||{};
    classroom?.receiveFrameMessage(d);
    if(d.type==='ENTRY_READY'){
      ready=true;
      projectRestoring=true;
      pushSensorMeasurement();updateMissionButtons();
      status.textContent=teacherPreview()?'🧑‍🏫 교사 모드 · 저장된 코딩 결과가 복원되었습니다.':'미션을 읽고 엔트리 블록을 연결해 보세요.';
      // A saved student project may still be importing after EntryJS is initialized.
      // Keep the mascot visible until BOTH the editor and saved blocks are ready.
      Promise.resolve().then(()=>classroom?.onEntryReady?.()).catch(error=>{
        console.warn('조별 코딩 복원 안내:',error);
        status.textContent='이전 코딩 작업을 불러오지 못했습니다. 저장 상태를 확인해 주세요.';
      }).finally(()=>{
        projectRestoring=false;
        if(!ready)return;
        if(layer.classList.contains('open'))iframe.contentWindow?.postMessage({type:'NEPAL_DEV_RESUME'},location.origin);
        hideEditorLoading();updateMissionButtons();showTeacherRecords();
      });
    }
    if(d.type==='ENTRY_ERROR'){ready=false;checking=false;pendingMission=null;loadingTitle.textContent='코딩 친구가 잠시 멈췄어요';loadingSub.textContent='라이브러리 연결에 실패했습니다. 다시 불러오기를 눌러주세요.';retryLoadingButton.hidden=false;clearTimeout(editorBootWatchdog);loadingOverlay.classList.remove('done');updateMissionButtons();status.textContent='편집기 준비 중 오류: '+String(d.message||'알 수 없는 오류');}
    if(d.type==='ENTRY_CHECK_RESULT'){
      const tested=pendingMission;
      checking=false;pendingMission=null;
      if(tested===null)return;
      if(tested===0||tested===1){
        const checked=Number(d.verifiedWater);
        verifiedWaterByMission[tested]=d.ok && d.verifiedWater!==null &&
          d.verifiedWater!==undefined && Number.isFinite(checked)?checked:null;
        if(d.ok && mission===tested){
          const cell=document.querySelector('#ne-saved-live b');
          if(cell)cell.textContent='최근 검사 확인 · 수위값 '+checked.toFixed(2)+'m ✓ (현재 실행 정지)';
        }
      }
      if(d.ok && (tested===4||tested===6)){
        checking=true;
        status.textContent='✅ 엔트리 경보 조건 확인! 이제 실제 네팔 재난 100회 평가를 실행합니다.';
        updateMissionButtons();
        runMission5Native(d.alarmTable,d.threshold,d.rules,tested).catch(e=>{checking=false;uiSoundEnabled=false;status.textContent='❌ 100회 평가 오류: '+String(e.message||e);updateMissionButtons()});
        return;
      }
      if(d.ok){
        passed[tested]=true;
        const contiguous=passed.findIndex(flag=>!flag);
        classroom?.saveProgress(contiguous<0?missions.length:contiguous);
        classroom?.saveNow('mission-pass');
      }
      if((tested===4||tested===6)&&!d.ok)uiSoundEnabled=false;
      updateMissionButtons();
      const next=d.ok && tested+1<missions.length?'\n🔓 '+(tested===5?'FINAL 미션':'다음 미션 '+String(tested+2).padStart(2,'0'))+' 잠금이 해제되었습니다.':'';
      if(d.ok){
        status.textContent='✅ 복구 검사 통과!\n'+(Array.isArray(d.details)?d.details.join('\n'):String(d.message||''))+next;
      }else{
        const stageName=tested===6?'FINAL 미션':'미션 '+String(tested+1).padStart(2,'0');
        status.textContent='❌ '+stageName+' · 아직 통과하지 못했어요.\n'+explainMissionFailure(tested,d);
      }
    }
    if(d.type==='ENTRY_MISSION_STOPPED'){
      const p=missionStopPending;
      if(!p || p.token!==d.token)return;
      clearTimeout(p.timeout);missionStopPending=null;navigating=false;
      if(d.ok){classroom?.saveNow('mission-change');applyMission(p.target);}
      else{status.textContent='프로그램 정지 확인 실패: '+String(d.message||'다시 시도해 주세요.');updateMissionButtons();}
    }
    if(d.type==='ENTRY_VAR_SNAPSHOT'){
      const target=document.querySelector('#ne-saved-live b');
      if(target){
        const val=x=>x===null||x===undefined||x===''||!Number.isFinite(Number(x))?'미저장':Number(x).toFixed(2);
        const withUnit=(x,unit)=>{const number=val(x);return number==='미저장'?number:number+unit};
        const v=d.variables||{},r=d.risks||{};
        if(mission===0||mission===1){
          const stored=verifiedWaterByMission[mission];
          if(d.running)target.textContent='실행 중 · 수위값 '+withUnit(v.water,'m');
          else if(stored!==null)target.textContent='최근 검사 확인 · 수위값 '+stored.toFixed(2)+'m ✓ (현재 실행 정지)';
          else target.textContent='현재 실행 정지 · 수위값 '+withUnit(v.water,'m');
        }
        else if(mission===2)target.textContent='수위값 '+withUnit(v.water,'m')+' · 수위위험 '+val(r.water);
        else if(mission===3)target.textContent='유속값 '+withUnit(v.flow,'m/s')+' · 진동값 '+val(v.vibration)+' · 강수값 '+withUnit(v.rain,'mm/h')+' · 위험 '+val(r.flow)+' / '+val(r.vibration)+' / '+val(r.rain);
        else target.textContent='위험목록 ['+(Array.isArray(d.list)?d.list.map(val).join(', '):'')+'] · 위험개수 '+val(d.dangerCount)+' · 경보결과 '+val(d.alarm);
      }
    }
  });

  // Mission 06 sensor setup reuses the LIVE original simulator DOM and renderer.
  // Reparenting prevents a second simulator instance and preserves installed sensors.
  const portal=document.getElementById('ne-sim-stage');
  const modeSwitch=document.getElementById('ne-mode-switch');
  const nativeApp=document.getElementById('app');
  const originalAppParent=nativeApp?.parentNode;
  const originalAppSibling=nativeApp?.nextSibling;
  const mission6Practice=nativeApp?.querySelector('#practicePane');
  const originalPracticeChildren=mission6Practice?[...mission6Practice.children]:[];
  const mission6Cards=mission6Practice?[...mission6Practice.querySelectorAll(':scope > section.card')]:[];
  const mission6Tip=document.createElement('div');
  mission6Tip.id='ne-mission6-sensor-tip';
  mission6Tip.textContent='📡 ① 관측 지점 → ② 센서 설치. 기존 설치 위치는 유지됩니다.';
  function prepareMission6SensorPanel(){
    if(!mission6Practice||mission6Cards.length<3)return;
    const [observations,installation]=mission6Cards;
    // Preserve the native order (① observations → ② installation) and the
    // live simulator elements; never copy sensors or their installed positions.
    mission6Practice.prepend(observations,installation);
    mission6Cards.slice(2).forEach(card=>card.classList.add('ne-mission6-hidden'));
    mission6Practice.prepend(mission6Tip);
    const sensorSelect=document.getElementById('sensorType');
    if(sensorSelect?.value==='기온 센서')sensorSelect.value='강수 센서';
    if(typeof renderSensors==='function')renderSensors();
  }
  function restoreMission6SensorPanel(){
    mission6Tip.remove();
    mission6Cards.slice(2).forEach(card=>card.classList.remove('ne-mission6-hidden'));
    if(mission6Practice)originalPracticeChildren.forEach(node=>mission6Practice.appendChild(node));
  }
  function enterMission5Setup(){
    if((mission!==4&&mission!==6)||!nativeApp||!portal)return;
    if(typeof simRunning!=='undefined'&&simRunning){status.textContent='현재 시뮬레이션 실행이 끝난 뒤 센서를 배치해 주세요.';return;}
    iframe.contentWindow?.postMessage({type:'NEPAL_DEV_PAUSE'},location.origin);
    portal.appendChild(nativeApp);
    layer.classList.add('ne-sim-visible');
    document.body.classList.add('nepal-mission6-sim');
    try{
      document.getElementById('design')?.click();
      setSidebarTab('practice');
      prepareMission6SensorPanel();
      const panel=nativeApp.querySelector('.panel');
      if(panel)panel.scrollTop=0;
    }catch(e){console.warn('미션 6 센서 설치 화면',e)}
    document.getElementById('ne-workspace-heading').textContent='🗺 센서 설치 화면';
    modeSwitch.textContent='🧩 엔트리 코딩으로 돌아가기';
  }
  function exitMission5Setup(){
    if(!layer.classList.contains('ne-sim-visible'))return;
    layer.classList.remove('ne-sim-visible');
    document.body.classList.remove('nepal-mission6-sim');
    restoreMission6SensorPanel();
    if(nativeApp&&originalAppParent){originalAppParent.insertBefore(nativeApp,originalAppSibling);}
    document.getElementById('ne-workspace-heading').textContent='🧩 엔트리 코딩 편집기';
    modeSwitch.textContent='🗺 센서 설치 화면';
    if(ready&&layer.classList.contains('open'))iframe.contentWindow?.postMessage({type:'NEPAL_DEV_RESUME'},location.origin);
  }
  modeSwitch.onclick=()=>{if(layer.classList.contains('ne-sim-visible'))exitMission5Setup();else enterMission5Setup()};
  trigger.addEventListener('click',event=>{
    if(!layer.classList.contains('ne-sim-visible'))return;
    event.stopImmediatePropagation();
    exitMission5Setup();
  },true);
  let mission5Evaluating=false;
  const lessonSensorTypes=['수위 센서','유속 센서','진동 센서','강수 센서'];
  const sensorKeys=['water','flow','vibration','rain'];
  // Only sensor positions/types are managed by the simulator. The EntryJS
  // evaluator determines each threshold and compare operator from student code.
  function getMission5ConfiguredRules(){
    const installed=Array.isArray(sensors)?sensors:[];
    const missing=lessonSensorTypes.filter(type=>installed.filter(s=>s.type===type).length!==1);
    if(installed.length!==4||missing.length){
      throw Error('센서 설치 화면에서 수위·유속·진동·강수 센서를 각각 하나씩, 총 4개 설치하세요.'+(missing.length?' 확인: '+missing.join(' · '):''));
    }
    return true;
  }
  async function runMission5Native(alarmTable,n,studentRules,gradedMission){
    if(mission5Evaluating)return;
    getMission5ConfiguredRules();
    if(!studentRules||typeof studentRules!=='object')throw Error('엔트리 코드의 위험 판단 기준을 찾지 못했습니다.');
    const rules=lessonSensorTypes.map((type,i)=>{
      const rule=studentRules[sensorKeys[i]];
      if(!rule||!['ge','le'].includes(rule.op)||!Number.isFinite(rule.th)||rule.th<0||rule.th>100000)
        throw Error(type+'의 엔트리 위험 기준값 또는 비교 방향이 올바르지 않습니다.');
      return {op:rule.op,th:rule.th};
    });
    if(!Array.isArray(alarmTable)||alarmTable.length!==16||alarmTable.some(x=>x!==0&&x!==1))throw Error('엔트리 경보 코드의 16가지 판정 결과가 올바르지 않습니다.');
    if(!Number.isInteger(n)||n<1||n>4)throw Error('엔트리에서 결정한 경보 개수 N을 확인할 수 없습니다.');
    // All four sensor thresholds, compare operators and N were observed from
    // actual EntryJS execution. Only fixed sensor locations come from the map.
    // The original Nepal disaster generator and scoring remain unchanged.
    if(typeof createScenario!=='function'||typeof sensorValue!=='function'||typeof resultForScenario!=='function'||typeof calculatePerformanceRank!=='function')throw Error('원본 네팔 재난 평가 함수를 불러오지 못했습니다.');
    if(typeof simRunning!=='undefined'&&simRunning)throw Error('진행 중인 시뮬레이션을 종료한 후 평가하세요.');
    exitMission5Setup();
    mission5Evaluating=true;
    const actual=sensors;
    // Never read simulator sensor.rule for Mission 6 scoring.
    // Record whether each student-code risk predicate has EVER been true this scenario.
    const oldScenario=scenario,oldStep=stepIndex,oldAlarm=alarmIssuedIndex;
    const previousDam={...damPoint},previousDamIndex=damIndex,previousDamRocks=damRocks.map(x=>({...x}));
    let floodN=0,safeN=0,totalFail=0,miss=0,falseAlarm=0;
    const progressEl=document.getElementById('ne-mission5-progress');
    const gradeEl=document.getElementById('ne-mission5-grade');
    const scoreEl=document.getElementById('ne-mission5-score');
    gradeEl.textContent='평가 중…';scoreEl.textContent='시뮬레이터의 센서 위치 + 학생 엔트리 코드에서 판별한 위험 기준·경보 조건을 사용합니다.';
    try{
      for(let k=0;k<100;k++){
        const sc=createScenario();
        scenario=sc;
        let alarmAt=null,latchedMask=0;
        // Sensor readings are from the original flood simulation, at each
        // student's installed location. Risk predicates are derived from the
        // student's EntryJS program, not from hidden simulator rule fields.
        for(let t=0;t<times.length;t++){
          for(let j=0;j<lessonSensorTypes.length;j++){
            const sn=actual.find(sensor=>sensor.type===lessonSensorTypes[j]);
            const reading=sensorValue(sn,t),rule=rules[j];
            if(rule.op==='ge'?reading>=rule.th:reading<=rule.th)latchedMask|=(1<<j);
          }
          if(alarmTable[latchedMask]===1){alarmAt=t;break;}
        }
        const r=resultForScenario(sc,alarmAt);
        if(sc.dangerous){floodN++;totalFail+=r.evacFail;if(alarmAt===null||alarmAt>=sc.arrivalIndex)miss++}
        else{safeN++;if(alarmAt!==null)falseAlarm++}
        if(k%9===0||k===99){progressEl.textContent=`${k+1}/100회 검사 · 학생 코드 경보 조건: ${n}개 이상`;await new Promise(resolve=>setTimeout(resolve,14));}
      }
      const avg=floodN?totalFail/floodN:0,missRate=floodN?100*miss/floodN:0,falseRate=safeN?100*falseAlarm/safeN:0;
      const base=calculatePerformanceRank(avg,missRate,falseRate);
      const rank=base.score>=97?'LEGEND':base.rank==='LEGEND'?'S':base.rank;
      gradeEl.textContent=rank+' · '+base.score.toFixed(1)+'점';
      scoreEl.textContent=`홍수 ${floodN}회 / 안전 ${safeN}회 · 평균 대피실패 ${avg.toFixed(1)}명 · 홍수 놓침 ${missRate.toFixed(1)}% · 불필요 경보 ${falseRate.toFixed(1)}%`;
      progressEl.textContent=`100회 완료 · ${gradedMission===6?'FINAL':'미션 5'} · 센서 위치: 시뮬레이터 / 위험 기준·N: 학생 코드 · N=${n}`;
      status.textContent=`✅ 엔트리 경보 코드 기반 평가 완료! ${base.score.toFixed(1)}점 / ${rank} 등급`;
      passed[gradedMission]=true;
      const contiguous=passed.findIndex(v=>!v);
      classroom?.saveProgress(contiguous<0?missions.length:contiguous);
      classroom?.saveNow('mission-pass');
      if(gradedMission===4)classroom?.recordMission5Result?.({score:base.score,rank,n});
      if(gradedMission===6)classroom?.recordFinalResult?.({score:base.score,rank,n});
      setTimeout(showTeacherRecords,550);
      if(rank==='LEGEND'){
        try{if(typeof unlockAudio==='function')await unlockAudio();}catch(_){}
        if(typeof launchLegendCelebration==='function')launchLegendCelebration(base.score);
        setTimeout(()=>{if(layer.classList.contains('open'))uiSoundEnabled=false;},5700);
      }else if(layer.classList.contains('open'))uiSoundEnabled=false;
    }finally{
      scenario=oldScenario;stepIndex=oldStep;alarmIssuedIndex=oldAlarm;
      damPoint=previousDam;damIndex=previousDamIndex;damRocks=previousDamRocks;
      // Do not mutate sensor locations, simulator rules, or alarm mode.
      mission5Evaluating=false;checking=false;updateMissionButtons();
    }
  }
  /* v3.6: Share the ORIGINAL simulator's sensor/alarm design, not scenario results.
   * index.html runs before this classic script, so its top-level lexical `sensors`
   * and `alarmMode` are accessible here without modifying the original simulator.
   */
  let designSyncReady=false,designRestoreBusy=false,designBaseline='',designSaveTimer=null;
  let designQueuedFingerprint='',designSaving=false,designPanel=null,designInfo=null,designButton=null;
  const allowedSensors=new Set(['수위 센서','유속 센서','진동 센서','강수 센서','기온 센서']);
  const allowedModes=new Set(['OR','AND','N','MANUAL']);
  function normalizedDesign(source){
    if(!source||source.version!==1||!Array.isArray(source.sensors)||source.sensors.length>4)throw Error('센서 설계의 데이터 구조가 올바르지 않습니다.');
    const arr=source.sensors.map((raw,i)=>{
      const type=String(raw?.type||'');
      const x=Number(raw?.x),z=Number(raw?.z);
      if(!allowedSensors.has(type)||!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>10000||Math.abs(z)>10000)throw Error('센서 '+(i+1)+'의 종류 또는 설치 위치 오류');
      const rule=raw?.rule||{};
      if(typeof rule.enabled!=='boolean'||!['ge','le'].includes(rule.op))throw Error('센서 '+(i+1)+'의 위험 조건 오류');
      const th=rule.th===''?'':Number(rule.th);
      if(th!==''&&(!Number.isFinite(th)||Math.abs(th)>100000))throw Error('센서 '+(i+1)+'의 위험 기준값 오류');
      return {id:i+1,type,x,z,rule:{enabled:rule.enabled,op:rule.op,th}};
    });
    return {version:1,sensors:arr,alarmMode:allowedModes.has(source.alarmMode)?source.alarmMode:'OR',minCount:Math.max(1,Math.min(4,Number(source.minCount)||2))};
  }
  function captureSimulatorDesign(){
    try{
      if(typeof sensors==='undefined'||typeof alarmMode==='undefined')return null;
      return normalizedDesign({version:1,
        sensors:sensors.map(s=>({type:s.type,x:s.x,z:s.z,rule:{enabled:!!s.rule?.enabled,op:s.rule?.op||'ge',th:s.rule?.th??''}})),
        alarmMode,minCount:Number(document.getElementById('minRules')?.value)||2});
    }catch(e){console.error('[NEPAL] 센서 설계 읽기 실패:',e);return null;}
  }
  function restoreSimulatorDesign(source){
    designRestoreBusy=true;designSyncReady=false;
    try{
      const d=normalizedDesign(source);
      // Keep original array identity: renderer and simulator refer to the same array.
      sensors.splice(0,sensors.length,...d.sensors);
      alarmMode=d.alarmMode;
      renderSensors();refreshMinRules();
      const select=document.getElementById('minRules');
      if(select)select.value=String(Math.max(1,Math.min(d.minCount,Math.max(1,sensors.filter(s=>s.rule.enabled).length))));
      updateLogicUI();
      designBaseline=JSON.stringify(captureSimulatorDesign());
      designQueuedFingerprint='';
      clearTimeout(designSaveTimer);
      designSyncReady=true;
      if(designInfo)designInfo.textContent=source.sensors.length?'✓ 이전에 저장한 센서 설계를 불러왔어요.':'새로운 센서 설계를 시작해요.';
      return true;
    }catch(e){
      console.error('[NEPAL] 센서 설계 복원 실패:',e);
      if(designInfo)designInfo.textContent='⚠ 저장된 센서 설계를 읽을 수 없습니다.';
      return false;
    }finally{designRestoreBusy=false;updateDesignControls()}
  }
  function updateDesignControls(){
    const canSave=!!(classroom?.isDesignReady?.()&&designSyncReady);
    if(designPanel)designPanel.style.display=canSave?'block':'none';
    if(designButton)designButton.disabled=!canSave||designSaving;
  }
  async function flushSimulatorDesign(force=false){
    clearTimeout(designSaveTimer);designSaveTimer=null;
    if(mission5Evaluating||!classroom?.isDesignReady?.()||!designSyncReady||designRestoreBusy)return false;
    const snapshot=captureSimulatorDesign();if(!snapshot)return false;
    const fingerprint=JSON.stringify(snapshot);
    if(!force&&fingerprint===designBaseline)return true;
    if(designSaving){designQueuedFingerprint=fingerprint;return false;}
    designSaving=true;updateDesignControls();
    if(designInfo)designInfo.textContent='☁️ 센서 설계를 저장하는 중…';
    try{
      const ok=await classroom.saveSimulatorDesign(snapshot,force?'manual':'auto');
      if(ok){designBaseline=fingerprint;if(designInfo)designInfo.textContent='✓ 온라인 저장됨 · '+new Date().toLocaleTimeString('ko-KR');}
      else if(designInfo)designInfo.textContent='⚠ 저장에 실패했어요. 연결 상태를 확인하고 다시 저장하세요.';
      return ok;
    }finally{
      designSaving=false;updateDesignControls();
      if(designQueuedFingerprint&&designQueuedFingerprint!==designBaseline){designQueuedFingerprint='';queueSimulatorDesignSave()}
      else designQueuedFingerprint='';
    }
  }
  function queueSimulatorDesignSave(){
    if(mission5Evaluating||!classroom?.isDesignReady?.()||!designSyncReady||designRestoreBusy)return;
    clearTimeout(designSaveTimer);
    designSaveTimer=setTimeout(()=>{designSaveTimer=null;flushSimulatorDesign(false)},1100);
  }
  function scanSimulatorDesign(){
    updateDesignControls();
    if(mission5Evaluating||!classroom?.isDesignReady?.()||!designSyncReady||designRestoreBusy)return;
    const snapshot=captureSimulatorDesign();if(!snapshot)return;
    const fp=JSON.stringify(snapshot);
    if(fp!==designBaseline&&!designSaveTimer&&!designSaving)queueSimulatorDesignSave();
  }
  function installSimulatorDesignControls(){
    const practice=document.getElementById('practicePane');
    if(!practice||document.getElementById('nepal-design-save'))return;
    designPanel=document.createElement('section');designPanel.id='nepal-design-save';
    designPanel.style.cssText='background:#14231a;border:1px solid #426043;border-radius:11px;margin:0 0 10px;padding:11px 13px;color:#e9f8dd;display:none';
    designPanel.innerHTML='<div style="font-weight:800;margin-bottom:6px">💾 우리 조 센서 설계</div><div id="nepal-design-status" style="font-size:12px;opacity:.8;margin-bottom:8px">설정 변경 시 자동 저장돼요.</div><button type="button" id="nepal-design-save-button" style="background:#9cde50;color:#152211;border:0;border-radius:7px;padding:9px 13px;font-weight:900;cursor:pointer">지금 설계 저장</button>';
    practice.insertBefore(designPanel,practice.firstChild);
    designInfo=document.getElementById('nepal-design-status');designButton=document.getElementById('nepal-design-save-button');
    designButton.addEventListener('click',()=>flushSimulatorDesign(true));
    updateDesignControls();
  }
  installSimulatorDesignControls();
  // Sensor placement/removal and all rule controls are implemented in index.html;
  // scan actual state rather than relying on brittle DOM event order.
  setInterval(scanSimulatorDesign,1400);
  document.addEventListener('change',queueSimulatorDesignSave,true);
  document.addEventListener('click',e=>{
    if(!e.target.closest('#practicePane'))return;
    // Run after the original simulator's handler has changed its state.
    setTimeout(queueSimulatorDesignSave,0);
  },true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)flushSimulatorDesign(false)});

  // Load classroom UI asynchronously. The original simulator is not modified.
  const classroomScript=document.createElement('script');
  classroomScript.src='./nepal_classroom.js?v=42';
  classroomScript.onload=()=>{
    if(!window.NepalClassroom){console.error('학급 모듈을 찾지 못했습니다.');return;}
    classroom=window.NepalClassroom.setup({
      header:layer.querySelector('.ne-header'),iframe,totalMissions:missions.length,
      restoreDesign:restoreSimulatorDesign,flushDesign:()=>flushSimulatorDesign(false),
      launchEditor:launch,closeEditor:close,enterSimulator:()=>{
        // ALL three entry routes (student / teacher / guest) show the original
        // NEPAL FLOOD DATA LAB start menu, including Start / Assessment / Help.
        // This is the simulator's own #startScreen; no duplicate splash is made.
        const simulatorHome=document.getElementById('startScreen');
        if(simulatorHome)simulatorHome.classList.remove('hiddenStart');
        document.getElementById('np-board')?.classList.remove('show');
        document.getElementById('np-gate')?.classList.remove('show');
        queueEntryWarmup();
      },
      isReady:()=>ready,isLayerOpen:()=>layer.classList.contains('open'),
      isBusy:()=>checking||navigating,
      restoreProgress(completed){
        const n=Math.max(0,Math.min(missions.length,Number(completed)||0));
        passed.fill(false);
        for(let i=0;i<n;i++)passed[i]=true;
        applyMission(Math.min(n,missions.length-1));
      },
      resetEditor(){
        iframe.contentWindow?.postMessage({type:'NEPAL_DEV_PAUSE'},location.origin);
        ready=false;checking=false;pendingMission=null;navigating=false;
        if(missionStopPending)clearTimeout(missionStopPending.timeout);
        missionStopPending=null; iframe.src='about:blank';iframe.dataset.loaded='no';
        exitMission5Setup();passed.fill(false);verifiedWaterByMission.fill(null);applyMission(0);projectRestoring=false;
        if(layer.classList.contains('open'))showEditorLoading();
      }
    });
    // Ensure teacher mode immediately displays all unlocked mission buttons.
    updateMissionButtons();
    // The original 100-run assessment calls showRank({score,rank,...}).
    // Keep its own scoring algorithm unchanged; persist the result for the signed-in team.
    if(typeof window.showRank==='function' && !window.showRank.__nepalSaved){
      const original=window.showRank;
      function wrappedShowRank(result){
        const outcome=original.apply(this,arguments);
        if(result && Number.isFinite(Number(result.score)) && typeof result.rank==='string'){
          classroom?.recordFloodResult({score:result.score,rank:result.rank});
        }
        return outcome;
      }
      wrappedShowRank.__nepalSaved=true;window.showRank=wrappedShowRank;
    }
  };
  classroomScript.onerror=()=>{console.error('학급 로그인 파일 nepal_classroom.js 로드 실패');trigger.title='nepal_classroom.js 파일이 GitHub에 있는지 확인하세요';};
  document.head.appendChild(classroomScript);
})();
