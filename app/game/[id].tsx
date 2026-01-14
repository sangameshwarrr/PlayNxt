// ============================================
// PlayNxt - Game Detail Screen
// ============================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Loading } from '@/components';
import { useGameStore } from '@/store/gameStore';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  BORDER_RADIUS,
  formatDate,
  formatTime,
  formatPrice,
  getSkillLevelColor,
} from '@/constants';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { selectedGame, fetchGameById, joinGame, leaveGame, isLoading } = useGameStore();
  const { createBooking, isLoading: bookingLoading } = useBookingStore();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGameById(id);
    }
  }, [id]);

  if (isLoading || !selectedGame) {
    return <Loading fullScreen message="Loading game details..." />;
  }

  const game = selectedGame;
  const spotsLeft = game.maxPlayers - game.currentPlayers;
  const isHost = game.hostId === user?.id;
  const hasJoined = game.players.some((p) => p.id === user?.id);
  const isFull = spotsLeft === 0;

  const handleJoinGame = async () => {
    Alert.alert(
      'Join Game',
      `You're about to join "${game.title}" for ${formatPrice(game.pricePerPlayer)}. Proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join & Pay',
          onPress: async () => {
            const success = await joinGame(game.id);
            if (success) {
              await createBooking('game', game.id);
              Alert.alert('Success! 🎉', 'You have joined the game. See you there!');
            }
          },
        },
      ]
    );
  };

  const handleLeaveGame = async () => {
    Alert.alert(
      'Leave Game',
      'Are you sure you want to leave this game? Refund will be credited to your wallet.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            const success = await leaveGame(game.id);
            if (success) {
              Alert.alert('Done', 'You have left the game. Refund will be processed.');
            }
          },
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share Game', 'Share functionality coming soon!');
  };

  // Bottom action button resolved into a variable for clarity and to avoid nested ternary
  let bottomActionButton = (
    <Button
      title={isFull ? 'Game Full' : 'Join Game'}
      onPress={handleJoinGame}
      loading={isLoading || bookingLoading}
      disabled={isFull}
      style={styles.actionButton}
    />
  );

  if (isHost) {
    bottomActionButton = (
      <Button
        title="Manage Game"
        onPress={() => Alert.alert('Coming Soon', 'Game management coming soon!')}
        style={styles.actionButton}
      />
    );
  } else if (hasJoined) {
    bottomActionButton = (
      <Button
        title="Leave Game"
        variant="outline"
        onPress={handleLeaveGame}
        loading={isLoading}
        style={[styles.actionButton, styles.leaveButton]}
        textStyle={{ color: COLORS.error }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={[styles.sportBadge, { backgroundColor: game.sport.color + '20' }]}>
            <Text style={styles.sportIcon}>{game.sport.icon}</Text>
            <Text style={[styles.sportName, { color: game.sport.color }]}>
              {game.sport.name}
            </Text>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title & Status */}
          <Text style={styles.title}>{game.title}</Text>

          <View style={styles.statusRow}>
            <View style={[
              styles.skillBadge,
              { backgroundColor: getSkillLevelColor(game.skillLevel) + '20' }
            ]}>
              <Text style={[styles.skillText, { color: getSkillLevelColor(game.skillLevel) }]}>
                {game.skillLevel}
              </Text>
            </View>
            <View style={styles.spotsBadge}>
              <Text style={[
                styles.spotsText,
                spotsLeft <= 2 && { color: COLORS.error }
              ]}>
                {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left
              </Text>
            </View>
          </View>

          {/* Description */}
          {game.description && (
            <Text style={styles.description}>{game.description}</Text>
          )}

          {/* Game Info Cards */}
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <View>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>
                  {formatDate(game.date)} • {formatTime(game.startTime)} - {formatTime(game.endTime)}
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.infoCard} onPress={() => router.push(`/venue/${game.venue.id}`)}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>{game.venue.name}</Text>
                <Text style={styles.infoSubvalue}>
                  {game.venue.area}, {game.venue.city}
                </Text>
              </View>
              <Text style={styles.infoArrow}>›</Text>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>💰</Text>
              <View>
                <Text style={styles.infoLabel}>Price</Text>
                <Text style={[styles.infoValue, { color: COLORS.primary }] }>
                  {formatPrice(game.pricePerPlayer)} per player
                </Text>
              </View>
            </View>
          </Card>

          {/* Host */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hosted by</Text>
            <Card style={styles.hostCard}>
              <View style={styles.hostAvatar}>
                <Text style={styles.hostAvatarText}>{game.host.name.charAt(0)}</Text>
              </View>
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>{game.host.name}</Text>
                <Text style={styles.hostSkill}>{game.host.skillLevel} level</Text>
              </View>
              {isHost && (
                <View style={styles.youBadge}>
                  <Text style={styles.youBadgeText}>You</Text>
                </View>
              )}
            </Card>
          </View>

          {/* Players */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Players</Text>
              <Text style={styles.playerCount}>
                {game.currentPlayers}/{game.maxPlayers}
              </Text>
            </View>

            <View style={styles.playersGrid}>
              {game.players.map((player) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={styles.playerAvatar}>
                    <Text style={styles.playerAvatarText}>
                      {player.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {player.name}
                  </Text>
                </View>
              ))}

              {/* Empty slots */}
              {Array.from({ length: spotsLeft }).map((_, index) => (
                <View key={`empty-${game.id}-${index}`} style={styles.emptySlot}>
                  <View style={styles.emptyAvatar}>
                    <Text style={styles.emptyAvatarText}>+</Text>
                  </View>
                  <Text style={styles.emptyText}>Open</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Chat Preview */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.chatPreview}
              onPress={() => setShowChat(!showChat)}
            >
              <Text style={styles.chatIcon}>💬</Text>
              <Text style={styles.chatTitle}>Game Chat</Text>
              <Text style={styles.chatArrow}>{showChat ? '▼' : '›'}</Text>
            </TouchableOpacity>

            {showChat && (
              <Card style={styles.chatBox}>
                <Text style={styles.chatMessage}>
                  <Text style={styles.chatSender}>{game.host.name}: </Text>
                  Hey everyone! Looking forward to playing with you all 🎉
                </Text>
                <Text style={styles.chatTime}>2 hours ago</Text>

                <View style={styles.chatInput}>
                  <Text style={styles.chatInputPlaceholder}>
                    💭 Send a message...
                  </Text>
                </View>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>{formatPrice(game.pricePerPlayer)}</Text>
        </View>

        {bottomActionButton}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },

  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },

  sportIcon: {
    fontSize: 20,
  },

  sportName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },

  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  shareIcon: {
    fontSize: 20,
  },

  content: {
    padding: SPACING.lg,
  },

  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  statusRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  skillBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },

  skillText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'capitalize',
  },

  spotsBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
  },

  spotsText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textSecondary,
  },

  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },

  infoCard: {
    marginBottom: SPACING.sm,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  infoIcon: {
    fontSize: 24,
  },

  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },

  infoSubvalue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  infoArrow: {
    fontSize: 24,
    color: COLORS.textTertiary,
  },

  section: {
    marginTop: SPACING.xl,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  playerCount: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },

  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  hostAvatarText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },

  hostInfo: {
    flex: 1,
  },

  hostName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },

  hostSkill: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },

  youBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },

  youBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.white,
  },

  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },

  playerCard: {
    alignItems: 'center',
    width: 70,
  },

  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },

  playerAvatarText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },

  playerName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    textAlign: 'center',
  },

  emptySlot: {
    alignItems: 'center',
    width: 70,
  },

  emptyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
  },

  emptyAvatarText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textTertiary,
  },

  emptyText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },

  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },

  chatIcon: {
    fontSize: 20,
  },

  chatTitle: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },

  chatArrow: {
    fontSize: 18,
    color: COLORS.textTertiary,
  },

  chatBox: {
    marginTop: SPACING.sm,
  },

  chatMessage: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
  },

  chatSender: {
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.primary,
  },

  chatTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },

  chatInput: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  chatInputPlaceholder: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
  },

  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.lg,
  },

  priceInfo: {
    alignItems: 'flex-start',
  },

  priceLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  priceValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },

  actionButton: {
    flex: 1,
  },

  leaveButton: {
    borderColor: COLORS.error,
  },
});

