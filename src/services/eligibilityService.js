
const INCOME_LABELS = {
  under100: '월 100만 원 미만',
  '100to200': '월 100~200만 원',
  '200to300': '월 200~300만 원',
  '300to400': '월 300~400만 원',
  '400to500': '월 400~500만 원',
  over500: '월 500만 원 이상',
  unknown: '소득 확인 필요',
};

const YES_NO_LABELS = {
  yes: '예',
  no: '아니요',
  unknown: '확인 필요',
};

const FIELD_LABELS = {
  age: '연령',
  incomeLevel: '소득',
  housingStatus: '무주택 여부',
  seoulResident: '서울 거주 여부',
  householdType: '가구 형태',
  residenceType: '현재 거주 형태',
  housingBenefit: '현재 주거 지원 수혜 여부',
};

function createResult(field, status, message) {
  return {
    field,
    label: FIELD_LABELS[field] || field,
    status,
    message,
  };
}

function checkAge(age, criteria) {
  if (age === '' || age === null || age === undefined) {
    return createResult(
      'age',
      'review',
      '나이 정보가 입력되지 않았습니다.'
    );
  }

  const value = Number(age);

  if (!Number.isFinite(value)) {
    return createResult(
      'age',
      'review',
      '나이 정보를 확인할 수 없습니다.'
    );
  }

  if (
    (criteria.minAge !== undefined && value < criteria.minAge) ||
    (criteria.maxAge !== undefined && value > criteria.maxAge)
  ) {
    return createResult(
      'age',
      'fail',
      '해당 사업의 연령 조건을 충족하지 않습니다.'
    );
  }

  return createResult(
    'age',
    'pass',
    '연령 조건을 충족합니다.'
  );
}


function checkAllowedValue(
  field,
  value,
  allowedValues,
  unknownValues = ['unknown']
) {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    unknownValues.includes(value)
  ) {
    return createResult(
      field,
      'review',
      `${FIELD_LABELS[field]} 정보를 추가로 확인해야 합니다.`
    );
  }

  if (!allowedValues) {
    return createResult(
      field,
      'review',
      '확인할 수 있는 사업 조건이 설정되지 않았습니다.'
    );
  }

  if (!allowedValues.includes(value)) {
    return createResult(
      field,
      'fail',
      `${FIELD_LABELS[field]} 조건을 충족하지 않습니다.`
    );
  }

  return createResult(
    field,
    'pass',
    `${FIELD_LABELS[field]} 조건을 충족합니다.`
  );
}

function checkExactValue(field, value, expectedValue) {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    value === 'unknown'
  ) {
    return createResult(
      field,
      'review',
      `${FIELD_LABELS[field]} 정보를 추가로 확인해야 합니다.`
    );
  }

  if (value !== expectedValue) {
    return createResult(
      field,
      'fail',
      `${FIELD_LABELS[field]} 조건을 충족하지 않습니다.`
    );
  }

  return createResult(
    field,
    'pass',
    `${FIELD_LABELS[field]} 조건을 충족합니다.`
  );
}

export function evaluatePolicy(policy, userInfo) {
  const criteria = policy.criteria || {};
  const user = userInfo || {};

  const results = [];

  // 연령
  results.push(
    checkAge(user.age, criteria)
  );

  // 소득
  results.push(
    checkAllowedValue(
      'incomeLevel',
      user.incomeLevel,
      criteria.incomeLevels
    )
  );

  // 무주택 여부
  results.push(
    checkExactValue(
      'housingStatus',
      user.housingStatus,
      criteria.housingStatus
    )
  );

  // 서울 거주 여부
  results.push(
    checkAllowedValue(
      'seoulResident',
      user.seoulResident,
      criteria.seoulResident
    )
  );

  // 가구 형태
  results.push(
    checkAllowedValue(
      'householdType',
      user.householdType,
      criteria.householdTypes
    )
  );

  // 현재 거주 형태
  results.push(
    checkAllowedValue(
      'residenceType',
      user.residenceType,
      criteria.residenceTypes
    )
  );

  // 현재 주거 지원 수혜 여부
  results.push(
    checkExactValue(
      'housingBenefit',
      user.housingBenefit,
      criteria.housingBenefit
    )
  );

  const failCount = results.filter(
    (item) => item.status === 'fail'
  ).length;

  const reviewCount = results.filter(
    (item) => item.status === 'review'
  ).length;

  let status = 'eligible';

  if (failCount > 0) {
    status = 'ineligible';
  } else if (reviewCount > 0) {
    status = 'review';
  }

  return {
    policyId: policy.id,
    policy,
    status,
    results,
    passCount: results.filter(
      (item) => item.status === 'pass'
    ).length,
    failCount,
    reviewCount,
  };
}

export function evaluateAllPolicies(policies, userInfo) {
  return policies
    .map((policy) => evaluatePolicy(policy, userInfo))
    .sort((a, b) => {
      const order = {
        eligible: 0,
        review: 1,
        ineligible: 2,
      };

      return order[a.status] - order[b.status];
    });
}

export function getStatusLabel(status) {
  const labels = {
    eligible: '충족 가능',
    review: '추가 확인 필요',
    ineligible: '미충족',
  };

  return labels[status] || '확인 필요';
}

export function getIncomeLabel(value) {
  return INCOME_LABELS[value] || '확인 필요';
}

export function getYesNoLabel(value) {
  return YES_NO_LABELS[value] || '확인 필요';
}
