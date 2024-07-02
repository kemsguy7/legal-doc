import React from 'react';

interface TemplateDisplayProps {
  formData: { [key: string]: string };
  templateHtml: string;
}

const TemplateDisplay: React.FC<TemplateDisplayProps> = ({ formData, templateHtml }) => {
  const filledTemplate = templateHtml.replace(/#Dynamic firstPartyType=.*?#(.*?)\\Dynamic\\/gs, (match, p1) => {
    const dynamicMatch = match.match(/#Dynamic firstPartyType=(.*?)#/);
    const dynamicKey = dynamicMatch ? dynamicMatch[1] : '';

    return p1.replace(new RegExp(dynamicKey, 'g'), formData[dynamicKey] || '______');
  });

  const updatedTemplate = filledTemplate.replace(/{{(.*?)}}/g, (_, key) => formData[key.trim()] || '______');

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
      dangerouslySetInnerHTML={{ __html: updatedTemplate }}
    />
  );
};

export default TemplateDisplay;
