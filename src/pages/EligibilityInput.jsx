
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

import './EligibilityInput.css';

const INITIAL_FORM = {
  age: '',
  incomeLevel: '',
  householdType: '',
  housingStatus: '',
  seoulResident: '',
  residenceType: '',
  housingBenefit: '',
  previousSupport: '',
};

function EligibilityInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, updateUserData } = useUser();

  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM,
    ...(userData.eligibilityInfo || {}),
  }));

  const [error, setError] = useState('');

  const selectedRegions =
    location.state?.selectedRegions ??
    userData.selectedRegions ??
    [];

  const housingInfo =
    location.state?.housingInfo ??
    userData.housingInfo ??
    {};

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = () => {
    const requiredFields = [
      'age',
      'incomeLevel',
      'householdType',
      'housingStatus',
      'seoulResident',
      'residenceType',
      'housingBenefit',
      'previousSupport',
    ];

    const missingField = requiredFields.find(
      (field) =>
        formData[field] === '' ||
        formData[field] === null ||
        formData[field] === undefined
    );

    if (missingField) {
      setError('모든 항목을 선택하거나 입력해 주세요.');
      return;
    }

    const eligibilityInfo = {
      ...formData,
      age: Number(formData.age),
    };

    updateUserData({
      eligibilityInfo,
    });

    navigate('/matching', {
      state: {
        selectedRegions,
        housingInfo,
        eligibilityInfo,
      },
    });
  };

  return (
    <main className="eligibility-page">
      <div className="eligibility-container">
        {/* 진행 단계 */}
        <div className="eligibility-progress">
          <div className="eligibility-progress-info">
            <span>STEP 06</span>
            <span>8단계 중 6단계</span>
          </div>

          <div className="eligibility-progress-track">
            <div className="eligibility-progress-value" />
          </div>
        </div>

        {/* 제목 */}
        <header className="eligibility-heading">
          <span className="eligibility-eyebrow">
            PERSONALIZED WELFARE
          </span>

          <h1>나에게 맞는 지원사업을 찾아볼게요</h1>

          <p>
            지원사업마다 신청 조건이 달라요.
            <br />
            몇 가지 정보를 입력하고 나에게 맞는 혜택을 확인해 보세요.
          </p>
        </header>

        {/* 기본 정보 */}
        <section className="eligibility-section">
          <div className="eligibility-section-heading">
            <span>01</span>
            <div>
              <h2>기본 정보</h2>
              <p>연령과 소득에 따른 지원 조건을 확인합니다.</p>
            </div>
          </div>

          <div className="eligibility-field">
            <label htmlFor="age">만 나이</label>
            <div className="eligibility-input-wrap">
              <input
                id="age"
                type="number"
                min="18"
                max="100"
                placeholder="만 나이를 입력해 주세요"
                value={formData.age}
                onChange={(event) =>
                  handleChange('age', event.target.value)
                }
              />
              <span>세</span>
            </div>
          </div>

          <div className="eligibility-field">
            <label htmlFor="incomeLevel">월평균 소득</label>
            <select
              id="incomeLevel"
              value={formData.incomeLevel}
              onChange={(event) =>
                handleChange('incomeLevel', event.target.value)
              }
            >
              <option value="">소득 구간을 선택해 주세요</option>
              <option value="under100">100만 원 미만</option>
              <option value="100to200">100만 원 이상 ~ 200만 원 미만</option>
              <option value="200to300">200만 원 이상 ~ 300만 원 미만</option>
              <option value="300to400">300만 원 이상 ~ 400만 원 미만</option>
              <option value="400to500">400만 원 이상 ~ 500만 원 미만</option>
              <option value="over500">500만 원 이상</option>
              <option value="unknown">정확히 모르겠어요</option>
            </select>
          </div>

          <div className="eligibility-field">
            <label htmlFor="householdType">가구 형태</label>
            <select
              id="householdType"
              value={formData.householdType}
              onChange={(event) =>
                handleChange('householdType', event.target.value)
              }
            >
              <option value="">가구 형태를 선택해 주세요</option>
              <option value="single">1인 가구</option>
              <option value="couple">부부 가구</option>
              <option value="withParents">부모님과 함께 거주</option>
              <option value="other">기타</option>
            </select>
          </div>
        </section>

        {/* 주거 정보 */}
        <section className="eligibility-section">
          <div className="eligibility-section-heading">
            <span>02</span>
            <div>
              <h2>주거 정보</h2>
              <p>주택 소유 여부와 현재 거주 상황을 확인합니다.</p>
            </div>
          </div>

          <div className="eligibility-field">
            <label>무주택 여부</label>
            <div className="eligibility-choice-grid">
              {[
                { value: 'yes', label: '무주택자' },
                { value: 'no', label: '주택 보유' },
                { value: 'unknown', label: '잘 모르겠어요' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={
                    formData.housingStatus === item.value
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    handleChange('housingStatus', item.value)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="eligibility-field">
            <label>현재 서울 거주 여부</label>
            <div className="eligibility-choice-grid">
              {[
                { value: 'yes', label: '서울 거주 중' },
                { value: 'no', label: '서울 외 거주' },
                { value: 'moving', label: '서울로 이사 예정' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={
                    formData.seoulResident === item.value
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    handleChange('seoulResident', item.value)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="eligibility-field">
            <label htmlFor="residenceType">현재 거주 형태</label>
            <select
              id="residenceType"
              value={formData.residenceType}
              onChange={(event) =>
                handleChange('residenceType', event.target.value)
              }
            >
              <option value="">거주 형태를 선택해 주세요</option>
              <option value="monthly">월세</option>
              <option value="jeonse">전세</option>
              <option value="owned">자가</option>
              <option value="family">가족과 함께 거주</option>
              <option value="dormitory">기숙사 및 기타</option>
            </select>
          </div>
        </section>

        {/* 복지 수혜 정보 */}
        <section className="eligibility-section">
          <div className="eligibility-section-heading">
            <span>03</span>
            <div>
              <h2>복지 수혜 정보</h2>
              <p>중복 지원이나 참여 제한 여부를 확인합니다.</p>
            </div>
          </div>

          <div className="eligibility-field">
            <label>현재 주거 관련 지원을 받고 있나요?</label>
            <div className="eligibility-choice-grid">
              {[
                { value: 'yes', label: '받고 있어요' },
                { value: 'no', label: '받고 있지 않아요' },
                { value: 'unknown', label: '잘 모르겠어요' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={
                    formData.housingBenefit === item.value
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    handleChange('housingBenefit', item.value)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="eligibility-field">
            <label>과거 주거 지원사업에 참여한 적이 있나요?</label>
            <div className="eligibility-choice-grid">
              {[
                { value: 'yes', label: '참여한 적 있어요' },
                { value: 'no', label: '참여한 적 없어요' },
                { value: 'unknown', label: '잘 모르겠어요' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={
                    formData.previousSupport === item.value
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    handleChange('previousSupport', item.value)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 안내 */}
        <div className="eligibility-notice">
          <strong>개인정보 및 자격 확인 안내</strong>
          <p>
            입력한 정보는 지원사업의 기본 자격 조건을 비교하는 데
            활용됩니다. 실제 신청 가능 여부는 세대 구성, 소득 산정
            방식, 거주 기간 등 사업별 추가 조건에 따라 달라질 수 있습니다.
          </p>
        </div>

        {error && (
          <p className="eligibility-error" role="alert">
            {error}
          </p>
        )}

        {/* 버튼 */}
        <div className="eligibility-actions">
          <button
            type="button"
            className="eligibility-back-button"
            onClick={() => navigate('/housing')}
          >
            이전 단계
          </button>

          <button
            type="button"
            className="eligibility-next-button"
            onClick={handleSubmit}
          >
            지원사업 확인하기
            <span>→</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default EligibilityInput;
