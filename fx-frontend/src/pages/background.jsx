import React from 'react';

const Background = () => {
  return (
    <div style={{
      minHeight: '300vh', // Kéo dài trang ra 3 lần
      background: '#0a0a0a', // Nền đen như ảnh
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Trading Chart Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(90deg, transparent 0%, rgba(0,255,150,0.1) 2%, transparent 4%),
          linear-gradient(90deg, transparent 10%, rgba(255,0,80,0.1) 12%, transparent 14%),
          linear-gradient(90deg, transparent 20%, rgba(0,255,150,0.1) 22%, transparent 24%),
          linear-gradient(90deg, transparent 30%, rgba(255,0,80,0.1) 32%, transparent 34%),
          linear-gradient(90deg, transparent 40%, rgba(0,255,150,0.1) 42%, transparent 44%),
          linear-gradient(90deg, transparent 50%, rgba(255,0,80,0.1) 52%, transparent 54%),
          linear-gradient(90deg, transparent 60%, rgba(0,255,150,0.1) 62%, transparent 64%),
          linear-gradient(90deg, transparent 70%, rgba(255,0,80,0.1) 72%, transparent 74%),
          linear-gradient(90deg, transparent 80%, rgba(0,255,150,0.1) 82%, transparent 84%),
          linear-gradient(90deg, transparent 90%, rgba(255,0,80,0.1) 92%, transparent 94%)
        `,
        backgroundSize: '80px 100%, 120px 100%, 90px 100%, 110px 100%, 100px 100%, 85px 100%, 95px 100%, 105px 100%, 115px 100%, 75px 100%',
        animation: 'tradingFlow 20s linear infinite',
        zIndex: 1
      }}>
        
        {/* Candlestick Patterns */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: (i * 30) + 'px',
              top: Math.random() * 80 + 10 + '%',
              width: '2px',
              height: Math.random() * 100 + 50 + 'px',
              background: i % 3 === 0 ? '#00ff96' : '#ff5050',
              opacity: 0.6,
              boxShadow: `0 0 10px ${i % 3 === 0 ? '#00ff96' : '#ff5050'}`,
              animation: `candleFlicker ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}

        {/* Price Lines */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`line-${i}`}
            style={{
              position: 'absolute',
              left: 0,
              top: (i * 10) + '%',
              width: '100%',
              height: '1px',
              background: 'rgba(255,255,255,0.1)',
              opacity: 0.3
            }}
          />
        ))}

        {/* Floating Numbers/Data */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`data-${i}`}
            style={{
              position: 'absolute',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              color: i % 2 === 0 ? '#00ff96' : '#ff5050',
              fontSize: '12px',
              fontFamily: 'monospace',
              opacity: 0.7,
              animation: `dataFloat ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's'
            }}
          >
            {i % 2 === 0 ? '+' : '-'}{(Math.random() * 10).toFixed(2)}%
          </div>
        ))}
      </div>

      {/* Grid Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Content Area */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '2rem',
        color: 'white'
      }}>
        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          padding: '4rem 0 6rem',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          margin: '2rem 0'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(0,255,150,0.5)'
          }}>
            📊 Trading Dashboard Background
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.8,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Hình nền biểu đồ trading chuyên nghiệp với hiệu ứng candlestick và dữ liệu real-time
          </p>
        </div>

        {/* Spacer sections to make page longer */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              height: '50vh',
              margin: '4rem 0',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              padding: '3rem',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: i % 2 === 0 ? '#00ff96' : '#ff5050'
              }}>
                Section {i + 1}
              </h2>
              <p style={{
                fontSize: '1.1rem',
                opacity: 0.7,
                maxWidth: '500px'
              }}>
                Đây là nội dung mẫu để làm cho trang web dài hơn. 
                Background sẽ hiển thị liên tục phía sau với hiệu ứng trading chart.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes tradingFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100px); }
        }

        @keyframes candleFlicker {
          0% { opacity: 0.4; transform: scaleY(1); }
          100% { opacity: 0.8; transform: scaleY(1.1); }
        }

        @keyframes dataFloat {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.3; 
          }
          50% { 
            transform: translateY(-20px) rotate(5deg); 
            opacity: 0.8; 
          }
        }
      `}</style>
    </div>
  );
};

export default Background;