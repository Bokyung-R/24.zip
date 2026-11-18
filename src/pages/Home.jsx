
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/condition');
  };

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">
            AI YOUTH HOUSING GUIDE
          </span>

          <h1>
            나에게 맞는 서울의 집,
            <br />
            <span>AI와 함께 찾아보세요.</span>
          </h1>

          <p>
            복잡한 청년 주거 정보부터 지역 추천,
            <br />
            나에게 맞는 주거복지 혜택까지 한 번에 확인하세요.
          </p>

          <button
            className="primary-button hero-button"
            onClick={handleStart}
          >
            나에게 맞는 주거 찾기
            <span>→</span>
          </button>

          <div className="hero-caption">
            나의 조건을 입력하고 맞춤형 주거 솔루션을 만나보세요.
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-circle">
            <div className="visual-card">
              <span className="visual-icon">🏠</span>
              <strong>나에게 맞는 주거</strong>
              <span>AI 맞춤 추천 서비스</span>
            </div>

            <div className="visual-tag tag-top">
              📍 맞춤 지역 추천
            </div>

            <div className="visual-tag tag-bottom">
              ✨ 주거복지 혜택 매칭
            </div>
          </div>
        </div>
      </section>

      <section className="service-section" id="service">
        <div className="section-heading">
          <span>WHAT WE PROVIDE</span>
          <h2>주거 준비, 이제 어렵지 않아요.</h2>
          <p>
            24.zip이 나에게 필요한 정보를 한곳에 모아드립니다.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>맞춤 지역 추천</h3>
            <p>
              예산과 직장 위치, 생활 우선순위를 고려해
              나에게 적합한 동네를 추천합니다.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🏡</div>
            <h3>지역별 주거 정보</h3>
            <p>
              관심 지역의 주거 환경과 생활 정보를
              비교하고 확인할 수 있습니다.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>주거복지 혜택 매칭</h3>
            <p>
              나이와 소득 등 조건을 바탕으로
              신청 가능한 지원사업을 확인합니다.
            </p>
          </article>
        </div>
      </section>

      <section className="process-section">
        <div className="section-heading">
          <span>HOW IT WORKS</span>
          <h2>간단한 4단계로 시작하세요.</h2>
        </div>

        <div className="process-grid">
          <div className="process-item">
            <span>01</span>
            <strong>조건 입력</strong>
            <p>예산과 생활 조건 입력</p>
          </div>

          <div className="process-item">
            <span>02</span>
            <strong>지역 추천</strong>
            <p>나에게 맞는 동네 탐색</p>
          </div>

          <div className="process-item">
            <span>03</span>
            <strong>혜택 확인</strong>
            <p>주거복지 지원사업 매칭</p>
          </div>

          <div className="process-item">
            <span>04</span>
            <strong>신청 준비</strong>
            <p>필요 서류와 신청 정보 확인</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
