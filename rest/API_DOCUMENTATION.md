# API Documentation

## Authentication Routes

### 1. User Signup
- **Route:** `/signup`
- **Method:** POST
- **Body:**
  - `name`: String (required)
  - `email`: String (required)
  - `password`: String (required)
  - `confirmPassword`: String (required)
  - `phoneNumber`: String (optional)
  - `school`: String (optional)
  - `requireOTP`: Boolean (optional, default: false)
- **Description:** Register a new user account.

### 2. User Login
- **Route:** `/login`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `password`: String (required)
- **Description:** Authenticate a user and create a session.

### 3. Add Staff Admin
- **Route:** `/add-staff`
- **Method:** POST
- **Body:**
  - `name`: String (required)
  - `email`: String (required)
  - `password`: String (required)
  - `confirmpassword`: String (required)
  - `role`: String (required)
- **Description:** Add a new staff admin account.

### 4. Verify User OTP
- **Route:** `/verify-otp`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `otp`: String (required)
- **Description:** Verify the OTP sent to the user's email.

### 5. Forget Password
- **Route:** `/forget-password`
- **Method:** POST
- **Body:**
  - `email`: String (required)
- **Description:** Request a password reset OTP.

### 6. Change Password
- **Route:** `/change-password`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `otp`: String (required)
  - `newPassword`: String (required)
  - `confirmPassword`: String (required)
- **Description:** Change the user's password after OTP verification.

### 7. Super Admin Signup
- **Route:** `/super-admin-signup`
- **Method:** POST
- **Body:**
  - `name`: String (required)
  - `email`: String (required)
  - `password`: String (required)
  - `confirmPassword`: String (required)
- **Description:** Register a new super admin account.

### 8. Super Admin Login
- **Route:** `/super-admin-login`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `password`: String (required)
- **Description:** Authenticate a super admin and create a session.

### 9. Admin Add Staff
- **Route:** `/admin-add-staff`
- **Method:** POST
- **Headers:**
  - `Authorization`: Bearer [JWT Token]
- **Body:**
  - `name`: String (required)
  - `email`: String (required)
  - `password`: String (required)
  - `confirmPassword`: String (required)
  - `role`: String (required)
- **Description:** Allow an admin to add a new staff member.

### 10. Staff Login
- **Route:** `/staff-login`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `password`: String (required)
- **Description:** Authenticate a staff member and create a session.

### 11. Staff Verify OTP
- **Route:** `/staff-verify-otp`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `otp`: String (required)
- **Description:** Verify the OTP sent to the staff member's email.

### 12. Student Signup
- **Route:** `/student-signup`
- **Method:** POST
- **Body:**
  - `name`: String (required)
  - `email`: String (required)
  - `password`: String (required)
  - `confirmPassword`: String (required)
  - `phoneNumber`: String (required)
  - `school`: String (required)
- **Description:** Register a new student account.

### 13. Student Login
- **Route:** `/student-login`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `password`: String (required)
- **Description:** Authenticate a student and create a session.

### 14. Get Dashboard Stats
- **Route:** `/dashboard-stats`
- **Method:** GET
- **Headers:**
  - `Authorization`: Bearer [JWT Token]
- **Description:** Retrieve dashboard statistics (total questions, students, and staff).

## Question Routes

### 15. Add New Question
- **Route:** `/new-question`
- **Method:** POST
- **Body:**
  - `questionText`: String (required)
  - `options`: Array of Strings (required)
  - `correctAnswer`: String (required)
  - `answerDescription`: String (required)
  - `category`: String (required)
- **Description:** Add a new question to the database.

### 16. Get Questions by Category
- **Route:** `/questions/:category`
- **Method:** GET
- **Params:**
  - `category`: String (required)
- **Description:** Retrieve up to 40 shuffled questions from a specific category.

## Authentication Routes

### 17. Resend User OTP
- **Route:** `/resend-user-otp`
- **Method:** POST
- **Body:**
  - `email`: String (required)
- **Description:** Resend OTP to user's email.

### 18. Resend Staff OTP
- **Route:** `/resend-staff-otp`
- **Method:** POST
- **Body:**
  - `email`: String (required)
- **Description:** Resend OTP to staff member's email.

### 19. Resend Super Admin OTP
- **Route:** `/resend-super-admin-otp`
- **Method:** POST
- **Body:**
  - `email`: String (required)
- **Description:** Resend OTP to super admin's email.

### 20. Refresh Token
- **Route:** `/refresh-token`
- **Method:** POST
- **Body:**
  - `refreshToken`: String (required)
- **Description:** Get a new access token using a refresh token.

### 21. Toggle OTP Requirement
- **Route:** `/toggle-otp-requirement`
- **Method:** POST
- **Headers:**
  - `Authorization`: Bearer [JWT Token]
- **Body:**
  - `email`: String (required)
  - `requireOTP`: Boolean (required)
- **Description:** Enable or disable OTP requirement for a user.

### 22. Logout
- **Route:** `/logout`
- **Method:** POST
- **Description:** End the user's session and log them out.