import {CONFIG,tierFor} from './config.js';
import {selectQuestions} from './questions.js';
export class Game {
 constructor(bus,{now=()=>performance.now(),rng=Math.random}={}){this.bus=bus;this.now=now;this.rng=rng;this.state='idle';}
 start(pool,count){this.questions=selectQuestions(pool,count,this.rng);if(!this.questions.length)throw Error('出題できる問題がありません');this.index=0;this.combo=0;this.maxCombo=0;this.score=0;this.answers=[];this.feverUntil=0;this.fever=false;this.date=new Date().toISOString();this.state='playing';this.show();}
 show(){this.state='playing';this.questionStart=this.now();this.bus.emit('question',{question:this.questions[this.index],index:this.index,total:this.questions.length});}
 tick(){if(this.fever&&this.now()>=this.feverUntil){this.fever=false;this.bus.emit('fever:end');}}
 answer(choice){if(this.state!=='playing'||!Number.isInteger(choice)||choice<0||choice>3)return null;this.tick();this.state='feedback';const q=this.questions[this.index],ms=Math.max(0,this.now()-this.questionStart),correct=choice===q.answer;const oldCombo=this.combo;this.combo=correct?this.combo+1:0;this.maxCombo=Math.max(this.combo,this.maxCombo);let feverStarted=false;
 if(correct&&this.combo===CONFIG.fever.threshold){this.fever=true;this.feverUntil=this.now()+CONFIG.fever.duration;feverStarted=true;}
 if(!correct&&this.fever){this.fever=false;this.bus.emit('fever:end');}
 const s=CONFIG.score;const points=correct?Math.round((s.base+s.speedMax*Math.max(0,1-ms/s.speedWindow)+Math.min(this.combo-1,s.comboCap)*s.comboStep)*(this.fever?CONFIG.fever.multiplier:1)):0;
 this.score+=points;const entry={question:{...q},choice,correct,ms,points,combo:this.combo};this.answers.push(entry);const data={...entry,tier:correct?(this.combo>=CONFIG.fever.threshold&&!this.fever?CONFIG.combo.find(t=>t.label==='PERFECT'):tierFor(this.combo)):{label:'WRONG',color:'#ffafbb'},score:this.score,fever:this.fever,feverStarted};this.bus.emit('answer',data);this.bus.emit(correct?'correct':'incorrect',data);this.bus.emit(correct?'combo:increase':'combo:end',{combo:this.combo,previous:oldCombo});if(feverStarted)this.bus.emit('fever:start',data);if(this.combo===5)this.bus.emit('perfect',data);return data;}
 next(){if(this.state!=='feedback')return;if(++this.index<this.questions.length)this.show();else{this.state='finished';if(this.fever){this.fever=false;this.bus.emit('fever:end');}this.bus.emit('finish',this.result());}}
 pause(){if(this.state==='paused'||!['playing','feedback'].includes(this.state))return;this.beforePause=this.state;this.pausedAt=this.now();this.state='paused';}
 resume(){if(this.state!=='paused')return;const d=this.now()-this.pausedAt;this.questionStart+=d;if(this.fever)this.feverUntil+=d;this.state=this.beforePause;}
 stop(){this.state='idle';this.fever=false;this.bus.emit('fever:end');}
 result(){const correct=this.answers.filter(a=>a.correct);return {id:crypto.randomUUID(),schemaVersion:1,date:this.date,mode:'random',count:this.answers.length,correct:correct.length,accuracy:correct.length/this.answers.length,maxCombo:this.maxCombo,score:this.score,avgMs:this.answers.reduce((s,a)=>s+a.ms,0)/this.answers.length,correctAvgMs:correct.length?correct.reduce((s,a)=>s+a.ms,0)/correct.length:null,fastestMs:Math.min(...this.answers.map(a=>a.ms)),answers:this.answers};}
}
