# Ollama Integration Setup

## Prerequisites
1. Ollama installed on your local system
2. A language model downloaded (e.g., llama3.2)

## Setup Steps

### 1. Start Ollama Service
```bash
ollama serve
```

### 2. Download a Model (if not already done)
```bash
ollama pull llama3.2:latest
```

### 3. Test Ollama Connection
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:latest",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

### 4. Configuration
The application is configured to use:
- **Ollama URL**: http://localhost:11434
- **Model**: llama3.2:latest
- **Timeout**: 30 seconds

You can change these in `application.properties`:
```properties
ollama.base-url=http://localhost:11434
ollama.model=llama3.2:latest
ollama.timeout=30000
```

### 5. Available AI Features
- **Spending Analysis**: Analyzes your transaction patterns
- **Budget Recommendations**: Provides personalized budget tips
- **Custom Queries**: Ask any financial question

### 6. Troubleshooting
- Ensure Ollama is running on port 11434
- Check if the model is downloaded: `ollama list`
- Verify backend can reach Ollama: Check backend logs for connection errors

### 7. Alternative Models
You can use other models by changing the configuration:
- `llama3.1:latest`
- `mistral:latest`
- `codellama:latest`

Just update the `ollama.model` property and restart the backend.