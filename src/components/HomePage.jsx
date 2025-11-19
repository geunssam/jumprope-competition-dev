import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>🏃‍♂️ JumpRope Master v20</h1>
          <div className="user-info">
            <img
              src={user?.photoURL || '/default-avatar.png'}
              alt={user?.displayName}
              className="user-avatar"
            />
            <div className="user-details">
              <p className="user-name">{user?.displayName}</p>
              <p className="user-email">{user?.email}</p>
            </div>
            <button onClick={handleSignOut} className="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="home-main">
        <div className="welcome-card">
          <h2>✅ Phase 2 완료!</h2>
          <p>Firebase 인증이 성공적으로 구현되었습니다.</p>

          <div className="status-grid">
            <div className="status-item">
              <span className="status-icon">✅</span>
              <span>Firebase 프로젝트 생성</span>
            </div>
            <div className="status-item">
              <span className="status-icon">✅</span>
              <span>Google 로그인</span>
            </div>
            <div className="status-item">
              <span className="status-icon">✅</span>
              <span>AuthContext</span>
            </div>
            <div className="status-item">
              <span className="status-icon">⏳</span>
              <span>Firestore 설정 (Phase 4)</span>
            </div>
          </div>

          <div className="next-phase">
            <h3>다음 단계: Phase 3</h3>
            <p>Tailwind CSS + shadcn/ui 설치</p>
          </div>
        </div>

        <div className="info-card">
          <h3>개발 정보</h3>
          <ul>
            <li><strong>프로젝트 ID:</strong> jumprope-master-v20</li>
            <li><strong>인증 방식:</strong> Google OAuth</li>
            <li><strong>사용자:</strong> {user?.email}</li>
            <li><strong>상태:</strong> Phase 2 완료 ✅</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
