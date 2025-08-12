import { Outlet } from 'react-router-dom';

export default function SignupLayout() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{ 
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-background-2)',
        backgroundColor: 'var(--color-highlight)'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>🌿</div>
            <h1 className="logoText" style={{ margin: 0 }}>
              sharethrift
            </h1>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-message-text)' }}>
              Log In | Sign Up
            </span>
          </div>
        </div>
      </header>
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      <footer style={{ 
        padding: '24px',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-highlight)',
        textAlign: 'center'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <div style={{ fontSize: '24px' }}>📘</div>
            <div style={{ fontSize: '24px' }}>🐦</div>
          </div>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px'
          }}>
            <span>Privacy Policy</span>
            <span>|</span>
            <span>Terms and Conditions</span>
            <span>|</span>
            <span>Contact</span>
          </div>
          <div style={{ fontSize: '14px' }}>
            ©2024 sharethrift All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
