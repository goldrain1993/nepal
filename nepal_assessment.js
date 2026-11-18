/* Nepal x Entry: private individual performance assessment. No browser-side AI key. */
(function(global){
'use strict';
if(global.NepalAssessment)return;
const ROOT='nepal-v27/private/assessments';
const AI_RUBRIC_VERSION='mission-comprehension-2026-v5';
const AI_QUESTION_LABELS={"Q01":"미션 1 · 수위값 변수에 저장해야 할 데이터는 무엇인가요?","Q02":"미션 1·2 · 수위값을 저장할 때 '계속 반복하기'를 사용하지 않으면 어떤 문제가 생길까요?","Q03":"미션 2 · 실시간 수위 경보 프로그램의 올바른 처리 순서는?","Q04":"미션 3 · 위험 기준이 수위 4.0m 이상이고 현재 수위가 4.2m일 때, 수위위험 값은?","Q05":"미션 3 · 수위위험 변수에는 어떤 값이 저장되나요?","Q06":"미션 4 · 네 센서의 위험 여부를 각각 저장하는 올바른 방법은?","Q07":"미션 5 · 수위위험 + 유속위험 + 진동위험 + 강수위험의 값의 범위는?","Q08":"미션 5 · 네 개의 위험 변수(각 0 또는 1)를 모두 더한 값은 무엇을 의미하나요?","Q09":"미션 5 · 위험개수 ≥ N 규칙에서 N은 무엇을 뜻하나요?","Q10":"미션 5 · 위험 신호가 [1,0,1,0]이고 N=2라면, 위험개수 ≥ N 규칙의 결과는?","Q11":"미션 6 · 엔트리 리스트는 무엇을 순서대로 모아 저장하는 자료구조인가요?","Q12":"미션 6 · 리스트 [1,0,1,1]에 기록된 위험한 센서는 몇 개인가요?","Q13":"미션 6 · 반복 계산할 때 '위험개수를 0으로 정하기' 코드가 빠지면 어떤 일이 생기나요?","Q14":"미션 6 · 여러 개의 변수를 따로 사용하는 것보다 리스트와 반복문을 함께 사용할 때 장점은?","Q15":"FINAL · 불필요한 경보와 경보 누락은 각각 네팔 주민에게 어떤 영향을 주나요?","Q16":"FINAL · 위험개수=2, N=2일 때 '위험개수 ≥ N'과 '위험개수 > N'의 결과를 비교하면?","Q17":"개인 코드 설명 · 엔트리 개발자 모드에서 사용한 코드 중 한 부분을 골라, 관련 프로그래밍 개념과 작동 원리를 자신의 말로 설명하세요."};
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
 contribution:{hint:'엔트리 미션에서 사용한 코드를 하나 선택하여 관련 프로그래밍 개념과 작동 원리를 설명하세요.',outline:'설명할 코드: / 사용한 프로그래밍 개념: / 작동 원리:'},
 aiUse:{hint:'AI를 사용했다면 도구명, 질문·활용 내용, 직접 검증한 내용을 적으세요. 사용하지 않았다면 ‘미사용’이라고 적으세요.',outline:'사용 도구: / 활용 목적: / 검토·수정한 내용: (사용하지 않은 경우: 미사용)'}
};
const RUBRICS=[
 ['개념 설계','30점','변수·반복·조건·여러 센서의 원리를 정확하게 설명','25점','핵심 개념을 대체로 바르게 설명','20점','일부 개념의 이해와 적용이 부족','15점','기본 개념의 이해가 매우 부족'],
 ['알고리즘 적용','30점','N개 경보·리스트·FINAL 상황을 정확하게 계산하고 적용','25점','주요 사례를 대체로 정확히 판단','20점','일부 사례만 정확하게 판단','15점','기본 사례 적용이 매우 부족'],
 ['이해·설명','40점','경보 경계값·개별 코드 원리·경보 안전성에 대해 근거를 들어 구체적으로 설명','30점','핵심 근거와 설명을 대체로 제시','20점','일부 근거나 설명만 적절','10점','설명과 근거가 매우 부족']
];
function rubricHtml(){
 return '<div class="na-card na-rubric"><h3>📋 수행평가 채점 기준 (총 100점)</h3><p class="na-muted">각 영역별 4단계 평가 · 교사가 개인 답안과 채점 근거를 확인하여 최종 확정합니다.</p><div class="na-table-scroll"><table class="na-table"><thead><tr><th scope="col">영역</th><th scope="col">최상</th><th scope="col">상</th><th scope="col">중</th><th scope="col">하</th></tr></thead><tbody>'+RUBRICS.map(r=>'<tr><th scope="row">'+r[0]+'</th>'+[1,3,5,7].map(i=>'<td><b>'+r[i]+'</b><span class="na-rubric-desc">'+r[i+1]+'</span></td>').join('')+'</tr>').join('')+'</tbody></table></div></div>';
}
function minLength(k){return k==='aiUse'?2:15}
function updateProgress(){
 const answers=fields(),count=FIELDS.filter(([k])=>answers[k].length>=minLength(k)).length;
 const progress=el('na-progress');
 if(progress)progress.textContent='작성 기준 충족 '+count+'/'+FIELDS.length+'개 문항 (각 항목의 내용 적절성은 교사가 평가)';
}
function saveState(textValue){const status=el('na-save-state');if(status)status.textContent=textValue}

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
 css.textContent+="\n #na-root .na-gradebook-details{padding:14px 17px}\n #na-root .na-gradebook-summary{cursor:pointer;list-style:disclosure-closed;font-weight:900;font-size:17px;color:#c3efff}\n #na-root .na-gradebook-details[open] .na-gradebook-summary{margin-bottom:16px}\n #na-root .na-gradebook-summary .na-muted{font-size:12px;font-weight:500;margin-left:10px}\n #na-root .na-ai-done{color:#91efd0;font-weight:850}\n #na-root .na-ai-warning{color:#ffd18a;font-weight:750}\n #na-root .na-ai-pending{color:#c5d4e2}\n ";
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

async function studentOpen(t){
 shell('📝 엔트리 미션 1~7 이해 확인 수행평가',ctx.student.c+'반 · '+ctx.student.name+' · 개인 이해 확인 · 총 100점 (최저 40점)');
 el('na-body').innerHTML='<div class="na-card">개념 설계 30점 / 알고리즘 적용 30점 / 이해·설명 40점. 17문항으로 각 미션의 핵심 개념을 확인하며, <b>개인별 답안</b>만 제출하며 조별 코드 저장은 필요하지 않습니다. 최저 점수는 40점입니다.</div>'+rubricHtml()+'<div id="na-final-status"></div><div id="na-preview"></div><div id="na-editor"><div id="na-progress" class="na-progress">작성 기준 확인 중…</div><div class="na-card"><h3>① 미션 1~4 · 기초 개념 (30점)</h3>'+FIELDS.slice(0,4).map(fieldHtml).join('')+'</div><div class="na-card"><h3>② SEMI FINAL·미션 6·FINAL · 이해와 적용 (70점)</h3>'+FIELDS.slice(4).filter(([k])=>k!=='aiUse').map(fieldHtml).join('')+'</div><textarea id="na-aiUse" hidden maxlength="1300"></textarea><small id="na-count-aiUse" hidden></small><div id="na-save-state" class="na-muted" role="status">임시 저장 상태 확인 중…</div><div class="na-actions"><button id="na-save" class="na-btn" type="button">💾 임시 저장</button><button id="na-submit" class="na-btn primary" type="button">🔒 최종 제출</button></div><p class="na-muted">최종 제출을 누르면 확인창이 한 번 표시되며, 제출 완료 후에는 수정하거나 다시 제출할 수 없습니다.</p></div>';
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

  el('na-save').onclick=()=>saveDraft(true);
  el('na-submit').onclick=submitDirect;
  saveState('불러온 임시 저장 내용을 확인하세요. 입력 후 자동 저장됩니다.');
  message('각 문항에 답한 뒤 아래 [최종 제출] 버튼을 눌러 주세요.');

 }catch(e){message('불러오기 실패: '+String(e.code||e.message||e))}
}
async function saveDraft(manual){
 if(writing||finalDoc||!ctx?.student)return false;
 writing=true;
 try{
  const draftFields=Object.fromEntries(Object.entries(fields()).map(([key,value])=>[key,value||' ']));
  await ctx.db.ref(ROOT+'/drafts/'+ctx.user.uid).set({classId:'c'+ctx.student.c,fields:draftFields,updatedAt:ctx.fb.database.ServerValue.TIMESTAMP});
  saveState('✓ Firebase 개인별 임시 저장 완료 · '+new Date().toLocaleTimeString('ko-KR'));
  if(manual)message('✓ 개인 답안 임시 저장 완료.');
  return true;
 }catch(e){
  saveState('⚠ 서버 임시 저장 실패 · 브라우저에는 작성 사본 보관 중');
  message('⚠ 임시 저장 실패: '+String(e.code||e.message||e));return false;
 }finally{writing=false}
}
function finished(){
 el('na-final-status').innerHTML='<div class="na-card"><h3>✅ 최종 제출 완료</h3><p>제출 시각: '+esc(formatTime(finalDoc.submittedAt))+'</p>개인별 답안이 보관되었습니다. 학생은 수정하거나 재제출할 수 없으며, 교사가 최종 점수를 확정합니다.</div>';
 el('na-editor').hidden=true;message('개인별 수행평가 제출이 완료되었습니다.');
}
function cancelPreview(reason){
 prepared=null;
 const preview=el('na-preview');if(preview)preview.innerHTML='';
 const editor=el('na-editor');if(editor)editor.hidden=false;
 if(reason)message(reason);
}
async function submitDirect(){
 if(finalDoc||!ctx?.student)return;
 const answer=Object.fromEntries(Object.entries(fields()).map(([k,value])=>[k,value||' ']));
 // Blank answers are allowed; the guided 17-page UI separately requires every page to have been viewed.
 if(!confirm('17문항을 최종 제출할까요?\n미응답 문항은 오답 또는 서술형 보완 필요로 처리됩니다. 제출 후 수정·재제출할 수 없습니다.'))return;
 const btn=el('na-submit');btn.disabled=true;message('개인 수행평가 최종 제출 중입니다…');
 const uid=ctx.user.uid,classId='c'+ctx.student.c,displayName=ctx.student.name,opened=token;
 try{
  const prev=await ctx.db.ref(ROOT+'/submissions/'+uid).once('value');
  if(prev.exists())throw Error('이미 제출한 기록이 있습니다. 중복 제출을 차단했습니다.');
  if(token!==opened||ctx.user.uid!==uid||'c'+ctx.student.c!==classId)throw Error('학생 계정이나 반이 바뀌었습니다.');
  const timestamp=ctx.fb.database.ServerValue.TIMESTAMP;
  const doc={classId,displayName,fields:answer,submittedAt:timestamp,version:2};
  const index={classId,displayName,submittedAt:timestamp,version:2};
  await ctx.db.ref(ROOT).update({['submissions/'+uid]:doc,['index/'+uid]:index});
  finalDoc={...doc,submittedAt:Date.now()};clearTimeout(timer);finished();
  message('✓ 개인별 수행평가 최종 제출 완료 · 조 정보와 무관하게 기록되었습니다.');
 }catch(e){message('⚠ 제출 실패: '+String(e.code||e.message||e)+'\n답안은 삭제되지 않았습니다.')}
 finally{if(btn?.isConnected)btn.disabled=false}
}
let gradebookRows=[],gradebookLoaded=false,gradebookLoading=false;
let aiBatchRunning=false,aiBatchCancel=false;
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
 const batch=el('na-ai-batch');if(batch)batch.disabled=aiBatchRunning||el('na-gb-class')?.value==='all'||!list.some(r=>r.submitted&&r.uid&&r.status!=='확정');
 const val=(v)=>esc(v==null?'—':v);
 box.innerHTML=list.length?'<table class="na-table"><thead><tr><th>반</th><th>번호</th><th>이름(등록명)</th><th>구글 계정 ID</th><th>개념 설계<br>30점</th><th>알고리즘 적용<br>30점</th><th>이해·설명<br>40점</th><th>총점<br>100점</th><th>AI 1차 채점</th><th>상태·주의</th><th>상세</th></tr></thead><tbody>'+
 list.map(x=>{
  const score=x.score;
  const aiLabel=!x.submitted?'—':x.aiStatus==='complete'?'✓ 완료':x.aiStatus==='old'?'⚠ 이전 기준':x.aiStatus==='unknown'?'⚠ 확인 불가':'미채점';
  const aiStyle=x.aiStatus==='complete'?'na-ai-done':x.aiStatus==='old'||x.aiStatus==='unknown'?'na-ai-warning':'na-ai-pending';
  const scores=score?'<td>'+val(score.design)+'</td><td>'+val(score.implementation)+'</td><td>'+val(score.report)+'</td><td><strong>'+val(score.total)+'</strong></td>':'<td>—</td><td>—</td><td>—</td><td>—</td>';
  return '<tr><td>'+val(x.clazz)+'</td><td>'+val(x.number)+'</td><td>'+val(x.name)+'</td><td>'+val(x.accountId)+'</td>'+scores+
   '<td><span class="'+aiStyle+'">'+val(aiLabel)+'</span></td><td>'+val(x.status)+(x.warning?'<div class="na-muted" style="color:#ffe6a0">'+val(x.warning)+'</div>':'')+'</td><td>'+
   (x.submitted?'<button type="button" class="na-btn" data-gb-uid="'+val(x.uid)+'">보기</button>':'—')+'</td></tr>';
 }).join('')+'</tbody></table>':'<p class="na-muted">선택한 반에서 확인된 계정·제출 기록이 없습니다.</p>';
}
function exportGradebook(){
 if(!gradebookLoaded)return;
 const current=el('na-gb-class')?.value||'all',data=selectedGradeRows();
 if(!data.length)return;
 const rows=[['학년','반','번호','이름(등록명)','구글 계정 ID','개념 설계','알고리즘 적용','이해·설명','총점','AI 1차 채점','상태','확인 필요']];
 data.forEach(x=>rows.push([x.grade,x.clazz,x.number??'',x.name,x.accountId,x.score?.design??'',x.score?.implementation??'',x.score?.report??'',x.score?.total??'',!x.submitted?'—':x.aiStatus==='complete'?'완료':x.aiStatus==='old'?'이전 기준':x.aiStatus==='unknown'?'확인 불가':'미채점',x.status,x.warning||'']));
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
  let aiReviews=null;
  try{
   aiReviews=(await ctx.db.ref(ROOT+'/aiReviews').once('value')).val()||{};
  }catch(error){
   console.warn('AI 채점 상태 조회 실패',error);
  }
  if(current!==token)return;
  gradebookRows=result.data.rows.map(row=>{
   const proposal=aiReviews?.[row.uid];
   const complete=proposal?.rubricVersion===AI_RUBRIC_VERSION&&
    Array.isArray(proposal.details?.questions)&&proposal.details.questions.length===17;
   return {...row,aiStatus:aiReviews===null?'unknown':!proposal?'pending':complete?'complete':'old'};
  });
  gradebookLoaded=true;showGradebook();
 }catch(e){
  if(current===token){gradebookLoaded=false;state.textContent='⚠ 반별 성적표 조회 실패: '+String(e.code||e.message||e)+' · 신규 Firebase 함수 배포를 확인하세요. 기존 학생 제출 목록·교사 채점은 그대로 사용할 수 있습니다.';}
 }finally{gradebookLoading=false;if(button?.isConnected)button.disabled=false}
}


async function ensureGradeCallable(){
 const app=ctx.fb.app();
 if(typeof app.functions!=='function'){
  await new Promise((resolve,reject)=>{
   const s=document.createElement('script');s.src='https://www.gstatic.com/firebasejs/10.14.1/firebase-functions-compat.js';
   s.onload=resolve;s.onerror=()=>reject(Error('Firebase SDK 불러오기 실패'));document.head.appendChild(s);
  });
 }
 return ctx.fb.app().functions('asia-northeast3').httpsCallable('gradeNepalAssessment');
}
function confirmAIDataUse(){
 if(aiPrivacyAcknowledged)return true;
 if(!confirm('학교의 개인정보 처리 기준에 따라 AI 서비스에 학생의 서술형 답안을 제공할 수 있음을 확인했습니까?\n이름과 일반 연락처 패턴은 서버에서 가리며, 조별 코드 원본은 AI에 전송하지 않습니다.\nAI 점수는 교사가 검토하고 확정해야 합니다.'))return false;
 aiPrivacyAcknowledged=true;return true;
}
async function runBatchAI(){
 if(aiBatchRunning||!ctx?.isTeacher||!gradebookLoaded)return;
 const clazz=el('na-gb-class')?.value;
 if(!clazz||clazz==='all'){message('일괄 채점은 1개 학급씩 진행합니다.');return}
 const students=selectedGradeRows().filter(r=>r.submitted&&r.uid&&r.status!=='확정');
 if(!students.length){message('이 학급에서 아직 확정되지 않은 제출 답안이 없습니다.');return}
 if(!confirmAIDataUse())return;
 if(!confirm(clazz+'반 '+students.length+'명 AI 1차 채점을 시작할까요?\n이미 채점한 학생은 서버에 저장된 결과를 재사용합니다.'))return;
 aiBatchRunning=true;aiBatchCancel=false;
 const opened=token,button=el('na-ai-batch'),stop=el('na-ai-stop'),state=el('na-ai-batch-status');
 button.disabled=true;stop.disabled=false;
 let done=0,ok=0,legacy=0,fail=0,errorText='',consecutiveErrors=0;
 try{
  const callable=await ensureGradeCallable();
  for(const row of students){
   if(aiBatchCancel||opened!==token)break;
   state.textContent=clazz+'반 '+(done+1)+'/'+students.length+'명 진행 · 성공 '+ok+'명 / 형식 확인 '+legacy+'명 / 오류 '+fail+'명';
   try{
    const response=await callable({uid:row.uid});
    if(response.data?.rubricVersion!==AI_RUBRIC_VERSION)throw Error('AI 채점 서버가 이전 기준입니다. Firebase Functions 재배포가 필요합니다.');
    ok++;consecutiveErrors=0;
    row.aiStatus='complete';
    if(teacherUid===row.uid&&opened===token){aiResult=response.data;showAI()}
   }catch(e){
    const msg=String(e.code||e.message||e);
    if(msg.includes('failed-precondition')){legacy++;consecutiveErrors=0}else{fail++;consecutiveErrors++;if(!errorText)errorText=msg}
    if(consecutiveErrors>=3||msg.includes('재배포')||msg.includes('not-found')||msg.includes('permission-denied')){aiBatchCancel=true;break}
   }
   done++;
  }
 }catch(e){fail++;errorText=String(e.code||e.message||e)}
 finally{
  aiBatchRunning=false;
  if(opened===token){
   stop.disabled=true;
   state.textContent=clazz+'반 '+(aiBatchCancel?'중단':'완료')+' · AI 제안 '+ok+'명 / 구형 답안 '+legacy+'명 / 오류 '+fail+'명'+(errorText?' · 오류: '+errorText:'')+' · 점수 최종 확정은 별도로 진행하세요.';
   showGradebook();
  }
 }
}

async function teacherOpen(t){
 shell('📊 수행평가 제출·채점 현황','최종 제출본을 확인하고 AI 채점 제안을 참고하여 교사가 점수를 확정합니다.');
 const classSnap=await ctx.db.ref('nepal-v27/public/settings/classCount').once('value').catch(()=>null);
 if(t!==token)return;
 const classValue=Number(classSnap?.val());
 const classLimit=Number.isInteger(classValue)&&classValue>=11&&classValue<=20?classValue:11;
 el('na-body').innerHTML='<div class="na-card"><h3>🛡 반별 수행평가 공개 설정</h3><p>공개할 반만 선택하세요. 처음에는 모든 반이 비공개이며 기존 전체 공개 설정은 사용하지 않습니다. 한 반을 닫아도 다른 반과 이미 제출한 답안에는 영향이 없습니다.</p><div id="na-release-list" class="na-release-list">반별 공개 상태를 확인하는 중…</div><div id="na-release-state" class="na-muted" role="status"></div></div><div class="na-card">AI는 객관식을 정답표로 계산하고 서술형 답변을 바탕으로 1차 채점안을 제안합니다. 학생 이름과 연락처 등 일반적인 식별정보는 가려 전송하지만 자유서술에 개인정보가 포함되지 않았는지 교사가 확인하고 학교 지침에 따라 이용하세요. 교사가 최종 점수를 확정하며, AI 제안은 학생에게 공개되지 않습니다.</div><details class="na-card na-gradebook-details"><summary class="na-gradebook-summary">📊 반별 수행평가 성적표 <span class="na-muted">클릭하여 펼치기 / 접기</span></summary><p class="na-muted">2026학년도 1학년 · 구글 계정 26-10101은 1학년 1반 1번입니다. 이름은 학생 등록명과 연결하며 교사 확정점수만 표시합니다.</p><div class="na-actions"><label for="na-gb-class">학급 선택</label><select id="na-gb-class" style="padding:9px;color:#fff;background:#0b2a3e;border:1px solid #5c8bac;border-radius:8px"><option value="all">전체 1학년</option>'+Array.from({length:classLimit},(_,i)=>'<option value="'+(i+1)+'">'+(i+1)+'반</option>').join('')+'</select><button id="na-gb-refresh" type="button" class="na-btn">↻ 조회</button><button id="na-gb-csv" type="button" class="na-btn" disabled>CSV 내려받기</button></div><div id="na-gb-status" class="na-muted">학교 계정과 성적표를 불러오는 중…</div><div id="na-gb-table" style="overflow:auto;max-height:62vh;margin-top:12px"></div></details><div class="na-card"><h3>🤖 학급 AI 1차 일괄 채점</h3><p class="na-muted">한 반씩 채점합니다. 제출 완료·성적 미확정 학생 대상이며, 객관식 11개는 정답표로 계산하고 서술형 6개는 AI가 1차 판단합니다. 교사가 최종 점수를 확정해야 합니다. 채점 중에는 이 화면을 열어 두세요.</p><div class="na-actions"><button id="na-ai-batch" class="na-btn" disabled>선택 학급 AI 일괄 채점</button><button id="na-ai-stop" class="na-btn" disabled>⏹ 중단</button></div><div id="na-ai-batch-status" class="na-muted" role="status">학급을 선택해 주세요.</div></div><div id="na-review"></div>';
 gradebookRows=[];gradebookLoaded=false;gradebookLoading=false;aiBatchCancel=true;
 el('na-gb-class').onchange=showGradebook;
 el('na-gb-refresh').onclick=fetchGradebook;
 el('na-gb-csv').onclick=exportGradebook;
 el('na-ai-batch').onclick=runBatchAI;
 el('na-ai-stop').onclick=()=>{aiBatchCancel=true;el('na-ai-batch-status').textContent='현재 학생 요청 종료 후 중단합니다.'};
 el('na-gb-table').onclick=e=>{const btn=e.target.closest('button[data-gb-uid]');if(btn)loadReview(btn.dataset.gbUid)};
 fetchGradebook();
 const releaseList=el('na-release-list'),releaseState=el('na-release-state');
 const flagsRef=ctx.db.ref(ROOT+'/config/enabledByClass');
 let releaseBusy=false,currentFlags={};
 async function refreshRelease(){
  if(t!==token)return;
  try{
   const snap=await flagsRef.once('value');
   if(t!==token)return;
   currentFlags=snap.val()||{};
   const count=Array.from({length:classLimit},(_,i)=>'c'+(i+1)).filter(id=>currentFlags[id]===true).length;
   releaseList.innerHTML=Array.from({length:classLimit},(_,i)=>{
    const key='c'+(i+1),open=currentFlags[key]===true;
    return '<button type="button" class="na-btn na-release-class '+(open?'is-open':'')+'" data-release-class="'+key+'" aria-pressed="'+(open?'true':'false')+'">'+(i+1)+'반 · '+(open?'🟢 공개 중':'🔒 비공개')+'</button>';
   }).join('');
   releaseState.textContent=classLimit+'개 반 중 '+count+'개 반 공개 · 버튼을 누르면 해당 반만 열거나 닫습니다.';
  }catch(error){
   releaseList.innerHTML='';
   releaseState.textContent='⚠ 반별 설정 조회 실패: '+String(error.code||error.message||error)+' · Firebase Realtime Database 규칙을 먼저 배포해 주세요.';
  }
 }
 releaseList.onclick=async event=>{
  const button=event.target.closest('button[data-release-class]');
  if(!button||releaseBusy||!ctx?.isTeacher)return;
  const id=button.dataset.releaseClass,num=Number(id.slice(1));
  if(!Number.isInteger(num)||num<1||num>classLimit)return;
  const open=currentFlags[id]===true;
  if(!confirm(open?num+'반의 수행평가를 닫을까요?\n다른 반과 기존 제출 기록에는 영향이 없습니다.':num+'반 학생에게 수행평가를 공개할까요?\n이 반의 학생만 작성·제출할 수 있습니다.'))return;
  releaseBusy=true;
  releaseList.querySelectorAll('button').forEach(x=>x.disabled=true);
  releaseState.textContent=num+'반 설정을 저장하는 중…';
  try{
   await ctx.db.ref(ROOT+'/config/enabledByClass/'+id).set(!open);
   if(t===token)message('✓ '+num+'반 수행평가 '+(!open?'공개':'비공개')+'로 변경했습니다.');
   await refreshRelease();
  }catch(error){
   releaseState.textContent='⚠ '+num+'반 설정 저장 실패: '+String(error.code||error.message||error)+' · Firebase 데이터베이스 규칙을 확인해 주세요.';
  }finally{
   releaseBusy=false;
   releaseList.querySelectorAll('button').forEach(x=>x.disabled=false);
  }
 };
 await refreshRelease();

}
const QUESTION_GROUPS={purpose:['Q01'],io:['Q02','Q03'],scenes:['Q04','Q05'],algorithm:['Q06'],functions:['Q07','Q08','Q09','Q10'],test1:['Q11','Q12','Q13','Q14'],test2:['Q15'],changes:['Q16'],contribution:['Q17']};
const QUESTION_IDS=Array.from({length:17},(_,i)=>'Q'+String(i+1).padStart(2,'0'));
const CONCEPT_IDS=['Q01','Q03','Q04','Q05','Q06'];
const APPLICATION_IDS=['Q07','Q09','Q10','Q11','Q12','Q16'];
const SUBJECTIVE_IDS=['Q02','Q08','Q13','Q14','Q15','Q17'];
const CORRECT_CHOICES={
 Q01:'수위 센서가 현재 측정한 값',
 Q03:'센서값 읽기 → 변수 저장 → 위험 여부 판단',
 Q04:'1(위험)',Q05:'0 또는 1',
 Q06:'각 센서의 위험 변수를 만들고 0 또는 1을 저장',
 Q07:'0~4',Q09:'경보에 필요한 최소 위험 센서 개수',
 Q10:'경보 발생(1)',Q11:'여러 값(자료)',Q12:'3개',
 Q16:'이상(≥): 경보 / 초과(>): 정상'
};
const EXPLANATION_KEYS={
 Q02:'반복이 없다면 변화하는 센서값을 계속 갱신하지 못해 위험 판단이 부정확해진다.',
 Q08:'0과 1로 표현한 네 위험 신호의 합은 위험한 센서의 수를 의미한다.',
 Q13:'위험개수를 매번 0으로 초기화하지 않으면 이전 계산값이 누적되어 오류가 발생한다.',
 Q14:'리스트에 여러 값을 저장하고 반복문으로 처리하면 중복 코드를 줄이고 효율적으로 계산할 수 있다.',
 Q15:'불필요한 경보는 혼란과 신뢰 저하를 낳고, 경보 누락은 대피 실패와 인명·재산 피해를 키운다.',
 Q17:'자신이 선택한 엔트리 블록에서 변수·조건·반복·리스트 중 관련 개념과 작동 과정을 구체적으로 설명한다.'
};
let savedReview=null,reviewOverrides={};
function questionAnswers(){
 const answers={},fields=teacherDoc?.fields||{};
 for(const [key,ids] of Object.entries(QUESTION_GROUPS)){
  for(const line of String(fields[key]||'').split(/\r?\n/)){
   const found=/^(Q\d{2}):\s*(.*?)\s*$/.exec(line);
   if(found&&ids.includes(found[1])&&answers[found[1]]===undefined)answers[found[1]]=found[2];
  }
 }
 return answers;
}
function currentAI(){
 const questions=aiResult?.details?.questions;
 return !!aiResult&&aiResult.rubricVersion===AI_RUBRIC_VERSION&&
  [30,25,20,15].includes(aiResult.design)&&[30,25,20,15].includes(aiResult.implementation)&&
  [40,30,20,10].includes(aiResult.report)&&Array.isArray(questions)&&questions.length===17&&
  QUESTION_IDS.every(id=>questions.some(q=>q.key===id));
}
function currentQuestionSignature(){
 return currentAI()?QUESTION_IDS.map(id=>{
  const q=aiResult.details.questions.find(v=>v.key===id);
  return id+':'+q.judgment;
 }).join('|'):'';
}
function reviewQuestionMeta(){
 const answers=questionAnswers(),judgments=new Map((aiResult?.details?.questions||[]).map(q=>[q.key,q]));
 return QUESTION_IDS.map(id=>{
  const answer=String(answers[id]||'').trim(),proposal=judgments.get(id)||null;
  const isObjective=Object.hasOwn(CORRECT_CHOICES,id);
  const verdict=!answer?'미응답':currentAI()?String(proposal?.judgment||'교사확인'):'AI 채점 전';
  const ambiguous=!isObjective&&!!answer&&currentAI()&&(verdict==='부분정확'||verdict==='교사확인');
  return {id,answer,proposal,isObjective,verdict,ambiguous,
   expected:isObjective?CORRECT_CHOICES[id]:EXPLANATION_KEYS[id]};
 });
}
function scoreFromAccepted(correct,max){
 if(max===40)return correct===6?40:correct>=4?30:correct>=2?20:10;
 return correct>=5?30:correct===4?25:correct>=2?20:15;
}
function calculatedReview(){
 if(!currentAI())return null;
 const meta=reviewQuestionMeta();
 const accepted=new Set(meta.filter(q=>{
  if(!q.answer)return false;
  if(q.isObjective)return q.answer===q.expected;
  if(q.verdict==='정확')return true;
  return q.ambiguous&&reviewOverrides[q.id]===true;
 }).map(q=>q.id));
 const concept=CONCEPT_IDS.filter(id=>accepted.has(id)).length;
 const application=APPLICATION_IDS.filter(id=>accepted.has(id)).length;
 const explanation=SUBJECTIVE_IDS.filter(id=>accepted.has(id)).length;
 const design=scoreFromAccepted(concept,30);
 const implementation=scoreFromAccepted(application,30);
 const report=scoreFromAccepted(explanation,40);
 return {design,implementation,report,total:design+implementation+report,
  counts:{concept,application,explanation},ambiguousIds:meta.filter(q=>q.ambiguous).map(q=>q.id),accepted};
}
function renderQuestionAnnotations(){
 const list=el('na-question-list');
 if(!list||!teacherDoc)return;
 const meta=reviewQuestionMeta();
 const valid=currentAI();
 const hasStructure=QUESTION_IDS.every(id=>Object.hasOwn(questionAnswers(),id));
 if(!hasStructure){
  list.innerHTML='<div class="na-card"><h3>과거 형식의 제출본</h3><p class="na-muted">이 제출본은 17문항 형식이 아닙니다. 원문을 확인하고 기존 확정 점수를 유지하세요.</p></div>'+
   FIELDS.filter(([k])=>k!=='aiUse').map(([k,title])=>'<div class="na-card"><b>'+esc(title)+'</b><div class="na-read">'+esc(teacherDoc.fields?.[k]||'미작성')+'</div></div>').join('');
  return;
 }
 list.innerHTML=meta.map(q=>{
  let color=q.verdict==='정확'?'na-verdict-correct':q.verdict==='오개념'||q.verdict==='미응답'?'na-verdict-wrong':q.verdict==='부분정확'||q.verdict==='교사확인'?'na-verdict-review':'na-verdict-pending';
  const reason=!valid?'AI 채점 후 이곳에 판단 근거가 표시됩니다.':q.isObjective?(q.answer===q.expected?'정답표와 일치합니다.':!q.answer?'미응답 문항입니다.':'정답표와 일치하지 않습니다.'):(q.proposal?.reason||'AI 판단 근거 없음');
  const answerNote=q.isObjective?'정답':'서술형 핵심 정답 요소';
  const decision=q.ambiguous?'<label class="na-manual-check"><input type="checkbox" data-review-question="'+q.id+'" '+(reviewOverrides[q.id]===true?'checked':'')+'> 교사가 정답으로 인정</label><span class="na-manual-outcome" id="na-outcome-'+q.id+'">'+(reviewOverrides[q.id]===true?'✓ 정답으로 처리':'미체크 · 오답으로 처리')+'</span>':'';
  return '<article class="na-card na-answer-card"><div class="na-answer-head"><h3>'+esc(q.id)+' · '+esc(AI_QUESTION_LABELS[q.id]||'')+'</h3><span class="na-verdict '+color+'">'+esc(q.verdict)+'</span></div>'+
   '<div class="na-answer-label">학생 답안</div><div class="na-read">'+esc(q.answer||'미응답')+'</div>'+
   '<div class="na-answer-key"><b>'+answerNote+':</b> '+esc(q.expected||'')+'</div>'+
   '<div class="na-ai-reason"><b>AI 판단 근거:</b> '+esc(reason)+'</div>'+
   (decision?'<div class="na-manual-row">'+decision+'</div>':'')+'</article>';
 }).join('');
 list.onchange=event=>{
  const checkbox=event.target.closest('input[data-review-question]');
  if(!checkbox)return;
  const id=checkbox.dataset.reviewQuestion;
  const meta=reviewQuestionMeta().find(q=>q.id===id);
  if(!meta?.ambiguous)return;
  reviewOverrides[id]=checkbox.checked;
  const result=el('na-outcome-'+id);
  if(result)result.textContent=checkbox.checked?'✓ 정답으로 처리':'미체크 · 오답으로 처리';
  renderCalculatedReview();
 };
}
function renderCalculatedReview(){
 const data=calculatedReview();
 const waiting=el('na-scoring-state'),submit=el('na-grade'),noteWrap=el('na-note-wrap');
 if(waiting)waiting.textContent=!data?'AI 1차 채점이 완료되면 17개 문항의 판정과 교사 체크를 합산해 점수가 자동 계산됩니다.':
  '정답 인정: 기초 개념 '+data.counts.concept+'/5 · 알고리즘 적용 '+data.counts.application+'/6 · 이해·설명 '+data.counts.explanation+'/6 · 기본점수 40점 포함';
 for(const key of ['design','implementation','report']){
  const node=el('na-score-'+key);
  if(node)node.textContent=data?data[key]+'점':'—';
 }
 const total=el('na-score-total');if(total)total.textContent=data?data.total+'점':'—';
 if(noteWrap){
  noteWrap.hidden=!data||data.ambiguousIds.length===0;
  const note=el('na-teacher-note');
  if(note)note.required=!!data&&data.ambiguousIds.length>0;
  const hint=el('na-note-description');
  if(hint&&data)hint.textContent='부분정확·교사확인 '+data.ambiguousIds.length+'개 문항('+data.ambiguousIds.join(', ')+')을 정답 인정할지 검토한 근거를 5자 이상 작성해 주세요.';
 }
 if(submit)submit.disabled=!data;
 const status=el('na-previous-review');
 if(status&&savedReview){
  const old=Number(savedReview.design)+Number(savedReview.implementation)+Number(savedReview.report);
  status.textContent='이전에 확정한 점수: '+old+'점 · 현재 계산: '+(data?data.total+'점':'확인 불가')+' · [최종 점수 확정]을 누르기 전에는 이전 기록이 유지됩니다.';
 }
}
async function loadReview(uid){
 teacherUid=uid;savedReview=null;reviewOverrides={};message('학생 답안을 불러오는 중…');
 const container=el('na-review');container.innerHTML='';
 try{
  const [submissionSnap,reviewSnap,aiSnap]=await Promise.all([
   ctx.db.ref(ROOT+'/submissions/'+uid).once('value'),
   ctx.db.ref(ROOT+'/reviews/'+uid).once('value'),
   ctx.db.ref(ROOT+'/aiReviews/'+uid).once('value')
  ]);
  if(uid!==teacherUid)return;
  teacherDoc=submissionSnap.val();
  aiResult=aiSnap.val();
  savedReview=reviewSnap.val()||null;
  if(!teacherDoc)throw Error('학생 제출 기록이 없습니다.');
  if(savedReview?.aiRubricVersion===AI_RUBRIC_VERSION&&savedReview?.aiQuestionSignature===currentQuestionSignature()&&savedReview.questionOverrides&&typeof savedReview.questionOverrides==='object')
   reviewOverrides={...savedReview.questionOverrides};
  container.innerHTML='<div class="na-card"><h3>'+esc(teacherDoc.displayName||'학생')+' · '+esc(teacherDoc.classId?.slice(1)||'')+'반</h3><p>'+esc(formatTime(teacherDoc.submittedAt))+' · 개인별 수행평가 답안</p><div id="na-previous-review" class="na-muted"></div></div>'+
   '<div class="na-card"><h3>🤖 AI 1차 채점 및 문항별 판단</h3><p class="na-muted">AI가 객관식 11문항과 서술형 6문항을 1차 판정합니다. 아래 학생 답안에서 판단 근거와 정답 요소를 비교하고, 주황색 판정은 체크 시 정답으로 인정할 수 있습니다.</p><div class="na-actions"><button id="na-run-ai" class="na-btn" type="button">🤖 AI 1차 채점 실행</button></div><div id="na-ai"></div></div>'+
   '<div id="na-question-list"></div>'+
   '<div class="na-card"><h3>교사 최종 평가</h3><div id="na-scoring-state" class="na-muted"></div><div class="na-score">'+
   [['design','기초 개념'],['implementation','알고리즘 적용'],['report','이해·설명']].map(([key,title])=>'<div class="na-auto-score"><span>'+title+'</span><output id="na-score-'+key+'">—</output></div>').join('')+
   '<div class="na-auto-score na-auto-total"><span>자동 계산 총점</span><output id="na-score-total">—</output></div></div>'+
   '<div class="na-field" id="na-note-wrap" hidden><label for="na-teacher-note"><strong>교사 채점 근거 (부분정확·교사확인 문항이 있을 때 필수)</strong></label><p id="na-note-description" class="na-muted"></p><textarea id="na-teacher-note" maxlength="1600" placeholder="정답으로 인정하거나 오답으로 처리한 이유를 적어 주세요."></textarea></div>'+
   '<button class="na-btn primary" id="na-grade" type="button" disabled>✅ 교사 최종 점수 확정</button></div>'+
   rubricHtml();
  el('na-teacher-note').value=savedReview?.note||'';
  el('na-grade').onclick=saveGrade;
  el('na-run-ai').onclick=runAI;
  showAI();
  message('17개 문항을 직접 검토하고, 주황색 판정은 필요하면 정답 인정에 체크하세요. 점수는 자동으로 계산됩니다.');
 }catch(e){message('학생 답안 조회 실패: '+String(e.code||e.message||e))}
}
function showAI(){
 const display=el('na-ai');
 if(!display)return;
 if(!aiResult){
  display.innerHTML='<p class="na-muted">AI 1차 채점 전입니다. 채점을 실행하면 학생 답안 옆에 정확·오개념·부분정확·교사확인 결과가 표시됩니다.</p>';
 }else if(!currentAI()){
  display.innerHTML='<p class="na-ai-warning">현재 17문항 기준의 AI 결과가 아닙니다. [AI 1차 채점 실행]을 눌러 최신 결과를 받아야 자동 점수를 확정할 수 있습니다.</p>';
 }else{
  const score=aiResult.design+aiResult.implementation+aiResult.report;
  display.innerHTML='<p class="na-muted">AI 최초 제안 '+score+'점 · 객관식 정답표 + 서술형 AI 판단. 최종 점수는 아래 교사 체크에 따라 계산됩니다.</p>';
 }
 renderQuestionAnnotations();
 renderCalculatedReview();
}
async function runAI(){
 const btn=el('na-run-ai');
 if(!btn||!teacherUid)return;
 if(!confirmAIDataUse())return;
 const uid=teacherUid;
 btn.disabled=true;message('AI 1차 채점 요청 중 · 완료되면 각 학생 답안 옆에 정답과 판단 근거가 표시됩니다…');
 try{
  const callable=await ensureGradeCallable();
  const result=await callable({uid});
  if(uid!==teacherUid)return;
  const suggested=result.data;
  if(!suggested||suggested.rubricVersion!==AI_RUBRIC_VERSION)
   throw Error('AI 채점 서버 기준이 이전 버전입니다. Firebase Functions 버전을 확인해 주세요.');
  aiResult=suggested;
  if(savedReview?.aiQuestionSignature!==currentQuestionSignature())reviewOverrides={};
  const entry=gradebookRows.find(row=>row.uid===uid);
  if(entry)entry.aiStatus=currentAI()?'complete':'old';
  showAI();showGradebook();
  message('✓ AI 1차 채점 완료. 학생별 답안 옆의 AI 판정과 근거를 확인하고, 주황색 문항의 정답 인정 여부를 선택하세요.');
 }catch(e){
  message('⚠ AI 1차 채점 요청 실패: '+String(e.code||e.message||e)+'\nCloud Functions 및 OPENAI_API_KEY 상태를 확인하세요.');
 }finally{if(btn.isConnected)btn.disabled=false}
}
async function saveGrade(){
 const result=calculatedReview();
 if(!result){message('17문항 AI 1차 채점 결과가 있어야 자동 점수를 확정할 수 있습니다. 먼저 AI 채점을 실행해 주세요.');return}
 const ambiguous=result.ambiguousIds;
 const typed=String(el('na-teacher-note')?.value||'').trim();
 if(ambiguous.length&&typed.length<5){
  message('부분정확·교사확인 문항이 있으므로 교사 채점 근거를 5자 이상 작성해 주세요.');
  el('na-teacher-note')?.focus();return;
 }
 const note=ambiguous.length?typed:String(savedReview?.note||'자동 채점 결과 확인 및 최종 확정').slice(0,2400);
 const aiComparison='\nAI 최초 제안: '+(aiResult.design+aiResult.implementation+aiResult.report)+'점 / 교사 판정 후: '+result.total+'점';
 if(!confirm('선택한 학생의 점수를 '+result.total+'점으로 확정할까요?\n주황색 '+ambiguous.length+'문항 중 '+ambiguous.filter(id=>reviewOverrides[id]===true).length+'문항을 정답으로 인정합니다.'+aiComparison+'\n확정 후에도 교사는 다시 검토·수정할 수 있습니다.'))return;
 const uid=teacherUid,opened=token,signature=currentQuestionSignature(),btn=el('na-grade');
 btn.disabled=true;
 try{
  // Reject confirmations based on AI judgments that have changed in the meantime.
  const latest=(await ctx.db.ref(ROOT+'/aiReviews/'+uid).once('value')).val();
  const latestSignature=QUESTION_IDS.map(id=>{
   const question=latest?.details?.questions?.find(q=>q.key===id);
   return id+':'+String(question?.judgment||'');
  }).join('|');
  if(latest?.rubricVersion!==AI_RUBRIC_VERSION||latestSignature!==signature)
   throw Error('AI 1차 채점 내용이 변경되었습니다. 이 학생의 제출본을 다시 열어 확인해 주세요.');
  if(uid!==teacherUid||opened!==token)throw Error('채점 중 다른 학생 화면으로 전환되었습니다. 저장을 중지합니다.');
  const decisions=Object.fromEntries(ambiguous.map(id=>[id,reviewOverrides[id]===true]));
  const document={
   design:result.design,implementation:result.implementation,report:result.report,
   note,reviewedAt:ctx.fb.database.ServerValue.TIMESTAMP,reviewedBy:ctx.user.uid,
   aiRubricVersion:AI_RUBRIC_VERSION,aiQuestionSignature:signature,
   questionOverrides:decisions
  };
  await ctx.db.ref(ROOT+'/reviews/'+uid).set(document);
  savedReview={...document,reviewedAt:Date.now()};
  message('✓ '+result.total+'점으로 최종 점수 확정 완료. 체크한 정답 인정 문항도 저장했습니다. 학생에게 점수를 자동 공개하지 않습니다.');
  renderCalculatedReview();
  fetchGradebook();
 }catch(e){message('⚠ 교사 최종 점수 저장 실패: '+String(e.code||e.message||e))}
 finally{if(btn?.isConnected)btn.disabled=false}
}
global.NepalAssessment={open:async options=>{
 if(!options?.user||!options?.db)return;
 ctx=options;mount();clearTimeout(timer);prepared=null;writing=false;finalDoc=null;teacherDoc=null;teacherUid=null;aiResult=null;savedReview=null;reviewOverrides={};
 const t=++token;
 if(options.isTeacher)await teacherOpen(t);
 else if(options.student)await studentOpen(t);
 else{shell('수행평가','학교 계정의 반과 이름 확인 후 이용할 수 있습니다.');message('학생 로그인 후 다시 시도하세요.')}
}};
})(window);
