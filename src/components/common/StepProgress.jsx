import './StepProgress.css';

const steps = [
  { path: '/condition', label: '주거 조건' },
  { path: '/recommendation', label: '지역 추천' },
  { path: '/regions', label: '지역 선택' },
  { path: '/support-info', label: '정보 입력' },
  { path: '/matching', label: '지원사업 확인' }
];

function StepProgress({ currentStep }) {
  return (
    <div className="step-progress">
      <div className="step-progress-header">
        <span className="step-progress-title">
          주거 지원 찾기
        </span>

        <span className="step-progress-count">
          {currentStep} / {steps.length} 단계
        </span>
      </div>

      <div className="step-progress-bar">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={step.path}
              className={`step-progress-item ${
                isCompleted ? 'completed' : ''
              } ${isActive ? 'active' : ''}`}
            >
              <div className="step-progress-line" />

              <div className="step-progress-circle">
                {isCompleted ? '✓' : stepNumber}
              </div>

              <span className="step-progress-label">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepProgress;
