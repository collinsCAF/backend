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

### User Signup
- **POST** `/api/auth/signup`
- **Body**: `{ name, email, password, phoneNumber, school, referralCode }`
- **Description**: Register a new user account.

### User Login
- **POST** `/api/auth/user-login`
- **Body**: `{ email, password }`
- **Description**: Authenticate a user (student) and receive a JWT token.

### Staff Login
- **POST** `/api/auth/staff-login`
- **Body**: `{ email, password }`
- **Description**: Authenticate a staff member or super admin and receive a JWT token.

### Logout
- **POST** `/api/auth/logout`
- **Description**: Log out the current user (client-side token removal).

### Verify OTP
- **POST** `/api/auth/verify-otp`
- **Body**: `{ email, otp }`
- **Description**: Verify the OTP sent to the user's email.

### Forget Password
- **POST** `/api/auth/forget-password`
- **Body**: `{ email }`
- **Description**: Initiate the password reset process.

### Change Password
- **POST** `/api/auth/change-password`
- **Body**: `{ email, newPassword, confirmPassword }`
- **Description**: Change the user's password.

### Super Admin Signup
- **POST** `/api/auth/super-admin-signup`
- **Body**: `{ name, email, password }`
- **Description**: Create a super admin account (only if no super admin exists).

### Get Dashboard Stats
- **GET** `/api/auth/dashboard-stats`
- **Description**: Retrieve dashboard statistics (requires authentication).

### Toggle OTP Requirement
- **POST** `/api/auth/toggle-otp-requirement`
- **Body**: `{ email, requireOTP }`
- **Description**: Enable or disable OTP requirement for a user (requires authentication).

### Add Staff Member
- **POST** `/api/auth/admin-add-staff`
- **Body**: `{ name, email, password, confirmPassword, role }`
- **Description**: Add a new staff member (requires admin authentication).

### Check Super Admin
- **POST** `/api/auth/check-super-admin`
- **Body**: `{ email }`
- **Description**: Check if a super admin exists with the given email.

### Generate Referral Link
- **GET** `/api/auth/referral-link`
- **Description**: Generate a referral link for the authenticated user.

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

### 16. Get Questions by Staff
- **Route:** `/api/staff-questions/:staffId`
- **Method:** GET
- **Params:**
  - `staffId`: String (required)
- **Description:** Retrieve all questions uploaded by a specific staff member.
- **Authentication:** Required (Staff or Admin only)

### 17. Get Staff Question Statistics
- **Route:** `/api/staff-question-stats`
- **Method:** GET
- **Description:** Retrieve statistics about the number of questions uploaded by the authenticated staff member for each category.
- **Authentication:** Required (Staff or Admin only)
- **Response:** 
  - `totalQuestions`: Total number of questions uploaded by the staff
  - `categoryStats`: Array of objects containing:
    - `_id`: Category name
    - `count`: Number of questions in that category

### 18. Get Staff Questions List (Super Admin Only)
- **Route:** `/api/staff-questions-list`
- **Method:** GET
- **Description:** Retrieve a list of all staff members with their uploaded question counts and details.
- **Authentication:** Required (Super Admin only)
- **Response:** 
  - Array of objects containing:
    - `staffName`: Name of the staff member
    - `staffEmail`: Email of the staff member
    - `questionCount`: Number of questions uploaded by this staff member
    - `questions`: Array of question objects containing:
      - `_id`: Question ID
      - `questionText`: The text of the question
      - `category`: Category of the question
      - `uploadedAt`: Date and time when the question was uploaded
