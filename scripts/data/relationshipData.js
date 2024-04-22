export default class RelationshipData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            characterType: new fields.StringField({
                textSearch: true,
            }),
            role: new fields.StringField({
                textSearch: true,
            }),
            relation: new fields.StringField({
                textSearch: true,
            }),
            buddy: new fields.BooleanField({
                textSearch: true,
            }),
            notes: new fields.HTMLField({
                textSearch: true
            })
        };
    }
}