import{launch as xmclLaunch}from "@xmcl/core";
import type{Account,Instance}from "../../shared/types";
import type{ChildProcess}from "node:child_process";
export class GameLauncher{
  private proc:ChildProcess|undefined;
  async launch(instance:Instance,account:Account|undefined,javaPath:string,onOutput:(s:string)=>void,onExit:(c:number|null)=>void){
    if(this.proc)throw new Error("A Minecraft process is already running.");
    if(instance.platform!=="java")throw new Error("This release launches Java Edition instances only.");
    const auth=account?.type==="microsoft"&&account.accessToken&&account.uuid?{accessToken:account.accessToken,uuid:account.uuid,name:account.displayName,userType:"msa"}:undefined;
    const proc=await xmclLaunch({gamePath:instance.directory,javaPath,version:instance.minecraftVersion,...(auth?{authorization:auth as any}:{}),minMemory:Math.max(512,instance.memoryMb),maxMemory:Math.max(512,instance.memoryMb),extraExecOption:{windowsHide:true}} as any);
    this.proc=proc; proc.stdout?.on("data",d=>onOutput(String(d))); proc.stderr?.on("data",d=>onOutput(String(d)));
    proc.on("exit",c=>{this.proc=undefined;onExit(c)}); return proc.pid;
  }
  stop(){if(!this.proc)return false;this.proc.kill();return true;}
  forceStop(){if(!this.proc)return false;this.proc.kill("SIGKILL");this.proc=undefined;return true;}
}
