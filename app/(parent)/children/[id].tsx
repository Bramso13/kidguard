import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DifficultyLevel, ChildProfile } from '@/lib/types';

/**
 * Détermine le niveau de difficulté par défaut basé sur l'âge de l'enfant
 * 6-8 ans: Facile
 * 9-11 ans: Moyen
 * 12-14 ans: Difficile
 */
const getDefaultDifficultyForAge = (age: number): DifficultyLevel => {
  if (age >= 6 && age <= 8) return 'easy';
  if (age >= 9 && age <= 11) return 'medium';
  if (age >= 12 && age <= 14) return 'hard';
  return 'medium'; // Défaut
};

/**
 * Écran de création/édition du profil enfant
 * Permet de configurer le niveau de difficulté et les récompenses de temps
 */
export default function ChildProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNewChild = id === 'new';

  // État du formulaire
  const [loading, setLoading] = useState(!isNewChild);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('medium');
  const [timeRewardMinutes, setTimeRewardMinutes] = useState('15');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les données existantes si édition
  useEffect(() => {
    if (!isNewChild) {
      loadChildProfile();
    }
  }, [id]);

  // Met à jour automatiquement la difficulté quand l'âge change
  useEffect(() => {
    const ageNum = parseInt(age);
    if (!isNaN(ageNum) && ageNum >= 6 && ageNum <= 14) {
      setDifficultyLevel(getDefaultDifficultyForAge(ageNum));
    }
  }, [age]);

  /**
   * Charge le profil enfant depuis l'API
   */
  const loadChildProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/child/${id}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du profil');
      }

      const data: ChildProfile = await response.json();
      
      setName(data.name);
      setAge(data.age.toString());
      setDifficultyLevel(data.difficultyLevel);
      setTimeRewardMinutes(data.timeRewardMinutes.toString());
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le profil de l\'enfant');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Valide les données du formulaire
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validation du nom
    if (!name.trim()) {
      newErrors.name = 'Le prénom est requis';
    }

    // Validation de l'âge
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum)) {
      newErrors.age = 'L\'âge est requis';
    } else if (ageNum < 6 || ageNum > 14) {
      newErrors.age = 'L\'âge doit être entre 6 et 14 ans';
    }

    // Validation de la récompense de temps
    const timeNum = parseInt(timeRewardMinutes);
    if (!timeRewardMinutes || isNaN(timeNum)) {
      newErrors.timeRewardMinutes = 'Le temps de récompense est requis';
    } else if (timeNum < 5 || timeNum > 60) {
      newErrors.timeRewardMinutes = 'Le temps doit être entre 5 et 60 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Sauvegarde le profil enfant
   */
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        age: parseInt(age),
        difficultyLevel,
        timeRewardMinutes: parseInt(timeRewardMinutes),
      };

      const url = isNewChild ? '/api/child/profile' : `/api/child/${id}`;
      const method = isNewChild ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de la sauvegarde');
      }

      Alert.alert(
        'Succès',
        isNewChild ? 'Profil créé avec succès' : 'Profil mis à jour avec succès',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Une erreur est survenue');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations de base</Text>

        {/* Prénom */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Prénom de l'enfant *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Sophie"
            placeholderTextColor="#999"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Âge */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Âge *</Text>
          <TextInput
            style={[styles.input, errors.age && styles.inputError]}
            value={age}
            onChangeText={setAge}
            placeholder="Entre 6 et 14 ans"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={2}
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          <Text style={styles.helpText}>
            L'âge détermine automatiquement le niveau de difficulté
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration des exercices</Text>

        {/* Niveau de difficulté */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Niveau de difficulté</Text>
          <Text style={styles.helpText}>
            Sélectionné automatiquement selon l'âge, mais peut être ajusté
          </Text>

          <View style={styles.difficultyContainer}>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                difficultyLevel === 'easy' && styles.difficultyButtonActive,
              ]}
              onPress={() => setDifficultyLevel('easy')}
            >
              <Text
                style={[
                  styles.difficultyButtonText,
                  difficultyLevel === 'easy' && styles.difficultyButtonTextActive,
                ]}
              >
                Facile
              </Text>
              <Text style={styles.difficultySubtext}>6-8 ans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.difficultyButton,
                difficultyLevel === 'medium' && styles.difficultyButtonActive,
              ]}
              onPress={() => setDifficultyLevel('medium')}
            >
              <Text
                style={[
                  styles.difficultyButtonText,
                  difficultyLevel === 'medium' && styles.difficultyButtonTextActive,
                ]}
              >
                Moyen
              </Text>
              <Text style={styles.difficultySubtext}>9-11 ans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.difficultyButton,
                difficultyLevel === 'hard' && styles.difficultyButtonActive,
              ]}
              onPress={() => setDifficultyLevel('hard')}
            >
              <Text
                style={[
                  styles.difficultyButtonText,
                  difficultyLevel === 'hard' && styles.difficultyButtonTextActive,
                ]}
              >
                Difficile
              </Text>
              <Text style={styles.difficultySubtext}>12-14 ans</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Récompense de temps */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Temps gagné par exercice réussi *</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={[styles.timeInput, errors.timeRewardMinutes && styles.inputError]}
              value={timeRewardMinutes}
              onChangeText={setTimeRewardMinutes}
              placeholder="15"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.timeUnit}>minutes</Text>
          </View>
          {errors.timeRewardMinutes && (
            <Text style={styles.errorText}>{errors.timeRewardMinutes}</Text>
          )}
          <Text style={styles.helpText}>
            Entre 5 et 60 minutes. Recommandé: 15 minutes
          </Text>
        </View>
      </View>

      {/* Bouton de sauvegarde */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isNewChild ? 'Créer le profil' : 'Sauvegarder'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#4A90E2',
  },
  difficultyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  difficultyButtonTextActive: {
    color: '#4A90E2',
  },
  difficultySubtext: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    width: 80,
    textAlign: 'center',
  },
  timeUnit: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 32,
  },
});