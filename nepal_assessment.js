/* Nepal x Entry: private individual performance assessment. No browser-side AI key. */
(function(global){
'use strict';
if(global.NepalAssessment)return;
const ROOT='nepal-v27/private/assessments';
const AI_RUBRIC_VERSION='mission-comprehension-2026-v1';
let aiPrivacyAcknowledged=false;
const FIELDS=[
 ['purpose','미션 1 · 변수와 센서값의 역할',1600],
 ['io','미션 2 · 반복과 값 갱신',1700],
 ['scenes','미션 3 · 조건문과 위험 판단',1700],
 ['algorithm','미션 4 · 여러 센서의 위험 판정',2300],
 ['functions','SEMI FINAL · N개 이상 경보',2400],
 ['test1','미션 6 · 리스트와 반복',1500],
 ['test2','FINAL · 종합 경보 판단',1500],
 ['changes','FINAL · 경보 조건 비교와 검증',1800],
 ['contribution','개인별 핵심 코드 설명',1300],
 ['aiUse','평가 범위 외 데이터 호환 필드',1300]
];
/* Clear, task-specific writing guidance; these prompts do not provide an answer. */
const GUIDES={
 purpose:{hint:'네팔 홍수 상황에서 어떤 문제를 해결하려는지, 누가 어떤 도움을 받는지 적어 보세요.',outline:'문제 상황: / 해결하려는 문제: / 프로그램의 목적:'},
 io:{hint:'4종 센서의 입력값, 위험 판정 및 경보 결정 과정을 입력→처리→출력 순서로 구분하세요.',outline:'입력 데이터: / 처리 과정: / 출력 결과:'},
 scenes:{hint:'사용한 엔트리 장면·오브젝트와 그 역할을 실제 만든 프로그램을 기준으로 설명하세요.',outline:'장면 또는 오브젝트: / 담당 기능: / 다른 부분과의 연결:'},
 algorithm:{hint:'변수·조건문·반복문·리스트가 각각 왜 필요한지 설명하고 경보 발령 과정을 순서대로 정리하세요.',outline:'사용한 변수: / 조건 판단: / 반복 처리: / 리스트 활용: / 최종 경보 규칙:'},
 functions:{hint:'실제 작성한 블록이 센서값을 갱신하고 위험을 판단하는 과정을 구체적으로 설명하세요.',outline:'핵심 기능: / 입력받는 값: / 작동 과정: / 실행 결과:'},
 test1:{hint:'시험한 첫 번째 상황을 기록하세요. 예상 결과와 실제 결과가 같았는지도 적으세요.',outline:'입력(센서값 또는 상황): / 예상 결과: / 실제 결과: / 일치 여부:'},
 test2:{hint:'첫 번째와 다른 상황을 시험하세요. 위험/안전 등 서로 대비되는 사례를 선택하면 좋아요.',outline:'입력(센서값 또는 상황): / 예상 결과: / 실제 결과: / 일치 여부:'},
 changes:{hint:'직접 겪은 오류·수정 경험이나 구체적인 개선 사항을 과정 중심으로 적으세요.',outline:'처음 문제: / 확인한 원인: / 수정 또는 개선: / 확인 결과:'},
 contribution:{hint:'조별 코딩과 개인 보고서 중 본인이 직접 수행한 작업을 구체적으로 쓰세요.',outline:'내 역할: / 직접 한 일: / 조원과 협력한 부분:'},
 aiUse:{hint:'AI를 사용했다면 도구명, 질문·활용 내용, 직접 검증한 내용을 적으세요. 사용하지 않았다면 ‘미사용’이라고 적으세요.',outline:'사용 도구: / 활용 목적: / 검토·수정한 내용: (사용하지 않은 경우: 미사용)'}
};
const RUBRICS=[
 ['개념 설계','30점','변수·반복·조건·여러 센서의 원리를 정확하게 설명','25점','핵심 개념을 대체로 바르게 설명','20점','일부 개념의 이해와 적용이 부족','15점','기본 개념의 이해가 매우 부족'],
 ['알고리즘 적용','30점','N개 경보·리스트·FINAL 상황을 정확하게 계산하고 적용','25점','주요 사례를 대체로 정확히 판단','20점','일부 사례만 정확하게 판단','15점','기본 사례 적용이 매우 부족'],
 ['이해·설명','40점','경보 경계값·개별 코드 원리·경보 안전성에 대해 근거를 들어 구체적으로 설명','30점','핵심 근거와 설명을 대체로 제시','20점','일부 근거나 설명만 적절','10점','설명과 근거가 매우 부족']
];
function rubricHtml(){
 return '<div class="na-card na-rubric"><h3>📋 수행평가 채점 기준 (총 100점)</h3><p class="na-muted">각 영역별 4단계 평가 · 교사가 제출한 설계서·실제 코드·보고서를 확인하여 최종 확정합니다.</p><div class="na-table-scroll"><table class="na-table"><thead><tr><th scope="col">영역</th><th scope="col">최상</th><th scope="col">상</th><th scope="col">중</th><th scope="col">하</th></tr></thead><tbody>'+RUBRICS.map(r=>'<tr><th scope="row">'+r[0]+'</th>'+[1,3,5,7].map(i=>'<td><b>'+r[i]+'</b><span class="na-rubric-desc">'+r[i+1]+'</span></td>').join('')+'</tr>').join('')+'</tbody></table></div></div>';
}
function minLength(k){return k==='aiUse'?2:15}
function updateProgress(){
 const answers=fields(),count=FIELDS.filter(([k])=>answers[k].length>=minLength(k)).length;
 const progress=el('na-progress');
 if(progress)progress.textContent='작성 기준 충족 '+count+'/'+FIELDS.length+'개 문항 (각 항목의 내용 적절성은 교사가 평가)';
}
function saveState(textValue){const status=el('na-save-state');if(status)status.textContent=textValue}
function codeInfo(snapshot){
 const obj=snapshot||{},raw=obj.payload;
 if(!raw)return {ok:false,reason:'서버에 저장된 조별 엔트리 코드가 없습니다.'};
 if(typeof raw!=='string'||raw.length>1250000)return {ok:false,reason:'저장된 엔트리 코드 용량 또는 형식이 올바르지 않습니다.'};
 let parsed;
 try{parsed=JSON.parse(raw)}catch(_){return {ok:false,reason:'저장된 엔트리 코드의 JSON 형식이 올바르지 않습니다.'}}
 const scripts=Array.isArray(parsed.objects)?parsed.objects.map(x=>JSON.stringify(x.script||[])).join(''):'';
 if(scripts.length<20)return {ok:false,reason:'작성된 엔트리 블록이 충분히 확인되지 않습니다.'};
 return {ok:true,code:raw,bytes:raw.length,updatedAt:Number(obj.updatedAt)||0,project:parsed};
}
function blockSummary(code){
 let project;
 try{project=JSON.parse(code||'')}catch(_){return '<p class="na-muted">제출 코드 구조를 읽을 수 없습니다.</p>'}
 const script=JSON.stringify((project.objects||[]).map(x=>x.script||[]));
 const labels=[
  ['센서 입력','nepal_live_water_sensor','nepal_live_flow_sensor','nepal_live_vibration_sensor','nepal_live_rain_sensor'],
  ['변수 저장','set_variable'],['조건문','if_else','_if'],
  ['반복문','repeat_inf','repeat_basic'],['리스트 접근','value_of_index_from_list','append_value_to_list'],
  ['경보 블록','nepal_alarm_sound']
 ];
 return '<div class="na-block-grid">'+labels.map(([name,...types])=>'<span class="na-block-chip">'+esc(name)+': '+(types.some(type=>script.includes('"'+type+'"'))?'발견':'미발견')+'</span>').join('')+'</div><p class="na-muted">블록 존재 여부를 빠르게 찾는 참고 정보입니다. 실행 성공·정답 여부를 자동으로 판정하지 않습니다.</p>';
}
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const formatTime=n=>Number(n)?new Date(Number(n)).toLocaleString('ko-KR'):'확인 중';
let panel=null,ctx=null,token=0,timer=null,writing=false,finalDoc=null,teacherDoc=null,teacherUid=null,aiResult=null;
const el=id=>panel?.querySelector('#'+id);
function message(s){if(el('na-message'))el('na-message').textContent=s}
function fields(){return Object.fromEntries(FIELDS.map(([k])=>[k,(el('na-'+k)?.value||'').trim()]))}
function mount(){
 if(panel)return;
 const css=document.createElement('style');
 css.textContent='#na-root{position:fixed;inset:0;z-index:18000;display:none;overflow:auto;background:#06110b;color:#e6f8dc;font:14px/1.65 system-ui,"Malgun Gothic",sans-serif}#na-root.show{display:block}#na-root *{box-sizing:border-box}.na-box{max-width:950px;margin:24px auto;padding:24px;background:#10261a;border:1px solid #47694a;border-radius:17px}.na-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.na-box h2{margin:0;color:#c6fba7}.na-card{background:#163020;border:1px solid #3a6544;border-radius:12px;padding:15px;margin:15px 0}.na-card h3{margin:0 0 9px;color:#d5ffb6}.na-muted{font-size:12px;color:#bcd0b4}.na-field{display:block;margin:13px 0}.na-field strong{display:block;margin:0 0 5px}.na-field textarea{display:block;width:100%;min-height:93px;padding:12px;resize:vertical;color:#fff;background:#08190f;border:1px solid #62816a;border-radius:8px;font:13px/1.6 system-ui}.na-btn{border:1px solid #8cbd7e;color:#e9ffe3;background:#264e34;border-radius:9px;padding:9px 13px;font-weight:800;cursor:pointer}.na-btn.primary{background:#c0f58b;color:#0b2b16}.na-btn:disabled{opacity:.55}.na-actions{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}.na-read{white-space:pre-wrap;overflow-wrap:anywhere;background:#0a1b11;padding:12px;border:1px solid #3c6746;border-radius:8px;margin-top:8px}.na-table{border-collapse:collapse;width:100%}.na-table td,.na-table th{padding:8px;border-bottom:1px solid #456949;text-align:left}.na-score{display:flex;gap:12px;flex-wrap:wrap}.na-score label{display:grid;gap:4px}.na-score select{padding:9px;background:#07190e;color:#fff;border:1px solid #779a80;border-radius:8px}.na-field>label{display:block;font-weight:800;margin-bottom:5px}.na-help{margin:0 0 8px;color:#c5d9ba;font-size:13px}.na-field textarea::placeholder{color:#a3b4a5;opacity:1}.na-table-scroll{overflow-x:auto}.na-rubric .na-table{min-width:740px;font-size:12px}.na-rubric .na-table th{min-width:100px}.na-rubric-desc{display:block;margin-top:4px;font-weight:400;color:#d3dfd0}.na-progress{font-weight:800;color:#d4f9ae;margin:10px 0}.na-code-status{padding:10px;background:#102e21;border:1px solid #4d865b;border-radius:8px}.na-check{padding:9px 12px;margin:6px 0;border-left:3px solid #96c882;background:#103021}.na-preview-list{margin:0;padding:0;list-style:none}.na-preview-list li{margin:11px 0}.na-block-grid{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}.na-block-chip{border:1px solid #5d9366;border-radius:8px;padding:4px 9px;background:#1d4129;font-size:12px}.na-compare{display:grid;grid-template-columns:1fr 1fr;gap:12px}.na-compare>div{min-width:0}.na-compare .na-read{max-height:310px;overflow:auto}#na-message{white-space:pre-wrap;min-height:28px;color:#c6eead}@media(max-width:700px){.na-compare{grid-template-columns:1fr}}@media(max-width:700px){.na-box{margin:0;padding:12px;border-radius:0}}';
 css.textContent+='#na-editor{padding-bottom:110px}#na-editor>.na-actions{position:fixed;bottom:14px;right:max(16px,calc((100vw - 950px)/2 + 22px));z-index:18100;display:flex;justify-content:flex-end;gap:10px;padding:10px 12px;margin:0;background:#10261af5;border:1px solid #547d59;border-radius:12px;box-shadow:0 -7px 24px #08180d99;max-width:calc(100vw - 32px)}#na-submit{font-size:16px;min-width:145px}@media(max-width:700px){#na-editor>.na-actions{left:12px;right:12px;justify-content:space-between}#na-editor>.na-actions .na-btn{flex:1;min-width:0}}';
 document.head.appendChild(css);
 panel=document.createElement('section');panel.id='na-root';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','수행평가 작성 및 관리');document.body.appendChild(panel);
}
function shell(title,desc){
 panel.innerHTML='<div class="na-box"><div class="na-top"><div><h2>'+esc(title)+'</h2><div class="na-muted">'+esc(desc)+'</div></div><button id="na-close" class="na-btn">✕ 닫기</button></div><div id="na-body"></div><div id="na-message" role="status"></div></div>';
 el('na-close').onclick=()=>{clearTimeout(timer);panel.classList.remove('show');token++};
 panel.classList.add('show');
}
function fieldHtml([k,title,max]){
 const guide=GUIDES[k]||{};
 return '<div class="na-field"><label for="na-'+k+'">문항 '+(FIELDS.findIndex(f=>f[0]===k)+1)+'. '+esc(title)+'</label><p class="na-help">'+esc(guide.hint||'본인의 실제 활동을 바탕으로 작성하세요.')+'</p><textarea id="na-'+k+'" maxlength="'+max+'" aria-describedby="na-count-'+k+'" placeholder="'+esc(guide.outline||'내용을 작성하세요.')+'"></textarea><small id="na-count-'+k+'" class="na-muted"></small></div>';
}
function storageKey(){return 'nepal-assessment-draft-v1:'+ctx.user.uid}
let prepared=null;
async function checkCodeStatus(){
 if(!ctx?.team)return;
 const box=el('na-code-status');if(!box)return;
 box.textContent='저장된 엔트리 코드 조회 중…';
 try{
  const snap=await ctx.db.ref(ctx.workPath(ctx.team.c,ctx.team.g)+'/code').once('value');
  if(!box.isConnected)return;
  const result=codeInfo(snap.val());
  box.textContent=result.ok
   ?'✓ 서버 저장 코드 확인 · 약 '+Math.round(result.bytes/1024)+'KB · 마지막 저장: '+(result.updatedAt?formatTime(result.updatedAt):'시간 기록 없음')+' · 현재 편집 중인 블록은 별도 저장해야 합니다.'
   :'⚠ '+result.reason+' 엔트리 개발자 모드에서 먼저 저장하세요.';
 }catch(e){box.textContent='⚠ 코드 저장 상태를 확인하지 못했습니다: '+String(e.message||e)}
}
async function studentOpen(t){
 shell('📝 엔트리 미션 1~7 이해 확인 수행평가',ctx.team.c+'반 '+ctx.team.g+'조 · 개인 이해 확인 · 총 100점 (최저 40점)');
 el('na-body').innerHTML='<div class="na-card">개념 설계 30점 / 알고리즘 적용 30점 / 이해·설명 40점. 각 미션의 핵심 개념을 확인하며, <b>개인 답안과 서버에 저장한 조별 엔트리 코드</b>를 함께 제출합니다. 최저 점수는 40점입니다.</div>'+rubricHtml()+'<div id="na-final-status"></div><div id="na-preview"></div><div id="na-editor"><div id="na-progress" class="na-progress">작성 기준 확인 중…</div><div class="na-card"><h3>① 미션 1~4 · 기초 개념 (30점)</h3>'+FIELDS.slice(0,4).map(fieldHtml).join('')+'</div><div class="na-card"><h3>② 조별 엔트리 코드 저장 확인 (참고 자료)</h3><p>엔트리 개발자 모드에서 블록을 완성한 뒤 <b>반드시 💾 저장</b>을 누르세요. 최종 제출에는 서버에 저장된 조별 코드를 사용합니다.</p><div id="na-code-status" class="na-code-status">서버 저장 상태 확인 중…</div><button id="na-check-code" class="na-btn" type="button">↻ 엔트리 저장 상태 다시 확인</button></div><div class="na-card"><h3>③ SEMI FINAL·미션 6·FINAL · 이해와 적용 (70점)</h3>'+FIELDS.slice(4).filter(([k])=>k!=='aiUse').map(fieldHtml).join('')+'</div><textarea id="na-aiUse" hidden maxlength="1300"></textarea><small id="na-count-aiUse" hidden></small><div id="na-save-state" class="na-muted" role="status">임시 저장 상태 확인 중…</div><div class="na-actions"><button id="na-save" class="na-btn" type="button">💾 임시 저장</button><button id="na-submit" class="na-btn primary" type="button">🔒 최종 제출</button></div><p class="na-muted">최종 제출을 누르면 확인창이 한 번 표시되며, 제출 완료 후에는 수정하거나 다시 제출할 수 없습니다.</p></div>';
 message('저장된 작성 내용을 불러오는 중…');
 try{
  const [submitted,draft]=await Promise.all([ctx.db.ref(ROOT+'/submissions/'+ctx.user.uid).once('value'),ctx.db.ref(ROOT+'/drafts/'+ctx.user.uid).once('value')]);
  if(t!==token)return;
  finalDoc=submitted.val();
  if(finalDoc){finished();return}
  let data=draft.val(),local=null;
  try{local=JSON.parse(localStorage.getItem(storageKey())||'null')}catch(_){}
  if(local&&(!data||Number(local.updatedAt)>Number(data.updatedAt)))data=local;
  for(const [k,,max] of FIELDS){
   const field=el('na-'+k);field.value=String(data?.fields?.[k]||'').trim();
   const update=()=>{el('na-count-'+k).textContent=field.value.length+'/'+max+'자'};
   update();
   field.oninput=()=>{update();updateProgress();saveState('작성 내용 변경됨 · 서버 임시 저장 대기');try{localStorage.setItem(storageKey(),JSON.stringify({fields:fields(),updatedAt:Date.now()}))}catch(_){}clearTimeout(timer);timer=setTimeout(()=>saveDraft(false),1800)};
  }
  updateProgress();
  el('na-check-code').onclick=checkCodeStatus;
  el('na-save').onclick=()=>saveDraft(true);
  el('na-submit').onclick=submitDirect;
  saveState('불러온 임시 저장 내용을 확인하세요. 입력 후 자동 저장됩니다.');
  message('각 문항에 답한 뒤 아래 [최종 제출] 버튼을 눌러 주세요.');
  checkCodeStatus();
 }catch(e){message('불러오기 실패: '+String(e.code||e.message||e))}
}
async function saveDraft(manual){
 if(writing||finalDoc||!ctx?.team)return false;
 writing=true;
 try{
  const draftFields=Object.fromEntries(Object.entries(fields()).map(([key,value])=>[key,value||' ']));
   // RTDB deletes empty-string values; keep blank draft fields as a single space so schema validation passes.
   await ctx.db.ref(ROOT+'/drafts/'+ctx.user.uid).set({classId:'c'+ctx.team.c,groupId:'g'+ctx.team.g,fields:draftFields,updatedAt:ctx.fb.database.ServerValue.TIMESTAMP});
  saveState('✓ Firebase 임시 저장 완료 · '+new Date().toLocaleTimeString('ko-KR')+' (최종 제출 전)');
   if(manual)message('✓ 임시 저장 완료. 최종 제출 전 확인은 별도로 진행하세요.');
  return true;
 }catch(e){saveState('⚠ 서버 임시 저장 실패 · 브라우저에는 작성 사본 보관 중');message('⚠ 임시 저장 실패: '+String(e.code||e.message||e)+' (브라우저에 작성 사본 보관)');return false}
 finally{writing=false}
}
function finished(){
 el('na-final-status').innerHTML='<div class="na-card"><h3>✅ 최종 제출 완료</h3><p>제출 시각: '+esc(formatTime(finalDoc.submittedAt))+'</p>이 내용과 제출 시점 엔트리 코드는 별도 보관되었습니다. 수정이나 재제출은 학생이 임의로 할 수 없습니다. 평가 점수는 교사가 최종 확정합니다.</div>';
 el('na-editor').hidden=true;message('조별 엔트리 원본 코드는 그대로 유지됩니다.');
}
function cancelPreview(reason){
 prepared=null;
 const preview=el('na-preview');if(preview)preview.innerHTML='';
 const editor=el('na-editor');if(editor)editor.hidden=false;
 if(reason)message(reason);
}
async function submitDirect(){
 if(finalDoc)return;
 const answer=fields(),missing=FIELDS.filter(([k])=>answer[k].length<minLength(k));
 if(missing.length){
  message('작성되지 않은 문항을 확인하세요: '+missing.filter(([k])=>k!=='aiUse').map(x=>x[1]).join(', '));
  el('na-'+missing[0][0])?.focus();return;
 }
 if(!confirm('개인별 수행평가 답안과 현재 서버에 저장된 조별 엔트리 코드를 최종 제출할까요?\n제출 후에는 수정하거나 다시 제출할 수 없습니다.'))return;
 const btn=el('na-submit');btn.disabled=true;
 message('최종 제출을 확인하고 있습니다. 제출 완료 메시지가 표시될 때까지 창을 닫지 마세요.');
 const submittedUid=ctx.user.uid,submittedClass=ctx.team.c,submittedGroup=ctx.team.g,opened=token;
 try{
  const [codeSnap,submittedSnap]=await Promise.all([
   ctx.db.ref(ctx.workPath(submittedClass,submittedGroup)+'/code').once('value'),
   ctx.db.ref(ROOT+'/submissions/'+submittedUid).once('value')
  ]);
  if(submittedSnap.exists())throw Error('이미 제출한 기록이 있습니다. 중복 제출을 차단했습니다.');
  if(token!==opened||ctx.user.uid!==submittedUid||ctx.team.c!==submittedClass||ctx.team.g!==submittedGroup)
   throw Error('로그인 계정 또는 조가 바뀌었습니다. 수행평가를 다시 열어 주세요.');
  const info=codeInfo(codeSnap.val());
  if(!info.ok)throw Error(info.reason+' 먼저 엔트리 개발자 모드에서 저장해 주세요.');
  // Preserve the existing double-check against a collaborator saving new code mid-submit.
  const [latestCode,latestSubmission]=await Promise.all([
   ctx.db.ref(ctx.workPath(submittedClass,submittedGroup)+'/code').once('value'),
   ctx.db.ref(ROOT+'/submissions/'+submittedUid).once('value')
  ]);
  if(latestSubmission.exists())throw Error('이미 제출 완료된 기록이 있습니다.');
  const current=codeInfo(latestCode.val());
  if(!current.ok||current.code!==info.code)throw Error('제출 처리 중 조별 코드가 변경되었습니다. 저장 상태를 확인한 후 다시 제출해 주세요.');
  const timestamp=ctx.fb.database.ServerValue.TIMESTAMP;
  const doc={classId:'c'+submittedClass,groupId:'g'+submittedGroup,displayName:String(ctx.user.displayName||'학생').slice(0,60),fields:answer,codeSnapshot:info.code,codeBytes:info.bytes,submittedAt:timestamp,version:1};
  const index={classId:doc.classId,groupId:doc.groupId,displayName:doc.displayName,codeBytes:info.bytes,submittedAt:timestamp};
  await ctx.db.ref(ROOT).update({['submissions/'+submittedUid]:doc,['index/'+submittedUid]:index});
  finalDoc={...doc,submittedAt:Date.now()};
  clearTimeout(timer);
  finished();
  message('✓ 수행평가 최종 제출 완료 · 개인 답안과 조별 코드 사본이 함께 보관되었습니다.');
 }catch(e){
  message('⚠ 최종 제출 실패: '+String(e.code||e.message||e)+'\n원본 작성 내용과 엔트리 코드는 삭제되지 않았습니다.');
  checkCodeStatus();
 }finally{if(btn?.isConnected)btn.disabled=false}
}

let gradebookRows=[],gradebookLoaded=false,gradebookLoading=false;
function selectedGradeRows(){
 const v=el('na-gb-class')?.value||'all';
 return v==='all'?gradebookRows:gradebookRows.filter(r=>r.clazz===Number(v));
}
function showGradebook(){
 const box=el('na-gb-table'),status=el('na-gb-status'),csv=el('na-gb-csv');
 if(!box||!status||!gradebookLoaded)return;
 const list=selectedGradeRows(),submitted=list.filter(r=>r.submitted).length,confirmed=list.filter(r=>r.status==='확정').length;
 status.textContent='계정·제출 기록 '+list.length+'명 / 제출 '+submitted+'명 / 점수 확정 '+confirmed+'명 / 미채점 '+(submitted-confirmed)+'명 / 미제출 '+(list.length-submitted)+'명 · 미로그인 학생은 명단에 없을 수 있습니다.';
 csv.disabled=list.length===0;
 const val=(v)=>esc(v==null?'—':v);
 box.innerHTML=list.length?'<table class="na-table"><thead><tr><th>반</th><th>번호</th><th>이름(등록명)</th><th>구글 계정 ID</th><th>조</th><th>개념 설계<br>30점</th><th>알고리즘 적용<br>30점</th><th>이해·설명<br>40점</th><th>총점<br>100점</th><th>상태·주의</th><th>상세</th></tr></thead><tbody>'+
 list.map(x=>{
  const score=x.score;
  const scores=score?'<td>'+val(score.design)+'</td><td>'+val(score.implementation)+'</td><td>'+val(score.report)+'</td><td><strong>'+val(score.total)+'</strong></td>':'<td>—</td><td>—</td><td>—</td><td>—</td>';
  return '<tr><td>'+val(x.clazz)+'</td><td>'+val(x.number)+'</td><td>'+val(x.name)+'</td><td>'+val(x.accountId)+'</td><td>'+val(x.group)+'</td>'+scores+
   '<td>'+val(x.status)+(x.warning?'<div class="na-muted" style="color:#ffe6a0">'+val(x.warning)+'</div>':'')+'</td><td>'+
   (x.submitted?'<button type="button" class="na-btn" data-gb-uid="'+val(x.uid)+'">보기</button>':'—')+'</td></tr>';
 }).join('')+'</tbody></table>':'<p class="na-muted">선택한 반에서 확인된 계정·제출 기록이 없습니다.</p>';
}
function exportGradebook(){
 if(!gradebookLoaded)return;
 const current=el('na-gb-class')?.value||'all',data=selectedGradeRows();
 if(!data.length)return;
 const rows=[['학년','반','번호','이름(등록명)','구글 계정 ID','조','개념 설계','알고리즘 적용','이해·설명','총점','상태','확인 필요']];
 data.forEach(x=>rows.push([x.grade,x.clazz,x.number??'',x.name,x.accountId,x.group??'',x.score?.design??'',x.score?.implementation??'',x.score?.report??'',x.score?.total??'',x.status,x.warning||'']));
 const clean=x=>{let s=String(x??'');if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
 const content='\ufeff'+rows.map(r=>r.map(clean).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='네팔_2026_1학년_'+(current==='all'?'전체':current+'반')+'_성적표.csv';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
async function fetchGradebook(){
 if(gradebookLoading||!ctx?.isTeacher)return;
 const state=el('na-gb-status'),button=el('na-gb-refresh');
 if(!state)return;
 gradebookLoading=true;if(button)button.disabled=true;
 const current=token;
 state.textContent='Firebase 학교 계정과 확정 점수를 조회하는 중…';
 try{
  if(typeof ctx.fb.app().functions!=='function'){
   await new Promise((resolve,reject)=>{
    const node=document.createElement('script');
    node.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-functions-compat.js';
    node.onload=resolve;node.onerror=()=>reject(Error('Firebase Functions SDK 로드 실패'));
    document.head.appendChild(node);
   });
  }
  const result=await ctx.fb.app().functions('asia-northeast3').httpsCallable('getNepalAssessmentGradebook')({});
  if(current!==token)return;
  if(!Array.isArray(result.data?.rows))throw Error('서버가 유효한 성적표 목록을 반환하지 않았습니다.');
  gradebookRows=result.data.rows;gradebookLoaded=true;showGradebook();
 }catch(e){
  if(current===token){gradebookLoaded=false;state.textContent='⚠ 반별 성적표 조회 실패: '+String(e.code||e.message||e)+' · 신규 Firebase 함수 배포를 확인하세요. 기존 학생 제출 목록·교사 채점은 그대로 사용할 수 있습니다.';}
 }finally{gradebookLoading=false;if(button?.isConnected)button.disabled=false}
}

async function teacherOpen(t){
 shell('📊 수행평가 제출·채점 현황','최종 제출본을 확인하고 AI 채점 제안을 참고하여 교사가 점수를 확정합니다.');
 el('na-body').innerHTML='<div class="na-card"><h3>🛡 학생 제출 공개 설정</h3><p>처음에는 학생에게 수행평가 버튼이 보이지 않습니다. 시험 제출과 Firebase 권한 확인을 마친 뒤 학생 제출을 열어 주세요.</p><button class="na-btn" id="na-publish" type="button">설정 확인 중…</button><div id="na-publish-state" class="na-muted"></div></div><div class="na-card">AI는 미션별 선택·개인 설명과 엔트리 코드의 블록 종류만으로 1차 채점안을 제안합니다. 학생 이름과 연락처 등 일반적인 식별정보는 가려 전송하지만 자유서술에 개인정보가 포함되지 않았는지 교사가 확인하고 학교 지침에 따라 이용하세요. 교사가 최종 점수를 확정하며, AI 제안은 학생에게 공개되지 않습니다.</div><div class="na-card"><h3>📊 반별 수행평가 성적표</h3><p class="na-muted">2026학년도 1학년 · 구글 계정 26-10101은 1학년 1반 1번입니다. 이름은 학생 등록명과 연결하며 교사 확정점수만 표시합니다.</p><div class="na-actions"><label for="na-gb-class">학급 선택</label><select id="na-gb-class" style="padding:9px;color:#fff;background:#092015;border:1px solid #739775;border-radius:8px"><option value="all">전체 1학년</option>'+Array.from({length:11},(_,i)=>'<option value="'+(i+1)+'">'+(i+1)+'반</option>').join('')+'</select><button id="na-gb-refresh" type="button" class="na-btn">↻ 조회</button><button id="na-gb-csv" type="button" class="na-btn" disabled>CSV 내려받기</button></div><div id="na-gb-status" class="na-muted">학교 계정과 성적표를 불러오는 중…</div><div id="na-gb-table" style="overflow:auto;max-height:62vh;margin-top:12px"></div></div><div class="na-card"><h3>학생 제출 목록</h3><div id="na-roster">조회 중…</div></div><div id="na-review"></div>';
 gradebookRows=[];gradebookLoaded=false;gradebookLoading=false;
 el('na-gb-class').onchange=showGradebook;
 el('na-gb-refresh').onclick=fetchGradebook;
 el('na-gb-csv').onclick=exportGradebook;
 el('na-gb-table').onclick=e=>{const btn=e.target.closest('button[data-gb-uid]');if(btn)loadReview(btn.dataset.gbUid)};
 fetchGradebook();
 let enabled=false;
 const configRef=ctx.db.ref(ROOT+'/config/enabled');
 const publish=el('na-publish'),status=el('na-publish-state');
 publish.disabled=true;
 try{
  const enabledSnap=await configRef.once('value');
  enabled=enabledSnap.val()===true;
  status.textContent=enabled?'학생 제출 공개 중':'학생에게 아직 비공개 상태입니다.';
  publish.textContent=enabled?'⛔ 학생 제출 닫기':'📢 학생 제출 열기';
  publish.disabled=false;
  publish.onclick=async()=>{
   if(!confirm(enabled?'학생이 새롭게 제출 화면에 접근하지 못하도록 닫을까요?\n기존 제출 기록은 보존됩니다.':'학생에게 수행평가 작성·제출 화면을 공개할까요?\nFirebase 보안 규칙과 제출 흐름을 먼저 확인해 주세요.'))return;
   publish.disabled=true;
   try{
    await configRef.set(!enabled);
    enabled=!enabled;
    status.textContent=enabled?'학생 제출 공개 중':'학생에게 아직 비공개 상태입니다.';
    publish.textContent=enabled?'⛔ 학생 제출 닫기':'📢 학생 제출 열기';
    message(enabled?'✓ 학생 수행평가 제출 기능을 열었습니다.':'✓ 학생 수행평가 제출 기능을 닫았습니다.');
   }catch(e){message('공개 설정 실패: '+String(e.code||e.message||e))}
   finally{publish.disabled=false}
  };
 }catch(e){publish.textContent='Firebase 규칙 게시 후 공개 설정 가능';status.textContent='설정 조회 실패: '+String(e.code||e.message||e)}
 try{
  const snap=await ctx.db.ref(ROOT+'/index').once('value');
  if(t!==token)return;
  const items=Object.entries(snap.val()||{}).map(([uid,x])=>({uid,...x})).sort((a,b)=>a.classId.localeCompare(b.classId,undefined,{numeric:true})||Number(a.groupId.slice(1))-Number(b.groupId.slice(1)));
  el('na-roster').innerHTML=items.length?'<p>제출 완료 '+items.length+'명</p><table class="na-table"><tr><th>반·조</th><th>제출자</th><th>제출 시각</th><th>열기</th></tr>'+items.map(x=>'<tr><td>'+esc(x.classId.slice(1))+'반 '+esc(x.groupId.slice(1))+'조</td><td>'+esc(x.displayName)+'</td><td>'+esc(formatTime(x.submittedAt))+'</td><td><button class="na-btn" data-uid="'+esc(x.uid)+'">보기</button></td></tr>').join('')+'</table>':'제출된 결과물이 없습니다.';
  el('na-roster').onclick=e=>{const b=e.target.closest('button[data-uid]');if(b)loadReview(b.dataset.uid)};
  message('학생의 [보기]를 선택하면 제출 원본과 채점 화면을 확인할 수 있습니다.');
 }catch(e){message('현황 조회 실패: '+String(e.code||e.message||e))}
}
async function loadReview(uid){
 teacherUid=uid;message('제출본 불러오는 중…');
 const container=el('na-review');container.innerHTML='';
 try{
  const [snap,review,ai]=await Promise.all([ctx.db.ref(ROOT+'/submissions/'+uid).once('value'),ctx.db.ref(ROOT+'/reviews/'+uid).once('value'),ctx.db.ref(ROOT+'/aiReviews/'+uid).once('value')]);
  if(teacherUid!==uid)return;
  teacherDoc=snap.val();aiResult=ai.val();if(!teacherDoc)throw Error('제출본이 없습니다.');
  const answerOverview='<div class="na-compare"><div><b>학생 설명 요약 (자기 서술 근거)</b>'+['io','algorithm','functions','test1','test2','changes'].map(k=>'<div class="na-read"><b>'+esc(FIELDS.find(f=>f[0]===k)?.[1]||k)+'</b>\n'+esc(teacherDoc.fields?.[k]||'미작성')+'</div>').join('')+'</div><div><b>실제 제출 코드 구성</b>'+blockSummary(teacherDoc.codeSnapshot)+'<p class="na-muted">학생의 설명과 코드 구조를 비교한 후 실행 결과를 확인하세요. 제출 코드 JSON은 별도 다운로드가 가능합니다.</p></div></div>';
  container.innerHTML='<div class="na-card"><h3>'+esc(teacherDoc.displayName)+' · '+esc(teacherDoc.classId.slice(1))+'반 '+esc(teacherDoc.groupId.slice(1))+'조</h3><p>'+esc(formatTime(teacherDoc.submittedAt))+' · 코드 '+Math.round((teacherDoc.codeBytes||0)/1024)+'KB</p><button id="na-code" class="na-btn">엔트리 제출 코드 JSON 내려받기</button></div>'+rubricHtml()+'<div class="na-card"><h3>🔍 학생 설명 ↔ 제출 코드 비교</h3>'+answerOverview+'</div>'+FIELDS.filter(([k])=>k!=='aiUse').map(([k,label])=>'<div class="na-card"><b>'+esc(label)+'</b><div class="na-read">'+esc(teacherDoc.fields?.[k]||'미작성')+'</div></div>').join('')+'<div class="na-card"><h3>🤖 AI 1차 채점 제안 · 교사 검증 필수</h3><p class="na-muted">AI는 자동으로 성적을 확정하지 않습니다. 원본과 비교한 뒤 교사가 최종 점수를 입력·저장합니다.</p><div id="na-ai"></div><div class="na-actions"><button id="na-run-ai" class="na-btn" type="button">AI 1차 채점 실행</button><button id="na-apply-ai" class="na-btn" type="button" disabled>AI 점수를 입력란에 불러오기</button></div></div><div class="na-card"><h3>교사 최종 평가</h3><div class="na-score">'+[['design','설계',[30,25,20,15]],['implementation','구현',[30,25,20,15]],['report','보고서',[40,30,20,10]]].map(([k,name,scores])=>'<label>'+name+'<select id="na-score-'+k+'"><option value="">선택</option>'+scores.map(x=>'<option value="'+x+'">'+x+'점</option>').join('')+'</select></label>').join('')+'</div><div class="na-card"><h3>교사 검증 확인</h3><label class="na-check"><input id="na-verify-answers" type="checkbox"> 학생의 선택 답과 개인 설명을 확인했습니다.</label><label class="na-check"><input id="na-verify-boundary" type="checkbox"> N개 이상·초과의 경계값과 문항별 판단을 검토했습니다.</label><label class="na-check"><input id="na-verify-code" type="checkbox"> 제출된 엔트리 코드 구조와 실제 이해 수준을 대조했습니다.</label></div><label class="na-field"><strong>교사 채점 근거 (필수)</strong><textarea id="na-teacher-note" maxlength="2400" placeholder="AI 판단과 다른 부분, 채점 근거 또는 실기 확인 결과를 기록하세요."></textarea></label><button class="na-btn primary" id="na-grade">✅ 교사 최종 점수 확정</button></div>';
  const old=review.val()||{};
  for(const key of ['design','implementation','report'])el('na-score-'+key).value=old[key]??'';
  el('na-teacher-note').value=old.note||'';
  el('na-grade').onclick=saveGrade;
  el('na-run-ai').onclick=runAI;
   el('na-apply-ai').onclick=applyAI;
  el('na-code').onclick=()=>{
   const blob=new Blob([teacherDoc.codeSnapshot],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download='nepal_entry_'+teacherDoc.classId+'_'+teacherDoc.groupId+'_'+uid.slice(0,8)+'.json';a.click();
   setTimeout(()=>URL.revokeObjectURL(url),1500);
  };
  showAI();message('AI의 영역별 근거와 9개 문항 판단을 확인하고, 교사가 점수를 수정·확정하세요.');
 }catch(e){message('제출본 읽기 실패: '+String(e.code||e.message||e))}
}
function currentAI(){
 return aiResult&&aiResult.rubricVersion===AI_RUBRIC_VERSION&&
  [30,25,20,15].includes(aiResult.design)&&[30,25,20,15].includes(aiResult.implementation)&&
  [40,30,20,10].includes(aiResult.report);
}
function showAI(){
 const display=el('na-ai'),apply=el('na-apply-ai');
 if(!display)return;
 if(apply)apply.disabled=!currentAI();
 if(!aiResult){display.innerHTML='<div class="na-read">AI 1차 채점이 아직 없습니다. 교사 계정에서 버튼을 눌러 점수와 근거를 요청하세요.</div>';return}
 if(!currentAI()){
  display.innerHTML='<div class="na-read">⚠ 과거 평가기준으로 생성된 AI 결과가 있거나 응답이 유효하지 않습니다. 이번 미션 이해도 기준으로 다시 AI 채점을 실행해야 합니다. 이전 제안점수는 교사 채점에 적용하지 않습니다.</div>';
  return;
 }
 const scores=[
  ['개념 설계',aiResult.design,30,aiResult.details?.designEvidence],
  ['알고리즘 적용',aiResult.implementation,30,aiResult.details?.implementationEvidence],
  ['이해·설명',aiResult.report,40,aiResult.details?.reportEvidence]
 ];
 const total=aiResult.design+aiResult.implementation+aiResult.report;
 const questions=(aiResult.details?.questions||[]);
 display.innerHTML='<div class="na-read"><b>AI 제안 총점: '+total+'/100점</b> (최저 40점, 4단계 점수)<p class="na-muted">AI 초안입니다. 교사 점수 저장 전에는 확정되지 않습니다.</p></div>'+
 scores.map(([name,got,max,evidence])=>'<div class="na-read"><b>'+esc(name)+' '+got+'/'+max+'점</b>\n'+esc(evidence||'세부 평가 근거를 확인해 주세요.')+'</div>').join('')+
 '<div class="na-read"><b>종합 판단</b>\n'+esc(aiResult.reason||'')+'</div>'+
 (aiResult.warnings?.length?'<div class="na-read"><b>⚠ 교사 검증 필요</b>\n'+aiResult.warnings.map(x=>'• '+esc(x)).join('\n')+'</div>':'')+
 '<details class="na-card"><summary>9개 문항별 AI 판단 펼쳐 보기</summary><div>'+questions.map(x=>{
  const label=FIELDS.find(f=>f[0]===x.key)?.[1]||x.key;
  return '<div class="na-read"><b>'+esc(label)+' — '+esc(x.judgment)+'</b>\n'+esc(x.reason)+'</div>';
 }).join('')+'</div></details>';
}
function applyAI(){
 if(!currentAI()){message('현재 미션 평가기준으로 생성된 AI 제안이 없습니다. 먼저 AI 1차 채점을 실행하세요.');return}
 const selected={design:aiResult.design,implementation:aiResult.implementation,report:aiResult.report};
 for(const [k,val] of Object.entries(selected)){
  const input=el('na-score-'+k);if(input)input.value=String(val);
 }
 message('✓ AI 제안점수를 교사 입력란으로 불러왔습니다. 원본 답안을 검증하고 필요한 점수를 수정한 뒤 [교사 점수 저장]을 눌러야 확정됩니다.');
}
async function runAI(){
 const btn=el('na-run-ai');
 if(!btn||!teacherUid)return;
 if(!aiPrivacyAcknowledged){
  if(!confirm('AI 1차 채점은 학생 답안(이름·일반 연락처 패턴 가림)과 엔트리 블록 종류 요약을 외부 AI 서비스로 전송합니다. 학생의 자유서술에 추가 개인정보가 포함되지 않았고 학교 개인정보 처리 지침상 이용 가능함을 확인했습니까?'))return;
  aiPrivacyAcknowledged=true;
 }
 const uid=teacherUid;
 btn.disabled=true;message('AI 1차 채점 요청 중 · 제출 답안의 개인정보를 제외하고 미션 평가 기준으로 분석합니다…');
 try{
  if(!ctx.fb.functions)await new Promise((ok,fail)=>{
   const x=document.createElement('script');
   x.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-functions-compat.js';
   x.onload=ok;x.onerror=fail;document.head.appendChild(x);
  });
  const result=await ctx.fb.app().functions('asia-northeast3').httpsCallable('gradeNepalAssessment')({uid});
  if(uid!==teacherUid)return;
  const suggested=result.data;
  if(!suggested||suggested.rubricVersion!==AI_RUBRIC_VERSION)
   throw Error('서버의 AI 채점 기준이 이전 버전입니다. Firebase Functions 서버를 새 버전으로 배포한 후 다시 실행하세요.');
  aiResult=suggested;showAI();
  message('✓ AI 1차 채점안이 도착했습니다. 9개 문항별 근거를 확인한 후 교사가 점수를 확정하세요.');
 }catch(e){
  message('⚠ AI 채점 호출 실패: '+String(e.code||e.message||e)+'\nCloud Functions 배포·OPENAI_API_KEY 설정·교사 계정 권한을 확인하세요. AI 없이 직접 채점도 가능합니다.');
 }finally{if(btn.isConnected)btn.disabled=false}
}
async function saveGrade(){
 const scores=Object.fromEntries(['design','implementation','report'].map(k=>[k,Number(el('na-score-'+k).value)]));
 if(![30,25,20,15].includes(scores.design)||![30,25,20,15].includes(scores.implementation)||![40,30,20,10].includes(scores.report)){message('평가계획에 정해진 점수 단계만 선택할 수 있습니다.');return}
 const total=scores.design+scores.implementation+scores.report;
 const requiredVerifications=['na-verify-answers','na-verify-boundary','na-verify-code'];
 if(requiredVerifications.some(id=>!el(id)?.checked)){
  message('최종 확정 전에 학생 답안·경계값·엔트리 코드 검증 항목 세 가지를 모두 확인해 주세요.');
  return;
 }
 const note=el('na-teacher-note').value.trim();
 if(note.length<5){message('교사가 확인한 채점 근거를 5자 이상 적어 주세요. AI 제안만으로 최종 점수를 확정하지 않습니다.');el('na-teacher-note').focus();return}
 const aiComparison=currentAI()?'\nAI 제안: '+(aiResult.design+aiResult.implementation+aiResult.report)+'점 / 교사 확정: '+total+'점':'';
 if(!confirm('학생 답안과 엔트리 코드를 교사가 검토하고 '+total+'점으로 최종 확정할까요?'+aiComparison))return;
 const btn=el('na-grade');btn.disabled=true;
 try{
  await ctx.db.ref(ROOT+'/reviews/'+teacherUid).set({...scores,note,reviewedAt:ctx.fb.database.ServerValue.TIMESTAMP,reviewedBy:ctx.user.uid});
  message('✓ '+total+'점 최종 채점 저장 완료. 학생에게 자동으로 점수를 공개하지 않습니다.');
  fetchGradebook();
 }catch(e){message('교사 점수 저장 실패: '+String(e.code||e.message||e))}
 finally{if(btn.isConnected)btn.disabled=false}
}
global.NepalAssessment={open:async options=>{
 if(!options?.user||!options?.db)return;
 ctx=options;mount();clearTimeout(timer);prepared=null;writing=false;finalDoc=null;teacherDoc=null;teacherUid=null;aiResult=null;
 const t=++token;
 if(options.isTeacher)await teacherOpen(t);
 else if(options.team)await studentOpen(t);
 else{shell('수행평가','반·조 로그인 후 이용할 수 있습니다.');message('학생 로그인 후 다시 시도하세요.')}
}};
})(window);
