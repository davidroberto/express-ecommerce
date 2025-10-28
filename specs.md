## PRODUIT

### US-1: Créer un produit

En tant qu’admin,  
Je veux pouvoir créer un produit,  
Afin de le mettre en vente

Règles métier :
- titre > 2
- Prix > 0
- Prix < 10 000

    - Exemple 1/ Scénario 1 : création réussie
        - Étant donné qu'il n'y a pas de produit enregistré
        - Quand je créé un produit avec en titre «switch 2», description «nouvelle console» et un prix à 500
        - Alors le produit doit être créé

    - Exemple 2/ Scénario 2 : création échouée, titre trop court
        - Étant donné qu'il n'y a pas de produit enregistré
        - Quand je créé un produit avec en titre «sw»
        - Alors une erreur doit être envoyée "titre trop court»

    - Exemple 3/ Scénario 3 : création échouée, prix négatif
        - Étant donné qu'il n'y a pas de produit enregistré
        - Quand je créé un produit avec en prix -10
        - Alors une erreur doit être envoyée «le prix doit être supérieur à 0»

    - Exemple 4/ Scénario 4 : création échouée, prix supérieur à 10000 
        - Étant donné qu'il n'y a pas de produit enregistré
        - Quand je créé un produit avec en prix 11000
        - Alors une erreur doit être envoyée «le prix doit être inférieur à 11000»
    - Exemple 5/ Scénario 5 : création échouée, échec de sauvegarde non prévue
      - Étant donné qu'il n'y a pas de produit enregistré
      - Quand je créé un produit, si la sauvegarde échoue
      - Alors une erreur doit être envoyée «erreur lors de la création du produit»


### US-2: Modifier un produit


En tant qu’admin,  
Je veux pouvoir modifier un produit,  
Afin de mettre à jour ses infos pour la vente

Règles métier :
- titre > 2
- Prix > 0
- Prix < 10 000

    - Exemple 1/ Scénario 1 :
        - Étant donné qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2, avec en titre "switch 3», description «nouvelle nouvelle console» et un prix à 5000e
        - Alors le produit doit être modifié

    - Exemple 2/ Scénario 2 :
        - Étant donné qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2 avec en titre "sw»
        - Alors une erreur doit être envoyée «titre trop courr»

    - Exemple 3/ Scénario 3 :
        - Étant donné qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2 avec en prix -10
        - Alors une erreur doit être envoyée "le prix doit être supérieur à 0»

    - Exemple 4/ Scénario 4 :
        - Étant donné  qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2 avec en prix 11000
        - Alors une erreur doit être envoyée « le prix doit être inférieur à 11000 »



## Order

### US-2: Ajouter un produit à une commande

En tant qu'utilisateur,  
Je veux pouvoir ajouter un produit à une commande,
Afin de commander le produit

Règles métier :
- si un produit existe déjà dans la commande, on augmente la quantité
- si le produit n'existe pas dans la commande, on l'ajoute avec une quantité de 1
- l'utilisateur doit envoyer l'id du produit et la quantité
- max 5 produits par commande
- max 2000e par commande

    - Scénario US-2-1 : ajout réussi, produit n'existe pas dans la commande
        - Étant donné qu'une commande existe avec l'identifiant 1 et qu'elle ne contient pas le produit avec l'identifiant 2
        - Quand j'ajoute le produit avec l'identifiant 2 à la commande avec l'identifiant 1 avec une quantité de 1
        - Alors le produit avec l'identifiant 2 doit être ajouté à la commande avec une quantité de 1

    - Scénario US-2-2: ajout réussi, produit existe déjà dans la commande
        - Étant donné qu'une commande existe avec l'identifiant 1 et qu'elle contient déjà le produit avec l'identifiant 2 avec une quantité de 2
        - Quand j'ajoute le produit avec l'identifiant 2 à la commande avec l'identifiant 1 avec une quantité de 1
        - Alors la quantité du produit avec l'identifiant 2 dans la commande doit être mise à jour à 3

    - Scénario US-2-3 : ajout échoué, dépassement du nombre maximum de produits
        - Étant donné qu'une commande existe avec l'identifiant 1 et qu'elle contient déjà 5 produits différents
        - Quand j'ajoute un nouveau produit à la commande avec l'identifiant 1
        - Alors une erreur doit être envoyée « nombre maximum de produits atteint »

    - Scénario US-2-4 : ajout échoué, dépassement du montant maximum de la commande
        - Étant donné qu'une commande existe avec l'identifiant 1 et que son montant total est de 1900e
        - Quand j'ajoute un produit d'une valeur de 200e à la commande avec l'identifiant 1
        - Alors une erreur doit être envoyée « montant maximum de la commande dépassé »