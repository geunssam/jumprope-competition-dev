import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🏃‍♂️ JumpRope Master v20
            </h1>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-right">
                <p className="font-medium">{user?.displayName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button onClick={handleSignOut} variant="outline">
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              ✅ Phase 3 완료!
            </CardTitle>
            <CardDescription className="text-base">
              Tailwind CSS + shadcn/ui가 성공적으로 설치되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                <span className="text-2xl">✅</span>
                <span className="font-medium">Firebase 프로젝트 생성</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                <span className="text-2xl">✅</span>
                <span className="font-medium">Google 로그인</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                <span className="text-2xl">✅</span>
                <span className="font-medium">AuthContext</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                <span className="text-2xl">✅</span>
                <span className="font-medium">Tailwind + shadcn/ui</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-semibold text-lg mb-2">다음 단계: Phase 4</h3>
              <p className="text-muted-foreground">
                firestoreService + RecordContext 구현
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>개발 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">프로젝트 ID</span>
                <Badge variant="outline">jumprope-master-v20</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">인증 방식</span>
                <Badge variant="outline">Google OAuth</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">사용자</span>
                <span className="text-sm text-muted-foreground">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">상태</span>
                <Badge className="bg-green-500">Phase 3 완료 ✅</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HomePage;
