// ============================================
// PlayNxt - Game Card Component
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card } from './Card';
import { Game } from '@/types';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  FONT_WEIGHT,
  formatDate,
  formatTime,
  formatPrice,
  getSkillLevelColor,
} from '@/constants';

interface GameCardProps {
  game: Game;
  onPress: () => void;
  variant?: 'default' | 'compact';
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onPress,
  variant = 'default',
}) => {
  const spotsLeft = game.maxPlayers - game.currentPlayers;

  if (variant === 'compact') {
    return (
      <Card onPress={onPress} style={styles.compactCard}>
        <View style={styles.compactContent}>
          <Text style={styles.sportIcon}>{game.sport.icon}</Text>
          <View style={styles.compactInfo}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {game.title}
            </Text>
            <Text style={styles.compactMeta}>
              {formatDate(game.date)} • {formatTime(game.startTime)}
            </Text>
          </View>
          <View style={styles.compactRight}>
            <Text style={styles.price}>{formatPrice(game.pricePerPlayer)}</Text>
            <Text style={styles.spotsText}>
              {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card onPress={onPress} style={styles.card} padding="none">
      {/* Header with sport badge */}
      <View style={styles.header}>
        <View style={[styles.sportBadge, { backgroundColor: game.sport.color + '20' }]}>
          <Text style={styles.sportIcon}>{game.sport.icon}</Text>
          <Text style={[styles.sportName, { color: game.sport.color }]}>
            {game.sport.name}
          </Text>
        </View>
        <View style={[
          styles.skillBadge,
          { backgroundColor: getSkillLevelColor(game.skillLevel) + '20' }
        ]}>
          <Text style={[
            styles.skillText,
            { color: getSkillLevelColor(game.skillLevel) }
          ]}>
            {game.skillLevel}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{game.title}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText} numberOfLines={1}>
            {game.venue.name}, {game.venue.area}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={styles.infoText}>
            {formatDate(game.date)} • {formatTime(game.startTime)} - {formatTime(game.endTime)}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.players}>
            <View style={styles.avatarStack}>
              {game.players.slice(0, 3).map((player, index) => (
                <View
                  key={player.id}
                  style={[
                    styles.avatar,
                    { marginLeft: index > 0 ? -8 : 0 },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {player.name.charAt(0)}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.playerCount}>
              {game.currentPlayers}/{game.maxPlayers} joined
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>per player</Text>
            <Text style={styles.price}>{formatPrice(game.pricePerPlayer)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },

  compactCard: {
    marginBottom: SPACING.sm,
  },

  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  compactInfo: {
    flex: 1,
  },

  compactTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },

  compactMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  compactRight: {
    alignItems: 'flex-end',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    paddingBottom: 0,
  },

  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },

  sportIcon: {
    fontSize: FONT_SIZE.lg,
  },

  sportName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },

  skillBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },

  skillText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'capitalize',
  },

  content: {
    padding: SPACING.md,
  },

  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },

  infoIcon: {
    fontSize: FONT_SIZE.sm,
  },

  infoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  players: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  avatarStack: {
    flexDirection: 'row',
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },

  avatarText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },

  playerCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  priceContainer: {
    alignItems: 'flex-end',
  },

  priceLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },

  price: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },

  spotsText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
});

