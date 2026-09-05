const BASE="https://api.curseforge.com/v1";
export class CurseForgeService{
 private headers(apiKey:string){if(!apiKey)throw new Error("CurseForge API key is not configured. Add one in Settings → Integrations.");return{Accept:"application/json","x-api-key":apiKey};}
 private async get(apiKey:string,path:string){const r=await fetch(`${BASE}${path}`,{headers:this.headers(apiKey)});const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body?.error?.message||`CurseForge request failed: ${r.status}`);return body.data??body;}
 async search(apiKey:string,query:string,gameVersion?:string,classId?:string){const p=new URLSearchParams({gameId:"432",searchFilter:query,pageSize:"30",sortField:"2",sortOrder:"desc"});if(gameVersion)p.set("gameVersion",gameVersion);if(classId)p.set("classId",classId);return this.get(apiKey,`/mods/search?${p}`);}
 async getMod(apiKey:string,modId:number){return this.get(apiKey,`/mods/${modId}`);}
 async files(apiKey:string,modId:number,gameVersion?:string,loader?:number){const p=new URLSearchParams({pageSize:"50",index:"0",sortField:"2",sortOrder:"desc"});if(gameVersion)p.set("gameVersion",gameVersion);if(loader!==undefined)p.set("modLoaderType",String(loader));return this.get(apiKey,`/mods/${modId}/files?${p}`);}
 async file(apiKey:string,modId:number,fileId:number){return this.get(apiKey,`/mods/${modId}/files/${fileId}`);}
}
