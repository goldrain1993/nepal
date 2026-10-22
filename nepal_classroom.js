/** NEPAL × ENTRY v2.7 — two individually authenticated Google accounts per group.
 * Public board = signed-in school accounts only; code/progress = group members only.
 * Firebase rules are the authorization boundary, not this browser code.
 */
(function(global){
'use strict';
if(global.NepalClassroom)return;
const CLASS_COUNT=11,GROUP_COUNT=15,MAX_PROJECT_SIZE=1250000,MAX_NAME=18;
const ROOT='nepal-v27/public/classes',PRIVATE='nepal-v27/private/classes',BACKUP='nepal-entry-v27-backup:',LOCK_MS=120000;
const css=document.createElement('style');
css.textContent=`
#np-gate,#np-board{position:fixed;inset:0;z-index:15000;background:rgba(2,11,7,.96);color:#edffdf;display:none;overflow:auto;font:14px/1.6 system-ui,'Malgun Gothic',sans-serif}
#np-gate.show,#np-board.show{display:block}.np-wrap{width:min(930px,calc(100vw - 28px));margin:4vh auto 38px;padding:25px;background:linear-gradient(140deg,#11251a,#07120c);border:1px solid #426649;border-radius:19px;box-shadow:0 25px 85px #000b}
.np-wrap *{box-sizing:border-box}.np-title{font-size:26px;font-weight:900;color:#baf67b}.np-sub{color:#a6c0a8;font-size:12px}
.np-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0}.np-field{display:flex;flex-direction:column;gap:6px;font-weight:750}
.np-field input,.np-field select,#np-board-class{width:100%;border:1px solid #527c51;border-radius:9px;background:#0b1a11;color:#fff;min-height:44px;padding:8px 10px;font-size:14px}
.np-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:15px}.np-btn{background:#b1f47b;color:#122912;border:0;border-radius:9px;padding:11px 17px;font-weight:850;cursor:pointer;font-size:14px}.np-btn.alt{background:#183922;color:#efffe5;border:1px solid #4d7150}.np-btn:disabled{opacity:.52;cursor:not-allowed}
.np-note{background:#18271b;border:1px solid #425b3b;border-radius:9px;padding:11px;color:#dcecd5;font-size:12px;margin:11px 0}.np-alert{color:#ffc0a2;border-color:#825041}
.np-msg{white-space:pre-wrap;min-height:22px;color:#def4cd;font-size:12px;margin-top:11px}.np-head{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}.np-head select{min-width:125px;width:auto}
.np-boardgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.np-team{background:#0e2017;border:1px solid #2a5636;border-radius:12px;padding:14px;min-height:123px}.np-team.mine{outline:2px solid #a9ed70}
.np-teamhead{display:flex;justify-content:space-between;font-size:15px;font-weight:900}.np-members{font-size:13px;color:#e7f3da;margin-top:7px;overflow-wrap:anywhere;min-height:23px}
.np-track{height:8px;background:#304334;border-radius:10px;overflow:hidden;margin-top:12px}.np-track div{height:100%;background:linear-gradient(90deg,#6cb041,#deff9a)}.np-caption{font-size:11px;color:#b5cbb2;margin-top:7px}.np-saveinfo{max-width:260px;font-size:11px;color:#d4e5b9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media(max-width:760px){.np-form{grid-template-columns:1fr}.np-boardgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.np-wrap{padding:16px}}@media(max-width:470px){.np-boardgrid{grid-template-columns:1fr}}
`;
document.head.appendChild(css);
const gate=document.createElement('section'),board=document.createElement('section');gate.id='np-gate';board.id='np-board';document.body.append(gate,board);
const classOpts=Array.from({length:CLASS_COUNT},(_,i)=>`<option value="${i+1}">${i+1}반</option>`).join('');
const groupOpts=Array.from({length:GROUP_COUNT},(_,i)=>`<option value="${i+1}">${i+1}조</option>`).join('');
gate.innerHTML=`<div class="np-wrap"><div class="np-title">NEPAL × ENTRY <span style="font-size:13px;color:#e9ffdf">CLASSROOM · v2.7</span></div>
<p>조원 두 명이 <b>각자의 학교 구글 계정</b>으로 로그인해 같은 반·조를 선택하세요.</p>
<div class="np-actions"><button id="np-google" class="np-btn" type="button">Google 학교 계정으로 로그인</button><button id="np-signout" class="np-btn alt" type="button">로그아웃 / 계정 변경</button></div>
<div id="np-auth-status" class="np-note">Firebase 연결을 확인하는 중…</div>
<div class="np-form"><label class="np-field">① 반 선택<select id="np-class">${classOpts}</select></label><label class="np-field">② 조 선택<select id="np-group">${groupOpts}</select></label><label class="np-field">③ 내 이름<input id="np-name" maxlength="${MAX_NAME}" autocomplete="off" placeholder="로그인한 학생 본인 이름"/></label></div>
<div id="np-member-preview" class="np-note">로그인 후 반과 조를 선택하면 등록 현황을 확인할 수 있어요.</div>
<div class="np-note">첫 번째 학생이 조에 가입하고, 두 번째 학생도 <b>자기 구글 계정으로 로그인한 뒤 동일한 반·조에 가입</b>합니다. 두 사람의 미션 진행도와 엔트리 블록 프로젝트가 공유됩니다. 한 번에 한 명만 편집할 수 있습니다.</div>
<div class="np-note np-alert">⚠ 현황판의 두 학생 이름은 학교 계정으로 로그인한 사용자에게 표시됩니다. 학교 외부 접근을 막으려면 설정 파일과 Firebase 보안 규칙에 <b>실제 학교 이메일 도메인</b>을 입력하세요. 두 명 중 첫 번째/두 번째 자리는 선착순입니다. 반·조 도용 방지를 위해 학교에서 조 편성을 안내하세요.</div>
<div class="np-actions"><button class="np-btn" id="np-enter">내 조 코딩 시작하기 →</button><button class="np-btn alt" id="np-board-gate">📊 15개 조 현황판</button><button class="np-btn alt" id="np-cancel">닫기</button></div><div class="np-msg" id="np-gate-msg" aria-live="polite"></div></div>`;
board.innerHTML=`<div class="np-wrap"><div class="np-head"><div><div class="np-title">📊 조별 미션 현황판</div><div class="np-sub" id="np-board-info">학교 구글 계정 로그인 필요</div></div><label>반 선택 <select id="np-board-class">${classOpts}</select></label></div><div class="np-boardgrid" id="np-grid"></div><div class="np-actions"><button class="np-btn alt" id="np-board-close">← 돌아가기</button><button class="np-btn alt" id="np-board-refresh">↻ 새로고침</button></div><div class="np-msg" id="np-board-msg"></div></div>`;
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanName=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,MAX_NAME);
function valid(c,g){return Number.isInteger(c)&&c>=1&&c<=11&&Number.isInteger(g)&&g>=1&&g<=15}
function src(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=()=>reject(Error('스크립트 다운로드 실패: '+url));document.head.appendChild(s)})}
let fb=null,db=null,auth=null,user=null,schoolDomain='',initError='',initDone=false;
let team=null,role=null,editorLockHeld=false,codeListener=null,boardListener=null,projectToRestore=null;
let progress=0,missionTotal=4,callbacks={},saveBusy=false,queued=false,readyToSave=false,restoring=false,importPending=null,exportPending=null,rpcId=0,headerStatus=null,lastSaved='',autosave=null,lockRefresh=null,lockedTeamPath='';
function teamPath(c,g){return `${ROOT}/c${c}/teams/g${g}`}
function workPath(c,g){return `${PRIVATE}/c${c}/teams/g${g}`}
function backupKey(){return team&&user?BACKUP+user.uid+':c'+team.c+'g'+team.g:null}
function localBackUp(project){const key=backupKey();if(!key)return;try{localStorage.setItem(key,JSON.stringify({project,updatedAt:Date.now()}))}catch(e){console.warn('로컬 보조 백업 공간 부족',e)}}
function localRestore(){try{return JSON.parse(localStorage.getItem(backupKey())||'null')}catch(_){return null}}
function note(m){if(headerStatus)headerStatus.textContent=m;const el=$('np-gate-msg');if(el)el.textContent=m}
function sayAuth(m){$('np-auth-status').textContent=m}
function requireSchool(u){return !!(u&&u.emailVerified&&u.providerData.some(p=>p.providerId==='google.com')&&u.email?.toLowerCase().endsWith('@'+schoolDomain))}
async function init(){
 try{
  await src('./nepal_firebase_config.js?v=27');
  const cfg=global.NEPAL_FIREBASE_CONFIG||{};
  schoolDomain=String(cfg.schoolDomain||'').trim().toLowerCase().replace(/^@/,'');
  if(!cfg.apiKey||!cfg.authDomain||!cfg.databaseURL||!cfg.projectId||!cfg.appId||!schoolDomain||schoolDomain.includes('your_')||!schoolDomain.includes('.'))throw Error('nepal_firebase_config.js에 Firebase 웹 앱 설정값과 학교 이메일 도메인(schoolDomain)을 입력해야 합니다.');
  for(const n of ['firebase-app-compat','firebase-auth-compat','firebase-database-compat'])await src(`https://www.gstatic.com/firebasejs/10.14.1/${n}.js`);
  fb=global.firebase;fb.initializeApp({apiKey:cfg.apiKey,authDomain:cfg.authDomain,databaseURL:cfg.databaseURL,projectId:cfg.projectId,appId:cfg.appId});db=fb.database();auth=fb.auth();
  await auth.setPersistence(fb.auth.Auth.Persistence.LOCAL);
  await new Promise(resolve=>{const off=auth.onAuthStateChanged(u=>{user=u&&requireSchool(u)?u:null;
    if(u&&!user)sayAuth('⚠ 학교 도메인 '+schoolDomain+'의 Google 계정만 이용할 수 있습니다. 다른 계정으로 다시 로그인하세요.');
    else sayAuth(user?'✓ 로그인: '+user.displayName+' ('+user.email+')':'Google 학교 계정으로 로그인해 주세요.');
    refreshButtons();if(user)loadTeamPreview();if(board.classList.contains('show'))loadBoard();resolve();off();
  },e=>{initError=e.message;resolve();});});
  auth.onAuthStateChanged(u=>{user=u&&requireSchool(u)?u:null;
    sayAuth(user?'✓ 로그인: '+user.displayName+' ('+user.email+')':u?'⚠ 학교 계정 도메인이 일치하지 않습니다. 계정을 변경해 주세요.':'Google 학교 계정으로 로그인해 주세요.');
    refreshButtons();if(user)loadTeamPreview();if(board.classList.contains('show'))loadBoard();
  });
 }catch(e){initError=String(e.message||e);sayAuth('설정 필요: '+initError);}
 finally{initDone=true;refreshButtons()}
}
const initReady=init();
function refreshButtons(){if(!$('np-enter'))return;$('np-google').disabled=!initDone||!auth;$('np-enter').disabled=!user||!db;$('np-signout').disabled=!auth;$('np-board-gate').disabled=!user||!db}
async function login(){await initReady;if(!auth){note('Firebase 설정을 먼저 완료해 주세요: '+initError);return}
 try{const p=new fb.auth.GoogleAuthProvider();if(schoolDomain)p.setCustomParameters({hd:schoolDomain,prompt:'select_account'});const result=await auth.signInWithPopup(p);if(!requireSchool(result.user)){await auth.signOut();throw Error('허용된 학교 계정(@'+schoolDomain+')으로 로그인해 주세요.')}note('✓ 학교 계정 로그인 성공. 반·조를 선택하세요.');}
 catch(e){note('Google 로그인 실패: '+String(e.message||e)+'\n학교 관리자의 외부 앱 승인, Firebase Google 로그인 사용 설정 및 승인된 도메인(goldrain1993.github.io)을 확인하세요.')}
}
async function signout(){if(team)await leaveTeam();await auth?.signOut();note('로그아웃했습니다. 조원 B는 자신의 계정으로 로그인할 수 있습니다.')}
function identify(members){if(!user)return null;for(const key of ['student1','student2'])if(members?.[key]?.uid===user.uid)return key;return null}
function memberNames(members){return ['student1','student2'].map((slot,i)=>members?.[slot]?.displayName||`${i+1}번 조원 미등록`).join(' · ')}
async function loadTeamPreview(){if(!user||!db)return;const c=Number($('np-class').value),g=Number($('np-group').value);if(!valid(c,g))return;
 try{const snap=await db.ref(teamPath(c,g)+'/members').once('value');if(c!==Number($('np-class').value)||g!==Number($('np-group').value))return;
   const members=snap.val()||{};$('np-member-preview').textContent=`${c}반 ${g}조 · ${memberNames(members)}${identify(members)?' · 이미 내 계정이 등록된 조입니다.':''}`;
   const mine=identify(members);if(mine&&members[mine]?.displayName)$('np-name').value=members[mine].displayName;
   else if(!$('np-name').value)$('np-name').value=cleanName(user.displayName);
 }catch(e){$('np-member-preview').textContent='조 현황 확인 실패: '+e.message}
}
async function joinTeam(){await initReady;if(!user||!db){note('먼저 학교 Google 계정으로 로그인해 주세요.');return}
 const c=Number($('np-class').value),g=Number($('np-group').value),displayName=cleanName($('np-name').value);
 if(!valid(c,g)||!displayName){note('반·조와 본인의 이름을 입력해 주세요.');return}
 $('np-enter').disabled=true;note('조원 계정과 저장된 프로젝트를 확인하고 있습니다…');
 try{
  if(team&&(team.c!==c||team.g!==g))await leaveTeam();
  const root=teamPath(c,g);const memRef=db.ref(root+'/members');let members=(await memRef.once('value')).val()||{};
  let slot=identify(members);
  if(!slot){slot=!members.student1?'student1':!members.student2?'student2':null;
    if(!slot)throw Error('이 조에는 이미 두 명의 Google 계정이 등록되어 있습니다. 반·조 선택을 확인해 주세요.');
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
  const lock=await db.ref(workPath(c,g)+'/editorLock').transaction(old=>{
    if(old && old.uid!==user.uid && Number(old.updatedAt)>Date.now()-LOCK_MS)return;
    return {uid:user.uid,updatedAt:fb.database.ServerValue.TIMESTAMP};
  },()=>{},false);
  if(!lock.committed)throw Error('같은 조의 다른 조원이 현재 엔트리를 편집 중입니다. 다른 조원이 「조 종료」를 누른 뒤 다시 입장해 주세요. (2분간 활동이 없으면 재입장 가능)');
  editorLockHeld=true;lockedTeamPath=workPath(c,g);
  team={c,g};role=slot;readyToSave=false;progress=0;lastSaved='';
  const [progressSnap,codeSnap]=await Promise.all([db.ref(root+'/progress').once('value'),db.ref(workPath(c,g)+'/code').once('value')]);
  progress=Math.max(0,Math.min(missionTotal,Number(progressSnap.val()?.completed)||0));
  const cloudCode=codeSnap.val();const local=localRestore();
  // Cloud source is canonical. Local backup only helps after a previous failed upload.
  try{projectToRestore=cloudCode?.payload?JSON.parse(cloudCode.payload):(local?.project||null)}catch(e){throw Error('온라인 엔트리 코드의 저장 형식이 손상되었습니다: '+e.message)}
  callbacks.resetEditor?.();callbacks.restoreProgress?.(progress);
  gate.classList.remove('show');callbacks.launchEditor?.();
  note('✓ '+c+'반 '+g+'조 · '+memberNames(members)+' · Google 계정으로 인증됨');
  startLockRefresh();
 }catch(e){note('입장 실패: '+String(e.message||e));if(editorLockHeld){await releaseLock().catch(()=>{});team=null;readyToSave=false}}
 finally{refreshButtons()}
}
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
async function switchTeam(){await leaveTeam();gate.classList.add('show');loadTeamPreview()}
function receiveFrameMessage(d){if(d.type==='ENTRY_PROJECT_EXPORTED'&&exportPending?.token===d.token){const x=exportPending;exportPending=null;clearTimeout(x.timeout);x.resolve(d.project)}
 if(d.type==='ENTRY_PROJECT_EXPORT_ERROR'&&exportPending?.token===d.token){const x=exportPending;exportPending=null;clearTimeout(x.timeout);x.reject(Error(d.message||'내보내기 실패'))}
 if(d.type==='ENTRY_PROJECT_IMPORTED'&&importPending?.token===d.token){const x=importPending;importPending=null;clearTimeout(x.timeout);d.ok?x.resolve():x.reject(Error(d.message||'코드 불러오기 실패'))}
}
function rpc(action,project){return new Promise((resolve,reject)=>{
 const token=++rpcId,timeout=setTimeout(()=>{if(action==='export')exportPending=null;else importPending=null;reject(Error('엔트리 '+action+' 시간 초과'))},19000);
 const p={resolve,reject,token,timeout};if(action==='export')exportPending=p;else importPending=p;
 callbacks.iframe.contentWindow?.postMessage(action==='export'?{type:'NEPAL_EXPORT_PROJECT',token}:{type:'NEPAL_IMPORT_PROJECT',token,project},location.origin);
})}
async function onEntryReady(){if(!team||!editorLockHeld)return;readyToSave=false;restoring=true;
 try{if(projectToRestore?.objects&&Array.isArray(projectToRestore.objects)){note('저장된 엔트리 블록을 복원하는 중…');await rpc('import',projectToRestore);note('✓ 이전 조별 엔트리 블록 복원 완료');}
   else note('새 조의 엔트리 작업을 시작합니다.');readyToSave=true;
 }catch(e){note('⚠ 블록 복원 실패: '+e.message+' · 기존 파일 보호를 위해 자동 저장을 중지합니다.');}
 finally{restoring=false}}
async function saveNow(reason='manual'){
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
async function saveProgress(n){if(!team||!user||!editorLockHeld)return;
 const value=Math.max(progress,Math.min(missionTotal,Math.max(0,Number(n)||0)));progress=value;
 try{await db.ref(teamPath(team.c,team.g)+'/progress').transaction(old=>({completed:Math.max(Number(old?.completed)||0,value),updatedAt:fb.database.ServerValue.TIMESTAMP}),()=>{},false);
 note('✓ 미션 '+value+'까지 통과 · 온라인 저장 완료');}
 catch(e){note('⚠ 미션 진행도 저장 실패: '+e.message)}
}
let boardFromGate=true;
function showBoard(fromGate){if(!user||!db){note('먼저 학교 계정으로 로그인하세요.');gate.classList.add('show');return}
 boardFromGate=fromGate||gate.classList.contains('show');$('np-board-class').value=String(team?.c||$('np-class').value||1);gate.classList.remove('show');board.classList.add('show');loadBoard()}
function boardCards(data,c){let html='';for(let g=1;g<=GROUP_COUNT;g++){
 const d=data?.['g'+g]||{},mem=d.members||{};const value=Math.max(0,Math.min(missionTotal,Number(d.progress?.completed)||0));const mine=team?.c===c&&team?.g===g;
 html+=`<article class="np-team ${mine?'mine':''}"><div class="np-teamhead"><span>${g}조 ${mine?'(우리 조)':''}</span><span>${value}/${missionTotal}</span></div><div class="np-members">${esc(memberNames(mem))}</div><div class="np-track"><div style="width:${Math.round(100*value/missionTotal)}%"></div></div><div class="np-caption">${value===0?'진행 전':value===missionTotal?'전체 미션 완료':`미션 ${value}까지 통과`}</div></article>`;
 }$('np-grid').innerHTML=html}
function clearBoard(){if(boardListener){boardListener.ref.off('value',boardListener.cb);boardListener=null}}
function loadBoard(){if(!user||!db)return;const c=Number($('np-board-class').value);clearBoard();if(!valid(c,1))return;
 const ref=db.ref(`${ROOT}/c${c}/teams`);const cb=snap=>{if(board.classList.contains('show')&&Number($('np-board-class').value)===c)boardCards(snap.val()||{},c)};
 ref.on('value',cb,err=>{$('np-board-msg').textContent='현황 불러오기 실패: '+err.message});boardListener={ref,cb};
 $('np-board-info').textContent='학교 Google 계정 사용자에게만 공개 · '+c+'반 15개 조';
}
function closeBoard(){board.classList.remove('show');clearBoard();if(boardFromGate||!team)gate.classList.add('show')}
function showGate(){board.classList.remove('show');if(team){callbacks.launchEditor?.();return}gate.classList.add('show');loadTeamPreview()}
function setup(opts){callbacks=opts;missionTotal=opts.totalMissions||4;
 const buttons=document.createElement('div');buttons.style.cssText='display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto';
 buttons.innerHTML='<span id="np-save-label" class="np-saveinfo">조원 로그인 대기</span><button id="np-save">💾 저장</button><button id="np-board-button">📊 현황판</button><button id="np-change">🔄 조 종료</button>';
 opts.header.insertBefore(buttons,opts.header.lastElementChild);headerStatus=$('np-save-label');
 $('np-save').onclick=()=>saveNow('manual');$('np-board-button').onclick=()=>showBoard(false);$('np-change').onclick=switchTeam;
 $('np-google').onclick=login;$('np-signout').onclick=signout;$('np-enter').onclick=joinTeam;$('np-board-gate').onclick=()=>showBoard(true);$('np-cancel').onclick=()=>gate.classList.remove('show');
 $('np-class').onchange=()=>{$('np-name').value='';loadTeamPreview()};$('np-group').onchange=()=>{$('np-name').value='';loadTeamPreview()};
 $('np-board-class').onchange=loadBoard;$('np-board-refresh').onclick=loadBoard;$('np-board-close').onclick=closeBoard;
 if(!autosave)autosave=setInterval(()=>{if(team&&readyToSave&&!restoring&&opts.isLayerOpen?.()&&!opts.isBusy?.())saveNow('auto')},18000);
 refreshButtons();return{showGate,showBoard,onEntryReady,saveNow,saveProgress,receiveFrameMessage,getTeam:()=>team};
}
global.NepalClassroom={setup};
})(window);
