import { useParams } from 'react-router-dom';

export default function ProfilePage() {
  const { username } = useParams();

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ 
        width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        👤
      </div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>@{username}</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>짧은 소개글이 여기에 표시됩니다.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ padding: '15px', backgroundColor: 'var(--box-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          임시 링크 아이템 1
        </div>
        <div style={{ padding: '15px', backgroundColor: 'var(--box-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          임시 링크 아이템 2
        </div>
      </div>
    </div>
  );
}
