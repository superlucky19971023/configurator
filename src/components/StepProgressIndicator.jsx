import React from 'react';

const StepProgressIndicator = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full">
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          {index > 0 && <div className="flex-1 h-1 bg-gray-300"></div>}
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
              index < currentStep ? 'bg-black text-white' : 'border-gray-300'
            }`}
          >
            {index + 1}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepProgressIndicator;
