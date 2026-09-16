import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const scope='https://example.com/toeic-part5-game/';
class Cache {
 constructor(){this.entries=new Map();}
 key(r){return new URL(typeof r==='string'?r:r.url,scope).href;}
 async match(r){return this.entries.get(this.key(r))?.clone();}
 async put(r,v){this.entries.set(this.key(r),v.clone());}
 async keys(){return [...this.entries.keys()].map(url=>new Request(url));}
}
function setup(fetcher=async()=>new Response('network')){
 const handlers={},stores=new Map();
 const caches={open:async name=>{if(!stores.has(name))stores.set(name,new Cache());return stores.get(name);},keys:async()=>[...stores.keys()],delete:async name=>stores.delete(name)};
 vm.runInNewContext(source,{URL,caches,fetch:fetcher,self:{location:{origin:'https://example.com'},registration:{scope},clients:{claim:async()=>{}},addEventListener:(name,fn)=>handlers[name]=fn}});
 return{handlers,stores,caches};
}
test('an update keeps downloaded music and leaves other apps caches untouched',async()=>{
 const {handlers,caches,stores}=setup();const old=await caches.open('part5-burst-v1.0.0');
 await old.put('assets/bgm/the-winning-move.mp3',new Response('music'));await old.put('src/app.js',new Response('old app'));
 await caches.open('another-app-v1');let done;handlers.activate({waitUntil:p=>done=p});await done;
 assert.equal(stores.has('part5-burst-v1.0.0'),false);assert.equal(stores.has('another-app-v1'),true);
 const current=await caches.open('part5-burst-v1.0.3');assert.equal(await (await current.match('assets/bgm/the-winning-move.mp3')).text(),'music');assert.equal(await current.match('src/app.js'),undefined);
});
test('cache quota errors do not turn successful network requests into failures',async()=>{
 const response={ok:true,type:'basic',clone(){return this;},text:async()=> 'music'};
 const {handlers,caches}=setup(async()=>response);const current=await caches.open('part5-burst-v1.0.3');current.put=async()=>{throw Error('quota');};
 let done;handlers.fetch({request:new Request(scope+'assets/bgm/rapid-ascent.mp3'),respondWith:p=>done=p});assert.equal(await done,response);
});
