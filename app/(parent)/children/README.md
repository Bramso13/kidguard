# Gestion des Profils Enfants - Story 2.4 (LES-79)

## Vue d'ensemble

Cette fonctionnalité implémente la Story 2.4 du PRD : Formulaire d'ajout/édition des profils enfants.

## Structure des fichiers

```
app/(parent)/children/
├── index.tsx            # Liste des profils enfants
├── [id].tsx             # Formulaire d'ajout/édition
└── README.md            # Cette documentation

app/api/child/
├── profile+api.ts       # GET (liste) et POST (création)
└── [id]+api.ts          # GET, PUT, DELETE pour un enfant spécifique
```

## Routes API

### GET /api/child/profile
Liste tous les enfants du parent authentifié.

**Réponse:**
```json
[
  {
    "id": "uuid",
    "parentId": "uuid",
    "name": "Sophie",
    "age": 8,
    "avatar": "🦄",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/child/profile
Crée un nouveau profil enfant.

**Body:**
```json
{
  "name": "Sophie",
  "age": 8,
  "avatar": "🦄"
}
```

### GET /api/child/[id]
Récupère un profil enfant spécifique.

### PUT /api/child/[id]
Met à jour un profil enfant.

### DELETE /api/child/[id]
Supprime un profil enfant.

## Critères d'acceptation ✅

1. ✅ Formulaire créé à `/app/(parent)/children/[id].tsx`
2. ✅ Champs du formulaire :
   - Nom de l'enfant (requis)
   - Âge (requis, dropdown 6-14)
   - Sélection d'avatar (optionnel)
3. ✅ Route API créée : `/app/api/child/profile+api.ts` (POST, GET)
4. ✅ Route API pour enfant spécifique : `/app/api/child/[id]+api.ts` (GET, PUT, DELETE)
5. ✅ Schéma Prisma avec modèle ChildProfile
6. ✅ Sauvegarde en base de données via API
7. ✅ Redirection vers la liste après succès
8. ✅ Bouton de suppression en mode édition
9. ✅ Dialog de confirmation pour la suppression
10. ✅ Messages de validation et labels en français

## Intégration avec l'architecture existante

- Ajout d'un onglet "Enfants" dans le layout Tabs parent
- Utilisation des composants React Native Paper existants
- Intégration avec le système de traduction i18n
- Respect du theme et des couleurs parent (blues/greens)

## Sécurité

- ✅ Authentification requise via Better Auth
- ✅ Vérification de propriété parent-enfant
- ✅ Validation des données entrantes
- ✅ Protection CSRF via API routes Expo
- ✅ Cascade delete : si un parent est supprimé, ses enfants le sont aussi

## Localisation

Toutes les chaînes de caractères en français dans `locales/fr.json`

## Tests recommandés

1. **Création d'enfant**
2. **Édition d'enfant**
3. **Suppression avec confirmation**
4. **Validation des champs**
5. **Sécurité et permissions**