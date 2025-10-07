# Guide de Démarrage Rapide - LES-81

## 🚀 Configuration Initiale

### 1. Configuration de l'Environnement

Créez un fichier `.env` à la racine du projet:

```bash
cp .env.example .env
```

Modifiez `.env` avec vos informations de base de données PostgreSQL:

```env
DATABASE_URL_PRISMA_MIGRATION="postgresql://user:password@localhost:5432/kidguard"
DATABASE_URL="postgresql://user:password@localhost:5432/kidguard"
```

### 2. Installation des Dépendances

Si ce n'est pas déjà fait:

```bash
npm install
```

### 3. Génération du Client Prisma et Migrations

```bash
# Générer le client Prisma avec les nouveaux modèles
npx prisma generate

# Créer et appliquer la migration
npx prisma migrate dev --name add_child_profile_and_settings

# Vérifier que la migration s'est bien passée
npx prisma studio
```

## 📱 Test de l'Interface

### Démarrer l'Application

```bash
npm start
```

### Accéder à l'Écran de Profil Enfant

#### Créer un Nouveau Profil

Naviguez vers: `/app/(parent)/children/new`

Ou utilisez le code suivant dans votre navigation:

```typescript
import { router } from 'expo-router';

// Pour créer un nouveau profil
router.push('/children/new');
```

#### Modifier un Profil Existant

```typescript
import { router } from 'expo-router';

// Pour modifier un profil existant
router.push(`/children/${childId}`);
```

## 🧪 Scénarios de Test

### Scénario 1: Création avec Sélection Automatique de Difficulté

1. Naviguez vers `/children/new`
2. Entrez le prénom: "Sophie"
3. Entrez l'âge: "7"
4. **Vérifiez** que "Facile" est automatiquement sélectionné
5. Laissez le temps de récompense à "15" minutes
6. Cliquez sur "Créer le profil"
7. **Résultat attendu**: Profil créé avec difficulté = easy

### Scénario 2: Modification de l'Âge Change la Difficulté

1. Naviguez vers `/children/new`
2. Entrez l'âge: "7" → **Vérifiez "Facile"**
3. Changez l'âge à: "10" → **Vérifiez "Moyen"**
4. Changez l'âge à: "13" → **Vérifiez "Difficile"**

### Scénario 3: Modification Manuelle de la Difficulté

1. Naviguez vers `/children/new`
2. Entrez l'âge: "7" (difficulté auto = Facile)
3. Cliquez sur le bouton "Difficile"
4. **Vérifiez** que "Difficile" reste sélectionné même avec âge = 7
5. Créez le profil
6. **Résultat attendu**: Profil créé avec difficulté = hard

### Scénario 4: Validation du Temps de Récompense

1. Naviguez vers `/children/new`
2. Entrez prénom et âge valides
3. **Test 1**: Entrez temps = "3" → Soumettez
   - **Attendu**: Erreur "Le temps doit être entre 5 et 60 minutes"
4. **Test 2**: Entrez temps = "65" → Soumettez
   - **Attendu**: Erreur "Le temps doit être entre 5 et 60 minutes"
5. **Test 3**: Entrez temps = "30" → Soumettez
   - **Attendu**: Succès

### Scénario 5: Validation de l'Âge

1. Naviguez vers `/children/new`
2. **Test 1**: Entrez âge = "5" → Soumettez
   - **Attendu**: Erreur "L'âge doit être entre 6 et 14 ans"
3. **Test 2**: Entrez âge = "15" → Soumettez
   - **Attendu**: Erreur "L'âge doit être entre 6 et 14 ans"
4. **Test 3**: Entrez âge = "10" → Soumettez
   - **Attendu**: Succès

### Scénario 6: Persistance des Données

1. Créez un profil avec les paramètres suivants:
   - Prénom: "Lucas"
   - Âge: 10
   - Difficulté: Difficile (modifié manuellement)
   - Temps: 20 minutes
2. Notez l'ID du profil créé
3. Naviguez vers `/children/{id}`
4. **Vérifiez** que toutes les données sont correctement affichées:
   - Prénom: "Lucas"
   - Âge: 10
   - Difficulté: "Difficile" sélectionné
   - Temps: "20"

### Scénario 7: Modification d'un Profil Existant

1. Chargez un profil existant
2. Modifiez l'âge de 10 à 12
3. **Vérifiez** que la difficulté passe à "Difficile"
4. Changez le temps de récompense à 25 minutes
5. Cliquez sur "Sauvegarder"
6. Rechargez le profil
7. **Vérifiez** que les modifications sont persistées

## 🔍 Vérification en Base de Données

### Avec Prisma Studio

```bash
npx prisma studio
```

1. Ouvrez la table `child_profiles`
2. Vérifiez que les enregistrements sont créés correctement
3. Vérifiez les champs:
   - `difficultyLevel`: EASY, MEDIUM, ou HARD
   - `timeRewardMinutes`: valeur entre 5 et 60
   - `age`: valeur entre 6 et 14

### Requête SQL Directe

```sql
-- Voir tous les profils enfants
SELECT id, name, age, "difficultyLevel", "timeRewardMinutes", "createdAt"
FROM child_profiles
ORDER BY "createdAt" DESC;

-- Vérifier les contraintes
SELECT 
  name,
  age,
  "difficultyLevel",
  CASE 
    WHEN age BETWEEN 6 AND 8 AND "difficultyLevel" = 'EASY' THEN '✅ Auto-sélection correcte'
    WHEN age BETWEEN 9 AND 11 AND "difficultyLevel" = 'MEDIUM' THEN '✅ Auto-sélection correcte'
    WHEN age BETWEEN 12 AND 14 AND "difficultyLevel" = 'HARD' THEN '✅ Auto-sélection correcte'
    ELSE '⚠️ Difficulté modifiée manuellement'
  END as status
FROM child_profiles;
```

## 🐛 Dépannage

### Erreur: "Environment variable not found: DATABASE_URL"

**Solution**: Vérifiez que le fichier `.env` existe et contient `DATABASE_URL`

```bash
# Vérifier
cat .env | grep DATABASE_URL

# Si absent, l'ajouter
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/kidguard"' >> .env
```

### Erreur: "Prisma Client not generated"

**Solution**: Générer le client

```bash
npx prisma generate
```

### Erreur: "Table child_profiles does not exist"

**Solution**: Exécuter les migrations

```bash
npx prisma migrate dev
```

### L'écran ne se charge pas

**Solution**: Vérifier les logs et la structure des routes

```bash
# Vérifier que le fichier existe
ls -la app/\(parent\)/children/\[id\].tsx

# Redémarrer l'application
npm start -- --clear
```

## 📊 Vérification des Endpoints API

### Test avec curl

#### Créer un Profil

```bash
curl -X POST http://localhost:8081/api/child/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestChild",
    "age": 10,
    "difficultyLevel": "medium",
    "timeRewardMinutes": 15
  }'
```

**Réponse attendue**: 201 Created avec les données du profil

#### Récupérer un Profil

```bash
curl http://localhost:8081/api/child/{id}
```

**Réponse attendue**: 200 OK avec les données du profil

#### Mettre à Jour un Profil

```bash
curl -X PUT http://localhost:8081/api/child/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "age": 12,
    "difficultyLevel": "hard",
    "timeRewardMinutes": 20
  }'
```

**Réponse attendue**: 200 OK avec les données mises à jour

## ✅ Checklist de Validation Finale

- [ ] Variables d'environnement configurées
- [ ] Client Prisma généré
- [ ] Migrations appliquées
- [ ] Application démarre sans erreur
- [ ] Écran `/children/new` accessible
- [ ] Sélection automatique de difficulté fonctionne
- [ ] Validation côté client fonctionne
- [ ] Validation côté serveur fonctionne
- [ ] Création de profil réussit
- [ ] Données persistées en BDD
- [ ] Modification de profil fonctionne
- [ ] Tous les textes sont en français

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifiez les logs de l'application
2. Vérifiez les logs de la base de données
3. Consultez la documentation complète dans `docs/IMPLEMENTATION_LES-81.md`
4. Vérifiez que toutes les dépendances sont installées

## 🎉 Prochaines Étapes

Une fois les tests validés:

1. Intégrer l'authentification Better Auth (décommenter le code dans les API routes)
2. Créer l'écran de liste des enfants
3. Implémenter l'écran de sélection des types d'exercices
4. Ajouter les tests automatisés

---

**Date**: 2025-10-07  
**Ticket**: LES-81  
**Statut**: ✅ Implémentation Complète