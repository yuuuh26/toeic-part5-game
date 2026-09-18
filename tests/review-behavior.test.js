import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('20-second review happens only after an answer and not as a pre-answer hint',()=>{
 assert.equal(source.includes('showSlowHint'),false);
 assert.equal(source.includes('20秒ヒント'),false);
 assert.match(source,/const needsReview=ms>=20000/);
 assert.match(source,/showSlowReview\(q,completed/);
 assert.match(source,/delay:680/);
 assert.match(source,/delay:180/);
 assert.match(html,/id="slow-review-overlay"/);
 assert.match(html,/20秒超 · REVIEW/);
});
