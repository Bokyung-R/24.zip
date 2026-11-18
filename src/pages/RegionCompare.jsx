
import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import regions from '../data/regions.json';
import RegionMap from '../components/region/RegionMap';
import StepProgress from '../components/common/StepProgress';

import './RegionCompare.css';

const scoreLabels = [
  { key: 'housingCost', label: '주거비' },
  { key: 'transport', label: '교통' },
  { key: 'convenience', label: '생활 편의' },
  { key: 'safety', label: '안전' },
  { key: 'environment', label: '환경' }
];

// 존재하는 지역 ID만 사용
const validRegionIds = regions.map((region) => region.id);

// 금액 표시
const formatBudget = (value) => {
  if (value === '' || value === null || value === undefined) {
    return '정보 없음';
  }

  return `${Number(value).toLocaleString('ko-KR')}만 원`;
};

function RegionCompare() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, updateUserData } = useUser();

  // 추천 화면에서 전달받은 지역 ID
  const recommendedIds = useMemo(() => {
    const ids = location.state?.recommendedRegions || [];

    return ids.filter((id) => validRegionIds.includes(id));
  }, [location.state]);

  // 처음 선택할 지역 설정
  const [selectedIds, setSelectedIds] = useState(() => {
    const savedIds = (userData.selectedRegions || [])
      .filter((id) => validRegionIds.includes(id));

    const initialIds = recommendedIds.length > 0
      ? recommendedIds
      : savedIds;

    return [...new Set(initialIds)].slice(0, 3);
  });

  // 상세 정보를 표시할 지역
  const [activeRegionId, setActiveRegionId] = useState(
    () => recommendedIds[0] || selectedIds[0] || null
  );

  const [error, setError] = useState('');

  // 선택된 지역 객체
  const selectedRegions = useMemo(
    () => regions.filter((region) => selectedIds.includes(region.id)),
    [selectedIds]
  );

  // 현재 상세 정보 지역
  const activeRegion = regions.find(
    (region) => region.id === activeRegionId
  );

  // 지역 선택 및 해제
  const handleSelectRegion = useCallback((regionId) => {
    if (!validRegionIds.includes(regionId)) {
      return;
    }

    if (selectedIds.includes(regionId)) {
      const next = selectedIds.filter((id) => id !== regionId);

      setSelectedIds(next);

      // 현재 상세 정보 지역을 해제했다면 다른 선택 지역으로 변경
      if (activeRegionId === regionId) {
        setActiveRegionId(next[0] || null);
      }

      setError('');
      return;
    }

    // 최대 3개 선택 제한
    if (selectedIds.length >= 3) {
      setError('지역은 최대 3개까지 선택할 수 있습니다.');
      return;
    }

    const next = [...selectedIds, regionId];

    setSelectedIds(next);
    setActiveRegionId(regionId);
    setError('');
  }, [selectedIds, activeRegionId]);

  // 추천 순위 표시
  const getRank = (regionId) => {
    const index = recommendedIds.indexOf(regionId);

    return index >= 0 ? index + 1 : null;
  };

  // 다음 화면으로 이동
  const handleContinue = () => {
    if (selectedRegions.length === 0) {
      setError('관심 지역을 하나 이상 선택해 주세요.');
      return;
    }

    updateUserData({
      selectedRegions: selectedRegions.map((region) => region.id),
      welfareRegions: selectedRegions.map((region) => region.id)
    });

    navigate('/support-info', {
      state: {
        selectedRegions: selectedRegions.map((region) => region.id)
      }
    });
  };

  return (
    <main className="region-compare-page">
      <div className="region-compare-container">

        {/* 페이지 제목 */}
        <section className="region-compare-heading">
          <span className="region-eyebrow">
            EXPLORE SEOUL
          </span>

          <h1>
            마음에 드는 지역을
            <br />
            <span>직접 비교해 보세요.</span>
          </h1>

          <p>
            추천 지역을 확인하고 관심 있는 동네를 선택해 보세요.
            <br className="desktop-break" />
            최대 3개 지역까지 비교할 수 있습니다.
          </p>
        </section>

        {/* 진행 단계 */}
        <StepProgress currentStep={3} />

        {/* 지도 영역 */}
        <section className="region-map-section">
          <div className="section-title-row">
            <div>
              <span>SEOUL MAP</span>
              <h2>서울 지역 탐색</h2>
            </div>

            <div className="selection-counter">
              <strong>{selectedIds.length}</strong>
              <span> / 3개 선택</span>
            </div>
          </div>

          {/* 지도 범례 */}
          <div className="map-legend">
            <span>
              <i className="legend-dot recommended" />
              추천 지역
            </span>

            <span>
              <i className="legend-dot selected" />
              선택한 지역
            </span>

            <span>
              <i className="legend-dot normal" />
              일반 지역
            </span>
          </div>

          <div className="region-map-wrapper">
            <RegionMap
              regions={regions}
              selectedIds={selectedIds}
              onSelect={handleSelectRegion}
            />
          </div>

          <p className="map-guide">
            지도에서 마커를 선택하거나 아래 지역 목록을 눌러보세요.
          </p>
        </section>

        {/* 자치구 목록 */}
        <section className="district-section">
          <div className="section-title-row">
            <div>
              <span>REGION LIST</span>
              <h2>관심 지역 선택</h2>
              <p>비교하고 싶은 지역을 선택해 주세요.</p>
            </div>
          </div>

          <div className="district-grid">
            {regions.map((region) => {
              const selected = selectedIds.includes(region.id);
              const rank = getRank(region.id);

              return (
                <button
                  key={region.id}
                  type="button"
                  className={`district-card ${selected ? 'selected' : ''}`}
                  onClick={() => handleSelectRegion(region.id)}
                  aria-pressed={selected}
                >
                  <div className="district-card-top">
                    <span className="district-check">
                      {selected ? '✓' : '+'}
                    </span>

                    {rank && (
                      <span className="district-rank">
                        추천 {rank}위
                      </span>
                    )}
                  </div>

                  <strong>{region.name}</strong>
                  <span>{region.subtitle}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 선택 지역 상세 정보 */}
        {activeRegion && (
          <section className="active-region-section">
            <div className="section-title-row">
              <div>
                <span>REGION DETAIL</span>
                <h2>{activeRegion.name} 정보</h2>
              </div>
            </div>

            <p className="active-region-description">
              {activeRegion.description}
            </p>

            <div className="active-region-tags">
              {(activeRegion.tags || []).map((tag) => (
                <span key={tag}># {tag}</span>
              ))}
            </div>

            <div className="active-region-cost">
              <div>
                <span>예시 보증금</span>
                <strong>
                  {formatBudget(activeRegion.sampleDeposit)}
                </strong>
              </div>

              <div>
                <span>예시 월세</span>
                <strong>
                  {activeRegion.sampleRent !== undefined &&
                  activeRegion.sampleRent !== null
                    ? `${activeRegion.sampleRent}만 원`
                    : '정보 없음'}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="active-select-button"
              onClick={() => handleSelectRegion(activeRegion.id)}
            >
              {selectedIds.includes(activeRegion.id)
                ? '선택 해제하기'
                : '관심 지역으로 선택하기'}
            </button>
          </section>
        )}

        {/* 지역별 비교 */}
        <section className="comparison-section">
          <div className="section-title-row">
            <div>
              <span>REGION COMPARISON</span>
              <h2>지역별 조건 비교</h2>
              <p>선택한 지역의 평가 점수를 비교합니다.</p>
            </div>
          </div>

          {selectedRegions.length === 0 ? (
            <div className="empty-comparison">
              비교할 지역을 선택해 주세요.
            </div>
          ) : (
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>평가 항목</th>

                    {selectedRegions.map((region) => (
                      <th key={region.id}>
                        {region.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {scoreLabels.map((item) => (
                    <tr key={item.key}>
                      <td>{item.label}</td>

                      {selectedRegions.map((region) => (
                        <td key={region.id}>
                          <strong>
                            {region.scores?.[item.key] ?? '-'}
                          </strong>

                          {region.scores?.[item.key] !== undefined && (
                            <span>점</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr className="cost-row">
                    <td>예시 보증금</td>

                    {selectedRegions.map((region) => (
                      <td key={region.id}>
                        {formatBudget(region.sampleDeposit)}
                      </td>
                    ))}
                  </tr>

                  <tr className="cost-row">
                    <td>예시 월세</td>

                    {selectedRegions.map((region) => (
                      <td key={region.id}>
                        {region.sampleRent !== undefined &&
                        region.sampleRent !== null
                          ? `${region.sampleRent}만 원`
                          : '정보 없음'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 데이터 안내 */}
        <div className="region-data-notice">
          <strong>ⓘ 데이터 안내</strong>
          <p>
            현재 지역별 점수와 예시 주거비는 서비스 시연을 위한
            테스트 데이터입니다. 실제 통계나 매물 시세를 의미하지 않습니다.
            지역별 평가 점수는 기본 지표이며, 앞선 추천 화면의 예산 조정
            점수와는 다를 수 있습니다.
          </p>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <p className="region-error" role="alert">
            {error}
          </p>
        )}

        {/* 하단 버튼 */}
        <div className="region-actions">
          <button
            type="button"
            className="region-back-button"
            onClick={() => navigate('/recommendation')}
          >
            추천 결과로 돌아가기
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleContinue}
          >
            선택 지역으로 진행하기 →
          </button>
        </div>

      </div>
    </main>
  );
}

export default RegionCompare;
