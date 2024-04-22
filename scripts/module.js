import { MutantYearZeroAlternateActorSheet } from "./ui/pcSheet.js"
import { preloadHandlebarsTemplates } from "./core/preloadTemplates.js";
import {handlebarsHelpers} from "./utils/handlebarsHelpers.js";
import {hooks} from "./hooks/hooks.js";
import RelationshipData from "./data/relationshipData.js";
import RelationshipSheet from "./ui/relationshipSheet.js";


const moduleID = "myz-alt-sheet";
export const typeRelation = `${moduleID}.relation`;


Hooks.once('init', async function() {
    Actors.registerSheet(moduleID, MutantYearZeroAlternateActorSheet, { types: ["mutant"], makeDefault: true});

    Object.assign(CONFIG.Item.dataModels, {
        [typeRelation]: RelationshipData
    });

    Items.registerSheet(moduleID, RelationshipSheet, {
        types: [typeRelation],
        makeDefault: true,
        label: 'Relationship'
    });

    await preloadHandlebarsTemplates();
    await handlebarsHelpers();
    await hooks();
});