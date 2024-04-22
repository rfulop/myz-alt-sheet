export const preloadHandlebarsTemplates = async function() {

    // Define template paths to load
    const templatePaths = [

        // Actor Sheet Partials
        "modules/myz-alt-sheet/templates/actor/actor-sheet.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/character-header.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/armor-header.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/attributes.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/appearance.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/conditions.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/skills.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/rot.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/permanent-rot.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/experience.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/abilities.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/resource-points.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/gear.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/armors.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/weapons.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/relationships.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/people.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/artifacts.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/encumbrance.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/consumables.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/den.hbs",
        "modules/myz-alt-sheet/templates/actor/partials/notes.hbs",

        "modules/myz-alt-sheet/templates/item/relation-sheet.hbs",
        ]


    // Load the template parts
    return await loadTemplates(templatePaths);
};