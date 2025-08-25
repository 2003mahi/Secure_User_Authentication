# 🔐 Secure User Authentication

A simple and secure user authentication system built with modern backend practices.  
This project demonstrates how to implement safe user registration and login with proper authentication and route protection.

## ✨ Features
- ✅ User **Registration** and **Login** endpoints  
- 🔒 **Passwords stored in hashed form** (no plain-text storage)  
- 🔑 **JWT-based authentication** to protect routes  
- 📌 **Protected API endpoint** accessible only to authenticated users  
- 🛡️ Input validation with proper **HTTP status codes** for errors  
- ⚡ Clean and modular project structure  

## 🚀 Getting Started
1. Clone the repo  
2. Install dependencies  
3. Add environment variables (JWT secret, DB config)  
4. Run the project (`npm run dev` or `python main.py`)  

## 📌 Example Endpoints
- `POST /register` → Register a new user  
- `POST /login` → Authenticate and get a token  
- `GET /protected` → Access secured data (requires token)  

## 🏆 Why this project?
This project showcases secure coding practices in authentication systems while keeping it simple, beginner-friendly, and production-ready.
