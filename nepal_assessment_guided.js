/* Guided comprehension layer for the seven Nepal x Entry developer missions.
 * Keeps the existing ten personal-answer fields, Firebase writes and submission snapshot.
 * The guided choices organise an answer, not automatically establish a correct answer.
 */
(function(global){
'use strict';
if(!global.NepalAssessment||global.NepalAssessment.__guided)return;
const K=[
 ['purpose','미션 1 · 변수',['센서에서 변수에 저장할 데이터는?',['수위 센서의 실시간 측정값','경보가 울린 횟수','센서의 이름','프로그램 제목']],['변수에 값을 저장하는 이유는?',['측정값을 이후 비교·판정에 활용하기 위해','글씨 색깔을 바꾸기 위해','센서를 삭제하기 위해','반복문을 없애기 위해']],'수위값 변수 없이 위험을 판단하려면 어떤 어려움이 있을지 설명하세요.'],
 ['io','미션 2 · 반복문',['계속 변화하는 센서값을 반영하는 방법은?',['반복문으로 일정 간격마다 값을 갱신','처음 한 번만 값을 저장','값을 무작위로 입력','센서값을 삭제']],[ '올바른 처리 순서는?',['센서 측정 → 변수 저장 → 위험 판정','경보 출력 → 변수 삭제 → 센서 측정','위험 판정 → 센서 종료','센서 제거 → 경보 출력']],'반복문을 사용하지 않으면 실제 홍수 상황에서 어떤 문제가 생길 수 있나요?'],
 ['scenes','미션 3 · 조건문',['예제: 위험 기준이 4.0m 이상, 현재 수위가 4.2m이면?',['수위위험 = 1','수위위험 = 0','수위위험 = 4.2','항상 정상']],[ '이 예제에 맞는 위험 조건은?',['수위값 ≥ 4.0','수위값 < 4.0','수위값 = 0','수위값과 무관하게 경보']],'조건이 참일 때와 거짓일 때 위험 변수에 저장하는 값을 설명하세요.'],
 ['algorithm','미션 4 · 다중 센서',['유속·진동·강수의 위험을 각각 판정하려면?',['센서별 위험 변수를 만들어 0 또는 1을 저장','모든 센서값을 수위값 하나에 저장','센서 이름을 지움','위험을 모두 1로 저장']],[ '센서값과 위험 변수의 연결 순서는?',['센서값 읽기 → 기준 비교 → 위험 여부 저장','경보 출력 → 센서 삭제','위험값 무작위 생성 → 입력','센서값 읽지 않고 경보']],'센서별 위험 변수를 구분하는 이유를 한 문장으로 설명하세요.'],
 ['functions','SEMI FINAL · N개 경보',['위험 신호 [1, 0, 1, 0], 경보 기준 N=2이면?',['경보 발생(1)','정상(0)','센서 수 4를 결과로 저장','판단 불가']],[ 'N개 이상 위험일 때 경보를 내는 비교는?',['위험개수 ≥ N','위험개수 > N','위험개수 = 0','위험개수 < N']],'위험 신호를 이용해 위험개수를 어떻게 계산하는지 설명하세요.'],
 ['test1','미션 6 · 리스트와 반복',['리스트 [1, 0, 1, 1]의 위험 신호 개수는?',['3개','1개','2개','4개']],[ '이때 N=3이면 경보 결과는?',['경보 발생(1)','정상(0)','무조건 4','판단 불가']],'리스트와 반복문을 사용해 위험개수를 구하는 순서를 짧게 적으세요.'],
 ['test2','FINAL · 종합 경보',['리스트 [0, 1, 0, 1]의 위험 신호 개수는?',['2개','1개','3개','4개']],[ '이때 N=3이면 경보 결과는?',['정상(0)','경보 발생(1)','무조건 3','판단 불가']],'앞 문항의 경보 상황과 결과가 다른 이유를 설명하세요.'],
 ['changes','FINAL · 디버깅',['N=2인데 “위험개수 > N”으로 비교하면 문제가 되는 상황은?',['위험개수가 정확히 2개인 상황','위험개수가 항상 4개인 상황','센서값을 읽는 모든 상황','리스트가 비어 있지 않은 상황']],[ '이 오류를 바로잡는 조건은?',['위험개수 ≥ N','위험개수 = 0','위험개수 < N','비교문 삭제']],'수정한 조건이 잘 작동하는지 확인할 시험 상황을 직접 제시하세요.'],
 ['contribution','개인별 코드 원리 설명',['실제 엔트리 코드에서 잘 설명할 수 있는 부분은?',['변수로 센서값 저장','반복문으로 실시간 갱신','조건문으로 위험 판정','리스트와 위험개수 계산','최종 경보 판단']],[ '전체 코드 흐름으로 적절한 것은?',['센서값 읽기 → 저장 → 위험 판정 → 경보 판단','경보 판단 → 센서 삭제','센서값 읽지 않고 경보','변수 삭제 → 코드 종료']],'선택한 기능이 본인 조의 엔트리 코드에서 어떤 역할을 하는지 자기 말로 설명하세요.'],
 ['aiUse','디지털 윤리·AI 활용',['AI의 설명이나 코드를 참고할 때 바람직한 태도는?',['직접 검증·수정하고 활용 사실을 밝힌다','그대로 복사하고 자신이 만들었다고 한다','학교 계정 비밀번호를 입력한다','조원의 답안을 무단 복사한다']],[ '이번 활동에서 AI를 사용했나요?',['사용하지 않음','개념 이해에 사용','오류 확인에 사용','그 밖의 목적으로 사용']],'개인정보 보호나 저작권과 관련해 지켜야 할 점을 쓰고, AI를 사용했다면 도구·활용 내용을 적으세요.']
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function shuffled(items){
 const result=items.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result;
}
function addStyle(){
 if(document.getElementById('na-guided-style'))return;
 const st=document.createElement('style');st.id='na-guided-style';
 st.textContent='.na-guided-wrap{padding:12px;margin:8px 0 12px;border:1px solid #486b50;border-radius:10px;background:#0c2417}.na-guided-title{font-weight:800;margin:8px 0}.na-guided-label{display:block;margin:12px 0 6px;color:#e4f8dc;font-weight:650}.na-guided-select,.na-guided-note{width:100%;box-sizing:border-box;border:1px solid #76967d;border-radius:8px;padding:10px;color:#f6fff5;background:#08180d;font:14px/1.5 system-ui}.na-guided-answer{border:1px dashed #76967d!important;background:#132e1b!important;color:#d7f1d2!important}.na-guided-help{font-size:12px;color:#c4d8b9}.na-guided-progress{font-weight:800;color:#dcffb3;padding:9px 0}.na-guided-legacy{white-space:pre-wrap;padding:10px;margin-top:10px;border-radius:8px;background:#3a2a18;color:#ffedc6}.na-guided-status{margin:10px 0;padding:10px;border:1px solid #6b956b;border-radius:8px}';
 document.head.appendChild(st);
}
function answerLine(i,title,value){return '판단 '+(i+1)+' ('+title+'): '+value}
function mountStudent(){
 const editor=document.getElementById('na-editor');
 if(!editor||editor.hidden||editor.dataset.guided==='yes')return;
 editor.dataset.guided='yes';addStyle();
 const progress=document.getElementById('na-progress');
 function completed(d){
  return d.slice(2,4).every((_,i)=>!!document.getElementById('na-guide-'+d[0]+'-'+i)?.value)&&
  String(document.getElementById('na-guide-'+d[0]+'-note')?.value||'').trim().length>=8;
 }
 function updateProgress(){
  const count=K.filter(completed).length;
  if(progress)progress.textContent='미션 이해 확인 '+count+'/'+K.length+'문항 완성 · 선택 2개와 자기 말 설명 8자 이상';
 }
 function refresh(d){
  const key=d[0],field=document.getElementById('na-'+key);
  if(!field)return;
  const choices=d.slice(2,4).map((q,i)=>document.getElementById('na-guide-'+key+'-'+i).value);
  const explanation=document.getElementById('na-guide-'+key+'-note').value.replace(/\s+/g,' ').trim();
  field.value=d.slice(2,4).map((q,i)=>answerLine(i,q[0],choices[i])).join('\n')+'\n나의 설명: '+explanation;
  const legacy=document.getElementById('na-guided-old-'+key);if(legacy)legacy.hidden=true;
  field.dispatchEvent(new Event('input',{bubbles:true}));
  updateProgress();
 }
 K.forEach((d,n)=>{
  const key=d[0],field=document.getElementById('na-'+key);
  if(!field)return;
  const outer=field.closest('.na-field');if(!outer)return;
  const name=outer.querySelector('label');if(name)name.textContent='문항 '+(n+1)+'. '+d[1];
  const help=outer.querySelector('.na-help');if(help)help.textContent='다음 판단 두 가지를 선택하고, 자기 말로 이유를 짧게 작성하세요. 완성된 답안은 자동 생성됩니다.';
  const pre=document.createElement('section');pre.className='na-guided-wrap';pre.setAttribute('aria-label','미션 '+(n+1)+' 단계형 질문');
  pre.innerHTML='<p class="na-guided-help">선택 후 한 문장만 더 적으면 개인 답안이 완성돼요. 정답 여부는 교사가 판단합니다.</p>'+
   d.slice(2,4).map((q,i)=>{
    const id='na-guide-'+key+'-'+i;
    return '<label class="na-guided-label" for="'+id+'">'+(i+1)+'. '+esc(q[0])+'</label><select id="'+id+'" class="na-guided-select"><option value="">선택하세요</option>'+shuffled(q[1]).map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('')+'</select>';
   }).join('')+
   '<label class="na-guided-label" for="na-guide-'+key+'-note">3. '+esc(d[4])+'</label><input class="na-guided-note" id="na-guide-'+key+'-note" maxlength="400" placeholder="자기 말로 8자 이상 작성해 보세요"><div class="na-guided-help">아래는 제출될 완성 답안이에요. 선택·설명을 수정하면 자동으로 바뀝니다.</div>'+
   '<div id="na-guided-old-'+key+'" class="na-guided-legacy" hidden></div>';
  field.parentNode.insertBefore(pre,field);
  field.readOnly=true;field.classList.add('na-guided-answer');
  const saved=String(field.value||''),lines=saved.split('\n');
  d.slice(2,4).forEach((q,i)=>{
   const prefix='판단 '+(i+1)+' ('+q[0]+'): ';
   const found=lines.find(x=>x.startsWith(prefix));
   const select=document.getElementById('na-guide-'+key+'-'+i);
   if(found&&q[1].includes(found.slice(prefix.length)))select.value=found.slice(prefix.length);
   select.addEventListener('change',()=>refresh(d));
  });
  const note=document.getElementById('na-guide-'+key+'-note');
  const prior=lines.find(x=>x.startsWith('나의 설명: '));
  if(prior)note.value=prior.slice('나의 설명: '.length);
  note.addEventListener('input',()=>refresh(d));
  if(saved&&!lines.some(x=>x.startsWith('판단 1 ('))){
   const old=document.getElementById('na-guided-old-'+key);
   old.hidden=false;old.textContent='기존 임시 답안은 새 선택을 시작하기 전까지 보존됩니다:\n'+saved;
  }
 });
 // Keep the official evaluation weight and original database submission path.
 const summary=editor.querySelector('.na-card');if(summary)summary.innerHTML='<h3>🧩 2차 수행평가 · 미션 이해 확인</h3><p>개념 설계 30점 · 알고리즘 적용 30점 · 이해·설명 40점. 미션 1~7의 변수·반복·조건·센서·N개 경보·리스트·디버깅을 이해했는지 확인합니다.</p>';
 const submit=document.getElementById('na-submit'),prior=submit?.onclick;
 if(submit&&typeof prior==='function'){
  submit.onclick=function(e){
   const missing=K.filter(d=>!completed(d));
   if(missing.length){
    const msg=document.getElementById('na-message');
    if(msg)msg.textContent='아직 완성하지 못한 문항: '+missing.map(d=>d[1]).join(', ')+' · 각 문항은 선택 2개와 자기 설명 8자 이상이 필요합니다.';
    document.getElementById('na-guide-'+missing[0][0]+'-0')?.focus();
    return;
   }
   return prior.call(this,e);
  };
 }
 updateProgress();
}
function patchRubric(root){
 const table=root?.querySelector?.('.na-rubric .na-table');if(!table||table.dataset.guided==='yes')return;
 table.dataset.guided='yes';
 const specs=[
  ['개념 설계',['변수·반복문·조건문·다중 센서의 원리를 정확히 설명','핵심 개념을 대체로 정확하게 설명','일부 개념 이해와 적용이 부족','기본 개념의 이해가 매우 부족']],
  ['알고리즘 적용',['N개 경보·리스트·FINAL 사례를 정확히 해석','대부분 사례를 정확히 판단','일부 사례만 정확히 적용','사례 적용 능력이 매우 부족']],
  ['이해·설명',['디버깅·개별 코드 원리·디지털 윤리를 구체적인 근거로 설명','주요 근거와 설명이 적절','일부 근거나 설명만 적절','설명과 근거가 매우 부족']]
 ];
 [...table.querySelectorAll('tbody tr')].forEach((tr,i)=>{
  const cells=[...tr.children],spec=specs[i];if(!spec||cells.length<5)return;
  cells[0].textContent=spec[0];
  spec[1].forEach((v,j)=>{const span=cells[j+1].querySelector('.na-rubric-desc');if(span)span.textContent=v});
 });
 const para=root.querySelector('.na-rubric p');if(para)para.textContent='점수 단계는 기존 평가계획(30/30/40)을 유지하며, 선택 결과와 직접 작성한 근거 및 제출 코드를 함께 검토합니다.';
}
function teacherUpdate(){
 patchRubric(document);
 const area=document.getElementById('na-review');
 if(!area)return;
 const adjust=()=>{
  patchRubric(area);
  const ai=area.querySelector('#na-run-ai');if(ai){ai.disabled=true;ai.textContent='AI 채점 재검증 후 사용'}
  const display=area.querySelector('#na-ai');if(display)display.textContent='기존 AI 채점은 개발보고서 기준이므로 개념평가에는 사용하지 않습니다.';
  const heading=[...area.querySelectorAll('h3')].find(x=>x.textContent.includes('AI 1차 채점'));
  if(heading)heading.textContent='AI 채점 임시 중단';
  const labels=area.querySelectorAll('.na-score label');['개념 설계','알고리즘 적용','이해·설명'].forEach((n,i)=>{if(labels[i]&&labels[i].dataset.guided!=='yes'){const sel=labels[i].querySelector('select');if(sel){labels[i].textContent=n;labels[i].appendChild(sel);labels[i].dataset.guided='yes'}}});
 };
 adjust();
 const obs=new MutationObserver(adjust);obs.observe(area,{childList:true}); // edits are idempotent
}
const previous=global.NepalAssessment.open;
global.NepalAssessment.open=async function(options){
 const result=await previous.call(this,options);
 addStyle();
 patchRubric(document);
 if(options?.isTeacher)teacherUpdate();else mountStudent();
 return result;
};
global.NepalAssessment.__guided=true;
})(window);
