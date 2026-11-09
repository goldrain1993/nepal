/* Nepal x Entry: private individual performance assessment. No browser-side AI key. */
(function(global){
'use strict';
if(global.NepalAssessment)return;
const ROOT='nepal-v27/private/assessments';
const FIELDS=[
 ['purpose','해결할 문제와 프로그램의 목적',1600],
 ['io','입력 → 처리 → 출력 설계',1700],
 ['scenes','장면·오브젝트와 주요 기능 설계',1700],
 ['algorithm','핵심 알고리즘 설계 (변수·조건·반복·리스트)',2300],
 ['functions','프로그램 주요 기능의 작동 원리',2400],
 ['test1','시험 사례 1 (입력·예상·실제 결과)',1500],
 ['test2','시험 사례 2 (입력·예상·실제 결과)',1500],
 ['changes','오류 수정 또는 개선 과정',1800],
 ['contribution','나의 역할과 기여',1300],
 ['aiUse','AI 활용 과정과 출처 (미사용 시 미사용)',1300]
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
 ['프로그램 설계','30점','목적·입력·처리·출력·장면·오브젝트·기능을 구체적으로 설계','25점','목적과 주요 구조를 적절하고 체계적으로 설계','20점','기본 기능과 구조 위주로 설계','15점','설계 내용이 거의 없거나 미흡'],
 ['프로그램 구현','30점','주요 기능 모두 작동하고 필요한 블록·제어 구조를 적절히 구현','25점','주요 기능이 작동하며 구현이 대체로 적절','20점','기본 기능만 부분적으로 작동','15점','거의 구현하지 못함'],
 ['개발 보고서','40점','목적·작동 원리·시험 2개 이상·수정·개인 기여를 구체적으로 작성','30점','주요 내용을 적절히 작성','20점','일부 내용만 작성','10점','보고서를 작성하지 않았거나 매우 미흡']
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
 return '<div class="na-field"><label for="na-'+k+'">'+esc(title)+'</label><p class="na-help">'+esc(guide.hint||'본인의 실제 활동을 바탕으로 작성하세요.')+'</p><textarea id="na-'+k+'" maxlength="'+max+'" aria-describedby="na-count-'+k+'" placeholder="'+esc(guide.outline||'내용을 작성하세요.')+'"></textarea><small id="na-count-'+k+'" class="na-muted"></small></div>';
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
 shell('📝 실생활 문제 해결 프로그래밍 수행평가',ctx.team.c+'반 '+ctx.team.g+'조 · 학생 개인 제출 · 총 100점');
 el('na-body').innerHTML='<div class="na-card">설계 30점 / 프로그램 구현 30점 / 개발 보고서 40점. <b>설계서·보고서는 개인별 작성</b>합니다. 조별 엔트리 코드는 서버에 저장된 사본으로 제출됩니다. AI 예상 점수·사전 피드백은 제공하지 않습니다.</div>'+rubricHtml()+'<div id="na-final-status"></div><div id="na-preview"></div><div id="na-editor"><div id="na-progress" class="na-progress">작성 기준 확인 중…</div><div class="na-card"><h3>① 프로그램 설계 (30점)</h3>'+FIELDS.slice(0,4).map(fieldHtml).join('')+'</div><div class="na-card"><h3>② 프로그램 구현 (30점)</h3><p>엔트리 개발자 모드에서 블록을 완성한 뒤 <b>반드시 💾 저장</b>을 누르세요. 최종 제출에는 서버에 저장된 조별 코드를 사용합니다.</p><div id="na-code-status" class="na-code-status">서버 저장 상태 확인 중…</div><button id="na-check-code" class="na-btn" type="button">↻ 엔트리 저장 상태 다시 확인</button></div><div class="na-card"><h3>③ 프로그램 개발 보고서 (40점)</h3>'+FIELDS.slice(4).map(fieldHtml).join('')+'</div><div id="na-save-state" class="na-muted" role="status">임시 저장 상태 확인 중…</div><div class="na-actions"><button id="na-save" class="na-btn" type="button">💾 임시 저장</button><button id="na-submit" class="na-btn primary" type="button">🔍 제출 전 확인</button></div><p class="na-muted">‘최종 제출 확정’ 이후에는 학생이 수정하거나 다시 제출할 수 없습니다.</p></div>';
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
   const field=el('na-'+k);field.value=data?.fields?.[k]||'';
   const update=()=>{el('na-count-'+k).textContent=field.value.length+'/'+max+'자'};
   update();
   field.oninput=()=>{update();updateProgress();saveState('작성 내용 변경됨 · 서버 임시 저장 대기');try{localStorage.setItem(storageKey(),JSON.stringify({fields:fields(),updatedAt:Date.now()}))}catch(_){}clearTimeout(timer);timer=setTimeout(()=>saveDraft(false),1800)};
  }
  updateProgress();
  el('na-check-code').onclick=checkCodeStatus;
  el('na-save').onclick=()=>saveDraft(true);
  el('na-submit').onclick=previewSubmission;
  saveState('불러온 임시 저장 내용을 확인하세요. 입력 후 자동 저장됩니다.');
  message('마지막에는 [제출 전 확인] → [최종 제출 확정]을 눌러야 제출됩니다.');
  checkCodeStatus();
 }catch(e){message('불러오기 실패: '+String(e.code||e.message||e))}
}
async function saveDraft(manual){
 if(writing||finalDoc||!ctx?.team)return false;
 writing=true;
 try{
  await ctx.db.ref(ROOT+'/drafts/'+ctx.user.uid).set({classId:'c'+ctx.team.c,groupId:'g'+ctx.team.g,fields:fields(),updatedAt:ctx.fb.database.ServerValue.TIMESTAMP});
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
async function previewSubmission(){
 if(finalDoc)return;
 const answer=fields(),missing=FIELDS.filter(([k])=>answer[k].length<minLength(k));
 if(missing.length){
  message('작성 기준에 못 미치는 문항: '+missing.map(x=>x[1]).join(', '));
  el('na-'+missing[0][0])?.focus();return;
 }
 const btn=el('na-submit');btn.disabled=true;message('제출할 서버 저장 코드와 기존 제출 여부를 확인 중…');
 try{
  const [codeSnap,submittedSnap]=await Promise.all([
   ctx.db.ref(ctx.workPath(ctx.team.c,ctx.team.g)+'/code').once('value'),
   ctx.db.ref(ROOT+'/submissions/'+ctx.user.uid).once('value')
  ]);
  if(submittedSnap.exists())throw Error('이미 최종 제출한 기록이 있습니다. 화면을 다시 열어 확인하세요.');
  const info=codeInfo(codeSnap.val());
  if(!info.ok)throw Error(info.reason);
  prepared={answer,code:info.code,updatedAt:info.updatedAt,bytes:info.bytes,classId:'c'+ctx.team.c,groupId:'g'+ctx.team.g,uid:ctx.user.uid};
  clearTimeout(timer);
  el('na-preview').innerHTML='<div class="na-card"><h3>🔒 최종 제출 전 확인</h3><p><b>'+esc(ctx.team.c+'반 '+ctx.team.g+'조 · '+String(ctx.user.displayName||'학생'))+'</b> · 개인 답안 10문항과 조별 저장 코드를 함께 제출합니다.</p><div class="na-check">✓ 서술형 답안 10개 모두 작성 기준 충족</div><div class="na-check">✓ 서버에 저장된 엔트리 블록 사본 확인 · 약 '+Math.round(info.bytes/1024)+'KB · 저장 시간: '+(info.updatedAt?formatTime(info.updatedAt):'기록 없음')+'</div><p class="na-muted">제출 직전에 다른 조원이 코드를 다시 저장하면 변경된 코드로 새 미리보기를 확인해야 합니다. 현재 엔트리 편집기에 저장하지 않은 변경 사항은 제출되지 않습니다.</p><h3>제출 답안 미리보기</h3><ol class="na-preview-list">'+FIELDS.map(([k,name],i)=>'<li><b>'+(i+1)+'. '+esc(name)+'</b><div class="na-read">'+esc(answer[k])+'</div></li>').join('')+'</ol><label class="na-check"><input type="checkbox" id="na-ack"> 실제 작성한 내용과 조별 저장 코드를 확인했으며, 제출 후 학생이 수정하거나 재제출할 수 없음을 이해했습니다.</label><div class="na-actions"><button type="button" class="na-btn" id="na-back">← 수정하러 돌아가기</button><button type="button" class="na-btn primary" id="na-final-submit" disabled>🔒 최종 제출 확정</button></div></div>';
  el('na-editor').hidden=true;
  el('na-back').onclick=()=>{cancelPreview('미리보기에서 돌아왔습니다. 작성 내용을 수정할 수 있습니다.');checkCodeStatus()};
  el('na-ack').onchange=()=>{el('na-final-submit').disabled=!el('na-ack').checked};
  el('na-final-submit').onclick=submitPrepared;
  message('답안과 서버 저장 코드를 확인하고 체크한 다음 최종 제출을 확정하세요.');
 }catch(e){prepared=null;message('⚠ 제출 전 확인 실패: '+String(e.code||e.message||e))}
 finally{if(btn.isConnected)btn.disabled=false}
}
async function submitPrepared(){
 if(finalDoc||!prepared||!el('na-ack')?.checked)return;
 const pending=prepared,btn=el('na-final-submit');
 btn.disabled=true;message('최종 제출 중 · 코드 변경 여부와 기존 제출 기록을 다시 확인합니다…');
 try{
  if(ctx.user.uid!==pending.uid||'c'+ctx.team.c!==pending.classId||'g'+ctx.team.g!==pending.groupId)
   throw Error('로그인 계정 또는 조 정보가 바뀌었습니다. 수행평가를 다시 열어 주세요.');
  const [codeSnap,submittedSnap]=await Promise.all([
   ctx.db.ref(ctx.workPath(ctx.team.c,ctx.team.g)+'/code').once('value'),
   ctx.db.ref(ROOT+'/submissions/'+ctx.user.uid).once('value')
  ]);
  if(submittedSnap.exists())throw Error('이미 제출된 기록이 있습니다. 중복 제출하지 않습니다.');
  const current=codeInfo(codeSnap.val());
  if(!current.ok||current.code!==pending.code)throw Error('미리보기 이후 서버 저장 코드가 변경되었습니다. 다시 [제출 전 확인]을 진행하세요.');
  const timestamp=ctx.fb.database.ServerValue.TIMESTAMP;
  const doc={classId:pending.classId,groupId:pending.groupId,displayName:String(ctx.user.displayName||'학생').slice(0,60),fields:pending.answer,codeSnapshot:pending.code,codeBytes:pending.bytes,submittedAt:timestamp,version:1};
  const index={classId:doc.classId,groupId:doc.groupId,displayName:doc.displayName,codeBytes:pending.bytes,submittedAt:timestamp};
  await ctx.db.ref(ROOT).update({['submissions/'+ctx.user.uid]:doc,['index/'+ctx.user.uid]:index});
  prepared=null;clearTimeout(timer);
  finalDoc={...doc,submittedAt:Date.now()};
  el('na-preview').innerHTML='';
  finished();
 }catch(e){cancelPreview('⚠ 최종 제출 실패: '+String(e.code||e.message||e)+'\\n원본 답안과 엔트리 코드는 삭제되지 않았습니다.');checkCodeStatus()}
 finally{if(btn.isConnected)btn.disabled=false}
}
async function teacherOpen(t){
 shell('📊 수행평가 제출·채점 현황','최종 제출본을 확인하고 AI 채점 제안을 참고하여 교사가 점수를 확정합니다.');
 el('na-body').innerHTML='<div class="na-card"><h3>🛡 학생 제출 공개 설정</h3><p>처음에는 학생에게 수행평가 버튼이 보이지 않습니다. 시험 제출과 Firebase 권한 확인을 마친 뒤 학생 제출을 열어 주세요.</p><button class="na-btn" id="na-publish" type="button">설정 확인 중…</button><div id="na-publish-state" class="na-muted"></div></div><div class="na-card">AI 점수는 학생에게 공개되지 않습니다. 교사가 [AI 1차 채점]을 누른 경우에만 서버를 호출합니다. 서버 미배포 시에는 교사 직접 채점이 가능합니다.</div><div class="na-card"><h3>학생 제출 목록</h3><div id="na-roster">조회 중…</div></div><div id="na-review"></div>';
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
  const answerOverview='<div class="na-compare"><div><b>학생 설명 요약 (자기 서술 근거)</b>'+['io','algorithm','functions','test1','test2','changes'].map(k=>'<div class="na-read"><b>'+esc(FIELDS.find(f=>f[0]===k)?.[1]||k)+'</b>\\n'+esc(teacherDoc.fields?.[k]||'미작성')+'</div>').join('')+'</div><div><b>실제 제출 코드 구성</b>'+blockSummary(teacherDoc.codeSnapshot)+'<p class="na-muted">학생의 설명과 코드 구조를 비교한 후 실행 결과를 확인하세요. 제출 코드 JSON은 별도 다운로드가 가능합니다.</p></div></div>';
  container.innerHTML='<div class="na-card"><h3>'+esc(teacherDoc.displayName)+' · '+esc(teacherDoc.classId.slice(1))+'반 '+esc(teacherDoc.groupId.slice(1))+'조</h3><p>'+esc(formatTime(teacherDoc.submittedAt))+' · 코드 '+Math.round((teacherDoc.codeBytes||0)/1024)+'KB</p><button id="na-code" class="na-btn">엔트리 제출 코드 JSON 내려받기</button></div>'+rubricHtml()+'<div class="na-card"><h3>🔍 학생 설명 ↔ 제출 코드 비교</h3>'+answerOverview+'</div>'+FIELDS.map(([k,label])=>'<div class="na-card"><b>'+esc(label)+'</b><div class="na-read">'+esc(teacherDoc.fields?.[k]||'미작성')+'</div></div>').join('')+'<div class="na-card"><h3>AI 1차 채점 (교사에게만 표시)</h3><div id="na-ai"></div><button id="na-run-ai" class="na-btn">AI 채점 요청</button></div><div class="na-card"><h3>교사 최종 평가</h3><div class="na-score">'+[['design','설계',[30,25,20,15]],['implementation','구현',[30,25,20,15]],['report','보고서',[40,30,20,10]]].map(([k,name,scores])=>'<label>'+name+'<select id="na-score-'+k+'"><option value="">선택</option>'+scores.map(x=>'<option value="'+x+'">'+x+'점</option>').join('')+'</select></label>').join('')+'</div><label class="na-field"><strong>교사 채점 근거</strong><textarea id="na-teacher-note" maxlength="2400"></textarea></label><button class="na-btn primary" id="na-grade">교사 점수 저장</button></div>';
  const old=review.val()||{};
  for(const key of ['design','implementation','report'])el('na-score-'+key).value=old[key]??'';
  el('na-teacher-note').value=old.note||'';
  el('na-grade').onclick=saveGrade;
  el('na-run-ai').onclick=runAI;
  el('na-code').onclick=()=>{
   const blob=new Blob([teacherDoc.codeSnapshot],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download='nepal_entry_'+teacherDoc.classId+'_'+teacherDoc.groupId+'_'+uid.slice(0,8)+'.json';a.click();
   setTimeout(()=>URL.revokeObjectURL(url),1500);
  };
  showAI();message('AI 채점은 참고용입니다. 교사가 원본과 평가계획을 확인하고 확정하세요.');
 }catch(e){message('제출본 읽기 실패: '+String(e.code||e.message||e))}
}
function showAI(){
 const e=el('na-ai');if(!e)return;
 e.innerHTML=aiResult?'<div class="na-read">AI 제안: 설계 '+esc(aiResult.design)+'/30 · 구현 '+esc(aiResult.implementation)+'/30 · 보고서 '+esc(aiResult.report)+'/40\n'+esc(aiResult.reason||'')+'</div>':'아직 AI 채점을 실행하지 않았습니다.';
}
async function runAI(){
 const btn=el('na-run-ai');btn.disabled=true;message('AI 서버에 채점 요청 중…');
 try{
  if(!ctx.fb.functions)await new Promise((ok,fail)=>{const x=document.createElement('script');x.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-functions-compat.js';x.onload=ok;x.onerror=fail;document.head.appendChild(x)});
  const result=await ctx.fb.app().functions('asia-northeast3').httpsCallable('gradeNepalAssessment')({uid:teacherUid});
  aiResult=result.data;showAI();
  message('✓ AI 채점 제안을 받았습니다. 교사의 최종 확인이 필요합니다.');
 }catch(e){message('AI 채점 서버가 아직 배포되지 않았거나 호출 실패: '+String(e.code||e.message||e))}
 finally{if(btn.isConnected)btn.disabled=false}
}
async function saveGrade(){
 const scores=Object.fromEntries(['design','implementation','report'].map(k=>[k,Number(el('na-score-'+k).value)]));
 if(![30,25,20,15].includes(scores.design)||![30,25,20,15].includes(scores.implementation)||![40,30,20,10].includes(scores.report)){message('평가계획에 정해진 점수 단계만 선택할 수 있습니다.');return}
 const total=scores.design+scores.implementation+scores.report;
 if(!confirm(total+'점으로 교사 최종 채점을 저장할까요?'))return;
 const btn=el('na-grade');btn.disabled=true;
 try{
  await ctx.db.ref(ROOT+'/reviews/'+teacherUid).set({...scores,note:el('na-teacher-note').value.trim(),reviewedAt:ctx.fb.database.ServerValue.TIMESTAMP,reviewedBy:ctx.user.uid});
  message('✓ '+total+'점 최종 채점 저장 완료. 학생에게 자동으로 점수를 공개하지 않습니다.');
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
