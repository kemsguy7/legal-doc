import React, { useState, useEffect } from 'react';

interface Question {
  label: string;
  name: string;
  type: string;
  options?: string[];
  isConfig?: boolean;
  questions?: { [key: string]: Question[] };
}

interface FormProps {
  questions: Question[];
  formData: { [key: string]: string | string[] };
  handleChange: (field: string, value: string | string[]) => void;
  handleSubmit: () => void;
}

const QuestionForm: React.FC<FormProps> = ({ questions, formData, handleChange, handleSubmit }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(questions);

  useEffect(() => {
    const updateQuestions = () => {
      let updatedQuestions: Question[] = [];
      let shouldUpdate = false;

      questions.forEach((question, index) => {
        updatedQuestions.push(question);
        if (question.isConfig && formData[question.name]) {
          const configValue = formData[question.name] as string;
          const nestedQuestions = question.questions?.[configValue] || [];
          updatedQuestions = [
            ...updatedQuestions,
            ...nestedQuestions
          ];
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setCurrentQuestions(updatedQuestions);
      }
    };

    updateQuestions();
  }, [formData, questions]);

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, currentQuestions.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleMultiSelectChange = (field: string, selectedOptions: HTMLSelectElement) => {
    const values = Array.from(selectedOptions.selectedOptions, (option) => option.value);
    handleChange(field, values);
  };

  const currentQuestion = currentQuestions[currentStep];
  const { label, name, options, type } = currentQuestion;

  return (
    <div>
      <h2>Question {currentStep + 1} of {currentQuestions.length}</h2>
      <div>
        <label>{label}</label>
        {type === 'text' && (
          <input
            type="text"
            value={formData[name] as string || ''}
            onChange={(e) => handleChange(name, e.target.value)}
          />
        )}
        {type === 'date' && (
          <input
            type="date"
            value={formData[name] as string || ''}
            onChange={(e) => handleChange(name, e.target.value)}
          />
        )}
        {type === 'textarea' && (
          <textarea
            value={formData[name] as string || ''}
            onChange={(e) => handleChange(name, e.target.value)}
          />
        )}
        {type === 'dropdown' && (
          <select
            value={formData[name] as string || ''}
            onChange={(e) => handleChange(name, e.target.value)}
          >
            <option value="">Select an option</option>
            {options?.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )}
        {type === 'radio' && (
          <div>
            {options?.map((option: string, index: number) => (
              <label key={index}>
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={formData[name] === option}
                  onChange={(e) => handleChange(name, e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
        )}
        {type === 'select' && (
          <select
            multiple
            value={formData[name] as string[] || []}
            onChange={(e) => handleMultiSelectChange(name, e.target)}
          >
            {options?.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )}
      </div>
      <div>
        <button onClick={prevStep} disabled={currentStep === 0}>
          Previous
        </button>
        {currentStep < currentQuestions.length - 1 ? (
          <button onClick={nextStep}>
            Next
          </button>
        ) : (
          <button onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionForm;
