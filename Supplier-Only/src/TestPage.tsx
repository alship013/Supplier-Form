import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#000000', fontSize: '24px', marginBottom: '20px' }}>
        VSTS Test Page
      </h1>
      <p style={{ color: '#333333', marginBottom: '10px' }}>
        If you can see this page clearly, the basic setup is working.
      </p>
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#000000', fontSize: '18px' }}>Background Test:</h2>
        <p style={{ color: '#666666' }}>
          This section has a light gray background to test visibility.
        </p>
      </div>
      <div style={{
        backgroundColor: '#16a34a',
        color: '#ffffff',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '18px' }}>Primary Color Test:</h2>
        <p>
          This uses the primary-600 color (#16a34a) from your Tailwind config.
        </p>
      </div>
    </div>
  );
};

export default TestPage;