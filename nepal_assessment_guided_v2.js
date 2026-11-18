/* Nepal Entry individual assessment: 17 distinct prompts; preserve existing RTDB schema. */
(function(global){
'use strict';
if(!global.NepalAssessment||global.NepalAssessment.__guided17)return;
const Q=[["Q01","purpose","미션 1","mc","수위값 변수에 저장해야 할 데이터는 무엇인가요?",["센서의 이름","경보가 울린 총횟수","미션 제목","수위 센서가 현재 측정한 값"]],["Q02","io","미션 1·2","short","수위값을 저장할 때 '계속 반복하기'를 사용하지 않으면 어떤 문제가 생길까요?"],["Q03","io","미션 2","mc","실시간 수위 경보 프로그램의 올바른 처리 순서는?",["변수 삭제 → 경보 출력 → 센서값 읽기","센서값 읽기 → 변수 저장 → 위험 여부 판단","위험 여부 판단 → 센서값 읽기 → 변수 저장","경보 출력 → 센서 삭제 → 변수 저장"]],["Q04","scenes","미션 3","mc","위험 기준이 수위 4.0m 이상이고 현재 수위가 4.2m일 때, 수위위험 값은?",["0(안전)","4.2","판단할 수 없음","1(위험)"]],["Q05","scenes","미션 3","mc","수위위험 변수에는 어떤 값이 저장되나요?",["0부터 4까지 모든 수","센서 설치 위치의 이름","0 또는 1","수위 높이(m) 그대로"]],["Q06","algorithm","미션 4","mc","네 센서의 위험 여부를 각각 저장하는 올바른 방법은?",["네 센서의 위험값을 항상 1로 저장","각 센서의 위험 변수를 만들고 0 또는 1을 저장","모든 위험을 수위값 변수 하나에 저장","센서 이름을 지우고 임의의 값 저장"]],["Q07","functions","미션 5","mc","수위위험 + 유속위험 + 진동위험 + 강수위험의 값의 범위는?",["1~4","0~100","무한대까지","0~4"]],["Q08","functions","미션 5","short","네 개의 위험 변수(각 0 또는 1)를 모두 더한 값은 무엇을 의미하나요?"],["Q09","functions","미션 5","mc","위험개수 ≥ N 규칙에서 N은 무엇을 뜻하나요?",["프로그램 반복 횟수","경보에 필요한 최소 위험 센서 개수","현재 수위 높이","측정값의 합계"]],["Q10","functions","미션 5","mc","위험 신호가 [1,0,1,0]이고 N=2라면, 위험개수 ≥ N 규칙의 결과는?",["정상(0)","판단 보류","센서값 재측정","경보 발생(1)"]],["Q11","test1","미션 6","mc","엔트리 리스트는 무엇을 순서대로 모아 저장하는 자료구조인가요?",["조건문 블록만","프로그램 파일","여러 값(자료)","오브젝트 이름만"]],["Q12","test1","미션 6","mc","리스트 [1,0,1,1]에 기록된 위험한 센서는 몇 개인가요?",["4개","3개","1개","2개"]],["Q13","test1","미션 6","short","반복 계산할 때 '위험개수를 0으로 정하기' 코드가 빠지면 어떤 일이 생기나요?"],["Q14","test1","미션 6","short","여러 개의 변수를 따로 사용하는 것보다 리스트와 반복문을 함께 사용할 때 장점은?"],["Q15","test2","FINAL","short","불필요한 경보와 경보 누락은 각각 네팔 주민에게 어떤 영향을 주나요?"],["Q16","changes","FINAL","mc","위험개수=2, N=2일 때 '위험개수 ≥ N'과 '위험개수 > N'의 결과를 비교하면?",["이상(≥): 정상 / 초과(>): 경보","둘 다 경보","둘 다 정상","이상(≥): 경보 / 초과(>): 정상"]],["Q17","contribution","개인 코드 설명","short","엔트리 개발자 모드에서 사용한 코드 중 한 부분을 골라, 관련 프로그래밍 개념과 작동 원리를 자신의 말로 설명하세요."]];

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const shuffled=items=>{const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function applyBlueTheme(){
 if(document.getElementById('na-blue-theme'))return;
 const style=document.createElement('style');style.id='na-blue-theme';style.textContent="\n#na-root{background:radial-gradient(ellipse at 18% 0%,#194562,transparent 42%),radial-gradient(ellipse at 92% 80%,#134253,transparent 40%),#061322;color:#eaf7ff}\n#na-root .na-box{max-width:1030px;background:linear-gradient(135deg,#0d2a3f,#081c2c);border:1px solid #497c98;box-shadow:0 20px 60px #0006}\n#na-root .na-box h2,#na-root .na-card h3{color:#c3efff}\n#na-root .na-card{background:#0f2b40;border:1px solid #43718c}\n#na-root .na-muted,#na-root .na-help{color:#bdd8e9}\n#na-root .na-read{background:#071e30;border:1px solid #3e6c86}\n#na-root .na-table td,#na-root .na-table th{border-bottom:1px solid #47778f}\n#na-root .na-btn{background:#224b64;border:1px solid #638eaa;color:#eaf9ff}\n#na-root .na-btn:hover{background:#306d8f;border-color:#a5e2ff}\n#na-root .na-btn.primary{background:linear-gradient(110deg,#50b8fa,#a2e9ff);color:#06233a;border-color:transparent}\n#na-root .na-score select,#na-root .na-field textarea{background:#071c2e;color:#eafaff;border:1px solid #648eaa}\n#na-root #na-editor>.na-actions{position:static;background:transparent;border:0;box-shadow:none;padding:0}\n#na-root .na-check{background:#12384d;border-left:3px solid #8ad5ff}\n#na-root #na-message{color:#b6e6ff}\n#na-root .na-release-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:9px;margin:12px 0}\n#na-root .na-release-class{padding:12px 9px;font-size:13px}\n#na-root .na-release-class.is-open{background:#135156;border-color:#6cd9bb;color:#d0fff0}\n#na-root .na-release-class[aria-pressed=\"false\"]{background:#17354a}\n#na-root .na-wizard{margin:12px 0}\n#na-root .na-wizard-top{position:sticky;top:0;z-index:4;background:#092338f5;backdrop-filter:blur(12px);border:1px solid #497b96;border-radius:13px;padding:15px;box-shadow:0 11px 22px #0005}\n#na-root .na-wizard-meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#c0e8fb;font-weight:850;margin-bottom:10px}\n#na-root .na-wizard-grid{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:7px}\n#na-root .na-wizard-jump{min-width:0;min-height:50px;padding:5px 3px;border-radius:9px;border:1px solid #4c718a;background:#122b40;color:#c5ddeb;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-direction:column;font:inherit}\n#na-root .na-wizard-jump strong{font-size:13px}#na-root .na-wizard-jump small{font-size:10px}\n#na-root .na-wizard-jump.is-visited{background:#4a3927;border-color:#c49d61;color:#ffe0b4}\n#na-root .na-wizard-jump.is-answered{background:#134c55;border-color:#5bbca7;color:#cbffed}\n#na-root .na-wizard-jump.is-active{outline:2px solid #a1e3ff;outline-offset:0;background:#236184;color:#fff}\n#na-root .na-wizard-key{font-size:12px;color:#b8d7e8;margin-top:9px}\n#na-root .na-wizard-page{background:linear-gradient(145deg,#12364e,#0b2438);border:1px solid #4b7892;border-radius:15px;padding:clamp(16px,3vw,30px);margin-top:15px;min-height:245px}\n#na-root .na-wizard-page[hidden]{display:none!important}\n#na-root .na-wizard-stage{font-size:13px;color:#9edfff;font-weight:850}\n#na-root .na-wizard-question{display:block;color:#f3fbff;font-size:clamp(17px,2.4vw,21px);font-weight:850;line-height:1.5;margin:16px 0}\n#na-root .na-wizard-hint{font-size:13px;color:#bbd7e9;margin-bottom:13px}\n#na-root .na-wizard-option{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid #4d7895;background:#0b2539;border-radius:11px;margin:9px 0;cursor:pointer}\n#na-root .na-wizard-option:has(input:checked){background:#1d526f;border-color:#9ce1ff;box-shadow:inset 0 0 0 1px #9ce1ff}\n#na-root .na-wizard-option input{accent-color:#80d7ff}#na-root .na-wizard-option span{flex:1}\n#na-root .na-wizard-answer{width:100%;min-height:150px;padding:14px;resize:vertical;background:#081d2d;border:1px solid #6b95b0;border-radius:11px;color:#f4fbff;font:inherit}\n#na-root .na-wizard-bottom{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding-top:15px;margin-top:15px;border-top:1px solid #4c758d}\n#na-root .na-wizard-actions{display:flex;gap:9px;flex-wrap:wrap}\n#na-root .na-wizard-actions .na-btn{min-width:110px;padding:11px 15px}\n#na-root .na-wizard-actions #na-submit{min-width:150px;font-size:16px}\n#na-root .na-wizard-info{font-size:12px;color:#c3dbe9;max-width:445px}\n#na-root .na-wizard-legacy{padding:12px;color:#ffe8b5;border:1px solid #9d7f53;background:#43321c;border-radius:9px;margin:10px 0}\n@media(max-width:700px){#na-root .na-wizard-grid{grid-template-columns:repeat(6,minmax(0,1fr))}#na-root .na-wizard-top{padding:10px}#na-root .na-wizard-jump{min-height:42px}#na-root .na-wizard-bottom{flex-direction:column;align-items:stretch}#na-root .na-wizard-actions{display:grid;grid-template-columns:repeat(2,1fr)}#na-root .na-wizard-actions .na-btn{min-width:0!important}}\n";
 document.head.appendChild(style);
}

function mountStudent(userUid){
 const editor=document.getElementById('na-editor');
 if(!editor||editor.hidden||editor.dataset.guided17)return;
 editor.dataset.guided17='yes';
 const uid=String(userUid||'');
 if(!uid)throw Error('학생 계정 정보가 없어 문항 열람 상태를 기록할 수 없습니다.');
 const visitKey='nepal-assessment-17q-visit-v3:'+uid;
 let visited=new Set(),index=0;
 try{
  const stored=JSON.parse(localStorage.getItem(visitKey)||'[]');
  if(Array.isArray(stored))for(const id of stored)if(Q.some(q=>q[0]===id))visited.add(id);
 }catch(_){}
 const ai=document.getElementById('na-aiUse');
 if(ai){ai.value='해당 없음 (17문항 개인 수행평가)';ai.dispatchEvent(new Event('input',{bubbles:true}))}
 const groupKeys=[...new Set(Q.map(q=>q[1]))],saved={},legacy=[];
 for(const key of groupKeys){
  const field=document.getElementById('na-'+key);
  if(!field)throw Error('답안 저장 필드가 없습니다: '+key);
  const text=String(field.value||''),values={};
  text.split(/\r?\n/).forEach(line=>{const m=/^(Q\d{2}):\s*(.*)$/.exec(line);if(m)values[m[1]]=m[2]});
  if(text.trim()&&!Object.keys(values).length)legacy.push(key);
  Object.assign(saved,values);
 }
 const host=document.createElement('section');host.id='na-wizard';host.className='na-wizard';
 host.innerHTML='<div class="na-wizard-top"><div class="na-wizard-meta"><span>📝 <span id="na-wizard-current">01 / 17</span></span><span id="na-wizard-tally">열람 0 / 17 · 작성 0 / 17</span></div><nav class="na-wizard-grid" id="na-wizard-grid" aria-label="문항별 이동"></nav><div class="na-wizard-key">파랑 테두리: 현재 문항 · 초록: 작성 완료 · 갈색: 열람했지만 미응답 · 회색: 미열람</div></div><div id="na-wizard-pages"></div><div class="na-wizard-bottom"><div class="na-wizard-info" id="na-wizard-info"></div><div class="na-wizard-actions" id="na-wizard-actions"><button type="button" class="na-btn" id="na-wizard-prev">← 이전</button><button type="button" class="na-btn primary" id="na-wizard-next">다음 →</button></div></div>';
 editor.prepend(host);
 const oldProgress=document.getElementById('na-progress');if(oldProgress)oldProgress.hidden=true;
 const rubric=document.querySelector('#na-body > .na-rubric');
 if(rubric){
  const details=document.createElement('details');details.className='na-card na-rubric-details';
  const heading=document.createElement('summary');heading.textContent='📋 채점 기준 확인하기';details.appendChild(heading);
  rubric.parentNode.insertBefore(details,rubric);details.appendChild(rubric);editor.after(details);
 }
 for(const key of groupKeys){
  const field=document.getElementById('na-'+key);
  const card=field.closest('.na-card');
  if(card)card.hidden=true;
 }
 const grid=host.querySelector('#na-wizard-grid'),pages=host.querySelector('#na-wizard-pages'),controls={};
 function syncGroup(key){
  const field=document.getElementById('na-'+key);
  field.value=Q.filter(q=>q[1]===key).map(q=>q[0]+': '+String(controls[q[0]]?.value||'').replace(/\s+/g,' ').trim()).join('\n');
  field.dispatchEvent(new Event('input',{bubbles:true}));
 }
 function answered(q){return !!String(controls[q[0]]?.value||'').trim()}
 for(let n=0;n<Q.length;n++){
  const [id,key,stage,type,title,choices]=Q[n];
  const page=document.createElement('section');page.className='na-wizard-page';page.id='na-wizard-page-'+id;page.hidden=true;
  page.innerHTML='<div class="na-wizard-stage">문항 '+id.slice(1)+' / 17 · '+esc(stage)+' · '+(type==='mc'?'객관식':'서술형')+'</div>'+
   '<label class="na-wizard-question" '+(type==='short'?'for="as-'+id+'"':'')+'>'+esc(title)+'</label>'+
   (type==='mc'?'<p class="na-wizard-hint">정답을 하나 선택하세요. 모르겠다면 비워두고 넘어가도 됩니다.</p>'+shuffled(choices).map(choice=>'<label class="na-wizard-option"><input type="radio" name="as-'+id+'" value="'+esc(choice)+'"><span>'+esc(choice)+'</span></label>').join(''):
    '<p class="na-wizard-hint">자신의 말로 설명하세요. 미응답도 가능하며, 미응답은 채점 시 인정되지 않습니다.</p><textarea class="na-wizard-answer" id="as-'+id+'" maxlength="400" placeholder="답변을 작성하거나 다음 문항으로 넘어가세요."></textarea>');
  pages.appendChild(page);
  if(type==='short'){
   const input=page.querySelector('textarea');input.value=saved[id]||'';
   controls[id]={get value(){return input.value}};
   input.addEventListener('input',()=>{syncGroup(key);refresh()});
  }else{
   const inputs=[...page.querySelectorAll('input[type="radio"]')];
   inputs.forEach(input=>{
    if(input.value===saved[id])input.checked=true;
    input.addEventListener('change',()=>{syncGroup(key);refresh()});
   });
   controls[id]={get value(){return inputs.find(x=>x.checked)?.value||''}};
  }
  const jump=document.createElement('button');jump.type='button';jump.className='na-wizard-jump';jump.dataset.index=String(n);
  jump.addEventListener('click',()=>go(n));grid.appendChild(jump);
 }
 const prev=host.querySelector('#na-wizard-prev'),next=host.querySelector('#na-wizard-next'),submit=document.getElementById('na-submit');
 const actions=host.querySelector('#na-wizard-actions');
 if(!submit)throw Error('최종 제출 버튼을 찾지 못했습니다.');
 actions.appendChild(submit);
 const originalSubmit=submit.onclick;
 submit.onclick=function(event){
  const notSeen=Q.filter(q=>!visited.has(q[0]));
  if(index!==16||notSeen.length){
   host.querySelector('#na-wizard-info').textContent='열어보지 않은 문항: '+notSeen.map(q=>q[0]).join(', ')+' · 모든 문항을 한 번씩 확인해야 합니다.';
   return;
  }
  groupKeys.forEach(syncGroup);
  return originalSubmit?.call(this,event);
 };
 function refresh(){
  grid.querySelectorAll('button').forEach((button,n)=>{
   const q=Q[n],seen=visited.has(q[0]),filled=answered(q);
   const status=filled?'작성 완료':seen?'미응답':'미열람';
   button.className='na-wizard-jump'+(filled?' is-answered':seen?' is-visited':'')+(n===index?' is-active':'');
   button.innerHTML='<strong>'+q[0].slice(1)+'</strong><small>'+status+'</small>';
   button.setAttribute('aria-label',q[0]+' '+status+(n===index?' 현재 문항':''));
   if(n===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
  });
  host.querySelector('#na-wizard-current').textContent=String(index+1).padStart(2,'0')+' / 17';
  host.querySelector('#na-wizard-tally').textContent='열람 '+visited.size+' / 17 · 작성 '+Q.filter(answered).length+' / 17';
  const left=Q.length-visited.size;
  host.querySelector('#na-wizard-info').textContent=left?'답은 비워도 됩니다. 미열람 '+left+'문항을 모두 열면 마지막 문항에서 제출할 수 있습니다.':'모든 문항을 열어보았습니다. 17번 문항에서 최종 제출할 수 있습니다.';
  prev.disabled=index===0;next.hidden=index===16;
  submit.hidden=index!==16;submit.disabled=index!==16||left>0;
 }
 function go(n){
  if(!Number.isInteger(n)||n<0||n>=Q.length)return;
  index=n;visited.add(Q[n][0]);
  try{localStorage.setItem(visitKey,JSON.stringify([...visited]))}catch(_){}
  [...pages.children].forEach((page,i)=>page.hidden=i!==n);
  refresh();
  const root=document.getElementById('na-root');
  if(root?.scrollTo){
   const top=host.getBoundingClientRect().top-root.getBoundingClientRect().top+root.scrollTop;
   root.scrollTo({top:Math.max(0,top-8),behavior:'smooth'});
  }
 }
 prev.addEventListener('click',()=>go(index-1));
 next.addEventListener('click',()=>go(index+1));
 if(legacy.length){
  const info=document.createElement('div');info.className='na-wizard-legacy';
  info.textContent='이전 9문항 형식의 임시 답안이 있습니다. 17문항은 새로 작성해야 하며, 기존 답안은 최종 제출 전까지 저장 필드에 남아 있습니다.';
  host.querySelector('.na-wizard-top').after(info);
 }
 const oldActions=editor.querySelector(':scope > .na-actions');
 if(oldActions){
  const save=oldActions.querySelector('#na-save');
  if(save){
   const button=document.createElement('button');button.type='button';button.className='na-btn';button.textContent='💾 임시 저장';
   button.onclick=()=>{groupKeys.forEach(syncGroup);save.click()};
   actions.prepend(button);
  }
  oldActions.hidden=true;
 }
 go(0);
}
function patchRubric(root){
 const table=root?.querySelector?.('.na-rubric .na-table');
 if(!table||table.dataset.guided17)return;
 table.dataset.guided17='yes';
 const desc=[
  ['기초 개념',['Q01·03·04·05·06 중 5개 정답','4개 정답','3개 정답','0~2개 정답']],
  ['알고리즘 적용',['Q07·09·10·11·12·16 중 6개 정답','5개 정답','4개 정답','0~3개 정답']],
  ['이해·설명',['서술형 Q02·08·13·14·15·17 중 6개 충분','5개 충분','4개 충분','0~3개 충분']]
 ];
 [...table.querySelectorAll('tbody tr')].forEach((tr,i)=>{
  const cells=[...tr.children],d=desc[i];if(!d||cells.length<5)return;
  cells[0].textContent=d[0];
  d[1].forEach((v,j)=>{const span=cells[j+1].querySelector('.na-rubric-desc');if(span)span.textContent=v});
 });
 const p=root.querySelector('.na-rubric p');
 if(p)p.textContent='기초 개념 30점 · 알고리즘 적용 30점 · 이해·설명 40점. 기본점수 40점(15+15+10), 5점 간격. 미응답은 오답 또는 보완 필요로 처리됩니다.';
}
const prev=global.NepalAssessment.open;
global.NepalAssessment.open=async function(opts){
 const result=await prev.call(this,opts);
 applyBlueTheme();
 patchRubric(document);
 if(!opts?.isTeacher)mountStudent(opts?.user?.uid);
 const review=document.getElementById('na-review');
 if(opts?.isTeacher&&review){
  const obs=new MutationObserver(()=>patchRubric(review));
  obs.observe(review,{childList:true});
 }
 return result;
};
global.NepalAssessment.__guided17=true;
})(window);
