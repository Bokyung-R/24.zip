
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useUser } from '../context/UserContext';
import regions from '../data/regions.json';

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

function HousingSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, updateUserData } = useUser();

  // SCREEN 04에서 전달한 지역을 우선 사용합니다.
  const [selectedIds, setSelectedIds] = useState(() => {
    return (
      location.state?.selectedRegions ??
      userData.selectedRegions ??
      []
    );
  });

  // 이전에 입력한 주거 조건이 있다면 복원합니다.
  const [formData, setFormData] = useState(() => ({
    housingType: userData.housingInfo?.housingType ?? '',
    contractType: userData.housingInfo?.contractType ?? '',
    deposit: userData.housingInfo?.deposit ?? '',
    monthlyRent: userData.housingInfo?.monthlyRent ?? '',
    maintenanceFee: userData.housingInfo?.maintenanceFee ?? '',
    housingNotDecided:
      userData.housingInfo?.housingNotDecided ?? false,
  }));

  const [error, setError] = useState('');

  const selectedRegions = regions.filter((region) =>
    selectedIds.includes(region.id)
  );

  const availableRegions = regions.filter(
    (region) => !selectedIds.includes(region.id)
  );

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

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleNext = () => {
    if (selectedIds.length === 0) {
      setError('관심 지역을 최소 1개 선택해 주세요.');
      return;
    }

    if (!formData.housingNotDecided) {
      if (!formData.housingType || !formData.contractType) {
        setError('주거 형태와 계약 유형을 선택해 주세요.');
        return;
      }
    }

    const housingInfo = {
      ...formData,
      deposit: Number(formData.deposit) || 0,
      monthlyRent: Number(formData.monthlyRent) || 0,
      maintenanceFee: Number(formData.maintenanceFee) || 0,
    };

    // Context 및 LocalStorage에 저장합니다.
    updateUserData({
      selectedRegions: selectedIds,
      housingInfo,
    });

    navigate('/eligibility', {
      state: {
        selectedRegions: selectedIds,
        housingInfo,
      },
    });
  };

  return (
    <main className="housing-page">
      <div className="housing-container">
        {/* 진행 단계 */}
        <div className="housing-progress">
          <div className="housing-progress-info">
            <span>STEP 05</span>
            <span>8단계 중 5단계</span>
          </div>

          <div className="housing-progress-track">
            <div className="housing-progress-value" />
          </div>
        </div>

        {/* 화면 제목 */}
        <header className="housing-heading">
          <span className="housing-eyebrow">MY HOME</span>
          <h1>어떤 집을 찾고 계신가요?</h1>
          <p>
            관심 있는 지역과 주거 조건을 선택해 주세요.
            <br />
            아직 집을 정하지 않았어도 괜찮습니다.
          </p>
        </header>

        {/* 관심 지역 */}
        <section className="housing-section">
          <div className="housing-section-heading">
            <div>
              <span className="housing-section-number">01</span>
              <h2>관심 지역</h2>
              <p>추천받은 지역 중 관심 있는 곳을 선택해 주세요.</p>
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
          </p>
        </section>

        {/* 주택 미정 여부 */}
        <section className="housing-section housing-undecided">
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
                선택한 지역을 기준으로 주거 지원사업을 찾아볼게요.
              </small>
            </span>
          </label>
        </section>

        {/* 주거 조건 */}
        <section
          className={`housing-section ${
            formData.housingNotDecided ? 'section-disabled' : ''
          }`}
        >
          <div className="housing-section-heading">
            <div>
              <span className="housing-section-number">02</span>
              <h2>희망 주거 형태</h2>
              <p>원하는 주거 형태를 선택해 주세요.</p>
            </div>
          </div>

          <div className="housing-option-grid">
            {HOUSING_TYPES.map((type) => (
              <button
                type="button"
                key={type.value}
                disabled={formData.housingNotDecided}
                className={`housing-option-card ${
                  formData.housingType === type.value
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleChange('housingType', type.value)
                }
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
                    formData.contractType === type.value
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handleChange('contractType', type.value)
                  }
                >
                  <strong>{type.value}</strong>
                  <span>{type.description}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 예산 입력 */}
        <section
          className={`housing-section ${
            formData.housingNotDecided ? 'section-disabled' : ''
          }`}
        >
          <div className="housing-section-heading">
            <div>
              <span className="housing-section-number">03</span>
              <h2>주거 예산</h2>
              <p>예상하는 주거 비용을 입력해 주세요.</p>
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
                    handleChange(
                      'maintenanceFee',
                      event.target.value
                    )
                  }
                />
                <span>만원</span>
              </div>
            </label>
          </div>

          <p className="housing-help">
            정확한 금액을 모르는 경우 예상 금액을 입력하거나
            비워 두셔도 됩니다.
          </p>
        </section>

        {/* 안내 및 오류 */}
        <div className="housing-notice">
          <strong>참고해 주세요</strong>
          <p>
            입력한 주거 조건은 맞춤형 지원사업을 탐색하는 데
            활용됩니다. 실제 지원 자격은 각 사업의 공식 공고를
            기준으로 별도로 확인합니다.
          </p>
        </div>

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
            다음 단계
            <span>→</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default HousingSelection;
