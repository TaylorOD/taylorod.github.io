import { validContext, validReply } from '../pets/dialogue.js';
export class DialogueHost {
  constructor(callback,send,family){this.callback=callback;this.send=send;this.family=family;}
  cancel(){this.active?.abort();this.active=null;}
  async receive(message){
    if(message.type==='dialogue-cancel'){if(message.id===this.id)this.cancel();return;}
    if(message.type!=='dialogue-request' || !Number.isSafeInteger(message.id) || message.id<1 || !validContext(message.context) || message.context.family!==this.family || this.active)return;
    const controller=new AbortController();this.active=controller;this.id=message.id;
    let timer;
    try{
      if(typeof this.callback!=='function')throw new Error('Unavailable');
      const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{reject(new Error('Timeout'));controller.abort();},9000);});
      const text=await Promise.race([Promise.resolve().then(()=>this.callback(Object.freeze({...message.context}),{signal:controller.signal})),timeout]);
      if(!validReply(text))throw new Error('Invalid reply');
      if(this.active===controller)this.send({type:'dialogue-result',id:message.id,text});
    }catch{if(this.active===controller)this.send({type:'dialogue-result',id:message.id,error:true});}
    finally{clearTimeout(timer);if(this.active===controller)this.active=null;}
  }
}
