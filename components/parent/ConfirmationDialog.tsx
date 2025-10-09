import React from 'react';
import { Dialog, Portal, Button, Text } from 'react-native-paper';

interface ConfirmationDialogProps {
  visible: boolean;
  childName: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ConfirmationDialog({
  visible,
  childName,
  onConfirm,
  onDismiss,
}: ConfirmationDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Activer le mode {childName} ?</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Le téléphone sera verrouillé en mode enfant. Vous devrez entrer votre code PIN pour en
            sortir.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Annuler</Button>
          <Button onPress={onConfirm} mode="contained">
            Confirmer
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
