// ============================================
// PlayNxt - useRefresh Hook
// ============================================
// Generic refresh hook for pull-to-refresh functionality

import { useState, useCallback } from 'react';

/**
 * Generic refresh hook for any async operation
 * @param onRefreshAction - Async function to execute on refresh
 */
export function useRefresh(onRefreshAction: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefreshAction();
    } catch (error) {
      // Error handling should be done in the action itself
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshAction]);

  return { refreshing, onRefresh };
}

