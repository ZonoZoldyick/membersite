"use client";

import { useEffect, useState } from "react";
import { activityService } from "../services/activityService";
import type { Activity } from "../types/activity";

type UseActivityFeedResult = {
  activities: Activity[];
  error: string | null;
  loading: boolean;
};

export function useActivityFeed(): UseActivityFeedResult {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadActivityFeed() {
      try {
        const result = await activityService.getActivityFeed();

        if (!isMounted) {
          return;
        }

        setActivities(result);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("Failed to load activity feed.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadActivityFeed();
    const unsubscribe = activityService.subscribe(() => {
      void loadActivityFeed();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    activities,
    error,
    loading,
  };
}
