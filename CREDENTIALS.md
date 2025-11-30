# Default Credentials

Aplikasi ini sudah dilengkapi dengan data seed untuk testing. Berikut adalah kredensial default yang bisa digunakan untuk login:

## 🔐 Default User Accounts

### Admin
- **Email**: `admin@univ.local`
- **Password**: `Admin123!`
- **Dashboard**: `/admin/dashboard`
- **Capabilities**:
  - Review dan approve thesis submissions
  - Manage student dan lecturer accounts
  - Publish approved theses to public repository
  - View all system data

### Lecturer
- **Email**: `lecturer@univ.local`
- **Password**: `Lecturer123!`
- **Dashboard**: `/lecturer/dashboard`
- **Profile**:
  - NIDN: `1234567890`
  - Department: `Computer Science`
- **Capabilities**:
  - View supervisee theses
  - Provide feedback on thesis submissions
  - Approve/reject thesis submissions
  - Add/remove supervisees

### Student
- **Email**: `student@univ.local`
- **Password**: `Student123!`
- **Dashboard**: `/student/dashboard`
- **Profile**:
  - Student Number: `2021001`
  - Program: `Bachelor of Computer Science`
- **Capabilities**:
  - Submit thesis
  - View submission status
  - View feedback from supervisors
  - Manage supervisor assignments
  - Download submission files

## 📝 Notes

1. **Password Policy**: 
   - Minimal 8 karakter
   - Harus mengandung huruf besar, huruf kecil, angka, dan simbol

2. **Email Format**: 
   - Menggunakan domain `@univ.local` untuk internal university accounts

3. **Auto-Seeding**: 
   - Data seed dijalankan otomatis saat aplikasi pertama kali start
   - Jika email sudah ada di database, seed akan di-skip
   - Untuk reset data, hapus database dan restart aplikasi

4. **Profile Data**:
   - Admin tidak memiliki profile tambahan (user account saja)
   - Lecturer memiliki NIDN dan Department
   - Student memiliki Student Number dan Program

## 🔧 Testing Scenarios

### Test Admin Flow
1. Login dengan `admin@univ.local`
2. Review thesis submissions di dashboard
3. Approve/reject submissions
4. Publish approved thesis
5. View lecturer list
6. Logout

### Test Lecturer Flow
1. Login dengan `lecturer@univ.local`
2. View supervisee theses
3. Provide feedback on submissions
4. Approve submissions for library review
5. Logout

### Test Student Flow
1. Login dengan `student@univ.local`
2. Submit new thesis
3. View submission status
4. View feedback from supervisors
5. Re-submit after corrections
6. Logout

## 🚀 Adding More Test Data

Untuk menambahkan user lain, gunakan endpoint registration:

### Register Student
```bash
POST /api/auth/register-student
{
  "email": "newstudent@univ.local",
  "password": "Password123!",
  "name": "New Student Name",
  "studentNumber": "2021002",
  "program": "Master of Computer Science"
}
```

### Register Lecturer
```bash
POST /api/auth/register-lecturer
{
  "email": "newlecturer@univ.local",
  "password": "Password123!",
  "name": "New Lecturer Name",
  "nidn": "0987654321",
  "department": "Information Systems"
}
```

### Register Admin
```bash
POST /api/auth/register-admin
{
  "email": "newadmin@univ.local",
  "password": "Password123!",
  "name": "New Admin Name",
  "employeeId": "EMP001"
}
```

## 🔒 Security Notes

⚠️ **IMPORTANT**: 
- Kredensial ini hanya untuk development dan testing
- **JANGAN** gunakan kredensial default di production
- Ganti semua password default sebelum deploy ke production
- Implementasikan proper password reset mechanism untuk production
- Pertimbangkan menggunakan OAuth2/SSO untuk production environment
