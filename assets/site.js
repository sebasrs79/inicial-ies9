'use strict';
/* Plan académico oficial: 31 unidades curriculares del Profesorado de Educación Inicial.
   Fuente: Anexo Único de la Resolución 2351-E/20 (diseño 13928-E/19, modificado por 2011-E/20).
   cA = materias aprobadas para cursar; cR = materias regulares para cursar;
   rA = materias aprobadas para rendir/promocionar. Y1/Y2/Y3 representa el año completo. */
const carrera = [
  // 1.º año — el número corresponde al orden oficial de la unidad curricular.
  [1,1,"Pedagogía","G","Materia",128,"Anual",[],[],[],"Promoción / Examen final"],
  [2,1,"Psicología Educacional","G","Materia",128,"Anual",[],[],[],"Promoción / Examen final"],
  [3,1,"Alfabetización Académica","G","Taller",64,"1.º cuatrimestre",[],[],[],"Promoción / Examen final"],
  [4,1,"Didáctica general","G","Materia",128,"Anual",[],[],[],"Promoción / Examen final"],
  [11,1,"Sujeto de la Educación Inicial","E","Materia",128,"Anual",[],[],[],"Promoción / Examen final"],
  [12,1,"El Juego en la Educación Inicial","E","Taller",128,"Anual",[],[],[],"Promoción / Examen final"],
  [13,1,"Expresión Artística: Lenguaje Corporal","E","Taller",128,"Anual",[],[],[],"Promoción / Examen final"],
  [27,1,"Práctica I","P","Trabajo de campo",128,"Anual",[],[],[],"Promoción"],

  // 2.º año.
  [5,2,"Filosofía","G","Materia",128,"Anual",[],[],[],"Promoción / Examen final"],
  [6,2,"Historia de las Políticas Educativas en Argentina","G","Seminario",128,"Anual",[],[],[],"Promoción / Examen final"],
  [14,2,"Didáctica de la Educación Inicial","E","Materia",160,"Anual",[],[4,11],[4,11],"Promoción / Examen final"],
  [15,2,"Educación Maternal","E","Materia",128,"Anual",[],[11],[11],"Promoción / Examen final"],
  [16,2,"Lengua y Literatura y su Didáctica","E","Materia",128,"Anual",[],[3,4],[4],"Promoción / Examen final"],
  [17,2,"Ciencias Naturales y su Didáctica","E","Taller",128,"Anual",[],[4],[4],"Promoción / Examen final"],
  [18,2,"Expresión Artística: Lenguaje Musical","E","Taller",128,"Anual",[],[13],[13],"Promoción / Examen final"],
  [28,2,"Práctica II","P","Trabajo de campo",128,"Anual",[27],[],[27],"Promoción"],

  // 3.º año.
  [7,3,"Integración de las TIC en la Enseñanza","G","Taller",64,"2.º cuatrimestre",[],[14],[14],"Promoción / Examen final"],
  [8,3,"Sociología de la Educación","G","Seminario",64,"1.º cuatrimestre",[],[6],[6],"Promoción / Examen final"],
  [9,3,"Educación Sexual Integral","G","Seminario",64,"1.º cuatrimestre",[11],[],[11],"Promoción / Examen final"],
  [19,3,"Ciencias Sociales y su Didáctica","E","Taller",128,"Anual",[4],[14],[4,14],"Promoción / Examen final"],
  [20,3,"Matemática y su Didáctica","E","Taller",128,"Anual",[4],[14],[4,14],"Promoción / Examen final"],
  [21,3,"Expresión Artística: Lenguaje Plástico y Visual","E","Taller",128,"Anual",[13],[18],[13,18],"Promoción / Examen final"],
  [22,3,"Problemáticas Contemporáneas de la Educación Inicial","E","Seminario",160,"Anual",[1,11],[15],[1,11,15],"Promoción / Examen final"],
  [23,3,"Alfabetización Inicial","E","Materia",128,"Anual",[],[16],[16],"Promoción / Examen final"],
  [29,3,"Práctica III","P","Práctica docente",192,"Anual",[28],[14,16,17],[14,16,17,28],"Promoción"],

  // 4.º año.
  [10,4,"Ética Profesional Docente","G","Seminario",64,"1.º cuatrimestre",[5,28],[22],[5,28],"Promoción / Examen final"],
  [24,4,"Formación Ética y Ciudadana","E","Materia",64,"2.º cuatrimestre",[5],[19],[5,19],"Promoción / Examen final"],
  [25,4,"Expresión Artística: Lenguaje Teatral","E","Taller",128,"Anual",[13,18],[21],[13,18,21],"Promoción / Examen final"],
  [26,4,"Educación Tecnológica y su Didáctica","E","Taller",128,"Anual",[14],[7],[7,14],"Promoción / Examen final"],
  [31,4,"Unidad Curricular de Definición Institucional","I","Formato no especificado",64,"2.º cuatrimestre",["Y1","Y2"],[],["Y1","Y2"],"Promoción / Examen final"],
  [30,4,"Residencia Pedagógica","P","Práctica docente",384,"Anual",["Y1","Y2",29],[7,8,9,19,20,21,22,23],["Y1","Y2","Y3"],"Promoción"]
].map(([id,year,name,cf,format,hours,cycle,cA,cR,rA,accreditation])=>({id,year,name,cf,format,hours,cycle,cA,cR,rA,accreditation}));

const byId = new Map(carrera.map(s=>[s.id,s]));
const expandRequirements = requirements => requirements.flatMap(x =>
  x === 'Y1' ? carrera.filter(s=>s.year===1).map(s=>s.id) :
  x === 'Y2' ? carrera.filter(s=>s.year===2).map(s=>s.id) :
  x === 'Y3' ? carrera.filter(s=>s.year===3).map(s=>s.id) : [x]
);
// Nueva clave: evita reutilizar estados guardados con la planilla anterior de 33 unidades.
const STORAGE_KEY='ies9_estado_inicial_v2_res2351e20';
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
 const remainingApproved=expandRequirements(s.cA).filter(id=>getStatus(id)!=='aprobada');
 const remainingRegular=expandRequirements(s.cR).filter(id=>getStatus(id)==='pendiente');
 const remainingFinal=expandRequirements(s.rA).filter(id=>getStatus(id)!=='aprobada');
 return {canEnroll:remainingApproved.length===0&&remainingRegular.length===0,canTakeFinal:remainingFinal.length===0,missingApproved:remainingApproved.length,missingRegular:remainingRegular.length,missingFinal:remainingFinal.length};
}

const groupLabels = {G:'Formación general',E:'Formación específica',P:'Práctica profesional',I:'Definición institucional'};
const iconMap = {1:'📖',2:'🧠',3:'✍️',4:'💡',5:'🧭',6:'🏛️',7:'💻',8:'👥',9:'💗',10:'⚖️',11:'🧒',12:'🧩',13:'💃',14:'🎓',15:'🧸',16:'📚',17:'🔬',18:'🎵',19:'🌍',20:'🔢',21:'🎨',22:'💬',23:'🔠',24:'🤝',25:'🎭',26:'🛠️',27:'🌱',28:'🪁',29:'👩‍🏫',30:'🌟',31:'✨'};
const yearText = y=>`${y}.º año`;
const classesForCF = cf => cf==='G'?'general':cf==='E'?'specific':cf==='P'?'practice':'institutional';
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
  const expanded = expandRequirements(requirements);
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
 const meta=$('#subjectModalMeta');meta.replaceChildren();[s.format,s.cycle,`${s.hours} horas cátedra`,s.accreditation].forEach(x=>meta.append(makeEl('span','',x)));
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
$('#modalBack').addEventListener('click',()=>{if(modalStack.length){openSubject(modalStack.pop(),false);$('#modalBack').hidden=modalStack.length===0;}});
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
const menuToggle=$('#menuToggle'),mainNav=$('#mainNav');function setMenu(open){mainNav.classList.toggle('open',open);menuToggle.classList.toggle('is-open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');document.body.classList.toggle('menu-open',open)}
menuToggle.addEventListener('click',()=>setMenu(!mainNav.classList.contains('open')));mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mainNav.classList.contains('open')){setMenu(false);menuToggle.focus({preventScroll:true})}});window.addEventListener('resize',()=>{if(window.innerWidth>760&&mainNav.classList.contains('open'))setMenu(false)});
$('#currentYear').textContent=new Date().getFullYear();
const progress=$('#scrollProgress');let ticking=false;function updateScroll(){let max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?Math.min(100,window.scrollY/max*100):0)+'%';ticking=false}window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true}},{passive:true});updateScroll();
if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion:reduce)').matches){const elements=document.querySelectorAll('.reveal');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.07,rootMargin:'0px 0px 35px 0px'});elements.forEach(e=>observer.observe(e));document.body.classList.add('js-reveal')}
