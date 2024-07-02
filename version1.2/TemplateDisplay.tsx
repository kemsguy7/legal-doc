import React from 'react';

interface TemplateDisplayProps {
  formData: { [key: string]: string };
  templateHtml: string;
}

const TemplateDisplay: React.FC<TemplateDisplayProps> = ({ formData, templateHtml }) => {
  const filledTemplate = templateHtml.replace(/{{(.*?)}}/g, (_, key) => formData[key.trim()] || '______');

  return (
    <div
      style={{
        width: '70%',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        overflowY: 'scroll',
        maxHeight: '90vh'
      }}
      dangerouslySetInnerHTML={{ __html: filledTemplate }}
    />
  );
};

export default TemplateDisplay;
