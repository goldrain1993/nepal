/* Independent 2026 assessment portal. Only a verified school Google UID, class and name
 * identify the student. The Nepal simulator team login is deliberately not read or modified.
 */
(function(global){
'use strict';
if(global.NepalAssessmentPortal)return;
const $=id=>document.getElementById(id);
const cfg=global.NEPAL_FIREBASE_CONFIG||{};
const ASSESS='nepal-v27/private/assessments';
const TEACHER_EMAIL='goldrain1993@gmail.com';
const PROFILE_KEY='nepal-assessment-student-profile-v2:';
const schoolDomain=String(cfg.schoolDomain||'').replace(/^@/,'').toLowerCase();
const allowedTeachers=Array.isArray(cfg.teacherUids)?cfg.teacherUids:[];
let fb=null,auth=null,db=null,me=null,student=null,role='',isEnabled=false,sequence=0,busy=false,releaseRef=null,releaseCb=null;
function status(message,error){
 const node=$('as-status');
 if(node){node.textContent=message||'';node.classList.toggle('as-error',!!error)}
}
function show(id,visible){const el=$(id);if(el)el.hidden=!visible}
function hasGoogle(user){return !!user?.emailVerified&&user.providerData?.some(p=>p.providerId==='google.com')}
function schoolUser(user){
 return !!(user&&hasGoogle(user)&&user.email?.toLowerCase().endsWith('@'+schoolDomain));
}
function teacherUser(user){
 return !!(user&&hasGoogle(user)&&user.email?.toLowerCase()===TEACHER_EMAIL&&allowedTeachers.includes(user.uid));
}
function accountClass(user){
 const m=/^26-1(\d{2})\d{2}@/.exec(String(user?.email||'').toLowerCase());
 if(!m)return null;
 const c=Number(m[1]);return c>=1&&c<=20?c:null;
}
function normalizedName(name){return String(name||'').trim().replace(/\s+/g,' ').slice(0,18)}
function readProfile(user,c){
 if(!user||!c)return null;
 try{
  const saved=JSON.parse(localStorage.getItem(PROFILE_KEY+user.uid)||'null');
  if(saved?.c===c&&normalizedName(saved.name))return {c,name:normalizedName(saved.name)};
 }catch(_){}
 return null;
}
function saveProfile(user,data){
 try{localStorage.setItem(PROFILE_KEY+user.uid,JSON.stringify(data))}
 catch(error){console.warn('수행평가 이름 로컬 저장 실패',error)}
}
function stopClassRelease(){
 if(releaseRef&&releaseCb)releaseRef.off('value',releaseCb);
 releaseRef=null;releaseCb=null;isEnabled=false;
}
function watchClassRelease(user){
 stopClassRelease();
 const clazz=accountClass(user);
 if(!clazz||!db)return;
 const ref=db.ref(ASSESS+'/config/enabledByClass/c'+clazz);
 const cb=snapshot=>{
  if(me?.uid!==user.uid||role!=='student')return;
  isEnabled=snapshot.val()===true;
  render();
 };
 releaseRef=ref;releaseCb=cb;
 ref.on('value',cb,error=>{
  if(me?.uid!==user.uid)return;
  isEnabled=false;render();
  status('학급별 공개 설정을 불러오지 못했습니다. Firebase 규칙 배포를 확인해 주세요: '+String(error.code||error.message||error),true);
 });
}

function render(){
 const signed=role==='teacher'||role==='student';
 show('as-login',!signed);
 show('as-signed',signed);
 show('as-member',role==='student'&&!student);
 show('as-ready',role==='teacher'||role==='student'&&!!student);
 if(signed){
  $('as-signed-name').textContent=role==='teacher'?'🧑‍🏫 교사 계정 인증 완료':'🎒 학교 Google 계정 인증 완료';
  $('as-signed-info').textContent=role==='teacher'?'교사 전용 제출·채점 관리':student?student.c+'반 · '+student.name:'반과 이름을 확인해 주세요. 조 정보는 사용하지 않습니다.';
 }
 if(role==='teacher'){
  $('as-ready-title').textContent='교사 수행평가 관리';
  $('as-ready-info').textContent='개인별 제출 기록과 AI 1차 채점·교사 확정 점수를 확인합니다.';
  $('as-open').textContent='🧑‍🏫 제출·채점 관리 열기';
  $('as-open').disabled=busy;
 }else if(role==='student'&&student){
  $('as-ready-title').textContent=student.c+'반 · '+student.name;
  $('as-ready-info').textContent=isEnabled?'조와 관계없이 학교 계정으로 개인별 수행평가에 입장할 수 있습니다.':'현재 반의 수행평가가 아직 공개되지 않았습니다.';
  $('as-open').textContent='📝 수행평가 시작';
  $('as-open').disabled=!isEnabled||busy;
 }
 if(!signed)status('학생 또는 교사 로그인을 선택해 주세요.');
 else if(role==='student'&&!accountClass(me))status('2026학년도 1학년 학교 계정(26-1반번호학번)으로 로그인해 주세요.',true);
 else if(role==='student'&&!student)status('본인의 반과 이름만 확인하면 수행평가를 시작할 수 있습니다.');
 else if(role==='student'&&!isEnabled)status('수행평가가 아직 비공개 상태입니다. 선생님의 안내를 확인하세요.');
 else status('');
}
async function syncUser(user){
 const ticket=++sequence;
 stopClassRelease();me=user;role=teacherUser(user)?'teacher':schoolUser(user)?'student':'';student=null;
 if(role==='student'){
  const c=accountClass(user);
  const field=$('as-class');
  if(field){field.value=c?String(c):'';field.disabled=!!c}
  const stored=readProfile(user,c);
  if(ticket!==sequence)return;
  student=stored;
  if($('as-name'))$('as-name').value=stored?.name||normalizedName(user.displayName);
  watchClassRelease(user);
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
 }catch(err){status('로그인 확인 실패: '+String(err.message||err),true)}
 finally{busy=false;$('as-login-student').disabled=false;$('as-login-teacher').disabled=false;render()}
}
function confirmStudent(event){
 event.preventDefault();
 if(busy||role!=='student'||!me)return;
 const c=Number($('as-class').value),name=normalizedName($('as-name').value),fromEmail=accountClass(me);
 if(!fromEmail||c!==fromEmail){status('학교 Google 계정에 표시된 반과 선택한 반이 다릅니다.',true);return}
 if(!name){status('본인 이름을 입력해 주세요.',true);return}
 student={c,name};saveProfile(me,student);render();
}
async function launchAssessment(){
 if(busy||!me||!(role==='teacher'||role==='student'&&student))return;
 if(role==='student'&&!isEnabled){status('현재 반의 수행평가가 아직 공개되지 않았습니다.',true);return}
 busy=true;$('as-open').disabled=true;
 status('수행평가를 불러오는 중…');
 try{
  if(!global.NepalAssessment?.open)throw Error('수행평가 프로그램을 불러오지 못했습니다. 새로고침해 주세요.');
  await global.NepalAssessment.open({fb,db,user:me,student:role==='student'?student:null,isTeacher:role==='teacher'});
  status('');
 }catch(err){status('수행평가 열기 실패: '+String(err.message||err),true)}
 finally{busy=false;$('as-open').disabled=role==='student'&&!isEnabled}
}
async function logOut(){
 if(busy)return;
 busy=true;
 try{
  stopClassRelease();await auth.signOut();me=null;student=null;role='';render();
 }catch(err){status('로그아웃 실패: '+String(err.message||err),true)}
 finally{busy=false}
}
async function init(){
 $('as-login-student').onclick=()=>signIn('student');
 $('as-login-teacher').onclick=()=>signIn('teacher');
 $('as-logout').onclick=logOut;
 $('as-switch-user').onclick=()=>signIn('student');
 $('as-member').onsubmit=confirmStudent;
 $('as-open').onclick=launchAssessment;
 for(let i=1;i<=20;i++){
  const opt=document.createElement('option');opt.value=String(i);opt.textContent=i+'반';
  $('as-class').appendChild(opt);
 }
 try{
  if(!cfg.apiKey||!cfg.authDomain||!cfg.databaseURL||!cfg.appId||!schoolDomain)throw Error('Firebase 설정이 누락되었습니다.');
  fb=global.firebase;
  const config={apiKey:cfg.apiKey,authDomain:cfg.authDomain,databaseURL:cfg.databaseURL,projectId:cfg.projectId,appId:cfg.appId};
  if(!fb.apps.length)fb.initializeApp(config);
  auth=fb.auth();db=fb.database();
  await auth.setPersistence(fb.auth.Auth.Persistence.LOCAL);
  auth.onAuthStateChanged(user=>syncUser(user).catch(err=>status('로그인 확인 실패: '+String(err.message||err),true)),
   err=>status('Firebase 로그인 상태 확인 실패: '+String(err.message||err),true));
 }catch(err){
  status('Firebase 초기화 실패: '+String(err.message||err),true);
  $('as-login-student').disabled=true;$('as-login-teacher').disabled=true;
 }
}
global.NepalAssessmentPortal={init,parseClass:accountClass};
init();
})(window);
