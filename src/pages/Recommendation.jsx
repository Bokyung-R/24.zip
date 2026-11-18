
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  getRecommendedRegions,
  getRecommendationReasons
} from '../services/recommendationService';

import './Recommendation.css';

const priorityLabels = {
  housingCost: '저렴한 주거비',
  transport: '교통 편의성',
  convenience: '생활 편의시설',
  safety: '안전한 환경',
  environment: '쾌적한 환경'
};

const scoreLabels = {
  housingCost: '주거비',
  transport: '교통',
  convenience: '생활 편의',
  environment: '안전·환경'
};

function Recommendation() {
  const navigate = useNavigate();
  const { userData } = useUser();

  const recommendations = useMemo(
    () => getRecommendedRegions(userData),
    [userData]
  );

  const formatBudget = (value) => {
    if (!value) return '미입력';

    return `${Number(value).toLocaleString('ko-KR')}만 원`;
  };

  const handleCompare = () => {
    navigate('/regions', {
      state: {
        recommendedRegions: recommendations.map((region) => region.id)
      }
    });
  };

  return (
    <main className="recommendation-page">
      <div className="recommendation-container">

        {/* 페이지 제목 */}
        <section className="recommendation-heading">
          <span className="recommendation-eyebrow">
            AI HOUSING RECOMMENDATION
          </span>

          <h1>
            나에게 맞는
            <br />
            <span>서울의 동네를 찾았어요!</span>
          </h1>

          <p>
            입력하신 주거 조건과 생활 우선순위를 바탕으로
            <br className="desktop-break" />
            추천 지역을 정리했습니다.
          </p>
        </section>

        {/* 사용자 조건 요약 */}
        <section className="my-condition-card">
          <div className="condition-summary-heading">
            <div>
              <span>MY CONDITIONS</span>
              <h2>나의 주거 조건</h2>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => navigate('/condition')}
            >
              조건 수정하기 →
            </button>
          </div>

          <div className="condition-summary-grid">
            <div className="summary-item">
              <span>보증금 예산</span>
              <strong>{formatBudget(userData.budget)}</strong>
            </div>

            <div className="summary-item">
              <span>월세 예산</span>
              <strong>{formatBudget(userData.monthlyRentBudget)}</strong>
            </div>

            <div className="summary-item">
              <span>주요 목적지</span>
              <strong>{userData.destination || '미입력'}</strong>
            </div>

            <div className="summary-item">
              <span>이동 가능 시간</span>
              <strong>{userData.commuteTime}분 이내</strong>
            </div>
          </div>

          <div className="priority-summary">
            <span>생활 우선순위</span>

            <div className="priority-tags">
              {userData.priorities?.length > 0 ? (
                userData.priorities.map((priority) => (
                  <span key={priority}>
                    {priorityLabels[priority] || priority}
                  </span>
                ))
              ) : (
                <span>선택한 우선순위가 없습니다.</span>
              )}
            </div>
          </div>
        </section>

        {/* 추천 결과 */}
        <section className="recommended-section">
          <div className="recommended-heading">
            <div>
              <span>RECOMMENDED TOP 3</span>
              <h2>추천 지역 TOP 3</h2>
              <p>나의 조건에 맞는 지역을 점수순으로 정렬했습니다.</p>
            </div>

            <div className="result-count">
              총 {recommendations.length}개 지역
            </div>
          </div>

          <div className="recommendation-list">
            {recommendations.map((region, index) => {
              const reasons = getRecommendationReasons(region);

              return (
                <article
                  className={`recommendation-card ${index === 0 ? 'best-card' : ''}`}
                  key={region.id}
                >
                  <div className="recommendation-card-top">
                    <div className="region-rank">
                      <span>RANK</span>
                      <strong>0{index + 1}</strong>
                    </div>

                    {index === 0 && (
                      <span className="best-badge">
                        BEST MATCH
                      </span>
                    )}
                  </div>

                  <div className="region-main-info">
                    <div>
                      <h3>{region.name}</h3>
                      <p>{region.subtitle}</p>
                    </div>

                    <div className="recommendation-score">
                      <strong>{region.recommendationScore}</strong>
                      <span>점</span>
                    </div>
                  </div>

                  <div className="region-tags">
                    {region.tags.map((tag) => (
                      <span key={tag}># {tag}</span>
                    ))}
                  </div>

                  <p className="region-description">
                    {region.description}
                  </p>

                  <div className="score-detail">
                    <div className="score-detail-heading">
                      <strong>평가 항목별 점수</strong>
                      <span>100점 기준</span>
                    </div>

                    {reasons.map((reason) => (
                      <div className="score-row" key={reason.key}>
                        <span>{scoreLabels[reason.key]}</span>

                        <div className="score-track">
                          <div
                            className="score-fill"
                            style={{ width: `${reason.score}%` }}
                          />
                        </div>

                        <strong>{reason.score}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="region-cost-info">
                    <div>
                      <span>예시 보증금</span>
                      <strong>
                        {region.sampleDeposit.toLocaleString('ko-KR')}만 원
                      </strong>
                    </div>

                    <div>
                      <span>예시 월세</span>
                      <strong>{region.sampleRent}만 원</strong>
                    </div>
                  </div>

                  <div className="welfare-preview">
                    <span>복지 혜택 미리보기</span>
                    <p>{region.welfarePreview}</p>
                  </div>

                  <button
                    type="button"
                    className="region-select-button"
                    onClick={handleCompare}
                  >
                    이 지역 비교하기 →
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* 데이터 안내 */}
        <div className="recommendation-notice">
          <span>ⓘ</span>
          <p>
            현재 지역별 점수와 예시 주거비는 서비스 시연을 위한
            테스트 데이터입니다. 실제 지역별 주거비 및 교통·생활 지표와는
            다를 수 있으며, 추후 공공데이터 연동을 통해 보완할 예정입니다.
          </p>
        </div>

        {/* 하단 액션 */}
        <div className="recommendation-actions">
          <button
            type="button"
            className="outline-button"
            onClick={() => navigate('/condition')}
          >
            조건 다시 입력하기
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleCompare}
          >
            지역 비교하기 <span>→</span>
          </button>
        </div>

      </div>
    </main>
  );
}

export default Recommendation;
