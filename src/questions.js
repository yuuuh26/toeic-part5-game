export async function loadQuestions(){
 const manifest=await fetch('data/manifest.json').then(r=>{if(!r.ok)throw Error('問題一覧を読み込めませんでした');return r.json();});
 const packs=await Promise.all(manifest.packs.map(p=>fetch(`data/${p}`).then(r=>{if(!r.ok)throw Error('問題を読み込めませんでした');return r.json();})));
 const questions=packs.flatMap(p=>p.questions);validateQuestions(questions);return questions;
}
export function validateQuestions(questions){const ids=new Set();for(const q of questions){if(!q.id||ids.has(q.id)||typeof q.text!=='string'||!q.text.includes('_____')||q.options?.length!==4||!q.options.every(x=>typeof x==='string')||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||!q.translation||!q.explanation||!q.category||!q.difficulty)throw Error(`問題データを確認してください: ${q.id}`);ids.add(q.id);}return true;}
export function selectQuestions(pool,count,rng=Math.random){const a=[...pool];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,count);}
