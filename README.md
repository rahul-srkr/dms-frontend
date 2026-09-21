# Document Management System

A responsive document management application built with React, TypeScript, Vite, and Tailwind CSS.

The application allows authenticated users to upload, search, preview, and download documents using categories, dates, tags, and search filters.

## Features

* OTP-based mobile number authentication
* Protected application routes
* Document upload with:

  * JPEG
  * PNG
  * GIF
  * WebP
  * PDF
* Maximum file size validation
* Category and sub-category selection
* Document date selection
* Mandatory document tags
* Optional document remarks
* Tag suggestions from the API
* Document search and filtering
* Search results with pagination support
* PDF and image preview
* Individual document download
* Download all search results as ZIP
* Offline search support using IndexedDB cache
* Responsive layout for desktop, tablet, and mobile
* Online/offline status indication

## Tech Stack

* React
* TypeScript
* Vite
* React Router
* TanStack React Query
* Axios
* Zod
* Tailwind CSS
* React Day Picker
* Dexie
* date-fns

## Project Structure

```text
src/
├── api/
│   ├── client.ts
│   ├── auth.api.ts
│   ├── documents.api.ts
│   ├── tags.api.ts
│   └── schemas/
│
├── components/
│   ├── auth/
│   ├── layout/
│   └── ui/
│
├── constants/
│
├── context/
│
├── features/
│   ├── search/
│   └── upload/
│
├── hooks/
│
├── lib/
│
├── pages/
│
├── utils/
│
└── workers/
```

## Requirements

Make sure the following are installed:

* Node.js
* npm

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://apis.allsoft.co/api/documentManagement
```

The application uses this value as the base URL for the backend API.

## Run the Application

Start the development server:

```bash
npm run dev
```

The application will be available at the local URL shown by Vite.

## Build for Production

Create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Authentication Flow

The application uses OTP-based authentication.

```text
Enter Mobile Number
        ↓
Generate OTP
        ↓
Enter OTP
        ↓
Validate OTP
        ↓
Receive Authentication Token
        ↓
Access Protected Application
```

The authentication token is stored in `sessionStorage` and automatically added to authenticated API requests.

## Document Upload

Users can upload supported documents by providing:

* Document file
* Category
* Sub-category
* Document date
* At least one tag
* Optional remarks

The upload request sends the document as `multipart/form-data`.

## Document Search

Documents can be searched using:

* Category
* Sub-category
* Date range
* Tags
* Search text

Search parameters are reflected in the URL so that the search state can be preserved and shared.

## Document Preview

The application supports previewing:

* PDF files
* JPG/JPEG images
* PNG images
* GIF images
* WebP images
* SVG images returned by the search API

Other file types can be downloaded for local viewing.

## Offline Support

Search results are cached locally using IndexedDB through Dexie.

When the application is offline, previously cached search results can be displayed where available.

## API Endpoints

The application communicates with the Document Management API.

### Authentication

```text
POST /generateOTP
POST /validateOTP
```

### Documents

```text
POST /saveDocumentEntry
POST /searchDocumentEntry
```

### Tags

```text
POST /documentTags
```

## Development

Run the application:

```bash
npm run dev
```

Run the production build:

```bash
npm run build
```

The project uses TypeScript for type safety, Zod for API response validation, and React Query for server-state management.

```

This is much more appropriate for your assignment than the default Vite README. I also kept it straightforward rather than adding unnecessary architecture or documentation that isn't actually implemented.
```
