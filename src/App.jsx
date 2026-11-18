
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/common/Header';

import Home from './pages/Home';
import ConditionInput from './pages/ConditionInput';
import Recommendation from './pages/Recommendation';
import RegionCompare from './pages/RegionCompare';
import HousingSelection from './pages/HousingSelection';
import MatchingResult from './pages/MatchingResult';
import PolicyDetail from './pages/PolicyDetail';

// 화면 이동 시 스크롤 최상단으로 이동
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />

      <Header />

      <Routes>
        {/* SCREEN 01. 메인 */}
        <Route path="/" element={<Home />} />

        {/* SCREEN 02. 주거 조건 입력 */}
        <Route path="/condition" element={<ConditionInput />} />

        {/* SCREEN 03. 맞춤 지역 추천 */}
        <Route path="/recommendation" element={<Recommendation />} />

        {/* SCREEN 04. 지역 탐색 및 복지 확인 지역 선택 */}
        <Route path="/regions" element={<RegionCompare />} />

        {/* SCREEN 05. 지원 확인용 정보 입력 */}
        <Route path="/support-info" element={<HousingSelection />} />

        {/* 기존 경로 호환용 */}
        <Route path="/housing" element={<HousingSelection />} />
        <Route path="/eligibility" element={<HousingSelection />} />

        {/* SCREEN 06. 지역별 지원사업 매칭 결과 */}
        <Route path="/matching" element={<MatchingResult />} />

        {/* SCREEN 07. 지원사업 상세 */}
        <Route path="/policy/:policyId" element={<PolicyDetail />} />
      </Routes>
    </>
  );
}

export default App;
