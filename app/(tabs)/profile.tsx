// ============================================
// PlayNxt - Profile Screen
// ============================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, formatPrice } from '@/constants';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { walletBalance, fetchWalletBalance } = useBookingStore();

  useEffect(() => { fetchWalletBalance(); }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const menuItems = [
    { icon: '👤', title: 'Edit Profile', subtitle: 'Update your personal information', onPress: () => Alert.alert('Coming Soon', 'Edit Profile feature coming soon!') },
    { icon: '💳', title: 'Wallet', subtitle: `Balance: ${formatPrice(walletBalance)}`, onPress: () => Alert.alert('Coming Soon', 'Wallet feature coming soon!') },
    { icon: '🎮', title: 'My Games', subtitle: "View games you've joined or created", onPress: () => router.push('/(tabs)/bookings') },
    { icon: '📊', title: 'Stats & Achievements', subtitle: 'Track your sports journey', onPress: () => Alert.alert('Coming Soon', 'Stats feature coming soon!') },
    { icon: '🔔', title: 'Notifications', subtitle: 'Manage notification preferences', onPress: () => Alert.alert('Coming Soon', 'Notifications settings coming soon!') },
    { icon: '⚙️', title: 'Settings', subtitle: 'App preferences and privacy', onPress: () => Alert.alert('Coming Soon', 'Settings feature coming soon!') },
    { icon: '❓', title: 'Help & Support', subtitle: 'Get help or report an issue', onPress: () => Alert.alert('Coming Soon', 'Help & Support feature coming soon!') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}><Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text></View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '+91 9876543210'}</Text>
          <View style={styles.skillBadge}><Text style={styles.skillText}>{user?.skillLevel || 'intermediate'} • {user?.location?.area || 'Koramangala'}</Text></View>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>Games Played</Text></Card>
          <Card style={styles.statCard}><Text style={styles.statValue}>4.8</Text><Text style={styles.statLabel}>Rating</Text></Card>
          <Card style={styles.statCard}><Text style={[styles.statValue, { color: COLORS.success }]}>{formatPrice(walletBalance)}</Text><Text style={styles.statLabel}>Wallet</Text></Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sports Preferences</Text>
          <View style={styles.sportsRow}>
            {(user?.preferredSports || []).map((sport) => (
              <View key={sport.id} style={[styles.sportTag, { borderColor: sport.color }]}><Text>{sport.icon}</Text><Text style={[styles.sportTagText, { color: sport.color }]}>{sport.name}</Text></View>
            ))}
            {(!user?.preferredSports || user.preferredSports.length === 0) && (
              <><View style={styles.sportTag}><Text>⚽</Text><Text style={styles.sportTagText}>Football</Text></View><View style={styles.sportTag}><Text>🏸</Text><Text style={styles.sportTagText}>Badminton</Text></View></>
            )}
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuIconContainer}><Text style={styles.menuIcon}>{item.icon}</Text></View>
              <View style={styles.menuTextContainer}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuSubtitle}>{item.subtitle}</Text></View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutContainer}>
          <Button title="Logout" onPress={handleLogout} variant="outline" fullWidth style={styles.logoutButton} textStyle={{ color: COLORS.error }} />
        </View>

        <Text style={styles.version}>PlayNxt v1.0.0</Text>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', paddingVertical: SPACING.xxl, backgroundColor: COLORS.surface },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  avatarText: { fontSize: 40, fontWeight: FONT_WEIGHT.bold, color: COLORS.white },
  userName: { fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text },
  userPhone: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, marginTop: SPACING.xs },
  skillBadge: { marginTop: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, backgroundColor: COLORS.primaryLight + '20', borderRadius: BORDER_RADIUS.full },
  skillText: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: FONT_WEIGHT.medium, textTransform: 'capitalize' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginTop: -SPACING.xl, gap: SPACING.sm },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md },
  statValue: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: SPACING.xs },
  section: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.text, marginBottom: SPACING.md },
  sportsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  sportTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.xs },
  sportTagText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium, color: COLORS.text },
  menuContainer: { marginTop: SPACING.xl, backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIconContainer: { width: 40, height: 40, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surfaceSecondary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  menuIcon: { fontSize: 20 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text },
  menuSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  menuArrow: { fontSize: 24, color: COLORS.textTertiary },
  logoutContainer: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xl },
  logoutButton: { borderColor: COLORS.error },
  version: { fontSize: FONT_SIZE.sm, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.xl },
  bottomPadding: { height: SPACING.xxl },
});

