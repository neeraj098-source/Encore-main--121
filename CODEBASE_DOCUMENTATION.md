# Encore 26 - Complete Codebase Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [Project Structure](#project-structure)
6. [API Routes & Endpoints](#api-routes--endpoints)
7. [Key Features](#key-features)
8. [Design System](#design-system)
9. [Component Architecture](#component-architecture)
10. [Data Flow & Workflows](#data-flow--workflows)
11. [Authentication & Security](#authentication--security)
12. [Environment Configuration](#environment-configuration)

---

## Project Overview

**Encore 26** is a comprehensive fest management platform for **IET Lucknow's Annual Cultural Festival** with the theme "Nawabi Elegance". It's a full-stack web application built to handle user registration, event management, team coordination, cart and checkout systems, and an admin dashboard for managing registrations and CA (Campus Ambassador) programs.

### Key Objectives:
- User registration and email verification
- Event discovery and registration
- Shopping cart & payment management
- Team management for group events
- Campus Ambassador (CA) recruitment and gamification (coins system)
- Admin panel for event and user management
- Leaderboard for CA performance tracking

---

## Tech Stack

### Frontend
- **React 19.2.3** - UI library with Server Components support
- **Next.js 16.1.1** - App Router with server-side rendering
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12.25.0** - Animation library
- **Heroicons 2.2.0** - Premium icon set
- **Lucide React 0.562.0** - Lightweight icon library

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **NextAuth.js 4.24.13** - Authentication & session management
- **Prisma 5.10.0** - ORM for database operations
- **bcryptjs 3.0.3** - Password hashing

### Database
- **MySQL** (Primary) - Relational database
- **SQLite/PostgreSQL** - Development alternatives

### Email
- **Nodemailer 7.0.13** - SMTP email delivery
- **MailerSend 2.6.0** - Email service integration

### Development
- **Node.js 22.6.0** - Runtime
- **ESLint 9** - Code linting
- **Tailwind PostCSS 4** - PostCSS configuration

---

## System Architecture

### High-Level Architecture Flow

```
┌─────────────┐
│   Client    │ (Browser/Mobile)
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────────────┐
│        Next.js App Router                    │
├─────────────────────────────────────────────┤
│  • Server Components & Client Components    │
│  • Pages (SSR/SSG)                         │
│  • Layout System                            │
└──────┬─────────────────────────┬────────────┘
       │                         │
       │ Server Components       │ Client-Side
       │                         │
       ▼                         ▼
┌─────────────────────────────────────────────┐
│        API Routes Layer                      │
├─────────────────────────────────────────────┤
│  • Authentication Handlers                   │
│  • Business Logic                            │
│  • Input Validation                          │
│  • Authorization Middleware                  │
└──────┬────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│        Prisma ORM                            │
├─────────────────────────────────────────────┤
│  • Query Builder                             │
│  • Transaction Support                       │
│  • Migration Management                      │
└──────┬────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│        MySQL Database                        │
├─────────────────────────────────────────────┤
│  • User Management                           │
│  • Cart & Orders                             │
│  • Teams & Registrations                     │
│  • Coin History & Rewards                    │
└─────────────────────────────────────────────┘
```

### Modular Component Architecture

```
Frontend Layer:
├── Pages (app/)
│   ├── Dashboard
│   ├── Events
│   ├── Cart/Checkout
│   ├── Login/Register
│   ├── Admin Panel
│   └── CA Portal
├── React Components
│   ├── Layout (Navbar, Footer, etc)
│   ├── Home (Hero, Events, FAQs)
│   ├── Dashboard (Widgets, Modals)
│   └── UI (Buttons, Modals, Loaders)
├── Custom Hooks
└── Utilities

API Layer:
├── Authentication Routes
│   ├── /auth/[...nextauth]
│   ├── /register
│   └── /verify-email
├── User Routes
│   ├── /user
│   ├── /user/update
│   ├── /user/claim
│   └── /user/teams
├── Cart & Orders
│   ├── /cart (GET, POST, DELETE)
│   └── /checkout
├── Team Management
│   ├── /team/create
│   └── /team/join
├── CA Portal
│   └── /ca/register
└── Admin Routes
    ├── /admin/users
    ├── /admin/leaderboard
    └── /admin/teams

Data Layer:
├── Prisma Models
├── Database Schema
├── Migrations
└── Type Definitions
```

---

## Database Schema

### User Model
```typescript
model User {
  // Primary Fields
  id              String   @id                 // 6-digit unique ID
  name            String
  email           String   @unique             // Normalized to lowercase
  password        String?  // Hashed (optional for CA)
  
  // Profile Information
  gender          String?
  phone           String?
  college         String?
  year            String?
  accommodation   String?   // YES/NO for on-campus stay
  
  // Payment & Verification
  paymentId       String?
  paymentScreenshot String?
  totalPaid       Int      @default(0)
  paymentVerified Boolean  @default(false)
  profileCompleted Boolean @default(false)
  
  // Email Verification
  emailVerified       Boolean  @default(false)
  emailVerificationToken String?
  
  // CA Program Fields
  role            String   @default("USER")  // USER or CA
  referralCode    String?  @unique           // 6-digit code for referrals
  referredBy      String?                    // Original referrer's code
  caCoins         Int      @default(0)       // Earned through tasks
  
  // Social Media Tasks (Boolean flags)
  taskInsta       Boolean  @default(false)
  taskLinkedIn    Boolean  @default(false)
  taskX           Boolean  @default(false)
  taskFacebook    Boolean  @default(false)
  taskCart        Boolean  @default(false)   // Add 3+ events to cart
  taskCart5       Boolean  @default(false)   // Add 5+ events to cart
  taskCart10      Boolean  @default(false)   // Add 10+ events to cart
  
  // Relationships
  cart            Cart?                      // One-to-one with Cart
  orders          Order[]                    // One-to-many with Orders
  coinHistory     CoinHistory[]              // Coin transaction history
  teams           Team[]    @relation("TeamMembers")  // Teams as member
  ledTeams        Team[]    @relation("TeamLeader")   // Teams as leader
  
  // Metadata
  createdAt       DateTime @default(now())
}
```

### Cart Model
```typescript
model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique              // One cart per user
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  eventSlug String   // Reference to event in data.ts
  eventName String
  price     Int
  createdAt DateTime @default(now())

  @@unique([cartId, eventSlug])  // Prevent duplicates
}
```

### Order Model
```typescript
model Order {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  items         OrderItem[]
  totalAmount   Int         // Total price including pass & deposit
  status        String      @default("PENDING")  // PENDING, PAID, FAILED
  paymentId     String?     // External payment ID or UTR
  paymentScreenshot String? // Base64 or URL of proof
  passType      String?     // 'basic' (399) or 'accommodation' (999)
  securityDeposit Int       @default(0)  // Refundable deposit (200)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  eventSlug String
  eventName String
  price     Int
}
```

### CoinHistory Model
```typescript
model CoinHistory {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  amount    Int      // Positive for earning, negative for spending
  reason    String   // e.g., "Instagram Task", "Referral Bonus"
  createdAt DateTime @default(now())
}
```

### Team Model
```typescript
model Team {
  id        String   @id @default(cuid())
  name      String
  code      String   @unique              // 6-character random code
  eventSlug String   // Reference to event
  
  leaderId  String
  leader    User     @relation("TeamLeader", fields: [leaderId], references: [id])
  
  members   User[]   @relation("TeamMembers")  // All team members
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([eventSlug, leaderId])  // One team per leader per event
}
```

### Database Relationships Map
```
User (1) ──────────────── (1) Cart
         │
         ├──────────────── (N) Order
         │
         ├──────────────── (N) CoinHistory
         │
         ├──────────────── (N) Team (as "TeamMembers")
         │
         └──────────────── (N) Team (as "TeamLeader")

Cart (1) ──────────────── (N) CartItem
Order (1) ──────────────── (N) OrderItem
Team (1) ──────────────── (N) User (members)
```

---

## Project Structure

### Directory Layout
```
encore26/
│
├── 📄 package.json                 # Dependencies & scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 next.config.ts              # Next.js configuration
├── 📄 tailwind.config.js          # Tailwind CSS config
├── 📄 postcss.config.mjs           # PostCSS configuration
├── 📄 eslint.config.mjs            # ESLint configuration
├── 📄 README.md                    # Project documentation
├── 📄 deployment_guide.md          # Deployment instructions
│
├── 📁 app/                         # Next.js App Router
│   ├── 📄 layout.tsx              # Root layout with fonts & metadata
│   ├── 📄 page.tsx                # Home page with Hero, Events, FAQ
│   ├── 📄 globals.css             # Global Tailwind styles
│   │
│   ├── 📁 api/                    # API Routes
│   │   ├── 📁 auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts       # NextAuth configuration & session
│   │   │   └── login/
│   │   │       └── route.ts       # Legacy login endpoint
│   │   ├── 📁 register/
│   │   │   └── route.ts           # User registration with email verification
│   │   ├── 📁 verify-email/
│   │   │   └── route.ts           # Email verification token validation
│   │   ├── 📁 user/
│   │   │   ├── route.ts           # Get user profile by email
│   │   │   ├── update/
│   │   │   │   └── route.ts       # Update user profile
│   │   │   ├── claim/
│   │   │   │   └── route.ts       # Claim task rewards (coins)
│   │   │   └── teams/
│   │   │       └── route.ts       # Get user's teams
│   │   ├── 📁 cart/
│   │   │   └── route.ts           # Cart CRUD operations
│   │   ├── 📁 checkout/
│   │   │   └── route.ts           # Create order from cart
│   │   ├── 📁 orders/
│   │   │   └── route.ts           # Get user's orders
│   │   ├── 📁 team/
│   │   │   ├── create/
│   │   │   │   └── route.ts       # Create team for event
│   │   │   └── join/
│   │   │       └── route.ts       # Join team with code
│   │   ├── 📁 ca/
│   │   │   └── register/
│   │   │       └── route.ts       # CA (Campus Ambassador) registration
│   │   ├── 📁 admin/
│   │   │   ├── users/
│   │   │   │   └── route.ts       # Admin: Manage users (GET, PUT, DELETE)
│   │   │   ├── leaderboard/
│   │   │   │   └── route.ts       # Admin: CA stats & performance
│   │   │   └── teams/
│   │   │       └── route.ts       # Admin: Team statistics
│   │   └── 📁 public/
│   │       └── leaderboard/
│   │           └── route.ts       # Public CA leaderboard
│   │
│   ├── 📁 about/
│   │   └── page.tsx               # About page
│   ├── 📁 dashboard/
│   │   └── page.tsx               # User dashboard (protected)
│   ├── 📁 events/
│   │   ├── page.tsx               # Events listing
│   │   └── [slug]/
│   │       ├── page.tsx           # Event detail page
│   │       └── EventDetailClient.tsx  # Client component for event details
│   ├── 📁 cart/
│   │   └── page.tsx               # Shopping cart page
│   ├── 📁 checkout/
│   │   └── page.tsx               # Checkout & payment page
│   ├── 📁 orders/
│   │   └── page.tsx               # Order history page
│   ├── 📁 leaderboard/
│   │   └── page.tsx               # CA leaderboard page
│   ├── 📁 login/
│   │   └── page.tsx               # Login form page
│   ├── 📁 verify-email/
│   │   └── page.tsx               # Email verification page
│   ├── 📁 admin/
│   │   └── page.tsx               # Admin panel (users, teams, stats)
│   ├── 📁 ca-portal/
│   │   └── page.tsx               # CA dashboard & recruitment
│   └── 📁 sponsorship/
│       └── page.tsx               # Sponsorship information page
│
├── 📁 components/                 # React Components
│   ├── 📁 layout/
│   │   ├── ClientLayout.tsx       # Client-side layout wrapper
│   │   ├── Navbar.tsx             # Navigation bar
│   │   ├── TopBar.tsx             # Top notification bar
│   │   ├── Footer.tsx             # Footer component
│   │   └── RoyalFooter.tsx        # Themed footer
│   ├── 📁 home/
│   │   ├── Hero.tsx               # Homepage hero section
│   │   ├── FestHighlights.tsx    # Fest highlights showcase
│   │   ├── SignatureNights.tsx   # Signature events section
│   │   ├── EventsPreview.tsx     # Events carousel
│   │   ├── TimelineTeaser.tsx    # Timeline section
│   │   ├── Flashback.tsx         # Past fest photos/videos
│   │   ├── SponsorsPreview.tsx   # Sponsors section
│   │   ├── Stats.tsx             # Statistics section
│   │   ├── About.tsx             # About fest section
│   │   └── FAQ.tsx               # FAQ accordion
│   ├── 📁 dashboard/
│   │   ├── LeaderboardWidget.tsx # Coin leaderboard widget
│   │   ├── PassportCard.tsx      # User passport/pass card
│   │   ├── ProfileModal.tsx      # Profile update modal
│   │   └── TeamManager.tsx       # Team creation/joining
│   ├── 📁 cart/
│   │   └── CartDrawer.tsx        # Shopping cart sidebar
│   ├── 📁 onboarding/
│   │   └── LoginForm.tsx         # Login/register form component
│   └── 📁 ui/
│       ├── Button.tsx             # Reusable button component
│       ├── Modal.tsx              # Modal dialog component
│       ├── Loader.tsx             # Loading spinner
│       ├── CinematicBackground.tsx # Animated background
│       ├── CinematicLightingOverlay.tsx # Overlay effects
│       ├── CornerCurtains.tsx    # Corner decorative elements
│       ├── CustomCursor.tsx      # Custom mouse cursor
│       ├── CountdownTimer.tsx    # Countdown display
│       ├── Particles.tsx          # Particle animation
│       ├── RoomiGate.tsx         # Gate/entrance animation
│       └── RegistrationPopup.tsx # Registration modal
│
├── 📁 lib/                        # Utilities & Helpers
│   ├── prisma.ts                  # Prisma singleton instance
│   ├── email.ts                   # Email sending utilities
│   ├── data.ts                    # Static event data
│   └── types/                     # Custom type definitions
│
├── 📁 types/                      # TypeScript type definitions
│   └── next-auth.d.ts             # NextAuth session types
│
├── 📁 prisma/                     # Database
│   ├── schema.prisma              # Prisma schema definition
│   ├── seed.ts                    # Database seeding script
│   ├── migrations/                # Database migrations
│   └── migration_lock.toml        # Migration lock file
│
├── 📁 public/                     # Static assets
│   └── images/
│       ├── background/            # Background images
│       ├── categories/            # Event categories
│       ├── event/                 # Event images
│       ├── flashback/             # Past fest photos
│       ├── guests/                # Guest performer images
│       ├── home/                  # Homepage images
│       ├── legacy/                # Historical images
│       ├── sponsor/               # Sponsor logos
│       └── team/                  # Team member photos
│
└── 📁 scripts/                    # Utility scripts
    ├── backup_db.sh               # Database backup script
    ├── reset_password.js          # Reset user password
    ├── seed_user.js               # Add test user
    ├── seed_scenarios.js          # Test data generation
    └── test_db_connection.js      # Test database connection
```

---

## API Routes & Endpoints

### Authentication Routes

#### `POST /api/auth/[...nextauth]`
**Purpose**: NextAuth.js authentication handler
- **Providers**: Credentials (email/password)
- **Features**: 
  - Password hashing with bcryptjs
  - Email verification requirement
  - Session management
  - JWT tokens

**Request Example**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response**:
```json
{
  "session": {
    "user": {
      "email": "user@example.com",
      "id": "123456",
      "role": "USER"
    }
  }
}
```

#### `POST /api/register`
**Purpose**: User registration with email verification
**Required Fields**:
- `name` (string)
- `email` (string) - Normalized to lowercase
- `password` (string, optional for CA)
- `phone`, `college`, `year` (optional)
- `referralCode` (optional)

**Features**:
- Duplicate email check with transaction locking
- Password hashing with bcryptjs (10 salt rounds)
- 6-digit unique user ID generation
- Email verification token creation
- Referral reward system (50 coins)
- Automatic referral code generation

**Response**:
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": { /* full user object */ },
  "exists": false
}
```

#### `POST /api/verify-email`
**Purpose**: Verify email using token
**Request**:
```json
{
  "token": "email_verification_token"
}
```

**Response**:
```json
{
  "message": "Email verified successfully"
}
```

**Status Codes**: 
- `200` - Verification successful
- `400` - Invalid or expired token
- `500` - Server error

---

### User Routes

#### `POST /api/user`
**Purpose**: Get user profile by email
**Query/Body**: `{ email: string }`
**Response**: Full user object with included relations

#### `PUT /api/user/update`
**Purpose**: Update user profile
**Allows Updates**: `name`, `phone`, `college`, `year`, `gender`, `accommodation`, `profileCompleted`

#### `POST /api/user/claim`
**Purpose**: Claim task rewards (social media, cart tasks)
**Request**:
```json
{
  "email": "user@example.com",
  "task": "taskInsta" // or taskLinkedIn, taskX, taskFacebook, taskCart, taskCart5, taskCart10
}
```

**Features**:
- Atomic transaction-based updates
- Prevents double-claiming with task boolean guard
- Cart item validation for cart tasks
- Coin history recording

**Reward Structure**:
- Social tasks: 50 coins
- `taskCart5`: 100 coins
- `taskCart10`: 150 coins

**Response**:
```json
{
  "success": true,
  "coins": 350,
  "message": "You earned 50 coins!"
}
```

#### `GET /api/user/teams`
**Purpose**: Get user's teams (as member or leader)

---

### Cart & Order Routes

#### `GET /api/cart`
**Purpose**: Get user's shopping cart
**Auth**: Required (NextAuth session)
**Response**:
```json
{
  "id": "cart_id",
  "userId": "user_id",
  "items": [
    {
      "id": "item_id",
      "eventSlug": "event-slug",
      "eventName": "Event Name",
      "price": 150,
      "createdAt": "2026-02-04T..."
    }
  ]
}
```

#### `POST /api/cart`
**Purpose**: Add event to cart
**Request**:
```json
{
  "eventSlug": "darpan"
}
```

**Features**:
- Unique constraint prevents duplicates
- Auto-creates cart if doesn't exist
- Validates event existence

#### `DELETE /api/cart?id=cartItemId`
**Purpose**: Remove item from cart
**Auth**: Required

---

#### `POST /api/checkout`
**Purpose**: Create order from cart items
**Request**:
```json
{
  "passType": "basic" | "accommodation" | null,
  "paymentId": "payment_identifier",
  "paymentScreenshot": "base64_or_url"
}
```

**Features**:
- Cart validation
- Pass price addition:
  - Basic: ₹399
  - Accommodation: ₹999
  - Security Deposit: ₹200 (if pass purchased)
- Automatic cart clearing after order creation

**Response**:
```json
{
  "success": true,
  "orderId": "order_id"
}
```

#### `GET /api/orders`
**Purpose**: Get user's order history
**Auth**: Required
**Response**: Array of orders with items

---

### Team Routes

#### `POST /api/team/create`
**Purpose**: Create team for event
**Request**:
```json
{
  "userId": "user_id",
  "eventSlug": "event-slug",
  "teamName": "Team Name"
}
```

**Features**:
- Generates 6-digit unique team code
- Leader automatically becomes member
- Prevents duplicate team leads per event
- Validates event exists

**Response**:
```json
{
  "success": true,
  "team": {
    "id": "team_id",
    "name": "Team Name",
    "code": "123456",
    "eventSlug": "event-slug",
    "leaderId": "user_id"
  }
}
```

#### `POST /api/team/join`
**Purpose**: Join existing team with code
**Request**:
```json
{
  "userId": "user_id",
  "teamCode": "123456"
}
```

**Features**:
- Validates team exists
- Enforces max member limit per event
- Prevents user joining multiple teams per event
- Validates event constraints

**Response**:
```json
{
  "success": true,
  "teamName": "Team Name"
}
```

---

### CA Portal Routes

#### `POST /api/ca/register`
**Purpose**: Register as Campus Ambassador
**Request**:
```json
{
  "name": "CA Name",
  "email": "ca@example.com",
  "phone": "9876543210",
  "college": "College Name"
}
```

**Features**:
- Auto-generates 5-digit referral code
- Creates temporary password
- Email sends login credentials
- Sets role to "CA"

---

### Admin Routes (Protected with secret)

#### `GET /api/admin/users?secret=ADMIN_SECRET`
**Purpose**: List all users with relations
**Returns**: Array with full user data including cart, orders, coin history

#### `PUT /api/admin/users`
**Purpose**: Update user (name, email, phone, college, year, accommodation, password)

#### `DELETE /api/admin/users?secret=ADMIN_SECRET&userId=USER_ID`
**Purpose**: Delete user with cascade
**Features**:
- Cascading deletes: cart, orders, teams
- Requires admin secret

#### `GET /api/admin/leaderboard?secret=ADMIN_SECRET`
**Purpose**: Get CA statistics (top performers by coins)

#### `GET /api/admin/teams?secret=ADMIN_SECRET`
**Purpose**: Get team statistics grouped by event

---

### Public Routes

#### `GET /api/public/leaderboard`
**Purpose**: Public CA leaderboard
**Features**:
- Real-time data (force-dynamic)
- Top 10-20 CAs by coins
- Response**: Array of top performers with coins

---

## Key Features

### 1. User Authentication & Registration
- **Email-based login** with NextAuth.js
- **Email verification** via token link
- **Password security** with bcrypt hashing
- **Session persistence** with JWT
- **Role-based access** (USER, CA, ADMIN)

### 2. Event Management
- **Static event data** in `lib/data.ts` with 50+ events
- **Event categories**: Dance, Art, Drama, Music, etc.
- **Team events** with min/max member limits
- **Solo events** with individual registration
- **Event pricing**: ₹100-₹600 per event

### 3. Shopping Cart & Checkout
- **Cart persistence** per user
- **Duplicate prevention** via unique constraints
- **Multi-item cart** support
- **Pass options**: Basic (₹399), Accommodation (₹999)
- **Security deposit**: ₹200 (refundable)
- **Payment tracking** with UTR/Payment ID
- **Screenshot upload** for manual verification

### 4. Coin Reward System (Gamification)
- **Social media tasks**: Instagram, LinkedIn, Twitter, Facebook (50 coins each)
- **Cart tasks**: Add 3+ events (50), 5+ events (100), 10+ events (150)
- **Referral rewards**: 50 coins per successful referral
- **Atomic transactions** prevent double-claiming
- **Coin history** for tracking all transactions

### 5. Team Management
- **Create teams** for group events
- **Join teams** with 6-digit code
- **Team constraints** per event (min/max members)
- **Leader selection** with auto-membership
- **Prevents multiple teams** per event per user

### 6. CA (Campus Ambassador) Program
- **Referral system** with unique codes
- **Leaderboard** tracking CA performance
- **Recruitment portal** for CA signup
- **Temp password generation** for CA login
- **Performance metrics** via coins

### 7. Admin Dashboard
- **User management**: View, edit, delete users
- **Bulk operations**: Export user data
- **Team statistics**: Teams per event
- **Payment verification**: Approve/deny orders
- **CA tracking**: Leaderboard and stats

---

## Design System

### Color Palette
The application follows a **"Nawabi Elegance"** theme with:
- **Primary Colors**: Gold, Rich Burgundy, Deep Navy
- **Background**: Black (#000000)
- **Text**: White, Off-white
- **Accent**: Gold (#FFD700), Purple (#8B00FF)

### Typography
- **Headings**: Cinzel font (weight: 400-900)
  - Used for titles, event names, prominent text
- **Body**: Marcellus font (weight: 400)
  - Used for body text, descriptions
- **Default**: System fonts (fallback)

### UI Components

#### Button Component
```tsx
<Button 
  variant="primary" | "secondary" | "outline"
  size="small" | "medium" | "large"
  onClick={handler}
>
  Click Me
</Button>
```

#### Modal Component
```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <h2>Modal Title</h2>
  <p>Content here</p>
</Modal>
```

#### Loader Component
- Animated spinner for async operations
- Centered full-screen display

#### Custom Animations
- **Particles**: Background particle effects
- **Cinematic Background**: Animated gradient backgrounds
- **Lighting Overlay**: Dynamic lighting effects
- **Corner Curtains**: Decorative corner elements
- **Custom Cursor**: Trail-based cursor effect

### Styling Approach
- **Tailwind CSS v4**: Utility-first CSS
- **Framer Motion**: Complex animations
- **clsx**: Conditional class management
- **tailwind-merge**: Conflicting class prevention

---

## Component Architecture

### Layout Components

#### ClientLayout
- Root client-side layout wrapper
- Session provider integration
- Global state management
- Theme provider

#### Navbar
- Navigation links to main pages
- Authentication status display
- Mobile responsive hamburger menu
- Logo/branding

#### Footer
- Social media links
- Quick links
- Contact information
- Copyright notice

### Home Page Components

#### Hero
- Full-screen hero section
- Event countdown timer
- Call-to-action buttons
- Cinematic background

#### FestHighlights
- Key statistics (events, participants, prizes)
- Highlight cards with images
- Theme-consistent design

#### EventsPreview
- Carousel of featured events
- Event cards with image, price, category
- Navigation arrows

#### SignatureNights
- Key signature events showcase
- Timeline of event schedule

#### FAQ
- Accordion-style Q&A
- Collapsible answers
- Common questions database

### Dashboard Components

#### LeaderboardWidget
- Top 10-20 CAs by coins
- Real-time updates
- User rank display

#### PassportCard
- User info display (name, email, ID)
- Pass type display
- QR code (if needed)

#### ProfileModal
- Edit profile form
- Email verification status
- Update personal info

#### TeamManager
- Create team form
- Join team with code input
- Team list display

### UI Components

#### Button
- Multiple variants: primary, secondary, outline, ghost
- Size options: small, medium, large
- Loading states
- Icon support

#### Modal
- Overlay backdrop
- Close button
- Animation support
- Keyboard escape to close

#### CountdownTimer
- Displays time until event
- Updates in real-time
- Format: DD:HH:MM:SS

---

## Data Flow & Workflows

### 1. User Registration Flow

```
User Registration Form
    ↓
POST /api/register (email, password, name, etc.)
    ↓
Normalize email (toLowerCase)
    ↓
Check duplicate (transaction lock)
    ↓
Hash password (bcryptjs 10 rounds)
    ↓
Generate 6-digit ID & referral code
    ↓
Create verification token
    ↓
Create user in DB
    ↓
Award referrer 50 coins (if referralCode)
    ↓
Send verification email (SMTP)
    ↓
Response: "Check email to verify"
    ↓
User clicks email link
    ↓
POST /api/verify-email (token)
    ↓
Update user.emailVerified = true
    ↓
Redirect to login
```

### 2. Login & Authentication Flow

```
User Login Form
    ↓
POST /api/auth/signin (email, password)
    ↓
NextAuth Credentials Provider
    ↓
Query user by email
    ↓
Compare password (bcryptjs)
    ↓
Check emailVerified = true
    ↓
Create JWT session
    ↓
Set session cookie
    ↓
Redirect to dashboard
```

### 3. Event Registration Flow

```
Browse Events Page
    ↓
Click "Register"
    ↓
Add to Cart (POST /api/cart)
    ↓
Update cart display
    ↓
View Cart
    ↓
Select Pass Type (basic/accommodation)
    ↓
Take payment screenshot
    ↓
Submit Checkout (POST /api/checkout)
    ↓
Create Order record
    ↓
Clear cart
    ↓
Show "Order Created" confirmation
    ↓
Admin reviews payment
    ↓
User waits for verification
```

### 4. Team Formation Flow (for group events)

```
Event Detail Page (group event)
    ↓
Option 1: Create Team
    ├─ POST /api/team/create
    ├─ Generate 6-digit code
    ├─ Add leader as member
    └─ Return team code
        ↓
        Share code with teammates
        ↓
        Teammates POST /api/team/join
        ├─ Validate code
        ├─ Check max members
        └─ Add to team
    
OR

Option 2: Join Team
    ├─ Enter team code
    └─ POST /api/team/join
```

### 5. Coin Earning Flow

```
User completes task
    ├─ Follow Instagram → taskInsta
    ├─ Follow LinkedIn → taskLinkedIn
    ├─ Add 3 events → taskCart
    └─ Add 5 events → taskCart5
        ↓
Click "Claim Reward"
    ↓
POST /api/user/claim (email, task)
    ↓
Start transaction
    ├─ Validate task preconditions
    └─ Atomic update: [task]: true, caCoins += reward
        ↓
        Double-claim prevention
        └─ If already true → Error
    ├─ Create CoinHistory record
    └─ Return new balance
        ↓
Update user coins display
    ↓
Add to leaderboard (if top performer)
```

### 6. Admin Verification Flow

```
User submits order
    ↓
Admin Dashboard
    ├─ View pending orders
    ├─ Check payment screenshot
    ├─ Verify payment details
    └─ Approve/Reject
        ↓
        UPDATE order.status = "PAID"
        ↓
        Auto-refund if deposit applicable
        ↓
        Send confirmation email to user
```

---

## Authentication & Security

### Authentication Strategy
- **Provider**: NextAuth.js v4.24.13
- **Strategy**: Credentials (email/password)
- **Session Handling**: JWT tokens
- **Session Storage**: Secure HTTP-only cookies
- **Session Duration**: Configurable (default 30 days)

### Password Security
- **Algorithm**: bcryptjs
- **Salt Rounds**: 10
- **Hashing**: One-way encryption, impossible to reverse
- **Verification**: Constant-time comparison

### Email Verification
- **Token Generation**: Crypto random 32 bytes (hex)
- **Token Storage**: emailVerificationToken in DB
- **Token Usage**: Single-use link in email
- **Expiration**: No built-in expiration (implement if needed)

### Authorization
- **Session Checks**: All protected routes verify `session?.user?.email`
- **Admin Routes**: Additional `secret` parameter check
- **Fallback Secret**: `process.env.ADMIN_SECRET || 'hensi43'`

### Data Privacy
- **Email Normalization**: Lowercase only
- **Passwords**: Never logged or exposed
- **Sessions**: Not persisted in DB (JWT-based)
- **Cart/Orders**: User-scoped queries
- **Coin History**: Immutable transaction log

### CSRF Protection
- NextAuth.js handles CSRF tokens automatically
- POST requests validated by framework

### SQL Injection Prevention
- Prisma ORM prevents SQL injection
- Type-safe queries
- Parameterized inputs

### Input Validation
- Email format validation in registrations
- Required fields check
- Event slug validation against data.ts
- Team code format validation

---

## Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/encore26"

# NextAuth
NEXTAUTH_SECRET="random_secret_key_generate_with_openssl"
NEXTAUTH_URL="https://encore.ietlucknow.ac.in"  # or http://localhost:3000

# SMTP Email Configuration
SMTP_HOST="smtp.mailersend.net"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASSWORD="smtp_password"
EMAIL_FROM="noreply@encore.ietlucknow.ac.in"

# Admin Security
ADMIN_SECRET="strong_random_secret_for_admin_routes"

# Node Environment
NODE_ENV="production"  # or "development"
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### Local Development Setup
```bash
# 1. Clone repository
git clone <repo-url>
cd encore26

# 2. Install dependencies
npm install

# 3. Setup .env.local
cp .env.example .env.local
# Edit .env.local with local database URL & SMTP settings

# 4. Run Prisma migrations
npx prisma migrate dev

# 5. Seed database (optional)
npx prisma db seed

# 6. Start development server
npm run dev

# Access at http://localhost:3000
```

### Production Deployment
```bash
# 1. Build project
npm run build

# 2. Start production server
npm start

# 3. Ensure environment variables set in deployment platform
# 4. Database migrations auto-run via build script
```

### Scripts
- **`npm run dev`**: Start dev server with hot reload
- **`npm run build`**: Prisma generate + Next.js build
- **`npm start`**: Start production server
- **`npm run lint`**: Run ESLint checks

---

## Additional Features & Notes

### Event Data Structure
Events are statically defined in `lib/data.ts` with:
- **slug**: URL-friendly identifier
- **title**: Event name
- **category**: Event type (Dance, Art, Drama, etc.)
- **price**: Registration fee in rupees
- **description**: Event details
- **venue**: Location (multiple options for large events)
- **rules**: Array of participation rules
- **isTeam**: Boolean (true for group events)
- **minSize/maxSize**: Team constraints (if group)

### Email Templates
Verification email includes:
- Clickable button with verification link
- Fallback plain text link
- HTML & plain text versions
- Personalized greeting

### Payment System
- **Methods**: Manual verification via screenshots
- **Payment ID**: UTR, Razorpay ID, or similar
- **Screenshot**: Base64 or URL storage
- **Status Tracking**: PENDING → PAID → FAILED
- **Deposit Handling**: Separate tracking for refundable amounts

### Database Migrations
- **Location**: `prisma/migrations/`
- **Version Control**: All migrations tracked
- **Auto-applied**: On `npm run build`
- **Lock File**: `migration_lock.toml` prevents conflicts

### Error Handling
- **API Errors**: Consistent 400/401/404/500 responses
- **Validation**: Input checks before DB operations
- **Transactions**: Atomic operations for critical flows
- **Logging**: Console logs for debugging

### Performance Considerations
- **Prisma Singleton**: `lib/prisma.ts` prevents connection overload
- **Unique Constraints**: Database-level duplicate prevention
- **Indexing**: Email, referralCode indexed for fast lookups
- **Cart Caching**: One-to-one relationship for quick access
- **Pagination**: Orders/history not implemented (can add if needed)

### Future Enhancements
- [ ] Razorpay/PaytM integration for automated payments
- [ ] OTP-based login
- [ ] Social login (Google, GitHub)
- [ ] Push notifications for order updates
- [ ] Email reminders for event registration
- [ ] Analytics dashboard
- [ ] User feedback/ratings system
- [ ] Duplicate order prevention
- [ ] Email delivery status tracking
- [ ] Rate limiting on API endpoints

---

## Support & Debugging

### Common Issues

**Email not sending**:
- Check SMTP credentials in `.env`
- Verify `NODE_ENV` isn't blocking emails
- Check email logs in console (dev mode)
- Verify DNS/firewall allows SMTP outbound

**User already exists error**:
- Check email case sensitivity (normalized to lowercase)
- Verify email is unique in DB
- Check database connection

**Password verification fails**:
- Ensure password was hashed on registration
- Check bcryptjs version compatibility
- Verify password comparison logic

**Cart item not adding**:
- Verify event slug matches data.ts
- Check user authentication session
- Verify unique constraint (eventSlug per cart)

**Admin routes returning 401**:
- Verify ADMIN_SECRET matches environment variable
- Check secret parameter in query string
- Verify admin secret is set

### Useful Commands

```bash
# View database
npx prisma studio

# Reset database (dev only)
npx prisma migrate reset

# View migrations
npx prisma migrate status

# Create migration
npx prisma migrate dev --name migration_name

# Generate Prisma client
npx prisma generate

# Seed database
npx prisma db seed
```

---

## License & Credits

- **Theme**: Nawabi Elegance
- **Festival**: Encore 26 - IET Lucknow Annual Cultural Fest
- **Built With**: Next.js, React, TypeScript, Prisma, MySQL
- **Hosted**: On production server with SSL/TLS

---

## Summary

**Encore 26** is a comprehensive, production-ready festival management platform with:
- ✅ Secure user authentication & authorization
- ✅ Event discovery & registration system
- ✅ Shopping cart & checkout with payment tracking
- ✅ Team management for group events
- ✅ Gamified coin reward system
- ✅ Campus Ambassador (CA) program
- ✅ Admin dashboard with full CRUD operations
- ✅ Email verification & notifications
- ✅ Real-time leaderboard
- ✅ Scalable architecture with Prisma ORM
- ✅ Type-safe development with TypeScript
- ✅ Beautiful, responsive UI with Tailwind CSS

The codebase is well-organized, follows Next.js best practices, implements proper transaction handling for critical operations, and includes comprehensive security measures for production deployment.

