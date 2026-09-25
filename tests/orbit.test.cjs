const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../orbit.html'),'utf8');
const script=html.split('<script>')[1].split('</script>')[0].replace('})();','globalThis.orbit={advance,preset,suns,planets,planet,sun,predict};})();');
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{value:id==='#gravity'?'100':'90',textContent:'',setAttribute(){},addEventListener(){},setPointerCapture(){},getContext:()=>({}),getBoundingClientRect:()=>({left:0,top:0,width:900,height:600})});return elements.get(id)}
const ctx={document:{querySelector:element},requestAnimationFrame(){},Math,console};vm.createContext(ctx);vm.runInContext(script,ctx);
assert.equal(ctx.orbit.suns.length,1);
assert.equal(ctx.orbit.planets.length,3);
for(let i=0;i<600;i++)ctx.orbit.advance();
assert.ok(ctx.orbit.planets.length>=2,'stable starter orbits should survive 600 steps');
ctx.orbit.preset('double');assert.equal(ctx.orbit.suns.length,2);
ctx.orbit.preset('single');assert.equal(ctx.orbit.suns.length,1);
ctx.orbit.planet(450,300,0,0);ctx.orbit.advance();assert.equal(ctx.orbit.planets.length,3,'a planet hitting a sun should disappear');
const collision=ctx.orbit.predict(450,300,0,0);assert.equal(collision.outcome,'collision');const orbit=ctx.orbit.predict(450,126,1.48,0);assert.equal(orbit.outcome,'stays in view');const escape=ctx.orbit.predict(850,80,10,-2);assert.equal(escape.outcome,'escape');console.log('Orbit stability, presets, collisions and launch prediction passed');
