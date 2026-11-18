
import { useNavigate } from 'react-router-dom';

import EligibilityBadge from './EligibilityBadge';

function PolicyCard({ result }) {
  const navigate = useNavigate();

  const { policy, status, results, passCount } = result;

  const handleDetail = () => {
    navigate(`/policy/${policy.id}`);
  };

  return (
    <article className="policy-card">
      <div className="policy-card-top">
        <span className="policy-category">
          {policy.category}
        </span>

        <EligibilityBadge status={status} />
      </div>

      <h3>{policy.name}</h3>

      <p className="policy-summary">
        {policy.summary}
      </p>

      <div className="policy-support">
        <div>
          <span>지원 내용</span>
          <strong>{policy.supportAmount}</strong>
        </div>

        <div>
          <span>지원 기간</span>
          <strong>{policy.supportPeriod}</strong>
        </div>
      </div>

      <div className="policy-match-info">
        <div className="policy-match-header">
          <strong>자격 조건 확인</strong>
          <span>
            {passCount}/{results.length}개 조건 충족
          </span>
        </div>

        <div className="policy-match-track">
          <div
            className="policy-match-value"
            style={{
              width: `${(passCount / results.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <button
        type="button"
        className="policy-detail-button"
        onClick={handleDetail}
      >
        지원사업 자세히 보기
        <span>→</span>
      </button>
    </article>
  );
}

export default PolicyCard;
