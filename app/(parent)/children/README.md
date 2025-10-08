# Gestion des Profils Enfants

## Vue d'ensemble

Cette fonctionnalité implémente la Story 2.4 du PRD : Formulaire d'ajout/édition des profils enfants.

## Structure des fichiers

```
app/(parent)/children/
├── _layout.tsx          # Layout avec navigation et thème
├── index.tsx            # Liste des profils enfants
├── [id].tsx             # Formulaire d'ajout/édition
└── README.md            # Cette documentation
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

**Body:** (tous les champs sont optionnels)
```json
{
  "name": "Sophie",
  "age": 9,
  "avatar": "🦁"
}
```

### DELETE /api/child/[id]
Supprime un profil enfant.

## Critères d'acceptation ✅

1. ✅ Formulaire créé à `/app/(parent)/children/[id].tsx`
2. ✅ Champs du formulaire :
   - Nom de l'enfant (requis)
   - Âge (requis, dropdown 6-14)
   - Sélection d'avatar (optionnel)
3. ✅ Route API créée : `/app/api/child/profile+api.ts` (POST, PUT)
4. ✅ Route API pour enfant spécifique : `/app/api/child/[id]+api.ts` (GET, PUT, DELETE)
5. ✅ Schéma Prisma avec modèle ChildProfile
6. ✅ Sauvegarde en base de données via API
7. ✅ Redirection vers la liste après succès
8. ✅ Bouton de suppression en mode édition
9. ✅ Dialog de confirmation pour la suppression
10. ✅ Messages de validation et labels en français

## Validation

### Côté Client
- Nom requis (non vide après trim)
- Âge requis entre 6 et 14 ans
- Messages d'erreur en français

### Côté Serveur
- Vérification d'authentification parent
- Validation des données
- Vérification de propriété (le parent doit posséder l'enfant)

## Sécurité

- ✅ Authentification requise via Better Auth
- ✅ Vérification de propriété parent-enfant
- ✅ Validation des données entrantes
- ✅ Protection CSRF via API routes Expo
- ✅ Cascade delete : si un parent est supprimé, ses enfants le sont aussi

## Localisation

Toutes les chaînes de caractères sont en français :
- Labels de formulaire
- Messages d'erreur
- Messages de confirmation
- Titres et descriptions

## UI/UX

### Interface Parent (mode calme)
- Couleurs : Bleus (#1976d2) et verts
- Design : Professionnel et rassurant
- Composants : React Native Paper

### Fonctionnalités
- Liste avec avatars et informations de base
- Bouton FAB pour ajouter un enfant
- Cards cliquables pour éditer
- Sélection d'avatar avec emojis
- Menu dropdown pour l'âge
- Confirmation de suppression

## Tests recommandés

1. **Création**
   - [ ] Créer un enfant avec nom et âge
   - [ ] Créer un enfant avec avatar
   - [ ] Validation : nom vide
   - [ ] Validation : âge manquant
   - [ ] Validation : âge hors limites

2. **Édition**
   - [ ] Modifier le nom
   - [ ] Modifier l'âge
   - [ ] Modifier l'avatar
   - [ ] Annuler les modifications

3. **Suppression**
   - [ ] Supprimer un enfant
   - [ ] Annuler la suppression
   - [ ] Vérifier la cascade delete

4. **Sécurité**
   - [ ] Accès sans authentification (doit échouer)
   - [ ] Éditer un enfant d'un autre parent (doit échouer)
   - [ ] Supprimer un enfant d'un autre parent (doit échouer)

## Prochaines étapes

Cette implémentation couvre les bases de la Story 2.4. Les stories suivantes ajouteront :
- Préférences d'exercices (Story 2.5)
- Configuration de difficulté et récompenses (Story 2.6)
- Liste d'applications bloquées (Story 2.7)