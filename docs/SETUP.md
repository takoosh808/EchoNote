# EchoNote Development Setup Guide

## Prerequisites

Before running EchoNote, ensure you have the following installed:

1. **Docker Desktop** - Download from https://www.docker.com/products/docker-desktop
2. **Git** - For version control
3. **Node.js 18+** (optional) - For local frontend development
4. **Python 3.11+** (optional) - For local backend development

## Quick Start with Docker

### 1. Start Docker Desktop
- Make sure Docker Desktop is running
- On Windows, you may need to run PowerShell as Administrator

### 2. Clone and Setup
```bash
git clone https://github.com/takoosh808/EchoNote.git
cd EchoNote
git checkout version1
```

### 3. Environment Configuration
The `.env` file is already created with default values. For production, update:
- `SECRET_KEY` - Generate a secure random key
- `OPENAI_API_KEY` - Add your OpenAI API key for AI features
- `AWS_*` - Add AWS credentials for file storage

### 4. Run with Docker Compose
```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** database on port 5432
- **Redis** cache on port 6379
- **Backend API** on port 8000
- **Frontend** on port 3000

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Alternative: Local Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## Troubleshooting

### Docker Issues
1. **Docker not running**: Start Docker Desktop
2. **Permission denied**: Run PowerShell as Administrator
3. **Port conflicts**: Stop other services using ports 3000, 8000, 5432, 6379

### Database Issues
1. **Connection refused**: Wait for PostgreSQL to fully start (30-60 seconds)
2. **Database not found**: The database is created automatically on first run

### Frontend Issues
1. **Module not found**: Run `npm install` in the frontend directory
2. **API connection failed**: Check that backend is running on port 8000

### Backend Issues
1. **Import errors**: Install Python dependencies with `pip install -r requirements.txt`
2. **Database errors**: Ensure PostgreSQL is running and accessible

## Development Commands

### Docker Commands
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Database Commands
```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U echonote -d echonote

# Reset database (removes all data)
docker-compose down -v
docker-compose up --build
```

## Project Structure

```
EchoNote/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand state management
│   │   ├── lib/          # API client and utilities
│   │   └── types/        # TypeScript type definitions
│   ├── Dockerfile        # Frontend container config
│   └── package.json      # Frontend dependencies
├── backend/           # FastAPI + Python backend
│   ├── app/
│   │   ├── api/          # API routes and endpoints
│   │   ├── core/          # Configuration and security
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # Business logic services
│   ├── Dockerfile        # Backend container config
│   └── requirements.txt   # Backend dependencies
├── infra/             # Infrastructure configuration
├── docs/              # Documentation
├── docker-compose.yml # Docker services configuration
└── .env               # Environment variables
```

## Features

### Completed in Sprint 1
- ✅ User authentication (login/register)
- ✅ Interactive dashboard
- ✅ Journal entry management
- ✅ Responsive UI with dark/light themes
- ✅ API backend with PostgreSQL
- ✅ Docker development environment
- ✅ Comprehensive documentation

### Ready for Development
- 🔄 AI-powered summarization
- 🔄 Audio recording and playback
- 🔄 Client-side encryption
- 🔄 Advanced search and filtering
- 🔄 Mobile app development

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs with `docker-compose logs`
3. Ensure all prerequisites are installed
4. Try rebuilding with `docker-compose up --build`

For development questions, refer to the comprehensive documentation in each source file.
