# SmartSaver - Your AI-powered Money Tracker

## About the Project

SmartSaver is a full-stack web application designed to help users efficiently manage their finances. The inspiration for this project came from personal struggles with tracking expenses and understanding spending habits. The app provides a user-friendly way to monitor income, expenses, and savings, and offers AI-powered insights to help users make informed financial decisions.

The key features include:

- **Expense Tracking:** Categorize and monitor spending.
- **Daily Notifications:** Receive updates on spending habits, income, and savings.
- **AI Integration:** Get AI-driven advice on spending decisions based on your financial situation.
- **Savings Calculation:** Automatically calculate savings based on income.
- **Customizable Settings:** Adjust app settings to align with specific financial goals.

## Tech Stack

- **Frontend:** Next.js
- **Backend:** Node.js, Express
- **Database:** MySQL

Why MySQL?

While the MERN stack is a popular choice, the team chose MySQL due to their existing comfort level and experience with it from university. It proved to be a suitable solution for the project's needs.

## What We Learned

This project provided valuable experience in building a full-stack application from the ground up. Key takeaways include:

- Understanding the complete flow of data from the frontend to the backend and database.
- Gaining practical experience in integrating different technologies.
- Learning to overcome challenges in UI implementation and AI integration.

## Challenges Faced

- **UI Implementation:** Translating a detailed Figma design into a React application proved challenging due to the team's limited React experience. The design was simplified while maintaining a clean and functional user interface.
- **AI Integration:** Integrating AI features required creative problem-solving to provide relevant and helpful financial recommendations.

## Conclusion

SmartSaver is a rewarding project that addresses a real-world problem and provides a practical tool for managing personal finances. The team gained valuable experience in full-stack development and is excited to continue improving the app and adding new features.

## How to set up and use the project

1.  Download the code.
2.  Navigate to the backend: `cd backend`
3.  Start the backend server: `node index.js`
4.  Navigate to the frontend: `cd frontend`
5.  Start the frontend development server: `npm run dev`

The application will be accessible in your browser.

## Application Routes

- `/`: Login page
- `/register`: Registration page
- `/dashboard`: User dashboard
- `/transaction`: Transaction management
- `/category`: Category management
- `/ask-ai`: AI-powered financial advice
- `/user-profile`: User profile management
- `...` (Other routes as needed)
