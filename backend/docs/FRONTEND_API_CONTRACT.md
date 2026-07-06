# 1. Authentication APIs

## Base URL

```
/api/auth/
```

Authentication endpoints are available under `/api/auth/`.

---

# 1.1 Register User

### Endpoint

```
POST /api/auth/register/
```

### Authentication Required

No

### Headers

```
Content-Type: application/json
```

### Path Parameters

None

### Query Parameters

None

### Request Body

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

### Success Response (201 Created)

```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com"
}
```

> **Note:** `password` is `write_only` and is never returned in the response.

### Error Response (400 Bad Request)

```json
{
  "email": [
    "user with this email already exists."
  ]
}
```

or

```json
{
  "username": [
    "This field is required."
  ]
}
```

### Response Field Description

| Field | Type | Description |
|--------|------|-------------|
| id | Integer | Unique user ID |
| username | String | Username of the registered user |
| email | String | Registered email address |

### Frontend Mapping

**Frontend Page:** Register Page

**Consumes API:**

```
POST /api/auth/register/
```

**Fields Used By:**

- Registration Form
- Success Notification
- Redirect to Login

---

# 1.2 Login

### Endpoint

```
POST /api/auth/login/
```

### Authentication Required

No

### Headers

```
Content-Type: application/json
```

### Path Parameters

None

### Query Parameters

None

### Request Body

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

### Success Response (200 OK)

```json
{
  "refresh": "<jwt_refresh_token>",
  "access": "<jwt_access_token>"
}
```

### Error Response (401 Unauthorized)

```json
{
  "detail": "No active account found with the given credentials"
}
```

### Response Field Description

| Field | Type | Description |
|--------|------|-------------|
| access | String | JWT Access Token |
| refresh | String | JWT Refresh Token |

### Frontend Mapping

**Frontend Page:** Login Page

**Consumes API:**

```
POST /api/auth/login/
```

**Fields Used By:**

- Login Form
- Authentication Service
- Token Storage
- Route Protection

---

# 1.3 Refresh Access Token

### Endpoint

```
POST /api/auth/refresh/
```

### Authentication Required

No

### Headers

```
Content-Type: application/json
```

### Path Parameters

None

### Query Parameters

None

### Request Body

```json
{
  "refresh": "<jwt_refresh_token>"
}
```

### Success Response (200 OK)

```json
{
  "access": "<new_access_token>"
}
```

### Error Response (401 Unauthorized)

```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

### Response Field Description

| Field | Type | Description |
|--------|------|-------------|
| access | String | Newly generated JWT access token |

### Frontend Mapping

**Frontend:** Global Authentication Service

**Consumes API:**

```
POST /api/auth/refresh/
```

**Fields Used By:**

- Automatic Token Refresh
- Session Management
- Silent Authentication

---

# Authentication Flow

```
User Registers
      │
      ▼
POST /api/auth/register/

      │
      ▼
User Logs In

      │
      ▼
POST /api/auth/login/

      │
      ▼
Receive

- access token
- refresh token

      │
      ▼
Store Tokens

      │
      ▼
Use

Authorization: Bearer <access_token>

for every protected API.

      │
      ▼
Access Token Expires

      │
      ▼
POST /api/auth/refresh/

      │
      ▼
Receive New Access Token
```

---

# Frontend Integration Notes

- Login uses **email**, not username.
- Store both `access` and `refresh` tokens securely.
- Every protected API must include:

```
Authorization: Bearer <access_token>
```

- Never store or display the user's password.
- Use the refresh token only to obtain a new access token.
- On refresh failure, clear stored tokens and redirect the user to the Login page.

---


# 2. Project APIs

All Project APIs require JWT Authentication.

Base URL:

```
/api/projects/
```

Required Header:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

# 2.1 Create Project

### Endpoint

```
POST /api/projects/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Path Parameters

None

### Query Parameters

None

### Request Body

```json
{
  "name": "RepoLens",
  "description": "Repository analysis platform",
  "upload_type": "zip",
  "repository_name": "RepoLens",
  "storage_path": "repositories/repolens"
}
```

### Success Response (201 Created)

```json
{
  "id": 1,
  "owner": "user@example.com",
  "name": "RepoLens",
  "description": "Repository analysis platform",
  "upload_type": "zip",
  "repository_name": "RepoLens",
  "storage_path": "repositories/repolens",
  "status": "pending",
  "created_at": "2026-07-05T18:20:10Z",
  "updated_at": "2026-07-05T18:20:10Z"
}
```

### Error Response (400 Bad Request)

```json
{
    "<field_name>": [
        "<validation_error>"
    ]
}
```

### Response Field Description

| Field | Type | Description |
|--------|------|-------------|
| id | Integer | Project ID |
| owner | String | Owner email |
| name | String | Project name |
| description | String | Project description |
| upload_type | String | Upload method |
| repository_name | String | Repository name |
| storage_path | String | Repository storage location |
| status | String | Current processing status |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

### Frontend Mapping

**Frontend Page**

Create Project Modal

**Consumes API**

```
POST /api/projects/
```

**Fields Used By**

- Create Project Form
- Dashboard Refresh
- Repository List

---

# 2.2 List Projects

### Endpoint

```
GET /api/projects/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

None

### Query Parameters

None

### Success Response (200 OK)

```json
[
    {
        "id": 1,
        "owner": "user@example.com",
        "name": "RepoLens",
        "description": "Repository analysis platform",
        "upload_type": "zip",
        "repository_name": "RepoLens",
        "storage_path": "repositories/repolens",
        "status": "completed",
        "created_at": "2026-07-05T18:20:10Z",
        "updated_at": "2026-07-05T18:40:35Z"
    }
]
```

### Error Response

```json
{
    "detail": "Authentication credentials were not provided."
}
```

### Frontend Mapping

**Frontend Page**

Dashboard

**Consumes API**

```
GET /api/projects/
```

**Fields Used By**

- Repository Cards
- Project Table
- Recent Projects
- Project Selector

---

# 2.3 Project Detail

### Endpoint

```
GET /api/projects/{id}/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

| Name | Type | Description |
|------|------|-------------|
| id | Integer | Project ID |

### Query Parameters

None

### Success Response (200 OK)

```json
{
    "id": 1,
    "owner": "user@example.com",
    "name": "RepoLens",
    "description": "Repository analysis platform",
    "upload_type": "zip",
    "repository_name": "RepoLens",
    "storage_path": "repositories/repolens",
    "status": "completed",
    "created_at": "2026-07-05T18:20:10Z",
    "updated_at": "2026-07-05T18:40:35Z"
}
```

### Error Response (404)

```json
{
    "detail": "Not found."
}
```

### Frontend Mapping

**Frontend Page**

Repository Details

**Consumes API**

```
GET /api/projects/{id}/
```

**Fields Used By**

- Repository Header
- Project Information
- Status Badge

---

# 2.4 Update Project

### Endpoint

```
PUT /api/projects/{id}/
PATCH /api/projects/{id}/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Path Parameters

| Name | Type | Description |
|------|------|-------------|
| id | Integer | Project ID |

### Request Body

Any writable fields:

```json
{
    "name": "Updated RepoLens",
    "description": "Updated description",
    "upload_type": "zip",
    "repository_name": "RepoLens",
    "storage_path": "repositories/repolens"
}
```

### Success Response

Returns the complete updated Project object.

### Frontend Mapping

**Frontend Page**

Edit Project Modal

---

# 2.5 Delete Project

### Endpoint

```
DELETE /api/projects/{id}/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
```

### Success Response

```
204 No Content
```

### Error Response

```json
{
    "detail": "Not found."
}
```

### Frontend Mapping

**Frontend Page**

Project List

**Fields Used By**

- Delete Button
- Remove Card
- Refresh Dashboard

---

# 2.6 Upload Repository ZIP

### Endpoint

```
POST /api/projects/{id}/upload/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Path Parameters

| Name | Type | Description |
|------|------|-------------|
| id | Integer | Project ID |

### Query Parameters

None

### Request Body (multipart/form-data)

| Field | Type | Required |
|------|------|----------|
| zip_file | File (.zip) | Yes |

### Validation Rules

- Only `.zip` files are accepted.
- Maximum size: **100 MB**.

### Success Response (200 OK)

```json
{
    "message": "ZIP uploaded and repository processed successfully.",
    "status": "completed"
}
```

### Error Response

Invalid Extension

```json
{
    "zip_file": [
        "Only ZIP files are allowed."
    ]
}
```

Large File

```json
{
    "zip_file": [
        "ZIP file size cannot exceed 100 MB."
    ]
}
```

Project Not Found

```json
{
    "detail": "Not found."
}
```

### Response Field Description

| Field | Type | Description |
|--------|------|-------------|
| message | String | Upload result message |
| status | String | Current project processing status |

### Frontend Mapping

**Frontend Page**

Repository Upload

**Consumes API**

```
POST /api/projects/{id}/upload/
```

**Fields Used By**

- Upload Component
- Progress Screen
- Success Notification
- Processing Status
- Redirect to Dashboard

---

# Project Integration Notes

- Every Project endpoint requires JWT authentication.
- `owner` is returned as the user's **email**.
- `id`, `owner`, `status`, `created_at`, and `updated_at` are read-only.
- Repository upload must use **multipart/form-data**.
- Upload field name **must be exactly**:

```
zip_file
```

- Accepted file type: `.zip`
- Maximum upload size: **100 MB**.
- After a successful upload, use the returned `status` to update the UI immediately.
- Project list is ordered by **newest first** (`created_at` descending).

---


# 3. Dashboard APIs

All Dashboard APIs require JWT Authentication.

Base URL

```
/api/dashboard/
```

Required Header

```
Authorization: Bearer <access_token>
```

---

# 3.1 Dashboard

### Endpoint

```
GET /api/dashboard/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

None

### Query Parameters

None

### Success Response (200 OK)

```json
{
  "summary": {
    "total_repositories": 10,
    "total_files": 540,
    "total_functions": 923,
    "total_classes": 74,
    "total_frameworks": 6,
    "total_languages": 8
  },
  "recent_repositories": [
    {
      "id": 1,
      "name": "RepoLens",
      "repository_name": "RepoLens",
      "status": "completed",
      "created_at": "2026-07-05T18:20:10Z"
    }
  ],
  "processing_status": [
    {
      "status": "completed",
      "count": 8
    }
  ],
  "language_distribution": [
    {
      "language": "Python",
      "count": 320
    }
  ],
  "project_type_distribution": [
    {
      "value": "Django",
      "count": 4
    }
  ]
}
```

### Response Field Description

#### summary

| Field | Type | Description |
|------|------|-------------|
| total_repositories | Integer | Total repositories |
| total_files | Integer | Total repository files |
| total_functions | Integer | Total detected functions |
| total_classes | Integer | Total detected classes |
| total_frameworks | Integer | Total detected frameworks |
| total_languages | Integer | Total detected languages |

#### recent_repositories

| Field | Type | Description |
|------|------|-------------|
| id | Integer | Project ID |
| name | String | Project name |
| repository_name | String | Repository name |
| status | String | Processing status |
| created_at | DateTime | Creation timestamp |

#### processing_status

| Field | Type | Description |
|------|------|-------------|
| status | String | Repository processing status |
| count | Integer | Number of repositories |

#### language_distribution

| Field | Type | Description |
|------|------|-------------|
| language | String | Programming language |
| count | Integer | Number of files |

#### project_type_distribution

| Field | Type | Description |
|------|------|-------------|
| value | String | Project type |
| count | Integer | Number of repositories |

### Frontend Mapping

**Frontend Page**

Dashboard

**Fields Used By**

- Summary Cards
- Recent Repository Table
- Status Chart
- Language Chart
- Project Type Chart

---

# 3.2 Repository Overview

### Endpoint

```
GET /api/dashboard/projects/{project_id}/overview/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

| Name | Type |
|------|------|
| project_id | Integer |

### Success Response

Returns the complete repository overview generated by the backend analyzer.

> The frontend should consume the response exactly as returned without renaming fields.

### Frontend Mapping

**Frontend Page**

Repository Details

**Fields Used By**

- Repository Information
- Framework Cards
- Dependency List
- Metadata Section
- Repository Statistics

---

# 3.3 Repository Explorer

### Endpoint

```
GET /api/dashboard/projects/{project_id}/explorer/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

| Name | Type |
|------|------|
| project_id | Integer |

### Success Response

```json
{
  "project": "RepoLens",
  "tree": [
    {
      "name": "apps",
      "type": "folder",
      "children": [
        {
          "id": 25,
          "name": "views.py",
          "path": "backend/apps/views.py",
          "extension": ".py",
          "language": "Python",
          "size": 4201,
          "type": "file"
        }
      ]
    }
  ]
}
```

### Response Field Description

#### Root

| Field | Type | Description |
|------|------|-------------|
| project | String | Project name |
| tree | Array | Repository tree |

#### Tree Node

| Field | Type | Description |
|------|------|-------------|
| id | Integer | Repository file ID (files only) |
| name | String | File/Folder name |
| path | String | Relative repository path |
| extension | String | File extension |
| language | String | Programming language |
| size | Integer | File size |
| type | String | `folder` or `file` |
| children | Array | Child nodes (folders only) |

### Frontend Mapping

**Frontend Page**

Repository Explorer

**Fields Used By**

- Folder Tree
- Expand/Collapse
- File Click
- Code Viewer Navigation

---

# 3.4 Repository Insights

### Endpoint

```
GET /api/dashboard/projects/{project_id}/insights/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

| Name | Type |
|------|------|
| project_id | Integer |

### Success Response

Returns the same repository analysis generated by the Repository Analyzer.

### Frontend Mapping

**Frontend Page**

Repository Insights

**Fields Used By**

- Repository Analytics
- Framework Analysis
- Dependency Analysis
- Statistics
- Visualizations

---

# 3.5 Repository File

### Endpoint

```
GET /api/dashboard/projects/{project_id}/files/{file_id}/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

| Name | Type |
|------|------|
| project_id | Integer |
| file_id | Integer |

### Success Response

```json
{
  "id": 125,
  "filename": "views.py",
  "path": "backend/apps/views.py",
  "language": "Python",
  "extension": ".py",
  "size": 4201,
  "content": "from rest_framework.views import APIView..."
}
```

### Response Field Description

| Field | Type | Description |
|------|------|-------------|
| id | Integer | Repository File ID |
| filename | String | File name |
| path | String | Repository path |
| language | String | Programming language |
| extension | String | File extension |
| size | Integer | File size |
| content | String | Complete file content |

### Frontend Mapping

**Frontend Page**

Code Viewer

**Fields Used By**

- Editor
- Syntax Highlighting
- Breadcrumb
- File Information
- Copy Code
- Search Within File

---

# Dashboard Integration Notes

- Every Dashboard endpoint requires JWT authentication.
- Dashboard data is read-only.
- Repository Explorer returns a recursive tree structure.
- Folder nodes contain a `children` array.
- File nodes never contain `children`.
- Load file content **only after** the user selects a file.
- The `content` field may be an empty string if the backend cannot read the file.
- Use `id` from the Explorer response when requesting a file.
- Repository Overview and Repository Insights return analyzer-generated data. The frontend should render the JSON exactly as returned without assuming fixed keys unless explicitly documented.

---


# 4. AI APIs

All AI APIs require JWT Authentication.

Base URL

```
/api/ai/
```

Required Header

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

# 4.1 AI Chat

### Endpoint

```
POST /api/ai/chat/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Path Parameters

None

### Query Parameters

None

### Request Body

```json
{
    "project_id": 1,
    "question": "How many files are present in this repository?"
}
```

### Request Field Description

| Field | Type | Description |
|------|------|-------------|
| project_id | Integer | Repository(Project) ID |
| question | String | User question for the AI |

---

### Success Response (200 OK)

```json
{
    "success": true,
    "provider": "gemini",
    "answer": "The repository contains 154 files."
}
```

### Success Response Fields

| Field | Type | Description |
|------|------|-------------|
| success | Boolean | Indicates whether the AI request succeeded |
| provider | String | AI provider used to generate the response |
| answer | String | Final AI generated answer |

---

### Error Response (500 Internal Server Error)

```json
{
    "success": false,
    "error": "Error message"
}
```

### Error Response Fields

| Field | Type | Description |
|------|------|-------------|
| success | Boolean | Always false on failure |
| error | String | Error returned by the backend |

---

### Validation Error (400 Bad Request)

```json
{
    "project_id": [
        "This field is required."
    ]
}
```

or

```json
{
    "question": [
        "This field is required."
    ]
}
```

---

### Project Not Found (404)

```json
{
    "detail": "Not found."
}
```

---

### Frontend Mapping

**Frontend Page**

AI Chat

**Consumes API**

```
POST /api/ai/chat/
```

**Fields Used By**

- Chat Window
- Message Input
- Send Button
- Loading Spinner
- AI Response Area
- Conversation History
- Error Notification

---

# AI Integration Notes

- Every AI request requires JWT authentication.
- `project_id` must be a valid existing project.
- The frontend must send **exactly one question** per request.
- Display the `answer` field exactly as returned by the backend.
- The `provider` field can be used for debugging or showing the active AI model.
- If `success` is `false`, display the `error` message to the user.
- Disable the Send button while waiting for the response.
- Show a loading indicator until the request completes.
- The backend currently returns a single response and **does not support streaming**.
- Conversation history should be maintained on the frontend if required, as the API is stateless.

---


# 5. Intelligence APIs

All Intelligence APIs require JWT Authentication.

Base URL

```
/api/intelligence/
```

Required Header

```
Authorization: Bearer <access_token>
```

---

# 5.1 Repository Intelligence

### Endpoint

```
GET /api/intelligence/{project_id}/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

| Name | Type | Description |
|------|------|-------------|
| project_id | Integer | Repository(Project) ID |

### Query Parameters

None

### Success Response (200 OK)

```json
{
  "identity": {
    "name": "RepoLens",
    "repository": "RepoLens",
    "type": "Django"
  },
  "languages": [
    "Python",
    "HTML",
    "CSS"
  ],
  "frameworks": [
    "Django",
    "DRF"
  ],
  "dependencies": [
    "django",
    "djangorestframework"
  ],
  "metadata": [
    {
      "key": "project_type",
      "value": "Django"
    }
  ],
  "entry_points": [
    "manage.py"
  ],
  "statistics": {
    "files": 200,
    "python_files": 120,
    "javascript_files": 15,
    "html_files": 30,
    "css_files": 20,
    "functions": 560,
    "classes": 82,
    "imports": 640,
    "dependencies": 28,
    "frameworks": 2,
    "metadata": 10,
    "total_size_bytes": 2456789,
    "largest_file": {
      "path": "apps/dashboard/views.py",
      "size": 12345
    },
    "average_file_size_bytes": 1450.75,
    "extension_stats": {
      ".py": 120,
      ".html": 30
    },
    "language_distribution": {
      "Python": 120,
      "HTML": 30
    },
    "source_files": 180,
    "avg_functions_per_file": 3.11
  }
}
```

### Response Field Description

#### identity

| Field | Type | Description |
|------|------|-------------|
| name | String | Project name |
| repository | String | Repository name |
| type | String | Detected project type |

#### languages

Array of detected programming languages.

#### frameworks

Array of detected frameworks.

#### dependencies

Array of detected dependencies.

#### metadata

Array of metadata objects.

| Field | Type |
|------|------|
| key | String |
| value | String |

#### entry_points

Array of detected application entry points.

#### statistics

| Field | Type |
|------|------|
| files | Integer |
| python_files | Integer |
| javascript_files | Integer |
| html_files | Integer |
| css_files | Integer |
| functions | Integer |
| classes | Integer |
| imports | Integer |
| dependencies | Integer |
| frameworks | Integer |
| metadata | Integer |
| total_size_bytes | Integer |
| largest_file | Object |
| average_file_size_bytes | Float |
| extension_stats | Object |
| language_distribution | Object |
| source_files | Integer |
| avg_functions_per_file | Float |

### Frontend Mapping

**Frontend Page**

Repository Intelligence

**Fields Used By**

- Repository Summary
- Tech Stack
- Dependency Section
- Statistics Cards
- Repository Overview

---

# 6. Semantic APIs

All Semantic APIs require JWT Authentication.

Base URL

```
/api/semantic/
```

---

# 6.1 Semantic Retrieval

### Endpoint

```
POST /api/semantic/retrieve/
```

### Authentication Required

Yes

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body

```json
{
  "project_id": 1,
  "question": "Where is authentication implemented?",
  "top_k": 5
}
```

### Request Fields

| Field | Type | Required | Description |
|------|------|----------|-------------|
| project_id | Integer | Yes | Repository(Project) ID |
| question | String | Yes | Semantic search query |
| top_k | Integer | No | Number of most relevant results (Default: 5) |

### Success Response

Returns semantic retrieval context generated by the backend.

> The response structure is produced dynamically by `SemanticRetrievalService.retrieve()` and should be consumed exactly as returned.

### Frontend Mapping

**Frontend Page**

AI Chat / Semantic Search

**Fields Used By**

- Context Retrieval
- AI Context Preview
- Similar Code Results

---

# 7. Frontend Page Mapping

| Frontend Page | API |
|---------------|-----|
| Register | POST /api/auth/register/ |
| Login | POST /api/auth/login/ |
| Token Refresh | POST /api/auth/refresh/ |
| Dashboard | GET /api/dashboard/ |
| Project List | GET /api/projects/ |
| Create Project | POST /api/projects/ |
| Project Detail | GET /api/projects/{id}/ |
| Edit Project | PUT/PATCH /api/projects/{id}/ |
| Delete Project | DELETE /api/projects/{id}/ |
| Upload Repository | POST /api/projects/{id}/upload/ |
| Repository Overview | GET /api/dashboard/projects/{id}/overview/ |
| Repository Explorer | GET /api/dashboard/projects/{id}/explorer/ |
| Repository Insights | GET /api/dashboard/projects/{id}/insights/ |
| Repository File Viewer | GET /api/dashboard/projects/{id}/files/{file_id}/ |
| Repository Intelligence | GET /api/intelligence/{project_id}/ |
| AI Chat | POST /api/ai/chat/ |
| Semantic Retrieval | POST /api/semantic/retrieve/ |

---

# 8. Common Response Formats

## Success Response

```json
{
  "success": true
}
```

Some APIs additionally return business data.

Example:

```json
{
  "success": true,
  "provider": "gemini",
  "answer": "..."
}
```

or

```json
{
  "message": "ZIP uploaded and repository processed successfully.",
  "status": "completed"
}
```

---

# 9. Common Error Formats

## Validation Error (400)

```json
{
  "<field_name>": [
    "<validation_message>"
  ]
}
```

---

## Authentication Error (401)

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Permission Error (403)

```json
{
  "detail": "You do not have permission to perform this action."
}
```

---

## Resource Not Found (404)

```json
{
  "detail": "Not found."
}
```

---

## Internal Server Error (500)

```json
{
  "success": false,
  "error": "Internal Server Error"
}
```

---

# 10. Final Frontend Integration Notes

## Authentication

- Store both JWT Access Token and Refresh Token after login.
- Include the Access Token in every protected API request.
- Refresh the Access Token when it expires.
- Redirect to Login if refresh fails.

---

## Repository Upload

- Upload using `multipart/form-data`.
- File field name must be exactly:

```
zip_file
```

- Maximum upload size: **100 MB**
- Only `.zip` files are accepted.

---

## Dashboard

- Fetch Dashboard once after login.
- Refresh Dashboard after creating or uploading a repository.

---

## Repository Explorer

- Build the tree recursively using the `children` field.
- Load file contents only when a file node is selected.

---

## AI Chat

- Disable the Send button while waiting for the response.
- Display the `answer` exactly as returned.
- Show backend errors using the `error` field.

---

## Semantic Retrieval

- Use `top_k` only when customization is required.
- Otherwise, allow the backend default (`5`) to be used.

---

## General Guidelines

- Do **not** rename backend fields.
- Do **not** transform response keys.
- Consume all JSON exactly as returned by the backend.
- Treat this document as the single source of truth for frontend integration.

---


