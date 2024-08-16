import React, { useState, useEffect, useCallback } from 'react';
import { Button, ButtonGroup, Container, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TypingTest.css'; // Import custom CSS for animations

const hindiWords = ['उदाहरण', 'परीक्षण', 'प्रतिक्रिया', 'जावास्क्रिप्ट', 'विकासक', 'कोडिंग'];

const TypingTest = () => {
  const [language, setLanguage] = useState('English');
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState('');
  const [correctWords, setCorrectWords] = useState(0);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTestActive, setIsTestActive] = useState(false);
  const [initialTime, setInitialTime] = useState(60);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (language === 'English') {
      fetchRandomEnglishWords();
    } else {
      setWords(hindiWords.sort(() => Math.random() - 0.5));
    }
  }, [language]);

  useEffect(() => {
    let timer;
    if (isTestActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTestActive(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isTestActive]);

  useEffect(() => {
    if (currentWordIndex > 0) {
      // Add 'fade-out' class to the previous word when the current word changes
      const previousWord = document.querySelector('.word.previous-word');
      if (previousWord) {
        previousWord.classList.add('fade-out');
      }
    }
  }, [currentWordIndex]);

  const fetchRandomEnglishWords = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=100');
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error('Error fetching random words:', error);
    }
  };

  const handleInputChange = (e) => {
    if (!isTestActive) {
      setIsTestActive(true);
      setStartTime(Date.now());
    }
    const { value } = e.target;
    if (value.endsWith(' ')) {
      submitWord(value.trim());
      setTypedWord('');
    } else {
      setTypedWord(value);
    }
  };

  const submitWord = (word) => {
    setTotalWordsTyped(totalWordsTyped + 1);
    if (word === words[currentWordIndex]) {
      setCorrectWords(correctWords + 1);
    }
    setCurrentWordIndex(currentWordIndex + 1);
  };

  const startTest = () => {
    setIsTestActive(false);
    setTimeLeft(initialTime);
    setCorrectWords(0);
    setTotalWordsTyped(0);
    setTypedWord('');
    setCurrentWordIndex(0);
    setStartTime(null);
  };

  const calculateAccuracy = () => {
    return totalWordsTyped > 0 ? ((correctWords / totalWordsTyped) * 100).toFixed(2) : 0;
  };

  const calculateWPM = () => {
    if (startTime) {
      const elapsedTime = (Date.now() - startTime) / 1000 / 60;
      return ((totalWordsTyped / elapsedTime) || 0).toFixed(2);
    }
    return 0;
  };

  const increaseTime = () => {
    setInitialTime((prevTime) => prevTime + 60);
    setTimeLeft((prevTime) => prevTime + 60);
  };

  const decreaseTime = () => {
    if (initialTime > 60) {
      setInitialTime((prevTime) => prevTime - 60);
      setTimeLeft((prevTime) => prevTime - 60);
    }
  };

  const getCurrentWords = useCallback(() => {
    const currentWord = words[currentWordIndex] || '';
    const previousWord = words[currentWordIndex - 1] || '';
    const nextWord = words[currentWordIndex + 1] || '';
    return { currentWord, previousWord, nextWord };
  }, [words, currentWordIndex]);

  const { currentWord, previousWord, nextWord } = getCurrentWords();

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Typing Speed Test</h1>
      <ButtonGroup className="d-flex justify-content-center mb-4">
        <Button 
          variant={language === 'English' ? 'primary' : 'secondary'} 
          onClick={() => setLanguage('English')}
          className="language-button"
        >
          English
        </Button>
        <Button 
          variant={language === 'Hindi' ? 'primary' : 'secondary'} 
          onClick={() => setLanguage('Hindi')}
          className="language-button"
        >
          Hindi
        </Button>
      </ButtonGroup>

      <Row className="mb-4">
        <Col className="text-center">
          <div className="word-display">
            {previousWord && (
              <span className="word previous-word">
                {previousWord}
              </span>
            )}
            {currentWord && (
              <span className="word current-word">
                {currentWord}
              </span>
            )}
            {nextWord && (
              <span className="word next-word">
                {nextWord}
              </span>
            )}
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Control 
            as="textarea" 
            rows={3} 
            value={typedWord}
            onChange={handleInputChange}
            disabled={timeLeft === 0}
            className="input-area"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col className="text-center">
          <Button onClick={startTest} variant="success" size="lg">
            Reset
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col className="text-center">
          <Button 
            onClick={decreaseTime} 
            variant="warning" 
            disabled={initialTime <= 60}
            className="time-adjust-button"
          >
            -1 min
          </Button>
          <span className="mx-3 time-display">{initialTime / 60} min</span>
          <Button 
            onClick={increaseTime} 
            variant="warning"
            className="time-adjust-button"
          >
            +1 min
          </Button>
        </Col>
      </Row>

      <Row className="text-center mb-4">
        <Col>
          <div className="result-box">
            <h2 className="result-heading">Results</h2>
            <h3>Time Left: <span className="result-value">{timeLeft}s</span></h3>
            <h3>Accuracy: <span className="result-value">{calculateAccuracy()}%</span></h3>
            <h3>Speed: <span className="result-value">{calculateWPM()} WPM</span></h3>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TypingTest;
