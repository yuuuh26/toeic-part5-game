import test from 'node:test';
import assert from 'node:assert/strict';
import {streakDays,guidanceFor} from '../src/learning.js';

test('streak counts consecutive local study days and keeps yesterday active before today study',()=>{
 const now=new Date(2026,8,18,12,0,0);
 const sessions=[18,17,16].map(day=>({date:new Date(2026,8,day,9,0,0).toISOString()}));
 assert.equal(streakDays(sessions,now),3);
 const beforeToday=sessions.filter((_,i)=>i>0);
 assert.equal(streakDays(beforeToday,now),2);
 assert.equal(streakDays([{date:new Date(2026,8,15,9,0,0).toISOString()}],now),0);
});

test('guidance adds category learning points and special grammar detail',()=>{
 const vocab=guidanceFor({category:'語彙',sentence:'The firm will _____ with the rule.',answer:'comply'});
 assert.match(vocab.reason,/コロケーション|組み合わせ/);
 assert.match(vocab.feature,/comply/);
 const inversion=guidanceFor({category:'倒置',sentence:'No sooner had the meeting ended than the phones began ringing.',answer:'than'});
 assert.match(inversion.feature,/No sooner/);
 assert.match(inversion.reason,/倒置/);
});
