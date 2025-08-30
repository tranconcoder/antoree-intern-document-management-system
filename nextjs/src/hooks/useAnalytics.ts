"use client";

import { useCallback } from "react";
import * as gtag from "@/lib/gtag";

export const useAnalytics = () => {
  const trackDocumentUpload = useCallback(
    (fileName: string, fileSize: number) => {
      gtag.trackDocumentUpload(fileName, fileSize);
    },
    []
  );

  const trackDocumentView = useCallback((documentId: string) => {
    gtag.trackDocumentView(documentId);
  }, []);

  const trackDocumentDownload = useCallback(
    (documentId: string, fileName: string) => {
      gtag.trackDocumentDownload(documentId, fileName);
    },
    []
  );

  const trackDocumentPreview = useCallback(
    (documentId: string, fileType: string) => {
      gtag.trackDocumentPreview(documentId, fileType);
    },
    []
  );

  const trackUserLogin = useCallback((method: string) => {
    gtag.trackUserLogin(method);
  }, []);

  const trackUserRegister = useCallback((method: string) => {
    gtag.trackUserRegister(method);
  }, []);

  const trackSearch = useCallback(
    (searchQuery: string, resultsCount: number) => {
      gtag.trackSearch(searchQuery, resultsCount);
    },
    []
  );

  const trackCustomEvent = useCallback(
    (action: string, category: string, label?: string, value?: number) => {
      gtag.event({ action, category, label, value });
    },
    []
  );

  return {
    trackDocumentUpload,
    trackDocumentView,
    trackDocumentDownload,
    trackDocumentPreview,
    trackUserLogin,
    trackUserRegister,
    trackSearch,
    trackCustomEvent,
  };
};
