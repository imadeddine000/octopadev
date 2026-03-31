# CLAUDE.md

This file provides guidance to Octopadev (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Octopadev workspace** - a multi-provider launcher for the Claude Code terminal client. It provides a unified interface to run Claude Code with different AI model backends:
- Anthropic (Claude) - direct API or account login
- Google Gemini - via compatibility proxy
- Groq - via compatibility proxy
- Ollama (local models) - via compatibility proxy

The workspace consists of:
1. **`Leonxlnx-claude-code/`** - Bundled Claude Code terminal client (minified/obfuscated)
2. **`src/`** - TypeScript source for launcher and compatibility proxy
3. **Root scripts** - Build, development, and launch commands

## Development Commands

### Building and Type Checking
```bash
npm run build        # Compile TypeScript to dist/
npm run check        # Type check without emitting
```

### Development
```bash
npm run dev          # Run development server with tsx
npm run octopadev     # Launch Octopadev (main entry point)
```

### Proxy Management
```bash
npm run proxy:compat # Start Anthropic-compatible proxy (default port 8789)
npm run proxy:gemini # Alias for proxy:compat
```

### Running the Application
```bash
npm start           # Run compiled application from dist/
```

## Architecture

### Dual-Mode Operation
Octopadev operates in two modes:

1. **Anthropic Mode**: Bundled client communicates directly with Anthropic API
2. **Compatibility Mode**: Bundled client → Local proxy → Third-party APIs (Gemini/Groq/Ollama)

### Key Components

**`src/launcher.js`** - Main entry point that:
- Applies branding patches to bundled client
- Presents provider selection menu
- Configures environment variables based on provider choice
- Starts compatibility proxy when needed
- Launches bundled client with appropriate settings

**`src/anthropicCompatProxy.ts`** - HTTP proxy that:
- Translates Anthropic-style `/v1/messages` requests to provider-specific APIs
- Handles Gemini, Groq, and Ollama backends
- Provides health endpoint at `/health`
- Runs on configurable ports (default: 8789 for Ollama)

**`src/providers.ts`** - Provider configuration and API translation logic

**`src/tools.ts`** - Tool definitions for the agent system

### Environment Configuration
- `.env` file in workspace root (optional, `.env.example` provided)
- Interactive prompts for missing credentials
- Provider-specific variables:
  - `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`
  - `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `OLLAMA_KEEP_ALIVE`
  - `ANTHROPIC_COMPAT_PORT` (proxy port, defaults per provider)

## Code Structure

### TypeScript Configuration
- Target: ES2022, Module: NodeNext
- JSX: react-jsx (for Ink terminal UI components)
- Strict TypeScript with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- Output directory: `dist/`

### Source Organization (`src/`)
- `index.ts` - Main application entry
- `cli.tsx` - Command-line interface with Ink components
- `anthropicCompatProxy.ts` - Core proxy implementation
- `providers.ts` - Provider-specific API adapters
- `tools.ts` - Agent tool definitions
- `agent.ts` - Agent orchestration logic
- `config.ts` - Configuration management
- `types.ts` - TypeScript type definitions

### Bundled Client (`Leonxlnx-claude-code/`)
- Minified Claude Code terminal client (version 2.1.87)
- **Note**: This is a publicly exposed source snapshot for educational/research purposes
- Original source from Anthropic's npm package source map exposure (March 31, 2026)
- Used under research/educational context for studying software supply-chain exposure

## Provider-Specific Notes

### Ollama (Local Models)
- Default model: `qwen3` (8B parameter class)
- Keep-alive: 30 minutes for faster follow-up responses
- Context window: 2048 tokens (configurable via `OLLAMA_NUM_CTX`)
- Output length: 128 tokens (configurable via `OLLAMA_NUM_PREDICT`)
- Hardware guidance: 16GB RAM minimum, 32GB preferred for coding workflows

### Gemini & Groq
- Use official SDKs (`@google/genai` for Gemini)
- API key required via environment or interactive prompt
- Model defaults: `gemini-2.5-flash` (Gemini), `openai/gpt-oss-20b` (Groq)

### Anthropic
- Supports both API key and in-app OAuth login flow
- Default model: `claude-sonnet-4-20250514`

## Development Workflow

1. **Make changes** in `src/` directory
2. **Type check**: `npm run check`
3. **Build**: `npm run build` (outputs to `dist/`)
4. **Test**: `npm run octopadev` for full integration test
5. **Proxy testing**: `npm run proxy:compat` + health check at `http://localhost:8789/health`

## Important Considerations

### Git Privacy
- Configure Git identity before committing: `git config user.name "Leonxlnx"`, `git config user.email "219127460+Leonxlnx@users.noreply.github.com"`
- `.env`, `node_modules`, `dist/` are gitignored
- Always review `git status` and `git diff --cached` before pushing

### Security
- API keys are handled via environment variables or interactive prompts
- No credentials stored in source code
- Local proxy runs on localhost only

### Research Context
The bundled Claude Code client in `Leonxlnx-claude-code/` is included for:
- Educational study of software supply-chain exposure
- Defensive security research practice
- Architecture review of agentic CLI systems
- Analysis of packaging and release-process failures

This is not an official Anthropic repository and does not claim ownership of the original Claude Code source.

## Troubleshooting

### Proxy Issues
- Verify proxy is running: `npm run proxy:compat`
- Check health endpoint: `http://localhost:8789/health`
- Ensure provider/model match in health response

### Ollama Performance
- Check model loading: `ollama ps`
- Adjust `OLLAMA_NUM_CTX` and `OLLAMA_NUM_PREDICT` for latency/quality tradeoff
- Consider smaller models for better performance on limited hardware

### Provider Switching
- Use `--provider` flag: `npm run octopadev -- --provider ollama`
- Legacy aliases: `claude` → `anthropic`, `grok` → `groq`