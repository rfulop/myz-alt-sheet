export default class RelationshipSheet extends ItemSheet {
    /** @override */
    get template() {
        return "modules/myz-alt-sheet/templates/item/relation-sheet.hbs";
    }

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["mutant-year-zero", "myz-alt", "sheet", "item", "relation"],
            width: 520,
            height: 360,
        });
    }

    async getData(options) {
        return {
            ...super.getData(options),
            item: this.item,
            system: this.item.system,
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) {
        }

        // Roll handlers, click handlers, etc. would go here.
    }
}