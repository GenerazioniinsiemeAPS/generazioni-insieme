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





// Stato attivo unico: una sola voce per pagina, senza conflitti tra handler.
(function(){
 const nav=document.querySelector('.navlinks');if(!nav)return;
 const page=location.pathname.split('/').pop()||'index.html';
 const candidates=[...nav.querySelectorAll('a[href]')];
 const active=candidates.find(a=>{const u=new URL(a.getAttribute('href'),location.href);return (u.pathname.split('/').pop()||'index.html')===page && (!u.hash||u.hash===location.hash);});
 nav.querySelectorAll('[aria-current]').forEach(a=>a.removeAttribute('aria-current'));
 nav.querySelectorAll('.nav-current,.nav-current-group').forEach(a=>a.classList.remove('nav-current','nav-current-group'));
 if(active){active.classList.add('nav-current');active.setAttribute('aria-current','page');active.closest('.nav-group')?.classList.add('nav-current-group');}
})();
