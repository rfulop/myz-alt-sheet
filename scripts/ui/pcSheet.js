import { templatePaths } from "../core/preloadTemplates.js";
import { MODULE_ID, typeRelation } from "../constants.js";

const { api, sheets, ux } = foundry.applications;

// Use the core V2 sheet and the system's public document methods, avoiding private sheet imports.
export class MutantYearZeroAlternateActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
    static DEFAULT_OPTIONS = {
        viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
        classes: ["myz-alt", "mutant-year-zero", "actor"],
        position: { width: 770, height: 985 },
        window: { resizable: true },
        form: { submitOnChange: true, closeOnSubmit: false },
        actions: {
            createItem: this._createItem,
            viewItem: this._viewItem,
            deleteItem: this._deleteItem,
            toggleItem: this._toggleItem,
            rollAttribute: this._rollAttribute,
            rollItem: this._rollItem,
            rollArmor: this._rollArmor,
            sendToChat: this._sendToChat,
            roll: this._roll,
            push: this._push,
            trauma: this._trauma,
            point: this._point
        }
    };
    static PARTS = {
        body: { template: "modules/myz-alt-sheet/templates/actor/actor-sheet.hbs", templates: templatePaths, scrollable: [".sheet-body"] }
    };
    static TABS = {
        primary: {
            tabs: [
                { id: "attributes", label: "MYZ.ATTRIBUTES" },
                { id: "gear", label: "MYZ.GEAR" },
                { id: "info", label: "MYZ.INFO" },
                { id: "notes", label: "MYZ-ALT.NOTES" }
            ], initial: "attributes"
        }
    };

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        const items = [...this.actor.items].sort((a, b) => a.sort - b.sort);
        const flags = this.actor.getFlag(MODULE_ID, "appearance") ?? {};
        Object.assign(context, {
            actor: this.actor, system: this.actor.system, editable: this.isEditable,
            tabs: this._prepareTabs("primary"),
            ...this.actor.prepareCharacterItems(items),
            pcRelationships: items.filter(i => i.type === typeRelation && i.system.characterType === "pc"),
            npcRelationships: items.filter(i => i.type === typeRelation && i.system.characterType === "npc"),
            stashedGear: items.filter(i => i.system.stashed),
            noStashedGear: items.filter(i => i.type === "gear" && !i.system.stashed),
            appearance: Object.fromEntries(["face", "body", "clothing"].map(key => [key, flags[key] ?? ""]))
        });
        const enrich = text => ux.TextEditor.implementation.enrichHTML(text ?? "", {
            secrets: this.actor.isOwner, relativeTo: this.actor
        });
        const [face, body, clothing, notes] = await Promise.all([
            enrich(context.appearance.face), enrich(context.appearance.body),
            enrich(context.appearance.clothing), enrich(context.system.notes)
        ]);
        context.enriched = { face, body, clothing, notes };
        return context;
    }

    async _onFirstRender(context, options) {
        await super._onFirstRender(context, options);
        this._createContextMenu(this._itemContextOptions, ".draggable[data-item-id]");
    }

    _itemContextOptions() {
        const itemFor = target => this.actor.items.get(target.dataset.itemId);
        return [
            { label: "MYZ.EDIT", icon: '<i class="fas fa-edit"></i>',
                onClick: (event, target) => itemFor(target)?.sheet.render({ force: true }) },
            { label: "MYZ.TOCHAT", icon: '<i class="fas fa-comment"></i>',
                visible: target => this.isEditable && itemFor(target)?.type !== typeRelation,
                onClick: (event, target) => itemFor(target)?.sendToChat() },
            { label: "MYZ.STASH", icon: '<i class="fa-regular fa-box"></i>',
                visible: target => this.isEditable && target.dataset.physical === "1",
                onClick: (event, target) => {
                    const item = itemFor(target);
                    return item?.update({ "system.stashed": !item.system.stashed });
                } },
            { label: "MYZ.DELETE", icon: '<i class="fas fa-trash"></i>',
                visible: () => this.isEditable,
                onClick: (event, target) => itemFor(target)?.deleteDialog() }
        ];
    }

    async _onRender(context, options) {
        await super._onRender(context, options);
        for (const list of this.element.querySelectorAll(".trauma-checkboxes")) {
            const attribute = this.actor.system.attributes[list.dataset.attribute];
            list.replaceChildren(...Array.from({ length: Math.max(5, attribute.max) }, (_, index) => {
                const checkbox = this._checkbox("trauma", index, index < attribute.max - attribute.value);
                checkbox.dataset.attribute = list.dataset.attribute;
                checkbox.disabled ||= index >= attribute.max;
                return checkbox;
            }));
        }
        for (const list of this.element.querySelectorAll(".point-checkboxes")) {
            const field = list.dataset.point;
            const value = field === "permanent-rot" ? this.actor.system.rot.permanent : this.actor.system[field].value;
            list.replaceChildren(...Array.from({ length: Math.max(10, Number(value) || 0) }, (_, index) => {
                const checkbox = this._checkbox("point", index, index < Number(value));
                checkbox.dataset.point = field;
                return checkbox;
            }));
        }
    }

    _checkbox(action, index, checked) {
        const input = document.createElement("input");
        Object.assign(input, { type: "checkbox", className: `${action}-checkbox`, checked, disabled: !this.isEditable });
        input.dataset.action = action;
        input.dataset.index = index;
        input.setAttribute("aria-label", `${game.i18n.localize(action === "trauma" ? "MYZ-ALT.TRAUMA_LABEL" : "MYZ-ALT.POINT")} ${index + 1}`);
        return input;
    }

    _onChangeForm(formConfig, event) {
        if (!this.isEditable) return;
        const target = event.target;
        if (target.matches(".attribute-max")) {
            const attribute = target.dataset.attribute;
            const old = this.actor.system.attributes[attribute];
            const max = Math.max(0, Math.trunc(Number(target.value) || 0));
            return this.actor.update({
                [`system.attributes.${attribute}.max`]: max,
                [`system.attributes.${attribute}.value`]: Math.max(0, max - (old.max - old.value))
            });
        }
        if (target.matches(".owned-item-value, .skill-value, .buddy-checkbox")) {
            const item = this.actor.items.get(target.dataset.itemId);
            const path = target.dataset.linkedValue;
            if (!item || !path) return;
            const value = target.type === "checkbox" ? target.checked : Number(target.value);
            return item.update({ [path]: value });
        }
        // Unnamed counters have their own click action; never submit stale form values for them.
        if (!target.name) return;
        return super._onChangeForm(formConfig, event);
    }

    static async _createItem(event, target) {
        if (!this.isEditable) return;
        const type = target.dataset.type;
        const characterType = target.dataset.characterType ?? "npc";
        const name = type === typeRelation
            ? game.i18n.localize(`MYZ-ALT.RELATIONSHIPS.${characterType.toUpperCase()}.NEW`)
            : game.i18n.localize("MYZ.Add") + " " + game.i18n.localize(CONFIG.Item.typeLabels[type] ?? type);
        const [item] = await this.actor.createEmbeddedDocuments("Item", [{ name, type,
            ...(type === typeRelation ? { img: `modules/${MODULE_ID}/assets/ico/relation.svg`, system: { characterType } } : {})
        }]);
        return item?.sheet.render({ force: true });
    }
    static _viewItem(event, target) {
        return this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId)?.sheet.render({ force: true });
    }
    static async _deleteItem(event, target) {
        if (!this.isEditable) return;
        const item = this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId);
        return item?.deleteDialog();
    }
    static async _toggleItem(event, target) {
        if (!this.isEditable) return;
        const item = this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId);
        const path = target.dataset.linkedValue;
        if (item && path) return item.update({ [path]: !foundry.utils.getProperty(item, path) });
    }
    static _rollAttribute(event, target) {
        if (this.isEditable) return this.actor.rollAttribute(target.dataset.attribute, event);
    }
    static _rollItem(event, target) {
        if (this.isEditable) return this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId)?.roll(event);
    }
    static _rollArmor(event) {
        if (this.isEditable) return this.actor.RollArmor(event);
    }
    static _sendToChat(event, target) {
        if (this.isEditable) return this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId)?.sendToChat();
    }
    static _roll() {
        if (!this.isEditable) return;
        return game.myz.RollDialogV2.create({
            rollName: "MYZ.ROLL", diceRoller: new game.myz.DiceRoller(), actor: this.actor, actorUuid: this.actor.uuid
        });
    }
    static _push() {
        if (!this.isEditable) return;
        const message = [...game.messages].reverse().find(message => message.isAuthor
            && message.flags["mutant-year-zero"]?.actorUuid === this.actor.uuid
            && message.flags["mutant-year-zero"]?.dicePool);
        if (!message) return ui.notifications.info(game.i18n.localize("MYZ-ALT.NO_ROLL"));
        // Use the rendered chat controls so the system honors bullet expenditure options.
        const html = document.querySelector(`[data-message-id="${message.id}"]`) ?? document.createElement("div");
        return game.myz.DiceRoller.Push(message, html);
    }
    static _trauma(event, target) {
        if (!this.isEditable) return;
        const { attribute, index } = target.dataset;
        const trauma = Number(index) + (target.checked ? 1 : 0);
        return this.actor.update({ [`system.attributes.${attribute}.value`]: Math.max(0, this.actor.system.attributes[attribute].max - trauma) });
    }
    static _point(event, target) {
        if (!this.isEditable) return;
        const field = target.dataset.point;
        const path = field === "permanent-rot" ? "system.rot.permanent" : `system.${field}.value`;
        return this.actor.update({ [path]: Number(target.dataset.index) + (target.checked ? 1 : 0) });
    }

    async _onDropActor(event, actor) {
        if (!this.isEditable || actor.uuid === this.actor.uuid) return null;
        const existing = this.actor.items.find(i => i.type === typeRelation && i.system.actorUuid === actor.uuid);
        if (existing) { await existing.sheet.render({ force: true }); return actor; }
        const characterType = event.target.closest("[data-relation-type]")?.dataset.relationType
            ?? (actor.type === "npc" ? "npc" : "pc");
        const [item] = await this.actor.createEmbeddedDocuments("Item", [{
            name: actor.name, type: typeRelation, img: actor.img,
            system: { characterType, actorUuid: actor.uuid, role: actor.system.role ?? "" }
        }]);
        await item?.sheet.render({ force: true });
        return actor;
    }
}
