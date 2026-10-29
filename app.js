/* Jardim do Céu — aplicação estática, sem dependências de build. */
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
let records=[],matches=[],selected=null,limit=30,locations={};
const config=window.JARDIM_DO_CEU_CONFIG;
function fields(r){const o={};for(const [k,v] of [['cem','CEM'],['quadra','QRD'],['setor','SET'],['jazigo','JAZ']])o[k]=(r.location.match(new RegExp(v+':\\s*(.*?)(?:\\s+\\.\\s+|$)'))||[])[1]||'';return o}
function age(r){return r.age ? (/^\d+$/.test(r.age)?r.age+' anos':r.age) : 'Idade não informada'}
function validPoint(p){return p&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180&&p.confirmed===true}
function destination(r){if(r?.exhumed)return null;const p=r&&locations[r.location.trim()];return validPoint(p)?p.lat+','+p.lng:null}
function updateMap(r){
  const point=destination(r),q=point||config.placeQuery;
  let src;
  if(config.googleMapsApiKey){src='https://www.google.com/maps/embed/v1/place?key='+encodeURIComponent(config.googleMapsApiKey)+'&q='+encodeURIComponent(q)+'&maptype=satellite&zoom='+(point?20:17)+'&language=pt-BR'}
  else if(!point&&config.embedUrl){src=config.embedUrl}
  else{src='https://www.google.com/maps?q='+encodeURIComponent(q)+'&t=k&z='+(point?20:17)+'&hl=pt-BR&output=embed'}
  // Somente coordenadas ou o nome do memorial são enviados ao Google; nunca nomes de falecidos.
  $('googleMap').src=src;
  $('openMap').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
  $('directions').href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(q)+(point?'&travelmode=walking':'');
  $('directions').textContent=point?'Rota até o ponto cadastrado →':'Como chegar ao Jardim do Céu →';
}
function search(){if(!records.length){showEmptyDatabase();return}limit=30;const q=normalize($('search').value);matches=q.length<2?[]:records.filter(r=>q.split(' ').every(t=>r.search.includes(t)));renderResults(q)}
function renderResults(q=normalize($('search').value)){$('count').textContent=q.length<2?'Busque pelo nome completo ou por parte dele':matches.length.toLocaleString('pt-BR')+' registro(s) encontrado(s)';$('results').innerHTML=q.length<2?'<div class="empty"><div class="empty-icon">❧</div><h3>Uma busca, uma lembrança.</h3><p>Digite ao menos 2 letras do nome.<br>Os resultados aparecerão aqui.</p></div>':matches.length?matches.slice(0,limit).map(r=>{const f=fields(r);return `<button class="result ${selected?.id===r.id?'active':''}" data-id="${r.id}"><strong>${esc(r.name)}</strong><span class="meta">${esc(age(r))} · ${esc(r.book)} · Registro ${esc(r.register)}${r.exhumed?' · Exumação registrada':''}${r.death?' · '+esc(r.death):''}</span><span class="loc">⌖ ${esc(f.quadra?f.quadra+' · '+f.setor+' · Jazigo '+f.jazigo:r.location||'Localização não informada')}</span></button>`}).join('')+(matches.length>limit?'<button id="more">Mostrar mais resultados</button>':''):'<div class="empty"><h3>Nenhum registro encontrado</h3><p>Tente apenas um sobrenome ou confira a grafia. Se precisar, procure a recepção.</p></div>';document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>select(records.find(r=>r.id===Number(b.dataset.id))));if($('more'))$('more').onclick=()=>{limit+=30;renderResults()}}

function select(r){selected=r;renderResults();detail();updateMap(r);if(innerWidth<701)$('detail').scrollIntoView({behavior:'smooth',block:'nearest'})}
function detail(){
 const r=selected,f=fields(r),point=destination(r);
 $('mapNotice').hidden=true;$('detail').hidden=false;
 $('detail').innerHTML=`<span class="eyebrow">EM MEMÓRIA</span><h2>${esc(r.name)}</h2><small>${esc(age(r))}${r.calculated?' (calculada pelas datas)':''}${r.death?' · Falecimento em '+esc(r.death):''}</small><div class="facts">${[['Jazigo (código)',r.location],['Livro de origem',r.book],['Registro',r.register]].map(([a,b])=>`<div><span>${a}</span><strong>${esc(b||'Não informado')}</strong></div>`).join('')}</div>${r.location?`<small>Localização da planilha: ${esc(r.location)}</small>`:''}${r.observation?`<p role="note"><strong>Observação do livro: ${esc(r.observation)}</strong></p>`:''}<p>${r.exhumed?'Este é um registro histórico com exumação informada. Confirme a localização atual com a recepção. O mapa e a rota mostram somente o cemitério.':point?'O mapa está no ponto cadastrado do jazigo. O Google Maps pode não reconhecer os caminhos internos; confirme o trajeto com a recepção.':r.location?'A localização está registrada, mas este jazigo ainda não tem coordenadas. O mapa e a rota mostram o Jardim do Céu. Informe o código do jazigo à recepção para pedir orientação.':'A planilha não informa a localização deste registro. O mapa mostra somente o Jardim do Céu. Procure a recepção para confirmar.'}</p><button id="copyLocation">Copiar localização</button> <small id="copyStatus" role="status"></small>`;
 $('copyLocation').onclick=async()=>{try{await navigator.clipboard.writeText(r.name+'\n'+age(r)+'\n'+(r.location||'Localização não informada')+'\n'+r.book+' · Registro '+r.register+(r.observation?'\n'+r.observation:'')+(r.exhumed?'\nRegistro histórico: confirmar localização atual na recepção.':''));$('copyStatus').textContent='Copiado.'}catch{$('copyStatus').textContent='Selecione o texto acima para copiar.'}};
}
$('searchForm').onsubmit=e=>{e.preventDefault();search()};$('search').oninput=search;
$('help').onclick=()=>$('helpDialog').showModal();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
updateMap(null);
Promise.all([fetch('dados.json').then(r=>{if(!r.ok)throw Error('dados');return r.json()}),fetch('localizacoes.json').then(r=>{if(!r.ok)throw Error('localizacoes');return r.json()})]).then(([data,points])=>{
 if(!Array.isArray(data)||!points||Array.isArray(points)||typeof points!=='object')throw Error('Formato inválido');
 records=data.map(r=>({...r,search:normalize(r.name)}));locations=points;$('search').disabled=records.length===0;document.querySelector('#searchForm button').disabled=records.length===0;if(records.length){document.querySelector('.aside-footer').lastChild.textContent=' '+records.length.toLocaleString('pt-BR')+' registros na base';search()}else{showEmptyDatabase()}
}).catch(()=>{$('count').textContent='Não foi possível carregar os arquivos de dados. Atualize a página. Se persistir, confira dados.json e localizacoes.json.'});

function showEmptyDatabase(){
 $('count').textContent='Consulta de falecidos em preparação';
 $('results').innerHTML='<div class="empty"><div class="empty-icon">❧</div><h3>Em breve, encontre sua lembrança.</h3><p>Os registros do Jardim do Céu ainda não foram disponibilizados nesta consulta. Para localizar um jazigo, procure a recepção do cemitério.</p></div>';
 $('search').placeholder='Aguardando cadastro dos registros';
 $('mapNotice').querySelector('strong').textContent='Visite o Jardim do Céu';
 $('mapNotice').querySelector('p').textContent='O mapa e a rota mostram o cemitério em Pouso Alegre–MG. Para localizar um jazigo, peça orientação à recepção.';
}
