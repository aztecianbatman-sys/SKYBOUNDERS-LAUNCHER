import {MOJANG_VERSION_MANIFEST} from "../../shared/constants";
export async function fetchVersionManifest(){const r=await fetch(MOJANG_VERSION_MANIFEST,{headers:{accept:"application/json"}});if(!r.ok)throw new Error(`Minecraft metadata request failed: ${r.status}`);return r.json()}
export async function fetchVersionJson(url:string){const r=await fetch(url,{headers:{accept:"application/json"}});if(!r.ok)throw new Error(`Version metadata request failed: ${r.status}`);return r.json()}
