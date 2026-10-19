const { api, sheets, ux } = foundry.applications;

export default class RelationshipSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {
    static DEFAULT_OPTIONS = {
        classes: ["mutant-year-zero", "myz-alt", "sheet", "item", "relation"],
        position: { width: 560, height: 490 },
        window: { resizable: true },
        form: { submitOnChange: true, closeOnSubmit: false }
    };
    static PARTS = {
        body: { template: "modules/myz-alt-sheet/templates/item/relation-sheet.hbs" }
    };
    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        Object.assign(context, { item: this.item, system: this.item.system, editable: this.isEditable });
        context.notesHTML = await ux.TextEditor.implementation.enrichHTML(this.item.system.notes, {
            secrets: this.item.isOwner, relativeTo: this.item
        });
        return context;
    }
}
