---
inclusion: always
---

# AnythingLLM Development Rules

## Core Development Principles

### Package Management
- **Always use yarn** as the package manager, not npm
- Install packages using `yarn add <package>` instead of `npm install`
- Use `yarn add -D <package>` for development dependencies
- Run scripts using `yarn <script>` instead of `npm run`
- Initialize project using `yarn setup` to install all dependencies and configure environment

### Code Development Standards
- **Always use English** for code comments, variable names, error messages, and documentation
- **Support internationalization (i18n)** for user interface text with English and Chinese support
- Follow AnythingLLM official code style and architecture patterns
- Reference official GitHub repository implementation methods and best practices

### Context7 Integration
- **Prioritize Context7** for obtaining latest information when external documentation or API references are needed
- Query relevant official documentation and examples before implementing new features
- Ensure implementation follows AnythingLLM architecture and design patterns

### Official Resource References
- Primary reference source: https://github.com/Mintplex-Labs/anything-llm
- Review official repository code structure before implementation
- Follow official folder structure and naming conventions
- Reference official component design patterns and state management approaches

### Code Quality
- Maintain code consistency and readability
- Use appropriate TypeScript type definitions (if project uses TypeScript)
- Follow React best practices and hooks usage guidelines
- Ensure all new features have proper error handling

### Documentation and Comments
- All functions and components should have **English comments** explaining their purpose
- Complex logic should have detailed explanatory comments
- Keep README and related documentation updated
- Use JSDoc format for function documentation

### Internationalization (i18n)
- **All user-facing text must support internationalization**
- Use i18next for text localization
- Support both English and Chinese languages
- Store translation keys in appropriate locale files
- Never hardcode user-facing text in components

### Testing and Quality Assurance
- Write unit tests when possible
- Ensure new features don't break existing functionality
- Implement proper error handling and edge case testing

## Implementation Checklist

Before starting any development task, confirm:

1. ✅ Use yarn for package management
2. ✅ Review AnythingLLM official GitHub repository related implementations
3. ✅ Use Context7 to get latest technical documentation
4. ✅ All code comments and documentation use **English**
5. ✅ All user-facing text supports **internationalization (i18n)**
6. ✅ Follow official code structure and patterns
7. ✅ Implement proper error handling
8. ✅ Add necessary comments and documentation
9. ✅ Test both English and Chinese language support
10. ✅ Use translation keys instead of hardcoded text

## AnythingLLM Project Architecture

### Core Components
- **frontend**: ViteJS + React based UI for creating and managing LLM content
- **server**: NodeJS and Express based server handling all interactions, vector database operations, and LLM integrations
- **collector**: NodeJS Express based server for processing and parsing documents from UI
- **docker**: Contains Docker configuration instructions, build processes, and compilation information
- **embed**: Submodule for creating and integrating web embed widgets
- **browser-extension**: Chrome browser extension submodule

### Database Management (Prisma)
- Uses Prisma as ORM tool
- Database migration and seed data management
- Supports multiple database providers

## Common Commands

```bash
# Project initial setup (install all dependencies, configure environment files, run Prisma setup)
yarn setup

# Development environment startup
yarn dev:server      # Start backend server
yarn dev:frontend    # Start frontend development server
yarn dev:collector   # Start document collector
yarn dev:all         # Start all services simultaneously

# Prisma database management
yarn prisma:generate # Generate Prisma client
yarn prisma:migrate  # Execute database migrations
yarn prisma:seed     # Execute database seed data
yarn prisma:setup    # Complete Prisma setup

# Add new packages
yarn add <package-name>

# Add development dependencies
yarn add -D <package-name>

# Build project
yarn build

# Run tests
yarn test
```

## Environment Configuration

### Required Environment Files
- `server/.env.development` - Server development environment configuration
- Contains vector database connection settings
- LLM provider API key configuration
- Other service connection parameters

### Vector Database Support
AnythingLLM supports multiple vector databases:
- Chroma
- Weaviate  
- QDrant
- Milvus
- LanceDB

## API Development
- Provides complete developer API for custom integrations
- Supports OpenAI-compatible API format
- Includes document embedding and vector search functionality

## Internationalization Guidelines

### Translation File Structure
```
frontend/src/locales/
├── en/
│   └── common.json
├── zh/
│   └── common.json
└── index.js
```

### Usage Examples
```javascript
// Use translation keys instead of hardcoded text
const { t } = useTranslation();

// Good
<button>{t('common.save')}</button>

// Bad
<button>Save</button>
```

These rules ensure all development work complies with AnythingLLM official standards and best practices while supporting international community contributions.