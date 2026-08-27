# AI Product Builder

An AI-powered SaaS MVP that transforms a website idea into a structured product concept. Users can provide a website URL, product description, and target customer; the system analyzes the product and generates a proposed product structure that can then be refined through natural-language instructions.

**Live Application:** https://ai-product-builder-kappa.vercel.app/

**GitHub Repository:** https://github.com/lilmissmuffet/ai-product-builder

---

## 1. Overview

AI Product Builder is an AI-assisted product ideation and planning platform built for the **AI Product Engineer technical assessment**.

The application allows a user to:

1. Create an account and authenticate.
2. Create a product project.
3. Enter a website URL, product description, and target customer.
4. Ask the AI to analyze the existing product.
5. View the generated product analysis.
6. Generate a proposed product concept.
7. Modify the concept using natural-language instructions.
8. Save the project.
9. Reopen previously saved projects.

The goal was to demonstrate an end-to-end AI engineering workflow covering:

**Product thinking → UI → AI integration → backend APIs → authentication → database → debugging → deployment**

---

# 2. Architecture

The application follows a full-stack Next.js architecture.

```text
                    ┌──────────────────────────┐
                    │        User / Browser    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   Next.js / React UI     │
                    │   TypeScript + Tailwind  │
                    └────────────┬─────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │                           │
                   ▼                           ▼
        ┌────────────────────┐       ┌────────────────────┐
        │ Supabase Auth      │       │ Next.js API Routes │
        │                    │       │                    │
        │ Sign up            │       │ /api/analyze       │
        │ Login              │       │ /api/build         │
        │ Logout             │       │ Error handling     │
        │ Sessions           │       └─────────┬──────────┘
        └─────────┬──────────┘                 │
                  │                            │
                  ▼                            ▼
        ┌────────────────────┐       ┌────────────────────┐
        │ Supabase           │       │ Google Gemini API  │
        │ PostgreSQL         │       │                    │
        │                    │       │ Product analysis   │
        │ Projects           │       │ Product concept    │
        │ User data          │       │ Iterative changes  │
        └────────────────────┘       └────────────────────┘
```

### Request Flow

**Product Analysis**

```text
User Input
   ↓
React / Next.js UI
   ↓
POST /api/analyze
   ↓
Gemini API
   ↓
Structured AI analysis
   ↓
UI displays results
   ↓
Project can be saved to Supabase
```

**Product Builder**

```text
Analysis
   ↓
"Build My Product"
   ↓
POST /api/build
   ↓
Gemini API
   ↓
Product concept
   ↓
Product name + description
+ features + navigation
+ pages + UI direction
   ↓
Displayed in dashboard
```

**Natural-Language Modification**

```text
User instruction
   ↓
Product concept + instruction
   ↓
Gemini
   ↓
Updated product concept
   ↓
Dashboard
```

---

# 3. Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* Next.js API Routes
* Server-side API handling
* Environment-based secret management

## Database

* Supabase
* PostgreSQL

## Authentication

* Supabase Auth
* Email/password authentication
* Session-based protected dashboard

## AI

* Google Gemini API
* Gemini `gemini-2.5-flash`

## Development Tools

* VS Code
* Git
* GitHub
* GPT Codex as the primary AI coding agent

## Deployment

* Vercel

---

# 4. Core Features

## Authentication

The application supports:

* User registration
* User login
* User logout
* Session management
* Protected dashboard access

Authentication is handled through Supabase Auth.

---

## AI Product Analyzer

The user provides:

* Website URL
* Product description
* Target customer

The AI generates:

* Existing product description
* Target users
* Core problem
* Key features
* Business model
* Suggested improvements
* Proposed MVP features

---

## AI Product Builder

After analysis, the user can select **Build My Product**.

The AI generates:

* Product name
* Product description
* Feature list
* Navigation structure
* Page structure
* UI direction

---

## Natural-Language Product Modification

The generated concept can be modified through conversational instructions.

Examples:

```text
Make the design more premium.
```

```text
Add a dashboard.
```

```text
Remove the pricing page.
```

```text
Make it suitable for enterprise customers.
```

The AI uses the existing product concept together with the user's instruction to produce an updated concept.

---

## Project Persistence

Projects are stored in Supabase PostgreSQL.

Users can:

* Save projects
* Reopen previous projects
* Continue modifying existing concepts
* Maintain project-specific AI data

---

# 5. API Endpoints

The application uses Next.js API routes for server-side AI operations.

## `POST /api/analyze`

Analyzes the submitted product information using Gemini.

### Input

```json
{
  "websiteUrl": "https://example.com",
  "productDescription": "Description of the product",
  "targetCustomer": "Small businesses"
}
```

### Output

A structured AI-generated product analysis containing information such as:

* Product overview
* Target users
* Core problem
* Features
* Business model
* Improvements
* MVP recommendations

---

## `POST /api/build`

Generates a product concept based on the analysis and user requirements.

### Output

A structured product concept containing:

* Product name
* Description
* Features
* Navigation
* Pages
* UI direction

---

## Supabase APIs

Supabase is used for:

* Authentication
* User sessions
* PostgreSQL database operations
* Project persistence

---

# 6. Database Structure

The main database table is:

## `public.projects`

| Column                | Type      | Purpose                                    |
| --------------------- | --------- | ------------------------------------------ |
| `id`                  | UUID      | Unique project identifier                  |
| `user_id`             | UUID      | References the authenticated Supabase user |
| `name`                | TEXT      | Project name                               |
| `website_url`         | TEXT      | Website provided for analysis              |
| `product_description` | TEXT      | User's product description                 |
| `target_customer`     | TEXT      | Intended customer/user                     |
| `analysis`            | JSONB     | AI-generated product analysis              |
| `concept`             | JSONB     | AI-generated product concept               |
| `conversation`        | JSONB     | Natural-language modification history      |
| `created_at`          | TIMESTAMP | Project creation timestamp                 |

The `user_id` column is linked to `auth.users`.

Row Level Security is used so that project data is associated with the authenticated user.

---

# 7. Environment Variables

Create a `.env.local` file in the project root.

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Important

Environment variables containing secrets should **never be committed to GitHub**.

The production deployment uses the corresponding environment variables configured in Vercel.

---

# 8. Local Setup

## Prerequisites

Install:

* Node.js 18+
* npm
* Git

You also need:

* A Supabase project
* A Google Gemini API key

---

## Clone the repository

```bash
git clone https://github.com/lilmissmuffet/ai-product-builder.git
cd ai-product-builder
```

---

## Install dependencies

```bash
npm install
```

---

## Configure environment variables

Create:

```text
.env.local
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Configure Supabase

Create the required `projects` table in the Supabase SQL Editor.

The database should include the project fields described in the **Database Structure** section.

Enable:

**Authentication → Providers → Email**

Configure the appropriate authentication redirect URLs for local development and production.

---

## Run the development server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

## Run linting

```bash
npm run lint
```

---

## Production build

```bash
npm run build
```

---

# 9. AI Integration

The application uses Google's Gemini API for the AI functionality.

The Gemini model receives structured product information and instructions and is used for two major workflows:

### Product Analysis

The model interprets:

```text
Website URL
+
Product Description
+
Target Customer
```

and produces a structured product analysis.

### Product Building

The model takes the analysis and generates a proposed product structure.

### Iterative Modification

The model can receive the existing concept together with a natural-language instruction and return an updated concept.

This allows the user to interact with the product concept conversationally instead of manually editing every field.

---

# 10. AI Development Process

The project was developed extensively using **GPT Codex as an AI coding agent**, rather than manually writing the entire application.

The development process broadly followed:

```text
Technical task analysis
        ↓
Project scaffolding
        ↓
Frontend implementation
        ↓
Supabase integration
        ↓
Authentication
        ↓
Gemini integration
        ↓
Database persistence
        ↓
AI product analysis
        ↓
AI product builder
        ↓
Natural-language modification
        ↓
Debugging
        ↓
Production configuration
        ↓
Vercel deployment
        ↓
Live testing
```

Codex was used for implementation, code changes, debugging assistance, and iterative development.

The AI-generated implementation was manually tested and corrected where necessary.

---

# 11. Debugging & Engineering Challenges

Several issues were encountered during development and resolved through iterative debugging.

## Issue 1 — Supabase database schema was not applied

### Problem

The application initially could not save projects and returned an error indicating that the Supabase migration/schema needed to be applied.

### Root Cause

The application code expected the `projects` table and corresponding database structure, but the schema had not yet been applied to the Supabase project.

### Solution

The required PostgreSQL schema was executed in the Supabase SQL Editor.

After applying the schema, project persistence worked correctly.

---

## Issue 2 — Supabase authentication redirect configuration

### Problem

The confirmation email initially attempted to redirect to localhost while the expected local development server was not available on the required port.

### Root Cause

The authentication redirect configuration and local development server state were not aligned.

### Solution

The Supabase authentication URL configuration was corrected and the Next.js development server was restarted on the expected port.

Authentication could then successfully return to the application.

---

## Issue 3 — Next.js development port conflict

### Problem

Port `3000` was already being used by another process, causing the application to start on another port and creating problems with authentication redirects.

### Solution

The conflicting development process was identified and the application was restarted on the expected port.

---

## Issue 4 — React attempted to render an object directly

### Problem

React produced:

```text
Objects are not valid as a React child
```

The problematic object contained UI-direction information such as:

```text
palette
typography
layoutStyle
visualTone
```

### Root Cause

The AI response contained a structured object while the UI attempted to render it directly as a React child.

### Solution

The response handling/rendering logic was corrected so structured AI data is rendered through the appropriate UI representation instead of being passed directly as a React child.

---

## Issue 5 — Production environment variables

### Problem

The deployed application required the same AI and Supabase configuration as the local environment.

### Solution

The required production environment variables were configured in Vercel, allowing the deployed application to communicate with Supabase and Gemini correctly.

---

# 12. Deployment

The application was deployed using **Vercel**.

Deployment process:

```text
Local project
    ↓
Git repository
    ↓
GitHub
    ↓
Vercel project
    ↓
Production environment variables
    ↓
Production build
    ↓
Public deployment
```

The deployed application is publicly accessible without requiring the evaluator to configure a local development environment.

### Production URL

https://ai-product-builder-kappa.vercel.app/

---

# 13. Security Considerations

* API secrets are stored in environment variables.
* Gemini API credentials are not exposed directly in the frontend.
* Supabase handles authentication.
* Project records are associated with authenticated users.
* Database access uses Supabase Row Level Security.
* `.env.local` should not be committed to source control.

---

# 14. Known Limitations

This project focuses on demonstrating the core AI product-engineering workflow within the assessment timeframe.

Current limitations include:

1. **Website analysis is primarily content/product oriented.**
   The system does not perform full visual screenshot analysis of the submitted website.

2. **The builder currently generates a structured product concept rather than a complete production application.**
   It produces the proposed product architecture, pages, navigation, features, and UI direction rather than automatically generating and deploying an entire new codebase.

3. **AI output depends on the quality of the supplied input and model response.**
   Generated product recommendations may require human review.

4. **The application is an MVP.**
   Advanced production features such as extensive observability, background job processing, rate limiting, automated testing infrastructure, and multi-agent orchestration could be added in a future version.

5. **Authentication currently focuses on email/password.**
   Additional providers such as Google OAuth could be added later.

---

# 15. Future Improvements

If development continued beyond the assessment, the next improvements would include:

* Website screenshot capture and visual analysis
* Actual generated UI pages
* Live preview of generated products
* Starter code generation
* Multi-agent workflow:

  * Research Agent
  * Product Agent
  * UI Agent
  * Coding Agent
  * QA Agent
* Automated AI-powered QA
* Streaming AI responses
* Background processing for longer AI tasks
* More comprehensive test coverage
* Rate limiting and usage quotas
* Analytics and project version history
* Additional authentication providers
* Production observability and monitoring

---

# 16. Assessment Requirements Covered

| Requirement                   | Implementation      |
| ----------------------------- | ------------------- |
| Public landing page           | Yes                 |
| AI Product Analyzer           | Yes                 |
| Actual LLM API                | Google Gemini       |
| AI Product Builder            | Yes                 |
| Natural-language modification | Yes                 |
| Backend APIs                  | Next.js API routes  |
| Database                      | Supabase PostgreSQL |
| Authentication                | Supabase Auth       |
| Protected dashboard           | Yes                 |
| Save projects                 | Yes                 |
| Reopen projects               | Yes                 |
| Environment variables         | Yes                 |
| Error handling                | Yes                 |
| AI coding agent               | GPT Codex           |
| Debugging examples            | Documented          |
| Public deployment             | Vercel              |
| GitHub repository             | Yes                 |

---

## 17. Conclusion

AI Product Builder demonstrates an end-to-end approach to building an AI-powered SaaS product using an AI coding agent.

The project combines:

**Next.js + React + TypeScript + Tailwind + Supabase +  Gemini + Vercel**

to provide a complete workflow from user input and AI analysis through product concept generation, iterative modification, persistence, authentication, debugging, and public deployment.

