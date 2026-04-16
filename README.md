# Associate Frontend Developer Assessment

This project implements the requested stack with:

- React frontend (responsive landing page + task CRUD UI)
- Node.js + Express backend
- CRUD APIs for tasks and task comments
- Automated API tests using Jest + Supertest

## Project Structure

- `frontend/` - Vite + React UI
- `backend/` - Express API and tests

## Run Locally

1. Install dependencies

```bash
npm run install:all
```

2. Start backend

```bash
npm run dev:backend
```

Backend runs on `http://localhost:4000`.

3. Start frontend (new terminal)

```bash
npm run dev:frontend
```

Frontend runs on `http://localhost:5173`.

## Test APIs

```bash
npm test
```

## API Endpoints

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:taskId`
- `PUT /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

### Comments (for a given task)

- `GET /api/tasks/:taskId/comments`
- `POST /api/tasks/:taskId/comments`
- `PUT /api/tasks/:taskId/comments/:commentId`
- `DELETE /api/tasks/:taskId/comments/:commentId`

## Submission Tips

For the email to Better Marketing:

- Subject: `Associate Frontend Developer (Framer-Only) - Charan - Assessment`
- Include deployed website URL
- Include a short walkthrough video showing:
  - Responsive behavior on mobile/tablet/desktop/ultrawide
  - Semantic headings and section structure
  - SEO metadata and image alt tags
  - Clean hierarchy and naming
  - API CRUD flow + test evidence

## Notes

- Current backend storage is in-memory for speed of implementation.
- For production/demo persistence, you can swap the store module with a database (MongoDB/PostgreSQL) without changing route contracts.
