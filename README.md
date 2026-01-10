# Restaurant Table Reservation API

A clean, production-ready **RESTful API** for managing restaurant tables and customer reservations.  
Built with modern Node.js practices, strong business rule enforcement, and real-time availability checking.

**Current Status:** Backend core implemented with responsive frontend  
**Database:** MySQL (via Prisma ORM)  
**Deployment Target:** Ready for Docker + cloud deployment

---

## Features

- ✅ Create and manage restaurants with operating hours
- ✅ Add tables with capacity constraints
- ✅ Create reservations with automatic table assignment
- ✅ Prevent double-bookings using overlap detection
- ✅ Enforce operating hours validation
- ✅ Real-time table availability endpoint
- ✅ Input validation & comprehensive error handling
- ✅ Rate limiting & security headers (helmet)
- ✅ Responsive frontend interface (HTML/CSS/JS)

---

## 🛠️ Tech Stack

- **Runtime:** Node.js ≥ 18
- **Framework:** Express.js
- **ORM/Database:** Prisma + MySQL
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit
- **Environment:** dotenv
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Testing:** Jest + Supertest (planned)

---

## Project Structure

```
restaurant-reserve-api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── restaurantController.js
│   │   └── reservationController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── routes/
│   │   ├── restaurantRoutes.js
│   │   └── reservationRoutes.js
│   ├── services/
│   │   ├── restaurantService.js
│   │   └── reservationService.js
│   ├── utils/
│   │   ├── timeHelper.js
│   │   └── responseFormatter.js
│   └── app.js
├── public/
│   └── index.html
├── tests/
│   └── setup.js
├── .env
├── .gitignore
├── package.json
├── server.js
├── LICENSE
└── README.md
```

---

## API Endpoints

| Method | Endpoint                                      | Description                              |
|--------|-----------------------------------------------|------------------------------------------|
| GET    | `/restaurants`                                | Get all restaurants                      |
| POST   | `/restaurants`                                | Create a new restaurant                  |
| GET    | `/restaurants/:restaurantId`                  | Get restaurant details + tables          |
| POST   | `/restaurants/:restaurantId/tables`           | Add a table to a restaurant              |
| GET    | `/restaurants/:restaurantId/reservations?date=YYYY-MM-DD` | Get reservations for a specific date |
| GET    | `/restaurants/:restaurantId/availability?date=YYYY-MM-DD&partySize=N` | Get available slots for party size |
| POST   | `/reservations`                               | Create a new reservation                 |

### Example Payloads

**Create Restaurant**
```json
{
  "name": "Tallie Bistro",
  "opensAt": "10:00",
  "closesAt": "22:00"
}
```

**Add Table**
```json
{
  "tableNumber": "T1",
  "capacity": 4
}
```

**Create Reservation**
```json
{
  "restaurantId": 1,
  "customerName": "John Doe",
  "phone": "08012345678",
  "partySize": 4,
  "startTime": "2026-01-15T19:00:00",
  "durationMinutes": 120
}
```

---

## Business Rules Enforced

- ✅ Reservations must be within restaurant operating hours
- ✅ Party size cannot exceed table capacity
- ✅ No overlapping reservations on the same table
- ✅ Overlap detection: `(existing.start < new.end) && (existing.end > new.start)`
- ✅ Automatic best-fit table assignment (first available suitable table)
- ✅ Input validation (time format, positive integers, phone numbers, etc.)
- ✅ Future date validation for reservations

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MySQL server (local or cloud)
- npm or yarn
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/framelinks/restaurant-reserve-api.git
   cd restaurant-reserve-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="mysql://root:yourpassword@localhost:3306/restaurant_db"
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Set up database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   ```

5. **Start the server**
   ```bash
   npm run dev    # with nodemon (recommended)
   # or
   npm start
   ```

6. **Access the application**
   - API: `http://localhost:3000`
   - Frontend: Open `public/index.html` in your browser

---

## Testing the API

### Using PowerShell

```powershell
# Create a restaurant
$body = @{
    name = "Tallie Bistro"
    opensAt = "10:00"
    closesAt = "22:00"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/restaurants" -Method POST -Body $body -ContentType "application/json"

# Add a table
$body = @{
    tableNumber = "T1"
    capacity = 4
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/restaurants/1/tables" -Method POST -Body $body -ContentType "application/json"

# Check availability
Invoke-RestMethod -Uri "http://localhost:3000/restaurants/1/availability?date=2026-01-15&partySize=4" -Method GET
```

### Using the Frontend

1. Open `public/index.html` in your browser
2. Create a restaurant
3. Add tables to the restaurant
4. Make reservations
5. Check availability and view reservations

---

## Development Notes

- Project was initially bootstrapped in **Termux (Android)** → transitioned to **Windows** for better MySQL/Prisma support
- Prisma binary targets include `linux-arm64-openssl-3.0.x` for Termux compatibility
- MySQL chosen over SQLite for better production readiness and ACID compliance
- String-based table numbers (e.g., "T1", "VIP-1") for flexibility
- Custom overlap detection algorithm prevents double-bookings
- Rate limiting configured to prevent API abuse

---

## Planned Enhancements

- [ ] JWT Authentication & role-based access control (Admin/Staff/Customer)
- [ ] Reservation modification & cancellation endpoints
- [ ] Waitlist system for fully booked slots
- [ ] Advanced table optimization (smart assignment algorithm)
- [ ] Redis caching for high-traffic availability queries
- [ ] Docker + docker-compose setup
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] SMS/Email notifications (Twilio/SendGrid integration)
- [ ] Pagination & filtering for large result sets
- [ ] Admin dashboard (React/Vue.js)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

---

## LICENSE

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Free to use for personal and commercial projects
- ✅ Can modify and distribute
- ✅ Must include original copyright notice
- ✅ No warranty provided

---

##  Author & Copyright

**Created by:** Levyni Co (zionbridge)  
**GitHub:** [@framelinks](https://github.com/framelinks)  
**Year:** 2026  
**Project Start Date:** January 2026

© 2026 Levyni Co. All rights reserved.

This project was built from scratch as a demonstration of full-stack development skills for portfolio purposes. While the code is open source under MIT License, proper attribution is required.

---

## Note for Reviewers & Interviewers

This is an **original project** built entirely from scratch by **Levyni Co (zionbridge)** in **January 2026**.

### Verification of Authorship
- ✅ Complete Git commit history with timestamps available on GitHub
- ✅ All code written and committed by framelinks
- ✅ Development process documented in commit messages
- ✅ Repository created and maintained by framelinks

### Technical Decisions & Implementation Highlights

**Architecture Decisions:**
- Chose **MySQL over MongoDB** for ACID compliance in reservation systems where data consistency is critical
- Implemented **custom overlap detection algorithm** for preventing double-bookings
- Used **Prisma ORM** for type-safe database queries and easy migrations
- Built **RESTful API** following industry best practices and HTTP standards

**Key Features Implemented:**
- Real-time availability checking with efficient database queries
- Automatic table assignment based on capacity and availability
- Comprehensive input validation using express-validator
- Security best practices (helmet, CORS, rate limiting)
- Time-based business logic with custom helper utilities
- Responsive frontend without frameworks (vanilla JavaScript)

**Development Journey:**
- Started development in Termux (Android) for portability
- Transitioned to Windows for better tooling support
- Iteratively built features with proper Git workflow
- Designed database schema with scalability in mind

**Code Quality:**
- Clean, modular architecture with separation of concerns
- Service layer pattern for business logic
- Middleware for cross-cutting concerns
- Consistent error handling and response formatting
- Self-documenting code with clear naming conventions

### Portfolio Context

This project demonstrates proficiency in:
- Backend API development with Node.js/Express
- Database design and ORM usage
- RESTful architecture
- Security best practices
- Frontend integration
- Git version control
- Problem-solving and algorithm design

**Feel free to:**
- Review the complete commit history on GitHub
- Test the API endpoints
- Examine the code structure and implementation
- Ask questions about technical decisions

---

## Attribution

If you use this code in your projects, please:
- Link back to this repository
- Credit the original author (Frameworks/framelinks)
- Maintain the LICENSE file
- Follow the MIT License terms

---

## 📧 Contact

For questions, suggestions, or collaboration opportunities:
- **GitHub Issues:** [Create an issue](https://github.com/framelinks/restaurant-reserve-api/issues)
- **GitHub Profile:** [@framelinks](https://github.com/framelinks)

---

**Built with ❤️ by Levyni Co (zionbridge)**

Happy reserving! 🍽️