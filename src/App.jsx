import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RecordProvider } from './contexts/RecordContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import './App.css';

// 메인 앱 컴포넌트 (로그인 상태에 따라 페이지 전환)
const AppContent = () => {
  const { user } = useAuth();

  return user ? <HomePage /> : <LoginPage />;
};

// 루트 앱 컴포넌트
function App() {
  return (
    <AuthProvider>
      <RecordProvider>
        <AppContent />
      </RecordProvider>
    </AuthProvider>
  );
}

export default App;
