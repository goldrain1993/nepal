/** NEPAL × ENTRY v3.1 — three-button start page with role-specific Google authentication, 2/3-person groups, flood scores.
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
.np-score{font-size:12px;color:#d5f59a;margin-top:5px}.np-teamhead{display:flex;justify-content:space-between;font-size:15px;font-weight:900}.np-members{font-size:13px;color:#e7f3da;margin-top:7px;overflow-wrap:anywhere;min-height:23px}
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
board.innerHTML=`<div class="np-wrap"><div class="np-head"><div><div class="np-title">📊 네팔 홍수 · 엔트리 통합 현황판</div><div class="np-sub" id="np-board-info">학교 구글 계정 · 등급/점수는 100회 형성평가 최고 기록</div></div><label>반 선택 <select id="np-board-class">${classOpts}</select></label></div><div class="np-boardgrid" id="np-grid"></div><div class="np-actions"><button class="np-btn alt" id="np-board-close">← 돌아가기</button><button class="np-btn alt" id="np-teacher-sim">🌊 시뮬레이션 보기</button><button class="np-btn alt" id="np-board-refresh">↻ 새로고침</button><button class="np-btn alt" id="np-board-signout">로그아웃</button></div><div class="np-msg" id="np-board-msg"></div></div>`;
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanName=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,MAX_NAME);
function valid(c,g){return Number.isInteger(c)&&c>=1&&c<=11&&Number.isInteger(g)&&g>=1&&g<=15}
function src(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=()=>reject(Error('스크립트 다운로드 실패: '+url));document.head.appendChild(s)})}
let fb=null,db=null,auth=null,user=null,schoolDomain='',teacherUids=[],initError='',initDone=false;
let requestedRole='student',authRole=null,loginBusy=false;
let guestActive=false;
let team=null,role=null,editorLockHeld=false,codeListener=null,boardListener=null,projectToRestore=null;
let progress=0,missionTotal=4,callbacks={},saveBusy=false,queued=false,readyToSave=false,restoring=false,importPending=null,exportPending=null,rpcId=0,headerStatus=null,lastSaved='',autosave=null,lockRefresh=null,lockedTeamPath='';
function teamPath(c,g){return `${ROOT}/c${c}/teams/g${g}`}
function workPath(c,g){return `${PRIVATE}/c${c}/teams/g${g}`}
function backupKey(){return !guestActive&&team&&user?BACKUP+user.uid+':c'+team.c+'g'+team.g:null}
function localBackUp(project){const key=backupKey();if(!key)return;try{localStorage.setItem(key,JSON.stringify({project,updatedAt:Date.now()}))}catch(e){console.warn('로컬 보조 백업 공간 부족',e)}}
function localRestore(){try{return JSON.parse(localStorage.getItem(backupKey())||'null')}catch(_){return null}}
function note(m){if(headerStatus)headerStatus.textContent=m;const el=$('np-gate-msg');if(el)el.textContent=m}
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
 $('np-name').focus();
}
function landing(){requestedRole='student';gate.dataset.page='landing';note('');const err=$('np-landing-error');if(err)err.textContent='';refreshButtons()}
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
 const sessionVisible=!gate.classList.contains('show');
 const signedIn=!guestActive&&sessionVisible&&!!((team&&user)||(!team&&requireTeacher(user)));
 const editorActive=sessionVisible&&!!(team||guestActive||requireTeacher(user));
 const save=$('np-save'),boardButton=$('np-board-button'),changeButton=$('np-change');
 if(save){save.disabled=guestActive||!team;save.style.display=team?'':'none';save.textContent='💾 저장'}
 if(boardButton){boardButton.disabled=guestActive;boardButton.style.display=signedIn?'':'none'}
 if(changeButton){changeButton.style.display=editorActive?'':'none';changeButton.textContent=guestActive?'↩ 게스트 종료':'🚪 로그아웃'}
 const floatingBoard=$('nepal-class-board'),floatingLogout=$('nepal-class-switch'),trigger=$('nepal-entry-trigger');
 if(floatingBoard)floatingBoard.style.display=signedIn?'':'none';
 if(floatingLogout){floatingLogout.style.display=editorActive?'':'none';floatingLogout.textContent=guestActive?'↩ 게스트 종료':'🚪 로그아웃'}
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
  const el=document.getElementById('np-landing-error');if(el)el.textContent='교사 로그인 실패: '+String(e.message||e);
 }
 finally{loginBusy=false;refreshButtons()}
}
async function signout(){
 if(guestActive)endGuest();
 if(team)await leaveTeam();
 clearBoard();board.classList.remove('show');
 if(auth)await auth.signOut();
 user=null;authRole=null;role=null;team=null;projectToRestore=null;readyToSave=false;
 callbacks.resetEditor?.();callbacks.closeEditor?.();callbacks.restoreProgress?.(0);
 landing();gate.classList.add('show');refreshButtons();
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
  team={c,g};role=slot;readyToSave=false;editorLockHeld=false;progress=0;lastSaved='';
  const [progressSnap,codeSnap]=await Promise.all([db.ref(root+'/progress').once('value'),db.ref(workPath(c,g)+'/code').once('value')]);
  progress=Math.max(0,Math.min(missionTotal,Number(progressSnap.val()?.completed)||0));
  const cloudCode=codeSnap.val();const local=localRestore();
  try{projectToRestore=cloudCode?.payload?JSON.parse(cloudCode.payload):(local?.project||null)}catch(e){throw Error('온라인 엔트리 코드 형식 오류: '+e.message)}
  callbacks.resetEditor?.();callbacks.restoreProgress?.(progress);
  gate.classList.remove('show');callbacks.enterSimulator?.();
  note('✓ '+c+'반 '+g+'조 · '+memberNames(members,c,g)+' · 네팔 홍수 시뮬레이션에 입장했습니다.');
 }catch(e){note('입장 실패: '+String(e.message||e));if(editorLockHeld){await releaseLock().catch(()=>{});team=null;readyToSave=false}}
 finally{refreshButtons()}
}
async function openEditor(){
 if(guestActive){note('🌐 게스트 엔트리 편집 · 미션과 블록은 저장되지 않습니다.');callbacks.launchEditor?.();return}
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
 if(guestActive){callbacks.closeEditor?.();return}
 if(readyToSave)await saveNow('exit');readyToSave=false;
 callbacks.closeEditor?.();await releaseLock().catch(e=>note('편집 잠금 해제 실패: '+e.message));
}
// Guest is a deliberately in-memory, unauthenticated experience. Never claim a team,
// access a classroom database, save progress/grades/projects, or create a local backup.
async function enterGuest(){
 try{
  if(auth?.currentUser)await auth.signOut();
  if(team)await leaveTeam();
  guestActive=true;team=null;role=null;projectToRestore=null;readyToSave=false;
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
 guestActive=false;readyToSave=false;projectToRestore=null;progress=0;lastSaved='';
 callbacks.resetEditor?.();callbacks.closeEditor?.();callbacks.restoreProgress?.(0);
 if(typeof global.resetRank==='function')global.resetRank();
 note('게스트 체험을 종료했습니다. 진행 기록과 코드가 저장되지 않았습니다.');
 refreshButtons();
}
function enterTeacher(){if(!user||!requireTeacher(user)){note('등록된 교사 Google 계정으로 로그인해 주세요.');return}gate.classList.remove('show');showBoard(true);refreshButtons()}
function enterTeacherSimulator(){if(!user||!requireTeacher(user))return;gate.classList.remove('show');board.classList.remove('show');callbacks.enterSimulator?.();refreshButtons()}
function startLockRefresh(){if(lockRefresh)clearInterval(lockRefresh);
 lockRefresh=setInterval(()=>{if(!team||!editorLockHeld||!user)return;db.ref(lockedTeamPath+'/editorLock').transaction(old=>old?.uid===user.uid?{uid:user.uid,updatedAt:fb.database.ServerValue.TIMESTAMP}:undefined,()=>{},false).then(t=>{if(!t.committed){editorLockHeld=false;readyToSave=false;note('⚠ 다른 조원에게 편집 권한이 넘어갔습니다. 저장을 중단했습니다.')}}).catch(e=>note('⚠ 편집 잠금 유지 실패: '+e.message))},35000);
}
async function releaseLock(){if(lockRefresh){clearInterval(lockRefresh);lockRefresh=null}if(!editorLockHeld||!user||!lockedTeamPath)return;
 const ref=db.ref(lockedTeamPath+'/editorLock');await ref.transaction(old=>old?.uid===user.uid?null:undefined,()=>{},false);editorLockHeld=false;lockedTeamPath='';
}
async function leaveTeam(){if(!team)return;
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
async function onEntryReady(){if(guestActive){note('🌐 게스트 엔트리 준비 완료 · 저장 없이 자유롭게 체험하세요.');return}if(!team||!editorLockHeld)return;readyToSave=false;restoring=true;
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
async function saveProgress(n){if(guestActive)return;if(!team||!user||!editorLockHeld)return;
 const value=Math.max(progress,Math.min(missionTotal,Math.max(0,Number(n)||0)));progress=value;
 try{await db.ref(teamPath(team.c,team.g)+'/progress').transaction(old=>({completed:Math.max(Number(old?.completed)||0,value),updatedAt:fb.database.ServerValue.TIMESTAMP}),()=>{},false);
 note('✓ 미션 '+value+'까지 통과 · 온라인 저장 완료');}
 catch(e){note('⚠ 미션 진행도 저장 실패: '+e.message)}
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
function showBoard(fromGate){if(guestActive){note('게스트 모드에서는 학급 현황판을 이용할 수 없습니다.');return}if(!user||!db){note('먼저 학교 계정으로 로그인하세요.');gate.classList.add('show');return}
 boardFromGate=fromGate||gate.classList.contains('show');$('np-board-class').value=String(team?.c||$('np-class').value||1);gate.classList.remove('show');board.classList.add('show');loadBoard();refreshButtons()}
function boardCards(data,c){let html='';for(let g=1;g<=GROUP_COUNT;g++){
 const d=data?.['g'+g]||{},mem=d.members||{};const value=Math.max(0,Math.min(missionTotal,Number(d.progress?.completed)||0));const best=d.floodBest||null;const score=best&&Number.isFinite(Number(best.score))?Number(best.score):null;const mine=team?.c===c&&team?.g===g;
 html+=`<article class="np-team ${mine?'mine':''}"><div class="np-teamhead"><span>${g}조 ${mine?'(우리 조)':''}</span><span>${value}/${missionTotal}</span></div><div class="np-members">${esc(memberNames(mem,c,g))}</div><div class="np-score">🌊 네팔 형성평가: ${score===null?'미응시':`${esc(best.rank)} · ${score}점 (최고)`}</div><div class="np-track"><div style="width:${Math.round(100*value/missionTotal)}%"></div></div><div class="np-caption">${value===0?'진행 전':value===missionTotal?'전체 미션 완료':`미션 ${value}까지 통과`}</div></article>`;
 }$('np-grid').innerHTML=html}
function clearBoard(){if(boardListener){boardListener.ref.off('value',boardListener.cb);boardListener=null}}
function loadBoard(){if(!user||!db)return;$('np-board-msg').textContent='현황을 불러오는 중…';const c=Number($('np-board-class').value);clearBoard();if(!valid(c,1))return;
 const ref=db.ref(`${ROOT}/c${c}/teams`);const cb=snap=>{ $('np-board-msg').textContent=''; if(board.classList.contains('show')&&Number($('np-board-class').value)===c)boardCards(snap.val()||{},c)};
 ref.on('value',cb,err=>{ $('np-grid').innerHTML=''; $('np-board-msg').textContent='현황판 접근 실패: '+err.message+'\nFirebase 콘솔 → Realtime Database → 규칙에서 v3.0 firebase.rules.json 전체를 붙여 넣고 [게시]를 눌러야 합니다. 교사 Google UID가 규칙에 포함되어 있는지도 확인하세요.'; });boardListener={ref,cb};
 $('np-board-info').textContent='학교 학생/등록 교사 Google 계정으로만 조회 · '+c+'반 15개 조 · 홍수 평가 최고 점수/등급';
}
function closeBoard(){board.classList.remove('show');clearBoard();if(boardFromGate&&!team){
  if(requireTeacher(user)){enterTeacherSimulator();}else{landing();gate.classList.add('show');}
 }refreshButtons()}
function showGate(){if(guestActive){showLogin();return}if(team){openEditor();return}if(requireTeacher(user)){enterTeacher();return}landing();gate.classList.add('show');refreshButtons()}
function showLogin(){if(guestActive){endGuest();landing();gate.classList.add('show');refreshButtons();return}if(team||requireTeacher(user)){signout();return}landing();gate.classList.add('show');refreshButtons()}
function setup(opts){callbacks=opts;missionTotal=opts.totalMissions||4;
 const buttons=document.createElement('div');buttons.style.cssText='display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto';
 buttons.innerHTML='<span id="np-save-label" class="np-saveinfo"></span><button id="np-save">💾 저장</button><button id="np-board-button">📊 현황판</button><button id="np-change">🚪 로그아웃</button>';
 opts.header.insertBefore(buttons,opts.header.lastElementChild);headerStatus=$('np-save-label');
 $('np-save').onclick=()=>saveNow('manual');$('np-board-button').onclick=()=>showBoard(false);
 $('np-enter-guest').onclick=enterGuest;$('np-change').onclick=()=>guestActive?showLogin():signout();
 $('np-role-student').onclick=()=>selectRole('student');$('np-role-teacher').onclick=teacherSubmit;
 $('np-back').onclick=landing;
 $('np-student-form').onsubmit=e=>{e.preventDefault();studentSubmit()};
 $('np-board-class').onchange=loadBoard;$('np-board-refresh').onclick=loadBoard;$('np-board-close').onclick=closeBoard;
 $('np-board-signout').onclick=signout;
 $('np-teacher-sim').onclick=()=>{if(requireTeacher(user))enterTeacherSimulator();else if(team){board.classList.remove('show');clearBoard()}else note('학생은 반·조에 먼저 등록해야 합니다.');refreshButtons()};
 if(!autosave)autosave=setInterval(()=>{if(team&&readyToSave&&!restoring&&opts.isLayerOpen?.()&&!opts.isBusy?.())saveNow('auto')},18000);
 refreshButtons();landing();gate.classList.add('show');
 return{showGate,showBoard,onEntryReady,saveNow,saveProgress,recordFloodResult,openEditor,closeEditing,enterTeacherSimulator,showLogin,signout,receiveFrameMessage,getTeam:()=>team,isGuest:()=>guestActive};
}
global.NepalClassroom={setup};
})(window);
