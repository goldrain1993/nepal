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
  .ne-mission-list{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;margin:12px 0}
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
  .ne-editor-stage #ne-sim-stage{display:none;position:absolute;inset:0;z-index:3;overflow:hidden;background:#061009}
  #nepal-entry-layer.ne-sim-visible #ne-sim-stage{display:block}
  #nepal-entry-layer.ne-sim-visible #ne-iframe,#nepal-entry-layer.ne-sim-visible #ne-entry-loading{display:none!important}
  #ne-mode-switch{display:none;position:absolute;right:12px;top:9px;z-index:14;background:#b9ed74;color:#122518;border:1px solid #648a48;border-radius:9px;padding:10px 16px;font-weight:900;cursor:pointer;box-shadow:0 4px 16px #0004}
  #nepal-entry-layer.ne-mission5 #ne-mode-switch{display:block}
  #ne-sim-stage #app{height:100%;width:100%;min-height:0}
  #ne-sim-stage #assessmentTabBtn,#ne-sim-stage #assessmentPane,#ne-sim-stage #run,#ne-sim-stage #replay,#ne-sim-stage #design,#ne-sim-stage #nepal-design-save{display:none!important}
  /* Mission 6 setup: only ① observations, ② sensor placement, and the Hint tab.
     All sensor threshold and evacuation/alarm-setting panels are intentionally hidden. */
  #ne-sim-stage #practicePane > section.card:nth-of-type(n+3){display:none!important}
  #ne-sim-stage .panel{padding-top:72px!important;scroll-padding-top:72px!important}
  /* Fixed login buttons must appear at the BOTTOM-LEFT of the simulation MAP,
     not over the right-side sensor panel. Respect the developer sidebar width. */
  body.nepal-mission6-sim #nepal-entry-trigger,
  body.nepal-mission6-sim #nepal-class-board,
  body.nepal-mission6-sim #nepal-class-switch{
    left:calc(max(285px, 27vw) + 17px)!important;right:auto!important;
    z-index:12900!important;max-width:220px!important;
  }
  body.nepal-mission6-sim #nepal-entry-trigger{display:block!important;bottom:16px!important}
  body.nepal-mission6-sim #nepal-class-board{bottom:79px!important}
  body.nepal-mission6-sim #nepal-class-switch{bottom:133px!important}
  @media(max-width:800px){
    body.nepal-mission6-sim #nepal-entry-trigger,
    body.nepal-mission6-sim #nepal-class-board,
    body.nepal-mission6-sim #nepal-class-switch{left:18px!important}
  }
  #ne-sim-stage .tabs{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  #ne-sim-stage #sensorType optgroup:last-child option:first-child{display:none!important}
  #ne-sim-stage #dataMode,#ne-sim-stage #replayControls{display:none!important}
  #ne-mission5-report{display:none;margin:12px 0;padding:15px;border:1px solid #89c95c;background:#10241a;border-radius:12px;font-size:13px;color:#dcffcf}
  #ne-mission5-report strong{font-size:28px;color:#b6f36f}
  #nepal-entry-layer.ne-mission5 #ne-mission5-report{display:block}
  #legendOverlay.show{z-index:30000!important}
  
  @media(max-width:800px){.ne-main{grid-template-columns:1fr;grid-template-rows:minmax(220px,38%) minmax(0,1fr)}.ne-side{border-right:0;border-bottom:1px solid #355439}}
  `;
  document.head.appendChild(css);
  // Educational thresholds (not real disaster safety standards): water 2m,
  // flow 2m/s, vibration 13 on a virtual scale, rainfall 22 mm/h.
  // Trigger alarm if AT LEAST TWO OF FOUR sensors indicate danger.
  const missions = [
    {title:'수위 측정값 저장',fault:'수위 센서값이 저장되지 않습니다!',description:'수위 센서는 계속 값을 측정하고 있지만, 측정값을 저장할 변수가 없습니다. 먼저 한 개의 값을 저장하는 기능부터 복구하세요.',task:'「수위값」 변수를 직접 만들고, 「수위 센서가 현재 측정하고 있는 실시간 값」 타원형 블록으로 현재 값을 한 번 저장하세요.',example:'수위 센서 4.20m → 수위값 4.20 (한 번 저장하면 통과)',active:true},
    {title:'실시간 수위값 갱신',fault:'수위값이 계속 바뀌지 않습니다!',description:'미션 1에서는 현재 수위를 한 번 저장했습니다. 하지만 재난 현장에서는 수위가 계속 변해요. 실시간 데이터를 관찰하려면 프로그램이 센서값을 반복해서 다시 읽어야 합니다.',task:'이미 만든 「수위값」 변수를 계속 최신 상태로 갱신해 보세요. 「흐름」 탭의 「계속 반복하기」 안에서 「수위값을 (수위 센서가 현재 측정하고 있는 실시간 값)으로 정하기」 명령이 반복되게 만드세요. ※ 0.2초 기다리기는 권장하지만 필수는 아닙니다.',example:'수위 1.35 → 수위값 1.35 / 수위 3.60 → 수위값 3.60 / 수위 2.05 → 수위값 2.05 (프로그램 재시작 없이 갱신)',active:true},
    {title:'수위 위험 판단',fault:'수위 위험 여부를 판단하지 못합니다!',description:'수위값은 반복해서 갱신되고 있습니다. 이번에는 계속 반복하기 안에서 그 값이 위험한지 매번 판단해 보세요.',task:'「수위위험」 변수를 직접 만드세요. 수위값이 2m 이상이면 1(위험), 2m 미만이면 0(안전)이 되도록 하세요. 센서값이 바뀌어도 계속 판단할 수 있어야 합니다. 힌트: 「흐름」 탭의 계속 반복하기와 만일/만일~아니면 블록을 살펴보세요.',example:'수위 1.50m → 수위위험 0 / 수위 2.80m → 수위위험 1',active:true},
    {title:'유속·진동·강수 확장',fault:'유속·진동·강수 센서의 위험 판단 기능이 없습니다!',description:'수위 위험을 판단하는 방법을 배웠습니다. 이번에는 같은 방법을 유속·진동·강수 센서에 스스로 적용해 보세요. 리스트는 아직 사용하지 않습니다.',task:'「유속값」·「진동값」·「강수값」 변수와 「유속위험」·「진동위험」·「강수위험」 변수를 직접 만드세요. 세 센서값도 「계속 반복하기」 안에서 갱신하고, 유속 2m/s 이상, 진동 13 이상, 강수 22mm/h 이상이면 각각 위험(1), 미만이면 안전(0)이 되도록 만드세요. 수위값도 계속 갱신되어야 합니다.',example:'유속 2.60 → 위험 1 / 진동 12.50 → 위험 0 / 강수 24mm/h → 위험 1',active:true},
    {title:'리스트·반복문 통합',fault:'네 센서의 위험 신호를 종합하지 못합니다!',description:'이제 네 위험 신호가 각각 0 또는 1로 계산됩니다. 네 신호를 리스트의 1~4번 칸에 넣고 반복해서 검사해 위험 센서 수를 세어 보세요. 네 센서값은 계속 갱신되어야 합니다.',task:'「위험목록」 리스트에 수위위험·유속위험·진동위험·강수위험을 1·2·3·4번 순서로 넣으세요. 「반복번호」와 반복문으로 위험한 센서의 수를 세고, 2개 이상이면 「경보결과」를 1, 아니면 0으로 정하세요. 💡 힌트: ① 리스트에 먼저 4칸을 준비하기 ② 「계속 반복하기」 안에서 각 칸을 최신 0·1로 바꾸기 ③ 「위험개수」를 0으로 초기화하고 1~4번 항목을 검사하기. 「항목 추가」를 계속 반복하면 리스트가 길어지니 「n번째 항목 바꾸기」를 찾아보세요.',example:'위험목록 [1, 0, 1, 0] → 위험개수 2 → 경보결과 1',active:true},
    {title:'최종 경보 설계·100회 평가',fault:'실제 재난 상황에 맞는 경보 기준을 완성하세요!',description:'네팔 홍수 시뮬레이션에서 자신이 정한 센서 위치·위험 기준·비교 방향을 코드로 재현하세요. 4개 중 경보를 울릴 N을 정하면, 실제 엔트리 코드의 경보 판단을 원본 재난 엔진에 적용하여 100회 평가합니다.',task:'먼저 네팔 시뮬레이션에서 수위·유속·진동·강수 센서를 설치하고 각 위험 기준값과 비교 방향(이상/이하)을 설정하세요. 엔트리의 실시간 센서값도 「계속 반복하기」 안에서 갱신하고, 「시뮬레이션에서 설정한 ○○ 위험 기준값」 블록을 이용해 같은 위험 판단을 구현하세요. 리스트·반복문으로 네 위험 신호를 세고, 자신이 정한 N개 이상이면 「경보결과」를 1로 정하세요(N=1~4). 평가에 적용되는 센서 위치·임계값은 시뮬레이션에서 저장한 그대로입니다.',example:'시뮬레이션에서 N=3, 센서별 위험 기준 설정 → 엔트리에서도 같은 기준과 N=3 사용 → 동일한 센서 위치로 100회 평가.',active:true}
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
  layer.innerHTML=`<header class="ne-header"><div><strong>NEPAL FLOOD × ENTRY</strong><div style="font-size:11px;color:#b4caa9">6단계 재난 경보 코딩 미션</div></div><button id="ne-close">✕ 시뮬레이션으로 돌아가기</button></header><main class="ne-main"><aside class="ne-side"><div style="font-size:11px;color:#b2e879;font-weight:900">SYSTEM REPAIR / DEVELOPMENT CONSOLE</div><div id="ne-learning-note"><b>① 수위값 1회 저장</b> → <b>② 실시간 반복 갱신</b> → <b>③ 수위 위험 판단</b> → <b>④ 다른 센서 확장</b> → <b>⑤ 리스트·반복문</b> → <b>⑥ 100회 평가</b></div><div id="ne-missions" class="ne-mission-list"></div><div class="ne-warning"><h2 id="ne-fault"></h2><p id="ne-why"></p></div><div class="ne-task"><b>🛠 복구 임무</b><div id="ne-task"></div></div><div class="ne-sample"><span>예상 입력·출력</span><br><div id="ne-example"></div></div><div id="ne-mission5-report"><div>🌊 최종 경보 성능평가</div><strong id="ne-mission5-grade">미평가</strong><div id="ne-mission5-score">엔트리 코드를 검사하면 100회 재난 평가를 실행합니다.</div><div id="ne-mission5-progress" style="font-size:12px;margin-top:6px;color:#b7cfa9"></div></div><div id="ne-sensor-live">📡 수위 센서 측정값 수신 중…</div><div id="ne-saved-live">💾 엔트리 변수 수위값: <b>미생성 / 저장 전</b></div><button id="ne-check" style="background:#adeb6f;color:#142009;width:100%;font-size:15px;padding:14px">▶ 엔트리 실행 결과 검사</button><div id="ne-status" aria-live="polite">미션을 읽고 블록을 연결해 보세요.</div><button type="button" id="ne-next">▶ 다음 라운드로 이동</button><p id="ne-mini">※ 원본 홍수 4유형·비홍수 3유형과 재난 엔진은 수정하지 않습니다.<br>※ 미션 01~05는 공통 가상 기준(수위 2m·유속 2m/s·진동 13·강수 22mm/h)으로 기초를 학습하고, 미션 06은 각 조가 시뮬레이션에서 직접 설정한 위험 기준과 설치 위치를 평가합니다.<br>※ 실제 재난 경보 기준이 아닙니다.</p></aside><div class="ne-editor-stage"><button id="ne-mode-switch" type="button">🗺 센서 설치 화면</button><div id="ne-sim-stage"></div><iframe id="ne-iframe" title="실제 엔트리 코딩 편집기" src="about:blank" data-src="./nepal_entry_editor.html?v=39"></iframe><div id="ne-entry-loading" class="ne-entry-loading" role="status" aria-live="polite"><div class="ne-loading-center"><div class="ne-loader-mascot" aria-hidden="true"><div class="ne-mascot-antenna"></div><div class="ne-mascot-arm left"></div><div class="ne-mascot-arm right"></div><div class="ne-mascot-face"><div class="ne-mascot-screen"><i class="ne-mascot-eye"></i><i class="ne-mascot-eye"></i></div><div class="ne-mascot-mouth"></div></div></div><div class="ne-loading-title" id="ne-loading-title">로딩중입니다</div><div class="ne-loading-sub" id="ne-loading-sub">잠깐만요, 블록을 가져올게요 ✨</div><div class="ne-loading-dots" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div></main>`;
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
  function showEditorLoading(){
    if(ready&&!projectRestoring){hideEditorLoading();return}
    loadingTitle.textContent='로딩중입니다';
    loadingSub.textContent='잠깐만요, 블록을 가져올게요 ✨';
    loadingOverlay.classList.remove('done');
    iframe.style.visibility='hidden';
  }
  function hideEditorLoading(){
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
  const launch = () => {
    if(layer.classList.contains('open'))return;
    silenceOriginalSimulator();
    layer.classList.add('open');trigger.style.display='none';
    showEditorLoading();updateMissionButtons();
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
    layer.classList.remove('open');if(classroom)classroom.refreshUI?.();
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
    return {value:nepalTrainingReadings.water,source:'실습용 가상 수위 센서 (난수 측정)'};
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
    return {value:nepalTrainingReadings[kind],source:'실습용 가상 '+label+' (난수 측정)'};
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
  const missionBtns=document.getElementById('ne-missions');
  const checkBtn=document.getElementById('ne-check');
  const nextBtn=document.getElementById('ne-next');
  function teacherPreview(){return classroom?.isTeacher?.()===true;}
  function unlocked(index){return teacherPreview() || index===0 || passed[index-1]===true;}
  function updateMissionButtons(){
    [...missionBtns.children].forEach((b,i)=>{
      const locked=!unlocked(i);
      b.disabled=locked || checking || navigating;
      b.classList.toggle('locked',locked);
      b.classList.toggle('passed',passed[i]);
      b.classList.toggle('current',mission===i);
      b.textContent=(locked?'🔒 ':passed[i]?'✓ ':'')+String(i+1).padStart(2,'0');
      b.setAttribute('aria-label',`미션 ${i+1} ${locked?'잠김':passed[i]?'통과':'진행 가능'}`);
      b.title=locked?`미션 ${i}을(를) 통과하면 열립니다.`:passed[i]?'통과한 미션입니다. 다시 열 수 있습니다.':`미션 ${i+1} 열기`;
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
    if(i!==5)exitMission5Setup();
    mission=i;const m=missions[i];
    layer.classList.toggle('ne-mission5',i===5);
    if(i===5)queueMicrotask(pushMission5Rules);
    document.getElementById('ne-sensor-live').style.display='block';
    document.getElementById('ne-saved-live').style.display='block';
    document.getElementById('ne-saved-live').innerHTML='💾 학생 변수 상태: <b>실행 결과 대기 중</b>';
    document.getElementById('ne-fault').textContent=m.fault;
    document.getElementById('ne-why').textContent=m.description;
    document.getElementById('ne-task').textContent=m.task;
    document.getElementById('ne-example').textContent=m.example;
    checkBtn.textContent=i===5?'🚨 엔트리 경보 코드 검증 + 100회 평가':'▶ 엔트리 실행 결과 검사';
    status.textContent=teacherPreview()?'🧑‍🏫 교사 체험: 모든 미션을 자유롭게 선택할 수 있습니다. 저장은 하지 않습니다.':passed[i]?'✅ 통과한 미션입니다. 다른 코드도 시험할 수 있습니다.':'미션을 읽고 엔트리에서 블록을 연결해 보세요.';
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
    if(mission===5){
      // Arm audio directly from the student's click (browser user gesture).
      // Background simulator music stays muted; only a LEGEND celebration uses audio.
      try{uiSoundEnabled=true;if(typeof unlockAudio==='function')unlockAudio();}catch(_){}
    }
    if(mission===5){
      try{
        const rules=getMission5ConfiguredRules();
        iframe.contentWindow.postMessage({type:'NEPAL_MISSION5_RULES',rules},location.origin);
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
      pushSensorMeasurement();if(mission===5)pushMission5Rules();updateMissionButtons();
      status.textContent=teacherPreview()?'🧑‍🏫 교사 체험: 미션 01~06을 자유롭게 선택할 수 있습니다.':'미션을 읽고 엔트리 블록을 연결해 보세요.';
      // A saved student project may still be importing after EntryJS is initialized.
      // Keep the mascot visible until BOTH the editor and saved blocks are ready.
      Promise.resolve().then(()=>classroom?.onEntryReady?.()).catch(error=>{
        console.warn('조별 코딩 복원 안내:',error);
        status.textContent='이전 코딩 작업을 불러오지 못했습니다. 저장 상태를 확인해 주세요.';
      }).finally(()=>{
        projectRestoring=false;
        if(!ready)return;
        if(layer.classList.contains('open'))iframe.contentWindow?.postMessage({type:'NEPAL_DEV_RESUME'},location.origin);
        hideEditorLoading();updateMissionButtons();
      });
    }
    if(d.type==='ENTRY_ERROR'){ready=false;checking=false;pendingMission=null;loadingTitle.textContent='코딩 친구가 잠시 멈췄어요';loadingSub.textContent='편집기를 닫고 다시 열어보세요.';loadingOverlay.classList.remove('done');updateMissionButtons();status.textContent='편집기 준비 중 오류: '+String(d.message||'알 수 없는 오류');}
    if(d.type==='ENTRY_CHECK_RESULT'){
      const tested=pendingMission;
      checking=false;pendingMission=null;
      if(tested===null)return;
      if(d.ok && tested===5){
        checking=true;
        status.textContent='✅ 엔트리 경보 조건 확인! 이제 실제 네팔 재난 100회 평가를 실행합니다.';
        updateMissionButtons();
        runMission5Native(d.alarmTable,d.threshold).catch(e=>{checking=false;uiSoundEnabled=false;status.textContent='❌ 100회 평가 오류: '+String(e.message||e);updateMissionButtons()});
        return;
      }
      if(d.ok){
        passed[tested]=true;
        const contiguous=passed.findIndex(flag=>!flag);
        if(!teacherPreview()){
          classroom?.saveProgress(contiguous<0?missions.length:contiguous);
          classroom?.saveNow('mission-pass');
        }
      }
      if(tested===5&&!d.ok)uiSoundEnabled=false;
      updateMissionButtons();
      const next=d.ok && tested+1<missions.length?'\n🔓 다음 미션 '+String(tested+2).padStart(2,'0')+' 잠금이 해제되었습니다.':'';
      status.textContent=(d.ok?'✅ 복구 검사 통과!':'❌ 복구 검사 실패')+'\n'+(Array.isArray(d.details)?d.details.join('\n'):String(d.message||''))+next;
    }
    if(d.type==='ENTRY_MISSION_STOPPED'){
      const p=missionStopPending;
      if(!p || p.token!==d.token)return;
      clearTimeout(p.timeout);missionStopPending=null;navigating=false;
      if(d.ok){if(!teacherPreview())classroom?.saveNow('mission-change');applyMission(p.target);}
      else{status.textContent='프로그램 정지 확인 실패: '+String(d.message||'다시 시도해 주세요.');updateMissionButtons();}
    }
    if(d.type==='ENTRY_VAR_SNAPSHOT'){
      const target=document.querySelector('#ne-saved-live b');
      if(target){
        const val=x=>x===null||x===undefined||x===''||!Number.isFinite(Number(x))?'미저장':Number(x).toFixed(2);
        const v=d.variables||{},r=d.risks||{};
        if(mission===0||mission===1)target.textContent='수위값 '+val(v.water)+'m';
        else if(mission===2)target.textContent='수위값 '+val(v.water)+'m · 수위위험 '+val(r.water);
        else if(mission===3)target.textContent='유속값 '+val(v.flow)+'m/s · 진동값 '+val(v.vibration)+' · 강수값 '+val(v.rain)+'mm/h · 위험 '+val(r.flow)+' / '+val(r.vibration)+' / '+val(r.rain);
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
  function enterMission5Setup(){
    if(mission!==5||!nativeApp||!portal)return;
    if(typeof simRunning!=='undefined'&&simRunning){status.textContent='현재 시뮬레이션 실행이 끝난 뒤 센서를 배치해 주세요.';return;}
    iframe.contentWindow?.postMessage({type:'NEPAL_DEV_PAUSE'},location.origin);
    portal.appendChild(nativeApp);
    layer.classList.add('ne-sim-visible');
    document.body.classList.add('nepal-mission6-sim');
    try{document.getElementById('design')?.click();setSidebarTab('practice');const panel=nativeApp.querySelector('.panel');if(panel)panel.scrollTop=0;}catch(e){console.warn('설계 화면 선택',e)}
    modeSwitch.textContent='🧩 엔트리 코딩으로 돌아가기';
  }
  function exitMission5Setup(){
    if(!layer.classList.contains('ne-sim-visible'))return;
    layer.classList.remove('ne-sim-visible');
    document.body.classList.remove('nepal-mission6-sim');
    if(nativeApp&&originalAppParent){originalAppParent.insertBefore(nativeApp,originalAppSibling);}
    modeSwitch.textContent='🗺 센서 설치 화면';
    pushMission5Rules();
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
  function pushMission5Rules(){
    try{const rules=getMission5ConfiguredRules();if(iframe.contentWindow && iframe.dataset.loaded==='yes')iframe.contentWindow.postMessage({type:'NEPAL_MISSION5_RULES',rules},location.origin)}catch(_){}
  }
  function getMission5ConfiguredRules(){
    const installed=Array.isArray(sensors)?sensors:[];
    const missing=lessonSensorTypes.filter(type=>installed.filter(s=>s.type===type).length!==1);
    if(installed.length!==4||missing.length){
      throw Error('시뮬레이션에서 센서의 종류를 확인하세요. 수위·유속·진동·강수 센서가 각각 하나씩, 총 4개 필요합니다.'+(missing.length?' 확인: '+missing.join(' · '):''));
    }
    const rules={};
    lessonSensorTypes.forEach((type,i)=>{
      const sn=installed.find(s=>s.type===type);
      if(!sn.rule||!sn.rule.enabled||sn.rule.th===''||!Number.isFinite(Number(sn.rule.th))||!['ge','le'].includes(sn.rule.op)){
        throw Error(type+'의 위험 기준값과 비교 방향(이상/이하)을 시뮬레이션에서 설정하고 사용 상태로 켜 주세요.');
      }
      rules[sensorKeys[i]]={th:Number(sn.rule.th),op:sn.rule.op};
    });
    return rules;
  }
  async function runMission5Native(alarmTable,n){
    if(mission5Evaluating)return;
    getMission5ConfiguredRules();
    if(!Array.isArray(alarmTable)||alarmTable.length!==16||alarmTable.some(x=>x!==0&&x!==1))throw Error('엔트리 경보 코드의 16가지 판정 결과가 올바르지 않습니다.');
    if(!Number.isInteger(n)||n<1||n>4)throw Error('엔트리에서 결정한 경보 개수 N을 확인할 수 없습니다.');
    // The MISSION 6 sensor-placement panel intentionally hides evacuation-mode
    // controls. Take the student's chosen N ONLY from executed EntryJS code;
    // the 16-case EntryJS truth table is applied verbatim to the original
    // Nepal 100-run engine. Do not require clicking an invisible simulator N UI.
    if(typeof createScenario!=='function'||typeof ruleEverSatisfied!=='function'||typeof resultForScenario!=='function'||typeof calculatePerformanceRank!=='function')throw Error('원본 네팔 재난 평가 함수를 불러오지 못했습니다.');
    if(typeof simRunning!=='undefined'&&simRunning)throw Error('진행 중인 시뮬레이션을 종료한 후 평가하세요.');
    exitMission5Setup();
    mission5Evaluating=true;
    const actual=sensors;
    // The original simulator's sensor coordinates, comparison signs and real
    // user thresholds remain UNCHANGED. Every scenario uses those exact rules.
    const oldScenario=scenario,oldStep=stepIndex,oldAlarm=alarmIssuedIndex;
    const previousDam={...damPoint},previousDamIndex=damIndex,previousDamRocks=damRocks.map(x=>({...x}));
    let floodN=0,safeN=0,totalFail=0,miss=0,falseAlarm=0;
    const progressEl=document.getElementById('ne-mission5-progress');
    const gradeEl=document.getElementById('ne-mission5-grade');
    const scoreEl=document.getElementById('ne-mission5-score');
    gradeEl.textContent='평가 중…';scoreEl.textContent='저장된 센서 위치·기준값 + 학생의 실제 엔트리 경보 판정을 사용합니다.';
    try{
      for(let k=0;k<100;k++){
        const sc=createScenario();
        scenario=sc;
        let alarmAt=null;
        // Flood sensors remember any prior crossing within the SAME scenario.
        // The 16-entry truth table was obtained from executing the student's
        // EntryJS blocks. Do not replace it with an independently chosen N.
        for(let t=0;t<times.length;t++){
          let mask=0;
          for(let j=0;j<lessonSensorTypes.length;j++){
            const sn=actual.find(s=>s.type===lessonSensorTypes[j]);
            if(ruleEverSatisfied(sn,t))mask|=(1<<j);
          }
          if(alarmTable[mask]===1){alarmAt=t;break;}
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
      progressEl.textContent=`100회 완료 · 설치 위치 및 위험 기준: 조별 원본 설정 사용 · N=${n}`;
      status.textContent=`✅ 엔트리 경보 코드 기반 평가 완료! ${base.score.toFixed(1)}점 / ${rank} 등급`;
      passed[5]=true;
      const contiguous=passed.findIndex(v=>!v);
      if(!teacherPreview()){
        classroom?.saveProgress(contiguous<0?missions.length:contiguous);
        classroom?.saveNow('mission-pass');
        classroom?.recordMission5Result?.({score:base.score,rank,n});
      }
      if(rank==='LEGEND'){
        try{if(typeof unlockAudio==='function')await unlockAudio();}catch(_){}
        if(typeof launchLegendCelebration==='function')launchLegendCelebration(base.score);
        setTimeout(()=>{if(layer.classList.contains('open'))uiSoundEnabled=false;},5700);
      }else if(layer.classList.contains('open'))uiSoundEnabled=false;
    }finally{
      scenario=oldScenario;stepIndex=oldStep;alarmIssuedIndex=oldAlarm;
      damPoint=previousDam;damIndex=previousDamIndex;damRocks=previousDamRocks;
      // Do NOT alter any student sensor rule or the simulator alarm mode.
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
  classroomScript.src='./nepal_classroom.js?v=40';
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
        exitMission5Setup();passed.fill(false);applyMission(0);projectRestoring=false;
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
