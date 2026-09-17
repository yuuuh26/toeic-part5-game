export const CONFIG = Object.freeze({
 version:'1.0.6', questionCounts:[5,10], defaultCount:5,
 transitions:{correct:520,incorrect:1450},
 combo:[{at:1,label:'CORRECT',color:'#60f4dc'},{at:2,label:'GOOD',color:'#60f4dc'},{at:3,label:'GREAT',color:'#6bc9ff'},{at:4,label:'EXCELLENT',color:'#d398ff'},{at:5,label:'PERFECT',color:'#ffe38b'},{at:6,label:'FEVER',color:'#ffbf69'}],
 fever:{threshold:6,duration:10000,multiplier:1.5},
 score:{base:1000,speedMax:500,speedWindow:20000,comboStep:100,comboCap:5},
 audio:{duckDb:-5,duckRelease:0.32,fade:0.045},
 visual:{particles:{LOW:15,NORMAL:40,HIGH:75},maxParticles:200,fps:30},
 defaults:{bgm:true,bgmVolume:0.6,track:'the-winning-move',se:true,seVolume:1,background:true,waveform:true,effects:'HIGH'},
 tracks:[{id:'the-winning-move',title:'The Winning Move',mood:'まずは、この1曲から',file:'assets/bgm/the-winning-move.mp3'}, {id:'target-locked',title:'Target Locked',mood:'狙いを定めて、次の正解へ',file:'assets/bgm/target-locked.mp3'}, {id:'rapid-ascent',title:'Rapid Ascent',mood:'コンボを重ねて、上昇しよう',file:'assets/bgm/rapid-ascent.mp3'}, {id:'the-perfect-window',title:'The Perfect Window',mood:'自分のペースで、最高の一瞬を',file:'assets/bgm/the-perfect-window.mp3'}],
 seFiles:{CORRECT:'correct',GOOD:'good',GREAT:'great',EXCELLENT:'excellent',PERFECT:'perfect',FEVER:'fever',WRONG:'wrong',RECORD:'record'}
});
export const tierFor = combo => [...CONFIG.combo].reverse().find(t=>combo>=t.at)||CONFIG.combo[0];
