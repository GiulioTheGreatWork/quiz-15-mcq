# Focus & Flow Assessment - Quiz Application

A comprehensive 15-question multiple-choice quiz application designed to assess an individual's focus capacity, cognitive fatigue patterns, and attention control. The application provides personalized feedback and downloadable PDF reports based on the user's responses.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Application Overview](#application-overview)
- [How It Works](#how-it-works)
- [Features Implemented](#features-implemented)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Client Summary](#client-summary)

## 🛠 Tech Stack

### Core Technologies
- **React 19.2.0** - Modern UI library for building interactive user interfaces
- **Vite 7.2.4** - Next-generation frontend build tool for fast development and optimized production builds
- **JavaScript (ES6+)** - Modern JavaScript with modules

### Key Libraries
- **jsPDF 3.0.4** - Client-side PDF generation library for creating downloadable assessment reports
- **React DOM 19.2.0** - React rendering library
- **@supabase/supabase-js** - Supabase client library for database operations

### Development Tools
- **ESLint** - Code linting and quality assurance
- **gh-pages** - GitHub Pages deployment support
- **@vitejs/plugin-react** - Vite plugin for React support with Fast Refresh

## 🎯 Application Overview

The Focus & Flow Assessment is an interactive quiz application that evaluates users across three key dimensions:

1. **Focus Sustainability** (5 questions) - Measures ability to maintain deep work and resist distractions
2. **Cognitive Fatigue Patterns** (5 questions) - Assesses mental clarity, brain fog, and energy levels throughout the day
3. **Attention Control & Meta-Awareness** (5 questions) - Evaluates self-awareness and ability to manage attention

## 🔄 How It Works

### User Flow

1. **Email Validation & Capture**
   - Users enter their email address to begin the assessment
   - Email format is validated before proceeding
   - Email is automatically saved to Supabase when user starts the quiz

2. **Question Navigation**
   - 15 sequential questions with smooth fade transitions
   - Progress bar shows completion status
   - Previous button allows users to review and change answers
   - Auto-advance after selection with visual feedback

3. **Answer Selection**
   - Each question presents multiple choice options
   - Selected answers are highlighted
   - Answers are saved and can be modified before submission
   - Smooth animations enhance user experience

4. **Scoring System**
   - Each answer is assigned points based on a predefined scoring configuration
   - Questions use different point scales (1-6 points depending on question type)
   - Total score calculated from all 15 questions (maximum: 88 points)

5. **Results & Categorization**
   - Users are categorized into one of 5 performance levels:
     - **Elite Focus Performer** (75-88 points)
     - **Strong but Inconsistent Focus** (55-74 points)
     - **Moderate Attention Stability** (35-54 points)
     - **Weak Attention Control** (20-34 points)
     - **Severely Fragmented Focus** (0-19 points)

6. **Personalized Report**
   - Detailed description of the user's focus profile
   - Strengths identification
   - What the results mean for their performance
   - Specific improvement recommendations
   - Suggested practices and techniques

7. **PDF Export**
   - Users can download a comprehensive PDF report
   - Includes all assessment results, recommendations, and personalized feedback
   - Professional formatting suitable for sharing or printing

## ✨ Features Implemented

### Core Features
- ✅ **15-Question Assessment** - Comprehensive evaluation across three cognitive dimensions
- ✅ **Email Validation** - Entry point with email verification
- ✅ **Progress Tracking** - Visual progress bar showing completion status
- ✅ **Answer Persistence** - Answers saved and can be reviewed/modified
- ✅ **Smooth Animations** - Fade transitions between questions for better UX
- ✅ **Previous/Next Navigation** - Full control over question navigation
- ✅ **Scoring Algorithm** - Sophisticated scoring system with weighted points
- ✅ **Performance Categorization** - 5-tier classification system
- ✅ **Personalized Feedback** - Detailed, category-specific recommendations
- ✅ **PDF Report Generation** - Downloadable assessment report with all details

### Question Types
- Multiple choice with 5-6 options per question
- Rating scales (1-5) with descriptive labels
- Time-based questions (minutes, hours)
- Frequency-based questions (times per week, per hour)
- Self-assessment scales with detailed descriptions

### User Experience
- Responsive design for various screen sizes
- Clean, modern UI with professional styling
- Intuitive navigation and clear visual feedback
- Error handling and validation
- Smooth state management

## 📁 Project Structure

```
quiz-15-mcq/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── assets/            # React assets
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── data.js            # Quiz questions and configuration
│   ├── supabase.js        # Supabase client configuration
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── dist/                   # Production build output
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

### Key Files

- **`src/App.jsx`** - Main application logic, state management, scoring algorithm, PDF generation
- **`src/data.js`** - Quiz questions, options, and answer configurations
- **`src/App.css`** - Comprehensive styling for all components
- **`vite.config.js`** - Build configuration with GitHub Pages base path

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-15-mcq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase (Required for email capture)**
   
   a. Create a Supabase project at [https://supabase.com](https://supabase.com)
   
   b. Create a table called `quiz_attempts` in your Supabase database:
   ```sql
   CREATE TABLE quiz_attempts (
     id BIGSERIAL PRIMARY KEY,
     email TEXT NOT NULL,
     attempted_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
   
   c. Set up Row Level Security (RLS) policies to allow inserts:
   ```sql
   -- Enable RLS
   ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
   
   -- Allow anonymous inserts (for capturing emails)
   CREATE POLICY "Allow anonymous inserts" ON quiz_attempts
     FOR INSERT
     TO anon
     WITH CHECK (true);
   ```
   
   d. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   You can find these values in your Supabase project settings under API.

4. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```
   Production files will be in the `dist/` directory

5. **Preview production build**
   ```bash
   npm run preview
   ```

6. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

## 📊 Client Summary

### What We've Built

A professional, production-ready assessment application that evaluates cognitive focus and attention capacity. The application provides:

1. **Comprehensive Assessment**
   - 15 carefully crafted questions covering focus sustainability, cognitive fatigue, and attention control
   - Multiple question formats including rating scales, time-based, and frequency-based questions
   - Professional question design with descriptive options

2. **Intelligent Scoring System**
   - Weighted scoring algorithm that assigns appropriate point values to each answer
   - 5-tier performance categorization system
   - Score ranges from 0-88 points with meaningful performance bands

3. **Personalized Feedback**
   - Detailed category-specific descriptions
   - Strengths identification
   - Actionable improvement recommendations
   - Suggested practices and techniques tailored to performance level

4. **Professional User Experience**
   - Smooth animations and transitions
   - Intuitive navigation with progress tracking
   - Email validation and data persistence
   - Responsive design for all devices

5. **Report Generation**
   - Downloadable PDF reports with complete assessment results
   - Professional formatting suitable for sharing
   - Includes all feedback, recommendations, and personalized insights

### Technical Highlights

- **Modern Stack**: Built with React 19 and Vite for optimal performance
- **Fast Development**: Hot module replacement for instant updates during development
- **Optimized Builds**: Production builds are optimized for fast loading
- **Clean Code**: ESLint configured for code quality
- **Deployment Ready**: Configured for GitHub Pages deployment

### Business Value

- **User Engagement**: Interactive quiz format keeps users engaged
- **Actionable Insights**: Provides specific, personalized recommendations
- **Professional Output**: PDF reports can be saved and shared
- **Scalable**: Easy to modify questions, scoring, or add new features
- **Maintainable**: Clean code structure for future updates

### Next Steps (Optional Enhancements)

- Add backend integration for storing results
- Implement email delivery of PDF reports
- Add analytics tracking
- Create admin dashboard for viewing aggregate results
- Add multi-language support
- Implement A/B testing for questions

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
