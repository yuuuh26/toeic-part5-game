// Keep the unsaved result until its transaction commits; concurrent retries share one write.
export class SessionSave {
 constructor(write,onSaved=()=>{}){this.write=write;this.onSaved=onSaved;this.pending=null;this.inFlight=null;}
 stage(result){if(this.pending&&this.pending.id!==result.id)throw Error('前回の結果が未保存です');this.pending=result;}
 save(){
  if(this.inFlight)return this.inFlight;
  if(!this.pending)return Promise.resolve();
  const result=this.pending;
  this.inFlight=Promise.resolve().then(()=>this.write(result)).then(()=>{
   this.pending=null;
   this.onSaved(result);
  }).finally(()=>{this.inFlight=null;});
  return this.inFlight;
 }
}
