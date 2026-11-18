
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import StepProgress from '../components/common/StepProgress';
import './ConditionInput.css';

const priorityOptions = [
  {
    value: 'housingCost',
    label: '저렴한 주거비',
    description: '보증금과 월세 부담이 적은 곳'
  },
  {
    value: 'transport',
    label: '교통 편의성',
    description: '직장이나 학교까지 이동이 편한 곳'
  },
  {
    value: 'convenience',
    label: '생활 편의시설',
    description: '마트, 병원, 편의시설이 가까운 곳'
  },
  {
    value: 'safety',
    label: '안전한 환경',
    description: '치안과 주변 환경이 좋은 곳'
  },
  {
    value: 'environment',
    label: '쾌적한 환경',
    description: '공원과 녹지 등 휴식 공간이 있는 곳'
  }
];

function ConditionInput() {
  const navigate = useNavigate();
  const { userData, updateUserData, resetUserData } = useUser();

  // 기존에 저장된 입력값 불러오기
  const [formData, setFormData] = useState({
    budget: userData.budget ?? '',
    monthlyRentBudget: userData.monthlyRentBudget ?? '',
    destination: userData.destination ?? '',
    transportation: userData.transportation || 'subway',
    commuteTime: userData.commuteTime ?? 30,
    priorities: userData.priorities ?? []
  });

  const [error, setError] = useState('');

  // 일반 입력값 변경
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError('');
  };

  // 생활 우선순위 선택 및 해제
  const handlePriorityToggle = (value) => {
    setFormData((prev) => {
      const isSelected = prev.priorities.includes(value);

      return {
        ...prev,
        priorities: isSelected
          ? prev.priorities.filter((item) => item !== value)
          : [...prev.priorities, value]
      };
    });

    setError('');
  };

  // 입력값 초기화
  const handleReset = () => {
    const isConfirmed = window.confirm(
      '입력한 주거 조건과 선택 정보가 모두 초기화됩니다.\n처음부터 다시 입력하시겠습니까?'
    );

    if (!isConfirmed) return;

    resetUserData();

    setFormData({
      budget: '',
      monthlyRentBudget: '',
      destination: '',
      transportation: 'subway',
      commuteTime: 30,
      priorities: []
    });

    setError('');
  };

  // 다음 단계 이동
  const handleSubmit = (event) => {
    event.preventDefault();

    // 필수 입력값 확인
    if (!formData.budget || Number(formData.budget) <= 0) {
      setError('보증금 예산을 입력해 주세요.');
      return;
    }

    if (!formData.destination.trim()) {
      setError('직장 또는 학교 위치를 입력해 주세요.');
      return;
    }

    if (formData.priorities.length === 0) {
      setError('생활 우선순위를 하나 이상 선택해 주세요.');
      return;
    }

    // 입력값 Context 및 LocalStorage 저장
    updateUserData({
      ...formData,
      budget: Number(formData.budget),
      monthlyRentBudget: formData.monthlyRentBudget
        ? Number(formData.monthlyRentBudget)
        : '',
      commuteTime: Number(formData.commuteTime)
    });

    // 지역 추천 화면으로 이동
    navigate('/recommendation');
  };

  return (
    <main className="condition-page">
      <div className="condition-container">

        {/* 페이지 제목 */}
        <div className="condition-heading">
          <span className="condition-eyebrow">MY HOUSING PROFILE</span>

          <h1>어떤 집을 찾고 계신가요?</h1>

          <p>
            나의 주거 조건과 생활 패턴을 알려주시면
            <br />
            더 잘 맞는 서울의 동네를 찾아드릴게요.
          </p>
        </div>

        {/* 진행 단계 */}
        <StepProgress currentStep={1} />


          {/* 입력 초기화 */}
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
          >
            입력 초기화하고 처음부터 시작하기
          </button>
        <form className="condition-form" onSubmit={handleSubmit}>

          {/* 01. 주거 예산 */}
          <section className="condition-card">
            <div className="condition-card-heading">
              <span className="condition-number">01</span>

              <div>
                <h2>주거 예산</h2>
                <p>생각하고 있는 주거 비용을 알려주세요.</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="budget">
                보증금 예산 <span className="required">*</span>
              </label>

              <div className="input-with-unit">
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="1"
                  placeholder="예: 2000"
                  value={formData.budget}
                  onChange={handleChange}
                />

                <span>만원</span>
              </div>

              <small>
                보증금으로 사용할 수 있는 최대 금액을 입력해 주세요.
              </small>
            </div>

            <div className="form-field">
              <label htmlFor="monthlyRentBudget">
                월세 예산
              </label>

              <div className="input-with-unit">
                <input
                  id="monthlyRentBudget"
                  name="monthlyRentBudget"
                  type="number"
                  min="0"
                  placeholder="예: 60"
                  value={formData.monthlyRentBudget}
                  onChange={handleChange}
                />

                <span>만원</span>
              </div>

              <small>
                희망하는 월세 금액을 입력해 주세요. 선택 항목입니다.
              </small>
            </div>
          </section>

          {/* 02. 주요 이동 목적지 */}
          <section className="condition-card">
            <div className="condition-card-heading">
              <span className="condition-number">02</span>

              <div>
                <h2>주요 이동 목적지</h2>
                <p>주로 이동하는 장소를 입력해 주세요.</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="destination">
                직장 또는 학교 위치 <span className="required">*</span>
              </label>

              <input
                id="destination"
                name="destination"
                type="text"
                placeholder="예: 서울시 강남구 역삼동"
                value={formData.destination}
                onChange={handleChange}
              />

              <small>
                현재는 주소나 지역명을 입력할 수 있습니다.
                추후 지도 검색 기능을 연결할 예정입니다.
              </small>
            </div>

            <div className="form-field">
              <label>주요 교통수단</label>

              <div className="choice-grid">
                <button
                  type="button"
                  className={`choice-button ${
                    formData.transportation === 'subway' ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transportation: 'subway'
                    }))
                  }
                >
                  <span>🚇</span>
                  지하철
                </button>

                <button
                  type="button"
                  className={`choice-button ${
                    formData.transportation === 'bus' ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transportation: 'bus'
                    }))
                  }
                >
                  <span>🚌</span>
                  버스
                </button>

                <button
                  type="button"
                  className={`choice-button ${
                    formData.transportation === 'car' ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transportation: 'car'
                    }))
                  }
                >
                  <span>🚗</span>
                  자가용
                </button>

                <button
                  type="button"
                  className={`choice-button ${
                    formData.transportation === 'walk' ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transportation: 'walk'
                    }))
                  }
                >
                  <span>🚶</span>
                  도보
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="commuteTime">
                편도 이동 가능 시간
              </label>

              <div className="range-value">
                <strong>{formData.commuteTime}분</strong>
                <span>목적지까지 허용 가능한 최대 시간</span>
              </div>

              <input
                id="commuteTime"
                name="commuteTime"
                type="range"
                min="10"
                max="90"
                step="10"
                value={formData.commuteTime}
                onChange={handleChange}
              />

              <div className="range-labels">
                <span>10분</span>
                <span>90분</span>
              </div>
            </div>
          </section>

          {/* 03. 생활 우선순위 */}
          <section className="condition-card">
            <div className="condition-card-heading">
              <span className="condition-number">03</span>

              <div>
                <h2>생활 우선순위</h2>
                <p>
                  중요하게 생각하는 조건을 선택해 주세요. (복수 선택)
                </p>
              </div>
            </div>

            <div className="priority-list">
              {priorityOptions.map((option) => {
                const selected = formData.priorities.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`priority-option ${
                      selected ? 'selected' : ''
                    }`}
                    onClick={() => handlePriorityToggle(option.value)}
                    aria-pressed={selected}
                  >
                    <span className="priority-check">
                      {selected ? '✓' : ''}
                    </span>

                    <span className="priority-text">
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 입력 오류 */}
          {error && (
            <div className="condition-error" role="alert">
              {error}
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="condition-actions">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate('/')}
            >
              홈으로
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              맞춤 지역 추천받기 <span>→</span>
            </button>
          </div>


          <p className="privacy-notice">
            입력한 정보는 현재 브라우저에 저장되며,
            서비스 추천 목적으로 사용됩니다.
          </p>

        </form>
      </div>
    </main>
  );
}

export default ConditionInput;
