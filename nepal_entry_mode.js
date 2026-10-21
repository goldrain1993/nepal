/**
 * NEPAL FLOOD × EntryJS - integration experiment v0.5
 * Add <script src="./nepal_entry_mode.js" defer></script> to the original index.html.
 * Keep original simulator unchanged. This overlay mounts a real EntryJS editor page in a same-origin iframe.
 * Currently verification experiments cover M1 & M2; M3-M5 are DESIGN ONLY until runtime tests.
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
  .ne-mission-list{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;margin:16px 0}
  .ne-mission-list button{padding:10px 3px;font-size:12px}
  .ne-mission-list button.current{background:#9fe761;color:#11240f}
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
    {title:'수위 센서', fault:'수위 센서값을 저장하는 변수가 삭제되었습니다!', description:'수위 센서는 정상적으로 작동하고 실시간으로 값을 측정하고 있습니다. 하지만 측정값을 기억할 변수가 삭제되어 값을 저장하지 못합니다.', task:'엔트리의 자료 탭에서 「수위센서값」 변수를 직접 만들고, 자료 탭의 타원형 「센서가 현재 측정하고 있는 실시간 값」 블록을 이용해 센서의 측정값을 수위센서값 변수에 저장하는 프로그램을 만드세요.', example:'수위센서값을 (센서가 현재 측정하고 있는 실시간 값)으로 정하기', active:true},
    {title:'센서값 목록', fault:'유속·진동 센서값을 저장하는 변수와 센서값목록이 삭제되었습니다!', description:'수위 외에 유속·진동 센서도 측정하고 있지만 측정값을 저장할 변수가 없습니다. 세 센서의 데이터를 한데 모아 둘 리스트도 삭제되었습니다.', task:'① 「유속센서값」과 「진동센서값」 변수를 직접 만드세요. ② 자료 탭의 유속·진동 실시간 측정 블록으로 각 변수에 값을 저장하세요. ③ 「센서값목록」 리스트를 만들고 수위센서값 → 유속센서값 → 진동센서값 순서로 넣으세요.', example:'수위센서값, 유속센서값, 진동센서값 → 센서값목록 [수위, 유속, 진동]', active:true},
    {title:'반복 검사', fault:'다중 센서 자동 검사 장치가 고장 났습니다!', description:'센서값 목록을 하나씩 검사하는 반복 과정이 삭제되었습니다.', task:'리스트 크기만큼 반복하고, 반복번호를 사용해 현재 센서값을 꺼내 위험 기준과 비교하여 감지개수를 증가시키세요.', example:'반복번호 = 1, 2, 3 → 감지개수 계산', active:false},
    {title:'경보 판단', fault:'대피 경보 판단 장치가 고장 났습니다!', description:'감지된 위험 센서 수에 따른 경보 발령 조건이 삭제되었습니다.', task:'감지개수가 2 이상이면 「경보결과」 변수를 1로, 그렇지 않으면 0으로 정하세요.', example:'감지개수 ≥ 2 → 경보결과 = 1', active:false},
    {title:'시스템 통합', fault:'자동 경보 시스템이 연결되지 않았습니다!', description:'개발한 기능을 전체 재난 시뮬레이션과 연결하여 검사해야 합니다.', task:'센서 데이터 저장부터 반복 검사, 경보 발령까지 통합하고 홍수·비홍수 상황에 시험하세요.', example:'실제 재난 시나리오 × 100회', active:false}
  ];
  const trigger = document.createElement('button'); trigger.id='nepal-entry-trigger'; trigger.textContent='🧩 엔트리 개발자 모드';
  const layer = document.createElement('section'); layer.id='nepal-entry-layer';
  layer.innerHTML=`<header class="ne-header"><div><strong>NEPAL FLOOD × ENTRY</strong><div style="font-size:11px;color:#b4caa9">실제 EntryJS 편집기 연동 · 기술 검증 v1.3</div></div><button id="ne-close">✕ 시뮬레이션으로 돌아가기</button></header><main class="ne-main"><aside class="ne-side"><div style="font-size:11px;color:#b2e879;font-weight:900">SYSTEM REPAIR / DEVELOPMENT CONSOLE</div><div id="ne-missions" class="ne-mission-list"></div><div class="ne-warning"><h2 id="ne-fault"></h2><p id="ne-why"></p></div><div class="ne-task"><b>🛠 복구 임무</b><div id="ne-task"></div></div><div class="ne-sample"><span>예상 입력·출력</span><br><div id="ne-example"></div></div><div id="ne-sensor-live">📡 수위 센서 측정값 수신 중…</div><button id="ne-check" style="background:#adeb6f;color:#142009;width:100%;font-size:15px;padding:14px">▶ 엔트리 실행 결과 검사</button><div id="ne-status" aria-live="polite">엔트리 편집기를 불러오는 중입니다…</div><p id="ne-mini">※ 원본 홍수 4유형·비홍수 3유형과 재난 엔진은 수정하지 않습니다.<br>※ 현재 버전은 엔트리 편집기 내장 및 미션 1·2 연동 시험용입니다. 미션 3~5의 실전 판정은 아직 연결하지 않았습니다.</p></aside><iframe id="ne-iframe" title="실제 엔트리 코딩 편집기" src="./nepal_entry_editor.html"></iframe></main>`;
  const launch = () => { layer.classList.add('open'); trigger.style.display='none';};
  const close = () => { layer.classList.remove('open'); trigger.style.display='';};
  trigger.addEventListener('click',launch);
  document.body.append(trigger,layer);
  document.getElementById('ne-close').addEventListener('click',close);
  const iframe=document.getElementById('ne-iframe'), status=document.getElementById('ne-status');
  // Bridge the *actual* installed flood simulator water-level sensor to the
  // EntryJS reporter. While no sensor/scenario exists, provide changing demo
  // observations and explicitly label them as simulation training data.
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
    const v=4.2+0.38*Math.sin(Date.now()/1350);
    return {value:Math.round(v*100)/100,source:'실습용 가상 수위 센서'};
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
    const base=kind==='flow'?3.1:2.8;
    const swing=kind==='flow'?.19:.16;
    const v=base+swing*Math.sin(Date.now()/(kind==='flow'?1510:1080));
    return {value:Math.round(v*100)/100,source:'실습용 가상 '+label};
  }
  function pushSensorMeasurement(){
    if(!layer.classList.contains('open'))return;
    const readings={};
    for(const kind of ['water','flow','vibration']){
      const reading=getNepalSensorMeasurement(kind);
      readings[kind]=reading;
      try{iframe.contentWindow?.postMessage({type:'NEPAL_SENSOR_TELEMETRY',sensor:kind,...reading},location.origin)}catch(e){console.warn(e)}
    }
    const display=document.getElementById('ne-sensor-live');
    if(display && (mission===0 || mission===1)){
      const fmt=r=>r.value.toFixed(2);
      display.innerHTML=mission===0
       ?'📡 '+readings.water.source+'<br><strong>'+fmt(readings.water)+' m</strong> · 센서는 계속 측정 중'
       :'📡 센서 측정값 (미리 만들어진 변수 아님)<br><strong>수위 '+fmt(readings.water)+' · 유속 '+fmt(readings.flow)+' · 진동 '+fmt(readings.vibration)+'</strong>';
    }
  }
  setInterval(pushSensorMeasurement,700);

  let mission=0, ready=false;
  const missionBtns=document.getElementById('ne-missions');
  cases.forEach((m,i)=>{const b=document.createElement('button'); b.textContent=String(i+1).padStart(2,'0');b.onclick=()=>changeMission(i);missionBtns.appendChild(b)});
  function changeMission(i){mission=i;const m=cases[i];document.getElementById('ne-sensor-live').style.display=i<=1?'block':'none'; [...missionBtns.children].forEach((b,n)=>b.classList.toggle('current',i===n));document.getElementById('ne-fault').textContent=m.fault;document.getElementById('ne-why').textContent=m.description;document.getElementById('ne-task').textContent=m.task;document.getElementById('ne-example').textContent=m.example;document.getElementById('ne-check').disabled=!m.active;document.getElementById('ne-check').textContent=m.active?'▶ 엔트리 실행 결과 검사':'연동 개발 중 · 검사 준비 중';status.textContent=m.active?'미션을 읽고 엔트리 편집기에서 실제 블록을 조립하세요.':'이 미션은 연동 계획 단계이며 자동 검사 기능이 아직 없습니다.';}
  changeMission(0);
  document.getElementById('ne-check').addEventListener('click',()=>{if(!ready){status.textContent='엔트리 편집기 로딩이 완료되지 않았습니다. 네트워크와 외부 라이브러리를 확인해 주세요.';return;} status.textContent='엔트리 실행을 요청했습니다. 검사 결과를 기다리는 중입니다…';iframe.contentWindow.postMessage({type:'NEPAL_TEST',mission},location.origin)});
  window.addEventListener('message',(event)=>{if(event.source!==iframe.contentWindow || event.origin!==location.origin)return; const d=event.data||{};
    if(d.type==='ENTRY_READY'){ready=true;pushSensorMeasurement();status.textContent='실제 엔트리 편집기 준비 완료. 자료 탭에서 변수를 직접 만들고 센서값 블록을 연결해 보세요.';}
    if(d.type==='ENTRY_ERROR'){ready=false;status.textContent='엔트리 로딩 오류: '+String(d.message||'알 수 없는 오류')+'\n하단 설치 안내를 참고해 주세요.';}
    if(d.type==='ENTRY_CHECK_RESULT'){status.textContent=(d.ok?'✅ 복구 검사 통과!':'❌ 복구 검사 실패')+'\n'+(Array.isArray(d.details)?d.details.join('\n'):String(d.message||''));}
  });
})();
