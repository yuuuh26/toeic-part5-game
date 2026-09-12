const NAME='part5-burst';
export class Storage {
 async open(){this.db=await new Promise((resolve,reject)=>{const r=indexedDB.open(NAME,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('sessions')){const s=db.createObjectStore('sessions',{keyPath:'id'});s.createIndex('date','date');}if(!db.objectStoreNames.contains('settings'))db.createObjectStore('settings');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('別のタブを閉じて再読み込みしてください'));});this.db.onversionchange=()=>this.db.close();}
 async read(store,key){return new Promise((resolve,reject)=>{const r=this.db.transaction(store).objectStore(store);const q=key===undefined?r.getAll():r.get(key);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});}
 async write(store,value,key){return new Promise((resolve,reject)=>{const tx=this.db.transaction(store,'readwrite');const s=tx.objectStore(store);key===undefined?s.put(value):s.put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('保存を完了できませんでした'));});}
 async persistence(request=false){try{if(!navigator.storage?.persisted)return 'unsupported';if(await navigator.storage.persisted())return 'granted';return request&&await navigator.storage.persist()?'granted':'denied';}catch{return 'denied';}}
}
