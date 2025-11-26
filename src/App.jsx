import { useState } from 'react'
import './App.css'
import { quizData } from './data'
import jsPDF from 'jspdf'

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isFading, setIsFading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [answers, setAnswers] = useState([])

  const handleAnswerClick = (answerIndex) => {
    if (selectedAnswer !== null) return // Prevent multiple clicks

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

    // After fade animation, move to next question or show results
    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsFading(false)
      } else {
        setShowResults(true)
      }
    }, 500) // Match CSS transition duration
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsFading(false)
    setShowResults(false)
    setAnswers([])
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
                disabled={selectedAnswer !== null}
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
