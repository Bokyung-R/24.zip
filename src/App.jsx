
import { Routes, Route } from 'react-router-dom';

import Header from './components/common/Header';

import Home from './pages/Home';
import ConditionInput from './pages/ConditionInput';
import Recommendation from './pages/Recommendation';
import RegionCompare from './pages/RegionCompare';
import HousingSelection from './pages/HousingSelection';
import EligibilityInput from './pages/EligibilityInput';
import MatchingResult from './pages/MatchingResult';
import PolicyDetail from './pages/PolicyDetail';

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/condition" element={<ConditionInput />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/regions" element={<RegionCompare />} />
        <Route path="/housing" element={<HousingSelection />} />
        <Route path="/eligibility" element={<EligibilityInput />} />
        <Route path="/matching" element={<MatchingResult />} />
        <Route path="/policy/:policyId" element={<PolicyDetail />} />
      </Routes>
    </>
  );
}

export default App;
