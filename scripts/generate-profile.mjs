import { mkdir, writeFile } from 'node:fs/promises';

// Self-contained vector artwork for the GitHub profile. No network or build dependencies.
const assets = new URL('../assets/', import.meta.url);
await mkdir(assets, { recursive: true });
const C = { bg: '#070d19', panel: '#0b1424', border: '#26364c', text: '#edf7ff', muted: '#a4b9d1', cyan: '#53e7f6', blue: '#548dff', violet: '#b8a0ff', orange: '#ffbc79' };
const esc = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const txt = (x, y, text, size=20, fill=C.text, weight=400, extra='') => `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" ${extra}>${esc(text)}</text>`;
const mono = (x, y, text, size=14, fill=C.muted, extra='') => txt(x,y,text,size,fill,400,`class="mono" ${extra}`);
const svg = (w,h,title,body,defs='') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title><defs>${defs}</defs><style>text{font-family:Arial,Helvetica,sans-serif}.mono{font-family:ui-monospace,Menlo,Consolas,monospace}@media(prefers-reduced-motion:reduce){.motion{display:none!important}}</style>${body}</svg>\n`;
const save = (name,content) => writeFile(new URL(name,assets), content);
const line = (x1,y1,x2,y2,color=C.border,extra='')=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" ${extra}/>`;
const arrow = (x,y,color=C.cyan) => `<g transform="translate(${x} ${y})" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"><path d="M0 17L17 0M0 0H17V17"/></g>`;

function network(cx,cy,r,animate=true) {
  const pts = Array.from({length:77},(_,i)=>{
    const y=1-2*(i+.5)/77, a=i*2.399963229728653, rr=Math.sqrt(1-y*y);
    const xx=Math.cos(a)*rr, zz=Math.sin(a)*rr;
    const x=xx*.91+zz*.41, z=-xx*.41+zz*.91;
    return {x:cx+x*r,y:cy+y*r*.93,z,p:[x,y,z]};
  });
  let edges='', nodes='', particles='';
  const close=[];
  for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
    const a=pts[i],b=pts[j],d=Math.hypot(...a.p.map((n,k)=>n-b.p[k]));
    if(d<.52){
      const opacity=.13+.22*((a.z+b.z)/2+1)/2;
      const path=`M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
      edges+=`<path d="${path}" stroke="${C.cyan}" stroke-opacity="${opacity.toFixed(3)}" stroke-width="1.2"/>`;
      if(a.z+b.z>.1) close.push(path);
    }
  }
  for(const [i,p] of pts.entries()){
    const opacity=.3+.7*(p.z+1)/2, radius=1.5+1.5*(p.z+1)/2;
    nodes+=`<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${radius}" fill="${i%7===0?C.blue:C.cyan}" opacity="${opacity}"/>`;
  }
  if(animate) for(let i=0;i<8;i++){
    const path=close[(i*11)%close.length];
    particles+=`<circle r="3.5" fill="#e5ffff"><animateMotion dur="${3.8+i*.3}s" begin="-${i*.9}s" repeatCount="indefinite" path="${path}"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.7;1" dur="${3.8+i*.3}s" begin="-${i*.9}s" repeatCount="indefinite"/></circle>`;
  }
  return `<g>${edges}${nodes}<ellipse cx="${cx}" cy="${cy}" rx="${r*1.2}" ry="${r*.36}" transform="rotate(-27 ${cx} ${cy})" fill="none" stroke="${C.blue}" stroke-opacity=".5"/><ellipse cx="${cx}" cy="${cy}" rx="${r*1.12}" ry="${r*.43}" transform="rotate(34 ${cx} ${cy})" fill="none" stroke="${C.cyan}" stroke-opacity=".3"/><g class="motion">${particles}</g></g>`;
}

function hero(mobile=false,animate=true){
  const w=mobile?640:1280,h=mobile?540:430,cx=mobile?465:1005,cy=mobile?372:209,r=mobile?148:169;
  const grid=Array.from({length:Math.ceil(w/40)},(_,i)=>line(i*40,0,i*40,h,'#21334c','stroke-opacity=".24"')).join('')+Array.from({length:Math.ceil(h/40)},(_,i)=>line(0,i*40,w,i*40,'#21334c','stroke-opacity=".24"')).join('');
  const stars=Array.from({length:35},(_,i)=>`<circle cx="${(i*137+81)%w}" cy="${(i*79+21)%h}" r="${i%4===0?1.5:.7}" fill="${C.muted}" opacity=".32"/>`).join('');
  const x=mobile?34:58;
  const copy=mobile?
    mono(x,46,'HUANGRUIIII / RESEARCH + CODE',16,C.cyan)+
    txt(x-5,180,'RUI',150,C.text,800,'letter-spacing="-7"')+
    txt(x,232,'Research. Code. Repeat.',29,C.text,600)+
    line(x,273,606,273,'#315066')+
    mono(x,327,'MACHINE',20,C.muted)+mono(x,355,'LEARNING',20,C.muted)+
    mono(x,416,'IDEAS',16,C.cyan)+line(x+61,410,x+103,410,C.cyan)+mono(x,444,'EXPERIMENTS',16,C.cyan)+
    mono(x,507,'READ / BUILD / ITERATE',15,C.muted):
    mono(x,55,'HUANGRUIIII / RESEARCH + CODE',17,C.cyan)+
    txt(x-7,228,'RUI',174,C.text,800,'letter-spacing="-8"')+
    `<rect x="354" y="204" width="15" height="15" fill="${C.cyan}"/>`+
    txt(x,282,'Research. Code. Repeat.',35,C.text,600)+
    mono(x,322,'Turning ideas into experiments.',18,C.muted)+
    line(x,363,1222,363,'#315066')+
    mono(x,401,'01 / MACHINE LEARNING',15,C.muted)+mono(398,401,'02 / PROBABILISTIC MODELS',15,C.muted)+mono(818,401,'03 / RESEARCH TOOLS',15,C.muted);
  return svg(w,h,'Rui — machine learning research, code and experiments',`<g clip-path="url(#frame)"><rect width="${w}" height="${h}" fill="${C.bg}"/>${grid}${stars}<circle cx="${cx}" cy="${cy}" r="${r*1.5}" fill="url(#aura)"/>${network(cx,cy,r,animate)}${copy}<path d="M1 35V1H38M${w-38} 1H${w-1}V35M1 ${h-35}V${h-1}H38M${w-38} ${h-1}H${w-1}V${h-35}" fill="none" stroke="${C.cyan}" stroke-width="2"/><rect x=".5" y=".5" width="${w-1}" height="${h-1}" rx="14" fill="none" stroke="${C.border}"/></g>`,`<clipPath id="frame"><rect width="${w}" height="${h}" rx="14"/></clipPath><radialGradient id="aura"><stop stop-color="#11567b" stop-opacity=".48"/><stop offset="1" stop-color="#11567b" stop-opacity="0"/></radialGradient>`);
}

const projects=[
  {file:'spgbn',n:'01',title:'SPGBN',category:'PROBABILISTIC MODELING',accent:C.cyan,description:['Sparse count data. Structured representations.'],mobile:['Sparse count data.', 'Structured representations.'],tags:'PYTHON / CUDA / RESEARCH CODE',art:'matrix'},
  {file:'neural-odyssey',n:'02',title:'Neural Odyssey',category:'INTERACTIVE ML LEARNING',accent:C.violet,description:['Explore LLMs through 3D experiments and papers.'],mobile:['Explore LLMs through 3D', 'experiments and paper guides.'],tags:'JAVASCRIPT / THREE.JS / EDUCATION',art:'orbit'},
  {file:'experiment-tracker',n:'03',title:'Experiment Tracker',category:'RESEARCH TOOLING',accent:'#6de2b1',description:['Record, compare and export time-series results.'],mobile:['Record, compare and export', 'time-series experiment results.'],tags:'PYTHON / FLASK / TIME SERIES',art:'chart'},
  {file:'thinning-thickening',n:'04',title:'Thinning–Thickening',category:'PAPER REPRODUCTION',accent:C.orange,description:['Self-exciting point processes, reproduced in code.'],mobile:['Self-exciting point processes,', 'reproduced in code.'],tags:'PYTHON / POINT PROCESSES',art:'events'},
];

function projectArt(type,accent) {
  if(type==='matrix'){
    const cells=Array.from({length:40},(_,i)=>{
      const x=(i%8)*21,y=Math.floor(i/8)*21,on=(i*13+3)%11<4;
      return `<rect x="${x}" y="${y}" width="11" height="11" rx="2" fill="${on?accent:'#1b2d43'}" opacity="${on?.85:.8}"/>`;
    }).join('');
    return `<g transform="translate(14 10)">${cells}<path d="M176 52H213M204 44L213 52L204 60" fill="none" stroke="${accent}" stroke-width="2"/><circle cx="236" cy="52" r="12" fill="none" stroke="${accent}"/><circle cx="236" cy="52" r="3" fill="${accent}"/></g>`;
  }
  if(type==='orbit'){
    let rings=`<circle cx="145" cy="62" r="52" fill="none" stroke="${accent}" stroke-opacity=".65"/>`;
    for(const ry of [12,30])rings+=`<ellipse cx="145" cy="62" rx="52" ry="${ry}" fill="none" stroke="${accent}" stroke-opacity=".4"/>`;
    for(const rx of [15,36])rings+=`<ellipse cx="145" cy="62" rx="${rx}" ry="52" fill="none" stroke="${accent}" stroke-opacity=".4"/>`;
    rings+=`<ellipse cx="145" cy="62" rx="112" ry="32" transform="rotate(-21 145 62)" fill="none" stroke="${accent}" stroke-width="1.5"/><circle cx="243" cy="24" r="4" fill="${accent}"/>`;
    return rings;
  }
  if(type==='chart'){
    const grids=[20,50,80,110].map(y=>line(15,y,270,y,'#23364b')).join('');
    const paths=['M15 98L45 77L75 85L105 55L135 64L165 34L195 42L225 21L267 31','M15 106L45 94L75 99L105 84L135 91L165 68L195 77L225 51L267 61'];
    return grids+paths.map((d,i)=>`<path d="${d}" fill="none" stroke="${i===0?accent:C.blue}" stroke-width="2.5" opacity="${i===0?1:.6}"/>`).join('')+`<circle cx="225" cy="21" r="4" fill="${accent}"/>`;
  }
  return [25,62,99].map((y,row)=>{
    const xs=[25,48,99,107,119,175,222,231,245].map((x,i)=>x+((row*i*7)%19)-9);
    return line(12,y,276,y,'#2c3c50')+xs.map((x,i)=>`<path d="M${x} ${y-((i*7+row*3)%18+7)}V${y+3}" stroke="${accent}" stroke-width="2" opacity="${.4+(i%3)*.2}"/>`).join('');
  }).join('');
}

function card(p,mobile=false){
  const w=mobile?640:1120,h=mobile?296:210,x=mobile?30:34;
  const art=mobile?`<g transform="translate(405 24) scale(.66)" opacity=".48">${projectArt(p.art,p.accent)}</g>`:`<g transform="translate(795 46)">${projectArt(p.art,p.accent)}</g>`;
  const description=mobile?p.mobile:p.description;
  const titleY=mobile?115:94;
  return svg(w,h,`${p.title} — ${p.description.join(' ')}`,`<rect x=".5" y=".5" width="${w-1}" height="${h-1}" rx="12" fill="${C.panel}" stroke="${C.border}"/><path d="M1 38V12A11 11 0 0 1 12 1H88" fill="none" stroke="${p.accent}" stroke-width="2"/>${art}${mono(x,38,`${p.n} / ${p.category}`,mobile?17:14,p.accent)}${txt(x,titleY,p.title,mobile?39:38,C.text,700)}${description.map((line,i)=>txt(x,(mobile?163:135)+i*32,line,mobile?26:23,C.muted)).join('')}${line(x,h-52,w-x,h-52,'#25364c')}${mono(x,h-22,p.tags,mobile?17:14,C.muted)}${arrow(w-53,h-36,p.accent)}`);
}

function nav(label,kind){
  const icon=kind==='blog'?'<path d="M15 10H26V28H15Q11 28 11 24V14Q11 10 15 10ZM15 11V28M19 16H23M19 21H23"/>':kind==='mail'?'<rect x="10" y="12" width="20" height="15" rx="2"/><path d="M11 13L20 20L29 13"/>':'<path d="M16 12L10 19L16 26M24 12L30 19L24 26M22 10L18 28"/>';
  return svg(164,38,label,`<rect x=".5" y=".5" width="163" height="37" rx="7" fill="${C.panel}" stroke="#314660"/><g fill="none" stroke="${C.cyan}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${icon}</g>${mono(41,24,label,13,C.text)}${arrow(141,14,C.cyan).replace('stroke-width="2.5"','stroke-width="2"').replace('M0 17L17 0M0 0H17V17','M0 9L9 0M0 0H9V9')}`);
}

await save('hero-desktop.svg',hero());
await save('hero-mobile.svg',hero(true));
await save('hero-desktop-static.svg',hero(false,false));
await save('hero-mobile-static.svg',hero(true,false));
for(const p of projects){await save(`${p.file}-desktop.svg`,card(p));await save(`${p.file}-mobile.svg`,card(p,true));}
await save('nav-blog.svg',nav('NOTES + BLOG','blog'));
await save('nav-email.svg',nav('CONTACT','mail'));
await save('nav-repositories.svg',nav('REPOSITORIES','code'));
await save('signal-divider.svg',svg(1120,28,'',`<path d="M0 14H420L435 7L450 22L465 3L480 19L495 14H1120" fill="none" stroke="url(#signal)" stroke-width="1.4"/>`,`<linearGradient id="signal"><stop stop-color="#53e7f6" stop-opacity="0"/><stop offset=".43" stop-color="#53e7f6"/><stop offset="1" stop-color="#548dff" stop-opacity="0"/></linearGradient>`));
console.log('Generated 16 self-hosted SVG assets.');
