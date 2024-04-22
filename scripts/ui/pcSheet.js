import {MYZActorSheet} from "../../../../systems/mutant-year-zero/module/actor/actor-sheet.js"
import {typeRelation} from "../module.js"

export class MutantYearZeroAlternateActorSheet extends MYZActorSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["myz-alt", "mutant-year-zero"],
            template: "modules/myz-alt-sheet/templates/actor/actor-sheet.hbs",
            width: 810,
            height: 985,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    }

    async getData(options){
        const context = await super.getData();

        const npcRelationships = [];
        const pcRelationships = [];
        const stashedGear = [];
        const noStashedGear = [];
        for (let i of context.items) {
            if (i.type === typeRelation && i.system.characterType === 'pc') {
                pcRelationships.push(i);
            } else if (i.type === typeRelation && i.system.characterType === 'npc') {
                npcRelationships.push(i);
            } else if (i.system.stashed) {
                stashedGear.push(i);
            } else if (i.type === "gear" && !i.system.stashed) {
                noStashedGear.push(i);
            }
        }
        context.pcRelationships = pcRelationships;
        context.npcRelationships = npcRelationships;
        context.stashedGear = stashedGear;
        context.noStashedGear = noStashedGear;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        html.find('.trauma-checkbox').click(this._updateTrauma.bind(this));
        html.find('.point-checkbox').click(this._updatePoints.bind(this));
        html.find('.attribute-max').change(this._updateAttributeValue.bind(this));
        html.find('.buddy-checkbox').change(this._updateBuddyCheckbox.bind(this));
    }

    async _renderInner(...args) {
        const html = await super._renderInner(...args);

        await this._updateAttributeCheckboxes.call(this, html);
        await this._updatePointCheckboxes.call(this, html, 'rot');
        await this._updatePointCheckboxes.call(this, html, 'xp');
        await this._updatePointCheckboxes.call(this, html, 'resource_points');
        await this._updatePointCheckboxes.call(this, html, 'permanent-rot');

        return html;
    }

    async _updateAttributeCheckboxes(html){
        for (let attribute in this.actor.system.attributes) {
            let max = this.actor.system.attributes[attribute].max || 0;
            let value = this.actor.system.attributes[attribute].value || 0;

            const trauma_list = html.find('.trauma-checkboxes[data-attribute="'+attribute+'"]');

            for (let i = 0; i < 5; i++) {
                const isCheckboxChecked = i < (max - value);
                const trauma_checkbox = $(`<input type="checkbox" class="trauma-checkbox" data-attribute="`+attribute+`" ${isCheckboxChecked ? 'checked' : ''}/>`);

                trauma_list.append(trauma_checkbox);
            }
        }
    }

    async _updatePointCheckboxes(html, fieldName) {
        let fieldValue;
        if (fieldName === 'permanent-rot') {
            fieldValue = this.actor.system.rot.permanent;
        } else {
            fieldValue = this.actor.system[fieldName].value;
        }
        const list = html.find(`.point-checkboxes[data-point="${fieldName}"]`);

        list.empty();

        for (let i = 0; i < 10; i++) {
            const isChecked = i < fieldValue;
            const checkbox = $(`<input type="checkbox" class="point-checkbox" data-point="${fieldName}" ${isChecked ? 'checked' : ''}/>`);
            list.append(checkbox);
        }
    }

    async _updateBuddyCheckbox(event) {
        const checkbox = $(event.currentTarget);
        const isChecked = checkbox.is(':checked');
        const itemId = checkbox.data('item-id');
        const fieldToUpdate = checkbox.data('linked-value');

        let updateData = {};
        updateData[fieldToUpdate] = isChecked;

        let itemToUpdate = this.actor.items.get(itemId);
        if (itemToUpdate) {
            await itemToUpdate.update(updateData);
        }
    }

    async _updateAttributeValue(event) {
        const attribute = $(event.currentTarget).data("attribute");
        const newValue = $(event.currentTarget).val();

        const checkboxes = $(`.trauma-checkboxes[data-attribute="${attribute}"] input[type=checkbox]`);

        const checkedCount = checkboxes.filter(':checked').length;
        const updateData = {
            [`system.attributes.${attribute}.value`]: newValue - checkedCount
        };
        await this.actor.update(updateData);
    }

    async _updateTrauma(event){
        const attribute = $(event.currentTarget).data("attribute");
        const isChecked = $(event.currentTarget).prop("checked");

        let attributeValue = this.actor.system.attributes[attribute].value;
        attributeValue = isChecked ? attributeValue - 1 : attributeValue + 1;

        const updateData = {
            [`system.attributes.${attribute}.value`]: attributeValue
        };
        await this.actor.update(updateData);
    }

    async _updatePoints(event) {
        const field = $(event.currentTarget).data("point");
        const isChecked = $(event.currentTarget).prop("checked");

        let pointValue;
        let pointKey;
        if (field === 'permanent-rot') {
            pointValue = this.actor.system.rot.permanent;
            pointKey = `system.rot.permanent`
        } else {
            pointValue = this.actor.system[field].value;
            pointKey = `system.${field}.value`
        }

        pointValue = isChecked ? pointValue + 1 : pointValue - 1;

        const updateData = {
            [pointKey]: pointValue
        };
        await this.actor.update(updateData);
    }
}