import test from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

// Optional integration tests use a local Foundry installation; its sources are never shipped.
if (process.env.MYZ_TEST_FOUNDRY) {
    await import(pathToFileURL(`${process.env.MYZ_TEST_FOUNDRY}/common/server.mjs`));
    const { default: RelationshipData } = await import("../scripts/data/relationshipData.js");
    test("V14 relationship model retains notes, buddy state and actor links", () => {
        const model = new RelationshipData({characterType:"pc",role:"Scout",relation:"Friend",buddy:true,
            notes:"<p>Helped me</p>",actorUuid:"Actor.abcdefghijklmnop"});
        assert.equal(model.characterType,"pc");
        assert.equal(model.buddy,true);
        assert.equal(model.notes,"<p>Helped me</p>");
        assert.equal(model.actorUuid,"Actor.abcdefghijklmnop");
    });
    test("new relations default to NPC with independent, empty fields", () => {
        const model = new RelationshipData({});
        assert.equal(model.characterType,"npc");
        assert.equal(model.buddy,false);
        assert.equal(model.relation,"");
        assert.equal(model.actorUuid,"");
        assert.equal(model.notes,"");
    });
}
