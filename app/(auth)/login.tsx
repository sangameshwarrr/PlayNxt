// ============================================
// PlayNxt - Login Screen
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Button, Input } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '@/constants';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const { login, isLoading, isOtpSent, error, clearError } = useAuthStore();

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    await login({ phone });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    const success = await login({ phone, otp });
    if (success) {
      router.replace('/(tabs)/home');
    }
  };

  const handleResendOtp = () => {
    clearError();
    setOtp('');
    login({ phone });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>🏆 PlayNxt</Text>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue booking games and venues</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
            editable={!isOtpSent}
            leftIcon={<Text style={styles.phonePrefix}>+91</Text>}
          />

          {isOtpSent && (
            <>
              <Input
                label="OTP"
                placeholder="Enter 6-digit OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                hint="Enter any 6 digits to login (demo mode)"
              />
              <TouchableOpacity onPress={handleResendOtp} style={styles.resendButton}>
                <Text style={styles.resendText}>Didn't receive OTP? Resend</Text>
              </TouchableOpacity>
            </>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title={isOtpSent ? 'Verify OTP' : 'Send OTP'}
            onPress={isOtpSent ? handleVerifyOtp : handleSendOtp}
            loading={isLoading}
            disabled={isOtpSent ? otp.length !== 6 : phone.length < 10}
            fullWidth
            size="lg"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity><Text style={styles.signupLink}>Sign Up</Text></TouchableOpacity>
          </Link>
        </View>

        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>📱 Demo Mode: Enter any phone number and 6-digit OTP</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, padding: SPACING.xl, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: SPACING.xxxl },
  logo: { fontSize: 40, marginBottom: SPACING.lg },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, textAlign: 'center' },
  form: { marginBottom: SPACING.xxl },
  phonePrefix: { fontSize: FONT_SIZE.md, color: COLORS.text, fontWeight: FONT_WEIGHT.medium },
  resendButton: { alignSelf: 'flex-end', marginBottom: SPACING.lg, marginTop: -SPACING.sm },
  resendText: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: FONT_WEIGHT.medium },
  error: { fontSize: FONT_SIZE.sm, color: COLORS.error, marginBottom: SPACING.md, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.xs },
  footerText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
  signupLink: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: FONT_WEIGHT.semibold },
  demoInfo: { marginTop: SPACING.xxl, padding: SPACING.md, backgroundColor: COLORS.primaryLight + '20', borderRadius: BORDER_RADIUS.md },
  demoText: { fontSize: FONT_SIZE.sm, color: COLORS.primary, textAlign: 'center' },
});

