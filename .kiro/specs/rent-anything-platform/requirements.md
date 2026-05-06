# Requirements Document

## Introduction

RentAnything (branded as **RentIt** in the UI) is a full-stack peer-to-peer rental marketplace that enables users to list items for rent, discover and rent items from other users, communicate in real time, make payments, submit complaints, and leave reviews. The platform is built with React + Vite + Tailwind CSS on the frontend, Node.js + Express on the backend, PostgreSQL with Prisma ORM for persistence, JWT authentication stored in HTTP-only cookies, and Socket.io for real-time messaging. An admin role provides platform-wide oversight of users, listings, complaints, and statistics.

---

## Glossary

- **Platform**: The RentIt web application as a whole (frontend + backend + database).
- **User**: An authenticated person with the role `user` who can browse, list, rent, chat, pay, review, and submit complaints.
- **Admin**: An authenticated person with the role `admin` who has all User capabilities plus platform management capabilities.
- **Guest**: An unauthenticated visitor who can view the Landing Page but cannot access authenticated features.
- **Listing**: A rental item posted by a User, containing title, description, price per day, deposit amount, category, location, availability status, and associated media.
- **Rental**: A time-bounded agreement between a Borrower and an Owner for a specific Listing, with a calculated total price and a lifecycle status.
- **Owner**: The User who created a Listing.
- **Borrower**: The User who requests and completes a Rental.
- **Payment**: A financial record associated with a Rental, simulating a payment transaction.
- **Message**: A real-time chat message exchanged between two Users in the context of a Listing.
- **Complaint**: A report submitted by a User against another User or Listing, managed by Admins.
- **Review**: A post-rental rating and comment left by a Borrower for a Listing.
- **QA**: A question-and-answer thread on a Listing page, visible to all Users.
- **Chatbot**: An automated assistant that responds to predefined FAQ queries and assists with complaint submission.
- **Cart**: A client-side collection of Listings a User intends to rent, displayed in a slide-in panel.
- **JWT**: JSON Web Token used for stateless authentication, stored in an HTTP-only cookie.
- **Dashboard**: The authenticated application shell containing the collapsible Sidebar, Cart panel, and main content area.
- **Sidebar**: The collapsible navigation panel within the Dashboard (72 px collapsed, 240 px expanded on hover).
- **Category**: A named grouping of Listings with an emoji icon and an item count.
- **Password_Validator**: The component responsible for enforcing password strength rules.
- **Auth_Service**: The backend service responsible for registration, login, logout, and password reset.
- **Listing_Service**: The backend service responsible for Listing CRUD and media upload.
- **Rental_Service**: The backend service responsible for Rental lifecycle management.
- **Payment_Service**: The backend service responsible for simulated payment processing.
- **Chat_Service**: The backend service responsible for real-time messaging via Socket.io.
- **Complaint_Service**: The backend service responsible for Complaint submission and management.
- **Review_Service**: The backend service responsible for Review and QA management.
- **Admin_Service**: The backend service responsible for admin-only platform management operations.
- **Chatbot_Service**: The backend service responsible for FAQ responses and complaint-submission assistance.
- **Inactivity_Timeout**: The predefined duration of 30 minutes after which an idle session JWT is invalidated.
- **Remember_Me**: A login option that extends the JWT expiration to 30 days for persistent sessions.

---

## Requirements

### Requirement 1: User Registration

**User Story:** As a Guest, I want to create an account with my name, email, and password, so that I can access the platform as an authenticated User.

#### Acceptance Criteria

1. THE Platform SHALL provide a registration form with fields for full name, email address, and password.
2. WHEN a Guest submits the registration form, THE Auth_Service SHALL validate that the email address conforms to standard email format (RFC 5322 local-part@domain).
3. WHEN a Guest submits the registration form, THE Password_Validator SHALL enforce that the password contains at least 8 characters, at least 1 uppercase letter, and at least 1 numeric digit.
4. WHEN a Guest submits a registration form with a duplicate email address, THE Auth_Service SHALL return an error response indicating the email is already registered.
5. WHEN a Guest submits a valid registration form, THE Auth_Service SHALL hash the password using bcrypt before storing it in the database.
6. WHEN a Guest submits a valid registration form, THE Auth_Service SHALL assign the role `user` to the new account.
7. WHEN a Guest submits a valid registration form, THE Auth_Service SHALL issue a JWT stored in an HTTP-only cookie and redirect the Guest to the Dashboard.
8. IF the registration form contains a missing required field, THEN THE Platform SHALL display an inline validation error message identifying the missing field before form submission.

---

### Requirement 2: User Login and Logout

**User Story:** As a registered User, I want to log in and log out securely, so that my session is protected and I can end it at will.

#### Acceptance Criteria

1. THE Platform SHALL provide a login form with fields for email address and password.
2. WHEN a User submits valid login credentials, THE Auth_Service SHALL verify the password against the stored bcrypt hash and issue a JWT stored in an HTTP-only cookie.
3. WHEN a User submits valid login credentials, THE Platform SHALL redirect the User to the Dashboard.
4. IF a User submits an incorrect email or password, THEN THE Auth_Service SHALL return a generic error response without revealing which field is incorrect.
5. WHEN a User triggers the logout action, THE Auth_Service SHALL clear the HTTP-only cookie containing the JWT.
6. WHILE a User is not authenticated, THE Platform SHALL restrict access to all Dashboard routes and redirect the User to the Auth Page.
7. WHEN a User remains inactive for a predefined duration (30 minutes), THE Auth_Service SHALL invalidate the JWT and require re-authentication.
8. WHEN a User selects "Remember Me" during login, THE Auth_Service SHALL issue a JWT with an extended expiration duration of 30 days instead of the default session expiration.

---

### Requirement 3: Password Reset

**User Story:** As a registered User, I want to reset my password via email, so that I can regain access if I forget my credentials.

#### Acceptance Criteria

1. WHEN a User requests a password reset, THE Auth_Service SHALL generate a unique, time-limited reset token and associate it with the User's account.
2. WHEN a password reset token is generated, THE Auth_Service SHALL send an email containing the reset link with the token to the User's registered email address.
3. WHEN a User submits a new password using a valid, unexpired reset token, THE Auth_Service SHALL hash the new password using bcrypt and update the stored credential.
4. IF a User submits a new password using an expired or invalid reset token, THEN THE Auth_Service SHALL return an error response indicating the token is invalid or expired.
5. WHEN a password reset is successfully completed, THE Auth_Service SHALL invalidate the used reset token so it cannot be reused.

---

### Requirement 4: Listing Creation

**User Story:** As a User, I want to create a rental listing with images, details, and pricing, so that other Users can discover and rent my item.

#### Acceptance Criteria

1. THE Platform SHALL provide a listing creation form with fields for product name, category, daily rental price, deposit amount, location, description, and at least one image upload.
2. WHEN a User submits a valid listing creation form, THE Listing_Service SHALL store the Listing record in the database with the authenticated User's ID as the Owner.
3. WHEN a User uploads images during listing creation, THE Listing_Service SHALL store each image URL and type in the Media table associated with the Listing.
4. WHEN a User submits a listing creation form, THE Listing_Service SHALL validate that the daily rental price is a positive numeric value greater than 0.
5. WHEN a User submits a listing creation form, THE Listing_Service SHALL validate that the product name is between 3 and 100 characters.
6. WHEN a valid Listing is created, THE Listing_Service SHALL set the Listing's `isAvailable` status to `true` by default.
7. IF a User submits a listing creation form with a missing required field, THEN THE Platform SHALL display an inline validation error identifying the missing field.

---

### Requirement 5: Listing Discovery and Search

**User Story:** As a User, I want to browse, search, and filter listings, so that I can find items relevant to my needs.

#### Acceptance Criteria

1. THE Dashboard SHALL display a sticky search bar at the top of the main content area that filters Listings by title keyword in real time.
2. THE Dashboard SHALL display a "Featured Items" horizontal scroll section showing Listings marked as featured.
3. THE Dashboard SHALL display an "All Products" grid section showing all available Listings.
4. THE Categories Page SHALL display all Categories as a grid of cards, each showing the category emoji icon, name, and item count.
5. WHEN a User selects a Category, THE Platform SHALL display only Listings belonging to that Category.
6. THE Popular Page SHALL display Listings sorted in descending order by review count.
7. WHEN the Popular Page displays the top 3 Listings by review count, THE Platform SHALL render rank badges labeled #1, #2, and #3 on those Listing cards.
8. THE Platform SHALL display each Listing card with an aspect-square image, product name, price per day in primary blue color, star rating in accent orange color, and category label.

---

### Requirement 6: Listing Detail View

**User Story:** As a User, I want to view the full details of a listing, so that I can make an informed rental decision.

#### Acceptance Criteria

1. WHEN a User navigates to a Listing detail page, THE Platform SHALL display the Listing image, title, Owner name, price per day, star rating, description, category, availability status, minimum rental duration, and location.
2. THE Listing detail page SHALL display a "Rent Now" button and an "Add to Cart" button.
3. THE Listing detail page SHALL display a Questions & Answers panel showing all QA entries for the Listing.
4. THE Listing detail page SHALL display a Reviews panel showing all Reviews for the Listing with reviewer name, star rating, comment, and date.
5. WHEN a User submits a question in the QA panel, THE Review_Service SHALL store the question associated with the Listing and the authenticated User.
6. WHILE a Listing's `isAvailable` status is `false`, THE Platform SHALL display the Listing as unavailable and disable the "Rent Now" button.

---

### Requirement 7: Listing Management (Owner)

**User Story:** As an Owner, I want to edit and delete my listings, so that I can keep my rental inventory accurate.

#### Acceptance Criteria

1. WHEN an Owner navigates to their listing, THE Platform SHALL display options to edit or delete the Listing.
2. WHEN an Owner submits a valid listing edit form, THE Listing_Service SHALL update the Listing record in the database.
3. WHEN an Owner deletes a Listing, THE Listing_Service SHALL remove the Listing and all associated Media records from the database.
4. IF a User attempts to edit or delete a Listing they do not own, THEN THE Listing_Service SHALL return a 403 Forbidden error response.

---

### Requirement 8: Rental Request and Lifecycle

**User Story:** As a Borrower, I want to request a rental for a specific date range, so that I can reserve an item and track its status.

#### Acceptance Criteria

1. WHEN a Borrower initiates a rental from a Listing detail page, THE Platform SHALL present a date range picker for selecting start date and end date.
2. WHEN a Borrower selects a valid date range, THE Rental_Service SHALL calculate the total price as `pricePerDay × number of days` and display it to the Borrower before confirmation.
3. WHEN a Borrower confirms a rental request, THE Rental_Service SHALL create a Rental record with status `pending` and associate it with the Listing and the Borrower.
4. WHEN an Owner approves a pending Rental, THE Rental_Service SHALL update the Rental status to `active` and set the Listing's `isAvailable` to `false`.
5. WHEN a Rental's end date is reached and the Owner marks it complete, THE Rental_Service SHALL update the Rental status to `completed` and set the Listing's `isAvailable` to `true`.
6. WHEN a Borrower or Owner cancels a Rental with status `pending`, THE Rental_Service SHALL update the Rental status to `cancelled`.
7. IF a Borrower attempts to rent a Listing with `isAvailable` set to `false`, THEN THE Rental_Service SHALL return an error response indicating the item is not available.
8. IF a Borrower selects a start date that is before the current date, THEN THE Platform SHALL display a validation error and prevent form submission.

---

### Requirement 9: Simplified Payment Processing

**User Story:** As a Borrower, I want to pay for a confirmed rental, so that the transaction is recorded and the rental can proceed.

#### Acceptance Criteria

1. WHEN a Borrower triggers the "Pay Now" action for an active Rental, THE Payment_Service SHALL create a Payment record with status `paid` and the rental total amount without integrating any external payment gateway.
2. WHEN a Payment record is successfully created, THE Payment_Service SHALL return a success response to the frontend.
3. IF the payment simulation encounters an internal error, THEN THE Payment_Service SHALL create a Payment record with status `failed` and return an error response.
4. THE Platform SHALL display the payment status (paid, pending, or failed) on the Borrower's rental detail view.
5. THE Payment_Service SHALL NOT call any external payment gateway API; all payment processing SHALL be simulated internally.

---

### Requirement 10: Real-Time Chat

**User Story:** As a User, I want to send and receive messages with the Owner or Borrower of a listing in real time, so that I can coordinate rental details.

#### Acceptance Criteria

1. WHEN a User opens a chat conversation for a Listing, THE Chat_Service SHALL establish a Socket.io connection scoped to the conversation between the two participants.
2. WHEN a User sends a message, THE Chat_Service SHALL persist the Message record (senderId, receiverId, listingId, content, createdAt) in the database.
3. WHEN a Message is persisted, THE Chat_Service SHALL emit the message to the recipient's Socket.io connection in real time.
4. WHEN a User opens an existing chat conversation, THE Chat_Service SHALL retrieve and display all prior Messages for that conversation in chronological order.
5. WHILE a User is connected to a chat conversation, THE Platform SHALL display new incoming messages without requiring a page refresh.

---

### Requirement 11: AI Chatbot

**User Story:** As a User, I want to interact with an automated chatbot for FAQs and complaint submission, so that I can get quick answers without contacting support.

#### Acceptance Criteria

1. THE Platform SHALL provide a chatbot interface accessible from the Dashboard.
2. WHEN a User sends a message matching a predefined FAQ keyword or phrase, THE Chatbot_Service SHALL return the corresponding predefined response.
3. WHEN a User indicates they want to submit a complaint via the chatbot, THE Chatbot_Service SHALL guide the User through the complaint submission flow by collecting the required fields.
4. IF a User sends a message that does not match any predefined FAQ, THEN THE Chatbot_Service SHALL return a default fallback response directing the User to contact support.

---

### Requirement 12: Complaints

**User Story:** As a User, I want to submit a complaint about another user or listing, so that platform issues can be reviewed and resolved by Admins.

#### Acceptance Criteria

1. THE Platform SHALL provide a complaint submission form with fields for the reported User or Listing, and a description of the issue.
2. WHEN a User submits a valid complaint form, THE Complaint_Service SHALL create a Complaint record with status `open` and associate it with the reporter, the reported User or Listing, and the submission timestamp.
3. WHEN an Admin marks a Complaint as resolved, THE Complaint_Service SHALL update the Complaint status to `resolved`.
4. IF a User submits a complaint form with an empty description, THEN THE Platform SHALL display a validation error and prevent submission.

---

### Requirement 13: Reviews

**User Story:** As a Borrower, I want to leave a star rating and comment for a listing after completing a rental, so that other Users can make informed decisions.

#### Acceptance Criteria

1. WHEN a Rental reaches `completed` status, THE Platform SHALL enable the Borrower to submit a Review for the associated Listing.
2. WHEN a Borrower submits a Review, THE Review_Service SHALL validate that the rating is an integer between 1 and 5 inclusive.
3. WHEN a valid Review is submitted, THE Review_Service SHALL store the Review record (listingId, reviewerId, rating, comment, createdAt) in the database.
4. IF a Borrower attempts to submit more than one Review for the same completed Rental, THEN THE Review_Service SHALL return an error response indicating a Review already exists.
5. THE Listing detail page SHALL display the average star rating calculated from all Reviews for that Listing.

---

### Requirement 14: Dashboard Layout and Navigation

**User Story:** As a User, I want a consistent, navigable application shell, so that I can move between sections of the platform efficiently.

#### Acceptance Criteria

1. THE Dashboard SHALL render a collapsible Sidebar that is 72 px wide in its collapsed state and expands to 240 px wide when the User hovers over it.
2. WHILE the Sidebar is collapsed, THE Platform SHALL display only navigation icons without labels.
3. WHILE the Sidebar is expanded, THE Platform SHALL display navigation icons alongside their text labels.
4. THE Sidebar SHALL contain navigation links to: Home (`/app`), Categories (`/app/categories`), Popular (`/app/popular`), Rent Out (`/app/rent-out`), About (`/app/about`), and Settings (`/app/settings`).
5. THE Dashboard SHALL render a floating Cart button in the bottom-right corner displaying the count of items currently in the Cart.
6. WHEN a User clicks the Cart button, THE Platform SHALL display a slide-in Cart panel from the right edge of the viewport with an animation.
7. THE main content area SHALL shift its left margin to match the current Sidebar width during expand and collapse transitions.
8. THE Platform SHALL apply lazy loading to all Dashboard route components to reduce initial bundle size.

---

### Requirement 15: Cart Management

**User Story:** As a User, I want to add listings to a cart and review them before proceeding to checkout, so that I can manage multiple rental intentions at once.

#### Acceptance Criteria

1. WHEN a User clicks "Add to Cart" on a Listing detail page, THE Platform SHALL add the Listing to the client-side Cart state.
2. THE Cart panel SHALL display each Cart item with its product name and price per day.
3. THE Cart panel SHALL display the sum of all daily prices as a total.
4. WHEN a User clicks "Proceed to Checkout" in the Cart panel, THE Platform SHALL navigate the User to the rental confirmation flow for the Cart items.
5. WHEN a User removes an item from the Cart, THE Platform SHALL update the Cart item count badge on the floating Cart button immediately.

---

### Requirement 16: Settings

**User Story:** As a User, I want to manage my profile, security, notifications, and payment methods, so that I can keep my account information current.

#### Acceptance Criteria

1. THE Settings Page SHALL display a Profile Information section with editable fields for full name, email address, and phone number.
2. WHEN a User submits updated profile information, THE Platform SHALL validate the email format and persist the changes to the User record.
3. THE Settings Page SHALL display a Security section with fields for current password, new password, and confirm new password.
4. WHEN a User submits a password change, THE Auth_Service SHALL verify the current password against the stored bcrypt hash before updating to the new password.
5. IF the new password and confirm new password fields do not match, THEN THE Platform SHALL display a validation error and prevent submission.
6. THE Settings Page SHALL display a Notifications section with toggle controls for email notifications, SMS notifications, and marketing emails.
7. WHEN a User changes a notification toggle, THE Platform SHALL persist the updated notification preference to the User record.
8. THE Settings Page SHALL display a Payment Methods section showing saved payment methods and an option to add a new payment method.

---

### Requirement 17: Landing Page

**User Story:** As a Guest, I want to view an informative landing page, so that I can understand the platform's value and decide to sign up.

#### Acceptance Criteria

1. THE Landing Page SHALL display a hero section with the headline "Rent Anything, Anytime", a subheading, and call-to-action buttons linking to the Auth Page.
2. THE Landing Page SHALL display a "Featured Rentals" grid section showing up to 6 featured Listings.
3. THE Landing Page SHALL display a "Why Choose RentIt?" section with 4 feature cards: Save Money, Build Community, Protected Rentals, and Earn Income.
4. THE Landing Page SHALL display a CTA section with a "Get Started Now" button linking to the Auth Page.
5. THE Landing Page SHALL display a footer with a newsletter email subscription input, company links, and support links.
6. THE Landing Page SHALL display a fixed navigation bar with the RentIt logo, a Login link, and a Sign Up button.
7. THE Landing Page SHALL display platform statistics: total active users, total items available, and total successful rentals.

---

### Requirement 18: About Page

**User Story:** As a User, I want to read about the platform's mission and values, so that I can understand the community I am joining.

#### Acceptance Criteria

1. THE About Page SHALL display a mission statement section describing the platform's purpose.
2. THE About Page SHALL display 4 value cards: Community First, Safety & Trust, Easy to Use, and Sustainability.
3. THE About Page SHALL display a stats banner showing active user count, items listed count, and successful rentals count.

---

### Requirement 19: Admin — User Management

**User Story:** As an Admin, I want to view and manage all user accounts, so that I can maintain platform integrity.

#### Acceptance Criteria

1. THE Admin_Service SHALL expose routes accessible only to authenticated Users with the role `admin`.
2. WHEN an Admin requests the user list, THE Admin_Service SHALL return all User records including name, email, role, isActive status, and registration date.
3. WHEN an Admin deactivates a User account, THE Admin_Service SHALL set the User's `isActive` field to `false`.
4. WHEN an Admin activates a User account, THE Admin_Service SHALL set the User's `isActive` field to `true`.
5. WHEN an Admin changes a User's role, THE Admin_Service SHALL update the User's `role` field to the specified value.
6. WHILE a User's `isActive` is `false`, THE Auth_Service SHALL reject login attempts from that User with an error response indicating the account is deactivated.
7. IF a non-Admin User attempts to access an admin-only route, THEN THE Platform SHALL return a 403 Forbidden error response.

---

### Requirement 20: Admin — Complaint Management

**User Story:** As an Admin, I want to view and resolve complaints, so that I can address platform disputes and maintain trust.

#### Acceptance Criteria

1. WHEN an Admin requests the complaints list, THE Admin_Service SHALL return all Complaint records including reporter, reported entity, description, status, and submission date.
2. WHEN an Admin marks a Complaint as resolved, THE Complaint_Service SHALL update the Complaint status to `resolved` and record the resolution timestamp.
3. THE Admin complaints view SHALL support filtering Complaints by status (`open` or `resolved`).

---

### Requirement 21: Admin — Platform Statistics

**User Story:** As an Admin, I want to view platform-wide statistics, so that I can monitor growth and health of the marketplace.

#### Acceptance Criteria

1. WHEN an Admin requests platform statistics, THE Admin_Service SHALL return the total number of registered Users, total number of active Listings, total number of Rentals, and total simulated revenue (sum of all paid Payment amounts).
2. THE Admin statistics endpoint SHALL aggregate data using efficient database queries via Prisma.

---

### Requirement 22: Form Validation and Error Handling

**User Story:** As a User, I want clear validation feedback on all forms, so that I can correct mistakes before submitting.

#### Acceptance Criteria

1. THE Platform SHALL perform client-side validation on all forms before making API requests, checking required fields, email format, and password strength.
2. WHEN the backend receives a form submission, THE Platform SHALL validate and sanitize all input fields using express-validator before processing.
3. WHEN server-side validation fails, THE Platform SHALL return a structured error response containing field-level error messages.
4. THE Platform SHALL display server-side validation error messages inline next to the relevant form fields.
5. IF a network request fails due to a server error, THEN THE Platform SHALL display a user-facing error notification without exposing internal error details.

---

### Requirement 23: API Abstraction Layer

**User Story:** As a developer, I want all API calls centralized in a service layer, so that components remain decoupled from HTTP implementation details.

#### Acceptance Criteria

1. THE Platform SHALL implement an API abstraction layer in `/src/services` that encapsulates all HTTP requests to the backend.
2. THE Platform SHALL not make direct `fetch` or `axios` calls from React page or component files.
3. WHEN an API service function is called, THE Platform SHALL include the JWT cookie automatically via `credentials: 'include'` in all requests.

---

### Requirement 24: UI Design System

**User Story:** As a developer, I want a consistent design system applied across all pages, so that the UI is cohesive and matches the brand.

#### Acceptance Criteria

1. THE Platform SHALL apply the design tokens defined in `theme.css`: primary color `#2563EB`, accent color `#F97316`, background `#F8FAFC`, foreground `#1E293B`, card `#ffffff`, border `#BFDBFE`, muted `#E0F2FE`, muted foreground `#475569`, and border radius `0.75rem`.
2. THE Platform SHALL render product card images using an aspect-square container with a `scale-110` hover transform on the image.
3. THE Platform SHALL apply hover effects to all interactive cards: border changes to accent color, upward translate of 1 unit, and elevated box shadow.
4. THE Platform SHALL display all prices in the format `$X/day` using the primary blue color.
5. THE Platform SHALL render star ratings using filled accent orange stars for filled positions and muted-foreground stars for empty positions.
6. THE Cart slide-in panel SHALL animate using a `slide-in-right` keyframe animation (translateX from 100% to 0).
7. THE Cart overlay backdrop SHALL animate using a `fade-in` keyframe animation (opacity from 0 to 1).
8. THE Platform SHALL apply `focus:ring-2 focus:ring-accent` styling to all form input elements on focus.

---

### Requirement 25: Backend Architecture and Security

**User Story:** As a developer, I want a well-structured, secure backend, so that the API is maintainable and protected against common vulnerabilities.

#### Acceptance Criteria

1. THE Platform SHALL organize backend code into `/src/controllers`, `/src/services`, `/src/routes`, `/src/middlewares`, `/src/models`, and `/src/validators` directories.
2. THE Platform SHALL use Prisma ORM for all database interactions, with no raw SQL queries in application code.
3. THE Platform SHALL validate and sanitize all incoming request bodies using express-validator middleware before passing data to controllers.
4. THE Platform SHALL store JWT secrets and database connection strings in environment variables, not in source code.
5. THE Platform SHALL use bcrypt with a minimum cost factor of 10 for all password hashing operations.
6. WHEN a protected route is accessed without a valid JWT cookie, THE Platform SHALL return a 401 Unauthorized error response.
7. THE Platform SHALL implement CORS configuration that restricts allowed origins to the configured frontend URL.

---

### Requirement 26: Performance Optimization

**User Story:** As a User, I want the platform to load quickly and respond smoothly, so that I have a fast and efficient browsing experience.

#### Acceptance Criteria

1. THE Platform SHALL optimize all images by serving them with appropriate dimensions and compression to reduce page load time.
2. THE Platform SHALL minimize unnecessary JavaScript and CSS by tree-shaking unused code and splitting bundles per route.
3. THE Platform SHALL apply lazy loading to all Dashboard route components and non-critical images to reduce initial bundle size.
4. THE Platform SHALL use efficient Prisma queries with selective field projection and pagination to minimize database response payloads.

---

### Requirement 27: Global Footer

**User Story:** As a User, I want a consistent footer on all pages, so that I can always access contact information, key links, and copyright details.

#### Acceptance Criteria

1. THE Platform SHALL display a footer on all authenticated Dashboard pages containing the RentIt brand name, contact information, navigation links, and a copyright notice.
2. THE Landing Page footer SHALL display a newsletter subscription input, company links (About Us, Careers, Press, Blog), and support links (Help Center, Safety, Contact Us, Terms of Service).
3. THE footer SHALL display the copyright year and "RentIt. All rights reserved." text.
4. ALL footer links SHALL navigate to their respective pages without broken links.

---

### Requirement 28: Testing

**User Story:** As a developer, I want unit and integration tests for core services and endpoints, so that regressions are caught early and the codebase remains reliable.

#### Acceptance Criteria

1. THE Platform SHALL include unit tests for the Auth_Service covering registration, login, logout, and password reset logic.
2. THE Platform SHALL include unit tests for the Rental_Service covering price calculation, status transitions, and availability checks.
3. THE Platform SHALL include unit tests for the Payment_Service covering the simulated payment flow and record creation.
4. THE Platform SHALL include integration tests for the authentication API endpoints (POST /auth/register, POST /auth/login, POST /auth/logout).
5. THE Platform SHALL include integration tests for the listings API endpoints (GET /listings, POST /listings, PUT /listings/:id, DELETE /listings/:id).
6. WHEN tests are executed, THE Platform SHALL report pass/fail results with descriptive test names identifying the scenario under test.

---

### Requirement 29: Version Control Practices

**User Story:** As a developer, I want a meaningful Git commit history, so that the development timeline is traceable and changes are well-documented.

#### Acceptance Criteria

1. THE repository SHALL contain a minimum of 10 commits representing distinct, meaningful units of work.
2. ALL commit messages SHALL follow the Conventional Commits format using one of the prefixes: `feat:`, `fix:`, `refactor:`, or `docs:`.
3. EACH commit message SHALL include a concise description of the change in the imperative mood (e.g., `feat: add JWT authentication middleware`).
4. THE repository SHALL include a `README.md` file documenting setup steps, feature list, and API endpoint reference.
