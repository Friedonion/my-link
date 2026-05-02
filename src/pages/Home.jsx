export default function Home() {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>마이링크</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>하나의 링크로 모든 것을 공유하세요.</p>
      <button style={{ 
        padding: '15px 30px', 
        backgroundColor: 'var(--primary-color)', 
        color: 'white', 
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold'
      }}>
        구글 로그인으로 시작하기
      </button>
    </div>
  );
}
