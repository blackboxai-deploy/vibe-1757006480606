// Custom endpoint configuration for OpenRouter (no API keys required)
const OPENROUTER_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const HEADERS = {
  'customerId': 'cus_SFkzlM4lBe5pBM',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

interface VideoBlueprint {
  title: string;
  scenes: Array<{
    duration: number;
    description: string;
    visualElements: string[];
    transitions: string;
  }>;
  totalDuration: number;
  style: string;
  voiceOver: {
    script: string;
    tone: string;
    pacing: string;
  };
}

interface ContentExtraction {
  text: string;
  headings: string[];
  keyPoints: string[];
  images: string[];
  metadata: {
    pageCount?: number;
    wordCount: number;
    language: string;
  };
}

export class AIProcessingService {
  // Extract content from uploaded files
  async extractContent(file: File): Promise<ContentExtraction> {
    const content = await this.processFileContent(file);
    
    // Use Claude for content analysis and extraction
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are an expert content analyst. Extract and structure content for video generation.
            
            Extract:
            - Main text content
            - Important headings and sections
            - Key points and takeaways
            - Any visual elements mentioned
            - Document metadata

            Return a JSON object with:
            {
              "text": "cleaned main text content",
              "headings": ["heading 1", "heading 2"],
              "keyPoints": ["key point 1", "key point 2"],
              "images": ["image description 1"],
              "metadata": {
                "pageCount": number,
                "wordCount": number,
                "language": "detected language"
              }
            }`
          },
          {
            role: 'user',
            content: `Please analyze and extract content from this ${file.type} file content: ${content}`
          }
        ],
        max_tokens: 3000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error('Failed to extract content with AI');
    }

    const result = await response.json();
    
    try {
      return JSON.parse(result.choices[0].message.content);
    } catch {
      // Fallback if JSON parsing fails
      return {
        text: result.choices[0].message.content,
        headings: [],
        keyPoints: [],
        images: [],
        metadata: {
          wordCount: content.split(' ').length,
          language: 'en'
        }
      };
    }
  }

  // Generate video blueprint from extracted content
  async generateVideoBlueprint(
    content: ContentExtraction,
    preferences: {
      style?: string;
      duration?: number;
      tone?: string;
    } = {}
  ): Promise<VideoBlueprint> {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        model: 'openrouter/openai/gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional video production expert. Create detailed video blueprints for AI video generation.

            Create a comprehensive video blueprint that includes:
            - Scene breakdown with timing
            - Visual descriptions for each scene
            - Transition effects
            - Voice-over script with pacing
            - Style guidelines

            Return JSON format:
            {
              "title": "video title",
              "scenes": [
                {
                  "duration": seconds,
                  "description": "detailed scene description",
                  "visualElements": ["element 1", "element 2"],
                  "transitions": "transition description"
                }
              ],
              "totalDuration": total_seconds,
              "style": "visual style description",
              "voiceOver": {
                "script": "complete voice over script",
                "tone": "professional/casual/energetic",
                "pacing": "slow/medium/fast"
              }
            }`
          },
          {
            role: 'user',
            content: `Create a video blueprint for this content:

            Title: ${content.text.split('.')[0]}
            Key Points: ${content.keyPoints.join(', ')}
            Content: ${content.text.substring(0, 2000)}

            Preferences:
            - Style: ${preferences.style || 'professional'}
            - Target Duration: ${preferences.duration || 300} seconds
            - Tone: ${preferences.tone || 'professional'}`
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate video blueprint');
    }

    const result = await response.json();
    
    try {
      return JSON.parse(result.choices[0].message.content);
    } catch {
      // Fallback blueprint
      return {
        title: content.text.split('.')[0] || 'Generated Video',
        scenes: [
          {
            duration: 30,
            description: 'Introduction scene with key message',
            visualElements: ['title text', 'background graphics'],
            transitions: 'fade in'
          }
        ],
        totalDuration: 30,
        style: 'professional',
        voiceOver: {
          script: content.text.substring(0, 500),
          tone: 'professional',
          pacing: 'medium'
        }
      };
    }
  }

  // Generate video using multiple providers
  async generateVideo(blueprint: VideoBlueprint, projectId: string): Promise<{
    success: boolean;
    videoUrl?: string;
    error?: string;
  }> {
    try {
      // Try Synthesia first (simulated)
      const videoUrl = await this.renderWithSynthesia(blueprint);
      
      if (videoUrl) {
        return {
          success: true,
          videoUrl,
        };
      }

      // Fallback to HeyGen (simulated)
      const heygenUrl = await this.renderWithHeyGen(blueprint);
      
      if (heygenUrl) {
        return {
          success: true,
          videoUrl: heygenUrl,
        };
      }

      throw new Error('All video providers failed');

    } catch (error) {
      console.error('Video generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video generation failed',
      };
    }
  }

  // Process file content based on type
  private async processFileContent(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    
    switch (file.type) {
      case 'application/pdf':
        // TODO: Implement PDF parsing with pdf-parse
        return 'PDF content extraction will be implemented here';
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        // TODO: Implement DOCX parsing with mammoth
        return 'DOCX content extraction will be implemented here';
        
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        // TODO: Implement XLSX parsing with xlsx
        return 'XLSX content extraction will be implemented here';
        
      case 'text/plain':
        return new TextDecoder().decode(buffer);
        
      default:
        return 'Binary file - content extraction will be implemented based on file type';
    }
  }

  // Synthesia video rendering (simulated)
  private async renderWithSynthesia(blueprint: VideoBlueprint): Promise<string | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return simulated video URL
    const videoId = Math.random().toString(36).substring(7);
    return `https://storage.animagenius.com/videos/synthesia_${videoId}.mp4`;
  }

  // HeyGen video rendering (simulated)
  private async renderWithHeyGen(blueprint: VideoBlueprint): Promise<string | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return simulated video URL
    const videoId = Math.random().toString(36).substring(7);
    return `https://storage.animagenius.com/videos/heygen_${videoId}.mp4`;
  }
}

export const aiService = new AIProcessingService();