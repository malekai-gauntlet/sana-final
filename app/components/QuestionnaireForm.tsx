import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface Question {
  id: string;
  type: 'multiple_choice' | 'text';
  text: string;
  options?: string[];
}

interface QuestionnaireFormProps {
  questions: Question[];
  onSubmit: (answers: { [key: string]: string }) => void;
}

export const QuestionnaireForm = ({ questions, onSubmit }: QuestionnaireFormProps) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const allAnswered = questions.every(q => answers[q.id]);
    if (!allAnswered) {
      alert('Please answer all questions before submitting.');
      return;
    }
    onSubmit(answers);
  };

  return (
    <View style={styles.container}>
      {questions.map((question, index) => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {index + 1}. {question.text}
          </Text>
          
          {question.type === 'multiple_choice' && question.options && (
            <View style={styles.optionsContainer}>
              {question.options.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    answers[question.id] === option && styles.optionButtonSelected
                  ]}
                  onPress={() => handleAnswer(question.id, option)}
                >
                  <Text style={[
                    styles.optionText,
                    answers[question.id] === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {question.type === 'text' && (
            <TextInput
              style={styles.textInput}
              value={answers[question.id] || ''}
              onChangeText={(text) => handleAnswer(question.id, text)}
              placeholder="Type your answer here..."
              multiline
              numberOfLines={3}
            />
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#000000',
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 