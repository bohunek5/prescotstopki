let items=[],activeGroup='Wszystkie',mode='signature',onlyFavorites=false,current=null,saved=[];
try{saved=JSON.parse(localStorage.getItem('prescot-signatures-real-20260925')||'[]')}catch{}
const selected=new Set(Array.isArray(saved)?saved:[]),$=s=>document.querySelector(s),dialog=$('#preview');
const groups=['Wszystkie','Targi','DELUX','7 + 7 lat','COB','Producent','Pełna oferta'];
const styles={jasna:'Jasna stopka',czarna:'Ciemna stopka',kompakt:'Układ kompaktowy',boczna:'Logo z boku',redakcyjna:'Układ redakcyjny'};
const title=d=>d.title.replace(/^\d+\s*·\s*/,'');
const previewPath=d=>(mode==='banner'?'banery/':'podglady/')+d.id+'.png';
const visible=()=>items.filter(d=>(activeGroup==='Wszystkie'||d.group===activeGroup)&&(!onlyFavorites||selected.has(d.id)));
function persist(){try{localStorage.setItem('prescot-signatures-real-20260925',JSON.stringify([...selected]))}catch{}}
function toggle(id){selected.has(id)?selected.delete(id):selected.add(id);persist();render();if(current)show(current,false)}
function render(){
 $('#filters').innerHTML=groups.map(g=>`<button data-group="${g}" aria-pressed="${activeGroup===g}">${g}<span>${g==='Wszystkie'?30:5}</span></button>`).join('');
 const data=visible();$('#count').textContent=`${data.length} z 30 propozycji${onlyFavorites?' · wybrane':''}`;
 $('#favorites').setAttribute('aria-pressed',onlyFavorites);$('#favorites span').textContent=selected.size;$('#copy-selection').hidden=selected.size===0;
 $('#empty').hidden=data.length>0;
 $('#grid').innerHTML=data.map(d=>`<article class="card ${selected.has(d.id)?'selected':''}" id="stopka-${d.id}"><div class="card-top"><span class="card-number">${d.id}</span><div class="card-title"><h2>${title(d)}</h2><p>${d.group} &nbsp; / &nbsp; ${styles[d.signature]}</p></div><button class="favorite" data-favorite="${d.id}" aria-label="${selected.has(d.id)?'Usuń z wybranych':'Wybierz'} stopkę ${d.id}" aria-pressed="${selected.has(d.id)}">${selected.has(d.id)?'♥':'♡'}</button></div><button class="preview-button" data-preview="${d.id}" aria-label="Powiększ stopkę ${d.id}: ${title(d)}"><img src="${previewPath(d)}" alt="${d.title} — ${mode==='banner'?'baner':'pełna stopka Radka'}" loading="lazy" decoding="async" width="1440" height="${mode==='banner'?(d.expo?680:600):(d.signature==='redakcyjna'?(d.expo?1420:1340):(d.expo?1312:1232))}"></button><div class="card-links"><a href="stopki/${d.id}.html" target="_blank">Pełna stopka HTML ↗</a><a href="podglady/${d.id}.png" download="PRESCOT-stopka-${d.id}.png">Stopka PNG ↓</a><a href="banery/${d.id}.png" download="PRESCOT-baner-${d.id}.png">Baner ↓</a></div></article>`).join('');
}
function show(id,open=true){const d=items.find(i=>i.id===id);if(!d)return;current=id;$('#modal-group').textContent=d.group.toUpperCase();$('#modal-title').textContent=d.title;$('#modal-image').src=previewPath(d);$('#modal-image').alt=d.title+' — pełna propozycja';$('#modal-html').href='stopki/'+id+'.html';$('#modal-png').href=previewPath(d);$('#modal-banner').href='banery/'+id+'.png';$('#modal-favorite').textContent=selected.has(id)?'♥ Wybrana':'♡ Wybierz';$('#modal-favorite').setAttribute('aria-pressed',selected.has(id));if(open&&!dialog.open)dialog.showModal()}
function move(step){const data=visible();if(!data.length)return;const idx=data.findIndex(d=>d.id===current);show(data[(idx+step+data.length)%data.length].id,false)}
$('#filters').addEventListener('click',e=>{const b=e.target.closest('[data-group]');if(b){activeGroup=b.dataset.group;render()}});
$('.mode').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(!b)return;mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',el===b));render()});
$('#favorites').addEventListener('click',()=>{onlyFavorites=!onlyFavorites;render()});
$('#grid').addEventListener('click',e=>{const f=e.target.closest('[data-favorite]'),p=e.target.closest('[data-preview]');if(f)toggle(f.dataset.favorite);else if(p)show(p.dataset.preview)});
$('#close-modal').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
$('#modal-favorite').addEventListener('click',()=>toggle(current));$('#previous').addEventListener('click',()=>move(-1));$('#next').addEventListener('click',()=>move(1));document.addEventListener('keydown',e=>{if(!dialog.open)return;if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
$('#copy-selection').addEventListener('click',async()=>{const value='Wybrane stopki PRESCOT: '+[...selected].sort().join(', ');try{await navigator.clipboard.writeText(value);$('#toast').textContent=value+' — skopiowano';$('#toast').hidden=false;setTimeout(()=>$('#toast').hidden=true,3500)}catch{window.prompt('Skopiuj wybrane numery:',value)}});
async function init(){try{const r=await fetch('data.json');items=await r.json();render()}catch{$('#grid').textContent='Otwórz galerię przez lokalny serwer: http://127.0.0.1:4277/'}}
init();
