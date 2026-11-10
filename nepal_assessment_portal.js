/* NEPAL FLOOD standalone 2026 assessment portal.
 * Shares the exact Firebase Authentication app/project with the main simulator.
 * A student's team is ALWAYS verified against its saved Firebase UID membership.
 */
(function(global){
'use strict';
if(global.NepalAssessmentPortal)return;
const $=id=>document.getElementById(id);
const cfg=global.NEPAL_FIREBASE_CONFIG||{};
const ROOT='nepal-v27/public/classes';
const WORK='nepal-v27/private/classes';
const ASSESS='nepal-v27/private/assessments';
const TEACHER_EMAIL='goldrain1993@gmail.com';
const SESSION='nepal-v27-student-tab-session';
const TEACHER_SESSION='nepal-v27-teacher-tab-session';
const TRIPLES=new Set(['1-13','2-2','3-15','5-2','7-6','8-2','9-1','10-4','11-6']);
const schoolDomain=String(cfg.schoolDomain||'').replace(/^@/,'').toLowerCase();
const allowedTeachers=Array.isArray(cfg.teacherUids)?cfg.teacherUids:[];
let fb=null,auth=null,db=null,me=null,team=null,memberName='',role='',isEnabled=false,sequence=0,busy=false;
function status(message,error){
 const node=$('as-status');
 if(node){node.textContent=message||'';node.classList.toggle('as-error',!!error)}
}
function show(id,visible){
 const el=$(id);if(el)el.hidden=!visible;
}
function schoolUser(user){
 return !!(user&&user.emailVerified&&user.providerData?.some(p=>p.providerId==='google.com')&&
  user.email?.toLowerCase().endsWith('@'+schoolDomain));
}
function teacherUser(user){
 return !!(user&&user.emailVerified&&user.providerData?.some(p=>p.providerId==='google.com')&&
  user.email?.toLowerCase()===TEACHER_EMAIL&&allowedTeachers.includes(user.uid));
}
function accountClass(user){
 const m=/^26-1(\d{2})\d{2}@/.exec(String(user?.email||'').toLowerCase());
 if(!m)return null;
 const c=Number(m[1]);return c>=1&&c<=20?c:null;
}
function readSession(){
 try{return JSON.parse(sessionStorage.getItem(SESSION)||'null')}catch(_){return null}
}
function rememberStudent(c,g,slot){
 try{sessionStorage.setItem(SESSION,JSON.stringify({role:'student',uid:me.uid,c,g,slot,editor:false}))}
 catch(err){console.warn('학생 접속 상태 기억 실패',err)}
}
function findMember(members,uid){
 return ['student1','student2','student3'].find(slot=>members?.[slot]?.uid===uid)||null;
}
async function restoreTeam(user){
 const saved=readSession();
 if(saved?.role==='student'&&saved.uid===user.uid&&
    Number.isInteger(saved.c)&&saved.c>=1&&saved.c<=20&&
    Number.isInteger(saved.g)&&saved.g>=1&&saved.g<=30&&
    ['student1','student2','student3'].includes(saved.slot)){
  const member=(await db.ref(ROOT+'/c'+saved.c+'/teams/g'+saved.g+'/members/'+saved.slot).once('value')).val();
  if(member?.uid===user.uid){
   memberName=String(member.displayName||'학생');
   return {c:saved.c,g:saved.g,slot:saved.slot};
  }
 }
 // When the separate URL is opened in another tab, sessionStorage may not be
 // present. Use only the class encoded in the authenticated school account.
 const c=accountClass(user);
 if(c){
  const snap=await db.ref(ROOT+'/c'+c+'/teams').once('value');
  for(const [key,value] of Object.entries(snap.val()||{})){
   const match=/^g(\d+)$/.exec(key);
   if(!match)continue;
   const slot=findMember(value?.members,user.uid);
   if(slot){
    const g=Number(match[1]);
    if(g>=1&&g<=30){
     memberName=String(value.members[slot].displayName||'학생');
     rememberStudent(c,g,slot);
     return {c,g,slot};
    }
   }
  }
 }
 return null;
}
function render(){
 const signed=role==='teacher'||role==='student';
 show('as-login',!signed);
 show('as-signed',signed);
 show('as-member',role==='student'&&!team);
 show('as-ready',role==='teacher'||role==='student'&&!!team);
 if(signed){
  const title=role==='teacher'?'🧑‍🏫 교사 계정 인증 완료':'🎒 학교 Google 계정 인증 완료';
  $('as-signed-name').textContent=title;
  $('as-signed-info').textContent=role==='teacher'?'교사 전용 채점·제출 관리':(team?team.c+'반 '+team.g+'조 · '+memberName:'반·조 등록을 확인해 주세요.');
 }
 if(role==='teacher'){
  $('as-ready-title').textContent='교사 수행평가 관리';
  $('as-ready-info').textContent='학생 제출, AI 1차 채점 제안, 교사 최종 점수 확정 및 반별 성적표를 확인합니다.';
  $('as-open').textContent='🧑‍🏫 제출·채점 관리 열기';
 }else if(role==='student'&&team){
  $('as-ready-title').textContent=team.c+'반 '+team.g+'조 · '+memberName;
  $('as-ready-info').textContent=isEnabled?'학교 계정과 조 등록이 확인됐습니다. 개인별 수행평가에 입장할 수 있습니다.':'교사가 아직 수행평가 제출을 열지 않았습니다.';
  $('as-open').textContent='📝 수행평가 시작';
  $('as-open').disabled=!isEnabled||busy;
 }
 if(role==='teacher')$('as-open').disabled=busy;
 if(!signed)status('학생 또는 교사 로그인을 선택해 주세요.');
 else if(role==='student'&&!team)status('학생의 반·조·이름을 확인하면 수행평가를 시작할 수 있습니다.');
 else if(role==='student'&&!isEnabled)status('수행평가가 아직 비공개 상태입니다. 선생님의 안내를 확인하세요.');
 else status('');
}
async function syncUser(user){
 const ticket=++sequence;
 me=user;role=teacherUser(user)?'teacher':schoolUser(user)?'student':'';team=null;memberName='';
 if(!role){render();return}
 if(role==='student'){
  status('등록된 반·조를 확인하는 중…');
  try{team=await restoreTeam(user)}
  catch(err){if(ticket===sequence)status('반·조 자동 조회 실패: '+String(err.message||err)+'. 아래 입력란에 직접 입력해 주세요.',true)}
  if(ticket!==sequence)return;
  const known=accountClass(user),field=$('as-class');
  if(known&&field&&!field.value)field.value=String(known);
 }
 render();
}
async function signIn(kind){
 if(busy)return;
 busy=true;$('as-login-student').disabled=true;$('as-login-teacher').disabled=true;
 status('Google 계정 선택 창을 열고 있습니다…');
 try{
  const provider=new fb.auth.GoogleAuthProvider();
  provider.setCustomParameters(kind==='student'?{hd:schoolDomain,prompt:'select_account'}:{prompt:'select_account'});
  const result=await auth.signInWithPopup(provider);
  if(kind==='student'&&!schoolUser(result.user))throw Error('학생은 학교 Google 계정(@'+schoolDomain+')만 사용할 수 있습니다.');
  if(kind==='teacher'&&!teacherUser(result.user))throw Error('이 계정은 등록된 교사 계정이 아닙니다.');
  await syncUser(result.user);
 }catch(err){
  status('로그인 확인 실패: '+String(err.message||err),true);
 }finally{
  busy=false;$('as-login-student').disabled=false;$('as-login-teacher').disabled=false;
 }
}
async function populateGroups(){
 const c=Number($('as-class').value);
 const field=$('as-group');field.innerHTML='<option value="">선택</option>';
 if(!Number.isInteger(c)||c<1||c>20)return;
 let count=15;
 try{
  const raw=(await db.ref(ROOT+'/c'+c+'/settings/groupCount').once('value')).val();
  if(Number.isInteger(raw)&&raw>=15&&raw<=30)count=raw;
 }catch(err){console.warn('조 개수 확인:',err)}
 for(let i=1;i<=count;i++){
  const opt=document.createElement('option');opt.value=String(i);opt.textContent=i+'조';field.appendChild(opt);
 }
}
async function joinGroup(event){
 event.preventDefault();
 if(busy||role!=='student'||!me)return;
 const c=Number($('as-class').value),g=Number($('as-group').value),name=String($('as-name').value||'').trim().replace(/\s+/g,' ').slice(0,18);
 if(!Number.isInteger(c)||c<1||c>20||!Number.isInteger(g)||g<1||g>30||!name){
  status('반·조·학생 이름을 모두 입력해 주세요.',true);return;
 }
 const fromEmail=accountClass(me);
 if(fromEmail&&fromEmail!==c){
  status('현재 구글 계정의 반('+fromEmail+'반)과 선택한 반이 다릅니다. 본인 계정을 확인해 주세요.',true);return;
 }
 busy=true;$('as-link-team').disabled=true;
 status('본인 계정의 조 등록을 확인하는 중…');
 try{
  // Never join a second team when a registered membership already exists.
  const existing=await restoreTeam(me);
  if(existing&&existing.c!==c||existing&&existing.g!==g)
   throw Error('이 계정은 이미 '+existing.c+'반 '+existing.g+'조에 등록돼 있습니다. 해당 반·조를 사용해 주세요.');
  if(existing){
   team=existing;render();return;
  }
  const maxClass=Number((await db.ref(ROOT+'/settings/classCount').once('value')).val())||11;
  if(c>maxClass)throw Error(c+'반은 아직 개설되지 않았습니다.');
  const maxGroup=Number((await db.ref(ROOT+'/c'+c+'/settings/groupCount').once('value')).val())||15;
  if(g>maxGroup)throw Error(c+'반 '+g+'조는 아직 개설되지 않았습니다.');
  const base=ROOT+'/c'+c+'/teams/g'+g,ref=db.ref(base+'/members');
  let members=(await ref.once('value')).val()||{};
  let slot=findMember(members,me.uid);
  if(!slot){
   const cap=TRIPLES.has(c+'-'+g)?3:2;
   slot=['student1','student2','student3'].slice(0,cap).find(s=>!members[s]);
   if(!slot)throw Error('이 조에 등록 가능한 자리가 없습니다. 반·조를 확인해 주세요.');
   const own=db.ref(base+'/members/'+slot);
   const outcome=await own.transaction(old=>old===null?{uid:me.uid,displayName:name,joinedAt:fb.database.ServerValue.TIMESTAMP}:undefined,()=>{},false);
   if(!outcome.committed){
    members=(await ref.once('value')).val()||{};
    slot=findMember(members,me.uid);
    if(!slot)throw Error('조원 등록이 동시에 진행됐습니다. 다시 시도해 주세요.');
   }
  }
  members=(await ref.once('value')).val()||{};
  if(members[slot]?.uid!==me.uid)throw Error('조 계정 확인에 실패했습니다.');
  team={c,g,slot};memberName=String(members[slot].displayName||name);
  rememberStudent(c,g,slot);render();
 }catch(err){status('반·조 확인 실패: '+String(err.message||err),true)}
 finally{busy=false;$('as-link-team').disabled=false}
}
async function launchAssessment(){
 if(busy||!me||!(role==='teacher'||role==='student'&&team))return;
 if(role==='student'&&!isEnabled){status('교사가 아직 수행평가를 공개하지 않았습니다.',true);return}
 busy=true;$('as-open').disabled=true;
 status('수행평가 문제를 불러오는 중…');
 try{
  if(!global.NepalAssessment?.open)throw Error('수행평가 프로그램 로드 실패. 브라우저를 새로고침해 주세요.');
  await global.NepalAssessment.open({
   fb,db,user:me,team:role==='teacher'?null:team,
   isTeacher:role==='teacher',
   workPath:(c,g)=>WORK+'/c'+c+'/teams/g'+g
  });
  status('');
 }catch(err){status('수행평가 열기 실패: '+String(err.message||err),true)}
 finally{busy=false;$('as-open').disabled=role==='student'&&!isEnabled}
}
async function logOut(){
 if(busy)return;
 busy=true;
 try{
  sessionStorage.removeItem(SESSION);sessionStorage.removeItem(TEACHER_SESSION);
  await auth.signOut();me=null;team=null;role='';render();
 }catch(err){status('로그아웃 실패: '+String(err.message||err),true)}
 finally{busy=false}
}
async function init(){
 $('as-login-student').onclick=()=>signIn('student');
 $('as-login-teacher').onclick=()=>signIn('teacher');
 $('as-logout').onclick=logOut;
 $('as-switch-user').onclick=()=>signIn('student');
 $('as-member').onsubmit=joinGroup;
 $('as-class').onchange=populateGroups;
 $('as-open').onclick=launchAssessment;
 for(let i=1;i<=11;i++){
  const option=document.createElement('option');option.value=String(i);option.textContent=i+'반';$('as-class').appendChild(option);
 }
 await populateGroups();
 try{
  if(!cfg.apiKey||!cfg.authDomain||!cfg.databaseURL||!cfg.appId||!schoolDomain)throw Error('Firebase 설정이 누락되었습니다.');
  fb=global.firebase;
  const config={apiKey:cfg.apiKey,authDomain:cfg.authDomain,databaseURL:cfg.databaseURL,projectId:cfg.projectId,appId:cfg.appId};
  if(!fb.apps.length)fb.initializeApp(config);
  auth=fb.auth();db=fb.database();
  await auth.setPersistence(fb.auth.Auth.Persistence.LOCAL);
  db.ref(ASSESS+'/config/enabled').on('value',snap=>{
   isEnabled=snap.val()===true;render();
  },err=>{console.warn('수행평가 공개 상태:',err);isEnabled=false;render()});
  auth.onAuthStateChanged(user=>{syncUser(user).catch(err=>status('로그인 연결 확인 실패: '+String(err.message||err),true))},
   err=>status('Firebase 로그인 상태 확인 실패: '+String(err.message||err),true));
 }catch(err){
  status('Firebase 초기화 실패: '+String(err.message||err),true);
  $('as-login-student').disabled=true;$('as-login-teacher').disabled=true;
 }
}
global.NepalAssessmentPortal={init,parseClass:accountClass};
init();
})(window);
