import test from "node:test";
import assert from "node:assert/strict";

globalThis.CONST = {DOCUMENT_OWNERSHIP_LEVELS:{OBSERVER:2}};
globalThis.foundry = { applications: {
    api: {HandlebarsApplicationMixin: Base => Base},
    sheets: {ActorSheetV2: class {}}, ux:{}
}};
const {MutantYearZeroAlternateActorSheet: Sheet} = await import("../scripts/ui/pcSheet.js");

test("dropping an actor creates a linked relation and never moves the actor", async () => {
    const sheet = new Sheet();
    sheet.isEditable = true;
    const created = [];
    sheet.actor = {uuid:"Actor.owner", items:[], createEmbeddedDocuments: async (type, items) => {
        created.push(...items);
        return [{sheet:{render:async()=>{}}}];
    }};
    const actor = {uuid:"Actor.friend",name:"Ark",type:"mutant",img:"portrait.webp",system:{role:"Scout"}};
    assert.equal(await sheet._onDropActor({target:{closest:()=>null}},actor),actor);
    assert.equal(created.length,1);
    assert.equal(created[0].type,"myz-alt-sheet.relation");
    assert.deepEqual(created[0].system,{characterType:"pc",actorUuid:"Actor.friend",role:"Scout"});
});
test("dropping the same actor reopens the existing relation", async () => {
    const sheet = new Sheet(); sheet.isEditable = true;
    let opened = false;
    sheet.actor = {uuid:"Actor.owner", items:[{type:"myz-alt-sheet.relation", system:{actorUuid:"Actor.friend"},
        sheet:{render:async()=>{opened=true;}}}], createEmbeddedDocuments:async()=>assert.fail("Duplicate relation")};
    await sheet._onDropActor({target:{closest:()=>null}},{uuid:"Actor.friend"});
    assert.equal(opened,true);
});
test("read-only sheets cannot add relations or change counters", async () => {
    const sheet = new Sheet(); sheet.isEditable=false;
    sheet.actor = {update:async()=>assert.fail("Read-only write")};
    assert.equal(await sheet._onDropActor({},{}),null);
    Sheet._point.call(sheet,{},{});
    Sheet._trauma.call(sheet,{},{});
});
test("trauma counters update current strength without changing maximum strength", async () => {
    const updates = [];
    const sheet = {isEditable:true,actor:{system:{attributes:{strength:{max:4,value:4}}},update:data=>updates.push(data)}};
    Sheet._trauma.call(sheet,{}, {dataset:{attribute:"strength",index:"1"},checked:true});
    assert.deepEqual(updates,[{"system.attributes.strength.value":2}]);
});
