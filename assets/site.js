"use strict";
const menu=document.querySelector('.menu'),nav=document.querySelector('.navlinks');
if(menu&&nav){menu.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));menu.setAttribute('aria-label',opened?'Chiudi menu':'Apri menu');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Apri menu');}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}});}
document.querySelectorAll('#year').forEach(el=>el.textContent=String(new Date().getFullYear()));
for(const b of document.querySelectorAll('[data-accessibility]')){b.addEventListener('click',()=>{const type=b.dataset.accessibility,cls=type==='text'?'large-text':'high-contrast';const enabled=document.body.classList.toggle(cls);b.setAttribute('aria-pressed',String(enabled));});}
const interest=document.getElementById('interesse');document.querySelectorAll('[data-choice]').forEach(a=>a.addEventListener('click',()=>{if(interest)interest.value=a.dataset.choice;}));
const form=document.getElementById('participation-form');if(form){form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const name=document.getElementById('nome').value.trim(),email=document.getElementById('email').value.trim(),purpose=interest.selectedOptions[0].textContent,body=document.getElementById('messaggio').value.trim();const subject='Generazioni Insieme APS — '+purpose;const content='Buongiorno,\n\n'+body+'\n\nNome: '+name+'\nEmail: '+email+'\n\nMessaggio preparato dal sito, da verificare prima dell’invio.';document.getElementById('form-feedback').textContent='Si sta aprendo il programma di posta. Controlla e invia il messaggio dalla tua applicazione email.';window.location.href='mailto:generazioniinsieme@virgilio.it?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(content);});}

// Dropdown: un clic apre, un secondo chiude. Escape chiude e restituisce il focus.
(function(){const root=document.querySelector('.navlinks');if(!root)return;const groups=[...root.querySelectorAll('.nav-group')];const triggers=groups.map(g=>g.querySelector('.nav-trigger'));function closeAll(except){groups.forEach((g,i)=>{if(g===except)return;g.classList.remove('open');triggers[i].setAttribute('aria-expanded','false')})}triggers.forEach((b,i)=>{b.addEventListener('click',()=>{const opening=!groups[i].classList.contains('open');closeAll();groups[i].classList.toggle('open',opening);b.setAttribute('aria-expanded',String(opening))});b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();closeAll();groups[i].classList.add('open');b.setAttribute('aria-expanded','true');groups[i].querySelector('a')?.focus()}})});root.querySelectorAll('.nav-submenu a').forEach(a=>a.addEventListener('click',()=>closeAll()));document.addEventListener('click',e=>{if(!root.contains(e.target))closeAll()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=groups.find(g=>g.classList.contains('open'));if(open){const trigger=open.querySelector('.nav-trigger');closeAll();trigger.focus()}}});})();

// Chiude i sottomenu quando il focus esce dal gruppo.
document.querySelectorAll('.nav-group').forEach(group=>{group.addEventListener('focusout',e=>{if(e.relatedTarget&&group.contains(e.relatedTarget))return;group.classList.remove('open');group.querySelector('.nav-trigger')?.setAttribute('aria-expanded','false')})});




// Indicazione della pagina/sezione attiva, indipendente dall'apertura dei menu.
(function(){
  const nav=document.querySelector('.navlinks');if(!nav)return;
  const links=[...nav.querySelectorAll('a[href]')];
  const page=()=>location.pathname.split('/').pop()||'index.html';
  const targets={
    'partecipa.html#scrivici':'Contatti',
    'partecipa.html#collaborazioni':'Partecipa'
  };
  function refresh(){
    const current=page(), hash=decodeURIComponent(location.hash||'');
    const key=current+hash;
    nav.querySelectorAll('.nav-current').forEach(el=>el.classList.remove('nav-current'));
    nav.querySelectorAll('.nav-current-group').forEach(el=>el.classList.remove('nav-current-group'));
    nav.querySelectorAll('[aria-current]').forEach(el=>el.removeAttribute('aria-current'));
    let active=links.find(a=>{
      const u=new URL(a.getAttribute('href'),location.href);
      return (u.pathname.split('/').pop()||'index.html')===current && decodeURIComponent(u.hash)===hash;
    });
    if(!active && !hash)active=links.find(a=>{
      const u=new URL(a.getAttribute('href'),location.href);
      return (u.pathname.split('/').pop()||'index.html')===current && !u.hash && a.closest('.nav-group');
    })||links.find(a=>{
      const u=new URL(a.getAttribute('href'),location.href);
      return (u.pathname.split('/').pop()||'index.html')===current && !u.hash;
    });
    if(!active)return;
    active.classList.add('nav-current');active.setAttribute('aria-current',hash?'location':'page');
    const group=active.closest('.nav-group');
    if(group)group.classList.add('nav-current-group');
  }
  refresh();window.addEventListener('hashchange',refresh);window.addEventListener('pageshow',refresh);
})();

// Calcola il margine di scorrimento a partire dall'altezza reale dell'header.
(function(){
 const header=document.querySelector('header');
 if(!header)return;
 const setOffset=()=>document.documentElement.style.setProperty('--anchor-offset',Math.ceil(header.getBoundingClientRect().height+20)+'px');
 setOffset();
 if('ResizeObserver' in window)new ResizeObserver(setOffset).observe(header);
 window.addEventListener('resize',setOffset);
 function align(){
  setOffset();if(!location.hash)return;
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch(e){return}
  const target=document.getElementById(id);
  if(target)target.scrollIntoView({block:'start',behavior:'instant'});
 }
 window.addEventListener('load',align);
 window.addEventListener('hashchange',align);
})();

// Navigazione multipagina: seleziona la voce e il gruppo per il file corrente.
(function(){
 const nav=document.querySelector('.navlinks');if(!nav)return;
 const page=location.pathname.split('/').pop()||'index.html';
 const groups={
 'associazione.html':'Chi siamo','consiglio-direttivo.html':'Chi siamo',
 'attivita.html':'Progetti','aprilia-si-racconta.html':'Progetti','progettazione-europea.html':'Progetti',
 'libri.html':'Cultura','intervista.html':'Cultura',
 'partecipa.html':'Partecipa','volontariato.html':'Partecipa','collaborazioni.html':'Partecipa',
 'trasparenza.html':'Trasparenza','privacy.html':'Trasparenza',
 'contatti.html':'Contatti','scrivici.html':'Contatti'};
 nav.querySelectorAll('a').forEach(a=>{a.classList.remove('nav-current');a.removeAttribute('aria-current');
 if((new URL(a.href).pathname.split('/').pop()||'index.html')===page){a.classList.add('nav-current');a.setAttribute('aria-current','page');}});
 nav.querySelectorAll('.nav-group').forEach(g=>{g.classList.remove('nav-current-group');g.querySelector('.nav-trigger')?.removeAttribute('aria-current');
 if(g.querySelector('.nav-trigger')?.textContent.trim().startsWith(groups[page]||'\0')){g.classList.add('nav-current-group');g.querySelector('.nav-trigger')?.setAttribute('aria-current','true');}});
})();

// Sezioni delle nuove pagine autonome.
document.addEventListener('DOMContentLoaded', function () {
  const page = location.pathname.split('/').pop();
  const nav = document.querySelector('.navlinks');
  if (!nav) return;
  const groups = [...nav.querySelectorAll('.nav-group')];
  const target = nav.querySelector('a[href="' + page + '"]');
  if (!target) return;
  nav.querySelectorAll('a[aria-current]').forEach(a => a.removeAttribute('aria-current'));
  nav.querySelectorAll('.nav-current').forEach(a => a.classList.remove('nav-current'));
  groups.forEach(g => g.classList.remove('nav-current-group'));
  target.classList.add('nav-current');
  target.setAttribute('aria-current', 'page');
  const group = target.closest('.nav-group');
  if (group) group.classList.add('nav-current-group');
});
