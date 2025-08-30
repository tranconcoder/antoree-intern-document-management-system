import AnalyticsDemo from "@/components/analytics/AnalyticsDemo";

export default function AnalyticsTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Google Analytics Integration Test
        </h1>

        <div className="grid gap-8">
          <AnalyticsDemo />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Setup Instructions</h2>
            <div className="prose max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Create Google Analytics Account:</strong>
                  <br />
                  Go to{" "}
                  <a
                    href="https://analytics.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Google Analytics
                  </a>{" "}
                  and create a new property
                </li>
                <li>
                  <strong>Get Measurement ID:</strong>
                  <br />
                  Copy your Measurement ID (format: G-XXXXXXXXXX) from Google
                  Analytics
                </li>
                <li>
                  <strong>Update Environment Variable:</strong>
                  <br />
                  Replace{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
                  </code>{" "}
                  in{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    .env.local
                  </code>{" "}
                  with your actual Measurement ID
                </li>
                <li>
                  <strong>Restart Development Server:</strong>
                  <br />
                  Restart your Next.js development server to apply the changes
                </li>
                <li>
                  <strong>Test Tracking:</strong>
                  <br />
                  Click the demo button above and check your Google Analytics
                  dashboard for real-time events
                </li>
              </ol>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">
              Available Tracking Methods
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Document Events</h3>
                <ul className="text-sm space-y-1">
                  <li>• trackDocumentUpload(fileName, fileSize)</li>
                  <li>• trackDocumentView(documentId)</li>
                  <li>• trackDocumentDownload(documentId, fileName)</li>
                  <li>• trackDocumentPreview(documentId, fileType)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">User Events</h3>
                <ul className="text-sm space-y-1">
                  <li>• trackUserLogin(method)</li>
                  <li>• trackUserRegister(method)</li>
                  <li>• trackSearch(query, resultsCount)</li>
                  <li>• trackCustomEvent(action, category, label, value)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
