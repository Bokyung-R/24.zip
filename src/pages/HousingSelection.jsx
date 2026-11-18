
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useUser } from '../context/UserContext';
import regions from '../data/regions.json';
import StepProgress from '../components/common/StepProgress';

import './HousingSelection.css';

const HOUSING_TYPES = [
  { value: '원룸', description: '1인 생활에 적합한 공간' },
  { value: '오피스텔', description: '주거와 편의시설을 함께' },
  { value: '빌라', description: '다세대·연립주택' },
  { value: '아파트', description: '공동주택 및 아파트' },
  { value: '미정', description: '아직 정하지 않았어요' },
];

const CONTRACT_TYPES = [
  { value: '전세', description: '보증금 중심' },
  { value: '월세', description: '보증금과 월 임대료' },
  { value: '미정', description: '아직 정하지 않았어요' },
];

const INCOME_OPTIONS = [
  { value: 'under100', label: '월 100만 원 미만' },
  { value: '100to200', label: '월 100~200만 원' },
  { value: '200to300', label: '월 200~300만 원' },
  { value: '300to400', label: '월 300~400만 원' },
  { value: '400to500', label: '월 400~500만 원' },
  { value: 'over500', label: '월 500만 원 이상' },
  { value: 'unknown', label: '정확히 모르겠어요' },
];

const HOUSEHOLD_OPTIONS = [
  { value: 'single', label: '1인 가구' },
  { value: 'couple', label: '부부 가구' },
  { value: 'withParents', label: '부모님과 함께 거주' },
  { value: 'other', label: '기타' },
];

const RESIDENCE_OPTIONS = [
  { value: 'monthly', label: '월세 거주' },
  { value: 'jeonse', label: '전세 거주' },
  { value: 'family', label: '가족과 함께 거주' },
  { value: 'unknown', label: '확인 필요' },
];

const YES_NO_OPTIONS = [
  { value: 'yes', label: '예' },
  { value: 'no', label: '아니요' },
  { value: 'unknown', label: '확인 필요' },
];

function HousingSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const { userData, updateUserData } = useUser();

  // 선택한 관심 지역 복원
  const [selectedIds, setSelectedIds] = useState(() => {
    const stateIds = location.state?.selectedRegions;
    const savedIds = userData.selectedRegions || [];

    const initialIds = stateIds ?? savedIds;

    return [...new Set(
      initialIds.filter((id) =>
        regions.some((region) => region.id === id)
      )
    )].slice(0, 3);
  });

  // 주거 조건
  const [formData, setFormData] = useState(() => ({
    housingType: userData.housingInfo?.housingType ?? '',
    contractType: userData.housingInfo?.contractType ?? '',
    deposit: userData.housingInfo?.deposit ?? '',
    monthlyRent: userData.housingInfo?.monthlyRent ?? '',
    maintenanceFee: userData.housingInfo?.maintenanceFee ?? '',
    housingNotDecided:
      userData.housingInfo?.housingNotDecided ?? false,
  }));

  // 복지 자격 판정 정보
  const [eligibilityData, setEligibilityData] = useState(() => ({
    age: userData.eligibilityInfo?.age ?? '',
    incomeLevel: userData.eligibilityInfo?.incomeLevel ?? '',
    housingStatus: userData.eligibilityInfo?.housingStatus ?? '',
    seoulResident: userData.eligibilityInfo?.seoulResident ?? '',
    householdType: userData.eligibilityInfo?.householdType ?? '',
    residenceType: userData.eligibilityInfo?.residenceType ?? '',
    housingBenefit: userData.eligibilityInfo?.housingBenefit ?? '',
  }));

  const [error, setError] = useState('');

  const selectedRegions = regions.filter((region) =>
    selectedIds.includes(region.id)
  );

  const availableRegions = regions.filter(
    (region) => !selectedIds.includes(region.id)
  );

  // 관심 지역 선택 및 해제
  const handleRegionToggle = (regionId) => {
    setError('');

    if (selectedIds.includes(regionId)) {
      setSelectedIds((prev) =>
        prev.filter((id) => id !== regionId)
      );
      return;
    }

    if (selectedIds.length >= 3) {
      setError('관심 지역은 최대 3개까지 선택할 수 있습니다.');
      return;
    }

    setSelectedIds((prev) => [...prev, regionId]);
  };

  // 주거 정보 변경
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 복지 자격 정보 변경
  const handleEligibilityChange = (name, value) => {
    setEligibilityData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  // 아직 집을 정하지 않은 경우
  const handleHousingNotDecided = (checked) => {
    setFormData((prev) => ({
      ...prev,
      housingNotDecided: checked,
      housingType: checked ? '미정' : '',
      contractType: checked ? '미정' : '',
      deposit: checked ? '' : prev.deposit,
      monthlyRent: checked ? '' : prev.monthlyRent,
      maintenanceFee: checked ? '' : prev.maintenanceFee,
    }));
  };

  // 다음 단계
  const handleNext = () => {
    if (selectedIds.length === 0) {
      setError('관심 지역을 최소 1개 선택해 주세요.');
      return;
    }

    if (!formData.housingNotDecided) {
      if (!formData.housingType || !formData.contractType) {
        setError('희망 주거 형태와 계약 유형을 선택해 주세요.');
        return;
      }
    }

    if (
      eligibilityData.age === '' ||
      Number(eligibilityData.age) <= 0 ||
      Number(eligibilityData.age) > 120
    ) {
      setError('올바른 나이를 입력해 주세요.');
      return;
    }

    const requiredFields = [
      ['incomeLevel', '소득 구간을 선택해 주세요.'],
      ['housingStatus', '무주택 여부를 선택해 주세요.'],
      ['seoulResident', '서울 거주 여부를 선택해 주세요.'],
      ['householdType', '가구 형태를 선택해 주세요.'],
      ['residenceType', '현재 거주 형태를 선택해 주세요.'],
      ['housingBenefit', '현재 주거 지원 수혜 여부를 선택해 주세요.'],
    ];

    for (const [field, message] of requiredFields) {
      if (!eligibilityData[field]) {
        setError(message);
        return;
      }
    }

    const housingInfo = {
      ...formData,
      deposit: Number(formData.deposit) || 0,
      monthlyRent: Number(formData.monthlyRent) || 0,
      maintenanceFee: Number(formData.maintenanceFee) || 0,
    };

    const eligibilityInfo = {
      ...eligibilityData,
      age: Number(eligibilityData.age),
    };

    // Context 및 LocalStorage 저장
    updateUserData({
      selectedRegions: selectedIds,
      welfareRegions: selectedIds,
      housingInfo,
      eligibilityInfo,
    });

    // 매칭 결과 화면으로 이동
    navigate('/matching', {
      state: {
        selectedRegions: selectedIds,
        housingInfo,
        eligibilityInfo,
      },
    });
  };

  return (
    <main className="housing-page">
      <div className="housing-container">

        {/* 화면 제목 */}
        <header className="housing-heading">
          <span className="housing-eyebrow">MY HOME & BENEFIT</span>

          <h1>나에게 맞는 주거 지원을 확인해 볼까요?</h1>

          <p>
            관심 지역과 주거 조건, 기본 정보를 입력해 주세요.
            <br />
            입력한 정보를 바탕으로 지원사업별 자격 조건을 확인합니다.
          </p>
        </header>

        {/* 진행 단계 */}
        <StepProgress currentStep={4} />

        {/* 01 관심 지역 */}
        <section className="housing-section">
          <div className="housing-section-heading">
            <div>
              <span className="housing-section-number">01</span>
              <h2>관심 지역</h2>
              <p>지원사업을 확인할 지역을 선택해 주세요.</p>
            </div>

            <span className="housing-count">
              {selectedIds.length}/3
            </span>
          </div>

          <div className="housing-region-list">
            {selectedRegions.map((region) => (
              <button
                type="button"
                key={region.id}
                className="housing-region-chip selected"
                onClick={() => handleRegionToggle(region.id)}
              >
                <span>{region.name}</span>
                <span className="chip-remove">×</span>
              </button>
            ))}

            {availableRegions.map((region) => (
              <button
                type="button"
                key={region.id}
                className="housing-region-chip"
                onClick={() => handleRegionToggle(region.id)}
              >
                <span>+ {region.name}</span>
              </button>
            ))}
          </div>

          <p className="housing-help">
            선택한 지역을 다시 누르면 선택이 해제됩니다.
            최대 3개까지 선택할 수 있습니다.
          </p>
        </section>

        {/* 02 희망 주거 형태 */}
        <section className="housing-section">
          <div className="housing-section-heading">
            <div>
              <span className="housing-section-number">02</span>
              <h2>희망 주거 형태</h2>
              <p>앞으로 거주하고 싶은 집의 형태를 선택해 주세요.</p>
            </div>
          </div>

          <label className="housing-checkbox-label">
            <input
              type="checkbox"
              checked={formData.housingNotDecided}
              onChange={(event) =>
                handleHousingNotDecided(event.target.checked)
              }
            />

            <span className="custom-checkbox" />

            <span>
              <strong>아직 구체적인 집을 정하지 않았어요.</strong>
              <small>
                주거 형태와 계약 유형을 나중에 결정할 수 있습니다.
              </small>
            </span>
          </label>

          <div className={`housing-option-area ${
            formData.housingNotDecided ? 'section-disabled' : ''
          }`}>
            <div className="housing-option-grid">
              {HOUSING_TYPES.map((type) => (
                <button
                  type="button"
                  key={type.value}
                  disabled={formData.housingNotDecided}
                  className={`housing-option-card ${
                    formData.housingType === type.value ? 'active' : ''
                  }`}
                  onClick={() => handleChange('housingType', type.value)}
                >
                  <strong>{type.value}</strong>
                  <span>{type.description}</span>
                </button>
              ))}
            </div>

            <div className="housing-subsection">
              <h3>계약 유형</h3>

              <div className="housing-contract-grid">
                {CONTRACT_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type.value}
                    disabled={formData.housingNotDecided}
                    className={`housing-contract-card ${
                      formData.contractType === type.value ? 'active' : ''
                    }`}
                    onClick={() => handleChange('contractType', type.value)}
                  >
                    <strong>{type.value}</strong>
                    <span>{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="housing-budget-grid">
              <label className="housing-field">
                <span>보증금</span>

                <div className="housing-input-wrap">
                  <input
                    type="number"
                    min="0"
                    placeholder="예: 1000"
                    value={formData.deposit}
                    disabled={formData.housingNotDecided}
                    onChange={(event) =>
                      handleChange('deposit', event.target.value)
                    }
                  />
                  <span>만원</span>
                </div>
              </label>

              <label className="housing-field">
                <span>월세</span>

                <div className="housing-input-wrap">
                  <input
                    type="number"
                    min="0"
                    placeholder="예: 50"
                    value={formData.monthlyRent}
                    disabled={formData.housingNotDecided}
                    onChange={(event) =>
                      handleChange('monthlyRent', event.target.value)
                    }
                  />
                  <span>만원</span>
                </div>
              </label>

              <label className="housing-field">
                <span>관리비</span>

                <div className="housing-input-wrap">
                  <input
                    type="number"
                    min="0"
                    placeholder="예: 10"
                    value={formData.maintenanceFee}
                    disabled={formData.housingNotDecided}
                    onChange={(event) =>
                      handleChange('maintenanceFee', event.target.value)
                    }
                  />
                  <span>만원</span>
                </div>
              </label>
            </div>
          </div>

          <p className="housing-help">
            정확한 금액을 모르는 경우 예상 금액을 입력하거나 비워 두셔도 됩니다.
          </p>
        </section>

        {/* 03 기본 정보 */}
        <section className="housing-section">
          <div className="housing-section-heading">
            <div>
              <span className="housing-section-number">03</span>
              <h2>기본 정보</h2>
              <p>지원사업의 연령 및 소득 조건을 확인하기 위한 정보입니다.</p>
            </div>
          </div>

          <div className="housing-budget-grid">
            <label className="housing-field">
              <span>나이</span>

              <div className="housing-input-wrap">
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="예: 27"
                  value={eligibilityData.age}
                  onChange={(event) =>
                    handleEligibilityChange('age', event.target.value)
                  }
                />
                <span>세</span>
              </div>
            </label>

            <label className="housing-field">
              <span>월평균 소득 구간</span>

              <select
                value={eligibilityData.incomeLevel}
                onChange={(event) =>
                  handleEligibilityChange('incomeLevel', event.target.value)
                }
              >
                <option value="">소득 구간 선택</option>

                {INCOME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* 04 가구 및 주거 자격 정보 */}
        <section className="housing-section">
          <div className="housing-section-heading">
            <div>
              <span className="housing-section-number">04</span>
              <h2>가구 및 주거 정보</h2>
              <p>지원사업별 세부 자격 조건을 확인합니다.</p>
            </div>
          </div>

          <div className="housing-eligibility-grid">

            <label className="housing-field">
              <span>가구 형태</span>

              <select
                value={eligibilityData.householdType}
                onChange={(event) =>
                  handleEligibilityChange('householdType', event.target.value)
                }
              >
                <option value="">가구 형태 선택</option>

                {HOUSEHOLD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="housing-field">
              <span>현재 거주 형태</span>

              <select
                value={eligibilityData.residenceType}
                onChange={(event) =>
                  handleEligibilityChange('residenceType', event.target.value)
                }
              >
                <option value="">현재 거주 형태 선택</option>

                {RESIDENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="housing-field">
              <span>무주택 여부</span>

              <div className="housing-choice-grid">
                {YES_NO_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={`housing-choice-button ${
                      eligibilityData.housingStatus === option.value
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      handleEligibilityChange('housingStatus', option.value)
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="housing-field">
              <span>서울 거주 여부</span>

              <div className="housing-choice-grid">
                <button
                  type="button"
                  className={`housing-choice-button ${
                    eligibilityData.seoulResident === 'yes' ? 'active' : ''
                  }`}
                  onClick={() =>
                    handleEligibilityChange('seoulResident', 'yes')
                  }
                >
                  서울 거주 중
                </button>

                <button
                  type="button"
                  className={`housing-choice-button ${
                    eligibilityData.seoulResident === 'no' ? 'active' : ''
                  }`}
                  onClick={() =>
                    handleEligibilityChange('seoulResident', 'no')
                  }
                >
                  서울 외 거주
                </button>

                <button
                  type="button"
                  className={`housing-choice-button ${
                    eligibilityData.seoulResident === 'moving' ? 'active' : ''
                  }`}
                  onClick={() =>
                    handleEligibilityChange('seoulResident', 'moving')
                  }
                >
                  서울 전입 예정
                </button>
              </div>
            </div>

            <div className="housing-field">
              <span>현재 주거 지원 수혜 여부</span>

              <div className="housing-choice-grid">
                {YES_NO_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={`housing-choice-button ${
                      eligibilityData.housingBenefit === option.value
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      handleEligibilityChange('housingBenefit', option.value)
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 안내 */}
        <div className="housing-notice">
          <strong>참고해 주세요</strong>
          <p>
            입력한 정보는 등록된 테스트 정책의 기본 자격 조건과 비교하는 데
            활용됩니다. 실제 지원 자격은 소득 산정 방식, 세대 구성,
            임대차 계약 및 사업별 추가 조건에 따라 달라질 수 있습니다.
          </p>
        </div>

        {/* 오류 */}
        {error && (
          <p className="housing-error" role="alert">
            {error}
          </p>
        )}

        {/* 하단 버튼 */}
        <div className="housing-actions">
          <button
            type="button"
            className="housing-back-button"
            onClick={() => navigate('/regions')}
          >
            이전 단계
          </button>

          <button
            type="button"
            className="housing-next-button"
            onClick={handleNext}
          >
            지원사업 매칭하기
            <span>→</span>
          </button>
        </div>

      </div>
    </main>
  );
}

export default HousingSelection;
