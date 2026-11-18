
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useUser } from '../context/UserContext';
import policies from '../data/policies.json';

import {
  evaluatePolicy,
  getStatusLabel,
} from '../services/eligibilityService';

import EligibilityBadge from '../components/policy/EligibilityBadge';

import './PolicyDetail.css';

function PolicyDetail() {
  const navigate = useNavigate();
  const { policyId } = useParams();
  const { userData } = useUser();

  const [checkedDocuments, setCheckedDocuments] = useState([]);

  const policy = policies.find(
    (item) => item.id === policyId
  );

  const eligibilityInfo = userData.eligibilityInfo || {};

  if (!policy) {
    return (
      <main className="policy-detail-page">
        <div className="policy-detail-container">
          <h1>지원사업을 찾을 수 없습니다.</h1>
          <button
            type="button"
            onClick={() => navigate('/matching')}
          >
            매칭 결과로 돌아가기
          </button>
        </div>
      </main>
    );
  }

  const result = evaluatePolicy(policy, eligibilityInfo);

  const toggleDocument = (documentName) => {
    setCheckedDocuments((prev) =>
      prev.includes(documentName)
        ? prev.filter((item) => item !== documentName)
        : [...prev, documentName]
    );
  };

  const handleOfficialLink = () => {
    if (!policy.applicationUrl) {
      return;
    }

    window.open(
      policy.applicationUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleBack = () => {
    navigate('/matching');
  };

  const progress =
    policy.documents.length > 0
      ? (checkedDocuments.length / policy.documents.length) * 100
      : 0;

  return (
    <main className="policy-detail-page">
      <div className="policy-detail-container">
        {/* 진행 단계 */}
        <div className="policy-detail-progress">
          <div className="policy-detail-progress-info">
            <span>STEP 08</span>
            <span>8단계 중 마지막 단계</span>
          </div>

          <div className="policy-detail-progress-track">
            <div className="policy-detail-progress-value" />
          </div>
        </div>

        {/* 상단 */}
        <button
          type="button"
          className="policy-detail-back-link"
          onClick={handleBack}
        >
          ← 매칭 결과로 돌아가기
        </button>

        <header className="policy-detail-heading">
          <span className="policy-detail-category">
            {policy.category}
          </span>

          <div className="policy-detail-title-row">
            <h1>{policy.name}</h1>
            <EligibilityBadge status={result.status} />
          </div>

          <p>{policy.summary}</p>

          <div className="policy-detail-source">
            데이터 출처: {policy.source}
            <span>·</span>
            기준일: {policy.sourceDate}
          </div>
        </header>

        {/* 테스트 데이터 안내 */}
        <div className="policy-detail-demo-notice">
          <strong>테스트용 정책 데이터입니다.</strong>
          <p>
            현재 표시되는 지원 금액, 기간, 대상 및 신청 정보는
            실제 공고가 아닌 화면 구현용 예시입니다.
            실제 신청 전에는 반드시 공식 공고를 확인해야 합니다.
          </p>
        </div>

        {/* 지원 내용 */}
        <section className="policy-detail-section">
          <div className="policy-detail-section-heading">
            <span>01</span>
            <div>
              <h2>지원 내용</h2>
              <p>이 사업에서 제공하는 지원 정보를 확인해 보세요.</p>
            </div>
          </div>

          <div className="policy-detail-benefit">
            <div>
              <span>지원 규모</span>
              <strong>{policy.supportAmount}</strong>
            </div>

            <div>
              <span>지원 기간</span>
              <strong>{policy.supportPeriod}</strong>
            </div>

            <div>
              <span>신청 기간</span>
              <strong>{policy.applicationPeriod}</strong>
            </div>
          </div>

          <div className="policy-detail-description">
            <h3>사업 소개</h3>
            <p>{policy.description}</p>
          </div>
        </section>

        {/* 자격 조건 */}
        <section className="policy-detail-section">
          <div className="policy-detail-section-heading">
            <span>02</span>
            <div>
              <h2>나의 자격 조건 확인</h2>
              <p>입력한 정보와 사업별 기본 조건을 비교했습니다.</p>
            </div>
          </div>

          <div className="policy-detail-result-summary">
            <div>
              <strong>{getStatusLabel(result.status)}</strong>
              <p>
                총 {result.results.length}개 조건 중
                {result.passCount}개 충족,
                {result.reviewCount}개 추가 확인,
                {result.failCount}개 미충족
              </p>
            </div>

            <EligibilityBadge status={result.status} />
          </div>

          <div className="policy-condition-list">
            {result.results.map((item) => (
              <div
                className="policy-condition-item"
                key={item.field}
              >
                <div className="policy-condition-info">
                  <strong>{item.label}</strong>
                  <p>{item.message}</p>
                </div>

                <span
                  className={`condition-status ${item.status}`}
                >
                  {item.status === 'pass'
                    ? '충족'
                    : item.status === 'fail'
                      ? '미충족'
                      : '추가 확인'}
                </span>
              </div>
            ))}
          </div>

          <div className="policy-additional-check">
            <strong>추가로 확인해야 할 사항</strong>

            <ul>
              {policy.additionalChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 신청 서류 */}
        <section className="policy-detail-section">
          <div className="policy-detail-section-heading">
            <span>03</span>
            <div>
              <h2>신청 서류 체크리스트</h2>
              <p>
                신청에 필요한 서류를 준비하면서 체크해 보세요.
              </p>
            </div>
          </div>

          <div className="document-progress">
            <div>
              <strong>준비 현황</strong>
              <span>
                {checkedDocuments.length}/{policy.documents.length}
              </span>
            </div>

            <div className="document-progress-track">
              <div
                className="document-progress-value"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="document-checklist">
            {policy.documents.map((documentName) => {
              const checked = checkedDocuments.includes(documentName);

              return (
                <label
                  className={`document-item ${
                    checked ? 'checked' : ''
                  }`}
                  key={documentName}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDocument(documentName)}
                  />

                  <span className="document-checkbox" />

                  <span className="document-name">
                    {documentName}
                  </span>

                  <span className="document-state">
                    {checked ? '준비 완료' : '준비 필요'}
                  </span>
                </label>
              );
            })}
          </div>

          <p className="document-help">
            체크리스트는 현재 화면에서만 유지됩니다.
            실제 제출 서류는 해당 사업의 최신 공고를 확인해 주세요.
          </p>
        </section>

        {/* 신청 방법 */}
        <section className="policy-detail-section">
          <div className="policy-detail-section-heading">
            <span>04</span>
            <div>
              <h2>신청 방법</h2>
              <p>신청 절차와 공식 정보를 확인해 보세요.</p>
            </div>
          </div>

          <div className="policy-application-info">
            <div>
              <span>신청 방식</span>
              <strong>{policy.applicationMethod}</strong>
            </div>

            <div>
              <span>지원 대상</span>
              <strong>{policy.target}</strong>
            </div>
          </div>

          {policy.officialUrl && (
            <a
              href={policy.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="policy-official-link"
            >
              공식 사업 안내 확인하기 ↗
            </a>
          )}

          {policy.applicationUrl ? (
            <button
              type="button"
              className="policy-apply-button"
              onClick={handleOfficialLink}
            >
              공식 신청 페이지로 이동
              <span>↗</span>
            </button>
          ) : (
            <div className="policy-link-unavailable">
              <strong>공식 신청 링크가 아직 등록되지 않았습니다.</strong>
              <p>
                실제 사업 공고와 신청 페이지를 확인한 뒤
                연결할 예정입니다.
              </p>
            </div>
          )}
        </section>

        {/* 마지막 안내 */}
        <div className="policy-detail-final-notice">
          <strong>신청 전 꼭 확인해 주세요.</strong>
          <p>
            이 화면의 매칭 결과는 입력한 정보를 기반으로 한
            사전 확인 결과입니다. 최종 지원 자격과 선정 여부는
            사업 운영기관의 심사를 통해 결정됩니다.
          </p>
        </div>

        <div className="policy-detail-actions">
          <button
            type="button"
            className="policy-detail-result-button"
            onClick={handleBack}
          >
            매칭 결과로 돌아가기
          </button>
        </div>
      </div>
    </main>
  );
}

export default PolicyDetail;
