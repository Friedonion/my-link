export default function Setup() {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', flex: 1 }}>
      <h1 style={{ marginBottom: '10px' }}>프로필 주소 설정</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>마이링크에서 사용할 고유 주소를 입력해주세요.</p>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
        <span style={{ color: '#888' }}>mylink.com/</span>
        <input 
          type="text" 
          placeholder="username" 
          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', marginLeft: '5px' }} 
        />
      </div>

      <button style={{ 
        width: '100%',
        padding: '15px', 
        backgroundColor: 'var(--primary-color)', 
        color: 'white', 
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold'
      }}>
        저장 및 시작하기
      </button>
    </div>
  );
}
