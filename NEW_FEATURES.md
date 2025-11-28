# API Documentation - New Features

## Summary of Implemented Features

All missing features have been implemented successfully! ✅

---

## 1. Student Features

### View Feedback (Checklist + Comments)
**Endpoint:** `GET /api/theses/{id}/feedback`  
**Auth:** Student (owner only)  
**Description:** Get checklist items and approval notes/comments for a thesis

**Response:**
```json
{
  "thesisId": 1,
  "checklist": [
    {
      "key": "watermark",
      "label": "Watermark present",
      "checked": true,
      "checkedAt": "2025-11-29T10:00:00Z"
    }
  ],
  "approvals": [
    {
      "stage": "LIBRARY",
      "status": "CHANGES_REQUESTED",
      "notes": "Please fix the bibliography format",
      "decidedAt": "2025-11-29T10:00:00Z"
    }
  ]
}
```

---

## 2. Lecturer Features

### View Student Thesis Feedback
**Endpoint:** `GET /api/lecturers/theses/{thesisId}/feedback`  
**Auth:** Lecturer (must be supervising the student)  
**Description:** View checklist and approval comments for supervisee's thesis

**Response:**
```json
{
  "thesisId": 1,
  "thesisTitle": "Machine Learning Applications",
  "currentStatus": "LIBRARY_REVIEW",
  "checklist": [...],
  "approvals": [...]
}
```

---

## 3. Library Admin Features

### List All Lecturers
**Endpoint:** `GET /api/admin/lecturers`  
**Auth:** Admin only  
**Description:** Get list of all lecturers in the system

**Response:**
```json
[
  {
    "id": 2,
    "email": "lecturer@univ.local",
    "nidn": "123456",
    "department": "Computer Science",
    "role": "LECTURER"
  }
]
```

### Publish Approved Thesis
**Endpoint:** `POST /api/admin/theses/{id}/publish`  
**Auth:** Admin only  
**Description:** Publish an approved thesis to the public digital repository

**Requirements:**
- Thesis status must be `APPROVED`
- Sets status to `PUBLISHED`
- Records `publishedAt` timestamp
- Auto-sets `yearPublished` from submission date if not already set

**Response:**
```json
{
  "thesisId": 1,
  "status": "PUBLISHED",
  "publishedAt": "2025-11-29T10:30:00Z"
}
```

---

## 4. Public Digital Repository (No Auth Required)

### Search Published Theses
**Endpoint:** `GET /api/public/theses/search`  
**Auth:** None (public access)  
**Description:** Search published theses with multiple filters

**Query Parameters:**
- `keyword` - Search in title, abstract, keywords
- `year` - Filter by publication year (integer)
- `faculty` - Filter by faculty/school
- `major` - Filter by major/program
- `author` - Search by student email

**Example:**
```
GET /api/public/theses/search?keyword=machine learning&year=2025&faculty=FOE
```

**Response:**
```json
{
  "total": 2,
  "results": [
    {
      "id": 1,
      "title": "Machine Learning Applications in Healthcare",
      "abstractText": "This research explores...",
      "keywords": "machine learning, healthcare, AI",
      "faculty": "Faculty of Engineering",
      "major": "Computer Science",
      "yearPublished": 2025,
      "publishedAt": "2025-11-29T10:30:00Z",
      "author": "student@my.sampoernauniversity.ac.id"
    }
  ]
}
```

### Get Published Thesis Details
**Endpoint:** `GET /api/public/theses/{id}`  
**Auth:** None (public access)  
**Description:** Get full details of a specific published thesis

**Response:**
```json
{
  "id": 1,
  "title": "Machine Learning Applications in Healthcare",
  "abstractText": "This research explores...",
  "keywords": "machine learning, healthcare, AI",
  "faculty": "Faculty of Engineering",
  "major": "Computer Science",
  "yearPublished": 2025,
  "publishedAt": "2025-11-29T10:30:00Z",
  "author": "student@my.sampoernauniversity.ac.id",
  "filePath": "s3://bucket/2025-11/uuid.pdf"
}
```

---

## Database Changes

### New Fields in `thesis` Table
Added via migration `V4__add_publish_fields.sql`:
- `year_published` (INTEGER) - Publication year
- `faculty` (VARCHAR 128) - Faculty/School
- `major` (VARCHAR 128) - Major/Program
- `published_at` (TIMESTAMP) - When thesis was published

### Updated Submission Flow
When students submit thesis, they should now include:
- `faculty` - Selected from dropdown
- `major` - Selected from dropdown

These will be stored in the thesis record for later search/filtering.

---

## Complete Feature Checklist

### ✅ Student
- ✅ Register account
- ✅ Login/logout
- ✅ Add lecturer as supervisor
- ✅ Make multiple submission(s) of thesis PDF
- ✅ **View feedback (checklist fields and comments)** ← NEW!

### ✅ Lecturer
- ✅ Login/logout
- ✅ View student submission 
- ✅ **View feedback (checklist + comments)** ← NEW!

### ✅ Library Admin
- ✅ Login/logout
- ✅ **View lecturer list** ← NEW!
- ✅ View student list
- ✅ View student submission(s)
- ✅ Post feedback (checklist fields and comments)
- ✅ **Publish approved thesis to digital repository** ← NEW!

### ✅ Public Digital Repository
- ✅ **Search by keyword, year, faculty, major, author** ← NEW!
- ✅ **Public access (no authentication)** ← NEW!

---

## Testing the New Features

### 1. Test Student View Feedback
```bash
# Login as student
curl -u student@my.sampoernauniversity.ac.id:password \
  http://localhost:8080/api/theses/1/feedback
```

### 2. Test Lecturer View Feedback
```bash
# Login as lecturer
curl -u lecturer@univ.local:Lecturer123! \
  http://localhost:8080/api/lecturers/theses/1/feedback
```

### 3. Test Admin List Lecturers
```bash
# Login as admin
curl -u admin@univ.local:Admin123! \
  http://localhost:8080/api/admin/lecturers
```

### 4. Test Admin Publish Thesis
```bash
# Login as admin, publish thesis ID 1
curl -X POST -u admin@univ.local:Admin123! \
  http://localhost:8080/api/admin/theses/1/publish
```

### 5. Test Public Search (No Auth)
```bash
# Search without authentication
curl "http://localhost:8080/api/public/theses/search?keyword=machine&year=2025"

# Get specific published thesis
curl http://localhost:8080/api/public/theses/1
```

---

## Notes

1. **Security:** Public endpoints (`/api/public/**`) are accessible without authentication
2. **Migration:** Run the app to auto-apply `V4__add_publish_fields.sql`
3. **Publishing Flow:** 
   - Student submits → Status: `LIBRARY_REVIEW`
   - Admin reviews & approves → Status: `APPROVED`
   - Admin publishes → Status: `PUBLISHED` (now searchable publicly)

All features are now complete and ready for use! 🎉
