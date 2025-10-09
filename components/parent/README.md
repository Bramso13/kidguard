# Composants Parent

Ce dossier contient les composants React Native spécifiques au mode parent de KidGuard.

## Composants

### PhoneSharingButton
Bouton de partage de téléphone pour activer le mode enfant.

**Caractéristiques:**
- Taille minimum 60x60pt (répond aux exigences d'accessibilité)
- Couleur distinctive (orange chaud #FF9A3C)
- Affiche l'avatar de l'enfant ou initiale
- Affiche les statistiques rapides (étoiles, streak)
- Animation et feedback visuel

**Props:**
- `child: ChildProfile` - Profil de l'enfant
- `onPress: () => void` - Callback appelé lors du clic

### DashboardStats
Affiche les statistiques du tableau de bord.

**Affiche:**
- Nombre d'enfants
- Exercices complétés aujourd'hui
- Temps total gagné aujourd'hui

**Props:**
- `stats.childrenCount: number`
- `stats.totalExercisesToday: number`
- `stats.totalTimeEarnedToday: number` (en minutes)

### ConfirmationDialog
Dialogue modal de confirmation avant l'activation du mode enfant.

**Caractéristiques:**
- Message personnalisé avec nom de l'enfant
- Avertissement sur le code PIN
- Actions Annuler/Activer

**Props:**
- `visible: boolean`
- `childName: string`
- `onConfirm: () => void`
- `onCancel: () => void`

## Design System

### Couleurs Parent Mode
- **Primaire:** #2C5F7C (Bleu apaisant)
- **Arrière-plan:** #F5F7FA (Gris clair)
- **Accent:** #FF9A3C (Orange pour mode enfant)

### Typography
- **Titre:** 32px, bold
- **Section:** 20px, semi-bold
- **Corps:** 16px, regular
- **Label:** 14px, regular