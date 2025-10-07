import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormValidation, createValidationRules } from '@/hooks/useFormValidation';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { errors, validateForm, clearError } = useFormValidation();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Validation rules (password doesn't need minLength for login)
  const validationRules = {
    email: createValidationRules(t).email,
    password: [
      {
        required: true,
        message: t('auth.validation.passwordRequired'),
      },
    ],
  };

  const handleLogin = async () => {
    // Clear previous errors
    setApiError('');

    // Validate form
    const formData = { email, password };
    const isValid = validateForm(formData, validationRules);
    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Call Better Auth signIn method
      const response = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.error) {
        // Handle Better Auth errors
        setApiError(t('auth.errors.registrationFailed'));
        return;
      }

      // Login successful - navigate to parent dashboard
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);

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

  const handleGoToRegister = () => {
    router.push('/(auth)/register');
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
            {t('auth.login')}
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
              autoComplete="password"
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

            {/* API Error Message */}
            {apiError && (
              <HelperText type="error" visible={!!apiError} style={styles.apiError}>
                {apiError}
              </HelperText>
            )}

            {/* Forgot Password Link */}
            <Button mode="text" compact style={styles.forgotPassword} disabled>
              {t('auth.forgotPassword')}
            </Button>

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? t('common.loading') : t('auth.login')}
            </Button>

            {/* Register Link */}
            <View style={styles.registerLinkContainer}>
              <Text variant="bodyMedium">Nouveau sur KidGuard? </Text>
              <Button mode="text" onPress={handleGoToRegister} disabled={isLoading} compact>
                {t('auth.createAccount')}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});