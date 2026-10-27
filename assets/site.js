'use strict';
/* Plan académico: 33 unidades curriculares, según planilla interactiva facilitada.
   cA=aprobadas para cursar; cR=regulares para cursar; rA=aprobadas para rendir.
   Validar sus diferencias con el tríptico antes de uso como documento oficial. */
const carrera = [[1,1,"Pedagogía","G","Materia",0,"Anual",[],[],[]],[2,1,"Psicología Educacional","G","Materia",0,"Anual",[],[],[]],[3,1,"Alfabetización Académica","G","Taller",0,"1° Cuat.",[],[],[]],[4,1,"Didáctica General","G","Materia",0,"Anual",[],[],[]],[5,1,"Corporeidad, Juegos y Lenguajes Artísticos","E","Taller",0,"Anual",[],[],[]],[6,1,"Sujeto de la Educación Inicial","E","Materia",0,"Anual",[],[],[]],[7,1,"Problemáticas Contemporáneas de la Educ. Inicial","E","Seminario",0,"2° Cuat.",[],[],[]],[8,1,"Práctica I: Instituciones Educativas y Contexto","P","T. de Campo",0,"Anual",[],[],[]],[9,2,"Filosofía","G","Materia",0,"Anual",[],[],[]],[10,2,"Historia y Política de la Educación Argentina","G","Seminario",0,"Anual",[],[1],[1]],[11,2,"Sociología de la Educación","G","Materia",0,"Anual",[],[1],[1]],[12,2,"Didáctica de la Educación Inicial I","E","Materia",0,"Anual",[],[4,6,7],[4,6,7]],[13,2,"Desarrollo del Lenguaje y Literatura Infantil","E","Materia",0,"Anual",[],[3,6],[3,6]],[14,2,"Matemática y su Didáctica I","E","Materia",0,"Anual",[],[4],[4]],[15,2,"Ciencias Naturales y su Didáctica","E","Materia",0,"Anual",[],[4],[4]],[16,2,"Ciencias Sociales y su Didáctica","E","Materia",0,"Anual",[],[4],[4]],[17,2,"Educación Artística (Plástica, Música y Exp. Corporal)","E","Taller",0,"Anual",[],[5],[5]],[18,2,"Práctica II: Gestión Institucional y Curricular","P","T. de Campo",0,"Anual",[8],[1,4,6],[1,4,6,8]],[19,3,"Educación Sexual Integral","G","Seminario",0,"1° Cuat.",[],[2,6],[2,6]],[20,3,"Integración de las TIC en el Nivel Inicial","G","Taller",0,"2° Cuat.",[3],[4],[3,4]],[21,3,"Didáctica de la Educación Inicial II","E","Materia",0,"Anual",[4,6,7],[12],[4,6,7,12]],[22,3,"Lengua y Literatura y su Didáctica","E","Materia",0,"Anual",[3],[13],[3,13]],[23,3,"Matemática y su Didáctica II","E","Materia",0,"Anual",[4],[14],[4,14]],[24,3,"Educación Física en el Nivel Inicial","E","Materia",0,"Anual",[5],[6],[5,6]],[25,3,"Juego y Producción de Objetos Lúdicos","E","Taller",0,"Anual",[5],[12,17],[5,12,17]],[26,3,"Jardín Maternal: Sujetos y Prácticas","E","Seminario",0,"Anual",[6],[12],[6,12]],[27,3,"Práctica III: Prácticas de Enseñanza en Jardín Maternal y de Infantes","P","Práct. Doc.",0,"Anual",[1,2,3,4,5,6,7,8,18],[12,13,14,15,16],[12,13,14,15,16,18]],[28,4,"Ética Profesional Docente y Derechos Humanos","G","Seminario",0,"1° Cuat.",[],[9,11],[9,11]],[29,4,"Atención Temprana e Inclusión Educativa","E","Seminario",0,"Anual",[6,12],[21,26],[6,12,21,26]],[30,4,"Gestión y Organización en el Nivel Inicial","E","Seminario",0,"2° Cuat.",[8,18],[10,21],[10,18,21]],[31,4,"Ateneo de Prácticas del Lenguaje y Literatura","E","Ateneo",0,"Anual",[13],[22],[13,22]],[32,4,"Ateneo de Matemática, Ambiente Natural y Social","E","Ateneo",0,"Anual",[14,15,16],[23],[14,15,16,23]],[33,4,"Residencia Pedagógica","P","Práct. Doc.",0,"Anual",[9,10,11,12,13,14,15,16,17,18,27],[21,22,23,24,25,26],[21,22,23,24,25,26,27]]].map(([id,year,name,cf,format,hours,cycle,cA,cR,rA])=>({id,year,name,cf,format,hours,cycle,cA,cR,rA}));
const byId = new Map(carrera.map(s=>[s.id,s]));
const STORAGE_KEY='ies9_estado_inicial_v1';
let academicStates={};try{academicStates=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');if(!academicStates || typeof academicStates!=='object' || Array.isArray(academicStates))academicStates={}}catch{academicStates={}}
const getStatus=id=>['pendiente','regular','aprobada'].includes(academicStates[id])?academicStates[id]:'pendiente';
function updateTrackerSummary(){
 const approved=carrera.filter(m=>getStatus(m.id)==='aprobada').length;
 const regular=carrera.filter(m=>getStatus(m.id)==='regular').length;
 const value=document.querySelector('#trackerProgress');if(value)value.textContent=`${approved} de ${carrera.length} aprobadas · ${regular} regulares`;
 const fill=document.querySelector('#trackerFill');if(fill)fill.style.width=`${approved/carrera.length*100}%`;
}
function setAcademicStatus(id,status){
 if(!['pendiente','regular','aprobada'].includes(status))return;
 if(status==='pendiente')delete academicStates[id];else academicStates[id]=status;
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(academicStates))}catch{}
 renderSubjects();
}
function eligibilityFor(s){
 const remainingApproved=s.cA.filter(id=>getStatus(id)!=='aprobada');
 const remainingRegular=s.cR.filter(id=>getStatus(id)==='pendiente');
 const remainingFinal=s.rA.filter(id=>getStatus(id)!=='aprobada');
 return {canEnroll:remainingApproved.length===0&&remainingRegular.length===0,canTakeFinal:remainingFinal.length===0,missingApproved:remainingApproved.length,missingRegular:remainingRegular.length,missingFinal:remainingFinal.length};
}

const groupLabels = {G:'Formación general',E:'Formación específica',P:'Práctica profesional'};
const iconMap = {1:'📖',2:'🧠',3:'✍️',4:'💡',5:'🌿',6:'🏛️',7:'💻',8:'👥',9:'🌈',10:'⚖️',11:'🧒',12:'🧩',13:'💃',14:'🎓',15:'🧸',16:'📚',17:'🔬',18:'🎵',19:'🌍',20:'🔢',21:'🎨',22:'💬',23:'🔠',24:'🤝',25:'🎭',26:'🛠️',27:'🌱',28:'🪁',29:'👩‍🏫',30:'🌟',31:'✨',32:'🧮',33:'🎓'};
const yearText = y=>`${y}.º año`;
const classesForCF = cf => cf==='G'?'general':cf==='E'?'specific':'practice';
const $ = sel=>document.querySelector(sel);
const modal = $('#subjectModal');
const modalStack=[];let activeSubject=null;let activeYear='1';
const yearTabs = Array.from(document.querySelectorAll('.year-tab'));
const search = $('#searchSubjects');
function makeEl(tag,cls,text){let e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function renderSubjects(){
  updateTrackerSummary();
  const root = $('#subjectGrid');root.replaceChildren();
  const q=(search.value||'').toLocaleLowerCase('es-AR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const items=carrera.filter(s=>(activeYear==='all'||s.year===+activeYear)&&`${s.name} ${s.id}`.toLocaleLowerCase('es-AR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));
  $('#planCount').textContent=`${items.length} ${items.length===1?'materia':'materias'} ${activeYear==='all'?'en el plan':`de ${yearText(+activeYear)}`}`;
  if(!items.length){root.append(makeEl('div','no-results','🔎 No encontramos materias con ese nombre. Probá otra búsqueda.'));return;}
  const fragment=document.createDocumentFragment();
  items.forEach(s=>{
    const b=makeEl('button','subject-card');b.type='button';b.setAttribute('aria-label',`Ver requisitos y correlatividades de ${s.name}`);
    const bubble=makeEl('span',`subject-bubble ${classesForCF(s.cf)}`,iconMap[s.id]||'📘');bubble.setAttribute('aria-hidden','true');
    const label=makeEl('span','subject-main');const status=getStatus(s.id);label.append(makeEl('strong','',s.name),makeEl('small','',`${yearText(s.year)} · ${groupLabels[s.cf]} · ${status==='aprobada'?'✅ Aprobada':status==='regular'?'🟡 Regular':'Sin acreditar'}`));b.classList.add('state-'+status);
    const arrow=makeEl('span','subject-arrow','›');arrow.setAttribute('aria-hidden','true');b.append(bubble,label,arrow);
    b.addEventListener('click',()=>openSubject(s.id));fragment.append(b);
  });root.append(fragment);
}
yearTabs.forEach(t=>t.addEventListener('click',()=>{
  activeYear=t.dataset.year;
  yearTabs.forEach(b=>{const active=b===t;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active?'true':'false')});
  renderSubjects();
}));search.addEventListener('input',renderSubjects);
function makeChips(container, requirements){
  const expanded = requirements.flatMap(x=>x==='Y1'?carrera.filter(s=>s.year===1).map(s=>s.id):x==='Y2'?carrera.filter(s=>s.year===2).map(s=>s.id):x==='Y3'?carrera.filter(s=>s.year===3).map(s=>s.id):[x]);
  const unique=[...new Set(expanded)];
  if(!unique.length){container.append(makeEl('p','no-req','No se indican correlatividades para esta condición.'));return;}
  unique.forEach(id=>{const s=byId.get(id);if(!s)return;const chip=makeEl('button','req-chip '+getStatus(id),`${id} · ${s.name} ${getStatus(id)==='aprobada'?'✓':getStatus(id)==='regular'?'○':''}`);chip.type='button';chip.addEventListener('click',()=>openSubject(id,true));container.append(chip)});
}
function addRequirement(root,title,cls,subjects){const group=makeEl('section',`requirement-group ${cls}`);group.append(makeEl('h3','',title));const chips=makeEl('div','req-chips');makeChips(chips,subjects);group.append(chips);root.append(group)}
let lastFocused=null;
function openSubject(id,isNested=false){const s=byId.get(id);if(!s)return;
 if(modal.hidden){lastFocused=document.activeElement;modalStack.length=0;document.body.classList.add('modal-open');modal.hidden=false}
 else if(isNested && activeSubject!==null&&activeSubject!==id)modalStack.push(activeSubject);
 activeSubject=id;
 $('#subjectModalYear').textContent=yearText(s.year);
 $('#subjectModalIcon').textContent=iconMap[id]||'📚';
 $('#subjectModalType').textContent=groupLabels[s.cf];
 $('#subjectModalTitle').textContent=s.name;
 const meta=$('#subjectModalMeta');meta.replaceChildren();[s.format,s.cycle,s.hours?`${s.hours} horas cátedra`:"Carga horaria: consultar secretaría"].forEach(x=>meta.append(makeEl('span','',x)));
 const area=$('#subjectRequirements');area.replaceChildren();
 addRequirement(area,'Para cursar · materias aprobadas','approved',s.cA);
 addRequirement(area,'Para cursar · materias regulares','regular',s.cR);
 addRequirement(area,'Para rendir o promocionar · aprobadas','final',s.rA);
 
  const statusSelect=$('#subjectStatus');statusSelect.value=getStatus(id);
 const e=eligibilityFor(s);const help=$('#subjectEligibility');
 help.replaceChildren();
 const enroll=makeEl('span',e.canEnroll?'eligibility-yes':'eligibility-no',e.canEnroll?'✓ Requisitos para cursar completos':`Para cursar faltan ${e.missingApproved} aprobadas y ${e.missingRegular} regulares`);
 const final=makeEl('span',e.canTakeFinal?'eligibility-yes':'eligibility-no',e.canTakeFinal?'✓ Correlativas para rendir completas':`Para rendir faltan ${e.missingFinal} aprobadas`);
 help.append(enroll,final);
 $('#modalBack').hidden=modalStack.length===0;
 $('.modal-scroll').scrollTop=0;
 $('.modal-close').focus({preventScroll:true});
}
function closeModal(){modal.hidden=true;document.body.classList.remove('modal-open');modalStack.length=0;activeSubject=null;if(lastFocused?.focus)lastFocused.focus({preventScroll:true})}
document.querySelectorAll('[data-modal-close]').forEach(b=>b.addEventListener('click',closeModal));
$('#modalBack').addEventListener('click',()=>{if(modalStack.length){openSubject(modalStack.pop(),false); const statusSelect=$('#subjectStatus');statusSelect.value=getStatus(id);
 const e=eligibilityFor(s);const help=$('#subjectEligibility');
 help.replaceChildren();
 const enroll=makeEl('span',e.canEnroll?'eligibility-yes':'eligibility-no',e.canEnroll?'✓ Requisitos para cursar completos':`Para cursar faltan ${e.missingApproved} aprobadas y ${e.missingRegular} regulares`);
 const final=makeEl('span',e.canTakeFinal?'eligibility-yes':'eligibility-no',e.canTakeFinal?'✓ Correlativas para rendir completas':`Para rendir faltan ${e.missingFinal} aprobadas`);
 help.append(enroll,final);
 $('#modalBack').hidden=modalStack.length===0;}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.hidden)closeModal();if(event.key==='Tab'&&!modal.hidden){const focusable=Array.from(modal.querySelectorAll('button:not([hidden])')).filter(el=>el.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
renderSubjects();
$('#subjectStatus').addEventListener('change',evt=>{if(activeSubject!==null){const id=activeSubject;setAcademicStatus(id,evt.target.value);openSubject(id,false)}});
$('#resetTracker').addEventListener('click',()=>{if(confirm('¿Querés reiniciar el progreso de materias guardado en este dispositivo?')){academicStates={};try{localStorage.removeItem(STORAGE_KEY)}catch{}renderSubjects()}});
const reqs=['Fotocopia de DNI','Partida de nacimiento','Constancia de título secundario','Constancia de CUIL','Carpeta de tres solapas color marrón','Planilla SINIDE (en fotocopiadora)','Solicitud de inscripción','Bono contribución','Planilla prontuarial','Certificado psicofísico','Hoja de matrícula'];
let checkedReqs=[];try{checkedReqs=JSON.parse(localStorage.getItem('ies9-inicial-checklist')||'[]');if(!Array.isArray(checkedReqs))checkedReqs=[]}catch{checkedReqs=[]}
function renderRequirements(){let list=$('#reqList');list.replaceChildren();reqs.forEach((req,i)=>{
 const lab=makeEl('label','req-item');const input=makeEl('input');input.type='checkbox';input.checked=checkedReqs.includes(i);input.addEventListener('change',()=>{checkedReqs=input.checked?[...checkedReqs,i]:checkedReqs.filter(x=>x!==i);try{localStorage.setItem('ies9-inicial-checklist',JSON.stringify(checkedReqs))}catch{}updateProgress()});lab.append(input,makeEl('span','',req));list.append(lab)
});updateProgress()}
function updateProgress(){const n=checkedReqs.length;$('#reqProgress').textContent=`${n} de ${reqs.length}`;$('#reqFill').style.width=`${n/reqs.length*100}%`}
$('#clearChecklist').addEventListener('click',()=>{checkedReqs=[];try{localStorage.removeItem('ies9-inicial-checklist')}catch{}renderRequirements()});renderRequirements();
const menuToggle=$('#menuToggle'),mainNav=$('#mainNav');function setMenu(open){mainNav.classList.toggle('open',open);menuToggle.classList.toggle('is-open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')}
menuToggle.addEventListener('click',()=>setMenu(!mainNav.classList.contains('open')));mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
$('#currentYear').textContent=new Date().getFullYear();
const progress=$('#scrollProgress');let ticking=false;function updateScroll(){let max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?Math.min(100,window.scrollY/max*100):0)+'%';ticking=false}window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true}},{passive:true});updateScroll();
if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion:reduce)').matches){const elements=document.querySelectorAll('.reveal');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.07,rootMargin:'0px 0px 35px 0px'});elements.forEach(e=>observer.observe(e));document.body.classList.add('js-reveal')}
