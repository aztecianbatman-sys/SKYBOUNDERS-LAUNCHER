import{describe,expect,it}from"vitest";
function recommendedMemoryMb(ramMb:number,mode:"potato"|"balanced"|"performance"){const ratio=mode==="potato"?.2:mode==="performance"?.4:.3;return Math.floor(Math.max(1536,Math.min(8192,Math.floor(ramMb*ratio)))/512)*512}
describe("Skybounders core",()=>{it("keeps Java allocation sensible",()=>{expect(recommendedMemoryMb(16384,"balanced")).toBeLessThan(10000)});it("keeps potato mode conservative",()=>{expect(recommendedMemoryMb(8192,"potato")).toBeLessThan(recommendedMemoryMb(8192,"performance"))})});
