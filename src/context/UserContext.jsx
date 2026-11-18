
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

// 사용자 기본 데이터
const initialUserData = {
  // 주거 조건
  budget: '',
  monthlyRentBudget: '',
  destination: '',
  transportation: 'subway',
  commuteTime: 30,

  // 생활 우선순위
  priorities: [],

  // 개인 정보 및 자격 조건
  age: '',
  income: '',
  householdType: 'single',
  homeless: '',

  // 주택 정보
  housingType: '',
  deposit: '',
  monthlyRent: '',
  managementFee: '',

  // 선택한 지역
  selectedRegions: [],

  // 선택한 지원사업
  selectedPolicies: []
};

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    try {
      const savedData = localStorage.getItem('24zip-user-data');

      return savedData
        ? { ...initialUserData, ...JSON.parse(savedData) }
        : initialUserData;
    } catch {
      return initialUserData;
    }
  });

  // 데이터 변경 시 LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem('24zip-user-data', JSON.stringify(userData));
  }, [userData]);

  // 기존 데이터에 새로운 값 반영
  const updateUserData = (newData) => {
    setUserData((prev) => ({
      ...prev,
      ...newData
    }));
  };

  // 사용자 데이터 초기화
  const resetUserData = () => {
    localStorage.removeItem('24zip-user-data');
    setUserData(initialUserData);
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
    throw new Error('useUser는 UserProvider 내부에서 사용해야 합니다.');
  }

  return context;
}
