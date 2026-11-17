/* Nepal Entry individual assessment: 17 distinct prompts; preserve existing RTDB schema. */
(function(global){
'use strict';
if(!global.NepalAssessment||global.NepalAssessment.__guided17)return;
const Q=[["Q01","purpose","미션 1","mc","수위값 변수에 저장해야 할 데이터는 무엇인가요?",["센서의 이름","경보가 울린 총횟수","미션 제목","수위 센서가 현재 측정한 값"]],["Q02","io","미션 1·2","short","수위값을 저장할 때 '계속 반복하기'를 사용하지 않으면 어떤 문제가 생길까요?"],["Q03","io","미션 2","mc","실시간 수위 경보 프로그램의 올바른 처리 순서는?",["변수 삭제 → 경보 출력 → 센서값 읽기","센서값 읽기 → 변수 저장 → 위험 여부 판단","위험 여부 판단 → 센서값 읽기 → 변수 저장","경보 출력 → 센서 삭제 → 변수 저장"]],["Q04","scenes","미션 3","mc","위험 기준이 수위 4.0m 이상이고 현재 수위가 4.2m일 때, 수위위험 값은?",["0(안전)","4.2","판단할 수 없음","1(위험)"]],["Q05","scenes","미션 3","mc","수위위험 변수에는 어떤 값이 저장되나요?",["0부터 4까지 모든 수","센서 설치 위치의 이름","0 또는 1","수위 높이(m) 그대로"]],["Q06","algorithm","미션 4","mc","네 센서의 위험 여부를 각각 저장하는 올바른 방법은?",["네 센서의 위험값을 항상 1로 저장","각 센서의 위험 변수를 만들고 0 또는 1을 저장","모든 위험을 수위값 변수 하나에 저장","센서 이름을 지우고 임의의 값 저장"]],["Q07","functions","미션 5","mc","수위위험 + 유속위험 + 진동위험 + 강수위험의 값의 범위는?",["1~4","0~100","무한대까지","0~4"]],["Q08","functions","미션 5","short","네 개의 위험 변수(각 0 또는 1)를 모두 더한 값은 무엇을 의미하나요?"],["Q09","functions","미션 5","mc","위험개수 ≥ N 규칙에서 N은 무엇을 뜻하나요?",["프로그램 반복 횟수","경보에 필요한 최소 위험 센서 개수","현재 수위 높이","측정값의 합계"]],["Q10","functions","미션 5","mc","위험 신호가 [1,0,1,0]이고 N=2라면, 위험개수 ≥ N 규칙의 결과는?",["정상(0)","판단 보류","센서값 재측정","경보 발생(1)"]],["Q11","test1","미션 6","mc","엔트리 리스트는 무엇을 순서대로 모아 저장하는 자료구조인가요?",["조건문 블록만","프로그램 파일","여러 값(자료)","오브젝트 이름만"]],["Q12","test1","미션 6","mc","리스트 [1,0,1,1]에 기록된 위험한 센서는 몇 개인가요?",["4개","3개","1개","2개"]],["Q13","test1","미션 6","short","반복 계산할 때 '위험개수를 0으로 정하기' 코드가 빠지면 어떤 일이 생기나요?"],["Q14","test1","미션 6","short","여러 개의 변수를 따로 사용하는 것보다 리스트와 반복문을 함께 사용할 때 장점은?"],["Q15","test2","FINAL","short","불필요한 경보와 경보 누락은 각각 네팔 주민에게 어떤 영향을 주나요?"],["Q16","changes","FINAL","mc","위험개수=2, N=2일 때 '위험개수 ≥ N'과 '위험개수 > N'의 결과를 비교하면?",["이상(≥): 정상 / 초과(>): 경보","둘 다 경보","둘 다 정상","이상(≥): 경보 / 초과(>): 정상"]],["Q17","contribution","개인 코드 설명","short","엔트리 개발자 모드에서 사용한 코드 중 한 부분을 골라, 관련 프로그래밍 개념과 작동 원리를 자신의 말로 설명하세요."]];

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const shuffled=items=>{const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function mountStudent(){
 const editor=document.getElementById('na-editor');
 if(!editor||editor.hidden||editor.dataset.guided17)return;
 editor.dataset.guided17='yes';
 const st=document.createElement('style');st.textContent='.na-guided-host{padding:0!important;border:none!important}.na-question{background:#10261a;border:1px solid #496d55;border-radius:11px;margin:12px 0;padding:14px}.na-question-meta{font-size:12px;color:#a4dbce;font-weight:750}.na-question-title{display:block;margin:8px 0 10px;font-size:15px;color:#f3ffed;font-weight:750}.na-q-select,.na-q-text{width:100%;box-sizing:border-box;border:1px solid #789a7d;border-radius:8px;padding:10px;color:#f5fff5;background:#08180d;font:14px/1.5 system-ui}.na-q-text{resize:vertical;min-height:88px}.na-guided-old{color:#ffebca;background:#392a18;border-radius:8px;padding:10px}.na-guide-note{font-size:12px;color:#c4deb9}';document.head.appendChild(st);
 const ai=document.getElementById('na-aiUse');
 if(ai){ai.value='해당 없음 (미션 이해 확인 수행평가에서 제외된 문항)';ai.dispatchEvent(new Event('input',{bubbles:true}));}
 function elem(q){return document.getElementById('as-'+q[0])}
 function done(q){const val=String(elem(q)?.value||'').trim();return q[3]==='mc'?!!val:val.length>=8}
 function progress(){
  const n=Q.filter(done).length;
  const el=document.getElementById('na-progress');
  if(el)el.textContent='문항 완료 '+n+'/17 · 객관식 11개 / 서술형 6개';
 }
 function sync(key){
  const target=document.getElementById('na-'+key);
  target.value=Q.filter(q=>q[1]===key).map(q=>q[0]+': '+String(elem(q)?.value||'').replace(/\s+/g,' ').trim()).join('\n');
  target.dispatchEvent(new Event('input',{bubbles:true}));
  progress();
 }
 const keys=[...new Set(Q.map(q=>q[1]))];
 for(const key of keys){
  const target=document.getElementById('na-'+key),outer=target?.closest('.na-field');
  if(!target||!outer)continue;
  const saved=String(target.value||''),parsed={};
  saved.split(/\r?\n/).forEach(line=>{const m=/^(Q\d{2}):\s*(.*)$/.exec(line);if(m)parsed[m[1]]=m[2]});
  outer.classList.add('na-guided-host');
  outer.querySelector('label[for="na-'+key+'"]')?.remove();
  outer.querySelector('.na-help')?.remove();
  target.style.display='none';
  const count=document.getElementById('na-count-'+key);if(count)count.hidden=true;
  for(const q of Q.filter(q=>q[1]===key)){
   const [id,_,stage,type,label,choices]=q,block=document.createElement('section');
   block.className='na-question';
   block.innerHTML='<div class="na-question-meta">문항 '+id.slice(1)+' · '+esc(stage)+' · '+(type==='mc'?'객관식':'서술형')+'</div>'+
    '<label class="na-question-title" for="as-'+id+'">'+esc(label)+'</label>'+
    (type==='mc'?'<select class="na-q-select" id="as-'+id+'"><option value="">선택하세요</option>'+shuffled(choices).map(s=>'<option value="'+esc(s)+'">'+esc(s)+'</option>').join('')+'</select>':
     '<textarea class="na-q-text" rows="3" maxlength="400" id="as-'+id+'" placeholder="자신의 말로 설명하세요. (8자 이상)"></textarea>');
   target.parentNode.insertBefore(block,target);
   const ctrl=elem(q);
   if(parsed[id]&&(type==='short'||choices.includes(parsed[id])))ctrl.value=parsed[id];
   ctrl.addEventListener(type==='mc'?'change':'input',()=>sync(key));
  }
  if(saved.trim()&&!Object.keys(parsed).length){
   const notice=document.createElement('div');notice.className='na-guided-old';notice.textContent='이전 9문항 형식의 임시 답안이 있습니다. 이번 17문항 형식으로 다시 작성해야 합니다. 새 답변 입력 전까지 기존 내용은 유지됩니다.';
   outer.insertBefore(notice,target);
  }
 }
 const headings=editor.querySelectorAll('.na-card > h3');
 const titles=['① 미션 1~4 · 기초 개념','② 미션 5·6·FINAL · 알고리즘 적용과 이해'];
 titles.forEach((s,i)=>{if(headings[i])headings[i].textContent=s});
 const intro=document.querySelector('#na-body > .na-card:not(.na-rubric)');
 if(intro)intro.innerHTML='<h3>🧩 2차 수행평가 · 엔트리 개발자 모드</h3><p>총 17문항(객관식 11개·서술형 6개). 기초 개념 30점, 알고리즘 적용 30점, 이해·설명 40점. 총점 40~100점(5점 간격), 교사 최종 확정.</p>';
 const submit=document.getElementById('na-submit'),previous=submit?.onclick;
 if(submit&&typeof previous==='function')submit.onclick=function(e){
  const missing=Q.filter(q=>!done(q));
  if(missing.length){
   const msg=document.getElementById('na-message');
   if(msg)msg.textContent='미완성 문항: '+missing.map(q=>q[0]).join(', ')+' · 서술형은 8자 이상 작성하세요.';
   elem(missing[0])?.focus();return;
  }
  return previous.call(this,e);
 };
 progress();
}
function patchRubric(root){
 const table=root?.querySelector?.('.na-rubric .na-table');
 if(!table||table.dataset.guided17)return;
 table.dataset.guided17='yes';
 const desc=[
  ['기초 개념',['Q01·03·04·05·06 중 5개 정답','4개 정답','2~3개 정답','0~1개 정답']],
  ['알고리즘 적용',['Q07·09·10·11·12·16 중 5~6개 정답','4개 정답','2~3개 정답','0~1개 정답']],
  ['이해·설명',['서술형 Q02·08·13·14·15·17 모두 충분','4~5개 충분','2~3개 충분','0~1개 충분']]
 ];
 [...table.querySelectorAll('tbody tr')].forEach((tr,i)=>{
  const cells=[...tr.children],d=desc[i];if(!d||cells.length<5)return;
  cells[0].textContent=d[0];
  d[1].forEach((v,j)=>{const span=cells[j+1].querySelector('.na-rubric-desc');if(span)span.textContent=v});
 });
 const p=root.querySelector('.na-rubric p');
 if(p)p.textContent='기초 개념 30점 · 알고리즘 적용 30점 · 이해·설명 40점. 최저 40점(15+15+10), 5점 간격. 서술형은 개념의 정확성과 인과관계를 교사가 판단합니다.';
}
const prev=global.NepalAssessment.open;
global.NepalAssessment.open=async function(opts){
 const result=await prev.call(this,opts);
 patchRubric(document);
 if(!opts?.isTeacher)mountStudent();
 const review=document.getElementById('na-review');
 if(opts?.isTeacher&&review){
  const obs=new MutationObserver(()=>patchRubric(review));
  obs.observe(review,{childList:true});
 }
 return result;
};
global.NepalAssessment.__guided17=true;
})(window);
