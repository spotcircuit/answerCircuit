# Perplexity API Integration Guide

This document provides information on how to integrate the Perplexity AI API into our AnswerCircuit application.

## Available Models

| Model                 | Context Length | Model Type      | Notes                               |
| --------------------- | -------------- | --------------- | ----------------------------------- |
| `sonar-deep-research` | 128k           | Chat Completion | Best for detailed research          |
| `sonar-reasoning-pro` | 128k           | Chat Completion | Outputs chain-of-thought reasoning  |
| `sonar-reasoning`     | 128k           | Chat Completion | Simplified reasoning model          |
| `sonar-pro`           | 200k           | Chat Completion | Largest context window              |
| `sonar`               | 128k           | Chat Completion | Standard model                      |
| `r1-1776`             | 128k           | Chat Completion | Offline model (no web search)       |

**Notes**:
- `sonar-reasoning-pro` and `sonar-pro` have a max output token limit of 8k
- The reasoning models include chain-of-thought (CoT) reasoning in their responses
- `r1-1776` does not use Perplexity's search functionality

## API Integration

### Base URL
```
https://api.perplexity.ai/chat/completions
```

### Authentication
- Send the API key as a bearer token in the Authorization header
- Format: `Authorization: Bearer YOUR_API_KEY`

### Basic Request Structure
```json
{
  "model": "sonar-pro",
  "messages": [
    {
      "role": "system",
      "content": "Be precise and concise."
    },
    {
      "role": "user",
      "content": "What are the trending topics in technology today?"
    }
  ]
}
```

### Structured Output

For our trends feature, we can use structured output to get results in a consistent JSON format:

```json
{
  "model": "sonar-pro",
  "messages": [
    {
      "role": "system",
      "content": "You will provide trending topics based on the user query. Format the output with detailed information for each trend."
    },
    {
      "role": "user",
      "content": "What are the trending topics in artificial intelligence this week?"
    }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "type": "object",
      "properties": {
        "trends": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string"},
              "title": {"type": "string"},
              "description": {"type": "string"},
              "url": {"type": "string"},
              "source": {"type": "string"},
              "popularity": {"type": "number"},
              "imageUrl": {"type": "string"}
            },
            "required": ["id", "title", "description", "url", "source", "popularity"]
          }
        },
        "webPages": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": {"type": "string"},
              "url": {"type": "string"}
            },
            "required": ["title", "url"]
          }
        }
      },
      "required": ["trends", "webPages"]
    }
  }
}
```

## Best Practices

### System Prompts
- Use the system prompt to guide style, tone, and format
- Note that the real-time search component doesn't attend to the system prompt
- Be specific about the output format you expect

### User Prompts
- Pass the actual query in the user prompt
- This will be used to kick off real-time web search
- Be specific and clear for best results

### Implementation Tips
1. **Error Handling**: Implement robust error handling for API timeouts and failures
2. **Rate Limiting**: Be aware of rate limits based on your usage tier
3. **Structured Output**: For the first request with a new JSON schema, expect a delay (10-30 seconds)
4. **Fallback Logic**: Include fallback logic if the API is unavailable

## Sample Implementation

Here's a TypeScript example for our application:

```typescript
import axios from 'axios';

export async function searchTrendsWithPerplexity(query: string, recencyFilter: string = 'week'): Promise<any> {
  try {
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: `You are a trend research specialist. Provide the most current and relevant trending topics related to the user's query. For each trend, include a title, detailed description, relevant URL, source, and popularity score (1-100). Focus on trends from the ${recencyFilter} timeframe.`
        },
        {
          role: "user",
          content: query
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          type: "object",
          properties: {
            trends: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {type: "string"},
                  title: {type: "string"},
                  description: {type: "string"},
                  url: {type: "string"},
                  source: {type: "string"},
                  popularity: {type: "number"},
                  imageUrl: {type: "string"}
                },
                required: ["id", "title", "description", "url", "source", "popularity"]
              }
            },
            webPages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: {type: "string"},
                  url: {type: "string"}
                },
                required: ["title", "url"]
              }
            }
          },
          required: ["trends", "webPages"]
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout for first-time schema preparation
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error searching with Perplexity:', error);
    // Fall back to mock implementation if API fails
    return getMockTrendResponse(query, recencyFilter);
  }
}
```

## Setup Instructions

To use the Perplexity API in our application:

1. Ensure your Perplexity API key is in your `.env` file:
   ```
   PERPLEXITY_API_KEY=your-api-key-here
   ```

2. Integrate the API call function in your application

3. Implement proper error handling and fallback mechanisms

4. Update the UI to handle the structured response format

## Resource Links

- [Perplexity API Documentation](https://docs.perplexity.ai/)
- [Prompt Guide](https://docs.perplexity.ai/guides/prompt-guide)
- [Structured Output Guide](https://docs.perplexity.ai/guides/structured-outputs)
- [Model Cards](https://docs.perplexity.ai/guides/model-cards)
