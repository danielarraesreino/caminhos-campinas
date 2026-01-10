# Workflow: Project Setup & Local Development

## Prerequisites
- **Node.js**: 20.x or higher.
- **Package Manager**: npm (v10+ recommended).

## Installation
1. Clone the repository.
2. Run installation:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   - Add your \`GROQ_API_KEY\` from https://console.groq.com/keys.
   - Generate an \`AUTH_SECRET\` using \`openssl rand -base64 32\`.

## Running the Project
- **Development Server**:
  \`\`\`bash
  npm run dev
  \`\`\`
  Open http://localhost:3000 (standard Next.js port).

- **Validation (Type Check & Lint)**:
  \`\`\`bash
  npm run validate
  \`\`\`

## Offline Database Setup
The project uses PouchDB with IndexedDB. No external setup is required for local offline storage. To clear local data:
- Inspect -> Application -> IndexedDB -> Delete database or
- Run \`localStorage.clear()\` in console and refresh.

## Troubleshooting
- **Biome Errors**: If linting fails, run \`npm run format\` to auto-fix stylistic issues.
- **Missing API Key**: If the "Survival Radio" fails to respond, check if \`GROQ_API_KEY\` is correctly set in \`.env.local\`.
