"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/Button";

export default function AnalyticsDemo() {
  const {
    trackDocumentUpload,
    trackDocumentView,
    trackDocumentDownload,
    trackDocumentPreview,
    trackUserLogin,
    trackUserRegister,
    trackSearch,
    trackCustomEvent,
  } = useAnalytics();

  const handleDemoEvents = () => {
    // Demo các loại event tracking
    trackDocumentUpload("example-document.pdf", 1024000);
    trackDocumentView("doc-123");
    trackDocumentDownload("doc-123", "example-document.pdf");
    trackDocumentPreview("doc-123", "pdf");
    trackUserLogin("email");
    trackUserRegister("email");
    trackSearch("project documents", 5);
    trackCustomEvent("demo_click", "demo", "analytics_demo_button");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Google Analytics Demo</h2>
      <p className="text-gray-600 mb-6">
        Click the button below to trigger various analytics events. Check your
        Google Analytics dashboard to see the events being tracked.
      </p>

      <div className="space-y-4">
        <Button
          onClick={handleDemoEvents}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Trigger Demo Analytics Events
        </Button>

        <div className="text-sm text-gray-500">
          <p>
            <strong>Events that will be triggered:</strong>
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Document Upload: example-document.pdf (1MB)</li>
            <li>Document View: doc-123</li>
            <li>Document Download: doc-123</li>
            <li>Document Preview: doc-123 (PDF)</li>
            <li>User Login: email method</li>
            <li>User Register: email method</li>
            <li>Search: "project documents" (5 results)</li>
            <li>Custom Event: demo_click</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
