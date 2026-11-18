
function EligibilityBadge({ status }) {
  const badgeInfo = {
    eligible: {
      label: '충족 가능',
      className: 'eligible',
    },
    review: {
      label: '추가 확인 필요',
      className: 'review',
    },
    ineligible: {
      label: '미충족',
      className: 'ineligible',
    },
  };

  const info = badgeInfo[status] || badgeInfo.review;

  return (
    <span className={`eligibility-badge ${info.className}`}>
      {info.label}
    </span>
  );
}

export default EligibilityBadge;
