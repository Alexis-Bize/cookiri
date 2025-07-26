# Cookiri - Chrome Extension

![title](.github/assets/logo.png)

A Chrome extension that allows you to easily track and manage your browser's cookies, and highlight trackers.

> [!IMPORTANT]
> This extension is currently in beta and not yet published. Please refer to the documentation for instructions on how to build and install it.

## Features

- **View Cookies**: See all cookies for the current website with detailed information
- **Edit Cookies**: Modify cookie values, names, domains, paths, and other properties
- **Delete Cookies**: Mark cookies for deletion
- **Real-time Updates**: See changes reflected immediately after saving
- **User-friendly Interface**: Modern UI with clear visual feedback

## How to Use

### Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Load the `dist` folder as an unpacked extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

### Using the Extension

1. **Open the Extension**: Click the extension icon in your browser toolbar
2. **View Cookies**: All cookies for the current website will be displayed in a list
3. **Edit Cookies**:
   - Click on a cookie to expand its details
   - Modify any field (name, value, domain, path, etc.)
   - Changes are tracked automatically
4. **Delete Cookies**:
   - Click the trash icon next to a cookie to mark it for deletion
5. **Save Changes**:
   - Click the "Save" button in the floating action bar to apply all changes
   - Click "Discard" to revert all changes

### Cookie Properties

- **Name**: The cookie's name (required)
- **Value**: The cookie's value (required)
- **Domain**: The domain the cookie belongs to
- **Path**: The path on the domain
- **Expiration**: When the cookie expires (leave empty for session cookies)
- **Secure**: Whether the cookie requires HTTPS
- **HTTP Only**: Whether the cookie is accessible only via HTTP(S)
- **SameSite**: Cross-site request behavior (Lax, Strict, None)
- **Session**: Whether the cookie expires when the browser closes

## Development

### Building

```bash
pnpm run build    # Build for production
pnpm run dev      # Start development server
pnpm run watch    # Watch for changes and rebuild
```

Alternatively, you could, of course, use `npm`, `yarn`, or whatever.

## Permissions

The extension requires the following permissions:

- `cookies`: To read, edit, and delete cookies
- `storage`: To store extension settings
- `activeTab`: To access the current tab's URL
- `scripting`: For potential future features
- `host_permissions`: `<all_urls>` to work with cookies from any website

## Technical Details

- Built with React 19 and TypeScript
- Uses Chrome Extension Manifest V3
- Styled with Tailwind CSS
- Uses Radix UI components for accessibility

## License

MIT License - see LICENSE file for details.
