// Google Analytics configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events for document management system
export const trackDocumentUpload = (fileName: string, fileSize: number) => {
  event({
    action: "upload",
    category: "document",
    label: fileName,
    value: fileSize,
  });
};

export const trackDocumentView = (documentId: string) => {
  event({
    action: "view",
    category: "document",
    label: documentId,
  });
};

export const trackDocumentDownload = (documentId: string, fileName: string) => {
  event({
    action: "download",
    category: "document",
    label: `${documentId}-${fileName}`,
  });
};

export const trackDocumentPreview = (documentId: string, fileType: string) => {
  event({
    action: "preview",
    category: "document",
    label: `${documentId}-${fileType}`,
  });
};

export const trackUserLogin = (method: string) => {
  event({
    action: "login",
    category: "user",
    label: method,
  });
};

export const trackUserRegister = (method: string) => {
  event({
    action: "register",
    category: "user",
    label: method,
  });
};

export const trackSearch = (searchQuery: string, resultsCount: number) => {
  event({
    action: "search",
    category: "search",
    label: searchQuery,
    value: resultsCount,
  });
};
