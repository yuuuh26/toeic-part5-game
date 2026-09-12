import test from 'node:test';
import assert from 'node:assert/strict';
import {SessionSave} from '../src/session-save.js';

test('a failed write preserves the result and blocks overwriting until retry commits',async()=>{
 let fail=true;const saved=[];const saver=new SessionSave(async()=>{if(fail)throw Error('quota');},r=>saved.push(r));
 const result={id:'first',answers:[{correct:true}]};saver.stage(result);
 await assert.rejects(saver.save(),/quota/);
 assert.equal(saver.pending,result);assert.deepEqual(saved,[]);
 assert.throws(()=>saver.stage({id:'second'}),/未保存/);
 fail=false;await saver.save();assert.equal(saver.pending,null);assert.deepEqual(saved,[result]);
 saver.stage({id:'second'});await saver.save();assert.equal(saved.length,2);
});

test('finish, retry and next-play save attempts share a single transaction',async()=>{
 let finish,writes=0,records=0;const saver=new SessionSave(()=>{writes++;return new Promise(r=>finish=r);},()=>records++);
 saver.stage({id:'first'});const a=saver.save(),b=saver.save();assert.equal(a,b);
 await Promise.resolve();assert.equal(writes,1);assert.equal(saver.pending.id,'first');
 finish();await Promise.all([a,b]);await saver.save();assert.equal(writes,1);assert.equal(records,1);
});
