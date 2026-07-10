# 🚀 RepoLens - AI Powered Codebase Knowledge Engine

> Understand any codebase in seconds using AI-powered repository intelligence, semantic search, and Retrieval-Augmented Generation (RAG).

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django-6.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)
![AI](https://img.shields.io/badge/Gemini-2.5%20Flash-orange)
![VectorDB](https://img.shields.io/badge/pgvector-Enabled-success)
![Deployment](https://img.shields.io/badge/Backend-Railway-purple)
![Frontend](https://img.shields.io/badge/Frontend-Vercel-black)
![Status](https://img.shields.io/badge/Version-v1.0-success)

---

## 📌 Overview

RepoLens is an AI-powered repository analysis platform that enables developers to upload a codebase and interact with it using natural language.

Instead of manually navigating thousands of lines of code, RepoLens analyzes the repository, extracts code intelligence, generates semantic embeddings, and allows users to ask AI-powered questions about the project.

The application uses **Retrieval-Augmented Generation (RAG)** to ensure the AI answers based on repository knowledge rather than hallucinating.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- JWT Authentication
- Secure Login
- Protected APIs

---

## 📁 Repository Management

- Create Projects
- Upload ZIP Repositories
- Repository Storage
- Repository Status Tracking

---

## 🧠 Code Intelligence

RepoLens automatically detects:

- Programming Languages
- Frameworks
- Dependencies
- Metadata
- Classes
- Functions
- Project Structure

---

## 🔍 Semantic Search

Each repository is transformed into semantic knowledge.

Pipeline:

Repository Upload

↓

Repository Scanner

↓

Repository Intelligence

↓

Sentence Transformers

↓

Vector Embeddings

↓

pgvector Storage

↓

Semantic Retrieval

↓

Gemini AI

---

## 🤖 AI Assistant

Ask questions like:

- How many files are in the project?
- Which frameworks are used?
- Explain the architecture.
- List all API endpoints.
- Which files handle authentication?
- What dependencies are installed?
- Describe the repository structure.

The AI answers using semantic retrieval over the uploaded repository.

---

# 🏗️ Architecture

```
                +------------------+
                |     Frontend     |
                |     (Vercel)     |
                +---------+--------+
                          |
                          |
                    REST API (JWT)
                          |
                          |
                +---------v--------+
                | Django Backend   |
                |     Railway      |
                +---------+--------+
                          |
      --------------------------------------------
      |                  |                       |
      |                  |                       |
Repository         Code Intelligence       AI Services
Upload             Repository Analysis      Gemini
      |                  |
      |                  |
      +--------> Semantic Engine
                     |
                     |
              Sentence Transformers
                     |
                     |
              Vector Embeddings
                     |
                     |
                 pgvector
                     |
                     |
             Semantic Retrieval
                     |
                     |
                 AI Response
```

---

# 🛠️ Tech Stack

## Frontend

- Vanilla JavaScript
- HTML5
- CSS3
- Vite

---

## Backend

- Django 6
- Django REST Framework
- JWT Authentication
- Gunicorn
- WhiteNoise

---

## Database

- PostgreSQL (Neon)
- pgvector

---

## AI

- Google Gemini 2.5 Flash
- Sentence Transformers
- Semantic Search
- Retrieval-Augmented Generation (RAG)

---

## Deployment

- Railway
- Vercel
- Neon PostgreSQL

---

# 📂 Project Structure

```
RepoLens
│
├── backend/
│   ├── apps/
│   │   ├── acounts/
│   │   ├── ai/
│   │   ├── codeintel/
│   │   ├── dashboard/
│   │   ├── intelligence/
│   │   ├── projects/
│   │   ├── repository_filtering/
│   │   └── semantic/
│   │
│   └── config/
│
├── frontend/
│
└── README.md
```

---

# 🚀 AI Processing Pipeline

```
Repository Upload

↓

ZIP Extraction

↓

Repository Scanner

↓

Language Detection

↓

Framework Detection

↓

Dependency Detection

↓

Repository Analyzer

↓

Embedding Pipeline

↓

Knowledge Embeddings

↓

Semantic Retrieval

↓

Gemini AI

↓

Natural Language Answer
```

---

# 🌐 Deployment

## Frontend

Vercel

## Backend

Railway

## Database

Neon PostgreSQL

---

# 📊 Version

## RepoLens v1.0

### Completed Features

- Authentication
- Repository Upload
- Repository Scanner
- Repository Intelligence
- Semantic Search
- Vector Embeddings
- AI Chat
- Dashboard
- Railway Deployment
- Vercel Deployment

---

# 🔮 Future Enhancements (v2)

- Streaming AI Responses
- Interactive Repository Tree
- Dependency Graph Visualization
- Code Viewer
- Architecture Diagram Generation
- Repository Summaries
- Better Semantic Ranking
- Background Processing
- Upload Progress Tracking
- Repository Comparison
- Team Collaboration
- Advanced Analytics

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

It helps others discover RepoLens and supports future development.