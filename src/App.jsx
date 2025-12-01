import { useState } from 'react'
import './App.css'
import { quizData } from './data'
import jsPDF from 'jspdf'
import { supabase, isSupabaseAvailable } from './supabase'

// Scoring configuration: points for each option (0 = worst, 6 = best)
// For rating scales, we'll calculate based on the option value
const scoringConfig = [
  [6, 5, 4, 3, 2, 1], // Q1: Focus duration (6 options)
  [6, 5, 4, 3, 2, 1], // Q2: Task switching (6 options)
  [1, 2, 3, 4, 5], // Q3: Rate 1-5 (sustain deep focus)
  [6, 5, 4, 3, 2], // Q4: Return to focus (5 options)
  [6, 5, 4, 3, 2], // Q5: Deep work hours (5 options)
  [6, 5, 4, 3, 2, 1], // Q6: Focus decline timing (6 options)
  [6, 5, 4, 3, 2], // Q7: Brain fog (5 options)
  [6, 5, 4, 3, 2], // Q8: Reading comprehension (5 options)
  [6, 5, 4, 3, 2, 1], // Q9: Morning clarity (6 options: 0,2,4,6,8,10)
  [6, 5, 4, 3, 2], // Q10: After work fatigue (5 options)
  [6, 5, 4, 3, 2, 1], // Q11: Notice mind wandering (6 options)
  [6, 5, 4, 3, 2], // Q12: Redirect attention (5 options)
  [6, 5, 4, 3, 2], // Q13: Mental state awareness (5 options)
  [6, 5, 4, 3, 2], // Q14: Flow states (5 options)
  [1, 2, 3, 4, 5], // Q15: Rate 1-5 (resist distractions)
]

// Category definitions
const categories = {
  elite: {
    range: [75, 90],
    name: "Elite Focus Performer",
    description: "You demonstrate exceptional focus, strong cognitive endurance, and consistent ability to sustain deep work. Your attention control and meta-awareness are advanced, allowing you to re-enter focus quickly even after distractions.",
    strengths: [
      "You can maintain deep work windows of 45–90 minutes",
      "Task-switching is minimal, showing disciplined attention",
      "Brain fog is rare, indicating strong sleep and recovery habits",
      "High self-awareness helps you stay in control of your focus states"
    ],
    whatThisMeans: "Your cognitive patterns resemble top-performing knowledge workers, founders, and high-level problem-solvers. This level of focus gives you an extreme edge in long-term career performance, especially in areas requiring creativity, technical skills, and strategy.",
    whatToImprove: "Even at high performance, micro-leaks of attention can occur.",
    improvements: [
      "Protecting energy cycles (Ultradian cycles: 90 min on, 15 min off)",
      "Reducing digital noise",
      "Maintaining sleep & nutrition consistency",
      "Tracking deep work hours weekly"
    ],
    suggestedPractices: [
      "60–90 minute deep work blocks",
      "Afternoon recovery walks",
      "Intentional phone distance during work zones",
      "Weekly review of your energy peaks"
    ]
  },
  strong: {
    range: [55, 74],
    name: "Strong but Inconsistent Focus",
    description: "You have solid focus capabilities but experience noticeable fluctuations. Your attention control is good when conditions are right, but distractions and fatigue can significantly impact your performance.",
    strengths: [
      "You can achieve deep focus for 30–45 minute periods",
      "Good awareness of your mental state most of the time",
      "Ability to recover from distractions with moderate effort",
      "Flow states occur regularly when conditions align"
    ],
    whatThisMeans: "You're performing above average but leaving potential on the table. Inconsistent focus patterns can create stress and reduce long-term productivity. With targeted improvements, you can reach elite performance levels.",
    whatToImprove: "Your main challenges are consistency and energy management.",
    improvements: [
      "Establishing consistent deep work routines",
      "Managing energy dips throughout the day",
      "Reducing reactive task-switching",
      "Building stronger attention recovery skills"
    ],
    suggestedPractices: [
      "45–60 minute focused blocks with scheduled breaks",
      "Energy mapping to identify peak performance windows",
      "Digital detox periods during deep work",
      "Mindfulness practice to improve meta-awareness"
    ]
  },
  moderate: {
    range: [35, 54],
    name: "Moderate Attention Stability",
    description: "Your focus is present but fragile. You can concentrate for short periods, but sustained attention is challenging. Distractions frequently interrupt your flow, and cognitive fatigue sets in relatively quickly.",
    strengths: [
      "You recognize when your attention drifts",
      "Some ability to refocus after distractions",
      "Awareness that focus is an area for improvement",
      "Willingness to work on attention skills"
    ],
    whatThisMeans: "You're in the middle range where significant improvements are possible. Your focus patterns suggest room for growth in both duration and consistency. With dedicated practice, you can move into strong focus territory.",
    whatToImprove: "Focus sustainability and distraction resistance need the most work.",
    improvements: [
      "Building longer focus sessions gradually",
      "Creating distraction-free work environments",
      "Improving sleep and recovery habits",
      "Developing stronger attention control techniques"
    ],
    suggestedPractices: [
      "Start with 25–30 minute focus blocks",
      "Use Pomodoro technique with strict break rules",
      "Phone in another room during work",
      "Daily meditation or breathing exercises"
    ]
  },
  weak: {
    range: [20, 34],
    name: "Weak Attention Control",
    description: "Your attention is frequently scattered, and maintaining focus is a significant challenge. Distractions dominate your work sessions, and deep work is rare. Cognitive fatigue appears quickly and recovery is slow.",
    strengths: [
      "You're aware that focus is an issue",
      "Some moments of clarity occur",
      "Potential for improvement exists",
      "Recognition of the need for change"
    ],
    whatThisMeans: "Your current focus patterns are limiting your productivity and potential. However, attention is a trainable skill, and with systematic changes, you can significantly improve your cognitive performance.",
    whatToImprove: "Fundamental attention skills and work environment need major changes.",
    improvements: [
      "Complete digital detox during work hours",
      "Restructuring work environment to minimize distractions",
      "Addressing sleep, nutrition, and stress management",
      "Building basic focus habits from the ground up"
    ],
    suggestedPractices: [
      "15–20 minute focus blocks to start",
      "Single-tasking only (one thing at a time)",
      "Scheduled distraction time (check phone only at set times)",
      "Daily focus training exercises"
    ]
  },
  severe: {
    range: [0, 19],
    name: "Severely Fragmented Focus",
    description: "Your attention is highly fragmented with minimal sustained focus ability. Work sessions are constantly interrupted, and deep work is essentially non-existent. This level of fragmentation significantly impacts productivity and well-being.",
    strengths: [
      "Taking this assessment shows self-awareness",
      "Recognition that change is needed",
      "Every improvement will make a significant difference",
      "Starting point for building focus from scratch"
    ],
    whatThisMeans: "Your focus patterns indicate severe attention fragmentation that likely affects multiple areas of life. This requires immediate and systematic intervention. The good news is that even small improvements will have noticeable impact.",
    whatToImprove: "Everything needs attention, but start with the fundamentals.",
    improvements: [
      "Complete work environment overhaul",
      "Strict digital boundaries and phone management",
      "Addressing underlying health issues (sleep, stress, nutrition)",
      "Professional support may be beneficial"
    ],
    suggestedPractices: [
      "Start with 10–15 minute focus blocks",
      "One task at a time, no multitasking",
      "Phone completely away during work",
      "Consider professional coaching or therapy for attention issues"
    ]
  }
}

function App() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailValidated, setEmailValidated] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isFading, setIsFading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [answers, setAnswers] = useState([])

  // Calculate score from answers
  const calculateScore = () => {
    let totalScore = 0
    answers.forEach((answer) => {
      const questionIndex = answer.questionIndex
      const optionIndex = answer.selectedOptionIndex
      
      // Use scoring config for all questions
      if (scoringConfig[questionIndex] && optionIndex < scoringConfig[questionIndex].length) {
        totalScore += scoringConfig[questionIndex][optionIndex]
      }
    })
    return totalScore
  }

  // Get category based on score
  const getCategory = (score) => {
    if (score >= 75 && score <= 90) return categories.elite
    if (score >= 55 && score <= 74) return categories.strong
    if (score >= 35 && score <= 54) return categories.moderate
    if (score >= 20 && score <= 34) return categories.weak
    return categories.severe
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    // Save email to Supabase (only if configured)
    if (isSupabaseAvailable() && supabase) {
      try {
        const { error } = await supabase
          .from('quiz_attempts')
          .insert([
            {
              email: email.trim(),
              attempted_at: new Date().toISOString()
            }
          ])

        if (error) {
          console.error('Error saving email to Supabase:', error)
          // Still allow user to proceed even if save fails
        }
      } catch (err) {
        console.error('Error saving email to Supabase:', err)
        // Still allow user to proceed even if save fails
      }
    }

    setEmailValidated(true)
  }

  const handleAnswerClick = (answerIndex) => {
    if (isFading) return // Prevent clicks during transition
    
    // Allow changing answer if already selected
    const isChangingAnswer = selectedAnswer !== null && selectedAnswer !== answerIndex
    
    setSelectedAnswer(answerIndex)
    
    // Save the answer
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = {
      questionIndex: currentQuestion,
      question: quizData[currentQuestion].question,
      selectedOptionIndex: answerIndex,
      selectedOption: quizData[currentQuestion].options[answerIndex]
    }
    setAnswers(newAnswers)

    // Only auto-advance if this is a new selection (not just changing)
    // But always auto-advance after a short delay
    setIsFading(true)

    // Auto-advance after fade animation
    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        const nextQuestion = currentQuestion + 1
        setCurrentQuestion(nextQuestion)
        // Restore previous answer if exists
        const prevAnswer = newAnswers[nextQuestion]
        setSelectedAnswer(prevAnswer ? prevAnswer.selectedOptionIndex : null)
        setIsFading(false)
      } else {
        setShowResults(true)
      }
    }, 500) // Match CSS transition duration
  }

  const handlePrevious = () => {
    if (currentQuestion === 0 || isFading) return

    // Save current answer before moving (if user changed it)
    if (selectedAnswer !== null) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = {
        questionIndex: currentQuestion,
        question: quizData[currentQuestion].question,
        selectedOptionIndex: selectedAnswer,
        selectedOption: quizData[currentQuestion].options[selectedAnswer]
      }
      setAnswers(newAnswers)
    }

    setIsFading(true)
    setTimeout(() => {
      const prevQuestion = currentQuestion - 1
      setCurrentQuestion(prevQuestion)
      // Restore previous answer if exists
      const prevAnswer = answers[prevQuestion]
      setSelectedAnswer(prevAnswer ? prevAnswer.selectedOptionIndex : null)
      setIsFading(false)
    }, 500)
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsFading(false)
    setShowResults(false)
    setAnswers([])
    setEmailValidated(false)
    setEmail('')
    setEmailError('')
  }

  const handleDownload = () => {
    const totalScore = calculateScore()
    const category = getCategory(totalScore)
    const scoreRange = `${category.range[0]}–${category.range[1]}`

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPosition = margin

    // Helper function to add text with word wrap
    const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
      doc.setFontSize(fontSize)
      doc.setTextColor(color[0], color[1], color[2])
      if (isBold) {
        doc.setFont(undefined, 'bold')
      } else {
        doc.setFont(undefined, 'normal')
      }
      
      const lines = doc.splitTextToSize(text, maxWidth)
      
      // Check if we need a new page
      if (yPosition + (lines.length * fontSize * 0.4) > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
      }
      
      doc.text(lines, margin, yPosition)
      yPosition += lines.length * fontSize * 0.4 + 5
    }

    // Title
    addText('YOUR FOCUS & FLOW ASSESSMENT', 18, true, [0, 0, 0])
    yPosition += 5

    // Date
    addText(`Date: ${new Date().toLocaleString()}`, 11, false, [100, 100, 100])
    yPosition += 10

    // Category and Score
    addText(`Category: ${category.name}`, 16, true, [0, 0, 0])
    addText(`Your Score: ${totalScore} (${scoreRange})`, 14, true, [0, 0, 0])
    yPosition += 10

    // Description
    addText('Description:', 14, true, [0, 0, 0])
    addText(category.description, 11, false, [0, 0, 0])
    yPosition += 10

    // Strengths
    addText('Strengths:', 14, true, [0, 0, 0])
    category.strengths.forEach(strength => {
      addText(`• ${strength}`, 11, false, [0, 0, 0])
    })
    yPosition += 10

    // What This Means
    addText('What This Means:', 14, true, [0, 0, 0])
    addText(category.whatThisMeans, 11, false, [0, 0, 0])
    yPosition += 10

    // What to Improve
    addText('What to Improve:', 14, true, [0, 0, 0])
    addText(category.whatToImprove, 11, false, [0, 0, 0])
    addText('Focus on:', 12, true, [0, 0, 0])
    category.improvements.forEach(improvement => {
      addText(`• ${improvement}`, 11, false, [0, 0, 0])
    })
    yPosition += 10

    // Suggested Practices
    addText('Suggested Practices:', 14, true, [0, 0, 0])
    category.suggestedPractices.forEach(practice => {
      addText(`• ${practice}`, 11, false, [0, 0, 0])
    })

    // Save the PDF
    const fileName = `focus-assessment-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  if (!emailValidated) {
    return (
      <div className="quiz-container">
        <div className="email-form-container fade-in">
          <h1 className="email-form-title">Attention Capacity Assessment</h1>
          <p className="email-form-subtitle">Please enter your email address to begin</p>
          <form onSubmit={handleEmailSubmit} className="email-form">
            <div className="email-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                placeholder="Enter your email address"
                className={`email-input ${emailError ? 'error' : ''}`}
                autoFocus
              />
              {emailError && <p className="email-error">{emailError}</p>}
            </div>
            <button type="submit" className="email-submit-button">
              Start Assessment
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (showResults) {
    const totalScore = calculateScore()
    const category = getCategory(totalScore)
    const scoreRange = `${category.range[0]}–${category.range[1]}`

    return (
      <div className="quiz-container">
        <div className="results-screen fade-in">
          <h1>Your Focus & Flow Assessment</h1>
          
          <div className="score-display-wrapper">
            <div className="score-display">
              <div className="category-badge">{category.name}</div>
            </div>
            <div className="score-info">
              <span className="score-label">Your Score:</span>
              <span className="score-value">{totalScore}</span>
              <span className="score-range">({scoreRange})</span>
            </div>
          </div>

          <div className="report-section">
            <h2 className="report-section-title">Description</h2>
            <p className="report-text">{category.description}</p>
          </div>

          <div className="report-section">
            <h2 className="report-section-title">Strengths</h2>
            <ul className="report-list">
              {category.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="report-section">
            <h2 className="report-section-title">What This Means</h2>
            <p className="report-text">{category.whatThisMeans}</p>
          </div>

          <div className="report-section">
            <h2 className="report-section-title">What to Improve</h2>
            <p className="report-text">{category.whatToImprove}</p>
            <p className="report-subtitle">Focus on:</p>
            <ul className="report-list">
              {category.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>

          <div className="report-section">
            <h2 className="report-section-title">Suggested Practices</h2>
            <ul className="report-list">
              {category.suggestedPractices.map((practice, index) => (
                <li key={index}>{practice}</li>
              ))}
            </ul>
          </div>

          <div className="button-group">
            <button className="download-button" onClick={handleDownload}>
              Download PDF
            </button>
            <button className="restart-button" onClick={handleRestart}>
              Restart Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  const question = quizData[currentQuestion]

  return (
    <div className="quiz-container">
      <div className={`question-container ${isFading ? 'fade-out' : 'fade-in'}`}>
        <div className="progress-bar">
          <span className="progress-text">
            Question {currentQuestion + 1} / {quizData.length}
          </span>
          <div className="progress-bar-wrapper">
            <div 
              className="progress-bar-fill"
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h1 className="question-text">{question.question}</h1>

        <div className="navigation-buttons">
          <button
            className="nav-button prev-button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isFading}
          >
            ← Previous
          </button>
        </div>

        <div className="options-container">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            let buttonClass = "option-button"
            
            if (selectedAnswer !== null && isSelected) {
              buttonClass += " selected"
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerClick(index)}
                disabled={isFading}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
