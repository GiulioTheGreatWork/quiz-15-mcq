import { useState } from 'react'
import './App.css'
import { quizData } from './data'
import jsPDF from 'jspdf'

function App() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailValidated, setEmailValidated] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isFading, setIsFading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [answers, setAnswers] = useState([])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailSubmit = (e) => {
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

    setEmailValidated(true)
  }

  const handleAnswerClick = (answerIndex) => {
    if (selectedAnswer !== null) return // Prevent multiple clicks during auto-advance

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

    // Fade out animation
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
    addText('ATTENTION CAPACITY ASSESSMENT - RESULTS', 18, true, [0, 0, 0])
    yPosition += 5

    // Date and summary
    addText(`Date: ${new Date().toLocaleString()}`, 11, false, [100, 100, 100])
    addText(`Total Questions: ${quizData.length}`, 11, false, [100, 100, 100])
    addText(`Questions Answered: ${answers.length}`, 11, false, [100, 100, 100])
    yPosition += 10

    // Add a line
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10

    // Questions and answers
    answers.forEach((answer, index) => {
      // Question number
      addText(`Question ${answer.questionIndex + 1}:`, 14, true, [0, 0, 0])
      
      // Question text
      addText(answer.question, 11, false, [0, 0, 0])
      yPosition += 3

      // Answer label
      addText('Your Answer:', 11, true, [0, 0, 0])
      
      // Selected answer
      addText(answer.selectedOption, 11, false, [0, 100, 0])
      yPosition += 5

      // Separator line
      if (index < answers.length - 1) {
        doc.setDrawColor(220, 220, 220)
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10
      }
    })

    // Save the PDF
    const fileName = `attention-assessment-${new Date().toISOString().split('T')[0]}.pdf`
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
    return (
      <div className="quiz-container">
        <div className="results-screen fade-in">
          <h1>Assessment Complete!</h1>
          <div className="score-display">
            <p className="score-text">Thank you for completing the assessment</p>
            <p className="score-number">All {quizData.length} questions answered</p>
            <p className="score-percentage">
              Your responses have been recorded
            </p>
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
                disabled={selectedAnswer !== null || isFading}
              >
                {option}
              </button>
            )
          })}
        </div>

        <div className="navigation-buttons">
          <button
            className="nav-button prev-button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isFading}
          >
            ← Previous
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
