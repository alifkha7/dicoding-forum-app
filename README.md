# Dicoding Forum App

A modern discussion forum web application built with React, Redux Toolkit, Tailwind CSS, Vitest, Storybook, and Cypress.

## Features
- **Authentication:** Login and Register with token persistence and preload state.
- **Threads:** Browse feed, view detail, and create discussions.
- **Interactions:** Optimistic voting on threads and comments, category filtering with URL sync.
- **Leaderboards:** Real-time user points leaderboard.
- **Security:** Strict HTML sanitization with DOMPurify against XSS attacks.
- **Component Isolation:** UI component stories documented with Storybook.
- **Testing:** Comprehensive test suite covering Unit, Reducer, Thunk, React Testing Library, and Cypress End-to-End.
- **CI/CD:** Automated pipeline with GitHub Actions and deployment on Vercel with branch protection.

## Scripts
- `npm run dev`: Start local development server
- `npm run build`: Build production bundle
- `npm test`: Run automated unit and component tests
- `npm run e2e`: Run headless Cypress end-to-end tests
- `npm run storybook`: Start Storybook development server
- `npm run build-storybook`: Build static Storybook documentation
- `npm run lint`: Run ESLint code quality checks
