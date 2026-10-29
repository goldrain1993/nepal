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
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const formatTime=n=>Number(n)?new Date(Number(n)).toLocaleString('ko-KR'):'확인 중';
let panel=null,ctx=null,token=0,timer=null,writing=false,finalDoc=null,teacherDoc=null,teacherUid=null,aiResult=null;
const el=id=>panel?.querySelector('#'+id);
function message(s){if(el('na-message'))el('na-message').textContent=s}
function fields(){return Object.fromEntries(FIELDS.map(([k])=>[k,(el('na-'+k)?.value||'').trim()]))}
function mount(){
 if(panel)return;
 const css=document.createElement('style');
 css.textContent='#na-root{position:fixed;inset:0;z-index:18000;display:none;overflow:auto;background:#06110b;color:#e6f8dc;font:14px/1.65 system-ui,"Malgun Gothic",sans-serif}#na-root.show{display:block}#na-root *{box-sizing:border-box}.na-box{max-width:950px;margin:24px auto;padding:24px;background:#10261a;border:1px solid #47694a;border-radius:17px}.na-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.na-box h2{margin:0;color:#c6fba7}.na-card{background:#163020;border:1px solid #3a6544;border-radius:12px;padding:15px;margin:15px 0}.na-card h3{margin:0 0 9px;color:#d5ffb6}.na-muted{font-size:12px;color:#bcd0b4}.na-field{display:block;margin:13px 0}.na-field strong{display:block;margin:0 0 5px}.na-field textarea{display:block;width:100%;min-height:93px;padding:12px;resize:vertical;color:#fff;background:#08190f;border:1px solid #62816a;border-radius:8px;font:13px/1.6 system-ui}.na-btn{border:1px solid #8cbd7e;color:#e9ffe3;background:#264e34;border-radius:9px;padding:9px 13px;font-weight:800;cursor:pointer}.na-btn.primary{background:#c0f58b;color:#0b2b16}.na-btn:disabled{opacity:.55}.na-actions{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}.na-read{white-space:pre-wrap;overflow-wrap:anywhere;background:#0a1b11;padding:12px;border:1px solid #3c6746;border-radius:8px;margin-top:8px}.na-table{border-collapse:collapse;width:100%}.na-table td,.na-table th{padding:8px;border-bottom:1px solid #456949;text-align:left}.na-score{display:flex;gap:12px;flex-wrap:wrap}.na-score label{display:grid;gap:4px}.na-score select{padding:9px;background:#07190e;color:#fff;border:1px solid #779a80;border-radius:8px}#na-message{white-space:pre-wrap;min-height:28px;color:#c6eead}@media(max-width:700px){.na-box{margin:0;padding:12px;border-radius:0}}';
 document.head.appendChild(css);
 panel=document.createElement('section');panel.id='na-root';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','수행평가 작성 및 관리');document.body.appendChild(panel);
}
function shell(title,desc){
 panel.innerHTML='<div class="na-box"><div class="na-top"><div><h2>'+esc(title)+'</h2><div class="na-muted">'+esc(desc)+'</div></div><button id="na-close" class="na-btn">✕ 닫기</button></div><div id="na-body"></div><div id="na-message" role="status"></div></div>';
 el('na-close').onclick=()=>{clearTimeout(timer);panel.classList.remove('show');token++};
 panel.classList.add('show');
}
function fieldHtml([k,title,max]){
 return '<label class="na-field"><strong>'+esc(title)+'</strong><textarea id="na-'+k+'" maxlength="'+max+'" placeholder="자신의 실제 프로그램과 활동을 바탕으로 구체적으로 작성하세요."></textarea><small id="na-count-'+k+'" class="na-muted"></small></label>';
}
function storageKey(){return 'nepal-assessment-draft-v1:'+ctx.user.uid}
async function studentOpen(t){
 shell('📝 실생활 문제 해결 프로그래밍 수행평가',ctx.team.c+'반 '+ctx.team.g+'조 · 학생 개인 제출 · 총 100점');
 el('na-body').innerHTML='<div class="na-card">설계 30점 / 프로그램 구현 30점 / 개발 보고서 40점. <b>설계서와 보고서는 개인별 작성</b>합니다. AI 사전 피드백과 예상 점수는 제공되지 않습니다. 최종 제출하면 당시 조별 엔트리 코드가 별도 사본으로 저장됩니다.</div><div id="na-final-status"></div><div id="na-editor"><div class="na-card"><h3>① 프로그램 설계 (30점)</h3>'+FIELDS.slice(0,4).map(fieldHtml).join('')+'</div><div class="na-card"><h3>② 프로그램 구현 (30점)</h3>엔트리 개발자 모드에서 프로그램을 작성하고 저장하세요. 최종 제출할 때 저장된 코드를 복사합니다. 코드 사본은 이 화면에서 수정하지 않습니다.</div><div class="na-card"><h3>③ 프로그램 개발 보고서 (40점)</h3>'+FIELDS.slice(4).map(fieldHtml).join('')+'</div><div class="na-actions"><button id="na-save" class="na-btn">💾 임시 저장</button><button id="na-submit" class="na-btn primary">🔒 최종 제출</button></div></div>';
 message('저장된 작성 내용을 불러오는 중…');
 try{
  const [submitted,draft]=await Promise.all([ctx.db.ref(ROOT+'/submissions/'+ctx.user.uid).once('value'),ctx.db.ref(ROOT+'/drafts/'+ctx.user.uid).once('value')]);
  if(t!==token)return;
  finalDoc=submitted.val();
  if(finalDoc){finished();return}
  let data=draft.val(),local=null;
  try{local=JSON.parse(localStorage.getItem(storageKey())||'null')}catch(_){}
  if(local&&(!data||Number(local.updatedAt)>Number(data.updatedAt)))data=local;
  for(const [k] of FIELDS){
   const field=el('na-'+k);field.value=data?.fields?.[k]||'';
   const update=()=>{el('na-count-'+k).textContent=field.value.length+'자'};
   update();
   field.oninput=()=>{update();try{localStorage.setItem(storageKey(),JSON.stringify({fields:fields(),updatedAt:Date.now()}))}catch(_){}clearTimeout(timer);timer=setTimeout(()=>saveDraft(false),1800)};
  }
  el('na-save').onclick=()=>saveDraft(true);
  el('na-submit').onclick=submit;
  message('작성 중 자동 임시 저장됩니다. 마지막에는 반드시 [최종 제출]을 누르세요.');
 }catch(e){message('불러오기 실패: '+String(e.code||e.message||e))}
}
async function saveDraft(manual){
 if(writing||finalDoc||!ctx?.team)return false;
 writing=true;
 try{
  await ctx.db.ref(ROOT+'/drafts/'+ctx.user.uid).set({classId:'c'+ctx.team.c,groupId:'g'+ctx.team.g,fields:fields(),updatedAt:ctx.fb.database.ServerValue.TIMESTAMP});
  if(manual)message('✓ Firebase 임시 저장 완료. 아직 최종 제출은 아닙니다.');
  return true;
 }catch(e){message('⚠ 임시 저장 실패: '+String(e.code||e.message||e)+' (브라우저에 작성 사본 보관)');return false}
 finally{writing=false}
}
function finished(){
 el('na-final-status').innerHTML='<div class="na-card"><h3>✅ 최종 제출 완료</h3><p>제출 시각: '+esc(formatTime(finalDoc.submittedAt))+'</p>이 내용과 제출 시점 엔트리 코드는 별도 보관되었습니다. 수정이나 재제출은 학생이 임의로 할 수 없습니다. 평가 점수는 교사가 최종 확정합니다.</div>';
 el('na-editor').hidden=true;message('조별 엔트리 원본 코드는 그대로 유지됩니다.');
}
async function submit(){
 if(finalDoc)return;
 const answer=fields(),missing=FIELDS.filter(([k])=>answer[k].length<(k==='aiUse'?2:15));
 if(missing.length){message('다음 항목을 먼저 작성해 주세요: '+missing.map(x=>x[1]).join(', '));return}
 if(!confirm('이 설계서·개발 보고서와 현재 서버에 저장된 엔트리 코드 사본을 최종 제출할까요?\n제출 후 학생이 직접 수정할 수 없습니다.'))return;
 const btn=el('na-submit');btn.disabled=true;message('제출할 엔트리 코드와 기존 제출 여부 확인 중…');
 try{
  const [codeSnap,check]=await Promise.all([ctx.db.ref(ctx.workPath(ctx.team.c,ctx.team.g)+'/code').once('value'),ctx.db.ref(ROOT+'/submissions/'+ctx.user.uid).once('value')]);
  if(check.exists())throw Error('이미 제출한 기록이 있습니다. 다시 열어 확인해 주세요.');
  const code=codeSnap.val()?.payload;
  if(!code||code.length>1250000)throw Error('저장된 엔트리 코드가 없거나 너무 큽니다. 개발자 모드에서 코드를 저장하세요.');
  let parsed;try{parsed=JSON.parse(code)}catch(_){throw Error('저장된 엔트리 코드 형식이 잘못되었습니다.')}
  const scripts=Array.isArray(parsed.objects)?parsed.objects.map(x=>JSON.stringify(x.script||[])).join(''):'';
  if(scripts.length<20)throw Error('작성한 블록을 확인할 수 없습니다. 엔트리 코드 저장 상태를 확인하세요.');
  const timestamp=ctx.fb.database.ServerValue.TIMESTAMP;
  const doc={classId:'c'+ctx.team.c,groupId:'g'+ctx.team.g,displayName:String(ctx.user.displayName||'학생').slice(0,60),fields:answer,codeSnapshot:code,codeBytes:code.length,submittedAt:timestamp,version:1};
  const index={classId:doc.classId,groupId:doc.groupId,displayName:doc.displayName,codeBytes:code.length,submittedAt:timestamp};
  // Atomic multi-location update — no public scores and no overwrite of student code.
  await ctx.db.ref(ROOT).update({['submissions/'+ctx.user.uid]:doc,['index/'+ctx.user.uid]:index});
  finalDoc={...doc,submittedAt:Date.now()};finished();
 }catch(e){message('⚠ 제출 실패: '+String(e.code||e.message||e)+'\n작성 내용과 엔트리 원본은 삭제되지 않았습니다.')}
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
  container.innerHTML='<div class="na-card"><h3>'+esc(teacherDoc.displayName)+' · '+esc(teacherDoc.classId.slice(1))+'반 '+esc(teacherDoc.groupId.slice(1))+'조</h3><p>'+esc(formatTime(teacherDoc.submittedAt))+' · 코드 '+Math.round((teacherDoc.codeBytes||0)/1024)+'KB</p><button id="na-code" class="na-btn">엔트리 제출 코드 JSON 내려받기</button></div>'+FIELDS.map(([k,label])=>'<div class="na-card"><b>'+esc(label)+'</b><div class="na-read">'+esc(teacherDoc.fields?.[k]||'미작성')+'</div></div>').join('')+'<div class="na-card"><h3>AI 1차 채점 (교사에게만 표시)</h3><div id="na-ai"></div><button id="na-run-ai" class="na-btn">AI 채점 요청</button></div><div class="na-card"><h3>교사 최종 평가</h3><div class="na-score">'+[['design','설계',[30,25,20,15]],['implementation','구현',[30,25,20,15]],['report','보고서',[40,30,20,10]]].map(([k,name,scores])=>'<label>'+name+'<select id="na-score-'+k+'"><option value="">선택</option>'+scores.map(x=>'<option value="'+x+'">'+x+'점</option>').join('')+'</select></label>').join('')+'</div><label class="na-field"><strong>교사 채점 근거</strong><textarea id="na-teacher-note" maxlength="2400"></textarea></label><button class="na-btn primary" id="na-grade">교사 점수 저장</button></div>';
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
 ctx=options;mount();clearTimeout(timer);finalDoc=null;teacherDoc=null;teacherUid=null;aiResult=null;
 const t=++token;
 if(options.isTeacher)await teacherOpen(t);
 else if(options.team)await studentOpen(t);
 else{shell('수행평가','반·조 로그인 후 이용할 수 있습니다.');message('학생 로그인 후 다시 시도하세요.')}
}};
})(window);
