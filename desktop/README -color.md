# COMPOSANTES RELATIVES À LA COULEUR

Ceci est un fichier pour aider les membres de l'équipe à suivre les composantes reliée à la couleur

# Architecture Générale: 
- on a un color-manager : pour gérer les fonctionnalités qui ont attrait à l'aspect logique: gère principalement la conversion et le stockage de l'historique de selection des couleurs

- on a une interface RGBA: faciliter les manipulations pour les couleurs (surtout les conversion Hex<->DEC)

- on a un Enum color-order: inclut les deux choix de couleurs (primaire et secondaire) 

- on a un composant color-picker: pour le moment c'est celui là qui inclut tous les autres composants
relatifs à la couleur

-color-picker contient: 

    -color-palette: rectangle avec le gradiant pour choisir une couleur customizé
    
    -color-slider: gère le ruban qui controle l'intensité de la couleur
    
    -color-opacity: tentative pour essayer de faire un formulaire qui prend en input la valeur de alpha
    cela n'a pas fonctionné, on va surement modifier cette approche par une des deux autre alternative:
    
        * 1) essayer de faire une sorte de bouton qui glisse comme celui de l'épaisseur 
        * 2) créer un autre composant qui ressemble à color-slider et avoir un slider à coté qui gère l'opacité 
        
    -color-displayer: pour l'instant ce composant là n'a qu'une responsabilité qui est le bouton qui interchange les couleur primaire et secondaire 

# Ce qui reste à faire:
-> trouver une solution fonctionnelle pour l'opacité
-> faire fonctionner le bouton qui échange les couleur entre primaire et secondaire
-> trouver le moyen d'inclure la couleur dans un outil

# Remarques: 
-> pour des fins de test j'appelle directement le color-picker dans side-bar afin de ne pas perdre du temps sur les boutons et les pop-up 

->idéalement on voudrait avoir le mécanisme suivant: 
on choisit une icone d'outil parmi la barre laterale
on aura un deuxième menu qui s'affiche à coté celui ci contient:

 *l'épaisseur de la ligne
 *le choix du contour 
 *le choix de couleur avec un affichage de la couleur primaire et la couleur secondaire
 *quand on clique sur une des deux couleurs on va avoir l'affichage de la palette de couleur complète 
 
 (rectangle de gradiant- slider de couleur pour gerer l'intensité - slider de alpha pour gérer l'opacité-tableau pour les derniere 10 couleur choisies)

-> les parties du code ou il y a un potentiel risque d'ambiguité ont été couvert par des commentaires détaillés. 


## Resource:

* J'ai cité la référence du tutoriel fournit dans les partie de code ou il a avait été utilisé donc consulter le lien git du projet pour savoir plus sur les composantes de couleurs 

*j'ai placé des lien dans ARchitecture de couleur sur teams. (Général -> fichier OneNote)
