import React, { useState } from 'react';

const Home = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      margin: 0,
      padding: 0
    },

    // Main content styles
    mainContent: {
      width: '100%',
      padding: '0',
      position: 'relative'
    },
    
    // Hero section
    heroSection: {
      width: '100%',
      textAlign: 'center',
      marginBottom: '80px',
      padding: '60px 40px',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    heroTitle: {
      fontSize: 'clamp(3rem, 6vw, 5rem)',
      color: 'white',
      fontWeight: 'bold',
      marginBottom: '30px',
      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    },
    heroIcon: {
      fontSize: '4rem',
      animation: 'rotate 3s linear infinite'
    },
    heroSubtitle: {
      fontSize: '1.4rem',
      color: 'rgba(255,255,255,0.9)',
      lineHeight: 1.6,
      maxWidth: '800px',
      margin: '0 auto'
    },

    // Features grid
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '40px',
      marginBottom: '80px',
      padding: '0 40px'
    },
    featureCard: {
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      transition: 'all 0.4s ease',
      border: '1px solid rgba(255,255,255,0.3)',
      position: 'relative',
      overflow: 'hidden'
    },
    featureCardHover: {
      transform: 'translateY(-10px)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
    },
    featureTitle: {
      fontSize: '2rem',
      color: '#2c3e50',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    featureIcon: {
      fontSize: '2.5rem'
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    featureItem: {
      background: 'linear-gradient(90deg, #f8f9fa, #e9ecef)',
      margin: '15px 0',
      padding: '18px 25px',
      borderRadius: '12px',
      borderLeft: '4px solid #4ecdc4',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      fontSize: '1rem',
      lineHeight: 1.5
    },

    // Steps section
    stepsSection: {
      width: '100%',
      background: 'rgba(255,255,255,0.95)',
      padding: '50px 40px',
      marginBottom: '60px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.1)'
    },
    stepsTitle: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px'
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px'
    },
    stepCard: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: '35px',
      borderRadius: '20px',
      position: 'relative',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textAlign: 'center'
    },
    stepNumber: {
      position: 'absolute',
      top: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '50px',
      height: '50px',
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    },
    stepTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '15px',
      marginTop: '20px'
    },
    stepDesc: {
      fontSize: '1rem',
      opacity: 0.9,
      lineHeight: 1.5
    },

    // CTA section
    ctaSection: {
      width: '100%',
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
      padding: '60px 40px',
      textAlign: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    },
    ctaTitle: {
      fontSize: '2.8rem',
      marginBottom: '20px',
      fontWeight: 'bold'
    },
    ctaSubtitle: {
      fontSize: '1.2rem',
      marginBottom: '40px',
      opacity: 0.9
    },
    ctaButton: {
      background: 'white',
      color: '#2c3e50',
      border: 'none',
      padding: '20px 50px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
      textDecoration: 'none',
      display: 'inline-block'
    },

    // Background elements
    backgroundShape: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1))',
      animation: 'float 8s ease-in-out infinite'
    },
    shape1: {
      width: '200px',
      height: '200px',
      top: '10%',
      left: '5%',
      animationDelay: '0s'
    },
    shape2: {
      width: '150px',
      height: '150px',
      top: '70%',
      right: '10%',
      animationDelay: '3s'
    },
    shape3: {
      width: '100px',
      height: '100px',
      top: '40%',
      left: '80%',
      animationDelay: '6s'
    }
  };

  const keyframes = `
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg); 
        opacity: 0.7;
      }
      50% { 
        transform: translateY(-30px) rotate(180deg); 
        opacity: 1;
      }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: translateY(50px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
  `;

  const features = [
    'Theo dõi tỷ giá giữa hơn 160 loại tiền tệ theo thời gian thực.',
    'Nhập liệu tỷ giá từ nguồn riêng hoặc thủ công.',
    'Xuất dữ liệu tỷ giá ra CSV để lưu trữ, báo cáo hoặc tích hợp hệ thống khác.',
    'Hiển thị biểu đồ tỷ giá cùng các chỉ báo kỹ thuật như SMA, EMA, RSI.',
    'Nhận cảnh báo khi tỷ giá đạt đến ngưỡng mong muốn.',
    'Giao tiếp real-time nhờ tích hợp WebSocket.'
  ];

  const targetAudience = [
    'Doanh nghiệp cần cập nhật và lưu trữ tỷ giá trong hệ thống nội bộ.',
    'Nhà đầu tư cá nhân muốn phân tích thị trường ngoại hối.',
    'Tổ chức tài chính muốn khai thác dữ liệu tỷ giá lịch sử.',
    'Lập trình viên xây dựng hệ thống fintech với dữ liệu tỷ giá.'
  ];

  const steps = [
    { title: 'Đăng ký', desc: 'Tạo tài khoản chỉ trong vài phút.' },
    { title: 'Nhập dữ liệu', desc: 'Tùy chỉnh tỷ giá theo nguồn riêng.' },
    { title: 'Theo dõi & phân tích', desc: 'Dùng bảng điều khiển và chỉ báo kỹ thuật.' },
    { title: 'Xuất dữ liệu', desc: 'Tải xuống tỷ giá phục vụ phân tích và lưu trữ.' }
  ];

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.pageContainer}>
        {/* Background shapes */}
        <div style={{...styles.backgroundShape, ...styles.shape1}}></div>
        <div style={{...styles.backgroundShape, ...styles.shape2}}></div>
        <div style={{...styles.backgroundShape, ...styles.shape3}}></div>

        {/* Header */}

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Hero Section */}
          <section style={styles.heroSection}>
            <h1 style={styles.heroTitle}>
              <span style={styles.heroIcon}>💱</span>
              FX Rate Dashboard
            </h1>
            <p style={styles.heroSubtitle}>
              <strong>FX Rate Dashboard</strong> là nền tảng trực quan và mạnh mẽ giúp bạn theo dõi, 
              phân tích và xuất – nhập tỷ giá tiền tệ thời gian thực.
            </p>
          </section>

          {/* Features Grid */}
          <div style={styles.featuresGrid}>
            {/* Why Choose Section */}
            <div 
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
            >
              <h2 style={styles.featureTitle}>
                <span style={styles.featureIcon}>🚀</span>
                Tại sao chọn FX Rate Dashboard?
              </h2>
              <ul style={styles.featureList}>
                {features.map((feature, index) => (
                  <li 
                    key={index}
                    style={{
                      ...styles.featureItem,
                      ...(hoveredItem === `feature-${index}` ? {
                        transform: 'translateX(10px)',
                        borderLeftColor: '#ff6b6b',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                      } : {})
                    }}
                    onMouseEnter={() => setHoveredItem(`feature-${index}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Audience Section */}
            <div 
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
            >
              <h2 style={styles.featureTitle}>
                <span style={styles.featureIcon}>👥</span>
                Dành cho ai?
              </h2>
              <ul style={styles.featureList}>
                {targetAudience.map((audience, index) => (
                  <li 
                    key={index}
                    style={{
                      ...styles.featureItem,
                      ...(hoveredItem === `audience-${index}` ? {
                        transform: 'translateX(10px)',
                        borderLeftColor: '#ff6b6b',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                      } : {})
                    }}
                    onMouseEnter={() => setHoveredItem(`audience-${index}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {audience}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps Section */}
          <section style={styles.stepsSection}>
            <h2 style={styles.stepsTitle}>
              <span style={styles.featureIcon}>🧭</span>
              4 bước để bắt đầu
            </h2>
            <div style={styles.stepsGrid}>
              {steps.map((step, index) => (
                <div 
                  key={index}
                  style={{
                    ...styles.stepCard,
                    ...(hoveredItem === `step-${index}` ? {
                      transform: 'translateY(-5px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    } : {})
                  }}
                  onMouseEnter={() => setHoveredItem(`step-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div style={styles.stepNumber}>{index + 1}</div>
                  <div style={styles.stepTitle}>{step.title}</div>
                  <div style={styles.stepDesc}>{step.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section style={styles.ctaSection}>
            <h2 style={styles.ctaTitle}>🎯 Sẵn sàng trải nghiệm?</h2>
            <p style={styles.ctaSubtitle}>
              Khám phá sức mạnh của FX Rate Dashboard ngay hôm nay!
            </p>
            <a 
              href="/register" 
              style={{
                ...styles.ctaButton,
                ...(hoveredItem === 'cta-button' ? {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                } : {})
              }}
              onMouseEnter={() => setHoveredItem('cta-button')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Đăng ký ngay
            </a>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;