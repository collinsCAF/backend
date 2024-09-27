# API Documentation

## Authentication

All protected routes require authentication. The server uses JWT (JSON Web Tokens) for authentication. After logging in, the server will return a JWT token that must be included in the Authorization header of subsequent requests to protected routes.

For token-based authentication, include the JWT in the Authorization header of your requests:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

All routes will return appropriate HTTP status codes:
- 200: Success
- 201: Created (for POST requests that create new resources)
- 400: Bad Request (e.g., invalid input)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 500: Server Error

Error responses will include a JSON object with a `message` field describing the error.

## Authentication Routes

### 1. User Signup
- **Route:** `/api/auth/signup`
- **Method:** POST
- **Body:**
  - `name`: String (required)
  - `email`: String (required)
  - `password`: String (required)
  - `phoneNumber`: String (optional)
  - `school`: String (optional)
  - `referralCode`: String (optional) - Email of the referring user
- **Description:** Register a new user account. If a valid referral code (email of an existing user) is provided, the new user will be linked to the referrer.

### 2. User Login
- **Route:** `/api/auth/login`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `password`: String (required)
- **Description:** Authenticate a user and create a session.

### 3. Staff Login
- **Route:** `/api/auth/staff-login`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `password`: String (required)
- **Description:** Authenticate a staff member and create a session.

### 4. Super Admin Login
- **Route:** `/api/auth/super-admin-login`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `password`: String (required)
- **Description:** Authenticate a super admin and create a session.

### 5. Super Admin Signup
- **Route:** `/api/auth/super-admin-signup`
- **Method:** POST
- **Body:**
  - `name`: String (required)
  - `email`: String (required)
  - `password`: String (required)
  - `confirmPassword`: String (required)
- **Description:** Register a new super admin account.

### 6. Logout
- **Route:** `/api/auth/logout`
- **Method:** POST
- **Description:** End the user's session and log them out.

### 7. Verify OTP
- **Route:** `/api/auth/verify-otp`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `otp`: String (required)
- **Description:** Verify the OTP sent to the user's email.

### 8. Forget Password
- **Route:** `/api/auth/forget-password`
- **Method:** POST
- **Body:**
  - `email`: String (required)
- **Description:** Request a password reset OTP.

### 9. Change Password
- **Route:** `/api/auth/change-password`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `otp`: String (required)
  - `newPassword`: String (required)
  - `confirmPassword`: String (required)
- **Description:** Change the user's password after OTP verification.

### 10. Get Dashboard Stats
- **Route:** `/api/auth/dashboard-stats`
- **Method:** GET
- **Description:** Retrieve dashboard statistics (total questions, students, and staff).
- **Authentication:** Required

### 11. Toggle OTP Requirement
- **Route:** `/api/auth/toggle-otp-requirement`
- **Method:** POST
- **Body:**
  - `email`: String (required)
  - `requireOTP`: Boolean (required)
- **Description:** Enable or disable OTP requirement for a user.
- **Authentication:** Required

### 12. Admin Add Staff
- **Route:** `/api/auth/admin-add-staff`
- **Method:** POST
- **Body:**
  - `name`: String (required)
  - `email`: String (required)
  - `password`: String (required)
  - `confirmPassword`: String (required)
  - `role`: String (required)
- **Description:** Allow an admin to add a new staff member.
- **Authentication:** Required (Admin only)

## Question Routes

### 13. Add New Question
- **Route:** `/api/upload-question`
- **Method:** POST
- **Body:**
  - `questionText`: String (required)
  - `options`: Array of Objects (required)
    - `option`: String (required)
    - `optionLabel`: String (required)
  - `correctAnswer`: String (required)
  - `answerDescription`: String (required)
  - `category`: String (required)
- **Description:** Add a new question to the database.
- **Authentication:** Required

### 14. Get Questions by Category
- **Route:** `/api/questions/:category`
- **Method:** GET
- **Params:**
  - `category`: String (required)
- **Description:** Retrieve up to 40 shuffled questions from a specific category.

### 15. Answer Question
- **Route:** `/api/answer-question`
- **Method:** POST
- **Body:**
  - `questionId`: String (required)
  - `staffId`: String (required)
- **Description:** Record that a staff member has answered a question.
- **Authentication:** Required

## Notes

- All routes are prefixed with `/api` for question-related routes and `/api/auth` for authentication-related routes.
- Protected routes require a valid session cookie, which is set upon successful login.
- Make sure to handle errors appropriately on the client-side based on the returned status codes and error messages.
- For routes that require authentication or specific roles (like admin), ensure that the necessary middleware is in place to check the user's session and permissions before allowing access to the route.

### 16. Generate Referral Link
- **Route:** `/api/auth/referral-link`
- **Method:** GET
- **Description:** Generate a referral link for the authenticated user.
- **Authentication:** Required
- **Response:** Returns a referral link that includes the user's email as the referral code.

### 17. Get Questions by Staff
- **Route:** `/api/staff-questions/:staffId`
- **Method:** GET
- **Params:**
  - `staffId`: String (required)
- **Description:** Retrieve all questions uploaded by a specific staff member.
- **Authentication:** Required (Staff or Admin only)

### 18. Get Staff Question Statistics
- **Route:** `/api/staff-question-stats`
- **Method:** GET
- **Description:** Retrieve statistics about the number of questions uploaded by the authenticated staff member for each category.
- **Authentication:** Required (Staff or Admin only)
- **Response:** 
  - `totalQuestions`: Total number of questions uploaded by the staff
  - `categoryStats`: Array of objects containing:
    - `_id`: Category name
    - `count`: Number of questions in that category