
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './ConditionInput.css';

const priorityOptions = [
  { value: 'housingCost', label: '저렴한 주거비', description: '보증금과 월세 부담이 적은 곳' },
  { value: 'transport', label: '교통 편의성', description: '직장이나 학교까지 이동이 편한 곳' },
  { value: 'convenience', label: '생활 편의시설', description: '마트, 병원, 편의시설이 가까운 곳' },
  { value: 'safety', label: '안전한 환경', description: '치안과 주변 환경이 좋은 곳' },
  { value: 'environment', label: '쾌적한 환경', description: '공원과 녹지 등 휴식 공간이 있는 곳' }
];

function ConditionInput() {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();

  const [formData, setFormData] = useState({
    budget: userData.budget || '',
    monthlyRentBudget: userData.monthlyRentBudget || '',
    destination: userData.destination || '',
    transportation: userData.transportation || 'subway',
    commuteTime: userData.commuteTime || 30,
    priorities: userData.priorities || [],
    age: userData.age || '',
    income: userData.income || ''
  });

  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError('');
  };

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
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.budget || !formData.destination.trim()) {
      setError('보증금 예산과 목적지를 입력해 주세요.');
      return;
    }

    if (formData.priorities.length === 0) {
      setError('생활 우선순위를 하나 이상 선택해 주세요.');
      return;
    }

    updateUserData({
      ...formData,
      budget: Number(formData.budget),
      monthlyRentBudget: formData.monthlyRentBudget
        ? Number(formData.monthlyRentBudget)
        : '',
      commuteTime: Number(formData.commuteTime),
      age: formData.age ? Number(formData.age) : ''
    });

    navigate('/recommendation');
  };

  return (
    <main className="condition-page">
      <div className="condition-container">

        <div className="condition-heading">
          <span className="condition-eyebrow">MY HOUSING PROFILE</span>
          <h1>어떤 집을 찾고 계신가요?</h1>
          <p>
            나의 주거 조건과 생활 패턴을 알려주시면
            <br />
            더 잘 맞는 서울의 동네를 찾아드릴게요.
          </p>
        </div>

        <div className="step-progress">
          <div className="step-progress-item active">
            <span>1</span>
            <strong>주거 조건</strong>
          </div>
          <div className="step-progress-line" />
          <div className="step-progress-item">
            <span>2</span>
            <strong>지역 추천</strong>
          </div>
          <div className="step-progress-line" />
          <div className="step-progress-item">
            <span>3</span>
            <strong>혜택 확인</strong>
          </div>
        </div>

        <form className="condition-form" onSubmit={handleSubmit}>

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
                  min="0"
                  placeholder="예: 2000"
                  value={formData.budget}
                  onChange={handleChange}
                />
                <span>만원</span>
              </div>
              <small>보증금으로 사용할 수 있는 최대 금액을 입력해 주세요.</small>
            </div>

            <div className="form-field">
              <label htmlFor="monthlyRentBudget">월세 예산</label>
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
              <small>희망하는 월세 금액을 입력해 주세요. 선택 항목입니다.</small>
            </div>
          </section>

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
                  className={`choice-button ${formData.transportation === 'subway' ? 'selected' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, transportation: 'subway' }))}
                >
                  <span>🚇</span>
                  지하철
                </button>

                <button
                  type="button"
                  className={`choice-button ${formData.transportation === 'bus' ? 'selected' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, transportation: 'bus' }))}
                >
                  <span>🚌</span>
                  버스
                </button>

                <button
                  type="button"
                  className={`choice-button ${formData.transportation === 'car' ? 'selected' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, transportation: 'car' }))}
                >
                  <span>🚗</span>
                  자가용
                </button>

                <button
                  type="button"
                  className={`choice-button ${formData.transportation === 'walk' ? 'selected' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, transportation: 'walk' }))}
                >
                  <span>🚶</span>
                  도보
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="commuteTime">편도 이동 가능 시간</label>
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

          <section className="condition-card">
            <div className="condition-card-heading">
              <span className="condition-number">03</span>
              <div>
                <h2>생활 우선순위</h2>
                <p>중요하게 생각하는 조건을 선택해 주세요. (복수 선택)</p>
              </div>
            </div>

            <div className="priority-list">
              {priorityOptions.map((option) => {
                const selected = formData.priorities.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`priority-option ${selected ? 'selected' : ''}`}
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

          <section className="condition-card">
            <div className="condition-card-heading">
              <span className="condition-number">04</span>
              <div>
                <h2>기본 정보</h2>
                <p>청년 주거지원 정책을 확인하기 위한 정보입니다.</p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="age">나이</label>
              <div className="input-with-unit">
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="예: 27"
                  value={formData.age}
                  onChange={handleChange}
                />
                <span>세</span>
              </div>
              <small>선택 항목입니다. 정책별 연령 기준 확인에 활용합니다.</small>
            </div>

            <div className="form-field">
              <label htmlFor="income">월 소득 구간</label>
              <select
                id="income"
                name="income"
                value={formData.income}
                onChange={handleChange}
              >
                <option value="">선택해 주세요.</option>
                <option value="under100">100만 원 미만</option>
                <option value="100to200">100만 원 이상 ~ 200만 원 미만</option>
                <option value="200to300">200만 원 이상 ~ 300만 원 미만</option>
                <option value="300to400">300만 원 이상 ~ 400만 원 미만</option>
                <option value="over400">400만 원 이상</option>
                <option value="unknown">잘 모르겠어요.</option>
              </select>
              <small>
                정확한 소득이 아닌 구간으로 입력할 수 있습니다.
              </small>
            </div>
          </section>

          {error && (
            <div className="condition-error" role="alert">
              {error}
            </div>
          )}

          <div className="condition-actions">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate('/')}
            >
              이전으로
            </button>

            <button type="submit" className="primary-button">
              맞춤 지역 추천받기 <span>→</span>
            </button>
          </div>

          <p className="privacy-notice">
            입력한 정보는 현재 브라우저에 저장되며, 서비스 추천 목적으로 사용됩니다.
          </p>
        </form>
      </div>
    </main>
  );
}

export default ConditionInput;
