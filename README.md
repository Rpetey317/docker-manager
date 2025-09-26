# Docker Admin Panel

A T3 stack application (TypeScript, Next.js, tRPC) for managing Docker containers and images with folder scanning capabilities.

## Features

- **Docker Stats Dashboard**: View running containers, images, and system information
- **Container Management**: Start, stop, and remove containers directly from the UI
- **Folder Scanning**: Add folders to scan for Dockerfiles and docker-compose files
- **Docker Operations**: Build Dockerfiles and run docker-compose commands from the interface

## Prerequisites

- Node.js 18+ 
- Docker installed and running
- Docker daemon accessible (usually requires running as user in docker group)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd docker-admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
cp .env.example .env
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Docker Stats Tab
- View real-time statistics of your Docker environment
- See running vs total containers
- Monitor image count and total size
- Start/stop/remove containers with one click

### Folder Manager Tab
- Add folders to scan for Docker files
- Automatically discovers Dockerfiles and docker-compose.yml files
- Build Docker images directly from Dockerfiles
- Run docker-compose up/down commands

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: tRPC, Prisma ORM
- **Database**: SQLite (development)
- **Docker Integration**: Dockerode library
- **TypeScript**: Full type safety

## API Endpoints

The app uses tRPC for type-safe API calls:

- `docker.getStats` - Get Docker system statistics
- `docker.startContainer` - Start a container
- `docker.stopContainer` - Stop a container  
- `docker.removeContainer` - Remove a container
- `folders.getAll` - Get all scan folders
- `folders.add` - Add a new scan folder
- `folders.remove` - Remove a scan folder
- `folders.scanDockerFiles` - Scan folder for Docker files
- `folders.buildDockerfile` - Build a Dockerfile
- `folders.runCompose` - Run docker-compose commands

## Security Notes

- This app requires Docker daemon access
- Only run on trusted networks
- Consider authentication for production use
- Docker operations run with current user permissions

## Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT