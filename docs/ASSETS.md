# Éléments graphiques et polices à vérifier avant publication

Le fichier `LICENSE` reprend la GPL v3 déjà présente sur `origin/main` pour le code. Il ne remplace pas les licences des ressources tierces.

- **Big Noodle Titling** : déjà embarquée dans la version d’origine. Le fichier `fonts/big_noodle_titling/Sentinel_Type_Freefont_EULA.txt`, section USE (iii), mentionne un consentement écrit préalable pour la redistribution et la mise en ligne. Vérifier si cette autorisation existe avant de republier ces fichiers. Une autre possibilité technique est d’utiliser la police déjà chargée par le système MYZ requis, sans en embarquer une nouvelle copie ; cette adaptation n’a pas été faite dans cette préparation.
- **Arvo-Regular-MYZ.ttf** : la police embarquée porte le copyright Anton Koovit (2010), mais aucun texte de licence n’accompagne cette variante locale. Le projet Arvo est publié sous [SIL OFL 1.1 dans Google Fonts](https://github.com/google/fonts/blob/main/ofl/arvo/OFL.txt). Cela ne suffit pas à établir la provenance des éventuelles modifications de cette variante MYZ. Retrouver sa provenance et les notices applicables avant publication.
- **Karla et texture de fond** : chargées par le système MYZ installé, sans nouvelle copie ajoutée au module.
- **Armure de fortune, Fusil de chasse et Jumelles de Nox** : illustrations originales générées, décrites dans [ITEM-ARTWORK.md](ITEM-ARTWORK.md).
- **Lampe-torche et Carte de la Zone** : illustrations originales générées, décrites dans [EXPLORATION-ARTWORK.md](EXPLORATION-ARTWORK.md).
- **Portrait de Nox** : génération originale décrite dans [ARTWORK.md](ARTWORK.md).
- **Captures du README** : réalisées dans Foundry 14.369 et MYZ 14.0.4 avec le personnage fictif fourni. Elles montrent aussi des éléments du système ; le JSON public n’embarque pas les descriptions de règles du compendium personnel.

La typographie validée a été conservée pendant cette préparation. Ces vérifications de provenance restent à régler avant la distribution publique de l’archive.
