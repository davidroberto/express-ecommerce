# User stories

## Order


### US-1: **Cumuler les quantités pour un même article dans le panier**

En tant que client,  
Je veux pouvoir ajouter plusieurs fois le même article à mon panier,  
Afin de voir la quantité s'additionner plutôt que de multiplier les lignes

  - AC-1 (Exemple 1/ Scénario 1) : 
    - Étant donné que je n'ai pas de produits dans mon panier,
    - Quand j'ajoute un produit avec le SKU « ABC123 » avec la quantité 1, 
    - Alors le panier contient le produit avec le SKU « ABC123 » × 1.


  - AC-2 (Exemple 2 / Scénario 2) :
    - Étant donné un panier contenant un produit avec le sku « ABC123 » × 1,
    - Quand j'ajoute encore « ABC123 » avec la quantité 2, 
    - Alors le panier contient « ABC123 » × 3 (et toujours une seule ligne).




### US-2: **Valider un panier**

En tant que client,  
Je veux pouvoir valider mon panier  
Afin de pouvoir confirmer mon intention d'achat

- AC-1 (Exemple 1/ Scénario 1) :
    - Étant donné j'ai un panier contenant 1 produit avec le SKU « ABC123 » avec la quantité 1,
    - Quand je valide le panier,
    - Alors le panier doit avoir le statut "validé"

- AC-2 (Exemple 2/ Scénario 2) :
    - Étant donné j'ai un panier validé
    - Quand je valide le panier,
    - Alors je dois avoir une erreur "le panier est déjà validé"