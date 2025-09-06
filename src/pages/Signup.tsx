import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://youthjob.site/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // 예시 스펙 그대로
      });

      // 네트워크/HTTP 레벨 에러 처리
      if (!res.ok) {
        // 백엔드가 에러도 JSON으로 줄 수 있으니 가능한 한 message 뽑기
        let serverMsg = "회원가입 실패";
        try {
          const data = await res.json();
          if (data?.message) serverMsg = data.message;
        } catch (_) {}
        throw new Error(serverMsg);
      }

      // 정상 응답 파싱: { status:200, success:true, message:"회원가입 성공" }
      const data = await res.json();

      if (data?.success) {
        alert(data?.message ?? "회원가입 성공");
        navigate("/login"); // 성공 시 로그인 화면으로
      } else {
        setError(data?.message ?? "회원가입에 실패했습니다.");
      }
    } catch (err: any) {
      setError(err?.message ?? "서버와 통신에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="signup-page">
        <div className="signup-box">
          <h2 className="signup-title">회원가입</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <label>
              이메일
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              비밀번호
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label>
              비밀번호 확인
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>

            {error && <p className="signup-error">{error}</p>}

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "처리 중..." : "회원가입"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
