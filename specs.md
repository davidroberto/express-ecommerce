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

    - Exemple 3/ Scénario 3 :
        - Étant donné qu'il n'y a pas de produit enregistré
        - Quand je créé un produit avec en prix -10
        - Alors une erreur doit être envoyée « le prix doit être supérieur à 0 »

    - Exemple 4/ Scénario 4 :
        - Étant donné qu'il n'y a pas de produit enregistré
        - Quand je créé un produit avec en prix 11000
        - Alors une erreur doit être envoyée « le prix doit être inférieur à 11000 »


### US-2: Modifier un produit


En tant qu’admin,  
Je veux pouvoir modifier un produit,  
Afin de mettre à jour ses infos pour la vente

Règles métier :
- titre > 2
- Prix > 0
- Prix < 10 000

    - Exemple 1/ Scénario 1 :
        - Étant donné je suis identifié en tant qu’admin
        - Et qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2, avec en titre "switch 3», description «nouvelle nouvelle console» et un prix à 5000e
        - Alors le produit doit être modifié

    - Exemple 2/ Scénario 2 :
        - Étant donné je suis identifié en tant qu’admin
        - Et qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2 avec en titre "sw»
        - Alors une erreur doit être envoyée «titre trop courr»

    - Exemple 3/ Scénario 3 :
        - Étant donné je suis identifié en tant qu’admin
        - Et qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2 avec en prix -10
        - Alors une erreur doit être envoyée "le prix doit être supérieur à 0»

    - Exemple 4/ Scénario 4 :
        - Étant donné je suis identifié en tant qu’admin
        - Et qu’un produit existe avec l’identifiant 2
        - Quand je modifie le produit avec l’identifiant 2 avec en prix 11000
        - Alors une erreur doit être envoyée « le prix doit être inférieur à 11000 »