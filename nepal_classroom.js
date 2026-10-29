/** NEPAL × ENTRY v4.0 — native Nepal simulator start page with role-based buttons with role-specific Google authentication, 2/3-person groups, flood scores.
 * Public board = signed-in school accounts only; code/progress = group members only.
 * Firebase rules are the authorization boundary, not this browser code.
 */
(function(global){
'use strict';
if(global.NepalClassroom)return;
const CLASS_COUNT=11,GROUP_COUNT=15,MAX_GROUP_COUNT=30,MAX_PROJECT_SIZE=1250000,MAX_NAME=18;
const TEACHER_EMAIL='goldrain1993@gmail.com';
const TRIPLE_GROUPS=new Set(['1-13','2-2','3-15','5-2','7-6','8-2','9-1','10-4','11-6']);
const groupCapacity=(c,g)=>TRIPLE_GROUPS.has(c+'-'+g)?3:2;
const memberKeys=['student1','student2','student3'];
const ROOT='nepal-v27/public/classes',PRIVATE='nepal-v27/private/classes',BACKUP='nepal-entry-v27-backup:',LOCK_MS=120000;
const PROGRESS_FALLBACK_SINCE=Date.parse('2026-10-23T00:30:00Z');
const css=document.createElement('style');
css.textContent=`
#np-gate,#np-board{position:fixed;inset:0;z-index:15000;background:rgba(2,11,7,.98);color:#edffdf;display:none;overflow:auto;font:14px/1.6 system-ui,'Malgun Gothic',sans-serif}
#np-gate.show,#np-board.show{display:block}.np-wrap{width:min(940px,calc(100vw - 28px));margin:4vh auto 38px;padding:26px;background:linear-gradient(140deg,#11251a,#07120c);border:1px solid #426649;border-radius:19px;box-shadow:0 25px 85px #000b}
.np-wrap *{box-sizing:border-box}.np-title{font-size:26px;font-weight:900;color:#baf67b}.np-sub{color:#a6c0a8;font-size:12px}
.np-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0}.np-field{display:flex;flex-direction:column;gap:6px;font-weight:750}
.np-field input,.np-field select,#np-board-class{width:100%;border:1px solid #527c51;border-radius:9px;background:#0b1a11;color:#fff;min-height:48px;padding:8px 10px;font-size:14px}
.np-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:15px}.np-btn{background:#b1f47b;color:#122912;border:0;border-radius:11px;padding:13px 18px;font-weight:850;cursor:pointer;font-size:14px}.np-btn.alt{background:#183922;color:#efffe5;border:1px solid #4d7150}.np-btn:disabled{opacity:.52;cursor:not-allowed}
.np-note{background:#18271b;border:1px solid #425b3b;border-radius:9px;padding:11px;color:#dcecd5;font-size:12px;margin:11px 0}.np-alert{color:#ffc0a2;border-color:#825041}
.np-msg{white-space:pre-wrap;min-height:22px;color:#def4cd;font-size:12px;margin-top:11px}.np-head{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}.np-head select{min-width:125px;width:auto}
.np-boardgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.np-team{background:#0e2017;border:1px solid #2a5636;border-radius:12px;padding:14px;min-height:123px}.np-team.mine{outline:2px solid #a9ed70}
.np-score{font-size:12px;color:#d5f59a;margin-top:5px}
.np-gold-medal{position:relative;display:inline-grid;place-items:center;width:32px;height:32px;margin-right:4px;border-radius:50%;border:3px ridge #ffe185;background:radial-gradient(circle at 35% 27%,#fff2a9 0%,#ffc640 35%,#d78a09 85%);box-shadow:0 1px 8px #ffc94b88,inset 0 0 0 2px #bb8013;color:#4a2700;font-size:19px;font-weight:1000;text-shadow:0 1px #ffe89b;vertical-align:middle;flex:none}
.np-gold-medal::before,.np-gold-medal::after{content:'';position:absolute;top:-13px;width:8px;height:15px;background:#db4536;z-index:-1;border:1px solid #ffc851}
.np-gold-medal::before{left:5px;transform:rotate(-23deg)}.np-gold-medal::after{right:5px;transform:rotate(23deg)}
.np-teamhead{display:flex;justify-content:space-between;font-size:15px;font-weight:900}.np-members{font-size:13px;color:#e7f3da;margin-top:7px;overflow-wrap:anywhere;min-height:23px}
.np-member-entry{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:4px 0;padding:2px 0}
.np-member-entry>span{min-width:0;overflow-wrap:anywhere}
.np-delete-member{font:inherit;font-size:11px;font-weight:850;cursor:pointer;white-space:nowrap;padding:4px 9px;background:#45241f;border:1px solid #cc7963;border-radius:7px;color:#ffe4d7;flex:none}
.np-delete-member:hover,.np-delete-member:focus-visible{background:#75352b;border-color:#ffb69e}
.np-delete-member:disabled{opacity:.45;cursor:wait}
.np-reset-missions{margin-top:9px;font:inherit;font-size:11px;font-weight:850;cursor:pointer;border:1px solid #d8b56c;background:#352a1c;color:#ffe7b7;border-radius:8px;padding:6px 10px}.np-reset-missions:hover{background:#523d22}.np-reset-missions:disabled{opacity:.45;cursor:wait}
.np-add-group{display:inline-flex;align-items:center;gap:6px;margin-top:11px;padding:9px 14px;background:#2c542f;color:#edffcd;border:1px solid #9bd872;border-radius:8px;font-weight:850;cursor:pointer}
.np-add-group:hover{background:#3c6740}.np-add-group:disabled{opacity:.5;cursor:not-allowed}
.np-group-count{margin-left:12px;color:#c2e7af;font-size:12px}
.np-track{height:8px;background:#304334;border-radius:10px;overflow:hidden;margin-top:12px}.np-track div{height:100%;background:linear-gradient(90deg,#6cb041,#deff9a)}.np-caption{font-size:11px;color:#b5cbb2;margin-top:7px}.np-saveinfo{max-width:260px;font-size:11px;color:#d4e5b9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* A pre-simulation gate: on entry only THREE choices, never account details or logout. */
#np-gate .np-gate-hero{width:min(900px,calc(100vw - 32px));min-height:min(660px,calc(100vh - 80px));margin:max(4vh,22px) auto;padding:clamp(22px,5vw,60px);border:1px solid #48734d;border-radius:24px;background:radial-gradient(ellipse at 50% 100%,#15412c77,transparent 55%),linear-gradient(145deg,#14291e,#06110e 70%);box-shadow:0 28px 90px #0009;display:flex;flex-direction:column;justify-content:center;position:relative;isolation:isolate;overflow:hidden}
#np-gate .np-gate-hero::after{content:'';position:absolute;inset:auto -8% 0;height:27%;z-index:-1;opacity:.32;background:linear-gradient(130deg,transparent 43%,#235a4e 44% 51%,transparent 52%),linear-gradient(25deg,transparent 39%,#358071 40% 53%,transparent 54%)}
.np-brand{font-size:clamp(34px,6vw,64px);font-weight:950;color:#bcfc78;letter-spacing:-.045em;line-height:1.12;text-align:center;text-shadow:0 2px 22px #8bee4670}
.np-brand-sub{font-size:clamp(13px,2vw,19px);letter-spacing:.17em;font-weight:780;color:#b5dcc0;text-align:center;margin:12px 0 32px}
.np-landing-desc{color:#d5edcf;text-align:center;font-size:14px;margin:0 0 22px}
.np-landing-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 auto;width:100%}
.np-landing-btn{display:flex;flex-direction:column;align-items:center;gap:9px;justify-content:center;min-height:155px;cursor:pointer;background:#183923;color:#efffe4;border:1px solid #4f8254;border-radius:17px;font:inherit;transition:transform .16s,border-color .16s,background .16s}
.np-landing-btn:hover{transform:translateY(-3px);border-color:#bdf68b;background:#21452c}.np-landing-btn:focus-visible{outline:3px solid #b9fc88;outline-offset:3px}
.np-landing-icon{font-size:32px}.np-landing-label{font-size:19px;font-weight:850}.np-landing-hint{font-size:11px;color:#b9d7ae}
#np-gate[data-page="landing"] #np-student-panel{display:none}
#np-gate[data-page="student"] #np-landing-panel{display:none}
.np-student-title{font-size:27px;color:#bcfb82;font-weight:900;margin:0 0 5px}.np-student-description{color:#bed5b6;margin:0 0 18px}
.np-student-footer{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:16px}
.np-student-submit{flex:1;min-width:170px}
.np-back{border:1px solid #547054;background:#132a1d;color:#eafde3}
.np-progress-message{min-height:24px;margin-top:12px;font-size:13px;color:#e4ffcd;white-space:pre-wrap}
@media(max-width:760px){.np-form{grid-template-columns:1fr}.np-boardgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.np-wrap{padding:16px}.np-landing-choices{grid-template-columns:1fr}.np-landing-btn{min-height:84px;flex-direction:row}.np-landing-hint{display:none}#np-gate .np-gate-hero{min-height:auto;padding:25px 20px}}
@media(max-width:470px){.np-boardgrid{grid-template-columns:1fr}}
/* v3.3: Retain the original Nepal start card, animations and background. */
#startScreen.np-student-active{overflow-y:auto}
#np-gate{display:none!important}
#startScreen .startMenu #np-student-panel{width:min(420px,100%);color:#edf7ea;text-align:left;margin:0}
#startScreen .startMenu #np-student-panel[hidden]{display:none!important}
#startScreen .startMenu #np-student-panel .np-student-title{font-size:18px;text-align:center;margin:0 0 7px}
#startScreen .startMenu #np-student-panel .np-student-description{font-size:12px;text-align:center;margin:0 0 10px}
#startScreen .startMenu #np-student-panel .np-form{grid-template-columns:repeat(2,minmax(0,1fr));margin:8px 0;gap:8px}
#startScreen .startMenu #np-student-panel .np-field{font-size:12px}
#startScreen .startMenu #np-student-panel .np-field:nth-child(3){grid-column:1/-1}
#startScreen .startMenu #np-student-panel .np-field input,
#startScreen .startMenu #np-student-panel .np-field select{height:40px;min-height:40px}
#startScreen .startMenu #np-student-panel .np-student-footer{margin-top:10px}
#startScreen .startMenu #np-student-panel .np-student-footer button{flex:1;min-width:0}
#np-home-error{color:#ffd6b4;font-size:12px;text-align:center;max-width:420px;white-space:pre-wrap}
@media(max-width:470px){#startScreen .startMenu #np-student-panel .np-form{grid-template-columns:1fr}#startScreen .startMenu #np-student-panel .np-field:nth-child(3){grid-column:auto}}
`;
document.head.appendChild(css);
const gate=document.createElement('section'),board=document.createElement('section');gate.id='np-gate';gate.dataset.page='landing';board.id='np-board';document.body.append(gate,board);gate.classList.add('show');
const classOpts=Array.from({length:CLASS_COUNT},(_,i)=>`<option value="${i+1}">${i+1}반</option>`).join('');
const groupOptionsHtml=n=>Array.from({length:n},(_,i)=>`<option value="${i+1}">${i+1}조</option>`).join('');
const groupOpts=groupOptionsHtml(GROUP_COUNT);
const classChooseOpts='<option value="" selected disabled>선택</option>'+classOpts;
const groupChooseOpts='<option value="" selected disabled>선택</option>'+groupOpts;
gate.innerHTML=`<div class="np-gate-hero">
<div id="np-landing-panel">
 <div class="np-brand">NEPAL FLOOD</div><div class="np-brand-sub">EARLY WARNING SYSTEM × ENTRY</div>
 <p class="np-landing-desc">홍수 경보 시스템을 시작할 방법을 선택하세요.</p>
 <div class="np-landing-choices">
  <button type="button" class="np-landing-btn" id="np-role-student"><span class="np-landing-icon">🎒</span><span class="np-landing-label">학생 로그인</span><span class="np-landing-hint">반·조·이름 등록</span></button>
  <button type="button" class="np-landing-btn" id="np-role-teacher"><span class="np-landing-icon">🧑‍🏫</span><span class="np-landing-label">교사 로그인</span><span class="np-landing-hint">교사용 Google 계정</span></button>
  <button type="button" class="np-landing-btn" id="np-enter-guest"><span class="np-landing-icon">🌐</span><span class="np-landing-label">게스트 입장</span><span class="np-landing-hint">로그인·기록 저장 없음</span></button>
 </div>
 <div class="np-progress-message" id="np-landing-error" role="alert" style="text-align:center"></div>
</div>
<div id="np-student-panel">
 <h1 class="np-student-title">학생 로그인</h1><p class="np-student-description">반·조·이름을 입력하고 입장을 누르면 학교 Google 계정 인증창이 열립니다.</p>
 <form id="np-student-form" class="np-student-form"><div class="np-form">
  <label class="np-field">반 선택<select id="np-class" required>${classChooseOpts}</select></label>
  <label class="np-field">조 선택<select id="np-group" required>${groupChooseOpts}</select></label>
  <label class="np-field">이름<input id="np-name" maxlength="${MAX_NAME}" required autocomplete="off" placeholder="학생 본인 이름"/></label>
 </div><div class="np-student-footer"><button type="button" id="np-back" class="np-btn np-back">← 돌아가기</button><button type="submit" id="np-enter" class="np-btn np-student-submit">입장하기</button></div></form>
 <div class="np-progress-message" id="np-gate-msg" aria-live="polite"></div>
</div></div>`;
board.innerHTML=`<div class="np-wrap"><div class="np-head"><div><div class="np-title">📊 네팔 홍수 · 엔트리 통합 현황판</div><div class="np-sub" id="np-board-info">학교 구글 계정 · 등급/점수는 100회 형성평가 최고 기록</div></div><label>반 선택 <select id="np-board-class">${classOpts}</select></label></div><section id="np-teacher-admin" hidden class="np-note" style="margin-top:16px"><strong>🧑‍🏫 조별 학생 등록·미션 관리</strong><p style="font-size:12px;margin:4px 0 0"><b>조 추가</b>는 현재 반에 16조·17조 등을 하나씩 만듭니다. 학생이 새 조로 이동하려면 이전 조의 등록을 삭제한 뒤 새 조로 로그인하게 해 주세요. 기존 기록은 이동하지 않습니다. <b>미션 초기화</b>는 해당 조의 미션·SEMI FINAL·FINAL 기록만 초기화하며 코드·형성평가는 보존합니다.</p><button class="np-add-group" id="np-add-group" type="button">＋ 이 반에 조 추가</button><span class="np-group-count" id="np-group-count"></span></section><div class="np-boardgrid" id="np-grid"></div><div class="np-actions"><button class="np-btn alt" id="np-board-close">← 돌아가기</button><button class="np-btn alt" id="np-teacher-sim">🌊 시뮬레이션 보기</button><button class="np-btn alt" id="np-board-refresh">↻ 새로고침</button><button class="np-btn alt" id="np-board-signout">로그아웃</button></div><div class="np-msg" id="np-board-msg"></div></div>`;
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanName=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,MAX_NAME);
function validClass(c){return Number.isInteger(c)&&c>=1&&c<=CLASS_COUNT}
function valid(c,g){return validClass(c)&&Number.isInteger(g)&&g>=1&&g<=MAX_GROUP_COUNT}
const groupCounts={};
function knownGroupCount(c){return groupCounts[c]||GROUP_COUNT}
function normalizeGroupCount(n){
 const count=Number(n);
 return Number.isInteger(count)&&count>=GROUP_COUNT&&count<=MAX_GROUP_COUNT?count:GROUP_COUNT;
}
async function readGroupCount(c){
 if(!validClass(c))return GROUP_COUNT;
 if(!db)return knownGroupCount(c);
 try{
  const n=normalizeGroupCount((await db.ref(`${ROOT}/c${c}/settings/groupCount`).once('value')).val());
  groupCounts[c]=n;
  return n;
 }catch(error){
  console.warn('[NEPAL] 추가 조 목록 불러오기 실패:',error);
  return knownGroupCount(c);
 }
}
let groupSelectTicket=0;
function renderGroupOptions(c,count,selected=''){
 const field=$('np-group');if(!field||c!==Number($('np-class').value))return;
 field.innerHTML='<option value="" disabled>선택</option>'+groupOptionsHtml(count);
 field.value=selected&&Number(selected)<=count?String(selected):'';
}
async function refreshGroupOptions(c,selected=''){
 const ticket=++groupSelectTicket;
 if(!validClass(c)){renderGroupOptions(c,GROUP_COUNT);return}
 const n=await readGroupCount(c);
 if(ticket!==groupSelectTicket||Number($('np-class').value)!==c)return;
 renderGroupOptions(c,n,selected);
}
function src(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=()=>reject(Error('스크립트 다운로드 실패: '+url));document.head.appendChild(s)})}
let fb=null,db=null,auth=null,user=null,schoolDomain='',teacherUids=[],initError='',initDone=false;
let requestedRole='student',authRole=null,loginBusy=false;
let guestActive=false;
let sessionActive=false;
const TEACHER_SESSION_KEY='nepal-v27-teacher-tab-session';
function readTeacherSession(){try{const s=JSON.parse(sessionStorage.getItem(TEACHER_SESSION_KEY)||'null');return s?.role==='teacher'&&typeof s.uid==='string'?s:null}catch(_){return null}}
function rememberTeacherSession(editorOpen){
 if(!sessionActive||!requireTeacher(user))return;
 try{sessionStorage.setItem(TEACHER_SESSION_KEY,JSON.stringify({role:'teacher',uid:user.uid,editor:!!editorOpen}))}catch(e){console.warn('교사 복원 상태 저장 실패',e)}
}
function forgetTeacherSession(){try{sessionStorage.removeItem(TEACHER_SESSION_KEY)}catch(_){}}
// A student is restored only when Firebase Auth still identifies the SAME
// authorized member of the SAME existing group. Never auto-register a slot.
const STUDENT_SESSION_KEY='nepal-v27-student-tab-session';
function readStudentSession(){
 try{
  const saved=JSON.parse(sessionStorage.getItem(STUDENT_SESSION_KEY)||'null');
  return saved?.role==='student'&&typeof saved.uid==='string'&&valid(saved.c,saved.g)&&
    memberKeys.includes(saved.slot)?saved:null;
 }catch(_){return null}
}
function rememberStudentSession(editorOpen){
 if(!sessionActive||!requireStudent(user)||!team||!role)return;
 try{sessionStorage.setItem(STUDENT_SESSION_KEY,JSON.stringify({
  role:'student',uid:user.uid,c:team.c,g:team.g,slot:role,editor:!!editorOpen
 }))}catch(e){console.warn('학생 화면 복원 상태 저장 실패',e)}
}
function forgetStudentSession(){try{sessionStorage.removeItem(STUDENT_SESSION_KEY)}catch(_){}}

let nativeStart=null,nativeButtons=[],nativeStudentPanel=null;
const loginCaptions=['🎒 학생 로그인','🧑‍🏫 교사 로그인','🌐 게스트 입장'];
const simulatorCaptions=['시작하기','형성평가 바로가기','이용 방법 보기'];
let team=null,role=null,editorLockHeld=false,codeListener=null,boardListener=null,projectToRestore=null;
let teacherScores={floodBest:null,mission5NoListBest:null,finalBest:null};
let designReady=false,designSavedAt=0;
let progress=0,missionTotal=4,progressSaved=0,progressRetry=null,lastProgressSaveError='',retryingProgress=false,lastProgressRetryAt=0,callbacks={},saveBusy=false,queued=false,readyToSave=false,restoring=false,importPending=null,exportPending=null,rpcId=0,headerStatus=null,lastSaved='',autosave=null,lockRefresh=null,lockedTeamPath='';
function teamPath(c,g){return `${ROOT}/c${c}/teams/g${g}`}
function workPath(c,g){return `${PRIVATE}/c${c}/teams/g${g}`}
function teacherPath(){return user&&requireTeacher(user)?'nepal-v27/private/teacherWork/'+user.uid:null}
function backupKey(){return guestActive||!user?null:requireTeacher(user)?BACKUP+user.uid+':teacher':team?BACKUP+user.uid+':c'+team.c+'g'+team.g:null}
function localBackUp(project){
 const key=backupKey();if(!key||!Array.isArray(project?.objects))return;
 try{
  const current=localRestore(),recovery=localRecovery();
  const richest=[current,recovery].filter(x=>Array.isArray(x?.project?.objects))
   .sort((x,y)=>projectScriptBytes(y.project)-projectScriptBytes(x.project))[0];
  if(richest&&projectScriptBytes(richest.project)>projectScriptBytes(recovery?.project))
   localStorage.setItem(key+':recovery',JSON.stringify(richest));
  if(isSuspiciousLoss(projectScriptBytes(current?.project),projectScriptBytes(project)))return;
  const snapshot={project,updatedAt:Date.now()};
  localStorage.setItem(key,JSON.stringify(snapshot));
  if(projectScriptBytes(project)>projectScriptBytes(richest?.project))
   localStorage.setItem(key+':recovery',JSON.stringify(snapshot));
 }catch(e){console.warn('로컬 엔트리 코드 백업 오류:',e)}
}
function localRestore(){try{const key=backupKey();return key?JSON.parse(localStorage.getItem(key)||'null'):null}catch(_){return null}}
function localRecovery(){try{const key=backupKey();return key?JSON.parse(localStorage.getItem(key+':recovery')||'null'):null}catch(_){return null}}
function pendingProgressKey(){const k=backupKey();return k?k+':progress-pending':null}
function pendingProgress(){try{const k=pendingProgressKey(),n=k?Number(localStorage.getItem(k)):0;return Number.isInteger(n)&&n>=1&&n<=missionTotal?n:0}catch(_){return 0}}
function queueProgress(n){try{const k=pendingProgressKey();if(k)localStorage.setItem(k,String(Math.max(pendingProgress(),n)))}catch(_){}}
function clearQueuedProgress(n){try{const k=pendingProgressKey();if(k&&pendingProgress()<=n)localStorage.removeItem(k)}catch(_){}}
function progressErrorText(error){
 const e=String(error?.code||error?.message||error||'서버 저장 여부 확인 실패');
 if(/permission[_ -]*denied/i.test(e))return 'Firebase 권한 거부(PERMISSION_DENIED): progressV3 보안 규칙 게시 여부를 확인하세요.';
 if(/offline|network|unavailable|timeout|disconnect|connection/i.test(e))return '연결이 불안정합니다. 온라인 연결 시 다시 저장합니다.';
 return e.slice(0,180);
}
function retryPendingProgress(){
 if(retryingProgress||!db||!user||guestActive||!(team||requireTeacher(user)&&sessionActive))return;
 const pending=pendingProgress();if(!pending)return;
 if(pending<=progressSaved){clearQueuedProgress(progressSaved);return}
 if(Date.now()-lastProgressRetryAt<15000)return;
 lastProgressRetryAt=Date.now();retryingProgress=true;
 saveProgress(pending).finally(()=>{retryingProgress=false});
}
// Only measure EntryJS code-bearing fields. Objects can contain sprite media
// even if their actual programming scripts are empty.
// Detect unexpectedly truncated exports, even when some blocks remain.
function isSuspiciousLoss(before,after){return before>100&&before-after>=100&&after<before*.55}
function projectScriptBytes(project){
 if(!project||!Array.isArray(project.objects))return 0;
 const scriptSize=value=>{
  if(value===null||value===undefined)return 0;
  const str=typeof value==='string'?value:JSON.stringify(value);
  return str&&str!=='[]'&&str!=='{}'&&str!=='null'?str.length:0;
 };
 let total=0;
 for(const o of project.objects)total+=scriptSize(o?.script);
 for(const f of project.functions||[])total+=scriptSize(f?.content);
 return total;
}
function latestProject(cloud,local){
 let remote=null;
 if(cloud?.payload){remote=JSON.parse(cloud.payload);if(!Array.isArray(remote?.objects))throw Error('온라인 엔트리 코드 형식 오류')}
 const draft=local?.project;
 const candidates=[
  {name:'온라인 코드',value:remote,time:Number(cloud?.updatedAt)||0},
  {name:'브라우저 임시 저장본',value:draft,time:Number(local?.updatedAt)||0},
  {name:'블록 복구 사본',value:localRecovery()?.project,time:Number(localRecovery()?.updatedAt)||0}
 ].filter(x=>Array.isArray(x.value?.objects));
 if(!candidates.length)return null;
 const richer=candidates.reduce((a,b)=>projectScriptBytes(a.value)>=projectScriptBytes(b.value)?a:b);
 const filtered=candidates.filter(x=>!isSuspiciousLoss(projectScriptBytes(richer.value),projectScriptBytes(x.value)));
 const selected=filtered.sort((a,b)=>b.time-a.time)[0]||richer;
 if(selected.name!=='온라인 코드')note('🛟 '+selected.name+'으로 코드를 복원합니다.');
 return selected.value;
}
function updateNativeCaptions(){
 if(nativeButtons.length!==3)return;
 const names=sessionActive?simulatorCaptions:loginCaptions;
 nativeButtons.forEach((button,i)=>{button.textContent=names[i];button.style.display=nativeStudentPanel&&!nativeStudentPanel.hidden?'none':'';});
}
function showNativeHome(active){
 sessionActive=!!active;
 gate.classList.remove('show');
 if(nativeStart){nativeStart.classList.remove('hiddenStart');nativeStart.classList.remove('np-student-active');}
 if(nativeStudentPanel)nativeStudentPanel.hidden=true;
 const error=$('np-home-error');if(error)error.textContent='';
 updateNativeCaptions();refreshButtons();
}
function showNativeStudent(){
 if(sessionActive)return;
 // Every new student entry starts with an explicit choice, preventing
 // an accidentally reused class/group from an earlier login.
 $('np-class').value='';
 $('np-group').innerHTML='<option value="" selected disabled>선택</option>'+groupOptionsHtml(GROUP_COUNT);
 $('np-group').value='';
 ++groupSelectTicket;
 gate.classList.remove('show');
 if(nativeStart){nativeStart.classList.remove('hiddenStart');nativeStart.classList.add('np-student-active');}
 if(nativeStudentPanel)nativeStudentPanel.hidden=false;
 const error=$('np-home-error');if(error)error.textContent='';
 updateNativeCaptions();$('np-name')?.focus();refreshButtons();
}
function setupNativeHome(){
 nativeStart=document.getElementById('startScreen');
 nativeButtons=['enterLabBtn','enterAssessmentBtn','enterHowBtn'].map(id=>document.getElementById(id));
 if(!nativeStart||nativeButtons.some(b=>!b)){console.error('NEPAL 원본 시작 버튼을 찾지 못했습니다.');return;}
 const menu=nativeStart.querySelector('.startMenu');
 if(!menu)return;
 nativeStudentPanel=$('np-student-panel');
 menu.appendChild(nativeStudentPanel);nativeStudentPanel.hidden=true;
 const error=document.createElement('div');error.id='np-home-error';error.setAttribute('role','alert');menu.appendChild(error);
 nativeButtons.forEach(button=>button.disabled=false);
 nativeButtons.forEach((button,index)=>button.addEventListener('click',e=>{
   if(sessionActive)return; // hand over to the ORIGINAL simulator start/assessment/help handlers.
   e.preventDefault();e.stopImmediatePropagation();
   if(index===0)showNativeStudent();
   if(index===1)teacherSubmit();
   if(index===2)enterGuest();
 },true));
 showNativeHome(false);
}
function note(m){
 if(headerStatus)headerStatus.textContent=m;
 const el=$('np-gate-msg');if(el)el.textContent=m;
 const error=$('np-home-error');if(error&&!sessionActive){error.textContent=nativeStudentPanel&&!nativeStudentPanel.hidden?'':m;}
}

function sayAuth(m){note(m)}
function requireSchool(u){return !!(u&&u.emailVerified&&u.providerData.some(p=>p.providerId==='google.com')&&u.email?.toLowerCase().endsWith('@'+schoolDomain))}
function requireTeacher(u){return !!(u&&u.emailVerified&&u.providerData.some(p=>p.providerId==='google.com')&&u.email?.toLowerCase()===TEACHER_EMAIL&&teacherUids.includes(u.uid))}
function requireStudent(u){return !!(requireSchool(u)&&!requireTeacher(u))}
function syncAuth(u){
 // Firebase can retain an old session: DO NOT show user/email or an authenticated state
 // on the public landing form. A fresh Google chooser is requested on every entry.
 const teacher=requireTeacher(u),student=requireStudent(u);
 user=u&&(teacher||student)?u:null;
 authRole=teacher?'teacher':student?'student':null;
 refreshButtons();
 if(board.classList.contains('show')&&user)loadBoard();
}
function selectRole(role){
 if(role!=='student')return;
 requestedRole='student';gate.dataset.page='student';note('');
 showNativeStudent();
}
function landing(){requestedRole='student';gate.dataset.page='landing';note('');const err=$('np-landing-error');if(err)err.textContent='';showNativeHome(false)}
async function init(){
 try{
  await src('./nepal_firebase_config.js?v=31');
  const cfg=global.NEPAL_FIREBASE_CONFIG||{};
  schoolDomain=String(cfg.schoolDomain||'').trim().toLowerCase().replace(/^@/,'');teacherUids=(Array.isArray(cfg.teacherUids)?cfg.teacherUids:[]).filter(x=>x&&!String(x).includes('YOUR_'));
  if(!cfg.apiKey||!cfg.authDomain||!cfg.databaseURL||!cfg.projectId||!cfg.appId||!schoolDomain||schoolDomain.includes('your_')||!schoolDomain.includes('.'))throw Error('Firebase 설정과 학교 이메일 도메인을 확인해야 합니다.');
  for(const n of ['firebase-app-compat','firebase-auth-compat','firebase-database-compat'])await src(`https://www.gstatic.com/firebasejs/10.14.1/${n}.js`);
  fb=global.firebase;fb.initializeApp({apiKey:cfg.apiKey,authDomain:cfg.authDomain,databaseURL:cfg.databaseURL,projectId:cfg.projectId,appId:cfg.appId});db=fb.database();auth=fb.auth();
  await auth.setPersistence(fb.auth.Auth.Persistence.LOCAL);
  await new Promise(resolve=>{const off=auth.onAuthStateChanged(u=>{syncAuth(u);resolve();off();},e=>{initError=e.message;resolve();});});
  auth.onAuthStateChanged(syncAuth);
  if(guestActive&&auth.currentUser)await auth.signOut();
 }catch(e){initError=String(e.message||e);console.error('NEPAL Firebase 초기화 오류:',e)}
 finally{initDone=true;refreshButtons()}
}
const initReady=init();
function refreshButtons(){
 const sessionVisible=sessionActive;
 const signedIn=!guestActive&&sessionVisible&&!!((team&&user)||(!team&&requireTeacher(user)));
 const editorActive=sessionVisible&&!!(team||guestActive||requireTeacher(user));
 const save=$('np-save'),boardButton=$('np-board-button'),changeButton=$('np-change');
 if(save){const hasWorkspace=!!(team||requireTeacher(user)&&designReady);save.disabled=guestActive||!hasWorkspace;save.style.display=sessionVisible&&hasWorkspace?'':'none';save.textContent='💾 저장'}
 if(boardButton){boardButton.disabled=guestActive;boardButton.style.display=signedIn?'':'none'}
 if(changeButton){changeButton.style.display=(signedIn||guestActive&&sessionVisible)?'':'none';changeButton.textContent=guestActive?'🌐 게스트 모드 종료':'🚪 로그아웃'}
 const floatingBoard=$('nepal-class-board'),floatingLogout=$('nepal-class-switch'),trigger=$('nepal-entry-trigger');
 if(floatingBoard)floatingBoard.style.display=signedIn?'':'none';
 if(floatingLogout){floatingLogout.style.display=(signedIn||guestActive&&sessionVisible)?'':'none';floatingLogout.textContent=guestActive?'🌐 게스트 모드 종료':'🚪 로그아웃'}
 if(trigger)trigger.style.display=(editorActive&&!board.classList.contains('show'))?'':'none';
 const boardLogout=$('np-board-signout');if(boardLogout)boardLogout.style.display=user?'':'none';
 const status=$('np-save-label');if(status&&!editorActive)status.textContent='';
}
async function googlePopup(kind){
 await initReady;
 if(!auth)throw Error('Firebase 연결 확인 필요: '+initError);
 const provider=new fb.auth.GoogleAuthProvider();
 if(kind==='student'&&schoolDomain)provider.setCustomParameters({hd:schoolDomain,prompt:'select_account'});
 else provider.setCustomParameters({prompt:'select_account'});
 const result=await auth.signInWithPopup(provider);
 syncAuth(result.user);
 if(kind==='student'&&!requireStudent(result.user))throw Error('학생은 학교 Google 계정(@'+schoolDomain+')으로 로그인해야 합니다.');
 if(kind==='teacher'&&!requireTeacher(result.user))throw Error('교사 계정은 등록된 '+TEACHER_EMAIL+' 하나만 사용할 수 있습니다. 다른 계정을 선택해 주세요.');
 return result.user;
}
async function studentSubmit(){
 if(loginBusy)return;
 await initReady;
 const c=Number($('np-class').value),g=Number($('np-group').value),name=cleanName($('np-name').value);
 if(!valid(c,g)||!name){note('반, 조, 이름을 모두 입력해 주세요.');return}
 if(!auth){note('Firebase 연결 확인 필요: '+(initError||'초기화 중입니다.'));return}
 loginBusy=true;refreshButtons();$('np-enter').disabled=true;
 note('Google 계정을 선택해 주세요.');
 try{await googlePopup('student');await joinTeam()}
 catch(e){note('입장 실패: '+String(e.message||e))}
 finally{loginBusy=false;$('np-enter').disabled=false;refreshButtons()}
}
async function teacherSubmit(){
 if(loginBusy)return;
 requestedRole='teacher';loginBusy=true;
 try{await googlePopup('teacher');await enterTeacher()}
 catch(e){requestedRole='student';console.warn('NEPAL 교사 로그인:',e);landing();gate.dataset.page='landing';
  // Show errors briefly on landing only when authentication fails.
  const msg='교사 로그인 실패: '+String(e.message||e);const el=document.getElementById('np-landing-error');if(el)el.textContent=msg;const homeError=$('np-home-error');if(homeError)homeError.textContent=msg;
 }
 finally{loginBusy=false;refreshButtons()}
}
async function signout(){
 // Explicit logout must never discard an unsaved teacher or student project.
 if(callbacks.isBusy?.()){note('검사가 끝난 뒤 로그아웃할 수 있습니다.');return false}
 if(designReady&&(team||requireTeacher(user))){
  try{
   const designOK=await callbacks.flushDesign?.(false);
   if(designOK===false){note('⚠ 센서 설계 저장이 확인되지 않아 로그아웃을 취소했습니다.');return false}
  }catch(e){note('⚠ 센서 설계 저장 오류로 로그아웃하지 않았습니다: '+String(e.message||e));return false}
 }
 if(readyToSave&&(team||requireTeacher(user))){
  if(!await saveNow('exit')){
   note('⚠ 엔트리 블록 온라인 저장에 실패했습니다. 로그아웃하지 않고 작업을 유지합니다.');
   return false;
  }
 }
 forgetTeacherSession();forgetStudentSession();
 designReady=false;
 if(guestActive)endGuest();
 if(team){readyToSave=false;await leaveTeam();}
 clearBoard();board.classList.remove('show');
 if(auth)await auth.signOut();
 callbacks.restoreDesign?.({version:1,sensors:[],alarmMode:'OR',minCount:2});
 user=null;authRole=null;role=null;team=null;projectToRestore=null;readyToSave=false;
 callbacks.resetEditor?.();callbacks.closeEditor?.();callbacks.restoreProgress?.(0);
 landing();refreshButtons();
 return true;
}
function identify(members){if(!user)return null;for(const key of memberKeys)if(members?.[key]?.uid===user.uid)return key;return null}
function memberNames(members,c,g){return memberKeys.slice(0,groupCapacity(c,g)).map((slot,i)=>members?.[slot]?.displayName||`${i+1}번 조원 미등록`).join(' · ')}
async function joinTeam(){await initReady;if(!user||!db||!requireStudent(user)){note('먼저 학생 학교 Google 계정으로 로그인해 주세요. 교사 계정으로는 조에 가입할 수 없습니다.');return}
 const c=Number($('np-class').value),g=Number($('np-group').value),displayName=cleanName($('np-name').value);
 if(!valid(c,g)||!displayName){note('반·조와 본인의 이름을 입력해 주세요.');return}
 $('np-enter').disabled=true;note('조원 계정과 저장된 프로젝트를 확인하고 있습니다…');
 try{
  // Check real per-class group count before allowing a new membership.
  const available=await readGroupCount(c);
  if(g>available)throw Error(c+'반에 '+g+'조가 아직 만들어지지 않았습니다. 교사에게 조 추가를 요청하세요.');
  if(team&&(team.c!==c||team.g!==g))await leaveTeam();
  const root=teamPath(c,g);const memRef=db.ref(root+'/members');let members=(await memRef.once('value')).val()||{};
  let slot=identify(members);
  if(!slot){slot=memberKeys.slice(0,groupCapacity(c,g)).find(key=>!members[key])||null;
    if(!slot)throw Error('이 조에는 정원 '+groupCapacity(c,g)+'명의 계정이 등록되어 있습니다. 반·조를 확인해 주세요.');
    // Atomic claim of exactly one immutable slot. Security rules check uid and Google domain.
    const own=db.ref(root+'/members/'+slot);
    const tx=await own.transaction(old=>old===null?{uid:user.uid,displayName,joinedAt:fb.database.ServerValue.TIMESTAMP}:undefined,()=>{},false);
    if(!tx.committed){members=(await memRef.once('value')).val()||{};slot=identify(members);if(!slot)throw Error('방금 다른 학생이 이 자리에 등록했습니다. 조원 등록 상태를 새로 확인해 주세요.');}
  }else if(members[slot].displayName!==displayName){
    // Updating your own display name is permitted, but not the immutable identity.
    await db.ref(root+'/members/'+slot+'/displayName').set(displayName);
  }
  members=(await memRef.once('value')).val()||{};
  if(identify(members)!==slot)throw Error('계정 등록 확인에 실패했습니다.');
  team={c,g};role=slot;readyToSave=false;designReady=false;editorLockHeld=false;progress=0;progressSaved=0;progressRetry=null;lastSaved='';
  const [progressSnap,progressV3Snap,codeSnap,designSnap]=await Promise.all([
   db.ref(root+'/progress').once('value'),db.ref(root+'/progressV3').once('value'),
   db.ref(workPath(c,g)+'/code').once('value'),db.ref(workPath(c,g)+'/design').once('value')
  ]);
  // Preserve old six-stage progress without skipping the newly redesigned
  // stages 5/6/FINAL. Use a new key so legacy progress is never overwritten.
  const previousProgress=progressSnap.val()||{};
  const currentProgress=progressV3Snap.val();
  const oldCompleted=Number(previousProgress.completed)||0;
  const oldAligned=Number(previousProgress.updatedAt)>=PROGRESS_FALLBACK_SINCE?oldCompleted:previousProgress.schemaVersion===2?oldCompleted:(oldCompleted>=2?oldCompleted+1:oldCompleted);
  progress=Math.max(0,Math.min(missionTotal,currentProgress?
    Math.max(Number(currentProgress.completed)||0,Math.min(4,oldAligned)):Math.min(4,oldAligned)));
  progressSaved=progress;progressRetry=null;
  const cloudCode=codeSnap.val();const local=localRestore();
  try{projectToRestore=latestProject(cloudCode,local)}catch(e){throw Error('온라인 엔트리 코드 형식 오류: '+e.message)}
  callbacks.resetEditor?.();callbacks.restoreProgress?.(progress);
  // Restore the complete sensor layout BEFORE enabling design autosave.
  // Without this gate an empty default canvas could overwrite a group's cloud data.
  const cloudDesign=designSnap.val();
  let previousDesign=null;
  if(cloudDesign?.payload){
    try{previousDesign=JSON.parse(cloudDesign.payload)}
    catch(e){throw Error('저장된 센서 설계 파일을 읽을 수 없습니다. 기존 설계 보호를 위해 입장을 중단합니다: '+e.message)}
  }
  const restored=callbacks.restoreDesign?.(previousDesign||{version:1,sensors:[],alarmMode:'OR',minCount:2});
  if(restored===false)throw Error('센서 설계를 복원하지 못했습니다. 저장된 정보를 보호하기 위해 자동 저장을 시작하지 않습니다.');
  designReady=true;
  gate.classList.remove('show');callbacks.enterSimulator?.();
  setTimeout(retryPendingProgress,1500);
  const remembered=readStudentSession();
  rememberStudentSession(remembered?.uid===user.uid&&remembered?.c===c&&remembered?.g===g&&
    remembered?.slot===slot&&remembered?.editor===true);
  note('✓ '+c+'반 '+g+'조 · '+memberNames(members,c,g)+' · 네팔 홍수 시뮬레이션에 입장했습니다.');
 }catch(e){designReady=false;note('입장 실패: '+String(e.message||e));if(editorLockHeld){await releaseLock().catch(()=>{});team=null;readyToSave=false}}
 finally{refreshButtons()}
}
async function openEditor(){
 if(guestActive){note('🌐 게스트 엔트리 편집 · 미션과 블록은 저장되지 않습니다.');callbacks.launchEditor?.();return}
 // Teachers use their own private Firebase workspace, never a student's team.
 if(requireTeacher(user)&&sessionActive){
   if(!designReady){note('교사 저장 데이터를 아직 불러오지 못했습니다.');return;}
   if(readyToSave&&callbacks.isReady?.()){callbacks.launchEditor?.();return;}
   try{
     const cloud=(await db.ref(teacherPath()+'/code').once('value')).val();
     projectToRestore=latestProject(cloud,localRestore());
     readyToSave=false;editorLockHeld=false;
     callbacks.resetEditor?.();callbacks.restoreProgress?.(progress);
     callbacks.launchEditor?.();
     note('🧑‍🏫 교사 모드');
   }catch(e){note('교사 코드 복원 오류: '+String(e.message||e))}
   return;
 }
 if(!team||!user){showGate();return}
 if(editorLockHeld){callbacks.launchEditor?.();return}
 const c=team.c,g=team.g;note('조별 편집 권한을 확인하는 중…');
 try{
  const lock=await db.ref(workPath(c,g)+'/editorLock').transaction(old=>{
   if(old&&old.uid!==user.uid&&Number(old.updatedAt)>Date.now()-LOCK_MS)return;
   return {uid:user.uid,updatedAt:fb.database.ServerValue.TIMESTAMP};
  },()=>{},false);
  if(!lock.committed)throw Error('같은 조의 다른 조원이 엔트리를 편집 중입니다. 2분 이상 사용하지 않거나 조원이 편집기를 닫으면 다시 시도할 수 있습니다.');
  editorLockHeld=true;lockedTeamPath=workPath(c,g);
  const [codeSnap,progressSnap,oldProgressSnap]=await Promise.all([
    db.ref(workPath(c,g)+'/code').once('value'),
    db.ref(teamPath(c,g)+'/progressV3').once('value'),
    db.ref(teamPath(c,g)+'/progress').once('value')
  ]);
  const code=codeSnap.val();
  // Returning from the simulator must not destroy the live workspace that
  // was already safely uploaded, unless another teammate changed the code.
  const reuseEditor=callbacks.isReady?.()&&readyToSave===false&&
    typeof code?.payload==='string'&&lastSaved===code.payload;
  const local=localRestore();
  if(!reuseEditor)projectToRestore=latestProject(code,local);
  const current=Number(progressSnap.val()?.completed)||0;
  const earlier=oldProgressSnap.val(),oldCompleted=Number(earlier?.completed)||0;
  const aligned=Number(earlier?.updatedAt)>=PROGRESS_FALLBACK_SINCE?oldCompleted:
    earlier?.schemaVersion===2?oldCompleted:(oldCompleted>=2?oldCompleted+1:oldCompleted);
  progress=Math.max(progress,Math.min(missionTotal,Math.max(current,Math.min(4,aligned))));
  progressSaved=Math.max(progressSaved,current,Math.min(4,aligned));
  if(reuseEditor){
   readyToSave=true;callbacks.restoreProgress?.(progress);callbacks.launchEditor?.();startLockRefresh();
   note('✓ 이전 엔트리 블록을 그대로 이어서 편집합니다.');
  }else{
   readyToSave=false;callbacks.resetEditor?.();callbacks.restoreProgress?.(progress);callbacks.launchEditor?.();startLockRefresh();
  }
 }catch(e){note('엔트리 입장 실패: '+String(e.message||e));if(editorLockHeld)await releaseLock().catch(()=>{});}
}
// Leaving is a save checkpoint: protect local mission achievements and design.
async function closeEditing(){
 if(guestActive){callbacks.closeEditor?.();return true}
 if(callbacks.isBusy?.()){note('검사가 끝난 뒤 시뮬레이션으로 돌아갈 수 있습니다.');return false}
 if(!user||!db){note('Google 로그인 상태와 연결을 확인하고 다시 시도하세요.');return false}
 const teacherSession=requireTeacher(user)&&sessionActive,studentSession=!!team&&requireStudent(user);
 if(!teacherSession&&!studentSession)return false;
 const n=Math.max(progress,Math.min(missionTotal,Number(callbacks.getMissionProgress?.())||0));
 note('☁️ 미션 진행도·센서 설계·엔트리 코드를 저장하는 중…');
 const progressOK=n===0||await saveProgress(n);
 let designOK=true;
 try{designOK=designReady?(await callbacks.flushDesign?.(false))!==false:true}
 catch(e){designOK=false;note('⚠ 센서 설계 저장 오류: '+String(e.message||e))}
 if(!readyToSave&&!restoring){
  if(!teacherSession)await releaseLock().catch(e=>note('잠금 해제 실패: '+String(e.message||e)));
  callbacks.closeEditor?.();
  note('⚠ 복원되지 않은 블록은 온라인에 덮어쓰지 않았습니다. 개발자 모드에 다시 들어와 복원해 주세요.');
  return true;
 }
 const codeOK=readyToSave && await saveNow('exit');
 if(!progressOK||!designOK||!codeOK){
  note('⚠ '+[!progressOK?'미션 진행도':null,!designOK?'센서 설계':null,!codeOK?'엔트리 코드':null].filter(Boolean).join('·')+' 저장 실패. 편집기를 그대로 유지했습니다. 다시 시도하세요.');
  return false;
 }
 if(!teacherSession){readyToSave=false;await releaseLock().catch(e=>note('편집 잠금 해제 실패: '+String(e.message||e)))}
 callbacks.closeEditor?.();
 note('✓ 미션 진행도·센서 설계·엔트리 코드 저장 후 시뮬레이션 복귀');
 return true;
}
// Guest is a deliberately in-memory, unauthenticated experience. Never claim a team,
// access a classroom database, save progress/grades/projects, or create a local backup.
async function enterGuest(){
 try{
  forgetStudentSession();forgetTeacherSession();
  if(team)await leaveTeam();
  if(auth?.currentUser)await auth.signOut();
  designReady=false;
  guestActive=true;team=null;role=null;projectToRestore=null;readyToSave=false;
  callbacks.restoreDesign?.({version:1,sensors:[],alarmMode:'OR',minCount:2});
  editorLockHeld=false;progress=0;lastSaved='';
  board.classList.remove('show');clearBoard();
  callbacks.resetEditor?.();callbacks.restoreProgress?.(0);
  // Do not display a previous student's assessment result in a new guest session.
  if(typeof global.resetRank==='function')global.resetRank();
  gate.classList.remove('show');callbacks.enterSimulator?.();refreshButtons();
  note('🌐 게스트 체험 중 · 홍수 점수·등급 및 엔트리 미션/블록은 저장되지 않습니다.');
  refreshButtons();
 }catch(e){guestActive=false;gate.classList.add('show');note('게스트 시작 실패: '+String(e.message||e));refreshButtons()}
}
function endGuest(){
 if(!guestActive)return;
 designReady=false;
 guestActive=false;readyToSave=false;projectToRestore=null;progress=0;lastSaved='';
 callbacks.resetEditor?.();callbacks.closeEditor?.();callbacks.restoreProgress?.(0);
 // Guest work is in-memory only: do not leak previous guest sensors into a new login.
 callbacks.restoreDesign?.({version:1,sensors:[],alarmMode:'OR',minCount:2});
 if(typeof global.resetRank==='function')global.resetRank();
 note('게스트 체험을 종료했습니다. 진행 기록과 코드가 저장되지 않았습니다.');
 sessionActive=false;refreshButtons();
}
async function enterTeacher(){
 if(!user||!requireTeacher(user)){note('등록된 교사 Google 계정으로 로그인해 주세요.');return}
 designReady=false;readyToSave=false;projectToRestore=null;progress=0;lastSaved='';
 const path=teacherPath();
 try{
  const [designSnap,codeSnap,progressSnap,floodSnap,m5Snap,finalSnap]=await Promise.all([
   db.ref(path+'/design').once('value'),db.ref(path+'/code').once('value'),
   db.ref(path+'/progressV3').once('value'),db.ref(path+'/floodBest').once('value'),
   db.ref(path+'/mission5NoListBest').once('value'),db.ref(path+'/finalBest').once('value')
  ]);
  teacherScores={floodBest:floodSnap.val(),mission5NoListBest:m5Snap.val(),finalBest:finalSnap.val()};
  const raw=designSnap.val();
  let previousDesign={version:1,sensors:[],alarmMode:'OR',minCount:2};
  if(raw?.payload)previousDesign=JSON.parse(raw.payload);
  projectToRestore=latestProject(codeSnap.val(),localRestore());
  const restored=callbacks.restoreDesign?.(previousDesign);
  if(restored===false)throw Error('교사 센서 설계 복원 실패');
  progress=Math.max(0,Math.min(missionTotal,Number(progressSnap.val()?.completed)||0));
  progressSaved=progress;progressRetry=null;
  callbacks.resetEditor?.();callbacks.restoreProgress?.(progress);
  designReady=true;enterTeacherSimulator();
  setTimeout(retryPendingProgress,1500);
  const old=readTeacherSession();
  rememberTeacherSession(old?.uid===user.uid&&old?.editor===true);
  note('🧑‍🏫 교사 모드 · 저장 기록 복원 완료');
 }catch(e){
  designReady=false;note('⚠ 교사 기록을 불러오지 못했습니다. 기존 기록 보호를 위해 저장을 중지합니다: '+String(e.message||e));
  throw e;
 }
}
function enterTeacherSimulator(){if(!user||!requireTeacher(user))return;gate.classList.remove('show');board.classList.remove('show');callbacks.enterSimulator?.();refreshButtons()}
function startLockRefresh(){if(lockRefresh)clearInterval(lockRefresh);
 lockRefresh=setInterval(()=>{if(!team||!editorLockHeld||!user)return;db.ref(lockedTeamPath+'/editorLock').transaction(old=>old?.uid===user.uid?{uid:user.uid,updatedAt:fb.database.ServerValue.TIMESTAMP}:undefined,()=>{},false).then(t=>{if(!t.committed){editorLockHeld=false;readyToSave=false;note('⚠ 다른 조원에게 편집 권한이 넘어갔습니다. 저장을 중단했습니다.')}}).catch(e=>note('⚠ 편집 잠금 유지 실패: '+e.message))},35000);
}
async function releaseLock(){if(lockRefresh){clearInterval(lockRefresh);lockRefresh=null}if(!editorLockHeld||!user||!lockedTeamPath)return;
 const ref=db.ref(lockedTeamPath+'/editorLock');await ref.transaction(old=>old?.uid===user.uid?null:undefined,()=>{},false);editorLockHeld=false;lockedTeamPath='';
}
async function leaveTeam(){if(!team)return;
 if(designReady)await callbacks.flushDesign?.();
 designReady=false;
 if(readyToSave)await saveNow('exit');
 readyToSave=false;callbacks.resetEditor?.();callbacks.closeEditor?.();await releaseLock().catch(e=>note('잠금 해제 실패: '+e.message));team=null;role=null;projectToRestore=null;progress=0;lastSaved='';callbacks.restoreProgress?.(0);
}
async function switchTeam(){await signout()}
function receiveFrameMessage(d){if(d.type==='ENTRY_PROJECT_EXPORTED'&&exportPending?.token===d.token){const x=exportPending;exportPending=null;clearTimeout(x.timeout);x.resolve(d.project)}
 if(d.type==='ENTRY_PROJECT_EXPORT_ERROR'&&exportPending?.token===d.token){const x=exportPending;exportPending=null;clearTimeout(x.timeout);x.reject(Error(d.message||'내보내기 실패'))}
 if(d.type==='ENTRY_PROJECT_IMPORTED'&&importPending?.token===d.token){const x=importPending;importPending=null;clearTimeout(x.timeout);d.ok?x.resolve(d):x.reject(Error(d.message||'코드 불러오기 실패'))}
}
function rpc(action,project){return new Promise((resolve,reject)=>{
 const token=++rpcId,timeout=setTimeout(()=>{if(action==='export')exportPending=null;else importPending=null;reject(Error('엔트리 '+action+' 시간 초과'))},19000);
 const p={resolve,reject,token,timeout};if(action==='export')exportPending=p;else importPending=p;
 callbacks.iframe.contentWindow?.postMessage(action==='export'?{type:'NEPAL_EXPORT_PROJECT',token}:{type:'NEPAL_IMPORT_PROJECT',token,project},location.origin);
})}
async function onEntryReady(){if(guestActive)return true;if(requireTeacher(user)){if(!designReady)return false;}else if(!team||!editorLockHeld)return false;readyToSave=false;restoring=true;
 try{if(projectToRestore?.objects&&Array.isArray(projectToRestore.objects)){
    note('저장된 엔트리 블록을 복원하는 중…');
    const imported=await rpc('import',projectToRestore);
    const desiredBytes=projectScriptBytes(projectToRestore);
    if(desiredBytes>20 && Number(imported?.scriptBytes||0)<Math.max(20,desiredBytes*.55))
      throw Error('저장된 코딩 블록의 복원이 확인되지 않았습니다. 원본 보호를 위해 온라인 자동 저장을 중단합니다.');
    note('✓ 엔트리 블록 복원 확인 · 화면에 '+Number(imported?.liveBlocks||0)+'개 블록 · 코드 '+desiredBytes+'자');
  }
   else note(requireTeacher(user)?'교사 모드 · 새 엔트리 작업을 시작합니다.':'새 조의 엔트리 작업을 시작합니다.');readyToSave=true;
 }catch(e){note('⚠ 블록 복원 실패: '+e.message+' · 기존 파일 보호를 위해 자동 저장을 중지합니다.');}
 finally{
  restoring=false;
  if(readyToSave){
   const key=backupKey();
   if(key)callbacks.iframe.contentWindow?.postMessage({type:'NEPAL_DRAFT_BACKUP_KEY',key},location.origin);
  }
 }
 return readyToSave;
}
async function saveNow(reason='manual'){
 if(guestActive){if(reason==='manual')note('🌐 게스트 모드는 저장하지 않습니다. 학교 계정으로 로그인하면 조별 저장을 사용할 수 있습니다.');return false}
 const teacherSave=requireTeacher(user)&&sessionActive;
 if(!user||!readyToSave||!db||(!teacherSave&&(!team||!editorLockHeld))){if(reason==='manual')note('아직 편집 또는 저장 준비가 되지 않았습니다.');return false}
 if(saveBusy){
  if(reason==='auto'){queued=true;return true;}
  for(let i=0;i<48&&saveBusy;i++)await new Promise(resolve=>setTimeout(resolve,125));
  if(saveBusy){note('⚠ 기존 저장 작업이 아직 끝나지 않았습니다. 다시 저장해 주세요.');return false}
 }
 if(!callbacks.isReady?.()){note('⚠ 엔트리 블록 불러오기가 끝나지 않았습니다.');return false}
 saveBusy=true;
 try{const project=await rpc('export');if(!project||!Array.isArray(project.objects))throw Error('엔트리 프로젝트 구조 오류');
  const encoded=JSON.stringify(project);if(encoded.length>MAX_PROJECT_SIZE)throw Error('코드 용량이 1.25MB를 넘었습니다. 이미지/소리를 줄여 주세요.');
  const newScriptBytes=projectScriptBytes(project);
  if(reason==='auto'&&lastSaved===encoded)return true;
  const path=teacherSave?teacherPath()+'/code':workPath(team.c,team.g)+'/code';
  if(!teacherSave){
   const snap=await db.ref(workPath(team.c,team.g)+'/editorLock').once('value');
   if(snap.val()?.uid!==user.uid)throw Error('이 조의 편집 권한을 잃었습니다.');
  }
  const codeRef=db.ref(path);
  const previous=(await codeRef.once('value')).val();
  let oldProject=null;
  if(previous?.payload){
   oldProject=JSON.parse(previous.payload);
   if(!Array.isArray(oldProject?.objects))throw Error('서버 기존 코드 형식 오류 · 원본 보호를 위해 저장하지 않습니다.');
  }
  // Check the ACTUAL cloud payload, not only the previously selected draft.
  // An import failure must not silently replace earlier student work.
  const referenceBytes=Math.max(projectScriptBytes(projectToRestore),
    projectScriptBytes(localRestore()?.project),projectScriptBytes(localRecovery()?.project),projectScriptBytes(oldProject));
  if(isSuspiciousLoss(referenceBytes,newScriptBytes)){
   if(reason==='auto')throw Error('저장 블록이 크게 감소하여 자동 덮어쓰기를 차단했습니다.');
   if(!window.confirm('기존 코드의 절반 이상이 없어졌습니다.\\n직접 블록을 대량 삭제했나요?\\n[취소]를 눌러 이전 블록을 보호하세요.'))
    throw Error('블록이 급감한 저장을 취소했습니다.');
  }
  if(newScriptBytes===0&&referenceBytes>0)
   throw Error('빈 코드로 기존 프로젝트를 덮어쓰지 않도록 저장을 차단했습니다.');
  if(oldProject && projectScriptBytes(oldProject)>projectScriptBytes(localRestore()?.project))
   localBackUp(oldProject);
  localBackUp(project);
  await codeRef.set({payload:encoded,updatedAt:fb.database.ServerValue.TIMESTAMP,updatedBy:user.uid});
  if(reason!=='auto'){
    const readback=(await codeRef.once('value')).val();
    if(readback?.payload!==encoded||readback?.updatedBy!==user.uid)
      throw Error('서버에 저장된 엔트리 코드가 현재 블록과 일치하지 않습니다.');
  }
  lastSaved=encoded;
  projectToRestore=project;
  note('✓ '+(teacherSave?'교사':'조별')+' 블록 온라인 저장 확인 · 코드 약 '+newScriptBytes+'자 · '+new Date().toLocaleTimeString('ko-KR'));
  return true;
 }catch(e){note('⚠ 온라인 저장 실패: '+String(e.message||e)+' · 현재 브라우저에 보조 저장이 있다면 같은 계정으로 다시 확인하세요.');return false}
 finally{saveBusy=false;if(queued){queued=false;setTimeout(()=>saveNow('auto'),500)}}
}
// Record progress in Firebase and verify the server committed it.
// Progress belongs to the registered group and does not require the single
// EntryJS code-editor lock (a different teammate may currently hold it).
// On older published Firebase rules, the first four steps also mirror
// to the existing /progress key as a backwards-compatible stopgap.
async function saveProgress(n){
 const teacherSave=requireTeacher(user)&&sessionActive;
 if(guestActive||!user||!db||(!teacherSave&&(!team||!requireStudent(user)))){
  if(!guestActive&&user)note('⚠ 미션 통과 기록을 저장하지 못했습니다: 학교 계정·조원 등록·연결 상태를 확인하세요.');
  return false;
 }
 const value=Math.max(progress,Math.min(missionTotal,Math.max(0,Number(n)||0)));
 progress=value;
 const path=teacherSave?teacherPath():teamPath(team.c,team.g);
 let newOK=false,legacyOK=false,saveError=null;
 try{
  const tx=await db.ref(path+'/progressV3').transaction(old=>{
   // Rechecking the same milestone must not move the first-reached timestamp.
   const completed=Number(old?.completed)||0;
   if(completed>=value)return;
   return {completed:value,schemaVersion:3,updatedAt:fb.database.ServerValue.TIMESTAMP};
  },()=>{},false);
  newOK=!!tx.committed&&Number(tx.snapshot?.val()?.completed)>=value;
  if(!newOK)saveError=new Error('서버에서 진행도 저장을 확인할 수 없습니다.');
 }catch(error){saveError=error;}
 // A concurrent login may already have saved the same or higher progress.
 // Verify on the server before reporting a failure to the learner.
 if(!newOK){
  try{const stored=(await db.ref(path+'/progressV3').once('value')).val();newOK=Number(stored?.completed)>=value}
  catch(error){if(!saveError)saveError=error}
 }
 // Existing /progress Firebase rules allow 0..4 but not a fifth stage.
 if(!teacherSave&&value>=1&&value<=4){
  try{
   const tx=await db.ref(path+'/progress').transaction(old=>{
    if(old&&Number(old.completed)>=value)return; // already reached this stage
    return {completed:value,updatedAt:fb.database.ServerValue.TIMESTAMP};
   },()=>{},false);
   legacyOK=!!tx.committed||Number(tx.snapshot?.val()?.completed)>=value;
  }catch(error){if(!saveError)saveError=error;}
 }
 if(newOK||legacyOK){
  progressSaved=Math.max(progressSaved,value);
  progressRetry=null;lastProgressSaveError='';clearQueuedProgress(value);
  note('✓ '+(value===7?'FINAL':value===5?'SEMI FINAL':'미션 '+value)+' · 현황판 진행도 저장 완료'+(newOK?'':' (기존 경로)'));
  callbacks.onProgressSaved?.(value);
  return true;
 }
 progressRetry=value;queueProgress(value);
 lastProgressSaveError=progressErrorText(saveError);
 console.warn('[NEPAL 진행도 저장 실패]',{stage:value,reason:String(saveError?.code||saveError?.message||saveError)});
 note('⚠ 현황판 저장 대기 · '+lastProgressSaveError);
 return false;
}
/** Save four editable sensors and alarm design for student teams or teacher's private workspace. */
async function saveSimulatorDesign(design,reason='auto'){
 const teacherSave=requireTeacher(user)&&sessionActive;
 if(guestActive||!designReady||!user||!db||(!teacherSave&&(!team||!requireStudent(user))))return false;
 if(!design || design.version!==1 || !Array.isArray(design.sensors) || design.sensors.length>4)return false;
 const encoded=JSON.stringify(design);
 if(encoded.length>12000)throw Error('센서 설계 데이터가 너무 큽니다.');
 const uid=user.uid;const path=teacherSave?teacherPath()+'/design':workPath(team.c,team.g)+'/design';
 try{
  // Shared per-group Firebase path: other groups cannot read or write it.
  await db.ref(path).set({version:1,payload:encoded,updatedBy:uid,updatedAt:fb.database.ServerValue.TIMESTAMP});
  designSavedAt=Date.now();
  if(reason==='manual')note('✓ '+(teacherSave?'교사 계정':team.c+'반 '+team.g+'조')+' 센서 배치와 위험 기준 온라인 저장 완료');
  return true;
 }catch(e){
  note('⚠ 센서 설계 저장 실패: '+String(e.message||e));
  return false;
 }
}
async function recordStageBest(key,label,result){
 const teacherSave=requireTeacher(user)&&sessionActive;
 if(guestActive||!user||!db||(!teacherSave&&(!team||!requireStudent(user))))return false;
 const score=Number(result?.score),rank=String(result?.rank||''),n=Number(result?.n);
 if(!Number.isFinite(score)||score<0||score>100||!['LEGEND','S','A','B','C','F'].includes(rank)||!Number.isInteger(n)||n<1||n>4)return false;
 const ref=db.ref((teacherSave?teacherPath():teamPath(team.c,team.g))+'/'+key);
 try{
  const tx=await ref.transaction(old=>{
   if(old && Number(old.score)>=score)return;
   return {score,rank,n,updatedBy:user.uid,updatedAt:fb.database.ServerValue.TIMESTAMP};
  },()=>{},false);
  if(teacherSave&&tx.committed)teacherScores[key]={score,rank,n};
  note(tx.committed?'🏆 '+label+' 최고 점수 저장: '+score.toFixed(1)+'점':'📊 '+label+' 기존 최고 점수 유지');
  return tx.committed;
 }catch(e){note('⚠ '+label+' 점수 저장 오류: '+e.message);return false}
}
async function recordMission5Result(result){
 return recordStageBest('mission5NoListBest','SEMI FINAL',result);
}
async function recordFinalResult(result){
 return recordStageBest('finalBest','FINAL 미션',result);
}
async function recordFloodResult(result){
 if(guestActive)return;const teacherSave=requireTeacher(user)&&sessionActive;if(!user||!db||(!teacherSave&&(!team||!requireStudent(user))))return;
 const score=Number(result?.score),rank=String(result?.rank||'').trim().toUpperCase();
 if(!Number.isFinite(score)||score<0||score>100||!['LEGEND','S','A','B','C','F'].includes(rank))return;
 const ref=db.ref(teacherSave?teacherPath()+'/floodBest':teamPath(team.c,team.g)+'/floodBest');
 try{
  const tx=await ref.transaction(old=>{
   if(old&&Number(old.score)>=score)return;
   return {score,rank,updatedBy:user.uid,updatedAt:fb.database.ServerValue.TIMESTAMP};
  },()=>{},false);
  if(teacherSave&&tx.committed)teacherScores.floodBest={score,rank};
  note(tx.committed?'🏆 네팔 홍수 형성평가 최고 성적 저장: '+rank+' · '+score+'점':'📊 현재 최고 성적 '+(tx.snapshot.val()?.score??score)+'점 유지');
 }catch(e){note('⚠ 네팔 홍수 점수 저장 오류: '+e.message)}
}
let boardFromGate=true;
function showBoard(fromGate){
 $('np-teacher-admin').hidden=!requireTeacher(user);if(guestActive){note('게스트 모드에서는 학급 현황판을 이용할 수 없습니다.');return}if(!user||!db){note('먼저 학교 계정으로 로그인하세요.');landing();return}
 boardFromGate=fromGate||gate.classList.contains('show');
 const previous=readStudentSession();
 const ownClass=team?.c||(previous?.uid===user?.uid?Number(previous.c):null);
 $('np-board-class').value=String(ownClass||Number($('np-class').value)||1);
 gate.classList.remove('show');board.classList.add('show');loadBoard();refreshButtons()}
function displayRank97(score,rank){
 if(score!==null&&Number(score)>=97)return 'LEGEND';
 if(String(rank||'').toUpperCase()==='LEGEND')return Number(score)>=90?'S':Number(score)>=80?'A':Number(score)>=65?'B':Number(score)>=50?'C':'F';
 return String(rank||'미평가');
}
function boardCards(data,c){
 const entries=[];
 const scoreOf=x=>x&&Number.isFinite(Number(x.score))?Number(x.score):null;
 for(let g=1;g<=knownGroupCount(c);g++){
  const d=data?.['g'+g]||{},mem=d.members||{};
  const rawProgress=Number(d.progress?.completed)||0;
  const oldAligned=Number(d.progress?.updatedAt)>=PROGRESS_FALLBACK_SINCE?rawProgress:d.progress?.schemaVersion===2?rawProgress:(rawProgress>=2?rawProgress+1:rawProgress);
  const progressV3=d.progressV3;
  const v3Completed=Number(progressV3?.completed)||0;
  const legacyCompleted=Math.min(4,oldAligned);
  const value=Math.max(0,Math.min(missionTotal,Math.max(v3Completed,legacyCompleted)));
  // Milestone timestamps only count if they belong to the CURRENT stage.
  // The legacy field may preserve an earlier reached time for stages 1-4.
  const reachedTimes=[];
  if(value>0&&v3Completed===value&&Number(progressV3?.updatedAt)>0)
   reachedTimes.push(Number(progressV3.updatedAt));
  if(value>0&&legacyCompleted===value&&Number(d.progress?.updatedAt)>0)
   reachedTimes.push(Number(d.progress.updatedAt));
  const reachedAt=reachedTimes.length?Math.min(...reachedTimes):null;
  const flood=d.floodBest||null,floodScore=scoreOf(flood);
  const mission5=d.mission5NoListBest||null,mission5Score=scoreOf(mission5);
  // Legacy key "mission5Best" held the old FINAL/100-run result.
  const final=d.finalBest||d.mission5Best||null,finalScore=scoreOf(final);
  const members=Object.values(mem).filter(x=>x?.uid);
  entries.push({g,mem,value,reachedAt,flood,floodScore,mission5,mission5Score,final,finalScore,
    hasTeam:members.length>0,mine:team?.c===c&&team?.g===g});
 }
 // An unattempted score is 0 for ranking, but still displays as '미응시' in the board.
 // FINAL is always first. SEMI FINAL is used while no group has completed mission 6.
 // Mission progress outranks formative assessment; formative scores break ties only before
 // anyone has completed any programming mission.
 // An existing group may have recorded progress even if member registrations
 // were later cleared. Its activity still qualifies for the medal.
 const participants=entries.filter(e=>e.hasTeam||e.value>0||e.finalScore!==null||
  e.mission5Score!==null||e.floodScore!==null);
 const hasMission6Plus=participants.some(e=>e.value>=6);
 const anyMissionCompleted=participants.some(e=>e.value>0);
 const ranked=participants.sort((a,b)=>{
  const finalDiff=(b.finalScore??0)-(a.finalScore??0);
  if(finalDiff!==0)return finalDiff;
  if(!hasMission6Plus){
   const semiDiff=(b.mission5Score??0)-(a.mission5Score??0);
   if(semiDiff!==0)return semiDiff;
  }
  if(a.value!==b.value)return b.value-a.value;
  if(!anyMissionCompleted){
   const floodDiff=(b.floodScore??0)-(a.floodScore??0);
   if(floodDiff!==0)return floodDiff;
  }
  if(a.value>0&&a.value===b.value){
   // Reached the same mission? The earlier timestamp wins.
   if(a.reachedAt!==null&&b.reachedAt!==null&&a.reachedAt!==b.reachedAt)
    return a.reachedAt-b.reachedAt;
   // Missing timestamps cannot be claimed to be faster than known ones.
   if(a.reachedAt===null&&b.reachedAt!==null)return 1;
   if(b.reachedAt===null&&a.reachedAt!==null)return -1;
  }
  return a.g-b.g;
 });
 // A group with only mission progress must still get the first-place medal.
 // No medal is awarded to a class with no recorded activity at all.
 const first=ranked[0];
 const gold=first&&(first.value>0||first.finalScore!==null||first.mission5Score!==null||first.floodScore!==null)?first.g:null;
 let html='';
 for(const e of entries){
  const {g,mem,value,flood,floodScore,mission5,mission5Score,final,finalScore,mine}=e;
  const medal=g===gold?'<span class="np-gold-medal" role="img" aria-label="이 반의 1위 금메달">1</span>':'';
  const membersHtml=requireTeacher(user)?
    memberKeys.slice(0,groupCapacity(c,g)).map((slot,i)=>{
      const student=mem[slot],label=student?.displayName||String(i+1)+'번 조원 미등록';
      const button=student?.uid?
        `<button type="button" class="np-delete-member" data-class="${c}" data-group="${g}" data-slot="${slot}"
          aria-label="${c}반 ${g}조 ${esc(label)} 등록 삭제">등록 삭제</button>`:'';
      return `<div class="np-member-entry"><span>${esc(label)}</span>${button}</div>`;
    }).join(''):esc(memberNames(mem,c,g));
  html+=`<article class="np-team ${mine?'mine':''}"><div class="np-teamhead"><span style="display:flex;align-items:center;gap:6px">${medal}${g}조 ${mine?'(우리 조)':''}</span><span>${value}/${missionTotal}</span></div><div class="np-members">${membersHtml}</div><div class="np-score">🌊 형성평가: ${floodScore===null?'미응시':`${esc(displayRank97(floodScore,flood.rank))} · ${floodScore}점`}</div><div class="np-score">🥈 SEMI FINAL: ${mission5Score===null?'미응시':`${esc(displayRank97(mission5Score,mission5.rank))} · ${mission5Score}점`}</div><div class="np-score">🏆 FINAL 미션: ${finalScore===null?'미응시':`${esc(displayRank97(finalScore,final.rank))} · ${finalScore}점`}</div><div class="np-track"><div style="width:${Math.round(100*value/missionTotal)}%"></div></div><div class="np-caption">${value===0?'진행 전': value===missionTotal?'FINAL 미션 완료':value===5?'SEMI FINAL 완료':`미션 ${value}까지 통과`}</div>${requireTeacher(user)?`<button type="button" class="np-reset-missions" data-class="${c}" data-group="${g}">↺ 이 조 미션 초기화</button>`:''}</article>`;
 }
 $('np-grid').innerHTML=html;
}
function clearBoard(){
 if(!boardListener)return;
 boardListener.ref.off('value',boardListener.cb);
 boardListener.settingsRef?.off('value',boardListener.settingsCb);
 boardListener=null;
}
function updateGroupCountUI(c){
 const count=knownGroupCount(c),info=$('np-group-count'),btn=$('np-add-group');
 if(info)info.textContent=c+'반: '+count+'개 조 · 최대 '+MAX_GROUP_COUNT+'개';
 if(btn){btn.disabled=count>=MAX_GROUP_COUNT;btn.textContent=count>=MAX_GROUP_COUNT?'조 추가 한도 도달':'＋ 이 반에 '+(count+1)+'조 추가';}
}
async function addGroupToClass(){
 if(!requireTeacher(user)||!sessionActive||!db)return;
 const c=Number($('np-board-class').value);
 if(!validClass(c))return;
 const current=await readGroupCount(c);
 if(current>=MAX_GROUP_COUNT){
  $('np-board-msg').textContent=c+'반은 추가 가능한 최대 조 수('+MAX_GROUP_COUNT+'조)에 도달했습니다.';
  return;
 }
 if(!confirm(c+'반에 '+(current+1)+'조를 새로 추가할까요?\\n\\n기존 1~'+current+'조는 변경되지 않고, 새 조는 2명까지 등록할 수 있습니다.'))return;
 const button=$('np-add-group');button.disabled=true;
 try{
  const ref=db.ref(`${ROOT}/c${c}/settings/groupCount`);
  const result=await ref.transaction(old=>{
   const count=normalizeGroupCount(old);
   return count<MAX_GROUP_COUNT?count+1:undefined;
  },()=>{},false);
  if(!result.committed){
   $('np-board-msg').textContent='다른 교사가 조를 추가했거나 최대 조 수에 도달했습니다. 현황판을 확인해 주세요.';
   return;
  }
  const count=normalizeGroupCount(result.snapshot.val());
  groupCounts[c]=count;
  updateGroupCountUI(c);
  $('np-board-msg').textContent='✓ '+c+'반 '+count+'조를 추가했습니다. 학생은 이 반을 선택하면 '+count+'조까지 로그인할 수 있습니다.';
  if(Number($('np-class').value)===c)refreshGroupOptions(c,$('np-group').value);
 }catch(error){
  $('np-board-msg').textContent='⚠ 조 추가 실패: '+String(error.code||error.message||error)+
   '\\nFirebase Realtime Database → 규칙에 새 조 설정 권한이 게시되어 있는지 확인하세요.';
 }finally{if(button.isConnected)button.disabled=knownGroupCount(c)>=MAX_GROUP_COUNT}
}
function loadBoard(){
 if(!user||!db)return;
 $('np-board-msg').textContent='현황을 불러오는 중…';
 const c=Number($('np-board-class').value);
 clearBoard();if(!validClass(c))return;
 let latestTeams=null;
 const render=()=>{
  if(!board.classList.contains('show')||Number($('np-board-class').value)!==c)return;
  if(latestTeams!==null)boardCards(latestTeams,c);
  updateGroupCountUI(c);
  $('np-board-info').textContent='학교 학생/등록 교사 Google 계정으로만 조회 · '+c+'반 '+knownGroupCount(c)+'개 조 · 금메달: FINAL → SEMI FINAL(미션6 전) → 미션 진행도(동점 시 먼저 도달한 조) → 형성평가(미션 전)';
 };
 const ref=db.ref(`${ROOT}/c${c}/teams`);
 const cb=snap=>{$('np-board-msg').textContent='';latestTeams=snap.val()||{};render()};
 ref.on('value',cb,error=>{
  $('np-grid').innerHTML='';
  $('np-board-msg').textContent='현황판 접근 실패: '+error.message+'\nFirebase Realtime Database 보안 규칙을 확인하세요.';
 });
 const settingsRef=db.ref(`${ROOT}/c${c}/settings/groupCount`);
 const settingsCb=snap=>{
  groupCounts[c]=normalizeGroupCount(snap.val());
  render();
 };
 settingsRef.on('value',settingsCb,error=>{
  console.warn('[NEPAL] 추가 조 설정 구독 실패:',error);
  render(); // Legacy 15-team boards must continue to work before rules publish.
 });
 boardListener={ref,cb,settingsRef,settingsCb};
 render();
}
// Teacher removes one group membership without needing to know Firebase UID.
async function deleteAdminMember(c,g,slot,button){
 if(!requireTeacher(user)||!sessionActive||!db)return;
 if(!valid(c,g)||!memberKeys.slice(0,groupCapacity(c,g)).includes(slot))return;
 const ref=db.ref(teamPath(c,g)+'/members/'+slot);
 try{
  if(button)button.disabled=true;
  const existing=(await ref.once('value')).val();
  if(!existing?.uid){$('np-board-msg').textContent='이 조원 자리는 이미 비어 있습니다.';return;}
  const name=existing.displayName||slot;
  if(!confirm(`${c}반 ${g}조 · ${name} 학생의 조원 등록을 삭제할까요?\n\n학생 Google 계정, 조별 코딩 프로젝트와 점수는 삭제되지 않습니다.`))return;
  const tx=await ref.transaction(old=>old?.uid===existing.uid?null:undefined,()=>{},false);
  $('np-board-msg').textContent=tx.committed?
    `✓ ${c}반 ${g}조 · ${name} 학생의 등록을 삭제했습니다. (코드·점수 보존)`:
    '등록 정보가 바뀌어 삭제를 중단했습니다. 목록을 다시 확인해 주세요.';
 }catch(error){
  $('np-board-msg').textContent='학생 등록 삭제 실패: '+String(error.message||error)+
    '\nFirebase 실시간 데이터베이스의 교사 삭제 권한 규칙이 게시되어 있는지 확인해 주세요.';
 }finally{if(button?.isConnected)button.disabled=false;}
}
// Reset only the group's publicly displayed programming milestones and awards.
// Keep student account registrations, formative score, private code and sensor design.
async function resetGroupMissions(c,g,button){
 if(!requireTeacher(user)||!sessionActive||!db||!valid(c,g))return;
 const label=c+'반 '+g+'조';
 if(!confirm(label+'의 미션 기록을 초기화할까요?\n\n삭제: 미션 진행도, SEMI FINAL, FINAL 점수\n보존: 학생 등록, 형성평가 점수, 엔트리 코드 블록\n\n초기화한 기록은 되돌릴 수 없습니다.'))return;
 if(!confirm(label+' 미션 초기화를 확정하시겠습니까?\n현재 편집 중인 학생은 먼저 로그아웃해야 합니다.'))return;
 if(button)button.disabled=true;
 try{
  const ref=db.ref(teamPath(c,g));
  const keys=['progress','progressV3','mission5NoListBest','finalBest','mission5Best'];
  const before=(await ref.once('value')).val()||{};
  // Only delete EXISTING nodes: deleting an absent node does not satisfy the
  // teacher's restricted data.exists() && !newData.exists() security rule.
  const changes=Object.fromEntries(keys.filter(k=>before[k]!=null).map(k=>[k,null]));
  if(!Object.keys(changes).length){
   $('np-board-msg').textContent='✓ '+label+'은 초기화할 미션 기록이 없습니다.';
   return;
  }
  await ref.update(changes);
  const snapshot=(await ref.once('value')).val()||{};
  if(keys.some(k=>snapshot[k]!=null))
   throw Error('일부 기록이 아직 남아 있습니다.');
  $('np-board-msg').textContent='✓ '+label+' 미션 진행도·SEMI FINAL·FINAL 초기화 확인. (코드·형성평가·학생 등록 보존)';
 }catch(error){
  $('np-board-msg').textContent='⚠ '+label+' 초기화 실패: '+String(error.code||error.message||error)+
   '\nFirebase Realtime Database 규칙에서 교사 전용 초기화 권한을 게시해야 합니다.';
 }finally{if(button?.isConnected)button.disabled=false}
}
function closeBoard(){board.classList.remove('show');clearBoard();if(boardFromGate&&!team){
  if(requireTeacher(user)){enterTeacherSimulator();}else{landing();}
 }refreshButtons()}
function showGate(){if(guestActive||team||requireTeacher(user)){openEditor();return}landing()}
function showLogin(){if(guestActive){endGuest();landing();return}if(team||requireTeacher(user)){signout();return}landing()}
function setup(opts){callbacks=opts;missionTotal=opts.totalMissions||4;
 const originalEnterSimulator=callbacks.enterSimulator;
 callbacks.enterSimulator=()=>{showNativeHome(true);originalEnterSimulator?.()};
 const buttons=document.createElement('div');buttons.style.cssText='display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto';
 buttons.innerHTML='<span id="np-save-label" class="np-saveinfo"></span><button id="np-save">💾 저장</button><button id="np-board-button">📊 현황판</button><button id="np-change">🚪 로그아웃</button>';
 opts.header.insertBefore(buttons,opts.header.lastElementChild);headerStatus=$('np-save-label');
 $('np-save').onclick=async()=>{
   if(guestActive){note('🌐 게스트 모드는 저장되지 않습니다.');return}
   if(!user){note('Google 계정 로그인 후 저장할 수 있습니다.');return}
   const n=Math.max(progress,Math.min(missionTotal,Number(callbacks.getMissionProgress?.())||0));
   let designOK=true;
   try{designOK=designReady?(await callbacks.flushDesign?.(true))!==false:true}
   catch(e){designOK=false;note('⚠ 센서 설계 저장 오류: '+String(e.message||e))}
   const progressOK=n===0||await saveProgress(n);
   const codeOK=readyToSave ? await saveNow('manual') : !opts.isLayerOpen?.();
   if(designOK&&progressOK&&codeOK)note('✓ 미션 진행도·센서 설계·엔트리 코드 저장 완료');
   else note('⚠ 일부 저장 실패: '+[!designOK?'센서 설계':null,!progressOK?'미션 진행도':null,!codeOK?'엔트리 코드':null].filter(Boolean).join('·'));
 };$('np-board-button').onclick=()=>showBoard(false);
 $('np-enter-guest').onclick=enterGuest;$('np-change').onclick=()=>guestActive?showLogin():signout();
 $('np-role-student').onclick=()=>selectRole('student');$('np-role-teacher').onclick=teacherSubmit;
 $('np-back').onclick=landing;
 $('np-student-form').onsubmit=e=>{e.preventDefault();studentSubmit()};
 $('np-class').addEventListener('change',()=>{
  const c=Number($('np-class').value);
  renderGroupOptions(c,GROUP_COUNT);
  refreshGroupOptions(c);
 });
 $('np-board-class').onchange=loadBoard;
 $('np-add-group').onclick=addGroupToClass;
 $('np-grid').addEventListener('click',event=>{
   const button=event.target.closest('button.np-delete-member,button.np-reset-missions');
   if(!button||!requireTeacher(user)||!board.contains(button))return;
   const c=Number(button.dataset.class),g=Number(button.dataset.group);
   if(button.classList.contains('np-reset-missions'))resetGroupMissions(c,g,button);
   else deleteAdminMember(c,g,button.dataset.slot,button);
 });
 $('np-board-refresh').onclick=loadBoard;$('np-board-close').onclick=closeBoard;
 $('np-board-signout').onclick=signout;
 $('np-teacher-sim').onclick=()=>{if(requireTeacher(user))enterTeacherSimulator();else if(team){board.classList.remove('show');clearBoard()}else note('학생은 반·조에 먼저 등록해야 합니다.');refreshButtons()};
 if(!autosave)autosave=setInterval(()=>{if((team||requireTeacher(user)&&sessionActive)&&readyToSave&&!restoring&&opts.isLayerOpen?.()&&!opts.isBusy?.())saveNow('auto')},8000);
  setInterval(retryPendingProgress,45000);
  window.addEventListener('online',retryPendingProgress);
 setupNativeHome();refreshButtons();
 initReady.then(async()=>{
  const savedStudent=readStudentSession();
  if(savedStudent){
   if(!user||!requireStudent(user)||savedStudent.uid!==user.uid)forgetStudentSession();
   else{
    try{
     // Check EXISTING membership first; do not claim an empty spot at boot.
     const member=(await db.ref(teamPath(savedStudent.c,savedStudent.g)+'/members/'+savedStudent.slot).once('value')).val();
     if(!member||member.uid!==user.uid){forgetStudentSession();return;}
     $('np-class').value=String(savedStudent.c);
     await refreshGroupOptions(Number(savedStudent.c),String(savedStudent.g));
     $('np-name').value=member.displayName;
     await joinTeam();
     if(team?.c===savedStudent.c&&team?.g===savedStudent.g&&designReady&&savedStudent.editor)
       await openEditor();
     return;
    }catch(error){
     note('⚠ 학생 작업 자동 복원 실패: '+String(error.message||error));
     return;
    }
   }
  }
  const stored=readTeacherSession();
  if(!stored||!user||!requireTeacher(user)||stored.uid!==user.uid)return;
  try{
   const reopen=stored.editor===true;
   await enterTeacher();
   if(reopen)await openEditor();
  }catch(e){note('⚠ 교사 작업 자동 복원 실패: '+String(e.message||e))}
 }).catch(e=>console.warn('교사 세션 복원 준비 실패',e));
 return{rememberEditorState:open=>{rememberTeacherSession(open);rememberStudentSession(open)},refreshUI:refreshButtons,showGate,showBoard,onEntryReady,saveNow,saveProgress,getProgressSaveError:()=>lastProgressSaveError,saveSimulatorDesign,recordFloodResult,recordMission5Result,recordFinalResult,openEditor,closeEditing,enterTeacherSimulator,showLogin,signout,receiveFrameMessage,getTeam:()=>team,getTeacherScores:()=>teacherScores,isDesignReady:()=>designReady&&!guestActive&&(!!team&&requireStudent(user)||sessionActive&&requireTeacher(user)),isGuest:()=>guestActive,isTeacher:()=>sessionActive&&!guestActive&&requireTeacher(user)};
}
global.NepalClassroom={setup};
})(window);
