import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Card,
  ActivityIndicator,
  Portal,
  Dialog,
  Menu,
  Divider,
  IconButton,
  Avatar,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string | null;
}

// Avatar options (emojis or icons)
const AVATAR_OPTIONS = [
  '🦁', '🐼', '🦊', '🐨', '🐸', '🦄', '🐷', '🐵',
  '🐶', '🐱', '🐭', '🐰', '🐻', '🐯', '🦁', '🐮',
];

export default function ChildFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childId = params.id as string;
  const isNewChild = childId === 'new';

  const [loading, setLoading] = useState(!isNewChild);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  // UI state
  const [ageMenuVisible, setAgeMenuVisible] = useState(false);
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  // Error state
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  useEffect(() => {
    if (!isNewChild) {
      fetchChild();
    }
  }, [childId]);

  const fetchChild = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/child/${childId}`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du profil');
      }

      const data: ChildProfile = await response.json();
      setName(data.name);
      setAge(data.age);
      setAvatar(data.avatar);
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; age?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!age || age < 6 || age > 14) {
      newErrors.age = 'Veuillez sélectionner un âge entre 6 et 14 ans';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const url = isNewChild ? '/api/child/profile' : `/api/child/${childId}`;
      const method = isNewChild ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          age,
          avatar,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de la sauvegarde');
      }

      Alert.alert(
        'Succès',
        isNewChild ? 'Enfant ajouté avec succès' : 'Profil mis à jour',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const response = await fetch(`/api/child/${childId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de la suppression');
      }

      Alert.alert('Succès', 'Enfant supprimé avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setDeleting(false);
      setDeleteDialogVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.title}>
          {isNewChild ? 'Ajouter un enfant' : 'Modifier le profil'}
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            {/* Avatar Selection */}
            <View style={styles.avatarSection}>
              <Text variant="titleMedium" style={styles.label}>
                Avatar (optionnel)
              </Text>
              <View style={styles.avatarContainer}>
                {avatar ? (
                  <Avatar.Text
                    size={80}
                    label={avatar}
                    style={styles.avatarPreview}
                  />
                ) : (
                  <Avatar.Icon
                    size={80}
                    icon="account"
                    style={styles.avatarPreview}
                  />
                )}
                <Button
                  mode="outlined"
                  onPress={() => setAvatarMenuVisible(true)}
                  style={styles.avatarButton}
                >
                  {avatar ? 'Changer' : 'Choisir un avatar'}
                </Button>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Name Input */}
            <TextInput
              label="Nom de l'enfant *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
              error={!!errors.name}
              style={styles.input}
              mode="outlined"
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            {/* Age Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text variant="titleMedium" style={styles.label}>
                Âge *
              </Text>
              <Menu
                visible={ageMenuVisible}
                onDismiss={() => setAgeMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setAgeMenuVisible(true)}
                    style={[styles.dropdown, errors.age && styles.dropdownError]}
                  >
                    {age ? `${age} ans` : 'Sélectionner un âge'}
                  </Button>
                }
              >
                {Array.from({ length: 9 }, (_, i) => i + 6).map((ageOption) => (
                  <Menu.Item
                    key={ageOption}
                    onPress={() => {
                      setAge(ageOption);
                      setAgeMenuVisible(false);
                      if (errors.age) {
                        setErrors({ ...errors, age: undefined });
                      }
                    }}
                    title={`${ageOption} ans`}
                  />
                ))}
              </Menu>
              {errors.age && (
                <Text style={styles.errorText}>{errors.age}</Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving || deleting}
            style={styles.saveButton}
          >
            {isNewChild ? 'Ajouter' : 'Enregistrer'}
          </Button>

          {!isNewChild && (
            <Button
              mode="outlined"
              onPress={() => setDeleteDialogVisible(true)}
              loading={deleting}
              disabled={saving || deleting}
              style={styles.deleteButton}
              textColor="#d32f2f"
            >
              Supprimer
            </Button>
          )}

          <Button
            mode="text"
            onPress={() => router.back()}
            disabled={saving || deleting}
            style={styles.cancelButton}
          >
            Annuler
          </Button>
        </View>
      </ScrollView>

      {/* Avatar Selection Dialog */}
      <Portal>
        <Dialog
          visible={avatarMenuVisible}
          onDismiss={() => setAvatarMenuVisible(false)}
        >
          <Dialog.Title>Choisir un avatar</Dialog.Title>
          <Dialog.Content>
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((emoji) => (
                <IconButton
                  key={emoji}
                  icon={() => <Text style={styles.emojiButton}>{emoji}</Text>}
                  size={50}
                  onPress={() => {
                    setAvatar(emoji);
                    setAvatarMenuVisible(false);
                  }}
                />
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAvatarMenuVisible(false)}>Fermer</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Confirmer la suppression</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Êtes-vous sûr de vouloir supprimer le profil de {name} ? Cette
              action est irréversible.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Annuler</Button>
            <Button
              onPress={handleDelete}
              textColor="#d32f2f"
              loading={deleting}
            >
              Supprimer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  loadingText: {
    marginTop: 16,
  },
  card: {
    marginBottom: 20,
  },
  avatarSection: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 12,
    fontWeight: '600',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarPreview: {
    backgroundColor: '#e3f2fd',
  },
  avatarButton: {
    flex: 1,
  },
  divider: {
    marginVertical: 20,
  },
  input: {
    marginBottom: 8,
  },
  dropdownContainer: {
    marginTop: 16,
  },
  dropdown: {
    marginTop: 8,
    justifyContent: 'center',
  },
  dropdownError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  buttonContainer: {
    gap: 12,
  },
  saveButton: {
    paddingVertical: 8,
  },
  deleteButton: {
    paddingVertical: 8,
    borderColor: '#d32f2f',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emojiButton: {
    fontSize: 32,
  },
});