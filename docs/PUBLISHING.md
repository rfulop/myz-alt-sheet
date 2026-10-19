# Publier la version V14

Ces fichiers préparent la distribution ; aucune publication n’est effectuée par le script de build.

1. Relire les changements et vérifier que la branche de publication est à jour avec `main`.
2. Résoudre les points de provenance des polices dans [ASSETS.md](ASSETS.md), puis vérifier `module.json` : version, compatibilité et URLs doivent viser le même tag. Cette version utilise le tag `14.0.0`, sans préfixe `v`.
3. Compiler les styles si les sources Sass changent, puis exécuter les commandes de vérification ci-dessous.
4. Exécuter `python3 scripts/build_release.py`. Vérifier le contenu de l’archive et l’installation dans un dossier de données de test.
5. Après revue et accord pour publier, créer le tag et une release GitHub, puis joindre exactement :
   - `dist/module.json`
   - `dist/myz-alt-sheet-14.0.0.zip`
6. Vérifier que le manifeste publié est accessible et que son URL `download` permet l’installation dans Foundry.

Les URLs sont épinglées à la version V14. Conserver un manifeste distinct pour la version V11 afin de préserver son canal d’installation.

L’archive inclut la fiche, les exemples, les captures, la documentation et les licences. Elle exclut les sauvegardes, les mondes, les dépendances de développement et le compendium FR personnel.

## Commandes de développement

```sh
node node_modules/sass/sass.js styles/sass/main.scss styles/css/main.css
python3 tests/run.py
python3 tests/run.py --foundry /chemin/vers/foundry/resources/app
python3 scripts/build_release.py
```

La compilation de cette version utilise Dart Sass 1.69.5. Les dépendances de développement ne sont pas incluses dans l’archive.
