import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Card,
  IconButton,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormValidation, createValidationRules } from '@/hooks/useFormValidation';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { errors, validateForm, clearError } = useFormValidation();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showEmailVerificationDialog, setShowEmailVerificationDialog] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Validation rules
  const validationRules = createValidationRules(t);

  const handleRegister = async () => {
    // Clear previous errors
    setApiError('');

    // Validate form
    const formData = { email, password, confirmPassword };
    const passwordsMatch = password === confirmPassword;

    if (!passwordsMatch) {
      setApiError(t('auth.validation.passwordsMismatch'));
      return;
    }

    const isValid = validateForm(formData, validationRules);
    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Call Better Auth signUp method
      const response = await authClient.signUp.email({
        email: email.trim().toLowerCase(),
        password,
        name: email.split('@')[0], // Use email prefix as default name
      });

      if (response.error) {
        // Handle Better Auth errors
        const errorMessage = response.error.message || '';
        
        if (errorMessage.toLowerCase().includes('email') && 
            errorMessage.toLowerCase().includes('exist')) {
          setApiError(t('auth.errors.emailExists'));
        } else {
          setApiError(t('auth.errors.registrationFailed'));
        }
        return;
      }

      // Registration successful
      setRegisteredEmail(email);
      setShowEmailVerificationDialog(true);

      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Check for network errors
      if (error instanceof Error && error.message.includes('network')) {
        setApiError(t('auth.errors.networkError'));
      } else {
        setApiError(t('auth.errors.registrationFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerificationClose = () => {
    setShowEmailVerificationDialog(false);
    // Navigate to login screen or dashboard
    router.replace('/');
  };

  const handleGoToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            {t('auth.welcomeTitle')}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {t('auth.welcomeSubtitle')}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            {/* Email Input */}
            <TextInput
              mode="outlined"
              label={t('auth.email')}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError('email');
                setApiError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              error={!!errors.email}
              disabled={isLoading}
              style={styles.input}
            />
            {errors.email && (
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
            )}

            {/* Password Input */}
            <TextInput
              mode="outlined"
              label={t('auth.password')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError('password');
                setApiError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              error={!!errors.password}
              disabled={isLoading}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {errors.password && (
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>
            )}

            {/* Confirm Password Input */}
            <TextInput
              mode="outlined"
              label={t('auth.confirmPassword')}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                clearError('confirmPassword');
                setApiError('');
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              error={!!errors.confirmPassword}
              disabled={isLoading}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {errors.confirmPassword && (
              <HelperText type="error" visible={!!errors.confirmPassword}>
                {errors.confirmPassword}
              </HelperText>
            )}

            {/* API Error Message */}
            {apiError && (
              <HelperText type="error" visible={!!apiError} style={styles.apiError}>
                {apiError}
              </HelperText>
            )}

            {/* Sign Up Button */}
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.signUpButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? t('auth.signingUp') : t('auth.signUp')}
            </Button>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text variant="bodyMedium">{t('auth.alreadyHaveAccount')} </Text>
              <Button
                mode="text"
                onPress={handleGoToLogin}
                disabled={isLoading}
                compact
              >
                {t('auth.login')}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Email Verification Dialog */}
      <Portal>
        <Dialog
          visible={showEmailVerificationDialog}
          onDismiss={handleEmailVerificationClose}
        >
          <Dialog.Icon icon="email-check" />
          <Dialog.Title>{t('auth.emailVerification.title')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {t('auth.emailVerification.message', { email: registeredEmail })}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleEmailVerificationClose}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  apiError: {
    marginTop: 8,
    marginBottom: 8,
  },
  signUpButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});