import fs from "node:fs";
import path from "node:path";
import type {ModFile,Instance} from "../../shared/types";
import {ModrinthService} from "../modrinth/service";
import {CurseForgeService} from "../curseforge/service";
import {DownloadService} from "../downloads/service";

export class ModService{
  constructor(private downloads:DownloadService,private modrinth:ModrinthService,private curseforge:CurseForgeService){}
  async modrinthFile(project:string,gameVersion:string,loader:string){
    const versions:any[]=await this.modrinth.versions(project,gameVersion,loader);
    const version=versions.find(v=>v.files?.some((f:any)=>f.primary))||versions[0];
    const file=version?.files?.find((f:any)=>f.primary)||version?.files?.[0];
    if(!version||!file) throw new Error("No compatible Modrinth file was found.");
    return {source:"modrinth",projectId:project,versionId:version.id,fileId:file.hashes?.sha1||file.url,name:file.filename,url:file.url,size:file.size,sha1:file.hashes?.sha1,loaders:version.loaders,gameVersions:version.game_versions} as ModFile;
  }
  async curseforgeFile(apiKey:string,projectId:string,gameVersion:string,loader?:string){
    const files:any[]=await this.curseforge.files(apiKey,Number(projectId),gameVersion,loader);
    const file=files[0]; if(!file) throw new Error("No compatible CurseForge file was found.");
    if(!file.downloadUrl) throw new Error("CurseForge did not expose a direct download URL for this file.");
    const sha1=file.hashes?.find((h:any)=>h.algo===1)?.value;
    return {source:"curseforge",projectId:String(projectId),fileId:String(file.id),name:file.fileName,url:file.downloadUrl,size:file.fileLength,sha1,loaders:loader?[loader]:undefined,gameVersions:file.gameVersions} as ModFile;
  }
  async install(instance:Instance,file:ModFile){
    const mods=path.join(instance.directory,"mods"); fs.mkdirSync(mods,{recursive:true});
    const safe=file.name.replace(/[^a-z0-9._+-]/gi,"_"); const dest=path.join(mods,safe);
    await this.downloads.download({label:`Installing ${file.name}`,source:file.source,url:file.url,destination:dest,size:file.size,sha1:file.sha1});
    return {file,destination:dest};
  }
  listInstalled(instance:Instance){
    const mods=path.join(instance.directory,"mods"); if(!fs.existsSync(mods)) return [];
    return fs.readdirSync(mods,{withFileTypes:true}).filter(x=>x.isFile()&&x.name.toLowerCase().endsWith(".jar")).map(x=>{const p=path.join(mods,x.name);return {name:x.name,path:p,sizeBytes:fs.statSync(p).size,modifiedAt:new Date(fs.statSync(p).mtimeMs).toISOString()}});
  }
  remove(instance:Instance,name:string){
    const safe=path.basename(name); if(safe!==name||!safe.toLowerCase().endsWith(".jar")) throw new Error("Invalid mod file name.");
    const p=path.join(instance.directory,"mods",safe); if(!fs.existsSync(p)) throw new Error("Mod file not found."); fs.rmSync(p); return true;
  }
}
