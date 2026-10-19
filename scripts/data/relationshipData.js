export default class RelationshipData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const { StringField, BooleanField, HTMLField } = foundry.data.fields;
        return {
            characterType: new StringField({ required: true, choices: ["pc", "npc"], initial: "npc" }),
            role: new StringField({ initial: "" }),
            relation: new StringField({ initial: "" }),
            buddy: new BooleanField({ initial: false }),
            notes: new HTMLField({ initial: "" }),
            actorUuid: new StringField({ initial: "" })
        };
    }
}
