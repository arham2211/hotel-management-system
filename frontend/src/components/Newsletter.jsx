import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 2000);
    }
  };

  return (
    <div className="max-w-6xl border-2 border-[#002366] mx-auto p-2 mb-20 transform transition-transform 
                   duration-300 hover:-translate-y-1">
      <div 
        className="bg-gradient-to-br from-white to-gray-50 
                   border-2 border-[#002366] p-10 
                   "
      >
        <h2 className="text-center mb-8 text-3xl font-semibold text-[#002366]">
          Subscribe Our{' '}
          <span className="text-[#ff8c00] font-bold">
            NEWSLETTER
          </span>
        </h2>

        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-5 py-3 rounded-lg border-2 
                     border-gray-200 focus:border-[#002366] 
                     focus:outline-none focus:ring-2 
                     focus:ring-[#002366] focus:ring-opacity-10 
                     transition-all duration-300"
          />
          <button
            onClick={handleSubmit}
            className={`px-8 py-3 rounded-lg font-semibold 
                      transform transition-all duration-300 
                      hover:-translate-y-0.5 
                      ${
                        isSubmitted 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-[#ff8c00] hover:bg-[#e67e00]'
                      } 
                      text-white`}
          >
            {isSubmitted ? '✓ Submitted' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;