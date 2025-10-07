import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import type { ChildProfile, ExerciseType, DifficultyLevel } from '@/lib/types';

// Définition des types d'exercices avec leurs labels en français
const EXERCISE_TYPES: { value: ExerciseType; label: string; description: string }[] = [
  { value: 'math', label: 'Mathématiques', description: 'Calculs, problèmes mathématiques' },
  { value: 'reading', label: 'Lecture', description: 'Compréhension de textes' },
  { value: 'logic', label: 'Logique', description: 'Énigmes et casse-têtes' },
  { value: 'vocabulary', label: 'Vocabulaire', description: 'Mots et définitions' },
];

// Niveaux de difficulté
const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string }[] = [
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hard', label: 'Difficile' },
];

export default function ChildProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [child, setChild] = useState<ChildProfile | null>(null);
  
  // États du formulaire
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('medium');
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>(['math', 'reading', 'logic', 'vocabulary']);
  const [timeRewardMinutes, setTimeRewardMinutes] = useState('15');

  // Charger les données du profil enfant
  useEffect(() => {
    loadChildProfile();
  }, [id]);

  const loadChildProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/child/${id}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du profil');
      }

      const data: ChildProfile = await response.json();
      setChild(data);
      
      // Remplir le formulaire avec les données existantes
      setName(data.name);
      setAge(data.age.toString());
      setAvatar(data.avatar || '');
      setDifficultyLevel(data.difficultyLevel);
      setExerciseTypes(data.exerciseTypes);
      setTimeRewardMinutes(data.timeRewardMinutes.toString());
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de charger le profil de l\'enfant');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements de préférences d'exercices
  const toggleExerciseType = (type: ExerciseType) => {
    setExerciseTypes((prev) => {
      if (prev.includes(type)) {
        // Ne pas permettre de tout décocher
        if (prev.length === 1) {
          Alert.alert(
            'Attention',
            'Au moins un type d\'exercice doit être sélectionné'
          );
          return prev;
        }
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom est requis');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 6 || ageNum > 14) {
      Alert.alert('Erreur', 'L\'âge doit être entre 6 et 14 ans');
      return;
    }

    const timeReward = parseInt(timeRewardMinutes);
    if (isNaN(timeReward) || timeReward < 5 || timeReward > 60) {
      Alert.alert('Erreur', 'Le temps de récompense doit être entre 5 et 60 minutes');
      return;
    }

    if (exerciseTypes.length === 0) {
      Alert.alert('Erreur', 'Au moins un type d\'exercice doit être sélectionné');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/child/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          age: ageNum,
          avatar: avatar || null,
          difficultyLevel,
          exerciseTypes,
          timeRewardMinutes: timeReward,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erreur lors de la sauvegarde');
      }

      Alert.alert(
        'Succès',
        'Les modifications ont été enregistrées avec succès',
        [
          {
            text: 'OK',
            onPress: () => loadChildProfile(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', error.message || 'Impossible de sauvegarder les modifications');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!child) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Profil enfant non trouvé</Text>
        <Button mode="contained" onPress={() => router.back()}>
          Retour
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Section: Informations de base */}
        <Text style={styles.sectionTitle}>Informations de base</Text>
        
        <TextInput
          label="Nom de l'enfant *"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Âge (6-14 ans) *"
          value={age}
          onChangeText={setAge}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Section: Préférences d'exercices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences d'exercices</Text>
          <Text style={styles.sectionDescription}>
            Sélectionnez les types d'exercices que votre enfant recevra.
            Au moins un type doit être sélectionné.
          </Text>

          {EXERCISE_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={styles.checkboxContainer}
              onPress={() => toggleExerciseType(type.value)}
              activeOpacity={0.7}
            >
              <Checkbox
                status={exerciseTypes.includes(type.value) ? 'checked' : 'unchecked'}
                onPress={() => toggleExerciseType(type.value)}
                color="#4A90E2"
              />
              <View style={styles.checkboxLabelContainer}>
                <Text style={styles.checkboxLabel}>{type.label}</Text>
                <Text style={styles.checkboxDescription}>{type.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section: Niveau de difficulté */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Niveau de difficulté</Text>
          <View style={styles.difficultyContainer}>
            {DIFFICULTY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.difficultyButton,
                  difficultyLevel === level.value && styles.difficultyButtonActive,
                ]}
                onPress={() => setDifficultyLevel(level.value)}
              >
                <Text
                  style={[
                    styles.difficultyButtonText,
                    difficultyLevel === level.value && styles.difficultyButtonTextActive,
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section: Temps de récompense */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temps de récompense</Text>
          <Text style={styles.sectionDescription}>
            Minutes de temps d'écran gagnées par exercice complété (5-60 minutes)
          </Text>
          <TextInput
            label="Minutes par exercice *"
            value={timeRewardMinutes}
            onChangeText={setTimeRewardMinutes}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Bouton de sauvegarde */}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>

        {/* Bouton annuler */}
        <Button
          mode="outlined"
          onPress={() => router.back()}
          disabled={saving}
          style={styles.cancelButton}
        >
          Annuler
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
    lineHeight: 20,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  checkboxLabelContainer: {
    flex: 1,
    marginLeft: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
  },
  checkboxDescription: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 2,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E1E8ED',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  difficultyButtonActive: {
    borderColor: '#4A90E2',
    backgroundColor: '#E3F2FD',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  difficultyButtonTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 8,
    backgroundColor: '#4A90E2',
  },
  cancelButton: {
    marginTop: 12,
    marginBottom: 32,
  },
});