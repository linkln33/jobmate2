import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-900">Admin Test Page</h1>
      <p className="mt-2 text-gray-600">If you can see this, the admin routing is working correctly.</p>
    </div>
  );
};

export default TestPage;
