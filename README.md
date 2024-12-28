<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Gym-management -->
# Gym Booking System
Check out this website online at: https://gym-slot-management-adithya2152s-projects.vercel.app/
## Project Overview
This project is a Gym Booking System designed to manage user registrations, slot bookings, and fitness tracking efficiently. The database schema enforces constraints to ensure data consistency and uses triggers to manage booking limits and prevent conflicts. The system includes roles such as Trainers and Admins for better management of operations.

---

## Features

1. **Secure user Registration and login:**
   - Users can register with essential details including email, password, age, weight, height, etc.
   - Email verification system via OTP.
   - Passwords are stored in the hashed form in the database to ensure security.

2. **Slot Booking:**
   - Users, trainers and admin can view the available slots. 
   - Prevents overbooking of slots beyond their defined maximum limit.
   - Admin can create slots choosing the time duration, start time and date; can also create multiple slots at once.
   - Users can book a particular slot based on the above parameters, and can also book multiple slots at once.

3. **Database Constraints:**
   - Triggers to prevent double bookings.
   - Automatic updates to the number of bookings in a slot when a booking is made or canceled.
   - Locking booking transactions to prevent race conditions and data corruption.

4. **Fitness Tracking:**
   - Tracks user body metrics such as weight, height, body fat percentage, muscle mass, and more.
   
5. **Exercise Modules:**
   - This includes the specific exercise methods and details tailored for each fitness routines and muscle type. 
   - Users can filter the exercises based on their required muscle-type.
   - Hover over a card to expand it.

6. **Admin Calendar:**
   - The admin can view the calendar and check the number of slots booked based on the color that appears for that day:
   -- Green: slots are available
   -- Red: all slots booked for the day
---

## Roles

### Admin Role
- **Username:** [adithya2152]
- **Email:** [adithyabharadwaj15@gmail.com]
- **Password:** [adithya]
- Responsibilities:
  - Manage users, trainers and slots.
  - Can add new trainers, edit their info or delete the trainers.
  - Oversee database operations.

### Trainer Role
- **Username:** [pranav]
- **Email:** [pranav@gmail.com]
- **Password:** [pranav]
- Responsibilities:
  - Monitor user progress.
  - Assist users with slot bookings if required.

### User Role
- View the available gym slots.
- View current progress and goals.
- Book the required slots.
---

## Future Enhancements
- Add user notifications for upcoming slots.
- Implement a payment gateway for slot bookings.
- Introduce reports for user performance tracking.

---

