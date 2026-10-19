'use strict';
const canvas=document.querySelector('#film');
const ctx=canvas.getContext('2d');
const audio=document.querySelector('#song');
const play=document.querySelector('#play');
const seek=document.querySelector('#seek');
const clock=document.querySelector('#clock');
const timedLyrics=__TIMED_LYRICS__;
const DURATION=184.08;
// Beat times tracked from full-track.m4a (~95 BPM; section starts fall on odd beats) and
// loudness sampled every 0.25 s (0-99). Re-derive both if the mix changes.
const BEATS=[0.128,0.766,1.393,2.020,2.659,3.286,3.936,4.563,5.201,5.828,6.467,7.094,7.732,8.371,8.998,9.636,10.263,10.902,11.540,12.167,12.806,13.444,14.071,14.710,15.348,15.987,16.614,17.252,17.891,18.518,19.156,19.783,20.434,21.060,21.699,22.326,22.965,23.568,24.242,24.869,25.507,26.146,26.773,27.411,28.026,28.688,29.315,29.942,30.581,31.219,31.858,32.485,33.123,33.762,34.400,35.027,35.666,36.293,36.931,37.558,38.197,38.835,39.462,40.008,40.681,41.378,42.017,42.609,43.282,43.909,44.536,45.174,45.813,46.440,47.078,47.717,48.344,48.982,49.644,50.248,50.887,51.513,52.140,52.779,53.418,54.044,54.683,55.310,55.948,56.575,57.214,57.841,58.479,59.106,59.745,60.372,60.987,61.649,62.276,62.903,63.541,64.134,64.772,65.434,66.072,66.699,67.338,67.965,68.603,69.230,69.869,70.461,71.134,71.761,72.400,73.027,73.654,74.292,74.919,75.558,76.185,76.823,77.462,78.089,78.727,79.354,79.946,80.620,81.247,81.885,82.512,83.151,83.778,84.405,85.043,85.670,86.309,86.936,87.574,88.201,88.828,89.408,90.093,90.732,91.359,91.986,92.624,93.251,93.878,94.459,95.144,95.736,96.374,97.036,97.663,98.302,98.929,99.556,100.182,100.809,101.448,102.063,102.702,103.329,103.944,104.594,105.210,105.837,106.417,107.102,107.729,108.356,108.994,109.621,110.248,110.875,111.502,112.129,112.744,113.383,114.022,114.649,115.275,115.902,116.529,117.156,117.795,118.422,119.049,119.676,120.303,120.930,121.556,122.183,122.799,123.437,124.076,124.703,125.330,125.945,126.584,127.211,127.837,128.464,129.091,129.718,130.287,130.961,131.599,132.226,132.853,133.480,134.107,134.734,135.361,135.988,136.615,137.230,137.868,138.484,139.111,139.738,140.365,140.992,141.619,142.245,142.872,143.499,144.126,144.753,145.357,145.995,146.634,147.249,147.876,148.503,149.130,149.757,150.384,151.011,151.638,152.253,152.880,153.507,154.134,154.715,155.365,156.015,156.665,157.292,157.931,158.534,159.150,159.835,160.427,161.019,161.646,162.284,162.900,163.515,164.142,164.769,165.396,166.023,166.650,167.265,167.892,168.519,169.146,169.773,170.400,171.015,171.642,172.269,172.896,173.511,174.138,174.765,175.392,176.019,176.646,177.261,177.888,178.515,179.142,179.757,180.384,181.011,181.638,182.265,182.892,183.519];
const ENERGY=[10,10,9,12,13,10,9,12,17,19,19,18,19,22,24,25,27,28,36,46,48,37,32,36,32,31,32,31,33,26,27,36,37,37,30,27,33,36,41,39,38,38,35,43,50,50,52,53,59,60,55,46,34,30,36,51,59,53,53,56,56,50,42,48,54,54,50,46,54,55,49,41,26,32,54,61,57,42,35,42,43,43,45,54,62,58,58,51,42,41,38,46,48,41,44,46,52,57,52,49,43,42,42,41,52,57,53,45,40,45,39,37,46,51,58,59,56,53,43,41,44,56,70,70,67,64,62,63,48,44,58,61,62,61,63,66,65,68,59,52,56,56,63,60,47,41,43,42,33,37,53,59,55,50,49,52,45,41,42,38,35,38,53,73,80,77,67,71,78,75,72,62,62,72,72,66,55,61,70,69,75,73,71,74,73,77,76,72,75,72,70,70,71,69,58,59,70,72,73,67,67,74,74,69,54,55,69,73,74,69,69,73,71,71,67,67,68,64,65,63,63,69,67,68,71,74,70,56,59,69,69,69,63,65,72,73,71,62,66,76,76,71,58,60,75,78,75,70,77,82,79,75,60,60,67,53,39,39,42,42,38,35,32,46,71,74,70,68,72,76,65,63,70,73,74,65,67,79,83,83,75,71,72,72,76,70,68,75,78,75,62,62,70,74,76,69,72,83,82,78,69,70,78,81,82,72,70,75,70,72,75,76,71,56,61,72,68,67,61,62,72,73,65,49,56,73,74,69,60,63,71,69,63,46,48,69,75,71,60,63,69,63,64,66,76,83,78,78,75,76,75,68,67,65,69,75,67,66,69,71,70,61,62,69,68,71,72,70,70,72,73,67,71,70,62,65,63,63,64,55,55,46,45,65,76,73,64,62,69,77,82,73,73,75,73,75,70,72,82,82,74,59,56,69,75,74,72,74,77,76,75,74,75,74,66,61,55,50,51,50,49,47,45,44,45,57,78,85,80,72,75,81,81,79,69,69,78,80,75,65,67,74,78,81,74,73,79,82,83,75,73,80,84,80,68,72,81,81,78,67,73,82,81,81,78,84,85,80,80,72,76,87,89,86,72,73,84,84,79,69,73,79,81,84,78,82,88,86,83,76,82,88,87,86,77,78,84,84,86,81,84,90,90,90,87,88,87,83,83,80,85,85,78,80,78,75,80,81,82,86,87,87,85,84,80,84,85,64,49,52,51,48,32,32,42,39,37,28,34,51,51,45,29,29,51,59,56,45,48,69,77,73,58,50,59,63,66,59,55,64,68,67,58,58,63,59,62,57,57,65,64,62,52,54,60,55,54,43,40,54,59,57,56,62,67,61,53,43,49,65,71,69,63,66,68,64,64,58,58,59,50,54,54,56,61,57,55,47,45,48,43,39,25,26,50,54,48,37,28,24,22,27,28,22,20,19,22,26,27,31,32,30,27,24,23,22,18,14,10,5,3,7,19,34,46,61,76,84,93,98,99,96,82,85,89,87,90,88,92,97,99,97,87,91,95,93,90,81,88,95,92,85,75,82,88,88,90,86,91,99,99,99,99,99,99,99,99,87,91,99,99,94,79,92,99,92,88,79,87,97,99,99,89,92,98,99,91,59,53,68,72,69,52,51,60,56,56,42,46,66,70,68,51,50,64,70,66,37,15,12,10,8,6,4,3,1];
const css=getComputedStyle(document.documentElement);
const C=Object.fromEntries(['bg','bg-elevated','surface','border','border-strong','text','text-muted','text-soft','accent','accent-hover','accent-fg','highlight','sheen'].map(k=>[k,css.getPropertyValue('--cp-'+k).trim()]));
const dark=document.documentElement.dataset.theme==='dark';
const paper=dark?C.text:C.bg;
const white=dark?C['text-soft']:C['bg-elevated'];
const ink=dark?C.surface:C.text;
const gray=C['border-strong'];
const muted=C['text-muted'];
const rose=C.accent;
const SKIN='#a9a9a9',HAIR='#5c5c5c',TROUSERS='#4d5361',EYE='#2e2e2e';
const NIGHT='#2b3453',NIGHT2='#46557f',MOON='#f2e6c4',DAWN='#f6d9c4',DUSK='#efc3b0',GOLD='#e9b44c';

const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const easeOut=x=>1-(1-clamp(x))**3;
const lerp=(a,b,p)=>a+(b-a)*p;
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const win=(t,a,b,f=.4)=>Math.min(ease((t-a)/f),ease((b-t)/f));
const pop=(t,at,d=.35)=>{const p=(t-at)/d;return p<=0?0:p>=1?1:easeOut(p)*(1+.35*Math.sin(p*Math.PI));};

// ---------- music clock ----------
const B=i=>BEATS[Math.max(0,Math.min(BEATS.length-1,i))];
function beatAt(t){if(t<BEATS[0])return -1;let lo=0,hi=BEATS.length-1;while(lo<hi){const m=(lo+hi+1)>>1;if(BEATS[m]<=t)lo=m;else hi=m-1;}return lo;}
function beatFloat(t){
  const i=beatAt(t),n=BEATS.length;
  if(i<0)return (t-BEATS[0])/.627;
  if(i>=n-1)return i+(t-BEATS[n-1])/.627;
  return i+(t-BEATS[i])/(BEATS[i+1]-BEATS[i]);
}
const kick=t=>{const f=beatFloat(t);return Math.exp(-(f-Math.floor(f))*5);};
const energy=t=>(ENERGY[Math.max(0,Math.min(ENERGY.length-1,Math.floor(t*4)))]||0)/99;
const onBeat=t=>B(beatAt(t)+1); // first beat after a lyric starts
const HIT_BEAT=255,HIT=B(HIT_BEAT),FREEZE=[159.7,160.43],COUNT_FROM=63;
const daysLeft=t=>Math.max(0,HIT_BEAT-beatAt(t));

const scenes=[
  ['The first page','firstPage',0],
  ['Seventeen, in orchestra','orchestra',17],
  ['The way home','walk',33],
  ['The quiet mornings','quiet',47],
  ['Two places, one thread','chorus',63],
  ['Postcards from Madrid','postcards',105],
  ['The things that remember','sweater',151],
  ['A little closer','chorus2',167],
  ['A language of our own','language',209],
  ['Every mile, a promise','travel',225],
  ['December','reunion',237],
  ['Together on the tandem','tandem',259]
].map(([name,kind,beat])=>{
  if(!beat)return {name,kind,start:0,land:0};
  const fade=kind==='tandem';
  return {name,kind,fade,start:B(beat-(fade?1:2)),land:B(beat)};
});
const OPEN=[B(7),B(11)],PAN_IN=[HIT,B(257)],PAN_OUT=[B(281),B(283)],CLOSE=[B(285),B(289)];
const PAN_ZOOM=1.64;
function panorama(t){
  if(t<PAN_IN[0])return 0;
  if(t<PAN_OUT[0])return ease((t-PAN_IN[0])/(PAN_IN[1]-PAN_IN[0]));
  return 1-ease((t-PAN_OUT[0])/(PAN_OUT[1]-PAN_OUT[0]));
}

// ---------- cut-paper primitives ----------
let NOW=0,BOIL=0,BSTEP=0,GHOST=false;
function jit(x,y){
  if(!BOIL)return [x,y];
  const a=Math.sin(x*12.9898+y*78.233+BSTEP*37.719)*43758.5453,b=Math.sin(x*39.347+y*11.135+BSTEP*13.31)*24634.635;
  return [x+(a-Math.floor(a)-.5)*BOIL*1.5,y+(b-Math.floor(b)-.5)*BOIL*1.5];
}
function poly(points,fill,shadow=false){
  ctx.save();
  if(shadow&&!GHOST){ctx.shadowColor=ink;ctx.shadowBlur=8;ctx.shadowOffsetY=5;}
  ctx.fillStyle=GHOST?white:fill;ctx.beginPath();
  points.forEach((p,i)=>{const [x,y]=jit(p[0],p[1]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
  ctx.closePath();ctx.fill();
  if(GHOST){ctx.setLineDash([5,4]);ctx.strokeStyle=rose;ctx.lineWidth=1.6;ctx.stroke();}
  ctx.restore();
}
function line(points,color=ink,width=2){
  ctx.save();
  if(GHOST){color=rose;width=Math.min(width,2);ctx.setLineDash([5,4]);}
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();
}
function oval(x,y,rx,ry,fill){
  ctx.fillStyle=GHOST?white:fill;ctx.beginPath();ctx.ellipse(x,y,Math.abs(rx),Math.abs(ry),0,0,Math.PI*2);ctx.fill();
}
function label(s,x,y,size=20,color=ink,align='center',font='Georgia'){
  ctx.font=`${size}px ${font}`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(s,x,y);
}
function script(s,x,y,size,color=ink,align='center'){
  ctx.font=`italic ${size}px Georgia`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(s,x,y);
}
function alpha(a,fn){ctx.save();ctx.globalAlpha*=clamp(a);fn();ctx.restore();}
function at(x,y,s,angle,fn){ctx.save();ctx.translate(x,y);ctx.rotate(angle||0);ctx.scale(s,s);fn();ctx.restore();}
function rect(x,y,w,h,fill,shadow=false){poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],fill,shadow);}
function torn(x,y,w,h,fill,seed=1,shadow=true){
  const pts=[],n=Math.max(3,Math.round(w/16)),m=Math.max(3,Math.round(h/16));
  for(let i=0;i<=n;i++)pts.push([x+w*i/n,y+(hash(seed+i)-.5)*4]);
  for(let i=1;i<=m;i++)pts.push([x+w+(hash(seed+40+i)-.5)*4,y+h*i/m]);
  for(let i=n-1;i>=0;i--)pts.push([x+w*i/n,y+h+(hash(seed+80+i)-.5)*5]);
  for(let i=m-1;i>0;i--)pts.push([x+(hash(seed+120+i)-.5)*4,y+h*i/m]);
  poly(pts,fill,shadow);
}
function tape(x,y,angle=0,w=86){
  at(x,y,1,angle,()=>alpha(.62,()=>{
    const z=[];for(let i=0;i<=5;i++)z.push([w/2+(i%2?4:0),-13+i*5.2]);
    const a=[];for(let i=5;i>=0;i--)a.push([-w/2-(i%2?4:0),-13+i*5.2]);
    poly([...z,...a],dark?'#cfc6a8':'#efe4c0');
  }));
}
function stitch(points,color=rose,width=2){ctx.save();ctx.setLineDash([7,5]);line(points,color,width);ctx.restore();}
function stitchText(s,x,y,size,progress,color=rose){
  if(progress<=0)return;
  ctx.save();ctx.font=`italic ${size}px Georgia`;
  const w=ctx.measureText(s).width;
  ctx.beginPath();ctx.rect(x-w/2-10,y-size*1.2,(w+20)*clamp(progress),size*1.7);ctx.clip();
  ctx.setLineDash([6,4]);ctx.lineWidth=2.4;ctx.strokeStyle=color;ctx.textAlign='center';ctx.strokeText(s,x,y);
  ctx.restore();
  if(progress<1){const nx=x-w/2+w*progress;line([[nx,y-size*.9],[nx+10,y-size*1.4]],gray,2);}
}
function heart(x,y,s=1,fill=rose){
  if(s<=0)return;
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=fill;ctx.beginPath();
  ctx.moveTo(0,7);ctx.bezierCurveTo(-28,-8,-14,-28,0,-13);ctx.bezierCurveTo(14,-28,28,-8,0,7);ctx.fill();ctx.restore();
}
function bubble(s,x,y,scale=1,size=20){
  if(scale<=0)return;
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.font=`italic ${size}px Georgia`;const w=Math.max(46,ctx.measureText(s).width/2+16);
  poly([[-w,-30],[w,-31],[w+4,13],[-w*.45,17],[-w*.8,33],[-w*.75,15],[-w-3,12]],white,true);
  script(s,0,1,size);ctx.restore();
}
function bez(x1,y1,x2,y2,sag,p){
  const q=1-p,a=lerp(x1,x2,.3),b=lerp(x1,x2,.7);
  return [q*q*q*x1+3*q*q*p*a+3*q*p*p*b+p*p*p*x2,q*q*q*y1+3*q*q*p*(y1+sag)+3*q*p*p*(y2+sag)+p*p*p*y2];
}
// The rose thread: it thickens on the beat and a bead travels along it each beat.
function thread(x1,y1,x2,y2,t,sag=40,{progress=1,width=3,pulse=true}={}){
  if(progress<=0)return;
  const pts=[];for(let i=0;i<=40*clamp(progress);i++)pts.push(bez(x1,y1,x2,y2,sag,i/40));
  pts.push(bez(x1,y1,x2,y2,sag,clamp(progress)));
  const k=kick(t);line(pts,rose,width+k*1.4);
  if(pulse&&progress>=1){
    const f=beatFloat(t),ph=f-Math.floor(f),[px,py]=bez(x1,y1,x2,y2,sag,Math.floor(f)%2?1-ph:ph);
    oval(px,py,4+k*3,4+k*3,rose);
  }
}
function star(x,y,r,fill=MOON){poly([[x,y-r],[x+r*.25,y-r*.25],[x+r,y],[x+r*.25,y+r*.25],[x,y+r],[x-r*.25,y+r*.25],[x-r,y],[x-r*.25,y-r*.25]],fill);}
function stars(x0,x1,y0,y1,t,n=22,seed=0){
  const b=beatAt(t),k=kick(t);
  for(let i=0;i<n;i++){
    const x=lerp(x0,x1,hash(i+seed)),y=lerp(y0,y1,hash(i+seed+70));
    const tw=.45+.55*Math.abs(Math.sin(t*1.7+i))+((b+i)%4===0?k*.6:0);
    alpha(Math.min(1,tw),()=>star(x,y,3+hash(i+seed+9)*4+((b+i)%4===0?k*3:0)));
  }
}
function moon(x,y,r,bg){oval(x,y,r,r,MOON);oval(x+r*.42,y-r*.18,r*.86,r*.86,bg);}
function sun(x,y,r,t,fill=rose){
  const k=kick(t),spin=t*.25;
  alpha(.18,()=>oval(x,y,r*1.75+k*10,r*1.75+k*10,fill));
  for(let i=0;i<12;i++){
    const a=spin+i*Math.PI/6,l=r*(1.25+(i%2?.12:.3)+k*.2);
    poly([[x+Math.cos(a-.09)*r*1.08,y+Math.sin(a-.09)*r*1.08],[x+Math.cos(a)*l,y+Math.sin(a)*l],[x+Math.cos(a+.09)*r*1.08,y+Math.sin(a+.09)*r*1.08]],fill);
  }
  oval(x,y,r*(1+k*.04),r*(1+k*.04),fill);
}
function hills(off,base,amp,fill,seed,step=150,shadow=true){
  const pts=[[0,900]],k0=Math.floor(off/step)-1;
  for(let k=k0;k<=k0+Math.ceil(1700/step)+2;k++)pts.push([k*step-off,base-hash(k+seed)*amp]);
  pts.push([1700,900]);poly(pts,fill,shadow);
}
function bird(x,y,s,t){
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*3)*.12-.2);ctx.scale(s,s);
  const flap=Math.sin(Math.floor(t*10)/10*9)*10;
  poly([[-23,2],[-3,-4],[18,-24+flap],[12,0],[31,8],[5,13],[-5,24-flap*.5],[-10,8]],white,true);
  line([[-12,4],[4,4],[16,8]],gray,1);ctx.restore();
}
function house(x,y,w,h,roof=true,lit=false){
  poly([[x,y],[x+2,y-h],[x+w-2,y-h+2],[x+w,y]],white,true);
  if(roof)poly([[x-9,y-h],[x+w*.47,y-h-42],[x+w+8,y-h]],muted,true);
  for(let r=0;r<2;r++)for(let c=0;c<2;c++){
    const wx=x+14+c*(w-39),wy=y-h+20+r*45;
    rect(wx,wy,17,24,lit?GOLD:rose);line([[wx+8,wy],[wx+8,wy+24]],paper,1);
  }
}
function city(x,y,s=1,lit=false){
  at(x,y,s,0,()=>{
    house(-205,0,83,166,false,lit);house(-111,0,92,122,false,lit);house(83,0,97,143,false,lit);house(191,0,64,107,false,lit);
    poly([[4,0],[5,-214],[57,-213],[60,0]],white,true);
    poly([[-4,-212],[31,-246],[68,-211]],muted,true);
    oval(31,-185,13,13,paper);line([[31,-194],[31,-185],[39,-180]],ink,2);
    for(let n=0;n<3;n++){ctx.fillStyle=muted;ctx.fillRect(18,-151+n*43,26,26);oval(31,-151+n*43,13,11,muted);}
  });
}
function tree(x,y,s=1,fill=muted){
  at(x,y,s,0,()=>{
    poly([[-10,0],[-6,-177],[5,-180],[13,0]],ink);
    oval(0,-166,39,57,fill);oval(-23,-140,31,38,fill);oval(25,-136,30,41,fill);
  });
}
function violin(x,y,s=1,angle=0){
  at(x,y,s,angle,()=>{
    oval(0,8,21,26,rose);oval(0,-17,17,22,rose);
    oval(-20,-6,8,9,paper);oval(20,-6,8,9,paper);
    poly([[-4,-24],[-4,-82],[4,-82],[4,-24]],ink);
    line([[0,-78],[0,30]],white,1);
  });
}
function suitcase(x,y,s=1,angle=0){
  at(x,y,s,angle,()=>{
    line([[-14,-62],[-14,-74],[14,-74],[14,-62]],ink,5);
    poly([[-34,-62],[34,-62],[36,0],[-36,0]],rose,true);
    line([[-34,-40],[34,-40]],paper,2);tape(0,-22,.1,40);
  });
}
function plane(x,y,s=1,angle=0){
  at(x,y,s,angle,()=>{
    poly([[-55,-23],[62,0],[-44,33],[-17,3]],white,true);
    line([[-17,3],[62,0],[-31,14]],gray,2);poly([[-17,3],[-26,34],[-31,14]],paper);
  });
}
function bed(x=0,y=0){
  at(x,y,1,0,()=>{
    poly([[277,600],[303,476],[630,476],[675,603]],white,true);
    poly([[292,492],[295,407],[646,409],[651,493]],muted,true);
    poly([[308,498],[319,457],[433,457],[442,497]],paper,true);
    poly([[464,497],[472,456],[608,458],[621,499]],paper,true);
    poly([[293,520],[651,522],[675,604],[277,602]],gray,true);
    stitch([[309,531],[644,533]],paper,2);
  });
}
function sweater(x,y,s=1){
  at(x,y,s,0,()=>{
    poly([[-34,-41],[-63,-51],[-104,-14],[-81,12],[-50,-8],[-49,64],[49,65],[48,-8],[81,13],[103,-14],[62,-51],[32,-42],[19,-29],[-19,-29]],rose,true);
    for(let row=-20;row<56;row+=12)line([[-38,row],[-20,row+3],[0,row],[20,row+3],[38,row]],paper,1);
  });
}
function burst(x,y,since,n=46,seed=3){
  if(since<0||since>3.2)return;
  for(let i=0;i<n;i++){
    const a=i*2.39996+hash(i+seed),v=260+hash(i+seed+5)*560,d=since;
    const px=x+Math.cos(a)*v*d*(1-d*.18),py=y+Math.sin(a)*v*d*(1-d*.18)+170*d*d;
    alpha(1-ease((d-2)/1.2),()=>at(px,py,1,a+d*(3+hash(i)*5),()=>{
      if(i%3===0)heart(0,0,.45+hash(i+9)*.4);
      else if(i%3===1)rect(-7,-10,14,20,i%2?rose:GOLD);
      else{rect(-12,-14,24,28,white,true);ctx.fillStyle=rose;ctx.fillRect(-12,-14,24,7);}
    }));
  }
}
function snow(t,x0,x1,y0,y1,n=40,drift=0){
  for(let i=0;i<n;i++){
    const sp=26+hash(i+3)*40,x=x0+(((hash(i)*(x1-x0)-drift*(.3+hash(i+8)*.5)+Math.sin(t*.8+i)*14)%(x1-x0))+(x1-x0))%(x1-x0);
    const y=y0+((hash(i+20)*(y1-y0)+t*sp)%(y1-y0)),r=3+hash(i+30)*5;
    alpha(.85,()=>at(x,y,1,t*.6+i,()=>{for(let k=0;k<3;k++){const a=k*Math.PI/3;line([[-Math.cos(a)*r,-Math.sin(a)*r],[Math.cos(a)*r,Math.sin(a)*r]],white,1.6);}}));
  }
}

// ---------- the two paper dolls ----------
function face(t,mood,look,seed,boy){
  if(GHOST)return;
  const ex=look*3.5,blink=((t+seed*1.3)%3.4)<.12;
  for(const x of [-10,5]){
    if(mood==='laugh')line([[x-4,-154],[x,-160],[x+4,-154]],EYE,2.2);
    else if(mood==='sleepy'||blink)line([[x-4,-157],[x+4,-157]],EYE,2.2);
    else if(mood==='annoyed'){oval(x+ex,-156,4,2.6,EYE);line([[x-5,-159],[x+5,-159.5]],EYE,1.6);}
    else if(mood==='surprise')oval(x+ex,-158,4.5,5.5,EYE);
    else oval(x+ex,-158,3.3,4.2,EYE);
  }
  alpha(.6,()=>{oval(-16,-149,4,2.6,rose);oval(11,-149,4,2.6,rose);});
  ctx.save();ctx.strokeStyle=EYE;ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();
  if(mood==='laugh'){ctx.restore();oval(-2+ex*.4,-145,6,4.5,EYE);return;}
  if(mood==='surprise'){ctx.restore();oval(-2,-145,3,3.6,EYE);return;}
  if(mood==='annoyed'||mood==='sad')ctx.moveTo(-7,-145),ctx.lineTo(3,-145.5);
  else if(mood==='sleepy')ctx.arc(-2,-145,3,0,Math.PI*2);
  else ctx.arc(-2+ex*.4,-150,6,.25*Math.PI,.75*Math.PI);
  ctx.stroke();ctx.restore();
}
function person(x,y,o={}){
  const {boy=false,s=1,flip=1,t=NOW,pose='stand',look=0,mood='smile',lean=0,ghost=false}=o;
  const seed=boy?1.7:0,q=Math.floor(t*12)/12; // characters move "on twos", like stop-motion
  const was=GHOST;GHOST=ghost||GHOST;
  ctx.save();ctx.translate(x,y);ctx.scale(s*flip,s);
  if(!GHOST)alpha(.16,()=>oval(0,0,31,6,ink));
  const run=pose==='run',walk=pose==='walk';
  const cyc=q*(run?9:5.5);
  const stride=run?Math.sin(cyc)*24:walk?Math.sin(cyc)*13:0;
  const liftL=run?Math.max(0,Math.sin(cyc+1.6))*18:0,liftR=run?Math.max(0,-Math.sin(cyc+1.6))*18:0;
  const bounce=run?-Math.abs(Math.sin(cyc))*7:walk?-Math.abs(Math.sin(cyc))*3:-kick(t)*2.2;
  ctx.translate(0,bounce);
  const legs=boy?TROUSERS:SKIN;
  line([[-11,-66],[-12+stride,-5-liftL]],legs,14);
  line([[11,-66],[13-stride,-5-liftR]],legs,14);
  line([[-12+stride,-4-liftL],[-25+stride,-4-liftL]],ink,7);
  line([[13-stride,-4-liftR],[24-stride,-4-liftR]],ink,7);
  ctx.translate(0,-66);ctx.rotate(lean+(run?.1:0));ctx.translate(0,66);
  ctx.save();ctx.translate(0,-68);ctx.scale(1,1+Math.sin(q*2.2+seed)*.014);ctx.translate(0,68);
  poly(boy?[[-24,-132],[-12,-140],[10,-140],[23,-131],[20,-76],[-21,-76]]:[[-21,-136],[15,-136],[31,-68],[-30,-68]],boy?muted:rose,true);
  if(boy)poly([[-21,-78],[20,-78],[20,-62],[-20,-62]],TROUSERS);
  else stitch([[-26,-80],[26,-80]],paper,1.4);
  ctx.restore();
  const sw=stride*.6,k=kick(t);
  if(pose==='violin'){
    const bow=Math.sin(beatFloat(t)*Math.PI)*20;
    violin(12,-122,.55,-1.15);
    line([[-18,-126],[-30,-112],[-38,-136]],SKIN,9);
    line([[17,-126],[28,-100],[36+bow,-108]],SKIN,9);
    line([[6+bow,-150],[66+bow,-96]],ink,2.5);
  }else if(pose==='phone'){
    line([[-18,-126],[-33,-98],[-31,-75]],SKIN,9);
    line([[17,-126],[33,-110],[37,-132]],SKIN,9);
    poly([[29,-149],[39,-150],[42,-125],[33,-124]],white);
  }else if(pose==='hug'){
    line([[-18,-125],[-10,-100],[16,-96]],SKIN,9);
    line([[17,-126],[44,-130],[62,-120]],SKIN,9);
  }else if(pose==='wave'){
    line([[-18,-126],[-24,-96],[-22,-76]],SKIN,9);
    line([[17,-126],[36,-150],[40+Math.sin(q*12)*9,-178]],SKIN,9);
  }else if(pose==='reach'){
    line([[-18,-126],[12,-130],[46,-134]],SKIN,9);line([[17,-126],[44,-134],[70,-140]],SKIN,9);
  }else if(pose==='sign'||pose==='cheer'){
    line([[-18,-126],[-28,-158],[-22,-196+k*3]],SKIN,9);line([[17,-126],[27,-158],[21,-196+k*3]],SKIN,9);
  }else if(run){
    line([[-18,-126],[-30-sw,-106],[-18-sw*1.5,-92]],SKIN,9);line([[17,-126],[30+sw,-106],[18+sw*1.5,-92]],SKIN,9);
  }else{
    const sway=Math.sin(q*1.3+seed)*2;
    line([[-18,-126],[-25-sw*.7,-93],[-22-sw,-75+sway]],SKIN,9);
    line([[17,-126],[25+sw*.7,-102],[23+sw,-78-sway]],SKIN,9);
  }
  ctx.save();ctx.translate(-2,-136);ctx.rotate(look*.07+(mood==='laugh'?Math.sin(q*14)*.07:0));ctx.translate(2,136);
  oval(-2,-158,19,24,SKIN);
  if(boy){
    poly([[-21,-163],[-21,-176],[-12,-181],[-4,-180],[2,-186],[7,-177],[16,-175],[19,-164],[8,-169],[-9,-169]],HAIR);
    // the duck tuft
    poly([[3,-180],[5,-187],[10,-191],[14,-190],[9,-186],[9,-181]],HAIR);
  }else poly([[-22,-151],[-24,-173],[-12,-184],[6,-185],[19,-174],[23,-143],[10,-144],[8,-168],[-10,-169]],HAIR);
  face(t,mood,look,seed,boy);
  ctx.restore();
  ctx.restore();GHOST=was;
}
function bike(x,y,s=1,spin=0,riders=[],t=NOW,bell=0){
  at(x,y,s,0,()=>{
    for(const wx of [-79,79]){
      ctx.beginPath();ctx.arc(wx,0,34,0,Math.PI*2);ctx.strokeStyle=ink;ctx.lineWidth=3;ctx.stroke();
      for(let n=0;n<8;n++){const a=n*Math.PI/4+spin;line([[wx,0],[wx+Math.cos(a)*32,Math.sin(a)*32]],gray,1);}
    }
    line([[-79,0],[-45,-50],[-10,0],[-79,0]],rose,4);
    line([[-45,-50],[26,-50],[-10,0],[79,0],[52,-63]],rose,4);
    line([[26,-50],[43,0]],rose,4);
    line([[-46,-50],[-48,-65],[-60,-65]],ink,4);
    line([[24,-50],[22,-65],[10,-65]],ink,4);
    line([[52,-63],[49,-76],[66,-79]],ink,4);
    at(64,-82,1,Math.sin(bell*30)*bell*.5,()=>{oval(0,0,6,6,GOLD);});
    const pedal=beatFloat(t)*Math.PI;
    riders.forEach((r,i)=>{
      if(!r)return;
      const px=i?27:-43,was=GHOST;GHOST=!!r.ghost;
      ctx.save();ctx.translate(px,-48);
      oval(0,-98,14,18,SKIN);
      if(r.boy){poly([[-14,-109],[-12,-119],[1,-122],[9,-117],[14,-109]],HAIR);poly([[2,-119],[4,-124],[8,-126],[6,-121]],HAIR);}
      else poly([[-16,-103],[-17,-117],[-7,-124],[8,-122],[17,-108],[18,-91],[9,-92]],HAIR);
      if(!GHOST){oval(5,-101,2.3,3,EYE);oval(-5,-101,2.3,3,EYE);alpha(.6,()=>oval(-9,-94,3,2,rose));}
      poly([[-12,-77],[9,-80],[23,-33],[-12,-31]],r.boy?muted:rose,true);
      line([[9,-68],[26,-47],[40,-40]],SKIN,7);
      const a=Math.sin(pedal+i)*10;
      line([[0,-30],[22,-6+a],[10,15]],r.boy?TROUSERS:SKIN,8);line([[-6,-30],[-15,-4-a],[3,15]],r.boy?TROUSERS:SKIN,6);
      ctx.restore();GHOST=was;
    });
  });
}
function calendar(x,y,s,t){
  if(beatAt(t)<COUNT_FROM||t>=HIT)return;
  const d=daysLeft(t),f=beatFloat(t),ph=f-Math.floor(f),k=kick(t);
  at(x,y,s*(1+k*.05),-.035,()=>{
    poly([[-58,-50],[56,-49],[59,47],[-59,50]],white,true);
    ctx.fillStyle=rose;ctx.fillRect(-58,-50,114,26);
    label('DAYS TILL DECEMBER',0,-32,9.5,paper,'center','"Segoe UI"');
    label(String(d),0,30,d>99?40:46,ink);
    if(ph<.55)alpha(1-ph/.55,()=>at(ph*60,10+ph*120,1,ph*1.6,()=>{
      poly([[-56,-22],[56,-22],[58,46],[-58,48]],white,true);label(String(d+1),0,30,d+1>99?40:46,ink);
    }));
  });
}
const cornerCalendar=t=>calendar(1322,236,.62,t);

// ---------- spreads ----------
function firstPage(t){
  at(480,400,1,-.06,()=>{
    torn(-175,-78,350,156,white,3);
    ctx.fillStyle=rose;ctx.fillRect(-175,-78,72,156);
    stitch([[-103,-70],[-103,70]],paper,1.5);
    label('ADMIT ONE',-139,6,12,paper,'center','"Segoe UI"');
    label('SPRING CONCERT',38,-24,24,ink,'center','"Segoe UI"');
    script('school orchestra · row F, seat 17',38,10,17,muted);
    label('No. 0017',38,46,13,gray,'center','"Segoe UI"');
  });
  tape(326,340,-.5);tape(640,452,.45);
  at(400,600,1,.2,()=>{line([[0,0],[40,-70]],muted,3);for(let i=0;i<5;i++){const a=i*1.256;oval(40+Math.cos(a)*11,-74+Math.sin(a)*11,9,6,rose);}oval(40,-74,6,6,GOLD);});
  script('seventeen',1100,380,84,rose);
  stitch([[960,410],[1240,410]],rose,2);
  oval(1112,560,40,26,rose);rect(1072,540,80,40,rose);oval(1112,540,40,14,white);
  thread(1075,555,700,470,t,90,{pulse:false,width:2});
}
function orchestra(t){
  const L=scenes[1].land,u=t-L;
  poly([[196,164],[350,164],[310,280],[262,440],[196,500]],rose,true);
  poly([[1404,164],[1250,164],[1290,280],[1338,440],[1404,500]],rose,true);
  for(let i=0;i<16;i++)oval(212+i*78,170,42,22,rose);
  alpha(.35,()=>{for(let i=0;i<5;i++)line([[330,240+i*11],[1270,240+i*11]],gray,1);});
  for(let i=0;i<10;i++){const b=beatAt(t);alpha(.6,()=>oval(360+i*92,248+(i%4)*11-((b+i)%2?kick(t)*8:0),7,5,ink));}
  alpha(.22,()=>rect(196,610,1208,104,gray));
  for(const x of [330,1270]){rect(x-36,520,72,12,gray,true);line([[x-26,532],[x-32,605]],ink,3);line([[x+26,532],[x+32,605]],ink,3);}
  for(const x of [450,1150]){
    line([[x,470],[x,615]],ink,3);line([[x,615],[x-26,628]],ink,3);line([[x,615],[x+26,628]],ink,3);
    poly([[x-40,425],[x+38,424],[x+44,474],[x-38,476]],white,true);
    for(let i=0;i<4;i++)line([[x-26,440+i*7],[x+28,440+i*7]],gray,1);
  }
  const look=u>2&&Math.floor(u/1.9)%3===1?1:0;
  person(640,640,{s:1.35,pose:'violin',t,look:look||(t>B(27)?1:0)});
  person(960,640,{boy:true,s:1.35,flip:-1,pose:'violin',t:t+.3,look:look||(t>B(27)?1:0)});
  const b=beatAt(t);
  for(let j=0;j<6;j++){
    const bi=b-j;if(bi<17)continue;
    const p=(t-B(bi))/3.2;if(p<0||p>1)continue;
    const fromLeft=bi%2,x=(fromLeft?690:910)+Math.sin(p*6+bi)*20,y=430-p*170;
    alpha(1-p,()=>{oval(x,y,7,5,ink);line([[x+6,y],[x+6,y-22],[x+14,y-16]],ink,2);});
  }
  bubble('meep',600,330,pop(t,B(25))*.95);
  bubble('murp',1000,318,pop(t,B(27))*.95);
  const tp=ease((t-18.5)/1.6);
  thread(708,452,892,452,t,26,{progress:tp,width:2.5});
  if(tp>=1)heart(800,410,pop(t,20.1)*(.7+kick(t)*.12));
}
function walk(t){
  const L=scenes[2].land,u=t-L,camX=62*Math.min(Math.max(u,0),5.4);
  alpha(.75,()=>rect(196,164,1208,420,DUSK));
  alpha(ease((u-4)/3),()=>stars(220,1380,180,330,t,14,4));
  sun(1180,430+Math.max(0,u)*7,46,t,rose);
  alpha(.55,()=>hills(camX*.2,520,120,gray,7,170,false));
  hills(camX*.45,560,60,white,19,130,true);
  for(let r=0;r<4;r++){const bx=1120-camX*.7;poly([[bx,500+r*26],[bx+360,500+r*26],[bx+360,512+r*26],[bx,512+r*26]],gray,true);}
  for(let i=0;i<3;i++){const bx=1120-camX*.7+i*170;line([[bx+20,512],[bx+14,610]],ink,2);}
  poly([[150,600],[1450,594],[1450,720],[150,720]],paper,true);
  for(const wx of [300,820,1340,1900])tree(wx-camX,604,.95);
  house(1560-camX,606,150,170,true,true);
  const walking=u<5.4,pose=walking?'walk':'stand';
  person(640,640,{s:1.3,pose,t,look:walking?0:1});
  person(760,640,{boy:true,s:1.3,flip:-1,pose,t:t+.45,look:walking?(Math.floor(u)%3===0?1:0):1});
  thread(683,540,717,540,t,10,{pulse:false});
  heart(700,lerp(530,430,ease((t-25.7)/2)),pop(t,onBeat(25.69))*(.8+kick(t)*.1));
  torn(290,650,250,40,white,9,false);script('the long way home',415,678,20,muted);
}
function quiet(t){
  const L=scenes[3].land,u=t-L,g=ease((t-onBeat(35.43))/1.3);
  // kitchen
  alpha(.5,()=>rect(196,164,604,550,DAWN));
  rect(300,230,190,160,white,true);rect(312,242,166,136,MOON);
  sun(400,350-ease(u/8)*40,24,t,rose);
  line([[395,242],[395,378]],white,5);line([[312,310],[478,310]],white,5);
  person(410,630,{s:1.3,t,mood:'sad',look:t>onBeat(35.43)?1:.6});
  const ghost=win(t,32.6,35.4,.7);
  if(ghost>0)alpha(ghost*.9,()=>person(660,630,{boy:true,s:1.3,flip:-1,t,ghost:true}));
  poly([[250,560],[760,560],[770,580],[240,580]],muted,true);
  line([[270,580],[268,690]],ink,5);line([[740,580],[742,690]],ink,5);
  rect(350,528,30,32,white,true);rect(600,528,30,32,white,true);
  for(let i=0;i<3;i++){const y0=520-((t*30+i*12)%40);alpha(.6,()=>line([[358+i*7,y0],[354+i*7,y0-8],[360+i*7,y0-16]],gray,2));}
  // garage
  poly([[880,640],[880,330],[1110,220],[1340,330],[1340,640]],white,true);
  rect(910,350,400,290,paper);
  alpha(.18*g,()=>poly([[1040,350],[1180,350],[1300,640],[920,640]],GOLD));
  ctx.save();ctx.beginPath();ctx.rect(910,350,400,290);ctx.clip();
  bike(1110,598,1.15,0,[],t,g>0?kick(t)*g:0);
  ctx.restore();
  at(1176,514,1,Math.sin(t*2)*.1,()=>{line([[0,0],[0,18]],ink,1);heart(0,26,.55);});
  const door=g*250;
  ctx.save();ctx.beginPath();ctx.rect(910,350,400,290);ctx.clip();
  for(let i=0;i<8;i++){const y=350+i*36.25-door;rect(910,y,400,37,muted);line([[920,y+33],[1300,y+33]],gray,1);}
  ctx.restore();
  torn(1010,660,200,36,white,13,false);script('a place for two',1110,685,19,muted);
}
function homeNight(t,dx){
  ctx.save();ctx.beginPath();ctx.rect(150,120,650,640);ctx.clip();
  rect(196,164,604,420,NIGHT);
  stars(220,780,180,420,t,18,2);moon(320,250,34,NIGHT);
  ctx.translate(dx,0);
  alpha(.9,()=>hills(0,560,90,NIGHT2,3,140,false));
  tree(290,600,.85,NIGHT2);house(360,602,120,140,true,true);
}
function madridDawn(t,dx,sunP){
  ctx.save();ctx.beginPath();ctx.rect(800,120,650,640);ctx.clip();
  rect(800,164,604,420,DAWN);
  sun(1220,lerp(560,300,sunP),50,t);
  ctx.translate(dx,0);
  alpha(.6,()=>hills(0,540,80,DUSK,5,150,false));
  city(1210,602,.8);
}
function chorus(t){
  const L=scenes[4].land,u=t-L;
  const apart=win(t,49.31,51.54,.5)*46,close=ease(u/26)*18-apart;
  homeNight(t,close);
  poly([[150,600],[800,592],[800,720],[150,720]],paper,true);
  const mood=t>55.21&&t<57.85?'annoyed':'smile';
  person(560,650,{s:1.3,pose:'phone',t,mood,look:mood==='annoyed'?0:1});
  ctx.restore();
  madridDawn(t,-close,ease((t-45.24)/5));
  poly([[800,592],[1450,600],[1450,720],[800,720]],paper,true);
  person(1040,650,{boy:true,s:1.3,flip:-1,pose:'phone',t:t+.2,look:1,mood:t>57.85&&t<60.24?'surprise':'smile'});
  ctx.restore();
  const ax=560+close+40*1.3,bx=1040-close-40*1.3,py=650-138*1.3;
  thread(ax,py,bx,py,t,lerp(60,26,ease(u/26))+apart*.6);
  if(t>51.54&&t<55.21){const k=kick(t);for(let r=1;r<=3;r++)alpha((1-k)*.8/r,()=>{ctx.beginPath();ctx.arc(ax,py,14+r*12+k*8,-1.2,1.2);ctx.strokeStyle=GOLD;ctx.lineWidth=3;ctx.stroke();});}
  calendar(800,624,1,t);
  const b=beatAt(t),flurry=t>64.39;
  for(let j=0;j<10;j++){
    const bi=b-j;if(bi<63||(!flurry&&bi%2))continue;
    const q=(t-B(bi))/3.4;if(q<0||q>=1)continue;
    const x=800+q*360+Math.sin(q*7+bi)*30,y=600-Math.sin(q*Math.PI)*300;
    alpha(Math.min(q*6,(1-q)*5),()=>{
      if(q>.5)bird(x,y,.8,t+bi);
      else at(x,y,1,Math.sin(q*5+bi)*.3,()=>{rect(-16,-21,32,42,white,true);ctx.fillStyle=rose;ctx.fillRect(-16,-21,32,9);});
    });
  }
  bubble('¿qué tal, cariño?',1000-close,330,pop(t,onBeat(55.21))*win(t,55.21,58.5,.3),18);
  bubble('…',560+close,340,pop(t,onBeat(55.6))*win(t,55.21,57.85,.3));
  bubble('meep.',560+close,340,pop(t,onBeat(57.85))*win(t,57.85,60.24,.3));
  bubble('¿mip?',1000-close,330,pop(t,onBeat(58.5))*win(t,58.5,60.24,.3));
  const hp=pop(t,onBeat(60.24));
  if(hp)heart(800,py+38,hp*(1+kick(t)*.18));
}
function postcardArt(kind,t,drip=0){
  ctx.fillStyle=kind===1?NIGHT:DAWN;ctx.fillRect(-151,-113,302,190);
  if(kind===0){
    sun(90,-62,26,t);
    for(let i=0;i<5;i++){
      const x=-130+i*56;rect(x,-30,48,107,white);oval(x+24,-30,24,24,white);poly([[x+10,77],[x+10,-20],[x+38,-20],[x+38,77]],muted);oval(x+24,-20,14,14,muted);
      if(drip>0){const l=((t*30+i*17)%46)*drip;line([[x+24,-56],[x+24,-56+l]],rose,4);oval(x+24,-54+l,4,5,rose);}
    }
  }else if(kind===1){moon(90,-60,22,NIGHT);city(-10,77,.48,true);}
  else if(kind===2){sun(-80,-50,22,t,GOLD);for(let i=0;i<3;i++){line([[-40+i*70,77],[-30+i*70,-10]],ink,5);for(let k=0;k<5;k++){const a=-2.6+k*.55;line([[-30+i*70,-10],[-30+i*70+Math.cos(a)*34,-10+Math.sin(a)*34]],muted,6);}}}
  else{city(0,77,.5);oval(-90,-60,26,26,rose);}
}
function postcard(x,y,s,angle,kind,t,drip=0,caption='Madrid, with love'){
  at(x,y,s,angle,()=>{
    torn(-170,-132,340,264,white,kind*7+1);
    ctx.save();ctx.beginPath();ctx.rect(-151,-113,302,190);ctx.clip();postcardArt(kind,t,drip);ctx.restore();
    script(caption,0,108,22);
    tape(-150,-128,-.6,70);tape(150,-128,.6,70);
  });
}
function postcards(t){
  const L=scenes[5].land;
  const cards=[[500,400,-.05,0,105,'la plaza, 9 a.m.'],[1220,575,.07,1,109,'night in Sol'],[960,560,-.04,2,113,'Retiro'],[1080,300,.05,3,117,'Madrid, with love']];
  const gone=ease((t-81.2)/.6);
  cards.forEach(([x,y,a,k,beat,cap],i)=>{
    const p=easeOut((t-B(beat))/.55);if(p<=0)return;
    const off=i?0:gone,fx=lerp(1700,x,p)-off*700,fy=lerp(-160,y,p)+off*120;
    if(off<1)postcard(fx,fy,i?.62:1.05,a+(1-p)*1.4-off*.6,k,t,k===0?win(t,76.75,81.62,.6):0,cap);
  });
  // voice note
  const vn=win(t,81.62,86.73,.4);
  if(vn>0)alpha(vn,()=>{
    alpha(.85,()=>rect(196,164,604,300,NIGHT));moon(300,250,30,NIGHT);stars(380,780,190,400,t,10,6);
    torn(300,470,360,96,white,21);
    oval(340,518,20,20,rose);poly([[334,506],[350,518],[334,530]],paper);
    for(let i=0;i<20;i++){const h=8+energy(t-i*.06)*44*(.6+.4*Math.abs(Math.sin(i*1.7)))+(i%4===beatAt(t)%4?kick(t)*10:0);line([[378+i*13,518-h/2],[378+i*13,518+h/2]],rose,4);}
    script('voice note · 0:47 · “meep”',480,590,17,muted);
    person(700,700,{s:1.15,pose:'phone',t,flip:-1,look:1});
  });
  // tandem down the driveway with his outline on the back seat
  const tp=(t-86.73)/4.95;
  if(tp>0&&tp<1.1){
    const x=lerp(120,1500,ease(tp));
    poly([[150,650],[1450,640],[1450,720],[150,720]],paper,true);
    bike(x,660,1.05,x/34,[{boy:true,ghost:true},{boy:false}],t);
  }
  // morning face, half-awake
  const mf=win(t,91.68,96.5,.4);
  if(mf>0)alpha(mf,()=>{
    person(400,700,{s:1.3,t,mood:'laugh',pose:'stand',look:1});
    for(let i=0;i<3;i++)oval(470+i*26,450-i*22,7+i*3,6+i*3,white);
    at(640,300,pop(t,onBeat(91.68)),0,()=>{
      for(let i=0;i<9;i++){const a=i*Math.PI*2/9;oval(Math.cos(a)*92,Math.sin(a)*62,44,40,white);}
      oval(0,0,100,70,white);
      ctx.save();ctx.translate(0,215);ctx.scale(1.35,1.35);
      oval(-2,-158,19,24,SKIN);
      poly([[-21,-163],[-21,-176],[-12,-181],[-4,-180],[2,-186],[7,-177],[16,-175],[19,-164],[8,-169],[-9,-169]],HAIR);
      poly([[3,-180],[5,-187],[10,-191+Math.sin(t*6)*2],[14,-190],[9,-186],[9,-181]],HAIR);
      face(t,'sleepy',0,1,true);ctx.restore();
      script('z',60,-30,22,muted);script('z',76,-48,16,muted);
    });
  });
  cornerCalendar(t);
}
function sweaterScene(t){
  alpha(.9,()=>rect(196,164,1208,550,NIGHT2));
  alpha(.5,()=>rect(196,560,1208,154,NIGHT));
  rect(860,220,170,200,NIGHT);moon(945,300,34,NIGHT);line([[945,220],[945,420]],white,6);line([[860,320],[1030,320]],white,6);
  bed(-40,40);
  sweater(449,520,.8);
  person(1120,700,{s:1.4,t,flip:-1,look:1,mood:t>101?'smile':'sad'});
  const p1=ease((t-onBeat(101.01))/1.5),p2=ease((t-102.9)/1.5);
  if(p1>0){
    const [nx,ny]=bez(470,500,560,300,-60,Math.min(1,p1*1.4));
    thread(470,500,nx,ny,t,-60,{pulse:false,width:2});
  }
  stitchText('meep',560,300,72,p1);
  stitchText('murp',1060,250,72,p2);
  alpha(ease((t-104.4)/.6),()=>{heart(800,300,.8+kick(t)*.15);});
  cornerCalendar(t);
}
function chorus2(t){
  const L=scenes[7].land,u=t-L,e=energy(t),k=kick(t);
  const away=1-.09*win(t,114.97,117.13,.5);
  ctx.save();ctx.translate(800,440);ctx.scale(away,away);ctx.translate(-800,-440);
  // her room, night
  rect(196,164,604,550,NIGHT);
  rect(250,200,500,360,white,true);rect(266,216,468,328,NIGHT2);
  stars(270,730,226,530,t,24,11);
  oval(520,480,96+k*6,96+k*6,MOON);
  line([[500,216],[500,544]],white,8);line([[266,380],[734,380]],white,8);
  person(520,900,{s:2.6,pose:'phone',t,look:1,mood:t>120.8&&t<123.43?'annoyed':t>123.43&&t<125.9?'laugh':'smile'});
  // his room, sunrise
  rect(800,164,604,550,DAWN);
  rect(850,200,500,360,white,true);
  ctx.save();ctx.beginPath();ctx.rect(866,216,468,328);ctx.clip();
  rect(866,216,468,328,DUSK);
  sun(1080,lerp(600,420,ease((t-110.98)/5)),70,t);
  city(1130,560,.7);ctx.restore();
  line([[1100,216],[1100,544]],white,8);line([[866,380],[1334,380]],white,8);
  person(1080,900,{boy:true,s:2.6,flip:-1,pose:'phone',t:t+.2,look:1,mood:t>123.43&&t<125.9?'laugh':'smile'});
  ctx.restore();
  const ax=520+37*2.6,bx=1080-37*2.6,py=900-138*2.6;
  thread(ax,py,bx,py,t,lerp(40,14,ease(u/24)),{width:3+e*3});
  if(t>117.13&&t<120.8)for(const x of [ax,bx])for(let r=1;r<=3;r++)alpha((1-k)*.8/r,()=>{ctx.beginPath();ctx.arc(x,py,18+r*14+k*10,0,Math.PI*2);ctx.strokeStyle=GOLD;ctx.lineWidth=3;ctx.stroke();});
  bubble('¡te echo de menos!',1080,250,1.5*pop(t,onBeat(120.8))*win(t,120.8,123.43,.3),18);
  bubble('…',520,260,1.5*pop(t,onBeat(121.4))*win(t,120.8,123.43,.3));
  bubble('meep!',520,260,1.5*pop(t,onBeat(123.43))*win(t,123.43,125.9,.3));
  bubble('¡murp!',1080,250,1.5*pop(t,onBeat(124.1))*win(t,123.43,125.9,.3));
  const hp=pop(t,onBeat(125.9));
  if(hp)heart(800,py+30,hp*(1.5+k*.3));
  calendar(800,640,1.15,t);
  const b=beatAt(t),flurry=t>129.89;
  for(let j=0;j<16;j++){
    const bi=b-j;if(bi<167)continue;
    const n=flurry?3:bi%2?0:1;
    for(let m=0;m<n;m++){
      const q=(t-B(bi))/3;if(q<0||q>=1)continue;
      const a=(bi*1.7+m*2.1)%(Math.PI*2),r=q*520;
      alpha(1-q,()=>at(800+Math.cos(a)*r,640+Math.sin(a)*r*.6-q*200,1,q*6+a,()=>{
        if(m===2)heart(0,0,.6);
        else{rect(-16,-21,32,42,white,true);ctx.fillStyle=rose;ctx.fillRect(-16,-21,32,9);}
      }));
    }
  }
}
function language(t){
  rect(196,164,1208,550,paper);
  rect(400,195,800,250,muted,true);rect(414,209,772,222,ink);
  label('room 17 · orchestra',440,240,18,paper,'left','Georgia');
  ctx.save();ctx.strokeStyle=paper;
  const chalk=(s,x,y,p)=>{if(p<=0)return;ctx.save();ctx.font='italic 60px Georgia';const w=ctx.measureText(s).width;ctx.beginPath();ctx.rect(x-w/2-6,y-70,(w+12)*clamp(p),100);ctx.clip();ctx.fillStyle=paper;ctx.textAlign='center';ctx.fillText(s,x,y);ctx.restore();};
  chalk('meep',590,340,ease((t-B(212))/1.2));
  chalk('+',750,340,ease((t-B(214))/.3));
  chalk('murp',900,340,ease((t-B(216))/1.2));
  chalk('=',1050,340,ease((t-B(218))/.3));
  ctx.restore();
  if(t>B(219))heart(1120,322,pop(t,B(219))*(1+kick(t)*.15),rose);
  for(const x of [330,1270]){line([[x,520],[x,640]],ink,3);poly([[x-40,480],[x+38,479],[x+44,526],[x-38,528]],white,true);}
  violin(330,600,.7,.6);violin(1270,600,.7,-.6);
  const appear=ease((t-B(216))/1);
  alpha(.35+.65*appear,()=>{
    person(470,690,{s:1.35,t,look:1});
    person(1130,690,{boy:true,s:1.35,flip:-1,t:t+.3,look:1});
  });
  const b=beatAt(t);
  for(let j=0;j<8;j++){
    const bi=b-j;if(bi<218)continue;
    const q=(t-B(bi))/2.5;if(q<0||q>=1)continue;
    const fromLeft=bi%2===0;
    const x=lerp(fromLeft?570:1030,800,q),y=560-Math.sin(q*Math.PI)*60-q*20;
    alpha(1-q*q,()=>bubble(fromLeft?'meep':'murp',x,y,.85*pop(t,B(bi))));
  }
  cornerCalendar(t);
}
function travel(t){
  rect(196,164,1208,550,paper);
  alpha(.2,()=>{for(let i=0;i<7;i++)line([[260+i*180,200],[300+i*170,690]],gray,1);for(let i=0;i<5;i++)line([[220,230+i*100],[1380,250+i*90]],gray,1);});
  alpha(.28,()=>{poly([[260,300],[420,240],[600,290],[650,420],[560,560],[380,600],[260,500]],gray);poly([[980,360],[1160,330],[1290,380],[1300,520],[1150,600],[1000,560],[960,450]],gray);});
  const home=[440,480],mad=[1140,460],take=144.894,land=B(234);
  const p=clamp((t-take)/(land-take)),pe=ease(p);
  const path=q=>[lerp(home[0],mad[0],q),lerp(home[1],mad[1],q)-Math.sin(q*Math.PI)*220];
  const pts=[];for(let i=0;i<=40*pe;i++)pts.push(path(i/40));
  if(pts.length>1)stitch(pts,rose,3);
  oval(...home,9,9,rose);oval(...mad,9,9,rose);
  label('HOME',home[0],home[1]+40,16,ink,'center','"Segoe UI"');label('MADRID',mad[0],mad[1]+40,16,ink,'center','"Segoe UI"');
  if(t<take+.4)alpha(1-ease((t-take)/.4),()=>{
    suitcase(home[0]-40,home[1]-20,1.1*(1+kick(t)*.06),Math.sin(t*3)*.03);
    ['hola','¿qué tal?','te quiero'].forEach((s,i)=>at(mad[0]-60+i*70,mad[1]-120-i*40+Math.sin(t*2+i)*8,1,(i-1)*.12,()=>{torn(-55,-20,110,38,white,30+i);script(s,0,6,17);}));
  });
  const [x,y]=path(pe),[x2,y2]=path(Math.min(1,pe+.01));
  const touch=t-land,bounce=touch>0?Math.exp(-touch*6)*Math.sin(touch*24)*8:0;
  plane(x,y-12+bounce,1.2,touch>0?0:Math.atan2(y2-y,x2-x));
  if(touch>0){
    alpha(1-clamp(touch/.8),()=>{ctx.beginPath();ctx.arc(mad[0],mad[1],20+touch*90,0,Math.PI*2);ctx.strokeStyle=rose;ctx.lineWidth=3;ctx.stroke();});
    heart(mad[0],mad[1]-30,pop(t,land)*1.1);
  }
  at(700,640,1,-.05,()=>{torn(-150,-30,300,54,white,44);script('see you in December',0,5,22);line([[-150,-4],[-190,-30]],rose,2);});
  cornerCalendar(t);
}
function reunion(t){
  const L=scenes[10].land;
  const amb=t<FREEZE[0]?t:t<HIT?FREEZE[0]:t-(HIT-FREEZE[0]);
  const hit=t>=HIT,since=t-HIT;
  rect(196,164,1208,550,paper);
  alpha(.5,()=>rect(196,164,1208,240,DAWN));
  for(let i=0;i<5;i++)line([[196+i*302,164],[196+i*302,404]],white,8);
  plane(lerp(1500,200,((amb*.04)%1)),250,.7,0);
  rect(600,180,400,110,ink,true);
  label('ARRIVALS · MADRID',800,214,15,paper,'center','"Segoe UI"');
  if(!hit){label('DECEMBER IN',740,262,15,GOLD,'center','"Segoe UI"');label(String(daysLeft(t)).padStart(2,'0'),900,268,34,GOLD,'center','Georgia');}
  else{label('DECEMBER',800,264,30,GOLD,'center','Georgia');}
  alpha(.2,()=>rect(196,600,1208,114,gray));
  // sliding doors
  const open=ease((t-L)/1);
  rect(230,340,260,270,white,true);
  rect(244+0,354,116-open*80,256,NIGHT2);rect(374+open*80,354,116-open*80,256,NIGHT2);
  // months blow away
  ['JUN','JUL','AUG','SEP','OCT','NOV'].forEach((m,i)=>{
    const s=onBeat(149.8)+i*.627*1.3,q=(Math.min(amb,FREEZE[0])-s)/2.4;
    if(q>1)return;
    const x=lerp(1236+i*10,1560,Math.max(0,q)**1.4),y=lerp(262+i*3,120,Math.max(0,q))+Math.sin(q*8+i)*20;
    alpha(q<0?1:1-q*q,()=>at(x,y,.8,q>0?q*5+i:-.05+i*.03,()=>{rect(-36,-44,72,88,white,true);ctx.fillStyle=rose;ctx.fillRect(-36,-44,72,22);label(m,0,-28,12,paper,'center','"Segoe UI"');label(String(i+6),0,22,30,ink);}));
  });
  const see=t>=onBeat(153.67),runStart=156.14,runEnd=FREEZE[0];
  const rp=easeOut((Math.min(t,runEnd)-runStart)/(runEnd-runStart));
  const swell=ease((t-FREEZE[1])/(HIT-FREEZE[1]));
  const animT=t<runStart?t:runStart+(Math.min(t,runEnd)-runStart)*.75;
  const exit=ease((t-L)/2.5);
  let hx=lerp(360,480,exit),bx=1170;
  if(t>runStart){hx=lerp(480,748,rp)+swell*16;bx=lerp(1170,852,rp)-swell*16;}
  if(t<runStart||!hit)suitcase(t>runStart?480:hx+50,672,1);
  else suitcase(480,672,1);
  const pre=!see?(Math.floor(amb/1.2)%2?1:-1):1;
  if(hit){
    const hp=pop(t,HIT,.25);
    person(818,690,{boy:true,s:1.45,flip:-1,pose:'hug',t,look:1,mood:'laugh',lean:-.06});
    person(782,690,{s:1.45,pose:'hug',t,look:1,mood:'laugh',lean:.06});
    heart(800,380-since*20,hp*(1.6+kick(t)*.25));
    burst(800,470,since);
  }else{
    const pose=t<runStart?(t<L+2.5?'walk':'stand'):t<FREEZE[0]?'run':'reach';
    const mood=t<onBeat(153.67)?'smile':'surprise';
    person(hx,690,{s:1.45,pose,t:animT,look:pre,mood});
    const sign=t<runStart;
    person(bx,690,{boy:true,s:1.45,flip:-1,pose:sign?'sign':pose,t:animT+.3,look:see?1:-pre,mood});
    if(sign)at(bx,690-205*1.45,1,Math.sin(t*2)*.04,()=>{torn(-80,-40,160,70,white,52);script('meep',0,10,34,rose);});
    else{const q=Math.min(1,(t-runStart)/.9);at(bx+40+q*60,lerp(420,670,q*q),1,q*2.5,()=>{torn(-80,-40,160,70,white,52);script('meep',0,10,34,rose);});}
    if(see&&t<runStart){const p=pop(t,onBeat(153.67));label('!',hx,690-270*1.45,46*p,rose);label('!',bx,690-270*1.45,46*p,rose);}
    if(t>runStart)thread(hx+45,560,bx-45,560,t,20*(1-rp)+6,{width:2+swell*3,pulse:t<FREEZE[0]});
  }
}
function tandem(t){
  const u=t-scenes[11].start,camX=u*190,k=kick(t);
  rect(150,120,1300,620,DAWN);
  sun(1080,232,52,t);
  ctx.save();ctx.translate(0,-55);
  alpha(.5,()=>hills(camX*.12,470,150,gray,31,210,false));
  for(let i=0;i<9;i++){const x=((i*210-camX*.12)%1890+1890)%1890-150;poly([[x,470-hash(i+31)*0],[x,470]],white);}
  hills(camX*.35,540,90,white,41,170,true);
  const marks=[[1500,'madrid'],[2900,'home'],[4300,'madrid'],[5600,'home']];
  for(const [wx,kind] of marks){const x=wx-camX*.6;if(x<-200||x>1800)continue;kind==='madrid'?city(x,575,.62):house(x-70,575,140,150,true,true);}
  for(let i=0;i<14;i++){const x=((i*300+120-camX*.85)%4200+4200)%4200-200;tree(x,606,.8+hash(i)*.3);}
  poly([[0,600],[1600,600],[1600,800],[0,800]],paper,true);
  for(let i=0;i<12;i++){const x=((i*160-camX)%1920+1920)%1920-160;stitch([[x,660],[x+70,660]],gray,2);}
  const y=612-k*5,bx=800;
  const pts=[];for(let i=0;i<=16;i++)pts.push([bx-150-i*28,y-150+Math.sin(t*5-i*.6)*(6+i*1.4)]);
  line(pts,rose,4);
  bike(bx,y,1.4,camX/48,[{boy:false},{boy:true}],t);
  ctx.restore();
  snow(t,312,1288,170,700,46,camX);
  for(let i=0;i<5;i++)bird(560+i*120+Math.sin(t+i)*30,250+Math.sin(t*1.3+i)*25-(t>B(268)?ease((t-B(268))/2)*60:0),.6,t+i);
  script('no more counting.',560,262,44*pop(t,B(262)),rose);
  script('just us.',560,308,32*pop(t,B(264)),ink);
  if(t>B(268))burst(bx,y-215,t-B(268),24,9);
}
const renderers={firstPage,orchestra,walk,quiet,chorus,postcards,sweater:sweaterScene,chorus2,language,travel,reunion,tandem};
function drawScene(index,t){BOIL=1;renderers[scenes[index].kind](t);BOIL=0;}

// ---------- the book ----------
let seed=771;
const rand=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
const grain=document.createElement('canvas');grain.width=1600;grain.height=900;
const gc=grain.getContext('2d');
for(let i=0;i<42000;i++){gc.globalAlpha=rand()*.055;gc.fillStyle=i%2?ink:white;gc.fillRect(rand()*1600,rand()*900,rand()*1.8+.4,rand()+.5);}
function bookBase(){
  alpha(.12,()=>oval(800,753,634,27,ink));
  for(let i=5;i>=0;i--)poly([[185-i*2,153+i*3],[800,143+i*3],[1415+i*2,153+i*3],[1426+i*2,725+i*3],[800,745+i*3],[174-i*2,725+i*3]],i%2?paper:gray);
  poly([[188,149],[790,138],[800,157],[810,138],[1412,149],[1421,720],[815,735],[800,722],[785,735],[179,720]],paper,true);
}
function cover(x,width,angle=0,closing=false){
  if(width<=0)return;
  ctx.save();ctx.translate(x,152);ctx.rotate(angle);ctx.scale(width/610,1);
  poly([[0,0],[610,-8],[614,577],[0,585]],rose,true);
  stitch([[22,18],[23,563]],paper,2);
  torn(60,119,488,298,paper,61);
  tape(70,124,-.6,80);tape(540,124,.6,80);
  label('Counting Down',304,205,43);label('to December',304,260,43);
  violin(304,335,.6,-.12);
  script(closing?'the end':'a story in paper & thread',304,389,20,muted);
  stitch([[90,457],[516,457]],paper,1.5);
  label('UNTIL THE PAGES MEET',304,496,13,paper,'center','"Segoe UI"');
  ctx.restore();
}
function turn(p){
  if(p<=0||p>=1)return;
  const edge=800+618*Math.cos(p*Math.PI),curl=Math.sin(p*Math.PI)*44;
  alpha(.12,()=>poly([[800,157],[edge+curl+22,166],[edge+curl+22,718],[800,729]],ink));
  if(p>=.5)poly([[800,157],[edge,153+curl*.4],[edge-curl,446],[edge,729-curl*.25],[800,729]],white,true);
  else poly([[edge,153+curl*.4],[edge-curl,446],[edge,729-curl*.25],[edge+curl*.3,446]],white,true);
  line([[edge,158+curl*.4],[edge-curl,446],[edge,725-curl*.25]],gray,1);
}
function sceneClip(index,t,x,width){
  if(width<=0)return;
  ctx.save();ctx.beginPath();ctx.rect(x,164,width,550);ctx.clip();
  ctx.fillStyle=paper;ctx.fillRect(x,164,width,550);drawScene(index,t);ctx.restore();
}
function camera(index,t){
  const s=scenes[index],next=scenes[index+1];
  const settle=(s.land?ease((t-s.land)/1.2):1)*(next?ease((next.start-t)/1):1);
  let z=1+.01*Math.sin(t*.09),x=800,y=439;
  if(s.kind==='postcards'){const w=win(t,76.75,81.2,.9)*settle;z+=.3*w;x=lerp(800,520,w);y=lerp(439,420,w);}
  if(s.kind==='chorus')z+=kick(t)*.006*energy(t)*settle;
  if(s.kind==='chorus2')z+=(.07*ease((t-s.land)/24)+kick(t)*.012*energy(t))*settle;
  if(s.kind==='reunion'){const r=ease((t-153.67)/(FREEZE[0]-153.67));z+=.3*r;y=lerp(439,500,r);}
  if(s.kind==='tandem')z+=kick(t)*.012;
  const P=panorama(t);
  z=lerp(z,PAN_ZOOM,P);x=lerp(x,800,P);y=lerp(y,439,P);
  if(t>HIT){const d=t-HIT;x+=Math.sin(d*70)*9*Math.exp(-d*5);y+=Math.cos(d*55)*7*Math.exp(-d*5);}
  return {z,x,y,P};
}
function subtitle(text,strip){
  ctx.font='27px Georgia';
  const words=text.split(/\s+/),lines=[];let row='';
  for(const word of words){const c=row?`${row} ${word}`:word;if(row&&ctx.measureText(c).width>1260){lines.push(row);row=word;}else row=c;}
  if(row)lines.push(row);
  if(strip>0)alpha(strip*.85,()=>torn(800-Math.min(660,ctx.measureText(lines[0]).width/2+50),770,Math.min(1320,ctx.measureText(lines[0]).width+100),lines.length*35+30,paper,77,false));
  lines.forEach((s,i)=>label(s,800,lines.length>1?791+i*35:810,27,strip>.5?ink:C.text));
}
function formatTime(t){return `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;}
function sceneIndex(t){let i=scenes.length-1;while(i>0&&t<scenes[i].start)i--;return i;}
function draw(t){
  NOW=t;BSTEP=Math.floor((t>FREEZE[0]&&t<HIT?FREEZE[0]:t)*8);
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.fillStyle=C['bg-elevated'];ctx.fillRect(0,0,1600,900);
  const index=sceneIndex(t),scene=scenes[index],cam=camera(index,t);
  ctx.save();ctx.translate(800,439);ctx.scale(cam.z,cam.z);ctx.translate(-cam.x,-cam.y);
  alpha(1-cam.P,bookBase);
  ctx.save();ctx.beginPath();ctx.rect(196,164,1208,550);ctx.clip();
  const turning=index>=1&&!scene.fade&&t<scene.land;
  const p=turning?ease((t-scene.start)/(scene.land-scene.start)):0,prev=scene.start-.001;
  if(turning){
    if(p<.5){
      sceneClip(index-1,prev,196,604);sceneClip(index,t,800,604);
      const width=604*Math.cos(p*Math.PI);
      if(width>1){ctx.save();ctx.translate(800,0);ctx.scale(width/604,1);ctx.translate(-800,0);sceneClip(index-1,prev,800,604);ctx.restore();}
    }else{
      ctx.fillStyle=paper;ctx.fillRect(196,164,1208,550);drawScene(index,t);
      sceneClip(index-1,prev,196,604+604*Math.cos(p*Math.PI));
    }
  }else if(scene.fade&&t<scene.land){
    ctx.fillStyle=paper;ctx.fillRect(196,164,1208,550);
    drawScene(index-1,t);alpha(ease((t-scene.start)/(scene.land-scene.start)),()=>drawScene(index,t));
  }else{ctx.fillStyle=paper;ctx.fillRect(196,164,1208,550);drawScene(index,t);}
  ctx.restore();
  if(turning){
    turn(p);
    if(p>.5){const width=-604*Math.cos(p*Math.PI);ctx.save();ctx.translate(800-width,0);ctx.scale(width/604,1);ctx.translate(-196,0);sceneClip(index,t,196,604);ctx.restore();}
  }
  // The gutter: it seals shut when the two pages finally meet.
  alpha(1-cam.P,()=>{alpha(.1,()=>poly([[786,164],[800,168],[814,164],[814,714],[800,709],[786,714]],ink));line([[800,169],[800,708]],gray,.7);});
  if(t<OPEN[1]){
    const q=ease((t-OPEN[0])/(OPEN[1]-OPEN[0]));
    if(q<.5){alpha(1-q*1.6,()=>poly([[173,137],[1427,137],[1430,745],[170,745]],C['bg-elevated']));cover(lerp(496,800,q*2),610*(1-q*2),-.012);}
    else{const width=610*(q-.5)*2;poly([[800,152],[800-width,145],[800-width,730],[800,737]],white,true);sceneClip(0,t,800-width,width);}
  }
  if(t>CLOSE[0]){
    const q=ease((t-CLOSE[0])/(CLOSE[1]-CLOSE[0]));
    alpha(q,()=>poly([[173,137],[1427,137],[1430,745],[170,745]],C['bg-elevated']));
    cover(lerp(800,496,q),610*q,-.012*q,true);
  }
  ctx.restore();
  ctx.drawImage(grain,0,0);
  if(t>=HIT&&t<HIT+.6)alpha((1-(t-HIT)/.6)*.6,()=>{ctx.fillStyle=white;ctx.fillRect(0,0,1600,900);});
  const current=timedLyrics.findLast(l=>t>=l.start&&t<l.end);
  if(current){
    const fade=Math.min(ease((t-current.start)/.25),ease((current.end-t)/.25));
    alpha(fade,()=>subtitle(current.text,cam.P));
  }else if(t<10.77)alpha(ease(t/2),()=>label('A scrapbook about finding your way back to each other.',800,810,22,muted));
  else if(t>PAN_OUT[0])alpha(ease((t-PAN_OUT[0])/2),()=>script('December always kept.',800,815,32,rose));
  document.querySelector('#chapter').textContent=scene.name;
}
function report(message){const el=document.querySelector('#error');el.hidden=false;el.textContent=message;}
let last=-1;
function tick(){
  const t=audio.ended?DURATION:Math.min(DURATION,audio.currentTime||0);
  if(t!==last){draw(t);last=t;}
  seek.value=t;
  clock.textContent=`${formatTime(t)} / ${formatTime(DURATION)}`;
  requestAnimationFrame(tick);
}
play.addEventListener('click',async()=>{
  try{if(audio.paused){if(audio.ended)audio.currentTime=0;await audio.play();}else audio.pause();}
  catch(error){report(`Playback could not start: ${error.message}`);}
});
audio.addEventListener('play',()=>play.textContent='Pause');
audio.addEventListener('pause',()=>play.textContent=audio.ended?'Replay':'Play with sound');
audio.addEventListener('ended',()=>play.textContent='Replay');
function audioReady(){play.disabled=false;play.textContent=audio.paused?'Play with sound':'Pause';}
audio.addEventListener('loadedmetadata',audioReady);
if(audio.readyState>=1)audioReady();
audio.addEventListener('error',()=>report(`Audio could not load (code ${audio.error?.code??'unknown'}). Use the standalone file containing the embedded track.`));
seek.addEventListener('input',()=>audio.currentTime=Number(seek.value));
document.querySelector('#restart').addEventListener('click',()=>audio.currentTime=0);
const chapters=document.querySelector('#chapters');
for(const scene of scenes){
  const option=document.createElement('option');
  option.value=scene.land===0?0:+(scene.land+.01).toFixed(3);
  option.textContent=scene.name;chapters.append(option);
}
chapters.addEventListener('change',event=>{
  if(event.target.value==='')return;
  audio.currentTime=Number(event.target.value);event.target.value='';
});
draw(0);requestAnimationFrame(tick);
