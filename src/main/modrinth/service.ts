import{MODRINTH_API}from "../../shared/constants";
export class ModrinthService{
  private async get(path:string){const r=await fetch(`${MODRINTH_API}${path}`);const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body?.description||`Modrinth request failed: ${r.status}`);return body;}
  async search(query:string,projectType?:string){const p=new URLSearchParams({query,limit:"30"});if(projectType)p.set("facets",JSON.stringify([[`project_type:${projectType}`]]));return(await this.get(`/search?${p}`)).hits;}
  async project(projectId:string){return this.get(`/project/${encodeURIComponent(projectId)}`);}
  async versions(projectId:string,gameVersion:string,loader:string){const p=new URLSearchParams({game_versions:JSON.stringify([gameVersion]),loaders:JSON.stringify([loader]),include_changelog:"false"});return this.get(`/project/${encodeURIComponent(projectId)}/version?${p}`);}
}
