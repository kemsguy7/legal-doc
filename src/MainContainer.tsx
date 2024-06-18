import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import TemplateDisplay from './TemplateDisplay';

import './index.css';

const App: React.FC = () => {
  const [formData, setFormData] = useState<{ [key: string]: string | string[] }>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [templateHtml, setTemplateHtml] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    fetch('http://ec2-3-141-13-187.us-east-2.compute.amazonaws.com/api/v1/item/27')
      .then((response) => response.json())
      .then((data) => {
        const fields = data.data.configuration.formConfig.modules;
        const html = data.data.configuration.html;

        // Initialize formData with empty strings for all expected keys
        const initialFormData: { [key: string]: string | string[] } = {};
        fields.forEach((field: any) => {
          // Assuming here that each field initially expects a single string value
          initialFormData[field.name] = '';
        });
s
        setQuestions(fields);
        setFormData(initialFormData);
        setTemplateHtml(html);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="container">
      <div className="form-section">
        {isLoaded && (
          <QuestionForm
            questions={questions}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
      <div className="template-section">
        <TemplateDisplay formData={formData as { [key: string]: string }} templateHtml={templateHtml} />
      </div>
    </div>
  );
};

export default App;
