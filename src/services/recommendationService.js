
import regions from '../data/regions.json';

// 기본 가중치
const BASE_WEIGHTS = {
  housingCost: 0.35,
  transport: 0.30,
  convenience: 0.20,
  environment: 0.15
};

// 사용자의 우선순위에 따른 가중치 조정
const PRIORITY_WEIGHTS = {
  housingCost: 'housingCost',
  transport: 'transport',
  convenience: 'convenience',
  safety: 'environment',
  environment: 'environment'
};

function getWeights(priorities = []) {
  const weights = { ...BASE_WEIGHTS };

  // 안전과 환경은 동일 평가 항목으로 묶어서 반영
  if (priorities.includes('safety')) {
    weights.environment += 0.15;
  }

  if (priorities.includes('environment')) {
    weights.environment += 0.15;
  }

  priorities.forEach((priority) => {
    const key = PRIORITY_WEIGHTS[priority];

    if (key && key !== 'environment') {
      weights[key] += 0.15;
    }
  });

  const total = Object.values(weights).reduce(
    (sum, value) => sum + value,
    0
  );

  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [
      key,
      value / total
    ])
  );
}

// 예산 조건을 참고한 시연용 주거비 점수 조정
function getBudgetAdjustedScore(region, userData) {
  let score = region.scores.housingCost;

  const budget = Number(userData.budget);
  const monthlyBudget = Number(userData.monthlyRentBudget);

  if (budget > 0) {
    if (budget < region.sampleDeposit) {
      score -= 15;
    } else if (budget >= region.sampleDeposit + 1000) {
      score += 5;
    }
  }

  if (monthlyBudget > 0) {
    if (monthlyBudget < region.sampleRent) {
      score -= 10;
    } else if (monthlyBudget >= region.sampleRent + 15) {
      score += 3;
    }
  }

  return Math.max(0, Math.min(100, score));
}

// 지역별 추천 점수 계산
function calculateRegionScore(region, userData) {
  const weights = getWeights(userData.priorities);

  const scores = {
    ...region.scores,
    housingCost: getBudgetAdjustedScore(region, userData)
  };

  const totalScore =
    scores.housingCost * weights.housingCost +
    scores.transport * weights.transport +
    scores.convenience * weights.convenience +
    scores.environment * weights.environment;

  return {
    ...region,
    adjustedScores: scores,
    weights,
    recommendationScore: Math.round(totalScore)
  };
}

// 추천 TOP 3
export function getRecommendedRegions(userData) {
  const scoredRegions = regions.map((region) =>
    calculateRegionScore(region, userData)
  );

  return scoredRegions
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 3);
}

// 점수별 추천 이유 생성
export function getRecommendationReasons(region) {
  const scoreLabels = {
    housingCost: '주거비',
    transport: '교통',
    convenience: '생활 편의',
    environment: '안전·환경'
  };

  return Object.entries(region.adjustedScores)
    .map(([key, score]) => ({
      key,
      label: scoreLabels[key],
      score
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
