# TransCoder - Code Translation Tool

A minimal web application for developers to translate code between programming languages for learning purposes.

## Features

- **2-pane layout**: Side-by-side code editor and viewer (responsive design)
- **Monaco Editor**: Syntax highlighting with theme support
- **Multiple Languages**: Support for JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, PHP, Ruby
- **Auto-detection**: Source language can be automatically detected
- **Copy Functionality**: Easy copying of translated code
- **Keyboard Shortcuts**: Cmd/Ctrl + Enter for quick conversion
- **Toast Notifications**: Error and success feedback
- **Dark Mode**: Professional dark theme throughout

## Tech Stack

- **Framework**: Nuxt 3 (Vue 3 with `<script setup>`)
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **Package Manager**: npm/pnpm
- **Testing**: Vitest + Vue Test Utils

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

## Project Structure

```
├── components/           # Vue components
│   ├── CodeEditor.vue   # Monaco-based code editor
│   ├── CodeViewer.vue   # Read-only code viewer
│   └── LanguageSelect.vue # Language dropdown
├── composables/         # Vue composables
│   └── useConvert.ts    # API integration logic
├── types/              # TypeScript definitions
│   └── index.ts        # Shared types and constants
├── tests/              # Unit tests
├── plugins/            # Nuxt plugins
└── app.vue             # Main application layout
```

## API Integration

The app expects a backend API at `http://localhost:8000/convert` with the following interface:

**Request:**
```json
{
  "source_language": "javascript",
  "target_language": "python", 
  "code": "console.log('Hello World')"
}
```

**Response:**
```json
{
  "translated_code": "print('Hello World')"
}
```

## Usage

1. Select source language (or use "Auto Detect")
2. Select target language
3. Write/paste code in the left editor
4. Press "Convert" button or use Cmd/Ctrl + Enter
5. View translated code in the right panel
6. Copy the result using the "Copy" button

## Development

The application follows Vue 3 Composition API patterns with TypeScript. Components are designed to be minimal and focused on specific functionality. The useConvert composable handles all API communication with proper error handling and loading states.
