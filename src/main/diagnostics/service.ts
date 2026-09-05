import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import type {DiagnosticReport,Instance,JavaRuntime} from "../../shared/types";

export class DiagnosticsService{
  constructor(private userData:string,private launcherVersion:string,private java?:JavaRuntime){}
  create(instance?:Instance):DiagnosticReport{
    const files:Record<string,string>={};
    if(instance){
      for(const rel of ["logs/latest.log","launcher_profiles.json","options.txt"]){const p=path.join(instance.directory,rel);if(fs.existsSync(p)){const s=fs.statSync(p);files[rel]=`present · ${s.size} bytes · ${new Date(s.mtimeMs).toISOString()}`;}}
    }
    const logs:string[]=[];const logDir=path.join(instance?.directory||this.userData,"logs");try{if(fs.existsSync(logDir)){for(const f of fs.readdirSync(logDir).filter(x=>x.endsWith(".log")).slice(-5))logs.push(path.join(logDir,f));}}catch{}
    return{createdAt:new Date().toISOString(),instanceId:instance?.id,launcherVersion:this.launcherVersion,os:`${os.type()} ${os.release()}`,arch:process.arch,node:process.version,java:this.java,recentLogs:logs,files};
  }
  write(report:DiagnosticReport,target:string){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(report,null,2),"utf8");return target;}
}
