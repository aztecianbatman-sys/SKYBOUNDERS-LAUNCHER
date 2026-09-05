import{contextBridge,ipcRenderer}from"electron";
const invoke=(channel:string,...args:any[])=>ipcRenderer.invoke(channel,...args);
const api={
 state:()=>invoke("state:get"),version:()=>invoke("app:version"),
 window:{minimize:()=>invoke("window:minimize"),toggleMaximize:()=>invoke("window:toggle-maximize"),close:()=>invoke("window:close")},
 path:{open:(p:string)=>invoke("path:open",p)},
 settings:{update:(s:any)=>invoke("settings:update",s)},
 versions:{list:()=>invoke("versions:list")},
 instances:{save:(i:any)=>invoke("instances:save",i),delete:(id:string)=>invoke("instances:delete",id),open:(id:string)=>invoke("instances:open",id),duplicate:(id:string,name:string)=>invoke("instances:duplicate",id,name),repair:(id:string)=>invoke("instances:repair",id)},
 game:{install:(i:any,url:string)=>invoke("game:install",i,url),launch:(id:string)=>invoke("game:launch",id),stop:()=>invoke("game:stop"),forceStop:()=>invoke("game:force-stop")},
 hardware:{get:()=>invoke("hardware:get")},
 java:{scan:()=>invoke("java:scan")},
 modrinth:{search:(q:string,t?:string)=>invoke("modrinth:search",q,t),versions:(p:string,g:string,l:string)=>invoke("modrinth:versions",p,g,l),project:(p:string)=>invoke("modrinth:project",p)},
 curseforge:{search:(q:string,v?:string,c?:string)=>invoke("curseforge:search",q,v,c),files:(id:number,v?:string,l?:string)=>invoke("curseforge:files",id,v,l)},
 mods:{installed:(id:string)=>invoke("mods:installed",id),install:(id:string,file:any)=>invoke("mods:install",id,file),installModrinth:(id:string,project:string)=>invoke("mods:install-modrinth",id,project),installCurseForge:(id:string,project:string)=>invoke("mods:install-curseforge",id,project),remove:(id:string,name:string)=>invoke("mods:remove",id,name)},
 worlds:{list:(id:string)=>invoke("worlds:list",id),delete:(id:string,name:string)=>invoke("worlds:delete",id,name),backup:(id:string,name:string)=>invoke("worlds:backup",id,name),restore:(backup:any)=>invoke("worlds:restore",backup)},
 downloads:{cancel:(id:string)=>invoke("downloads:cancel",id)},
 diagnostics:{create:(id?:string)=>invoke("diagnostics:create",id),save:(report:any)=>invoke("diagnostics:save",report)},
 auth:{microsoft:()=>invoke("auth:microsoft")},accounts:{save:(a:any)=>invoke("accounts:save",a),remove:(id:string)=>invoke("accounts:remove",id)},
 on:(channel:string,fn:(payload:any)=>void)=>{const l=(_:unknown,p:any)=>fn(p);ipcRenderer.on(channel,l);return()=>ipcRenderer.removeListener(channel,l)}
};
contextBridge.exposeInMainWorld("skybounders",api);
