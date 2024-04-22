export async function hooks() {
    Hooks.on('preCreateItem', async (item, updateData, options) => {
        if (item.type === 'myz-alt-sheet.relation') {
            const charType = updateData.system.charactertype;
            const newName = charType === 'npc' ? game.i18n.localize("MYZ-ALT.RELATIONSHIPS.PC.NEW") : game.i18n.localize("MYZ-ALT.RELATIONSHIPS.NPC.NEW");

            if (charType === 'npc' || charType === 'pc') {
                await item.updateSource({
                    "img": 'modules/myz-alt-sheet/assets/ico/relation.svg',
                    "name": newName,
                    "system.characterType": charType
                });
            }
        }
    });

    Hooks.on("renderActorSheet", async (app, html, data) => {
        let updateData = {};
        updateData = updateIfEmpty(app.actor.system, updateData, {
            appearance: ['face', 'body', 'clothing'],
            relationships: ['dream', 'hate', 'protect'],
            den: ['description'],
            notes: ''
        });

        if (Object.keys(updateData).length > 0) {
            await app.actor.update(updateData);
        }
        return true;
    });
}

function updateIfEmpty(actorSystem, updateData, attributesToUpdate) {
    Object.entries(attributesToUpdate).forEach(([category, attributes]) => {
        if (!actorSystem[category]) {
            actorSystem[category] = {};
            if (Array.isArray(attributes)) {
                attributes.forEach(attr => {
                    actorSystem[category][attr] = '';
                });
            } else {
                actorSystem[category] = attributes;
            }
        } else if (Array.isArray(attributes)) {
            attributes.forEach(attr => {
                if (!actorSystem[category][attr]) {
                    updateData[`system.${category}.${attr}`] = '';
                }
            });
        }
    });
    return updateData;
}