/**
 * NEPAL FLOOD × EntryJS - integration v3.3 native simulator menu login · role login · flood score · 3-person groups
 * Add <script src="./nepal_entry_mode.js" defer></script> to the original index.html.
 * Keep original simulator unchanged. This overlay mounts a real EntryJS editor page in a same-origin iframe.
 * Four staged missions: water variable, water risk condition, independent flow/vibration/rain risk, list+loop alarm.
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
  #ne-iframe{width:100%;height:100%;border:0;background:white}
  #ne-mini{font-size:12px;color:#9bbb96;line-height:1.8}
  @media(max-width:800px){.ne-main{grid-template-columns:1fr;grid-template-rows:minmax(220px,38%) minmax(0,1fr)}.ne-side{border-right:0;border-bottom:1px solid #355439}}
  `;
  document.head.appendChild(css);
  // Educational thresholds (not real disaster safety standards): water 2m,
  // flow 2m/s, vibration 13 on a virtual scale, rainfall 22 mm/h.
  // Trigger alarm if AT LEAST TWO OF FOUR sensors indicate danger.
  const missions = [
    {title:'수위 측정값 저장',fault:'수위 센서값이 저장되지 않습니다!',description:'수위 센서는 계속 값을 측정하고 있지만, 측정값을 저장할 변수가 없습니다. 먼저 한 개의 값을 저장하는 기능부터 복구하세요.',task:'「수위값」 변수를 직접 만들고, 「수위 센서가 현재 측정하고 있는 실시간 값」 타원형 블록으로 현재 값을 한 번 저장하세요.',example:'수위 센서 4.20m → 수위값 4.20 (한 번 저장하면 통과)',active:true},
    {title:'수위 위험 판단',fault:'수위 위험 여부를 판단하지 못합니다!',description:'수위값은 저장했지만 이 값이 위험한지 판단하는 기능이 고장 났습니다. 이번 단계에서는 수위 센서만 사용합니다.',task:'「수위위험」 변수를 직접 만드세요. 수위값이 2m 이상이면 1(위험), 2m 미만이면 0(안전)이 저장되도록 조건문을 작성하세요. 「흐름」과 「판단」 탭을 살펴보세요.',example:'수위 1.50m → 수위위험 0 / 수위 2.80m → 수위위험 1',active:true},
    {title:'유속·진동·강수 확장',fault:'유속·진동·강수 센서의 위험 판단 기능이 없습니다!',description:'수위 위험을 판단하는 방법을 배웠습니다. 이번에는 같은 방법을 유속·진동·강수 센서에 스스로 적용해 보세요. 리스트는 아직 사용하지 않습니다.',task:'「유속값」·「진동값」·「강수값」 변수와 「유속위험」·「진동위험」·「강수위험」 변수를 직접 만드세요. 유속 2m/s 이상, 진동 13 이상, 강수 22mm/h 이상이면 각각 위험(1), 미만이면 안전(0)이 되도록 만드세요.',example:'유속 2.60 → 위험 1 / 진동 12.50 → 위험 0 / 강수 24mm/h → 위험 1',active:true},
    {title:'리스트·반복문 통합',fault:'네 센서의 위험 신호를 종합하지 못합니다!',description:'이제 수위·유속·진동·강수의 위험 여부가 각각 0 또는 1로 계산됩니다. 네 신호를 리스트에 모으고 반복해서 검사해 위험한 센서의 수를 세어 보세요.',task:'「위험목록」 리스트에 수위위험, 유속위험, 진동위험, 강수위험을 1·2·3·4번 순서로 넣으세요. 반복문으로 네 항목을 검사해 「위험개수」를 구하고, 4개 중 2개 이상 위험하면 「경보결과」를 1, 아니면 0으로 정하세요. 「반복번호」 변수도 활용하세요.',example:'위험목록 [1, 0, 1, 0] → 위험개수 2 → 경보결과 1',active:true}
  ];
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
  layer.innerHTML=`<header class="ne-header"><div><strong>NEPAL FLOOD × ENTRY</strong><div style="font-size:11px;color:#b4caa9">실제 EntryJS 편집기 연동 · v3.3 · 학교 계정 · 4단계 센서 경보 알고리즘</div></div><button id="ne-close">✕ 시뮬레이션으로 돌아가기</button></header><main class="ne-main"><aside class="ne-side"><div style="font-size:11px;color:#b2e879;font-weight:900">SYSTEM REPAIR / DEVELOPMENT CONSOLE</div><div id="ne-learning-note"><b>① 수위값 저장</b> → <b>② 조건문으로 수위 위험 판단</b> → <b>③ 유속·진동·강수 스스로 확장</b> → <b>④ 리스트·반복문으로 종합</b></div><div id="ne-missions" class="ne-mission-list"></div><div class="ne-warning"><h2 id="ne-fault"></h2><p id="ne-why"></p></div><div class="ne-task"><b>🛠 복구 임무</b><div id="ne-task"></div></div><div class="ne-sample"><span>예상 입력·출력</span><br><div id="ne-example"></div></div><div id="ne-sensor-live">📡 수위 센서 측정값 수신 중…</div><div id="ne-saved-live">💾 엔트리 변수 수위값: <b>미생성 / 저장 전</b></div><button id="ne-check" style="background:#adeb6f;color:#142009;width:100%;font-size:15px;padding:14px">▶ 엔트리 실행 결과 검사</button><div id="ne-status" aria-live="polite">엔트리 편집기를 불러오는 중입니다…</div><button type="button" id="ne-next">▶ 다음 라운드로 이동</button><p id="ne-mini">※ 원본 홍수 4유형·비홍수 3유형과 재난 엔진은 수정하지 않습니다.<br>※ 위험 기준(수위 2m·유속 2m/s·진동 13·강수 22mm/h)은 프로그래밍 학습용 가상 기준이며 실제 재난 경보 기준이 아닙니다.<br>※ 미션 01~04는 실제 엔트리 실행 결과로 판정합니다.</p></aside><iframe id="ne-iframe" title="실제 엔트리 코딩 편집기" src="about:blank" data-src="./nepal_entry_editor.html"></iframe></main>`;
  // Pause the original simulator's background animation loops without altering index.html.
  // The two named rAF loops are global function declarations in the original page.
  // Their drawing work is skipped while EntryJS covers the simulator; their ordinary
  // behavior resumes when the user returns.
  function pauseOriginalDrawWhileEditing(name){
    const old = window[name];
    if(typeof old!=='function' || old.__nepalPauseWrapper)return;
    function gatedFrame(...args){
      if(layer.classList.contains('open')){window.requestAnimationFrame(gatedFrame);return;}
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
  const launch = () => {
    if(layer.classList.contains('open'))return;
    silenceOriginalSimulator();
    layer.classList.add('open');trigger.style.display='none';
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
      display.innerHTML=(mission===0 || mission===1)
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
  function unlocked(index){return index===0 || passed[index-1]===true;}
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
    nextBtn.style.display=passed[mission] && mission+1<missions.length?'block':'none';
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
    mission=i;const m=missions[i];
    document.getElementById('ne-sensor-live').style.display='block';
    document.getElementById('ne-saved-live').style.display='block';
    document.getElementById('ne-saved-live').innerHTML='💾 학생 변수 상태: <b>실행 결과 대기 중</b>';
    document.getElementById('ne-fault').textContent=m.fault;
    document.getElementById('ne-why').textContent=m.description;
    document.getElementById('ne-task').textContent=m.task;
    document.getElementById('ne-example').textContent=m.example;
    checkBtn.textContent='▶ 엔트리 실행 결과 검사';
    status.textContent=passed[i]?'✅ 통과한 미션입니다. 다른 코드도 시험할 수 있습니다.':'미션을 읽고 엔트리에서 블록을 연결해 보세요.';
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
  nextBtn.addEventListener('click',()=>{if(passed[mission] && unlocked(mission+1) && mission+1<missions.length)changeMission(mission+1)});
  renderMissionButtons();applyMission(0);
  checkBtn.addEventListener('click',()=>{
    if(!ready){status.textContent='엔트리 편집기 로딩이 완료되지 않았습니다. 네트워크와 외부 라이브러리를 확인해 주세요.';return;}
    if(checking || navigating || !unlocked(mission) || !missions[mission]?.active)return;
    checking=true;pendingMission=mission;updateMissionButtons();
    status.textContent='엔트리 실행을 요청했습니다. 검사 결과를 기다리는 중입니다…';
    iframe.contentWindow.postMessage({type:'NEPAL_TEST',mission},location.origin);
  });
  window.addEventListener('message',(event)=>{if(event.source!==iframe.contentWindow || event.origin!==location.origin)return; const d=event.data||{};
    classroom?.receiveFrameMessage(d);
    if(d.type==='ENTRY_READY'){ready=true;classroom?.onEntryReady();if(layer.classList.contains('open'))iframe.contentWindow?.postMessage({type:'NEPAL_DEV_RESUME'},location.origin);pushSensorMeasurement();updateMissionButtons();status.textContent='실제 엔트리 편집기 준비 완료. 미션 01을 통과하면 미션 02가 열립니다.';}
    if(d.type==='ENTRY_ERROR'){ready=false;checking=false;pendingMission=null;updateMissionButtons();status.textContent='엔트리 로딩 오류: '+String(d.message||'알 수 없는 오류')+'\n하단 설치 안내를 참고해 주세요.';}
    if(d.type==='ENTRY_CHECK_RESULT'){
      const tested=pendingMission;
      checking=false;pendingMission=null;
      if(tested===null)return;
      if(d.ok){
        passed[tested]=true;
        const contiguous=passed.findIndex(flag=>!flag);
        classroom?.saveProgress(contiguous<0?missions.length:contiguous);
        classroom?.saveNow('mission-pass');
      }
      updateMissionButtons();
      const next=d.ok && tested+1<missions.length?'\n🔓 다음 미션 '+String(tested+2).padStart(2,'0')+' 잠금이 해제되었습니다.':'';
      status.textContent=(d.ok?'✅ 복구 검사 통과!':'❌ 복구 검사 실패')+'\n'+(Array.isArray(d.details)?d.details.join('\n'):String(d.message||''))+next;
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
        const v=d.variables||{},r=d.risks||{};
        if(mission===0)target.textContent='수위값 '+val(v.water)+'m';
        else if(mission===1)target.textContent='수위값 '+val(v.water)+'m · 수위위험 '+val(r.water);
        else if(mission===2)target.textContent='유속값 '+val(v.flow)+'m/s · 진동값 '+val(v.vibration)+' · 강수값 '+val(v.rain)+'mm/h · 위험 '+val(r.flow)+' / '+val(r.vibration)+' / '+val(r.rain);
        else target.textContent='위험목록 ['+(Array.isArray(d.list)?d.list.map(val).join(', '):'')+'] · 위험개수 '+val(d.dangerCount)+' · 경보결과 '+val(d.alarm);
      }
    }
  });
  // Load classroom UI asynchronously. The original simulator is not modified.
  const classroomScript=document.createElement('script');
  classroomScript.src='./nepal_classroom.js?v=33';
  classroomScript.onload=()=>{
    if(!window.NepalClassroom){console.error('학급 모듈을 찾지 못했습니다.');return;}
    classroom=window.NepalClassroom.setup({
      header:layer.querySelector('.ne-header'),iframe,totalMissions:missions.length,
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
        passed.fill(false);applyMission(0);
      }
    });
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
