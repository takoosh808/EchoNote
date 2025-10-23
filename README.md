# EchoNote

A privacy-first, AI-powered journaling web application that allows users to record text and voice entries with optional client-side encryption.

## Features

- 📝 Text and voice journaling
- 🔒 Optional client-side encryption
- 🤖 AI-powered summarization and insights
- 📊 Weekly reflection generation
- 🎨 Clean, responsive design
- 🔐 Privacy-first architecture

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: FastAPI + PostgreSQL
- **Storage**: AWS S3 for audio files
- **AI**: OpenAI API for summarization
- **Encryption**: Web Crypto API (client-side)

## Project Structure

```
EchoNote/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend application
├── infra/            # Infrastructure and deployment configs
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 14+

### Quick Start

1. Clone the repository
2. Run `docker-compose up` for local development
3. Access the application at `http://localhost:3000`

## Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Technical Specification](docs/TECHNICAL_SPEC.md)
- [Threat Model](docs/THREAT_MODEL.md)
- [Sprint 0 Plan](docs/SPRINT_0_PLAN.md)

## Security & Privacy

EchoNote implements a privacy-first architecture with optional client-side encryption. See our [Threat Model](docs/THREAT_MODEL.md) for detailed security considerations.

## License

MIT License - see [LICENSE](LICENSE) for details.
