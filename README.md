# GestorFitness - Discover, Book & Train with the Best Fitness Classes

## The Problem We Solve

Finding the right fitness class, booking it effortlessly, and staying motivated can be overwhelming. Fitness enthusiasts often struggle to discover local classes that fit their schedule, while passionate trainers lack a centralized platform to reach new students, manage bookings, and build a dedicated community.

**GestorFitness** bridges this gap. It is a comprehensive B2C fitness marketplace that connects members with top-tier trainers. We make it effortless for users to discover and book classes, enable trainers to manage their schedules and students, and foster a thriving community forum where everyone can share their fitness journey.

---

## Live Links

- **Live Platform:** [GestorFitness Live](https://gestorfitness.vercel.app/)
- **Client Repository:** [GitHub - Client](https://github.com/JowelislamHabib/GestorFitness-client)
- **Server Repository:** [GitHub - Server](https://github.com/JowelislamHabib/GestorFitness-server)

---

## Tech Stack & Technologies

**Frontend & Framework:**

- **Next.js 16 (App Router):** Server-side rendering (SSR), optimized SEO, and blazing-fast performance.
- **React 19:** Utilizing the latest React features and concurrent rendering.
- **Tailwind CSS v4 & Shadcn UI:** For a fully responsive, modern, and accessible design system.
- **Framer Motion:** Smooth, interactive animations to bring the UI to life.
- **Recharts:** Dynamic analytics charts for administrative data visualization.

**Backend & Authentication:**

- **BetterAuth:** Robust, secure authentication supporting credential and Google logins.
- **MongoDB Atlas & Next.js Route Handlers / Express Server:** NoSQL database for flexible data management, equipped with `$regex` for powerful search and `$in` for filtering.
- **JSON Web Tokens (JWT):** Secure HTTP-Only cookie-based session management.
- **Stripe Integration:** Seamless and secure payment processing for class bookings.

---

## Key Features & User Roles

### For Members

- **Discover & Filter:** Search classes by name using regex and filter by category (Yoga, Cardio, etc.).
- **Secure Booking:** Effortlessly book classes with Stripe payments. System prevents duplicate bookings.
- **Favorites:** Save preferred classes to a personalized dashboard.
- **Community:** Read, like, and comment on forum posts created by trainers and admins to stay inspired.

### For Trainers

- **Class Management:** Create, update, and manage fitness classes. Track students enrolled in each session.
- **Community Building:** Post engaging content, articles, and tips on the Community Forum.
- **Dashboard:** Track total classes created and total student enrollments visually.

### For Administrators

- **Platform Moderation:** Oversee all users, approve or reject trainer applications, and review new class submissions.
- **Security:** Ability to "Soft Block" users—preventing malicious state changes while keeping the platform accessible.
- **Financial Oversight:** Read-only access to all Stripe transactions and system-wide metrics.

---

## Project Structure

```text
gestorfitness-client/
├── public
│   ├── images
│   │   ├── forums
│   │   │   ├── category_cardio_portrait.png
│   │   │   ├── category_strength_portrait.png
│   │   │   ├── category_yoga_portrait.png
│   │   │   └── hero_fitness_banner.png
│   │   ├── slider
│   │   │   ├── slide-image-1.png
│   │   │   ├── slide-image-2.png
│   │   │   ├── slide-image-3.png
│   │   │   └── slide-image-4.png
│   │   ├── a-man-in-a-gym.jpg
│   │   ├── brand-01.png
│   │   ├── man-lifting-dumbbells.png
│   │   ├── muscular-man.png
│   │   └── sporty.jpg
│   ├── GestorFitness-Logo-Black.png
│   ├── GestorFitness-Logo-White.png
│   ├── GestorFitness.eps
│   ├── GestorFitness.png
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── (public)
│   │   │   ├── (auth)
│   │   │   │   ├── login
│   │   │   │   │   └── page.jsx
│   │   │   │   └── register
│   │   │   │       └── page.jsx
│   │   │   ├── classes
│   │   │   │   ├── [id]
│   │   │   │   │   ├── ClassDetailsClient.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── forums
│   │   │   │   ├── [id]
│   │   │   │   │   ├── ForumPostDetailsClient.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── latest
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── pricing
│   │   │   │   └── success
│   │   │   │       └── page.jsx
│   │   │   ├── unauthorized
│   │   │   │   └── page.jsx
│   │   │   ├── layout.js
│   │   │   ├── loading.jsx
│   │   │   └── page.js
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...all]
│   │   │   │       └── route.js
│   │   │   └── checkout_sessions
│   │   │       └── route.js
│   │   ├── dashboard
│   │   │   ├── admin
│   │   │   │   ├── classes
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── forum-posts
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── [id]
│   │   │   │   │   │       └── page.jsx
│   │   │   │   │   ├── new
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── students
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── trainers
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── transactions
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── users
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── AdminChart.jsx
│   │   │   │   ├── AdminDashboardClient.jsx
│   │   │   │   ├── AdminPieChart.jsx
│   │   │   │   ├── layout.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── edit-class
│   │   │   │   └── [id]
│   │   │   │       └── page.jsx
│   │   │   ├── favorites
│   │   │   │   └── page.jsx
│   │   │   ├── trainer
│   │   │   │   ├── add-class
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── classes
│   │   │   │   │   ├── new
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── forum-posts
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── [id]
│   │   │   │   │   │       └── page.jsx
│   │   │   │   │   ├── new
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── students
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── transactions
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── TrainerDashboardClient.jsx
│   │   │   │   ├── layout.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── user
│   │   │   │   ├── apply-trainer
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── booked-classes
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── transactions
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── UserDashboardClient.jsx
│   │   │   │   ├── layout.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── layout.js
│   │   │   ├── loading.jsx
│   │   │   └── page.jsx
│   │   ├── globals.css
│   │   ├── icon.png
│   │   ├── layout.js
│   │   └── not-found.jsx
│   ├── components
│   │   ├── classes
│   │   │   └── ClassCard.jsx
│   │   ├── dashboard
│   │   │   ├── admin
│   │   │   ├── trainer
│   │   │   ├── user
│   │   │   └── ClassesManager.jsx
│   │   ├── dashboardPage
│   │   │   └── shared
│   │   │       ├── AddForumPostForm.jsx
│   │   │       ├── DashboardNavbar.jsx
│   │   │       ├── DashboardSidebar.jsx
│   │   │       ├── EditForumPostForm.jsx
│   │   │       ├── ManageForumPosts.jsx
│   │   │       ├── NotificationsDropdown.jsx
│   │   │       ├── StudentsTable.jsx
│   │   │       ├── TransactionsTable.jsx
│   │   │       └── dashboard-actions.js
│   │   ├── forums
│   │   │   └── ForumPostCard.jsx
│   │   ├── home
│   │   │   ├── About.jsx
│   │   │   ├── Banner.jsx
│   │   │   ├── BlogSection.jsx
│   │   │   ├── FeaturedClasses.jsx
│   │   │   ├── Marquee.jsx
│   │   │   ├── Partners.jsx
│   │   │   ├── Promo.jsx
│   │   │   └── Trainers.jsx
│   │   ├── shared
│   │   │   ├── CallToAction.jsx
│   │   │   ├── ClientNav.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── GlobalLoading.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── LogoutButton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── ui
│   │   │   ├── animated-counter.jsx
│   │   │   ├── avatar.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── calendar.jsx
│   │   │   ├── card.jsx
│   │   │   ├── chart.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── popover.jsx
│   │   │   ├── select.jsx
│   │   │   ├── separator.jsx
│   │   │   ├── sheet.jsx
│   │   │   ├── sonner.jsx
│   │   │   ├── stat-card.jsx
│   │   │   ├── table.jsx
│   │   │   ├── textarea.jsx
│   │   │   └── tooltip.jsx
│   │   └── theme-provider.jsx
│   ├── lib
│   │   ├── actions
│   │   │   ├── forumComments.js
│   │   │   ├── forumPosts.js
│   │   │   └── users.js
│   │   ├── api
│   │   │   ├── bookings.js
│   │   │   ├── classes.js
│   │   │   ├── favorites.js
│   │   │   ├── forumComments.js
│   │   │   ├── forumPosts.js
│   │   │   ├── notifications.js
│   │   │   ├── trainerApplications.js
│   │   │   └── users.js
│   │   ├── core
│   │   │   ├── server.js
│   │   │   └── session.js
│   │   ├── auth-client.js
│   │   ├── auth.js
│   │   ├── getTokenServer.js
│   │   ├── stripe.js
│   │   └── utils.js
│   └── proxy.js
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── components.json
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
└── postcss.config.mjs
```

---

## Getting Started

Follow these steps to set up the frontend project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/JowelislamHabib/GestorFitness-client.git
cd GestorFitness-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_auth_secret
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## Development Challenges Conquered

- **Secure Role-Based Access Control:** Implemented an impenetrable `proxy.js` layer that rigorously validates active user sessions and roles (User vs Trainer vs Admin) before rendering private dashboard layouts.
- **Advanced State Management & Hydration:** Minimized client-server hydration mismatches by strictly typing components and utilizing Next.js Server Components wherever interactive React states weren't required.
- **Database Search Optimization:** Leveraged native MongoDB `$regex` and `$in` operators to provide instantaneous, real-time filtering of a large database of fitness classes without overwhelming the client.
