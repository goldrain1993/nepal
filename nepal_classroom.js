/** NEPAL × ENTRY v4.0 — native Nepal simulator start page with role-based buttons with role-specific Google authentication, 2/3-person groups, flood scores.
 * Public board = signed-in school accounts only; code/progress = group members only.
 * Firebase rules are the authorization boundary, not this browser code.
 */
(function(global){
'use strict';
if(global.NepalClassroom)return;
const CLASS_COUNT=11,GROUP_COUNT=15,MAX_PROJECT_SIZE=1250000,MAX_NAME=18;
const TEACHER_EMAIL='goldrain1993@gmail.com';
const TRIPLE_GROUPS=new Set(['1-13','2-2','3-15','5-2','7-6','8-2','9-1','10-4','11-6']);
const groupCapacity=(c,g)=>TRIPLE_GROUPS.has(c+'-'+g)?3:2;
const memberKeys=['student1','student2','student3'];
const ROOT='nepal-v27/public/classes',PRIVATE='nepal-v27/private/classes',BACKUP='nepal-entry-v27-backup:',LOCK_MS=120000;
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
const groupOpts=Array.from({length:GROUP_COUNT},(_,i)=>`<option value="${i+1}">${i+1}조</option>`).join('');
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
  <label class="np-field">반 선택<select id="np-class">${classOpts}</select></label>
  <label class="np-field">조 선택<select id="np-group">${groupOpts}</select></label>
  <label class="np-field">이름<input id="np-name" maxlength="${MAX_NAME}" required autocomplete="off" placeholder="학생 본인 이름"/></label>
 </div><div class="np-student-footer"><button type="button" id="np-back" class="np-btn np-back">← 돌아가기</button><button type="submit" id="np-enter" class="np-btn np-student-submit">입장하기</button></div></form>
 <div class="np-progress-message" id="np-gate-msg" aria-live="polite"></div>
</div></div>`;
board.innerHTML=`<div class="np-wrap"><div class="np-head"><div><div class="np-title">📊 네팔 홍수 · 엔트리 통합 현황판</div><div class="np-sub" id="np-board-info">학교 구글 계정 · 등급/점수는 100회 형성평가 최고 기록</div></div><label>반 선택 <select id="np-board-class">${classOpts}</select></label></div><section id="np-teacher-admin" hidden style="border:1px solid #416949;border-radius:12px;padding:14px;margin-top:16px;background:#11251b"><strong>🧑‍🏫 교사 · 조원 등록 및 삭제</strong><p style="font-size:12px;color:#bfd5b7">학생 Google 계정의 Firebase UID와 이름을 입력하면 등록할 수 있습니다. 이 화면에서 Google 계정 자체를 만들 수는 없습니다. 삭제해도 해당 조의 코딩 프로젝트와 센서 설계는 유지됩니다.</p><div class="np-form"><label class="np-field">조<select id="np-admin-group">${groupOpts}</select></label><label class="np-field">조원 자리<select id="np-admin-slot"><option value="student1">1번 조원</option><option value="student2">2번 조원</option><option value="student3">3번 조원</option></select></label><label class="np-field">조원 이름<input id="np-admin-name" maxlength="18" placeholder="예: 홍길동"></label></div><label class="np-field">학생 Firebase UID<input id="np-admin-uid" autocomplete="off" placeholder="Authentication의 사용자 UID"></label><div class="np-actions"><button class="np-btn" type="button" id="np-admin-add">조원 등록/수정</button><button class="np-btn alt" type="button" id="np-admin-delete">선택한 조원 삭제</button></div><div id="np-admin-info" class="np-note">반·조·조원 자리를 선택하세요.</div></section><div class="np-boardgrid" id="np-grid"></div><div class="np-actions"><button class="np-btn alt" id="np-board-close">← 돌아가기</button><button class="np-btn alt" id="np-teacher-sim">🌊 시뮬레이션 보기</button><button class="np-btn alt" id="np-board-refresh">↻ 새로고침</button><button class="np-btn alt" id="np-board-signout">로그아웃</button></div><div class="np-msg" id="np-board-msg"></div></div>`;
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanName=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,MAX_NAME);
function valid(c,g){return Number.isInteger(c)&&c>=1&&c<=11&&Number.isInteger(g)&&g>=1&&g<=15}
function src(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=()=>reject(Error('스크립트 다운로드 실패: '+url));document.head.appendChild(s)})}
let fb=null,db=null,auth=null,user=null,schoolDomain='',teacherUids=[],initError='',initDone=false;
let requestedRole='student',authRole=null,loginBusy=false;
let guestActive=false;
let sessionActive=false; // a retained Google credential is NOT a classroom login until this session chooses a role.
let nativeStart=null,nativeButtons=[],nativeStudentPanel=null;
const loginCaptions=['🎒 학생 로그인','🧑‍🏫 교사 로그인','🌐 게스트 입장'];
const simulatorCaptions=['시작하기','형성평가 바로가기','이용 방법 보기'];
let team=null,role=null,editorLockHeld=false,codeListener=null,boardListener=null,projectToRestore=null;
let designReady=false,designSavedAt=0;
let progress=0,missionTotal=4,callbacks={},saveBusy=false,queued=false,readyToSave=false,restoring=false,importPending=null,exportPending=null,rpcId=0,headerStatus=null,lastSaved='',autosave=null,lockRefresh=null,lockedTeamPath='';
function teamPath(c,g){return `${ROOT}/c${c}/teams/g${g}`}
function workPath(c,g){return `${PRIVATE}/c${c}/teams/g${g}`}
function backupKey(){return !guestActive&&team&&user?BACKUP+user.uid+':c'+team.c+'g'+team.g:null}
function localBackUp(project){const key=backupKey();if(!key)return;try{localStorage.setItem(key,JSON.stringify({project,updatedAt:Date.now()}))}catch(e){console.warn('로컬 보조 백업 공간 부족',e)}}
function localRestore(){try{return JSON.parse(localStorage.getItem(backupKey())||'null')}catch(_){return null}}
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
 if(save){save.disabled=guestActive||!team;save.style.display=sessionVisible&&team?'':'none';save.textContent='💾 저장'}
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
 try{await googlePopup('teacher');enterTeacher()}
 catch(e){requestedRole='student';console.warn('NEPAL 교사 로그인:',e);landing();gate.dataset.page='landing';
  // Show errors briefly on landing only when authentication fails.
  const msg='교사 로그인 실패: '+String(e.message||e);const el=document.getElementById('np-landing-error');if(el)el.textContent=msg;const homeError=$('np-home-error');if(homeError)homeError.textContent=msg;
 }
 finally{loginBusy=false;refreshButtons()}
}
async function signout(){
 if(team&&designReady)await callbacks.flushDesign?.();
 designReady=false;
 if(guestActive)endGuest();
 if(team)await leaveTeam();
 clearBoard();board.classList.remove('show');
 if(auth)await auth.signOut();
 callbacks.restoreDesign?.({version:1,sensors:[],alarmMode:'OR',minCount:2});
 user=null;authRole=null;role=null;team=null;projectToRestore=null;readyToSave=false;
 callbacks.resetEditor?.();callbacks.closeEditor?.();callbacks.restoreProgress?.(0);
 landing();refreshButtons();
}
function identify(members){if(!user)return null;for(const key of memberKeys)if(members?.[key]?.uid===user.uid)return key;return null}
function memberNames(members,c,g){return memberKeys.slice(0,groupCapacity(c,g)).map((slot,i)=>members?.[slot]?.displayName||`${i+1}번 조원 미등록`).join(' · ')}
async function joinTeam(){await initReady;if(!user||!db||!requireStudent(user)){note('먼저 학생 학교 Google 계정으로 로그인해 주세요. 교사 계정으로는 조에 가입할 수 없습니다.');return}
 const c=Number($('np-class').value),g=Number($('np-group').value),displayName=cleanName($('np-name').value);
 if(!valid(c,g)||!displayName){note('반·조와 본인의 이름을 입력해 주세요.');return}
 $('np-enter').disabled=true;note('조원 계정과 저장된 프로젝트를 확인하고 있습니다…');
 try{
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
  team={c,g};role=slot;readyToSave=false;designReady=false;editorLockHeld=false;progress=0;lastSaved='';
  const [progressSnap,progressV3Snap,codeSnap,designSnap]=await Promise.all([
   db.ref(root+'/progress').once('value'),db.ref(root+'/progressV3').once('value'),
   db.ref(workPath(c,g)+'/code').once('value'),db.ref(workPath(c,g)+'/design').once('value')
  ]);
  // Preserve old six-stage progress without skipping the newly redesigned
  // stages 5/6/FINAL. Use a new key so legacy progress is never overwritten.
  const previousProgress=progressSnap.val()||{};
  const currentProgress=progressV3Snap.val();
  const oldCompleted=Number(previousProgress.completed)||0;
  const oldAligned=previousProgress.schemaVersion===2?oldCompleted:(oldCompleted>=2?oldCompleted+1:oldCompleted);
  progress=Math.max(0,Math.min(missionTotal,currentProgress?
    Number(currentProgress.completed)||0:Math.min(4,oldAligned)));
  const cloudCode=codeSnap.val();const local=localRestore();
  try{projectToRestore=cloudCode?.payload?JSON.parse(cloudCode.payload):(local?.project||null)}catch(e){throw Error('온라인 엔트리 코드 형식 오류: '+e.message)}
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
  note('✓ '+c+'반 '+g+'조 · '+memberNames(members,c,g)+' · 네팔 홍수 시뮬레이션에 입장했습니다.');
 }catch(e){designReady=false;note('입장 실패: '+String(e.message||e));if(editorLockHeld){await releaseLock().catch(()=>{});team=null;readyToSave=false}}
 finally{refreshButtons()}
}
async function openEditor(){
 if(guestActive){note('🌐 게스트 엔트리 편집 · 미션과 블록은 저장되지 않습니다.');callbacks.launchEditor?.();return}
 // Teachers have no class/group: use a separate, non-persistent preview session.
 // Never acquire a student editor lock, write code or mark student mission progress.
 if(requireTeacher(user)&&sessionActive){
   readyToSave=false;editorLockHeld=false;projectToRestore=null;
   callbacks.resetEditor?.();callbacks.launchEditor?.();
   note('🧑‍🏫 교사 체험 모드 · 모든 미션 열림 · 조별 저장 없음');
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
  const code=(await db.ref(workPath(c,g)+'/code').once('value')).val();
  const local=localRestore();projectToRestore=code?.payload?JSON.parse(code.payload):(local?.project||null);
  readyToSave=false;callbacks.resetEditor?.();callbacks.launchEditor?.();startLockRefresh();
 }catch(e){note('엔트리 입장 실패: '+String(e.message||e));if(editorLockHeld)await releaseLock().catch(()=>{});}
}
async function closeEditing(){
 if(guestActive||requireTeacher(user)){callbacks.closeEditor?.();return}
 if(readyToSave)await saveNow('exit');readyToSave=false;
 callbacks.closeEditor?.();await releaseLock().catch(e=>note('편집 잠금 해제 실패: '+e.message));
}
// Guest is a deliberately in-memory, unauthenticated experience. Never claim a team,
// access a classroom database, save progress/grades/projects, or create a local backup.
async function enterGuest(){
 try{
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
function enterTeacher(){
 callbacks.restoreDesign?.({version:1,sensors:[],alarmMode:'OR',minCount:2});
 if(!user||!requireTeacher(user)){note('등록된 교사 Google 계정으로 로그인해 주세요.');return}
 // Successful teacher authentication enters the ORIGINAL Nepal Flood home page,
 // not the classroom board. The board stays available as an optional menu.
 enterTeacherSimulator();
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
 if(d.type==='ENTRY_PROJECT_IMPORTED'&&importPending?.token===d.token){const x=importPending;importPending=null;clearTimeout(x.timeout);d.ok?x.resolve():x.reject(Error(d.message||'코드 불러오기 실패'))}
}
function rpc(action,project){return new Promise((resolve,reject)=>{
 const token=++rpcId,timeout=setTimeout(()=>{if(action==='export')exportPending=null;else importPending=null;reject(Error('엔트리 '+action+' 시간 초과'))},19000);
 const p={resolve,reject,token,timeout};if(action==='export')exportPending=p;else importPending=p;
 callbacks.iframe.contentWindow?.postMessage(action==='export'?{type:'NEPAL_EXPORT_PROJECT',token}:{type:'NEPAL_IMPORT_PROJECT',token,project},location.origin);
})}
async function onEntryReady(){if(guestActive||requireTeacher(user))return;if(!team||!editorLockHeld)return;readyToSave=false;restoring=true;
 try{if(projectToRestore?.objects&&Array.isArray(projectToRestore.objects)){note('저장된 엔트리 블록을 복원하는 중…');await rpc('import',projectToRestore);note('✓ 이전 조별 엔트리 블록 복원 완료');}
   else note('새 조의 엔트리 작업을 시작합니다.');readyToSave=true;
 }catch(e){note('⚠ 블록 복원 실패: '+e.message+' · 기존 파일 보호를 위해 자동 저장을 중지합니다.');}
 finally{restoring=false}}
async function saveNow(reason='manual'){
 if(guestActive){if(reason==='manual')note('🌐 게스트 모드는 저장하지 않습니다. 학교 계정으로 로그인하면 조별 저장을 사용할 수 있습니다.');return false}
 if(!team||!user||!editorLockHeld||!readyToSave||!db){if(reason==='manual')note('아직 편집 또는 저장 준비가 되지 않았습니다.');return false}
 if(saveBusy){queued=true;return false}if(!callbacks.isReady?.())return false;saveBusy=true;
 try{const project=await rpc('export');if(!project||!Array.isArray(project.objects))throw Error('엔트리 프로젝트 구조 오류');
  const encoded=JSON.stringify(project);if(encoded.length>MAX_PROJECT_SIZE)throw Error('코드 용량이 1.25MB를 넘었습니다. 이미지/소리를 줄여 주세요.');
  localBackUp(project);
  if(reason==='auto'&&lastSaved===encoded)return true;
  // The same group shares one editor lock. Only the lock holder may save.
  const snap=await db.ref(workPath(team.c,team.g)+'/editorLock').once('value');if(snap.val()?.uid!==user.uid)throw Error('이 조의 편집 권한을 잃었습니다.');
  await db.ref(workPath(team.c,team.g)+'/code').set({payload:encoded,updatedAt:fb.database.ServerValue.TIMESTAMP,updatedBy:user.uid});
  lastSaved=encoded;note('✓ 조별 블록 온라인 저장 완료 · '+new Date().toLocaleTimeString('ko-KR'));return true;
 }catch(e){note('⚠ 온라인 저장 실패: '+String(e.message||e)+' · 현재 브라우저에 보조 저장이 있다면 같은 계정으로 다시 확인하세요.');return false}
 finally{saveBusy=false;if(queued){queued=false;setTimeout(()=>saveNow('auto'),500)}}
}
async function saveProgress(n){
 if(guestActive||!team||!user||!editorLockHeld)return;
 const value=Math.max(progress,Math.min(missionTotal,Math.max(0,Number(n)||0)));progress=value;
 try{
  await db.ref(teamPath(team.c,team.g)+'/progressV3').transaction(old=>({
   completed:Math.max(Number(old?.completed)||0,value),
   schemaVersion:3,updatedAt:fb.database.ServerValue.TIMESTAMP
  }),()=>{},false);
  note('✓ '+(value===7?'FINAL 미션':('미션 '+value))+'까지 통과 · 온라인 저장 완료');
 }catch(e){note('⚠ 미션 진행도 저장 실패: '+e.message)}
}
/** Save only the four editable sensors and alarm design. Guest and teachers never write. */
async function saveSimulatorDesign(design,reason='auto'){
 if(guestActive||!designReady||!team||!user||!db||!requireStudent(user))return false;
 if(!design || design.version!==1 || !Array.isArray(design.sensors) || design.sensors.length>4)return false;
 const encoded=JSON.stringify(design);
 if(encoded.length>12000)throw Error('센서 설계 데이터가 너무 큽니다.');
 const {c,g}=team;const uid=user.uid;
 try{
  // Shared per-group Firebase path: other groups cannot read or write it.
  await db.ref(workPath(c,g)+'/design').set({version:1,payload:encoded,updatedBy:uid,updatedAt:fb.database.ServerValue.TIMESTAMP});
  designSavedAt=Date.now();
  if(reason==='manual')note('✓ '+c+'반 '+g+'조 센서 배치와 위험 기준이 온라인에 저장되었습니다.');
  return true;
 }catch(e){
  note('⚠ 센서 설계 저장 실패: '+String(e.message||e));
  return false;
 }
}
async function recordStageBest(key,label,result){
 if(guestActive||!team||!user||!db||!requireStudent(user))return false;
 const score=Number(result?.score),rank=String(result?.rank||''),n=Number(result?.n);
 if(!Number.isFinite(score)||score<0||score>100||!['LEGEND','S','A','B','C','F'].includes(rank)||!Number.isInteger(n)||n<1||n>4)return false;
 const ref=db.ref(teamPath(team.c,team.g)+'/'+key);
 try{
  const tx=await ref.transaction(old=>{
   if(old && Number(old.score)>=score)return;
   return {score,rank,n,updatedBy:user.uid,updatedAt:fb.database.ServerValue.TIMESTAMP};
  },()=>{},false);
  note(tx.committed?'🏆 '+label+' 최고 점수 저장: '+score.toFixed(1)+'점':'📊 '+label+' 기존 최고 점수 유지');
  return tx.committed;
 }catch(e){note('⚠ '+label+' 점수 저장 오류: '+e.message);return false}
}
async function recordMission5Result(result){
 return recordStageBest('mission5NoListBest','미션 5',result);
}
async function recordFinalResult(result){
 return recordStageBest('finalBest','FINAL 미션',result);
}
async function recordFloodResult(result){
 if(guestActive)return;if(!team||!user||!db||!requireStudent(user))return;
 const score=Number(result?.score),rank=String(result?.rank||'').trim().toUpperCase();
 if(!Number.isFinite(score)||score<0||score>100||!['LEGEND','S','A','B','C','F'].includes(rank))return;
 const ref=db.ref(teamPath(team.c,team.g)+'/floodBest');
 try{
  const tx=await ref.transaction(old=>{
   if(old&&Number(old.score)>=score)return;
   return {score,rank,updatedBy:user.uid,updatedAt:fb.database.ServerValue.TIMESTAMP};
  },()=>{},false);
  note(tx.committed?'🏆 네팔 홍수 형성평가 최고 성적 저장: '+rank+' · '+score+'점':'📊 현재 최고 성적 '+(tx.snapshot.val()?.score??score)+'점 유지');
 }catch(e){note('⚠ 네팔 홍수 점수 저장 오류: '+e.message)}
}
let boardFromGate=true;
function showBoard(fromGate){
 $('np-teacher-admin').hidden=!requireTeacher(user);if(requireTeacher(user))previewAdmin();if(guestActive){note('게스트 모드에서는 학급 현황판을 이용할 수 없습니다.');return}if(!user||!db){note('먼저 학교 계정으로 로그인하세요.');landing();return}
 boardFromGate=fromGate||gate.classList.contains('show');$('np-board-class').value=String(team?.c||$('np-class').value||1);gate.classList.remove('show');board.classList.add('show');loadBoard();refreshButtons()}
function displayRank97(score,rank){
 if(score!==null&&Number(score)>=97)return 'LEGEND';
 if(String(rank||'').toUpperCase()==='LEGEND')return Number(score)>=90?'S':Number(score)>=80?'A':Number(score)>=65?'B':Number(score)>=50?'C':'F';
 return String(rank||'미평가');
}
function boardCards(data,c){
 const entries=[];
 const scoreOf=x=>x&&Number.isFinite(Number(x.score))?Number(x.score):null;
 for(let g=1;g<=GROUP_COUNT;g++){
  const d=data?.['g'+g]||{},mem=d.members||{};
  const rawProgress=Number(d.progress?.completed)||0;
  const oldAligned=d.progress?.schemaVersion===2?rawProgress:(rawProgress>=2?rawProgress+1:rawProgress);
  const progressV3=d.progressV3;
  const value=Math.max(0,Math.min(missionTotal,progressV3?
    Number(progressV3.completed)||0:Math.min(4,oldAligned)));
  const flood=d.floodBest||null,floodScore=scoreOf(flood);
  const mission5=d.mission5NoListBest||null,mission5Score=scoreOf(mission5);
  // Legacy key "mission5Best" held the old FINAL/100-run result.
  const final=d.finalBest||d.mission5Best||null,finalScore=scoreOf(final);
  const members=Object.values(mem).filter(x=>x?.uid);
  const firstJoin=Math.min(...members.map(x=>Number(x.joinedAt)).filter(n=>Number.isFinite(n)&&n>0));
  const finished=Number(progressV3?.updatedAt||d.progress?.updatedAt);
  const duration=Number.isFinite(firstJoin)&&Number.isFinite(finished)&&finished>=firstJoin?finished-firstJoin:null;
  // Score availability takes priority over all other scores: FINAL > M5 > flood.
  const tier=finalScore!==null?3:mission5Score!==null?2:floodScore!==null?1:0;
  const qualifyingScore=tier===3?finalScore:tier===2?mission5Score:tier===1?floodScore:null;
  entries.push({g,mem,value,flood,floodScore,mission5,mission5Score,final,finalScore,
    tier,qualifyingScore,duration,hasTeam:members.length>0,mine:team?.c===c&&team?.g===g});
 }
 const ranked=entries.filter(e=>e.hasTeam).sort((a,b)=>{
  if(a.tier!==b.tier)return b.tier-a.tier;
  if(a.qualifyingScore!==b.qualifyingScore)return (b.qualifyingScore??-1)-(a.qualifyingScore??-1);
  if(a.value!==b.value)return b.value-a.value;
  if(a.duration!==null&&b.duration!==null&&a.duration!==b.duration)return a.duration-b.duration;
  return a.g-b.g;
 });
 const gold=ranked[0]?.tier>0?ranked[0].g:null;
 let html='';
 for(const e of entries){
  const {g,mem,value,flood,floodScore,mission5,mission5Score,final,finalScore,mine}=e;
  const medal=g===gold?'<span class="np-gold-medal" role="img" aria-label="이 반의 1위 금메달">1</span>':'';
  html+=`<article class="np-team ${mine?'mine':''}"><div class="np-teamhead"><span style="display:flex;align-items:center;gap:6px">${medal}${g}조 ${mine?'(우리 조)':''}</span><span>${value}/${missionTotal}</span></div><div class="np-members">${esc(memberNames(mem,c,g))}</div><div class="np-score">🌊 형성평가: ${floodScore===null?'미응시':`${esc(displayRank97(floodScore,flood.rank))} · ${floodScore}점`}</div><div class="np-score">🧩 미션 5: ${mission5Score===null?'미응시':`${esc(displayRank97(mission5Score,mission5.rank))} · ${mission5Score}점 (N=${Number(mission5.n)})`}</div><div class="np-score">🏆 FINAL 미션: ${finalScore===null?'미응시':`${esc(displayRank97(finalScore,final.rank))} · ${finalScore}점 (N=${Number(final.n)})`}</div><div class="np-track"><div style="width:${Math.round(100*value/missionTotal)}%"></div></div><div class="np-caption">${value===0?'진행 전':value===missionTotal?'FINAL 미션 완료':`미션 ${value}까지 통과`}</div></article>`;
 }
 $('np-grid').innerHTML=html;
}
function clearBoard(){if(boardListener){boardListener.ref.off('value',boardListener.cb);boardListener=null}}
function loadBoard(){if(!user||!db)return;$('np-board-msg').textContent='현황을 불러오는 중…';const c=Number($('np-board-class').value);clearBoard();if(!valid(c,1))return;
 const ref=db.ref(`${ROOT}/c${c}/teams`);const cb=snap=>{ $('np-board-msg').textContent=''; if(board.classList.contains('show')&&Number($('np-board-class').value)===c)boardCards(snap.val()||{},c)};
 ref.on('value',cb,err=>{ $('np-grid').innerHTML=''; $('np-board-msg').textContent='현황판 접근 실패: '+err.message+'\nFirebase 콘솔 → Realtime Database → 규칙에서 v3.0 firebase.rules.json 전체를 붙여 넣고 [게시]를 눌러야 합니다. 교사 Google UID가 규칙에 포함되어 있는지도 확인하세요.'; });boardListener={ref,cb};
 $('np-board-info').textContent='학교 학생/등록 교사 Google 계정으로만 조회 · '+c+'반 15개 조 · 금메달 순서: FINAL → 미션 5 → 형성평가';
}
function adminSelection(){const c=Number($('np-board-class').value),g=Number($('np-admin-group').value),slot=$('np-admin-slot').value;
 if(!valid(c,g)||!memberKeys.includes(slot))throw Error('반·조·조원 자리를 확인하세요.');
 if(slot==='student3'&&groupCapacity(c,g)!==3)throw Error('이 조는 2인 조입니다. 3번 자리를 사용할 수 없습니다.');
 return {c,g,slot};}
async function previewAdmin(){if(!requireTeacher(user))return;
 try{const {c,g,slot}=adminSelection();const data=(await db.ref(teamPath(c,g)+'/members/'+slot).once('value')).val();
 $('np-admin-name').value=data?.displayName||'';$('np-admin-uid').value=data?.uid||'';
 $('np-admin-info').textContent=`${c}반 ${g}조 · ${slot}: ${data?.displayName||'미등록'} / 등록 가능 인원 ${groupCapacity(c,g)}명`;
 }catch(e){$('np-admin-info').textContent=e.message;$('np-admin-name').value='';$('np-admin-uid').value='';}}
async function registerAdminMember(){if(!requireTeacher(user)||!db)return;
 try{const {c,g,slot}=adminSelection(),uid=String($('np-admin-uid').value||'').trim(),name=cleanName($('np-admin-name').value);
 if(!name||!uid||!(/^[a-zA-Z0-9_-]{14,160}$/).test(uid))throw Error('학생 이름과 Firebase UID를 정확하게 입력하세요.');
 const existing=(await db.ref(teamPath(c,g)+'/members').once('value')).val()||{};
 if(memberKeys.some(k=>k!==slot && existing[k]?.uid===uid))throw Error('이 Google UID는 이미 이 조의 다른 자리에 등록되어 있습니다.');
 const path=teamPath(c,g)+'/members/'+slot;
 await db.ref(path).set({uid,displayName:name,joinedAt:fb.database.ServerValue.TIMESTAMP});
 $('np-admin-info').textContent=`✓ ${c}반 ${g}조 ${name} 등록 완료`;
 }catch(e){$('np-admin-info').textContent='등록 실패: '+e.message;}}
async function deleteAdminMember(){if(!requireTeacher(user)||!db)return;
 try{const {c,g,slot}=adminSelection(),path=teamPath(c,g)+'/members/'+slot;
 const current=(await db.ref(path).once('value')).val();if(!current){$('np-admin-info').textContent='해당 자리는 비어 있습니다.';return;}
 if(!confirm(`${c}반 ${g}조 ${current.displayName||slot}의 조원 등록을 삭제할까요?\n코딩 프로젝트와 점수는 삭제하지 않습니다.`))return;
 await db.ref(path).remove();await previewAdmin();$('np-admin-info').textContent='✓ 조원 등록을 삭제했습니다. 이전 프로젝트 및 센서 설계는 보존됩니다.';
 }catch(e){$('np-admin-info').textContent='삭제 실패: '+e.message;}}

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
 $('np-save').onclick=()=>saveNow('manual');$('np-board-button').onclick=()=>showBoard(false);
 $('np-enter-guest').onclick=enterGuest;$('np-change').onclick=()=>guestActive?showLogin():signout();
 $('np-role-student').onclick=()=>selectRole('student');$('np-role-teacher').onclick=teacherSubmit;
 $('np-back').onclick=landing;
 $('np-student-form').onsubmit=e=>{e.preventDefault();studentSubmit()};
 $('np-board-class').onchange=()=>{loadBoard();previewAdmin()};
 $('np-admin-group').onchange=previewAdmin;$('np-admin-slot').onchange=previewAdmin;
 $('np-admin-add').onclick=registerAdminMember;$('np-admin-delete').onclick=deleteAdminMember;$('np-board-refresh').onclick=loadBoard;$('np-board-close').onclick=closeBoard;
 $('np-board-signout').onclick=signout;
 $('np-teacher-sim').onclick=()=>{if(requireTeacher(user))enterTeacherSimulator();else if(team){board.classList.remove('show');clearBoard()}else note('학생은 반·조에 먼저 등록해야 합니다.');refreshButtons()};
 if(!autosave)autosave=setInterval(()=>{if(team&&readyToSave&&!restoring&&opts.isLayerOpen?.()&&!opts.isBusy?.())saveNow('auto')},18000);
 setupNativeHome();refreshButtons();
 return{refreshUI:refreshButtons,showGate,showBoard,onEntryReady,saveNow,saveProgress,saveSimulatorDesign,recordFloodResult,recordMission5Result,recordFinalResult,openEditor,closeEditing,enterTeacherSimulator,showLogin,signout,receiveFrameMessage,getTeam:()=>team,isDesignReady:()=>designReady&&!!team&&!guestActive&&requireStudent(user),isGuest:()=>guestActive,isTeacher:()=>sessionActive&&!guestActive&&requireTeacher(user)};
}
global.NepalClassroom={setup};
})(window);
