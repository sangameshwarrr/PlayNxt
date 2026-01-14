// ============================================
// PlayNxt - Create Game Screen
// ============================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from '@/components';
import { useGameStore } from '@/store/gameStore';
import { useBookingStore } from '@/store/bookingStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, SPORTS, BORDER_RADIUS, SKILL_LEVELS } from '@/constants';
import { SportType, SkillLevel, CreateGameForm } from '@/types';

export default function CreateGameScreen() {
  const { createGame, isLoading } = useGameStore();
  const { venues, fetchVenues } = useBookingStore();
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('10');
  const [pricePerPlayer, setPricePerPlayer] = useState('200');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchVenues();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
    setStartTime('18:00');
    setEndTime('20:00');
  }, []);

  const filteredVenues = selectedSport ? venues.filter((v) => v.sports.includes(selectedSport)) : venues;
  const canProceedStep1 = selectedSport && title.length > 0;
  const canProceedStep2 = selectedVenueId && date && startTime && endTime;
  const canSubmit = canProceedStep1 && canProceedStep2 && maxPlayers && pricePerPlayer;

  const handleSubmit = async () => {
    if (!selectedSport || !selectedVenueId) return;
    const form: CreateGameForm = { sport: selectedSport, title, description, venueId: selectedVenueId, date, startTime, endTime, maxPlayers: parseInt(maxPlayers, 10), pricePerPlayer: parseInt(pricePerPlayer, 10), skillLevel };
    const success = await createGame(form);
    if (success) {
      Alert.alert('Game Created! 🎉', 'Your game has been created successfully.', [
        { text: 'View My Games', onPress: () => router.push('/(tabs)/bookings') },
        { text: 'Create Another', onPress: () => { setCurrentStep(1); setSelectedSport(null); setTitle(''); setDescription(''); setSelectedVenueId(null); } },
      ]);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Sport & Title</Text>
      <Text style={styles.stepSubtitle}>Select the sport and give your game a catchy name</Text>
      <Text style={styles.label}>Sport *</Text>
      <View style={styles.sportsGrid}>
        {SPORTS.map((sport) => (
          <TouchableOpacity key={sport.id} style={[styles.sportCard, selectedSport === sport.id && styles.sportCardSelected, { borderColor: sport.color }]} onPress={() => setSelectedSport(sport.id)}>
            <Text style={styles.sportIcon}>{sport.icon}</Text>
            <Text style={[styles.sportName, selectedSport === sport.id && { color: sport.color }]}>{sport.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Game Title *</Text>
      <TextInput style={styles.textInput} placeholder="e.g., Weekend Football Match" placeholderTextColor={COLORS.textTertiary} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Description (Optional)</Text>
      <TextInput style={[styles.textInput, styles.textArea]} placeholder="Add details about the game..." placeholderTextColor={COLORS.textTertiary} value={description} onChangeText={setDescription} multiline numberOfLines={3} />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Venue & Time</Text>
      <Text style={styles.stepSubtitle}>Select where and when you want to play</Text>
      <Text style={styles.label}>Select Venue *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.venueScroll}>
        {filteredVenues.map((venue) => (
          <TouchableOpacity key={venue.id} style={[styles.venueCard, selectedVenueId === venue.id && styles.venueCardSelected]} onPress={() => setSelectedVenueId(venue.id)}>
            <Text style={styles.venueEmoji}>🏟️</Text>
            <Text style={styles.venueName} numberOfLines={1}>{venue.name}</Text>
            <Text style={styles.venueArea}>{venue.area}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.label}>Date *</Text>
      <TextInput style={styles.textInput} placeholder="YYYY-MM-DD" placeholderTextColor={COLORS.textTertiary} value={date} onChangeText={setDate} />
      <View style={styles.timeRow}>
        <View style={styles.timeField}><Text style={styles.label}>Start Time *</Text><TextInput style={styles.textInput} placeholder="18:00" placeholderTextColor={COLORS.textTertiary} value={startTime} onChangeText={setStartTime} /></View>
        <View style={styles.timeField}><Text style={styles.label}>End Time *</Text><TextInput style={styles.textInput} placeholder="20:00" placeholderTextColor={COLORS.textTertiary} value={endTime} onChangeText={setEndTime} /></View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Game Settings</Text>
      <Text style={styles.stepSubtitle}>Set player limits and pricing</Text>
      <Text style={styles.label}>Maximum Players *</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity style={styles.counterButton} onPress={() => setMaxPlayers(String(Math.max(2, parseInt(maxPlayers) - 1)))}><Text style={styles.counterButtonText}>-</Text></TouchableOpacity>
        <Text style={styles.counterValue}>{maxPlayers}</Text>
        <TouchableOpacity style={styles.counterButton} onPress={() => setMaxPlayers(String(Math.min(30, parseInt(maxPlayers) + 1)))}><Text style={styles.counterButtonText}>+</Text></TouchableOpacity>
      </View>
      <Text style={styles.label}>Price per Player (₹) *</Text>
      <TextInput style={styles.textInput} placeholder="200" placeholderTextColor={COLORS.textTertiary} value={pricePerPlayer} onChangeText={setPricePerPlayer} keyboardType="numeric" />
      <Text style={styles.label}>Skill Level *</Text>
      <View style={styles.skillRow}>
        {SKILL_LEVELS.map((level) => (
          <TouchableOpacity key={level.id} style={[styles.skillChip, skillLevel === level.id && styles.skillChipSelected]} onPress={() => setSkillLevel(level.id as SkillLevel)}>
            <Text style={[styles.skillChipText, skillLevel === level.id && styles.skillChipTextSelected]}>{level.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Game Summary</Text>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Sport</Text><Text style={styles.summaryValue}>{SPORTS.find((s) => s.id === selectedSport)?.name || '-'}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Date & Time</Text><Text style={styles.summaryValue}>{date} • {startTime} - {endTime}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total Revenue</Text><Text style={[styles.summaryValue, { color: COLORS.success }]}>₹{parseInt(maxPlayers) * parseInt(pricePerPlayer || '0')}</Text></View>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.progressContainer}>{[1, 2, 3].map((step) => <View key={step} style={[styles.progressBar, step <= currentStep && styles.progressBarActive]} />)}</View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>
      <View style={styles.navigation}>
        {currentStep > 1 && <Button title="Back" onPress={() => setCurrentStep(currentStep - 1)} variant="outline" style={styles.navButton} />}
        {currentStep < 3 ? (
          <Button title="Next" onPress={() => setCurrentStep(currentStep + 1)} disabled={(currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2)} style={[styles.navButton, styles.navButtonPrimary]} />
        ) : (
          <Button title="Create Game" onPress={handleSubmit} loading={isLoading} disabled={!canSubmit} style={[styles.navButton, styles.navButtonPrimary]} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  progressContainer: { flexDirection: 'row', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: SPACING.sm },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: COLORS.border },
  progressBarActive: { backgroundColor: COLORS.primary },
  scrollView: { flex: 1 },
  stepContent: { padding: SPACING.lg },
  stepTitle: { fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.text, marginBottom: SPACING.xs },
  stepSubtitle: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  label: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.lg },
  sportsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  sportCard: { width: '23%', aspectRatio: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  sportCardSelected: { backgroundColor: COLORS.primaryLight + '20' },
  sportIcon: { fontSize: 28, marginBottom: SPACING.xs },
  sportName: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.medium, color: COLORS.textSecondary },
  textInput: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  venueScroll: { marginHorizontal: -SPACING.lg, paddingHorizontal: SPACING.lg },
  venueCard: { width: 140, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, marginRight: SPACING.sm, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center' },
  venueCardSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight + '20' },
  venueEmoji: { fontSize: 32, marginBottom: SPACING.sm },
  venueName: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text, textAlign: 'center' },
  venueArea: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  timeRow: { flexDirection: 'row', gap: SPACING.md },
  timeField: { flex: 1 },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xl },
  counterButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  counterButtonText: { fontSize: FONT_SIZE.xxl, color: COLORS.white, fontWeight: FONT_WEIGHT.bold },
  counterValue: { fontSize: FONT_SIZE.display, fontWeight: FONT_WEIGHT.bold, color: COLORS.text, minWidth: 60, textAlign: 'center' },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  skillChip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  skillChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  skillChipText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium, color: COLORS.text },
  skillChipTextSelected: { color: COLORS.white },
  summaryCard: { marginTop: SPACING.xl },
  summaryTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.text, marginBottom: SPACING.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  summaryLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
  summaryValue: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.text },
  navigation: { flexDirection: 'row', padding: SPACING.lg, gap: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  navButton: { flex: 1 },
  navButtonPrimary: { flex: 2 },
});

