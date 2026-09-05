import fs from "node:fs";
import path from "node:path";
import {randomUUID} from "node:crypto";
import type {BackupRecord,Instance,WorldRecord} from "../../shared/types";

function folderSize(dir:string){let total=0;try{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);total+=e.isDirectory()?folderSize(p):fs.statSync(p).size;}}catch{}return total;}
function copyDir(src:string,dst:string){fs.mkdirSync(dst,{recursive:true});for(const e of fs.readdirSync(src,{withFileTypes:true})){const a=path.join(src,e.name),b=path.join(dst,e.name);if(e.isDirectory())copyDir(a,b);else fs.copyFileSync(a,b);}}

export class WorldService{
  list(instance:Instance):WorldRecord[]{const root=path.join(instance.directory,"saves");if(!fs.existsSync(root))return[];return fs.readdirSync(root,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>{const p=path.join(root,e.name),s=fs.statSync(p);return{name:e.name,path:p,sizeBytes:folderSize(p),modifiedAt:new Date(s.mtimeMs).toISOString()}}).sort((a,b)=>b.modifiedAt.localeCompare(a.modifiedAt));}
  open(world:WorldRecord){return world.path;}
  delete(instance:Instance,name:string){const safe=path.basename(name);if(safe!==name)throw new Error("Invalid world name.");const p=path.join(instance.directory,"saves",safe);if(!fs.existsSync(p))throw new Error("World not found.");fs.rmSync(p,{recursive:true,force:true});return true;}
  backup(instance:Instance,name:string,backupRoot:string):BackupRecord{const safe=path.basename(name);if(safe!==name)throw new Error("Invalid world name.");const src=path.join(instance.directory,"saves",safe);if(!fs.existsSync(src))throw new Error("World not found.");const id=randomUUID(),stamp=new Date().toISOString().replace(/[:.]/g,"-");const dest=path.join(backupRoot,instance.id,`${stamp}-${safe}`);copyDir(src,dest);return{id,instanceId:instance.id,name:safe,source:src,destination:dest,createdAt:new Date().toISOString(),sizeBytes:folderSize(dest)};}
  restore(instance:Instance,backup:BackupRecord){const safe=path.basename(backup.name);if(safe!==backup.name)throw new Error("Invalid backup name.");if(!fs.existsSync(backup.destination))throw new Error("Backup not found.");const dest=path.join(instance.directory,"saves",safe);if(fs.existsSync(dest))throw new Error("A world with that name already exists.");copyDir(backup.destination,dest);return true;}
}
