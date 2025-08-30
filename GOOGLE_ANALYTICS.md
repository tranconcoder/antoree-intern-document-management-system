# Google Analytics Integration

This project includes comprehensive Google Analytics tracking for the document management system.

## Setup Instructions

### 1. Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Create a new property for your website
4. Select "Web" as the platform
5. Enter your website details

### 2. Get Measurement ID

1. In Google Analytics, go to Admin > Property Settings
2. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### 3. Configure Environment Variables

Update your `.env.local` file:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 4. Restart Development Server

```bash
bun dev
```

## Features

### Automatic Page Tracking

- All page views are automatically tracked
- URL changes in single-page app are captured
- Search parameters are included in tracking

### Custom Event Tracking

The following events are automatically tracked:

#### Document Events

- **Document View**: When a user views a document detail page
- **Document Upload**: When a user uploads new documents
- **Document Download**: When a user downloads a file
- **Document Preview**: When a user previews a document

#### User Events

- **User Login**: When a user successfully logs in
- **User Register**: When a user creates a new account
- **Search**: When a user performs a search

### Available Tracking Functions

```typescript
import * as gtag from "@/lib/gtag";

// Track document events
gtag.trackDocumentView(documentId);
gtag.trackDocumentUpload(fileName, fileSize);
gtag.trackDocumentDownload(documentId, fileName);
gtag.trackDocumentPreview(documentId, fileType);

// Track user events
gtag.trackUserLogin(method);
gtag.trackUserRegister(method);
gtag.trackSearch(searchQuery, resultsCount);

// Track custom events
gtag.event({
  action: "custom_action",
  category: "custom_category",
  label: "optional_label",
  value: 123,
});
```

### Using the Hook (Alternative)

```typescript
import { useAnalytics } from "@/hooks/useAnalytics";

function MyComponent() {
  const { trackDocumentUpload, trackDocumentView, trackCustomEvent } =
    useAnalytics();

  const handleUpload = () => {
    // Your upload logic
    trackDocumentUpload("document.pdf", 1024000);
  };

  return <button onClick={handleUpload}>Upload Document</button>;
}
```

## Implementation Examples

### Document Detail Page

```typescript
// Track when user views a document
useEffect(() => {
  if (documentId) {
    gtag.trackDocumentView(documentId);
  }
}, [documentId]);

// Track when user downloads a file
const handleDownload = async (file) => {
  await downloadFile(file);
  gtag.trackDocumentDownload(documentId, file.fileName);
};
```

### Login Page

```typescript
// Track successful login
const handleLogin = async (credentials) => {
  const result = await login(credentials);
  if (result.success) {
    gtag.trackUserLogin("email");
  }
};
```

### Search Component

```typescript
// Track search queries
const handleSearch = async (query) => {
  const results = await searchDocuments(query);
  gtag.trackSearch(query, results.length);
};
```

## Testing

### 1. Test Page

Visit `/analytics-test` to test all tracking functions and see setup instructions.

### 2. Real-time Monitoring

1. Go to Google Analytics dashboard
2. Click on "Reports" > "Realtime"
3. Interact with your website
4. See events appear in real-time

### 3. Event Debugging

1. Open browser Developer Tools
2. Go to Network tab
3. Filter by "collect" or "analytics"
4. Trigger events and see network requests

## Best Practices

### 1. Event Naming

- Use consistent naming conventions
- Keep event names descriptive but concise
- Use categories to group related events

### 2. Performance

- Events are fired asynchronously
- No impact on user experience
- Automatically handles offline scenarios

### 3. Privacy

- No personally identifiable information is tracked
- User IDs are anonymized
- Complies with GDPR requirements

## Troubleshooting

### Events Not Showing

1. Check that `NEXT_PUBLIC_GA_ID` is set correctly
2. Verify Measurement ID format (`G-XXXXXXXXXX`)
3. Ensure development server was restarted after env changes
4. Check browser console for errors

### Real-time Not Working

1. Make sure you're using the correct Google Analytics property
2. Check that your website domain is correctly configured
3. Verify that ad blockers are not interfering

### Multiple Environments

```env
# Development
NEXT_PUBLIC_GA_ID=G-DEV1234567

# Production
NEXT_PUBLIC_GA_ID=G-PROD7654321
```

## Advanced Configuration

### Custom Dimensions

```typescript
gtag.event("page_view", {
  custom_parameter_1: "value1",
  custom_parameter_2: "value2",
});
```

### Enhanced Ecommerce (if needed)

```typescript
gtag.event("purchase", {
  transaction_id: "T12345",
  value: 25.42,
  currency: "VND",
});
```

## Resources

- [Google Analytics Documentation](https://developers.google.com/analytics)
- [gtag.js Reference](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [Next.js Analytics Guide](https://nextjs.org/docs/basic-features/built-in-css-support)
