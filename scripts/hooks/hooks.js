import { MODULE_ID, typeRelation } from "../constants.js";

export function hooks() {
    Hooks.on("preCreateItem", (item) => {
        if (item.type !== typeRelation) return;
        const kind = item.system.characterType === "pc" ? "PC" : "NPC";
        const update = { img: item.img === "icons/svg/item-bag.svg" ? `modules/${MODULE_ID}/assets/ico/relation.svg` : item.img };
        if (!item.name || item.name === typeRelation) update.name = game.i18n.localize(`MYZ-ALT.RELATIONSHIPS.${kind}.NEW`);
        item.updateSource(update);
    });
}
