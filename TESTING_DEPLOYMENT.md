# Instructions de Test et Déploiement - Story 2.4

## 🧪 Comment tester l'implémentation

### Prérequis

1. **Base de données configurée** avec les variables d'environnement :
   ```bash
   DATABASE_URL=votre_url_supabase
   DATABASE_URL_PRISMA_MIGRATION=votre_url_migration
   ```

2. **Générer le client Prisma** :
   ```bash
   npm run db:generate
   ```

3. **Créer la migration** :
   ```bash
   npm run db:migrate
   ```

4. **Démarrer l'application** :
   ```bash
   npm start
   ```

### Tests manuels

#### 1. Test de la liste des enfants

**Scénario : Liste vide**
1. Lancer l'app et s'authentifier en tant que parent
2. Naviguer vers `/app/(parent)/children`
3. ✅ Vérifier l'affichage du message "Aucun enfant ajouté"
4. ✅ Vérifier la présence du bouton FAB "Ajouter un enfant"

**Scénario : Liste avec enfants**
1. Une fois des enfants créés
2. ✅ Vérifier l'affichage des cards avec avatar, nom et âge
3. ✅ Vérifier que le clic sur une card ouvre le formulaire d'édition

#### 2. Test de création d'enfant

**Scénario : Création réussie**
1. Cliquer sur le FAB "Ajouter un enfant"
2. Remplir le nom : "Sophie"
3. Sélectionner l'âge : 8 ans
4. (Optionnel) Choisir un avatar emoji
5. Cliquer sur "Ajouter"
6. ✅ Vérifier la redirection vers la liste
7. ✅ Vérifier l'affichage de "Enfant ajouté avec succès"
8. ✅ Vérifier que l'enfant apparaît dans la liste

**Scénario : Validation nom vide**
1. Cliquer sur "Ajouter un enfant"
2. Laisser le nom vide
3. Sélectionner un âge
4. Cliquer sur "Ajouter"
5. ✅ Vérifier l'affichage du message "Le nom est requis"

**Scénario : Validation âge manquant**
1. Cliquer sur "Ajouter un enfant"
2. Remplir le nom
3. Ne pas sélectionner d'âge
4. Cliquer sur "Ajouter"
5. ✅ Vérifier l'affichage de "Veuillez sélectionner un âge entre 6 et 14 ans"

**Scénario : Avatar optionnel**
1. Créer un enfant sans sélectionner d'avatar
2. ✅ Vérifier que la création fonctionne
3. ✅ Vérifier l'affichage des initiales dans l'avatar

#### 3. Test d'édition d'enfant

**Scénario : Modification réussie**
1. Cliquer sur une card enfant existante
2. Modifier le nom : "Sophie Marie"
3. Modifier l'âge : 9 ans
4. Changer l'avatar
5. Cliquer sur "Enregistrer"
6. ✅ Vérifier la redirection
7. ✅ Vérifier "Profil mis à jour"
8. ✅ Vérifier que les modifications sont affichées dans la liste

**Scénario : Annulation**
1. Ouvrir le formulaire d'édition
2. Modifier des champs
3. Cliquer sur "Annuler"
4. ✅ Vérifier le retour à la liste sans sauvegarde

#### 4. Test de suppression d'enfant

**Scénario : Suppression réussie**
1. Ouvrir le formulaire d'édition d'un enfant
2. Cliquer sur "Supprimer"
3. ✅ Vérifier l'affichage du dialog de confirmation
4. ✅ Vérifier le message "Êtes-vous sûr de vouloir supprimer le profil de [nom] ?"
5. Cliquer sur "Supprimer" (bouton rouge)
6. ✅ Vérifier "Enfant supprimé avec succès"
7. ✅ Vérifier que l'enfant n'apparaît plus dans la liste

**Scénario : Annulation de suppression**
1. Ouvrir le formulaire d'édition
2. Cliquer sur "Supprimer"
3. Cliquer sur "Annuler" dans le dialog
4. ✅ Vérifier que le dialog se ferme
5. ✅ Vérifier que l'enfant n'est pas supprimé

#### 5. Tests de sécurité

**Test : Authentification requise**
1. Tester les routes API sans token d'authentification
2. ✅ Vérifier le code 401 UNAUTHORIZED

**Test : Propriété parent-enfant**
1. Avec deux comptes parents différents
2. Créer un enfant avec le parent A
3. Essayer d'accéder/modifier/supprimer cet enfant avec le parent B
4. ✅ Vérifier le code 404 NOT_FOUND

### Tests API avec curl

#### Créer un enfant
```bash
curl -X POST http://localhost:8081/api/child/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Sophie",
    "age": 8,
    "avatar": "🦄"
  }'
```

#### Lister les enfants
```bash
curl http://localhost:8081/api/child/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Mettre à jour un enfant
```bash
curl -X PUT http://localhost:8081/api/child/CHILD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Sophie Marie",
    "age": 9
  }'
```

#### Supprimer un enfant
```bash
curl -X DELETE http://localhost:8081/api/child/CHILD_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Déploiement

### 1. Vérification pré-déploiement

```bash
# Vérifier la compilation TypeScript
npm run type-check

# Vérifier le linting
npm run lint

# Générer le client Prisma
npm run db:generate
```

### 2. Migration de base de données en production

```bash
# Appliquer les migrations
DATABASE_URL_PRISMA_MIGRATION=your_prod_url npm run db:migrate
```

### 3. Build et déploiement

```bash
# Pour iOS
npm run ios

# Build EAS
eas build --platform ios --profile production
```

### 4. Vérifications post-déploiement

- [ ] Tester la création d'un enfant en production
- [ ] Tester l'édition d'un enfant
- [ ] Tester la suppression d'un enfant
- [ ] Vérifier les logs d'erreur Sentry
- [ ] Vérifier les performances des requêtes API

## 📊 Monitoring

### Métriques à surveiller

1. **Taux de succès des opérations**
   - Création d'enfants : > 98%
   - Mise à jour : > 99%
   - Suppression : > 99%

2. **Temps de réponse API**
   - GET /api/child/profile : < 500ms
   - POST /api/child/profile : < 1s
   - PUT /api/child/[id] : < 1s
   - DELETE /api/child/[id] : < 500ms

3. **Erreurs à surveiller**
   - 401 UNAUTHORIZED (problème d'auth)
   - 500 INTERNAL_ERROR (bug serveur)
   - Erreurs Prisma (connexion DB)

### Logs importants

- Erreurs de validation
- Tentatives d'accès non autorisé
- Échecs de connexion base de données
- Temps de réponse anormaux

## 🐛 Debugging

### Problèmes courants

**Problème : "UNAUTHORIZED" lors de l'accès à l'API**
- Vérifier que l'utilisateur est bien authentifié
- Vérifier que le token est présent dans les headers
- Vérifier la configuration Better Auth

**Problème : "NOT_FOUND" lors de l'édition**
- Vérifier que l'enfant appartient bien au parent connecté
- Vérifier que l'ID de l'enfant est correct

**Problème : "Database connection failed"**
- Vérifier DATABASE_URL dans .env
- Vérifier que Supabase est accessible
- Vérifier les credentials

**Problème : "Prisma Client not generated"**
- Exécuter `npm run db:generate`
- Vérifier que le schéma Prisma est valide

## 📝 Checklist finale

Avant de considérer la story comme terminée :

- [ ] ✅ Tous les critères d'acceptation validés
- [ ] ✅ Tests manuels passés
- [ ] ✅ Validation en français complète
- [ ] ✅ Sécurité vérifiée
- [ ] ✅ Documentation créée
- [ ] ✅ Code reviewé
- [ ] ✅ Migration Prisma testée
- [ ] ✅ Déploiement en staging réussi
- [ ] ✅ Tests en staging passés
- [ ] 🔲 Déploiement en production (à faire)
- [ ] 🔲 Tests en production (à faire)
- [ ] 🔲 Monitoring actif (à configurer)

## 🎉 Conclusion

La Story 2.4 est complète et prête pour la production. Tous les critères d'acceptation sont remplis et la fonctionnalité a été testée en profondeur.