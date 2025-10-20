## PRODUIT

### US-1: Créer un produit

En tant qu’utilisateur,  
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


### US-2: Modifier un produit


En tant qu’utilisateur
Je veux pouvoir modifier un produit,  
Afin de mettre à jour ses infos pour la vente

Règles métier :
- titre > 2
- Prix > 0
- Prix < 10 000

    - Exemple 1/ Scénario 1 :
        - Étant donné je suis identifié en tant qu’utilisateur
        - Et qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2, avec en titre "switch 3», description «nouvelle nouvelle console» et un prix à 5000e
        - Alors le produit doit être modifié

    - Exemple 2/ Scénario 2 :
        - Étant donné je suis identifié en tant qu’utilisateur
        - Et qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2 avec en titre "sw»
        - Alors une erreur doit être envoyée «titre trop courr»

    - Exemple 3/ Scénario 3 :
        - Étant donné je suis identifié en tant qu’utilisateur
        - Et qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2 avec en prix -10
        - Alors une erreur doit être envoyée "le prix doit être supérieur à 0»

    - Exemple 4/ Scénario 4 :
        - Étant donné je suis identifié en tant qu’utilisateur
        - Et qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2 avec en prix 11000
        - Alors une erreur doit être envoyée « le prix doit être inférieur à 11000 »


## Order

### US-3: Ajouter un produit à une commande

En tant qu’utilisateur,  
Je veux pouvoir ajouter un produit à une commande,  
Afin de faire un achat

Règles métier :
- max 3 produits par commande
- max 100e par commande
- max 2 fois le même produit
- si commande existante : ajoute le produit dans la commande
- si commande pas existante : créé le commande
- si produit déjà dans la commande : incrémente la quantité

    - Exemple 1/ Scénario 1 : ajout d'un produit réussi sur une nouvelle commande
        - Étant donné je suis identifié en tant qu’utilisateur
        - Et qu'il n'y a pas de commande existante
        - Quand j'ajoute un produit identifié à l'id 1, une quantité 1 et un prix à 100
        - Alors une nouvelle commande doit être créée avec avec une ligne contenant le produit 1, la quantité à 1 et un prix à 100

      - Exemple 2/ Scénario 2 : ajout d'un produit réussi sur une commande existante
          - Étant donné je suis identifié en tant qu’utilisateur
          - Et qu'il y a déjà une commmande existante avec une ligne contenant le produit 1 et une quantité à 1
          - Quand j'ajoute le produit 1 avec une quantité à 1
          - Alors la commande doit contenir une ligne avec le produit 1, la quantité à 2 et un prix total à 200


    
- Créer les exemples / scénarios pour la US 3 «créer une commande»
- implémenter chaque scénario dans le code, en respectant la screaming archi, 
- les vertical slices et le monolithe modulaire, avec un test unitaire par scénario

