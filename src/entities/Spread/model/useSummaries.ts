import { useEffect, useState } from 'react';

import requestAi from '@/shared/api/AI';

import { getSummaries } from '../api/getSummaries';
import { addSummary as addNewSummary } from '../api/addSummary';
import type { Spread, Summary } from '../types';
import { prepareSpreadsAnalysisPrompt } from '../lib/prepareSpreadsAnalysis';

import { useUserData } from '@/entities/User';

export const useSummaries = () => {
  const { userData } = useUserData();

  const [summaries, setSummaries] = useState<Summary[] | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchSummaries = async () => {
    try {
      setIsLoading(true);

      if (!userData) {
        return;
      }

      const response = await getSummaries(userData.id);

      setSummaries(response);
    } finally {
      setIsLoading(false);
    }
  };

  const addSummary = async (spreads: Spread[]) => {
    if (!userData) {
      return;
    }

    try {
      setIsAnalyzing(true);

      const develperPrompt = prepareSpreadsAnalysisPrompt(spreads);

      const response = await requestAi([
        { role: 'developer', content: develperPrompt },
      ]);

      if (response) {
        return addNewSummary(userData.id, response);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return {
    isLoading,
    isAnalyzing,
    summaries,
    addSummary,
  };
};
