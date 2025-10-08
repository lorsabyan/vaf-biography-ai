# Quick Start Guide

## Before You Begin

You need to obtain two API keys:

1. **Google Gemini API Key**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key

2. **Serper API Key**
   - Go to: https://serper.dev/
   - Sign up for a free account
   - Get your API key from the dashboard
   - Copy the key

## Setup Steps

1. **Add your API keys to `.env.local`**:
   ```
   GOOGLE_GEMINI_API_KEY=paste_your_gemini_key_here
   SERPER_API_KEY=paste_your_serper_key_here
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   - Navigate to http://localhost:3000
   - You should see the chat interface in Armenian

## Using the Application

### Step 1: Chat Phase
- Type who you want to make a presentation about (e.g., "Լեոնարդո դա Վինչի")
- Answer the AI's clarifying questions
- The AI will generate slides automatically

### Step 2: Graph Editor Phase
- You'll see a visual graph of all your slides
- Click on any slide node to edit it
- You can:
  - Edit the title and content
  - Select an image from the suggested options
  - Save your changes

### Step 3: Slideshow Phase
- Click "Անցնել ներկայացմանը" (Continue to Slideshow)
- Navigate through slides using Previous/Next buttons
- View images and maps integrated into slides
- Click "Վերադառնալ խմբագրմանը" to go back to editing

## Troubleshooting

### "Failed to process request" error
- Check that your API keys are correctly added to `.env.local`
- Make sure there are no extra spaces or quotes around the keys
- Restart the development server after adding keys

### Images not loading
- Verify your Serper API key is correct
- Check your internet connection
- Serper has rate limits on free tier

### Map not displaying
- This is normal if the location data isn't available
- Maps only show when the AI identifies a geographical location

## Tips

- Use clear, specific names when describing who you want to present about
- Answer the AI's questions thoughtfully to get better content
- You can always go back to the graph editor to make changes
- The application works best on desktop and tablet devices
