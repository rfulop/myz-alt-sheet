import { MutantYearZeroAlternateActorSheet } from "./ui/pcSheet.js";
import { preloadHandlebarsTemplates } from "./core/preloadTemplates.js";
import { handlebarsHelpers } from "./utils/handlebarsHelpers.js";
import { hooks } from "./hooks/hooks.js";
import RelationshipData from "./data/relationshipData.js";
import RelationshipSheet from "./ui/relationshipSheet.js";
import { MODULE_ID, typeRelation } from "./constants.js";

export { typeRelation } from "./constants.js";

Hooks.once("init", () => {
    CONFIG.Item.dataModels[typeRelation] = RelationshipData;
    CONFIG.Item.typeLabels[typeRelation] = "MYZ-ALT.RELATIONSHIPS.LABEL";
    const sheets = foundry.applications.apps.DocumentSheetConfig;
    sheets.registerSheet(foundry.documents.Actor, MODULE_ID, MutantYearZeroAlternateActorSheet, {
        types: ["mutant"], makeDefault: true, label: "MYZ-ALT.SHEET_LABEL"
    });
    sheets.registerSheet(foundry.documents.Item, MODULE_ID, RelationshipSheet, {
        types: [typeRelation], makeDefault: true, label: "MYZ-ALT.RELATIONSHIPS.LABEL"
    });
    handlebarsHelpers();
    hooks();
});
Hooks.once("setup", preloadHandlebarsTemplates);
