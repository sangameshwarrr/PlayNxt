// ============================================
// PlayNxt - ActivityTabs Component
// ============================================
// Reusable tab component for activity filtering

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '@/theme';
import { ActivityTab } from '@/hooks/useActivity';

interface TabConfig {
  key: ActivityTab;
  label: string;
  count?: number;
}

interface ActivityTabsProps {
  activeTab: ActivityTab;
  onTabChange: (tab: ActivityTab) => void;
  upcomingCount?: number;
  pastCount?: number;
}

/**
 * Tab configuration
 */
const TABS: TabConfig[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

/**
 * Memoized tab button component
 */
const TabButton = memo(function TabButton({
  tab,
  isActive,
  count,
  onPress,
}: {
  tab: TabConfig;
  isActive: boolean;
  count?: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.tabActive]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${tab.label} tab${count === undefined ? '' : `, ${count} items`}`}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
        {tab.label}
      </Text>
      {count !== undefined && count > 0 && (
        <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
          <Text style={[styles.countText, isActive && styles.countTextActive]}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

/**
 * Activity tabs component for filtering upcoming/past activities
 */
export const ActivityTabs = memo(function ActivityTabs({
  activeTab,
  onTabChange,
  upcomingCount,
  pastCount,
}: ActivityTabsProps) {
  const getCount = (key: ActivityTab): number | undefined => {
    switch (key) {
      case 'upcoming':
        return upcomingCount;
      case 'past':
        return pastCount;
      default:
        return undefined;
    }
  };

  return (
    <View style={styles.container} accessibilityRole="tablist">
      {TABS.map((tab) => (
        <TabButton
          key={tab.key}
          tab={tab}
          isActive={activeTab === tab.key}
          count={getCount(tab.key)}
          onPress={() => onTabChange(tab.key)}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surfaceSecondary,
    gap: SPACING.xs,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textSecondary,
  },
  countTextActive: {
    color: COLORS.white,
  },
});

