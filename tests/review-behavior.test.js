import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('20-second review happens only after an answer and not as a pre-answer hint',()=>{
 assert.equal(source.includes('showSlowHint'),false);
 assert.equal(source.includes('20秒ヒント'),false);
 assert.match(source,/const needsReview=ms>=20000/);
 assert.match(source,/if\(needsReview\)\{showTranslatedFeedback/);
 assert.match(source,/speakAnswerReview\(completed/);
});
