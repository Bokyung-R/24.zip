
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

import policies from '../data/policies.json';

import {
  evaluateAllPolicies,
  getStatusLabel,
  getIncomeLabel,
} from '../services/eligibilityService';

import PolicyCard from '../components/policy/PolicyCard';

import './MatchingResult.css';

function MatchingResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUser();

  const eligibilityInfo =
    location.state?.eligibilityInfo ??
    userData.eligibilityInfo ??
    {};

  const selectedRegions =
    location.state?.selectedRegions ??
    userData.selectedRegions ??
    [];

  const housingInfo =
    location.state?.housingInfo ??
    userData.housingInfo ??
    {};

  const results = useMemo(
    () => evaluateAllPolicies(policies, eligibilityInfo),
    [eligibilityInfo]
  );

  const eligibleCount = results.filter(
    (item) => item.status === 'eligible'
  ).length;

  const reviewCount = results.filter(
    (item) => item.status === 'review'
  ).length;

  const ineligibleCount = results.filter(
    (item) => item.status === 'ineligible'
  ).length;

  const selectedResult = location.state?.selectedResult;

  const handleBack = () => {
    navigate('/eligibility');
  };

  const handleRestart = () => {
    navigate('/condition');
  };

  return (
    <main className="matching-page">
      <div className="matching-container">
        {/* 진행 단계 */}
        <div className="matching-progress">
          <div className="matching-progress-info">
            <span>STEP 07</span>
            <span>8단계 중 7단계</span>
          </div>

          <div className="matching-progress-track">
            <div className="matching-progress-value" />
          </div>
        </div>

        {/* 제목 */}
        <header className="matching-heading">
          <span className="matching-eyebrow">
            PERSONALIZED RESULT
          </span>

          <h1>나에게 맞는 주거 지원사업을 찾았어요!</h1>

          <p>
            입력한 조건을 바탕으로 지원사업별 기본 자격 조건을
            비교했습니다.
          </p>
        </header>

        {/* 사용자 조건 요약 */}
        <section className="matching-user-summary">
          <div className="matching-summary-heading">
            <div>
              <h2>입력한 나의 조건</h2>
              <p>매칭에 활용한 정보를 확인해 보세요.</p>
            </div>

            <button
              type="button"
              onClick={handleBack}
            >
              정보 수정
            </button>
          </div>

          <div className="matching-summary-grid">
            <div>
              <span>나이</span>
              <strong>
                {eligibilityInfo.age
                  ? `${eligibilityInfo.age}세`
                  : '미입력'}
              </strong>
            </div>

            <div>
              <span>월평균 소득</span>
              <strong>
                {getIncomeLabel(eligibilityInfo.incomeLevel)}
              </strong>
            </div>

            <div>
              <span>가구 형태</span>
              <strong>
                {eligibilityInfo.householdType === 'single'
                  ? '1인 가구'
                  : eligibilityInfo.householdType === 'couple'
                    ? '부부 가구'
                    : eligibilityInfo.householdType === 'withParents'
                      ? '부모님과 함께 거주'
                      : eligibilityInfo.householdType === 'other'
                        ? '기타'
                        : '미입력'}
              </strong>
            </div>

            <div>
              <span>무주택 여부</span>
              <strong>
                {eligibilityInfo.housingStatus === 'yes'
                  ? '무주택'
                  : eligibilityInfo.housingStatus === 'no'
                    ? '주택 보유'
                    : '확인 필요'}
              </strong>
            </div>
          </div>

          <div className="matching-summary-bottom">
            <span>관심 지역</span>
            <strong>
              {selectedRegions.length > 0
                ? `${selectedRegions.length}개 지역 선택`
                : '선택 지역 정보 없음'}
            </strong>
          </div>

          {housingInfo.housingType && (
            <div className="matching-summary-bottom">
              <span>희망 주거 형태</span>
              <strong>{housingInfo.housingType}</strong>
            </div>
          )}
        </section>

        {/* 결과 요약 */}
        <section className="matching-count-section">
          <div className="matching-count-heading">
            <h2>매칭 결과</h2>
            <span>총 {results.length}개 사업 확인</span>
          </div>

          <div className="matching-count-grid">
            <div className="matching-count-card eligible">
              <strong>{eligibleCount}</strong>
              <span>충족 가능</span>
            </div>

            <div className="matching-count-card review">
              <strong>{reviewCount}</strong>
              <span>추가 확인 필요</span>
            </div>

            <div className="matching-count-card ineligible">
              <strong>{ineligibleCount}</strong>
              <span>미충족</span>
            </div>
          </div>
        </section>

        {/* AI 설명 영역 */}
        <section className="matching-ai-summary">
          <div className="matching-ai-icon">AI</div>

          <div>
            <strong>나의 주거복지 매칭 요약</strong>
            <p>
              총 {results.length}개의 지원사업 중 충족 가능 항목은
              {eligibleCount}개, 추가 확인이 필요한 항목은
              {reviewCount}개입니다.
              {eligibleCount > 0
                ? ' 충족 가능 사업부터 상세 조건을 확인해 보세요.'
                : ' 입력 정보를 다시 확인하거나 관심 지역과 조건을 조정해 보세요.'}
            </p>
          </div>
        </section>

        {/* 정책 목록 */}
        <section className="matching-policy-section">
          <div className="matching-policy-heading">
            <div>
              <h2>지원사업별 매칭 결과</h2>
              <p>각 사업을 선택하면 세부 조건을 확인할 수 있습니다.</p>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="matching-policy-list">
              {results.map((result) => (
                <PolicyCard
                  key={result.policyId}
                  result={result}
                />
              ))}
            </div>
          ) : (
            <div className="matching-empty">
              <h3>확인할 지원사업이 없습니다.</h3>
              <p>정책 데이터가 등록되어 있는지 확인해 주세요.</p>
            </div>
          )}
        </section>

        {/* 판정 안내 */}
        <div className="matching-notice">
          <strong>결과 확인 시 주의사항</strong>
          <p>
            충족 가능은 입력한 정보와 등록된 기본 조건이 일치한다는
            의미이며, 실제 신청 자격을 확정하는 결과가 아닙니다.
            소득 산정 방식, 세대 구성, 주택 가격, 중복 수혜 제한 등
            추가 조건은 공식 공고에서 확인해야 합니다.
          </p>
          <p>
            현재 표시되는 정책은 화면 테스트용 예시 데이터입니다.
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="matching-actions">
          <button
            type="button"
            className="matching-back-button"
            onClick={handleBack}
          >
            정보 수정
          </button>

          <button
            type="button"
            className="matching-restart-button"
            onClick={handleRestart}
          >
            조건 다시 설정하기
          </button>
        </div>
      </div>
    </main>
  );
}

export default MatchingResult;
