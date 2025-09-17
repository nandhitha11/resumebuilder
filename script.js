/* ----- State ----- */
let state = {
  experience: null,
  company: null,
  cvOption: null,
  template: 'classic',
  contact: { firstName:'', lastName:'', city:'', country:'', pincode:'', phone:'', email:'' },
  details: { summary:'', skills:'', experience:'', projects:'' }
};

/* ----- Preloader flow ----- */
function rotateLoaderMessages() {
  const messages = document.querySelectorAll('.messages span');
  if(!messages.length) return;
  let mi = 0;
  setInterval(() => {
    messages.forEach(m => m.classList.remove('active'));
    messages[mi].classList.add('active');
    mi = (mi+1) % messages.length;
  }, 1000);
}

function showFirstStep() {
  const loader = document.getElementById('loader');
  const stepExp = document.getElementById('step-experience');
  if(loader) loader.classList.add('hidden');
  if(stepExp) stepExp.classList.remove('hidden');
}

/* ----- Wire option cards ----- */
function wireOptions(sectionId){
  const node = document.getElementById(sectionId);
  if(!node) return;
  node.querySelectorAll('.option').forEach(el=>{
    el.addEventListener('click', ()=>{
      node.querySelectorAll('.option').forEach(x=>x.classList.remove('selected'));
      el.classList.add('selected');
      const val = el.dataset.val;
      if(sectionId==='step-experience') state.experience = val;
      if(sectionId==='step-company') state.company = val;
      if(sectionId==='step-cv-option') state.cvOption = val;
    });
  });
}

/* ----- Navigation functions ----- */
function toCompany(){ if(!state.experience){ alert('Select experience'); return; } hideStep('step-experience'); showStep('step-company'); }
function backToExperience(){ hideStep('step-company'); showStep('step-experience'); }
function toCvOption(){ if(!state.company){ alert('Select company'); return; } hideStep('step-company'); showStep('step-cv-option'); }
function backToCompany(){ hideStep('step-cv-option'); showStep('step-company'); }
function toTemplate(){ if(!state.cvOption){ alert('Select CV option'); return; } hideStep('step-cv-option'); showStep('step-template'); }
function backToCvOption(){ hideStep('step-template'); showStep('step-cv-option'); }
function backToTemplate(){ hideStep('step-contact'); showStep('step-template'); }
function backToContact(){ hideStep('step-result'); showStep('step-contact'); }

function hideStep(id){ const el = document.getElementById(id); if(el) el.classList.add('hidden'); }
function showStep(id){ const el = document.getElementById(id); if(el) el.classList.remove('hidden'); }

/* ----- Template selection ----- */
function chooseTemplate(t){
  state.template = t;
  document.querySelectorAll('.template-card').forEach(c=>c.classList.remove('selected'));
  const el = Array.from(document.querySelectorAll('.template-card')).find(c=>c.dataset.template===t);
  if(el) el.classList.add('selected');
  hideStep('step-template'); showStep('step-contact');
}
function skipTemplate(){ hideStep('step-template'); showStep('step-contact'); }

/* ----- Contact & Details preview update ----- */
function updatePreview(){
  // contact
  ['firstName','lastName','city','country','pincode','phone','email'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) state.contact[id] = el.value.trim();
  });

  // details
  ['summary','skills','experience','projects'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) state.details[id] = el.value.trim();
  });

  document.getElementById('pv-name').textContent = (state.contact.firstName||'First name') + ' ' + (state.contact.lastName||'Surname');
  document.getElementById('pv-contact').textContent = 
    `${state.contact.city||'City'}, ${state.contact.country||'Country'} ${state.contact.pincode||'Pin code'} | ${state.contact.phone||'Phone'} | ${state.contact.email||'Email'}`;

  ['summary','experience','skills','projects'].forEach(id=>{
    const pv = document.getElementById('pv-'+id);
    if(pv) pv.textContent = state.details[id] || `[${id.charAt(0).toUpperCase()+id.slice(1)} will appear here]`;
  });
}

/* ----- Generate final preview ----- */
function generateResume(){
  if(!state.contact.firstName && !state.contact.lastName){ alert('Enter your name'); return; }

  document.getElementById('cv-name').textContent = state.contact.firstName+' '+state.contact.lastName;
  document.getElementById('cv-contact').textContent = 
    `${state.contact.city||''}${state.contact.city? ', ' : ''}${state.contact.country||''} ${state.contact.pincode||''} | ${state.contact.phone||''} | ${state.contact.email||''}`;

  ['summary','experience','skills','projects'].forEach(id=>{
    const cv = document.getElementById('cv-'+id);
    if(cv) cv.textContent = state.details[id] || `[${id.charAt(0).toUpperCase()+id.slice(1)} placeholder]`;
  });

  hideStep('step-contact'); showStep('step-result');
}

/* ----- PDF export ----- */
async function downloadPDF(){
  const el = document.getElementById('resume-template');
  el.style.display='block';
  const originalWidth = el.style.width;
  el.style.width = '800px';

  const canvas = await html2canvas(el, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');

  el.style.width = originalWidth || '';

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p','pt','a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
  pdf.save('resume.pdf');
}


/* ----- Init after DOM ----- */
document.addEventListener('DOMContentLoaded', ()=>{
  rotateLoaderMessages();
  wireOptions('step-experience'); 
  wireOptions('step-company'); 
  wireOptions('step-cv-option');

  ['firstName','lastName','city','country','pincode','phone','email','summary','skills','experience','projects']
    .forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.addEventListener('input', updatePreview);
    });

  // show first step after 1s
  setTimeout(showFirstStep, 1000);
});

const contactPopup = document.getElementById("contactPopup");
  const openContact = document.getElementById("openContact");
  const closeContact = document.getElementById("closeContact");
  const form = document.getElementById("contactForm");

  openContact.addEventListener("click", (e) => {
    e.preventDefault();
    contactPopup.style.display = "flex";
  });

  closeContact.addEventListener("click", () => {
    contactPopup.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === contactPopup) {
      contactPopup.style.display = "none";
    }
  });

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("✅ Thank you for contacting us! We’ll respond shortly.");
    form.reset();
    contactPopup.style.display = "none";
  });
  const loginPopup = document.getElementById("loginPopup");
  const openLogin = document.getElementById("openLogin");
  const closeLogin = document.getElementById("closeLogin");
  const loginForm = document.getElementById("loginForm");

  openLogin.addEventListener("click", (e) => {
    e.preventDefault();
    loginPopup.style.display = "flex";
  });

  closeLogin.addEventListener("click", () => {
    loginPopup.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginPopup) {
      loginPopup.style.display = "none";
    }
  });

  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("✅ Login successful (demo). Connect backend later.");
    loginForm.reset();
    loginPopup.style.display = "none";
  });