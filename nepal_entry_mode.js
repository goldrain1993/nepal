/**
 * NEPAL FLOOD × EntryJS - integration experiment v2.1
 * Add <script src="./nepal_entry_mode.js" defer></script> to the original index.html.
 * Keep original simulator unchanged. This overlay mounts a real EntryJS editor page in a same-origin iframe.
 * Missions 01 (one sensor snapshot) and 02 (continuous storage using EntryJS repeat) are implemented.
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
  .ne-mission-list{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px;margin:12px 0}
  .ne-mission-list button{padding:10px 3px;font-size:12px}
  .ne-mission-list button.current{background:#9fe761;color:#11240f}
  .ne-mission-list button.passed{border-color:#8aca69;background:#173820;color:#caffb6}
  .ne-mission-list button.current.passed{background:#9fe761;color:#11240f}
  .ne-mission-list button.locked,.ne-mission-list button:disabled{background:#152019;border:1px solid #36493b;color:#697b6d;cursor:not-allowed;opacity:.82}
  .ne-mission-list button:focus-visible{outline:2px solid #b8f480;outline-offset:2px}
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
  const cases = [
    {title:'수위 센서', fault:'수위 센서값을 저장하는 변수가 삭제되었습니다!', description:'수위 센서는 계속 측정 중이지만, 측정값을 기억할 변수가 삭제되었습니다. 이번 미션에서는 측정값을 딱 한 번만 저장해도 성공합니다.', task:'엔트리의 자료 탭에서 「수위센서값」 변수를 직접 만들고, 자료 탭의 타원형 「수위 센서가 현재 측정하고 있는 실시간 값」 블록을 값 입력 칸에 끼워 넣어 저장하세요. 측정값 하나를 저장하면 통과합니다.', example:'수위센서값을 (수위 센서가 현재 측정하고 있는 실시간 값)으로 정하기 · 한 번 저장', active:true},
    {title:'실시간 센서값 목록', fault:'다중 센서값 목록이 최신 측정값으로 갱신되지 않습니다!', description:'수위 센서 외에 유속·진동 센서도 계속 측정하고 있지만, 세 센서의 현재 값을 모아서 관리하는 목록이 없습니다. 값이 변할 때마다 목록의 같은 자리를 갱신해야 다음 미션에서 센서들을 한꺼번에 검사할 수 있습니다.', task:'① 「유속센서값」과 「진동센서값」 변수를 직접 만들고, 각 센서의 현재 측정값을 계속 저장하세요. ② 「센서값목록」 리스트를 만들고, 반복이 시작되기 전에 수위·유속·진동용 항목 3개를 준비하세요. ③ 새로운 측정값이 들어올 때마다 1번은 수위, 2번은 유속, 3번은 진동 값으로 갱신하세요. 리스트에 쌓이는 데이터 개수는 항상 3개여야 합니다. 힌트: 「자료」 탭의 리스트 항목 바꾸기 기능을 살펴보세요.', example:'측정 시점 A: [4.20, 3.10, 2.80] → 측정 시점 B: [6.80, 4.35, 1.90] (항목은 계속 3개)', active:true},
    {title:'반복 검사', fault:'다중 센서 자동 검사 장치가 고장 났습니다!', description:'센서값 목록을 하나씩 검사하는 반복 과정이 삭제되었습니다.', task:'리스트 크기만큼 반복하고, 반복번호를 사용해 현재 센서값을 꺼내 위험 기준과 비교하여 감지개수를 증가시키세요.', example:'반복번호 = 1, 2, 3 → 감지개수 계산', active:false},
    {title:'경보 판단', fault:'대피 경보 판단 장치가 고장 났습니다!', description:'감지된 위험 센서 수에 따른 경보 발령 조건이 삭제되었습니다.', task:'감지개수가 2 이상이면 「경보결과」 변수를 1로, 그렇지 않으면 0으로 정하세요.', example:'감지개수 ≥ 2 → 경보결과 = 1', active:false},
    {title:'시스템 통합', fault:'자동 경보 시스템이 연결되지 않았습니다!', description:'개발한 기능을 전체 재난 시뮬레이션과 연결하여 검사해야 합니다.', task:'센서 데이터 저장부터 반복 검사, 경보 발령까지 통합하고 홍수·비홍수 상황에 시험하세요.', example:'실제 재난 시나리오 × 100회', active:false}
  ];
  const loopCase = {
    title:'실시간 센서 기록',
    fault:'수위 센서값이 계속 저장되지 않습니다!',
    description:'수위 센서는 계속 값을 측정하지만, 미션 01의 저장 명령은 한 번만 실행됩니다. 센서값이 바뀌어도 수위센서값 변수는 이전 값을 기억하고 있어요. 이 문제를 해결하도록 프로그램을 고쳐 보세요.',
    task:'0.2초마다 수위 센서가 현재 측정하고 있는 실시간 값을 「수위센서값」 변수에 저장하도록 프로그램을 고쳐 보세요. 힌트: 「흐름」 탭을 살펴보세요.',
    example:'센서 측정값 변화 → 0.2초 간격으로 변수에 저장 → 다음 측정값도 계속 저장',active:true
  };
  const missions=[cases[0],loopCase,...cases.slice(1)];
  const trigger = document.createElement('button'); trigger.id='nepal-entry-trigger'; trigger.textContent='🧩 엔트리 개발자 모드';
  const layer = document.createElement('section'); layer.id='nepal-entry-layer';
  layer.innerHTML=`<header class="ne-header"><div><strong>NEPAL FLOOD × ENTRY</strong><div style="font-size:11px;color:#b4caa9">실제 EntryJS 편집기 연동 · v2.2 · 미션 단계별 잠금</div></div><button id="ne-close">✕ 시뮬레이션으로 돌아가기</button></header><main class="ne-main"><aside class="ne-side"><div style="font-size:11px;color:#b2e879;font-weight:900">SYSTEM REPAIR / DEVELOPMENT CONSOLE</div><div id="ne-learning-note"><b>MISSION 01</b> — 센서 측정값 한 번 저장하기 → <b>MISSION 02</b> — 실시간 센서 기록 복구<br>한 번 저장한 값은 자동으로 바뀌지 않습니다. 다음 미션에서 직접 해결해 보세요.</div><div id="ne-missions" class="ne-mission-list"></div><div class="ne-warning"><h2 id="ne-fault"></h2><p id="ne-why"></p></div><div class="ne-task"><b>🛠 복구 임무</b><div id="ne-task"></div></div><div class="ne-sample"><span>예상 입력·출력</span><br><div id="ne-example"></div></div><div id="ne-sensor-live">📡 수위 센서 측정값 수신 중…</div><div id="ne-saved-live">💾 엔트리 변수 수위센서값: <b>미생성 / 저장 전</b></div><button id="ne-check" style="background:#adeb6f;color:#142009;width:100%;font-size:15px;padding:14px">▶ 엔트리 실행 결과 검사</button><div id="ne-status" aria-live="polite">엔트리 편집기를 불러오는 중입니다…</div><p id="ne-mini">※ 원본 홍수 4유형·비홍수 3유형과 재난 엔진은 수정하지 않습니다.<br>※ 미션 01: 값을 한 번만 저장해도 통과합니다.<br>※ 미션 02: 센서값이 변해도 계속 저장되어야 통과합니다.<br>※ 미션 03: 리스트 길이 3 유지 + 센서값 연속 갱신 검사.<br>※ 미션 04~06은 실전 판정 개발 중입니다.</p></aside><iframe id="ne-iframe" title="실제 엔트리 코딩 편집기" src="about:blank" data-src="./nepal_entry_editor.html"></iframe></main>`;
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
    // Stop student code when leaving so an infinite repeat does not consume CPU.
    iframe.contentWindow?.postMessage({type:'NEPAL_DEV_PAUSE'},location.origin);
    layer.classList.remove('open');trigger.style.display='';
    restoreOriginalSimulatorSound();
  };
  trigger.addEventListener('click',launch);
  document.body.append(trigger,layer);
  document.getElementById('ne-close').addEventListener('click',close);
  const iframe=document.getElementById('ne-iframe'), status=document.getElementById('ne-status');
  // Bridge the *actual* installed flood simulator water-level sensor to the
  // EntryJS reporter. While no sensor/scenario exists, provide changing demo
  // observations and explicitly label them as simulation training data.
  // Internal measurement values are intentionally NOT Entry variables.
  // Change once per broadcast; both the sidebar and Entry reporter see the
  // identical sample. Math.random is used only for the training sensors.
  const nepalTrainingReadings={water:4.2,flow:3.1,vibration:2.8};
  function advanceTrainingReadings(){
    const limits={water:[1.0,9.5,.36],flow:[.4,6.8,.27],vibration:[.2,5.6,.23]};
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
    const label=kind==='flow'?'유속 센서':'진동 센서';
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
    for(const kind of ['water','flow','vibration']){
      const reading=getNepalSensorMeasurement(kind);
      readings[kind]=reading;
      try{iframe.contentWindow?.postMessage({type:'NEPAL_SENSOR_TELEMETRY',sensor:kind,...reading},location.origin)}catch(e){console.warn(e)}
    }
    const display=document.getElementById('ne-sensor-live');
    if(display && mission<=2){
      const fmt=r=>r.value.toFixed(2);
      display.innerHTML=(mission<=1)
       ?'📡 '+readings.water.source+'<br><strong>'+fmt(readings.water)+' m</strong> · 센서는 계속 측정 중'
       :'📡 센서 측정값 (미리 만들어진 변수 아님)<br><strong>수위 '+fmt(readings.water)+' · 유속 '+fmt(readings.flow)+' · 진동 '+fmt(readings.vibration)+'</strong>';
    }
  }
  setInterval(pushSensorMeasurement,800);

  let mission=0, ready=false, checking=false, pendingMission=null;
  // This progress belongs to the current browser page, not to a student account.
  // Reloading resets it so a different student does not inherit another's marks.
  const passed=Array(missions.length).fill(false);
  const missionBtns=document.getElementById('ne-missions');
  const checkBtn=document.getElementById('ne-check');
  function unlocked(index){return index===0 || passed[index-1]===true;}
  function updateMissionButtons(){
    [...missionBtns.children].forEach((b,i)=>{
      const locked=!unlocked(i);
      b.disabled=locked || checking;
      b.classList.toggle('locked',locked);
      b.classList.toggle('passed',passed[i]);
      b.classList.toggle('current',mission===i);
      b.textContent=(locked?'🔒 ':passed[i]?'✓ ':'')+String(i+1).padStart(2,'0');
      b.setAttribute('aria-label',`미션 ${i+1} ${locked?'잠김':passed[i]?'통과':'진행 가능'}`);
      b.title=locked?`미션 ${i}을(를) 통과하면 열립니다.`:passed[i]?'통과한 미션입니다. 다시 열 수 있습니다.':`미션 ${i+1} 열기`;
    });
    const usable=missions[mission]?.active===true;
    checkBtn.disabled=checking || !ready || !usable;
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
  function changeMission(i){
    if(checking || !unlocked(i))return;
    mission=i;const m=missions[i];
    document.getElementById('ne-sensor-live').style.display=i<=2?'block':'none';
    document.getElementById('ne-saved-live').style.display=i<=2?'block':'none';
    document.getElementById('ne-saved-live').innerHTML=i===2?'💾 학생 변수와 센서값목록: <b>실행 결과 대기 중</b>':'💾 엔트리 변수 수위센서값: <b>실행 결과 대기 중</b>';
    document.getElementById('ne-fault').textContent=m.fault;
    document.getElementById('ne-why').textContent=m.description;
    document.getElementById('ne-task').textContent=m.task;
    document.getElementById('ne-example').textContent=m.example;
    checkBtn.textContent=m.active?'▶ 엔트리 실행 결과 검사':'연동 개발 중 · 검사 준비 중';
    status.textContent=passed[i]?'✅ 이 미션은 통과했습니다. 코드를 다시 확인하거나 다음 미션으로 진행하세요.':m.active?'미션을 읽고 엔트리 편집기에서 실제 블록을 조립하세요.':'이 미션은 연동 계획 단계이며 자동 검사 기능이 아직 없습니다.';
    updateMissionButtons();
  }
  renderMissionButtons();changeMission(0);
  checkBtn.addEventListener('click',()=>{
    if(!ready){status.textContent='엔트리 편집기 로딩이 완료되지 않았습니다. 네트워크와 외부 라이브러리를 확인해 주세요.';return;}
    if(checking || !unlocked(mission) || !missions[mission]?.active)return;
    checking=true;pendingMission=mission;updateMissionButtons();
    status.textContent='엔트리 실행을 요청했습니다. 검사 결과를 기다리는 중입니다…';
    iframe.contentWindow.postMessage({type:'NEPAL_TEST',mission},location.origin);
  });
  window.addEventListener('message',(event)=>{if(event.source!==iframe.contentWindow || event.origin!==location.origin)return; const d=event.data||{};
    if(d.type==='ENTRY_READY'){ready=true;if(layer.classList.contains('open'))iframe.contentWindow?.postMessage({type:'NEPAL_DEV_RESUME'},location.origin);pushSensorMeasurement();updateMissionButtons();status.textContent='실제 엔트리 편집기 준비 완료. 미션 01을 통과하면 미션 02가 열립니다.';}
    if(d.type==='ENTRY_ERROR'){ready=false;checking=false;pendingMission=null;updateMissionButtons();status.textContent='엔트리 로딩 오류: '+String(d.message||'알 수 없는 오류')+'\n하단 설치 안내를 참고해 주세요.';}
    if(d.type==='ENTRY_CHECK_RESULT'){
      const tested=pendingMission;
      checking=false;pendingMission=null;
      if(tested===null)return;
      if(d.ok)passed[tested]=true;
      updateMissionButtons();
      const next=d.ok && tested+1<missions.length?'\n🔓 다음 미션 '+String(tested+2).padStart(2,'0')+' 잠금이 해제되었습니다.':'';
      status.textContent=(d.ok?'✅ 복구 검사 통과!':'❌ 복구 검사 실패')+'\n'+(Array.isArray(d.details)?d.details.join('\n'):String(d.message||''))+next;
    }
    if(d.type==='ENTRY_VAR_SNAPSHOT'){
      const target=document.querySelector('#ne-saved-live b');
      if(target){
        if(mission===2){
          const v=d.variables||{};
          const fmt=n=>n===null||n===undefined||n===''||!Number.isFinite(Number(n))?'미저장':Number(n).toFixed(2);
          const list=Array.isArray(d.list)?d.list:[];
          target.textContent='수위 '+fmt(v.water)+'m / 유속 '+fmt(v.flow)+'m/s / 진동 '+fmt(v.vibration)+' · 리스트 '+(list.length?'['+list.map(fmt).join(', ')+']':'비어 있음')+' ('+list.length+'개)';
        }else{
          target.textContent=d.value===null?'아직 변수값이 없음':Number.isFinite(d.value)?d.value.toFixed(2)+' m'+(d.running?' · 실행 중':' · 정지 상태'):'저장값 오류';
        }
      }
      const box=document.getElementById('ne-saved-live');
      if(box){box.title=mission===2?'세 센서값이 바뀔 때 리스트의 같은 3개 자리가 갱신되는지 확인하세요.':'값은 학생 엔트리 코드가 실행될 때만 저장됩니다.';}
    }
  });
})();
