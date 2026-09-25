const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');let js=html.split('<script>')[1].split('</script>')[0].replace('})();','globalThis.forge={worldData,restore,step,autoSave,newWorld,seasonIndex};})();');
const elements=new Map();const canvasCtx={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},drawImage(){},fillRect(){}};
function element(id){if(!elements.has(id))elements.set(id,{value:id==='#wind'?'1,0':id==='#speed'?'2':'3',options:[{value:'0,0'},{value:'1,0'},{value:'-1,0'},{value:'0,1'},{value:'0,-1'}],children:[],style:{},setAttribute(){},addEventListener(){},append(){},click(){},getContext:()=>canvasCtx,createElement:()=>({}),getBoundingClientRect:()=>({left:0,top:0,width:900,height:600})});return elements.get(id)}
let stored=null;const context={document:{querySelector:s=>element(s),createElement:()=>({width:0,height:0,dataset:{},getContext:()=>canvasCtx,setAttribute(){},addEventListener(){},click(){},append(){}}),addEventListener(){}},localStorage:{getItem:()=>stored,setItem:(_,v)=>{stored=v}},requestAnimationFrame(){},setInterval(){},setTimeout(){},URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob,Math,Uint8Array,Uint8ClampedArray,console,window:{addEventListener(){}}};
context.document.querySelector('#tools').querySelector=()=>({click(){}});
vm.createContext(context);vm.runInContext(js,context);
const before=JSON.stringify(context.forge.worldData());context.forge.step();context.forge.restore(JSON.parse(before));assert.strictEqual(JSON.stringify(context.forge.worldData()),before);
context.forge.autoSave();assert.strictEqual(stored,before);
let bad=JSON.parse(before);bad.terrain=[1];assert.throws(()=>context.forge.restore(bad),/valid Small Worlds/);assert.strictEqual(JSON.stringify(context.forge.worldData()),before);
for(const [d,expected] of [[0,0],[179,0],[180,1],[360,2],[540,3],[720,0]]){
  const world=JSON.parse(before);world.day=d;context.forge.restore(world);
  assert.strictEqual(context.forge.seasonIndex(),expected);
  assert.ok(element('#season').textContent.includes(['Spring','Summer','Autumn','Winter'][expected]));
}
context.forge.newWorld(123);
let peak=0,postFire=0,afterRecovery=0;
for(let i=0;i<720;i++){
  context.forge.step();
  if(i%30===29){
    const tiles=context.forge.worldData().terrain;
    const coverage=tiles.filter(t=>t===3||t===4).length/tiles.length;
    peak=Math.max(peak,coverage);
    if(i===389)postFire=coverage;
    if(i===719)afterRecovery=coverage;
  }
}
assert.ok(peak<.8,`peak vegetation covered ${(peak*100).toFixed(1)}% of the map`);
assert.ok(afterRecovery>postFire+.02,'burned landscape did not recover during autumn and winter');
const empty=context.forge.worldData();
empty.terrain.fill(0);empty.life.fill(0);empty.heat.fill(0);empty.day=0;
context.forge.restore(empty);
for(let i=0;i<180;i++)context.forge.step();
const recovered=context.forge.worldData().terrain.filter(t=>t===3||t===4).length;
assert.ok(recovered>100,`only ${recovered} plants returned to an empty fertile world`);
console.log('Save compatibility, seasons, varied habitat and natural recovery passed');
