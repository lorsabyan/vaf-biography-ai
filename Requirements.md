# **Project Prompt: AI-Powered Biography Presentation Builder**

## **1\. Overall Goal**

Create a web application using Next.js that allows students (ages 10-16) to build a slideshow presentation about a person's biography. The core of the application is a chat interface where the user interacts with the Gemini API to define the presentation's content. The generated slide structure is first visualized as an editable graph using ReactFlow and then presented as a final slideshow.

## **2\. Target Audience**

The application is for school students aged 10-16. The user interface must be modern, elegant, intuitive, and engaging. Use simple language, clear visual cues, and a clean design to make it accessible and enjoyable for this age group.

## **3\. Core Features**

1. **Conversational AI Chat:**  
   * A primary chat interface for the user to specify the subject of the biography (e.g., "I want to make a presentation about Leonardo da Vinci").  
   * The Gemini API should ask clarifying questions to determine the scope, tone, and length of the presentation. For example: "Great choice\! Should we focus on his art, his inventions, or his whole life?" or "How many slides should we aim for? Maybe 5-7?"  
   * The AI will generate the text content for each slide based on this conversation.  
2. **Visual Graph Editor (ReactFlow):**  
   * After the chat session, the application will display the generated presentation structure as a visual graph using ReactFlow.  
   * Each node in the graph represents a slide and should display the slide's title.  
   * Nodes should be connected sequentially to represent the flow of the presentation.  
   * The user must be able to click on any node to open an editor to modify the slide's title and text content.  
3. **Image Integration (Serper API):**  
   * For each slide, the Gemini API will suggest relevant search terms for images.  
   * The application will use these terms to call the Serper API and fetch a selection of relevant images.  
   * In the slide editor, the user can view these images and select one to include in the slide.  
4. **Map Integration (Maplibre.js):**  
   * If a slide's content mentions a geographical location (e.g., a city of birth, a university), the Gemini API will be used to fetch the geographical coordinates (latitude and longitude).  
   * The application will use Maplibre.js to display a simple, elegant map with a marker on that location within the relevant slide.  
5. **Slideshow Presentation View:**  
   * A final, clean presentation view to display the finished slideshow.  
   * Each slide should have a well-designed layout, incorporating the title, text, selected image, and map (if applicable).  
   * Include simple "Next" and "Previous" buttons for navigation.

## **4\. Technology Stack**

* **Framework:** Next.js (latest version, App Router)  
* **Language:** TypeScript  
* **UI Components:** Shadcn/ui  
* **Styling:** Tailwind CSS  
* **State Management:** React Context or Zustand for managing the presentation data across components.  
* **Graph Visualization:** ReactFlow  
* **Mapping:** Maplibre.js  
* **AI & Data APIs:**  
  * **Text & Location Data:** Google Gemini API  
  * **Image Search:** Serper API

## **5\. Architectural & Component Breakdown**

* **app/page.tsx**: The main application component. It will manage the overall application state (e.g., transitioning between chat, graph, and slideshow views) and render the active component.  
* **lib/terms.ts**: A file to store all UI strings and labels in Armenian. This will make it easy to manage and update the text across the application.  
* **components/ChatInterface.tsx**:  
  * Manages the chat history and user input.  
  * Handles API calls to a backend route that communicates with the Gemini API.  
  * On completion, it passes the structured slide data to the main page component to trigger the switch to the GraphView.  
* **components/GraphView.tsx**:  
  * Takes the slide data as a prop.  
  * Initializes and renders the ReactFlow graph with custom nodes for each slide.  
  * Handles node click events to open the SlideEditor.  
* **components/SlideEditor.tsx**:  
  * Implement as a modal or sheet using Shadcn's Dialog or Sheet component.  
  * Displays input fields for the slide title and content.  
  * Fetches and displays image results from the Serper API.  
  * Allows the user to save changes, updating the central application state.  
* **components/Slideshow.tsx**:  
  * Receives the final, edited slide data.  
  * Renders one slide at a time with a clean layout.  
  * Includes the MapView component when location data is present for a slide.  
* **components/MapView.tsx**:  
  * A simple wrapper for Maplibre.js. It takes coordinates as props and renders a map with a single marker.  
* **app/api/gemini/route.ts**:  
  * A Next.js API Route that acts as a secure backend proxy for the Gemini API.  
  * It will receive the chat context and return the AI's response. It should also handle requests for structured data like coordinates.  
* **app/api/images/route.ts**:  
  * An API Route that securely queries the Serper API with a search term and returns a list of image URLs.

## **6\. Project Setup & Environment**

1. Initialize a new Next.js project (latest version) with TypeScript and Tailwind CSS.  
2. Use the shadcn-cli to set up and add the following components: Button, Input, Textarea, Dialog, Sheet, Card.  
3. Create a .env.local file to store API keys:  
   GOOGLE\_GEMINI\_API\_KEY="YOUR\_GEMINI\_API\_KEY"  
   SERPER\_API\_KEY="YOUR\_SERPER\_API\_KEY"

4. Ensure all API keys are loaded from environment variables on the server-side (in the API routes) and are not exposed to the client.

## **7\. UI/UX Guidelines**

* **Language:** The entire user interface must be in Armenian.  
* **Design:** Modern, clean, and minimalist. Use plenty of white space.  
* **Typography:** Use a highly readable, sans-serif font like Inter.  
* **Color Palette:** A simple and elegant palette, primarily using shades of gray and white, with one or two soft accent colors (e.g., a muted blue or green).  
* **Animations:** Use subtle, non-intrusive animations and transitions for a smooth user experience.  
* **Responsiveness:** The design should be fully responsive and work flawlessly on desktop and tablet devices.