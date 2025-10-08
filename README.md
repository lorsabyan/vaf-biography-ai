# 🎓 AI-Powered Biography Presentation Builder

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)

A Next.js web application that allows students (ages 10-16) to build slideshow presentations about a person's biography using AI.

[Demo](#) · [Report Bug](https://github.com/lorsabyan/vaf-biography-ai/issues) · [Request Feature](https://github.com/lorsabyan/vaf-biography-ai/issues)

</div>

---

## Features

- 🤖 **Conversational AI Chat**: Interactive chat with Gemini API to define presentation content
- 📊 **Visual Graph Editor**: Edit slide structure using ReactFlow
- 🖼️ **Image Integration**: Automatic image search using Serper API
- 🗺️ **Map Integration**: Display geographical locations with Maplibre.js
- 📽️ **Slideshow Presentation**: Beautiful, professional presentation view
- 🇦🇲 **Armenian UI**: Full user interface in Armenian language

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.9
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS 4.1
- **State Management**: Zustand 5.0
- **Graph Visualization**: ReactFlow 11.11
- **Mapping**: Maplibre.js 5.8
- **AI & Data APIs**: 
  - Google Gemini API 2.5 Pro
  - Serper API

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and add your API keys:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Then edit `.env.local` and add your API keys:

\`\`\`
GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key
SERPER_API_KEY=your_actual_serper_api_key
\`\`\`

#### Getting API Keys

- **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Serper API Key**: Get from [Serper.dev](https://serper.dev/)

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
vaf-biography-ai/
├── app/
│   ├── api/
│   │   ├── gemini/          # Gemini API proxy route
│   │   └── images/          # Serper API proxy route
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── ChatInterface.tsx    # Chat interface component
│   ├── GraphView.tsx        # ReactFlow graph editor
│   ├── MapView.tsx          # Maplibre map component
│   ├── SlideEditor.tsx      # Slide editing modal
│   └── Slideshow.tsx        # Slideshow presentation view
├── lib/
│   ├── store.ts             # Zustand state management
│   ├── terms.ts             # Armenian UI strings
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
\`\`\`

## How It Works

1. **Chat Phase**: User describes who they want to create a presentation about. The AI asks clarifying questions and generates slide content.

2. **Graph Editing Phase**: The generated slides are visualized as a graph. Users can click on each node to edit the slide's title, content, and select images.

3. **Slideshow Phase**: The final presentation is displayed with navigation controls, showing images and maps where applicable.

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Notes

- All UI text is in Armenian (configured in `lib/terms.ts`)
- The application uses server-side API routes to keep API keys secure
- Images are fetched dynamically based on AI-generated search terms
- Maps are displayed only when geographical locations are relevant to the content

## License

MIT
