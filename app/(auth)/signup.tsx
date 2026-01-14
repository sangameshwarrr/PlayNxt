// ============================================
// PlayNxt - Signup Screen
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Button, Input } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading, error } = useAuthStore();

  const handleSignup = async () => {
    if (!name || !email || !phone || !password) return;
    const success = await signup({ name, email, phone, password });
    if (success) {
      router.replace('/(tabs)/home');
    }
  };

  const isFormValid = name.length > 0 && email.includes('@') && phone.length >= 10 && password.length >= 6;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>🏆 PlayNxt</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the sports community and start playing</Text>
        </View>

        <View style={styles.form}>
          <Input label="Full Name" placeholder="Enter your full name" value={name} onChangeText={setName} autoCapitalize="words" />
          <Input label="Email" placeholder="Enter your email" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <Input label="Phone Number" placeholder="Enter your phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} maxLength={10} leftIcon={<Text style={styles.phonePrefix}>+91</Text>} />
          <Input label="Password" placeholder="Create a password" secureTextEntry value={password} onChangeText={setPassword} hint="Minimum 6 characters" />

          {error && <Text style={styles.error}>{error}</Text>}

          <Button title="Create Account" onPress={handleSignup} loading={isLoading} disabled={!isFormValid} fullWidth size="lg" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity><Text style={styles.loginLink}>Sign In</Text></TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.terms}>
          By signing up, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, padding: SPACING.xl, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  logo: { fontSize: 40, marginBottom: SPACING.lg },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center' },
  form: { marginBottom: SPACING.xl },
  phonePrefix: { fontSize: FONT_SIZE.md, color: COLORS.text, fontWeight: FONT_WEIGHT.medium },
  error: { fontSize: FONT_SIZE.sm, color: COLORS.error, marginBottom: SPACING.md, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.lg },
  footerText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  loginLink: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: FONT_WEIGHT.semibold },
  terms: { fontSize: FONT_SIZE.sm, color: COLORS.textTertiary, textAlign: 'center', lineHeight: 20 },
  termsLink: { color: COLORS.primary },
});

