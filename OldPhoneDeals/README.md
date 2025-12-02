# TUT17-G2 OldPhoneDeals
OldPhoneDeals is a full-stack eCommerce web application designed for listing and reviewing second-hand mobile phones. Built with the MERN stack (MongoDB, Express.js, Node.js, Vue.js), the platform supports both user-facing and admin-facing interfaces.

Users can browse listings, post reviews, manage their profiles, and perform secure transactions. Administrators can manage users, listings, and moderate reviews through a dedicated admin panel. The system also supports features like review visibility control, user disabling, activity logs, and exportable reports — demonstrating a complete three-tier architecture and secure access control.

# Tech Stack
| Layer       | Tech                                 |
|-------------|--------------------------------------|
| Frontend    | Vue 3, Vue Router, Axios, Vite       |
| UI Library  | Element Plus, Bootstrap              |
| Backend     | Express.js, Mongoose, Node.js        |
| Database    | MongoDB                              |
| Auth        | JWT + Bcrypt                         |
| Email       | Nodemailer, SendGrid                 |
| Tools       | json2csv, multer, dotenv, cors       |

# Getting Started
These instructions will help you set up the project on your local machine for development and testing purposes.

Prerequisites  
Node.js (version 14 or higher)  
MongoDB (local installation or MongoDB Atlas)  
npm (comes with Node.js)  
vue (version 3.5 or higher)  

Installation  
1.Clone the repository:  
git clone https://github.com/Xueyan626/old-phone-deals.git
cd old-phone-deals 

2.Set up the backend:  
cd backend  
npm install  
npm run dev  
The backend will be running at http://localhost:3000.  

3.Set up the frontend(Open a new terminal window):  
cd frontend  
npm install  
npm run dev  
The frontend will be running at http://localhost:5173.  

# Author
Developed by Xueyan Yang (University Project)

# Acknowledgments
This repository is a personal version of a team project originally developed for a University of Sydney assignment.  
I have extracted and maintained the parts relevant to my own learning and portfolio.
