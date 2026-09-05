import {execFile} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {promisify} from "node:util";
import type {JavaRuntime} from "../../shared/types";
const execFileAsync=promisify(execFile);

function candidates(extra:string[]){
  const roots=[...(extra||[]),process.env.JAVA_HOME||"",process.env.JDK_HOME||"",path.join(os.homedir(),".jdks")];
  if(process.platform==="win32") roots.push("C:\\Program Files\\Java","C:\\Program Files\\Eclipse Adoptium","C:\\Program Files\\Microsoft");
  return roots.filter(Boolean);
}

function javaBinaries(root:string){
  const out:string[]=[];
  try{
    const stat=fs.statSync(root);
    if(stat.isFile()&&/java(\.exe)?$/i.test(root)) out.push(root);
    else if(stat.isDirectory()){
      const direct=path.join(root,"bin",process.platform==="win32"?"java.exe":"java");
      if(fs.existsSync(direct)) out.push(direct);
      for(const name of fs.readdirSync(root,{withFileTypes:true})){
        if(name.name.startsWith(".")) continue;
        if(out.length>=24) break;
        const p=path.join(root,name.name);
        if(name.isDirectory()){
          const nested=path.join(p,"bin",process.platform==="win32"?"java.exe":"java");
          if(fs.existsSync(nested)) out.push(nested);
        }
      }
    }
  }catch{}
  return out;
}

export class JavaService{
  async inspect(javaPath:string):Promise<JavaRuntime|null>{
    try{
      const r=await execFileAsync(javaPath,["-version"],{windowsHide:true,maxBuffer:1024*1024});
      const text=(r.stderr||"")+"\n"+(r.stdout||"");
      const match=text.match(/version\s+\"([^\"]+)\"/i); if(!match) return null;
      const version=match[1]; const major=this.major(version);
      const vendor=text.split("\n")[0].replace(/version\s+\"[^\"]+\".*/i,"").trim()||undefined;
      return {path:javaPath,version,major,vendor,arch:process.arch,source:"detected"};
    }catch{return null}
  }
  private major(v:string){
    const first=v.split(".")[0]; if(first==="1") return Number(v.split(".")[1]||8);
    const n=Number(first); return Number.isFinite(n)?n:0;
  }
  async scan(extra:string[]=[]){
    const seen=new Set<string>(); const paths:string[]=[];
    for(const root of candidates(extra)) for(const p of javaBinaries(root)){const key=path.resolve(p);if(!seen.has(key)){seen.add(key);paths.push(key)}}
    const pathEnv=(process.env.PATH||"").split(path.delimiter);
    for(const dir of pathEnv.slice(0,80)){const p=path.join(dir,process.platform==="win32"?"java.exe":"java");if(fs.existsSync(p)&&!seen.has(p)){seen.add(p);paths.push(p)}}
    const result:JavaRuntime[]=[]; for(const p of paths.slice(0,40)){const x=await this.inspect(p);if(x) result.push(x)}
    return result.sort((a,b)=>b.major-a.major);
  }
}
