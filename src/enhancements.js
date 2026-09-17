import {Storage} from './storage.js';
import {streakDays,guidanceFor} from './learning.js';

const storage=new Storage();
let opening=null;
async function readSessions(){
 try{
  if(!opening)opening=storage.open();
  await opening;
  return await storage.read('sessions');
 }catch{opening=null;return[];}
}

async function refreshStreak(){
 const target=document.querySelector('#home-streak');
 if(!target)return;
 const streak=streakDays(await readSessions());
 target.replaceChildren(document.createTextNode(String(streak)));
 const unit=document.createElement('small');unit.textContent='日';target.append(unit);
}

function addGuide(item){
 if(item.dataset.learningGuide==='1')return;
 const body=item.querySelector('.review-body');
 if(!body)return;
 const tag=body.querySelector('.tag');
 const category=(tag?.textContent||'').split(' · ')[0].trim();
 const sentence=body.querySelector('.english')?.textContent?.trim()||'';
 const answer=(body.querySelector('.answer-line')?.textContent||'').replace(/^正解：\s*[A-D]\.\s*/,'').trim();
 const guide=guidanceFor({category,sentence,answer});
 const box=document.createElement('div');box.className='learning-guide';
 const title=document.createElement('div');title.className='learning-guide-title';title.textContent='LEARNING POINTS · もう一段深く';box.append(title);
 for(const [label,text] of [['この問題の特徴',guide.feature],['なぜそうなる？',guide.reason],['間違えやすい所',guide.pitfall]]){
  const row=document.createElement('div');row.className='learning-guide-row';
  const heading=document.createElement('strong');heading.textContent=label;
  const paragraph=document.createElement('p');paragraph.textContent=text;
  row.append(heading,paragraph);box.append(row);
 }
 if(tag)tag.before(box);else body.append(box);
 item.dataset.learningGuide='1';
}

function enhanceReviews(){document.querySelectorAll('#result .review-item').forEach(addGuide);}

const result=document.querySelector('#result');
if(result)new MutationObserver(enhanceReviews).observe(result,{childList:true,subtree:true});
const home=document.querySelector('#home');
if(home)new MutationObserver(()=>{if(!home.hidden)void refreshStreak();}).observe(home,{attributes:true,attributeFilter:['hidden']});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void refreshStreak();});
void refreshStreak();
enhanceReviews();
