
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

const STORAGE_KEY = '24zip-user-data';

// 초기 사용자 데이터
// 함수를 사용하여 초기화할 때마다 새로운 객체 생성
const createInitialUserData = () => ({
  // 1. 주거 조건
  budget: '',
  monthlyRentBudget: '',
  destination: '',
  transportation: 'subway',
  commuteTime: 30,

  // 2. 생활 우선순위
  priorities: [],

  // 3. 추천 지역 및 복지 확인 지역
  recommendedRegions: [],
  selectedRegions: [],
  welfareRegions: [],

  // 4. 지원 확인용 기본 정보
  age: '',
  income: '',
  incomeLevel: '',
  householdType: 'single',
  homeless: '',
  seoulResident: '',
  housingBenefit: '',

  // 5. 주택 및 계약 정보
  housingType: '',
  residenceType: '',
  deposit: '',
  monthlyRent: '',
  managementFee: '',

  // 6. 선택한 지원사업
  selectedPolicies: []
});

export function UserProvider({ children }) {
  // LocalStorage에서 기존 데이터 불러오기
  const [userData, setUserData] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (!savedData) {
        return createInitialUserData();
      }

      const parsedData = JSON.parse(savedData);

      return {
        ...createInitialUserData(),
        ...parsedData
      };
    } catch (error) {
      console.error('사용자 데이터 불러오기 실패:', error);
      return createInitialUserData();
    }
  });

  // 데이터 변경 시 LocalStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error('사용자 데이터 저장 실패:', error);
    }
  }, [userData]);

  // 기존 데이터 유지하면서 일부 항목 수정
  const updateUserData = (newData) => {
    setUserData((prev) => ({
      ...prev,
      ...newData
    }));
  };

  // 사용자 데이터 전체 초기화
  const resetUserData = () => {
    const initialData = createInitialUserData();

    setUserData(initialData);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        updateUserData,
        resetUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// 다른 컴포넌트에서 사용자 데이터 사용
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      'useUser는 UserProvider 내부에서 사용해야 합니다.'
    );
  }

  return context;
}
