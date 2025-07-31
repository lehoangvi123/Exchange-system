import React, { useState, useEffect } from 'react';

const Home = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counters, setCounters] = useState({
    users: 0,
    transactions: 0,
    currencies: 0,
    countries: 0
  });

  // Counter animation effect
  useEffect(() => {
    const targets = {
      users: 15000,
      transactions: 2500000,
      currencies: 160,
      countries: 95
    };

    const increment = {
      users: 150,
      transactions: 25000,
      currencies: 2,
      countries: 1
    };

    const timer = setInterval(() => {
      setCounters(prev => ({
        users: Math.min(prev.users + increment.users, targets.users),
        transactions: Math.min(prev.transactions + increment.transactions, targets.transactions),
        currencies: Math.min(prev.currencies + increment.currencies, targets.currencies),
        countries: Math.min(prev.countries + increment.countries, targets.countries)
      }));
    }, 50);

    setTimeout(() => clearInterval(timer), 3000);
    return () => clearInterval(timer);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialTimer);
  }, []);

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
      marginBottom: '60px',
      padding: '80px 40px',
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
      margin: '0 auto 40px'
    },
    heroButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '40px'
    },
    primaryButton: {
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    },
    secondaryButton: {
      background: 'transparent',
      color: 'white',
      border: '2px solid white',
      padding: '15px 30px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block'
    },

    // Statistics section
    statsSection: {
      background: 'rgba(255,255,255,0.95)',
      padding: '60px 40px',
      marginBottom: '60px',
      textAlign: 'center'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    statCard: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: '40px 20px',
      borderRadius: '20px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    statNumber: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      display: 'block'
    },
    statLabel: {
      fontSize: '1.1rem',
      opacity: 0.9
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

    // Technology section
    techSection: {
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '80px 40px',
      marginBottom: '60px',
      textAlign: 'center'
    },
    techTitle: {
      fontSize: '2.5rem',
      marginBottom: '20px',
      color: 'white'
    },
    techSubtitle: {
      fontSize: '1.2rem',
      opacity: 0.8,
      marginBottom: '50px',
      maxWidth: '600px',
      margin: '0 auto 50px'
    },
    techGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    techCard: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      padding: '30px',
      borderRadius: '15px',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease'
    },
    techIcon: {
      fontSize: '3rem',
      marginBottom: '20px',
      display: 'block'
    },
    techName: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    techDesc: {
      fontSize: '0.95rem',
      opacity: 0.8,
      lineHeight: 1.5
    },

    // Testimonials section
    testimonialsSection: {
      background: 'rgba(255,255,255,0.95)',
      padding: '80px 40px',
      marginBottom: '60px',
      textAlign: 'center'
    },
    testimonialsTitle: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '50px'
    },
    testimonialCard: {
      maxWidth: '800px',
      margin: '0 auto',
      background: 'white',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    testimonialText: {
      fontSize: '1.3rem',
      lineHeight: 1.6,
      color: '#2c3e50',
      marginBottom: '30px',
      fontStyle: 'italic'
    },
    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    },
    authorAvatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    authorInfo: {
      textAlign: 'left'
    },
    authorName: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '5px'
    },
    authorRole: {
      fontSize: '1rem',
      color: '#666',
      opacity: 0.8
    },

    // Pricing section
    pricingSection: {
      padding: '80px 40px',
      marginBottom: '60px',
      textAlign: 'center',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)'
    },
    pricingTitle: {
      fontSize: '2.5rem',
      color: 'white',
      marginBottom: '20px'
    },
    pricingSubtitle: {
      fontSize: '1.2rem',
      color: 'rgba(255,255,255,0.8)',
      marginBottom: '50px'
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    pricingCard: {
      background: 'white',
      padding: '40px 30px',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      position: 'relative',
      transition: 'all 0.3s ease'
    },
    planName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '10px'
    },
    planPrice: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '20px'
    },
    planFeatures: {
      listStyle: 'none',
      padding: 0,
      margin: '20px 0',
      textAlign: 'left'
    },
    planFeature: {
      padding: '10px 0',
      borderBottom: '1px solid #eee',
      color: '#666'
    },

    // Steps section
    stepsSection: {
      width: '100%',
      background: 'rgba(255,255,255,0.95)',
      padding: '80px 40px',
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

    // FAQ section
    faqSection: {
      background: 'rgba(255,255,255,0.95)',
      padding: '80px 40px',
      marginBottom: '60px'
    },
    faqTitle: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '50px'
    },
    faqContainer: {
      maxWidth: '800px',
      margin: '0 auto'
    },
    faqItem: {
      background: 'white',
      marginBottom: '20px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    faqQuestion: {
      padding: '25px',
      cursor: 'pointer',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      background: 'linear-gradient(90deg, #f8f9fa, #e9ecef)',
      transition: 'all 0.3s ease'
    },
    faqAnswer: {
      padding: '25px',
      color: '#666',
      lineHeight: 1.6,
      borderTop: '1px solid #eee'
    },

    // CTA section
    ctaSection: {
      width: '100%',
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
      padding: '80px 40px',
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

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;

  const features = [
    'Theo dõi tỷ giá giữa hơn 160 loại tiền tệ theo thời gian thực.',
    'Nhập liệu tỷ giá từ nguồn riêng hoặc thủ công.',
    'Xuất dữ liệu tỷ giá ra CSV để lưu trữ, báo cáo hoặc tích hợp hệ thống khác.',
    'Hiển thị biểu đồ tỷ giá cùng các chỉ báo kỹ thuật như SMA, EMA, RSI.',
    'Nhận cảnh báo khi tỷ giá đạt đến ngưỡng mong muốn.',
    'Giao tiếp real-time nhờ tích hợp WebSocket.',
    'API mạnh mẽ cho tích hợp với hệ thống của bạn.',
    'Bảo mật cao với mã hóa end-to-end.'
  ];

  const targetAudience = [
    'Doanh nghiệp cần cập nhật và lưu trữ tỷ giá trong hệ thống nội bộ.',
    'Nhà đầu tư cá nhân muốn phân tích thị trường ngoại hối.',
    'Tổ chức tài chính muốn khai thác dữ liệu tỷ giá lịch sử.',
    'Lập trình viên xây dựng hệ thống fintech với dữ liệu tỷ giá.',
    'Ngân hàng và các tổ chức tín dụng.',
    'Công ty xuất nhập khẩu cần theo dõi biến động tỷ giá.',
    'Quỹ đầu tư và hedge fund.',
    'Startups fintech và các ứng dụng thanh toán.'
  ];

  const technologies = [
    {
      icon: '⚛️',
      name: 'React.js',
      description: 'Giao diện người dùng hiện đại và tương tác cao'
    },
    {
      icon: '🟢',
      name: 'Node.js',
      description: 'Backend mạnh mẽ với hiệu suất cao'
    },
    {
      icon: '🍃',
      name: 'MongoDB',
      description: 'Cơ sở dữ liệu NoSQL linh hoạt và scalable'
    },
    {
      icon: '🔌',
      name: 'WebSocket',
      description: 'Cập nhật dữ liệu real-time không delay'
    },
    {
      icon: '📊',
      name: 'Chart.js',
      description: 'Biểu đồ tương tác và trực quan'
    },
    {
      icon: '🔒',
      name: 'JWT Security',
      description: 'Bảo mật cao với token authentication'
    },
    {
      icon: '☁️',
      name: 'AWS Cloud',
      description: 'Hosting và scaling trên cloud hàng đầu'
    },
    {
      icon: '🚀',
      name: 'Docker',
      description: 'Containerization cho deployment dễ dàng'
    }
  ];

  const testimonials = [
    {
      text: "FX Rate Dashboard đã thay đổi hoàn toàn cách chúng tôi quản lý rủi ro tỷ giá. Interface trực quan và dữ liệu real-time giúp chúng tôi đưa ra quyết định nhanh chóng và chính xác.",
      author: "Nguyễn Văn Minh",
      role: "CFO - Công ty TNHH ABC Import-Export",
      avatar: "M"
    },
    {
      text: "Là một trader chuyên nghiệp, tôi đã thử rất nhiều platform khác nhau. FX Rate Dashboard nổi bật với độ chính xác cao và các công cụ phân tích kỹ thuật mạnh mẽ.",
      author: "Trần Thị Linh",
      role: "Senior Forex Trader - VietCapital",
      avatar: "L"
    },
    {
      text: "API của FX Rate Dashboard rất dễ tích hợp và documentation chi tiết. Chúng tôi đã tích hợp thành công vào hệ thống ERP chỉ trong 2 tuần.",
      author: "Lê Hoàng Nam",
      role: "Lead Developer - TechViet Solutions",
      avatar: "N"
    },
    {
      text: "Dashboard này giúp chúng tôi tiết kiệm hàng giờ mỗi ngày trong việc thu thập và phân tích dữ liệu tỷ giá. ROI rất ấn tượng!",
      author: "Phạm Thu Hằng",
      role: "Head of Finance - Global Trade Corp",
      avatar: "H"
    }
  ];

  const steps = [
    { title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản miễn phí chỉ trong 2 phút với email.' },
    { title: 'Tùy chỉnh dashboard', desc: 'Thiết lập các cặp tiền tệ và chỉ báo theo nhu cầu.' },
    { title: 'Nhập dữ liệu & theo dõi', desc: 'Import dữ liệu hoặc sử dụng feed real-time của chúng tôi.' },
    { title: 'Phân tích & xuất báo cáo', desc: 'Sử dụng công cụ phân tích và xuất báo cáo chuyên nghiệp.' }
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Miễn phí',
      features: [
        'Theo dõi 10 cặp tiền tệ',
        'Dữ liệu delayed 15 phút',
        'Biểu đồ cơ bản',
        'Xuất CSV giới hạn',
        'Email support'
      ]
    },
    {
      name: 'Professional (To be continue)',
      price: '$29/tháng',
      features: [
        'Theo dõi không giới hạn',
        'Dữ liệu real-time',
        'Tất cả biểu đồ & chỉ báo',
        'API access',
        'Priority support',
        'Custom alerts'
      ]
    },
    {
      name: 'Enterprise (To be continue)',
      price: 'Liên hệ',
      features: [
        'Tất cả tính năng Pro',
        'White-label solution',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Training & consulting'
      ]
    }
  ];

  const faqs = [
    {
      question: 'Dữ liệu tỷ giá được cập nhật bao lâu một lần?',
      answer: 'Với gói Professional và Enterprise, dữ liệu được cập nhật real-time. Gói miễn phí có độ trễ 15 phút.'
    },
    {
      question: 'Tôi có thể tích hợp với hệ thống hiện tại không?',
      answer: 'Có, chúng tôi cung cấp RESTful API và WebSocket API để tích hợp dễ dàng với bất kỳ hệ thống nào.'
    },
    {
      question: 'Có hỗ trợ tiếng Việt không?',
      answer: 'Có, platform hỗ trợ đầy đủ tiếng Việt và có đội ngũ support tiếng Việt.'
    },
    {
      question: 'Dữ liệu được bảo mật như thế nào?',
      answer: 'Chúng tôi sử dụng mã hóa SSL 256-bit, JWT authentication và tuân thủ các chuẩn bảo mật quốc tế.'
    },
    {
      question: 'Có thể hủy gói trả phí bất cứ lúc nào không?',
      answer: 'Có, bạn có thể hủy bất cứ lúc nào mà không mất phí. Dữ liệu của bạn sẽ được bảo toàn.'
    }
  ];

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.pageContainer}>
        {/* Background shapes */}
        <div style={{...styles.backgroundShape, ...styles.shape1}}></div>
        <div style={{...styles.backgroundShape, ...styles.shape2}}></div>
        <div style={{...styles.backgroundShape, ...styles.shape3}}></div>

        {/* Main Content */}
        <main style={styles.mainContent}>
          {/* Hero Section */}
          <section style={styles.heroSection}>
            <h1 style={styles.heroTitle}> 
              <span style={styles.heroIcon}>💱</span>
              FX Rate Dashboard
            </h1>
            <p style={styles.heroSubtitle}>
              <strong>Nền tảng tỷ giá tiền tệ thông minh nhất Việt Nam</strong><br/>
              Theo dõi, phân tích và quản lý tỷ giá với độ chính xác cao và tính năng real-time mạnh mẽ
            </p>
            <div style={styles.heroButtons}>
              <a href="/register" style={styles.primaryButton}>
                🚀 Dùng thử miễn phí
              </a>
              <a href="#demo" style={styles.secondaryButton}>
                📺 Xem demo
              </a>
            </div>
          </section>

          {/* Statistics Section */}
          <section style={styles.statsSection}>
            <h2 style={{fontSize: '2.5rem', color: '#2c3e50', marginBottom: '50px'}}>
              📊 Được tin tưởng bởi hàng nghìn doanh nghiệp
            </h2>
            <div style={styles.statsGrid}>
              <div style={{...styles.statCard, ...(hoveredItem === 'stat-users' ? {transform: 'translateY(-10px)', animation: 'pulse 1s infinite'} : {})}}
                   onMouseEnter={() => setHoveredItem('stat-users')}
                   onMouseLeave={() => setHoveredItem(null)}>
                <span style={styles.statNumber}>{counters.users.toLocaleString()}+</span>
                <span style={styles.statLabel}>Người dùng hoạt động</span>
              </div>
              <div style={{...styles.statCard, ...(hoveredItem === 'stat-transactions' ? {transform: 'translateY(-10px)', animation: 'pulse 1s infinite'} : {})}}
                   onMouseEnter={() => setHoveredItem('stat-transactions')}
                   onMouseLeave={() => setHoveredItem(null)}>
                <span style={styles.statNumber}>{counters.transactions.toLocaleString()}+</span>
                <span style={styles.statLabel}>Giao dịch xử lý</span>
              </div>
              <div style={{...styles.statCard, ...(hoveredItem === 'stat-currencies' ? {transform: 'translateY(-10px)', animation: 'pulse 1s infinite'} : {})}}
                   onMouseEnter={() => setHoveredItem('stat-currencies')}
                   onMouseLeave={() => setHoveredItem(null)}>
                <span style={styles.statNumber}>{counters.currencies}+</span>
                <span style={styles.statLabel}>Loại tiền tệ</span>
              </div>
              <div style={{...styles.statCard, ...(hoveredItem === 'stat-countries' ? {transform: 'translateY(-10px)', animation: 'pulse 1s infinite'} : {})}}
                   onMouseEnter={() => setHoveredItem('stat-countries')}
                   onMouseLeave={() => setHoveredItem(null)}>
                <span style={styles.statNumber}>{counters.countries}+</span>
                <span style={styles.statLabel}>Quốc gia hỗ trợ</span>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section style={styles.techSection}>
            <h2 style={styles.techTitle}>🛠️ Công nghệ hiện đại</h2>
            <p style={styles.techSubtitle}>
              Được xây dựng với các công nghệ tiên tiến nhất để đảm bảo hiệu suất và độ tin cậy cao
            </p>
            <div style={styles.techGrid}>
              {technologies.map((tech, index) => (
                <div 
                  key={index}
                  style={{
                    ...styles.techCard,
                    ...(hoveredItem === `tech-${index}` ? {
                      transform: 'translateY(-5px) scale(1.05)',
                      background: 'rgba(255,255,255,0.2)'
                    } : {})
                  }}
                  onMouseEnter={() => setHoveredItem(`tech-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span style={styles.techIcon}>{tech.icon}</span>
                  <div style={styles.techName}>{tech.name}</div>
                  <div style={styles.techDesc}>{tech.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Grid */}
          <div style={styles.featuresGrid}>
            {/* Why Choose Section */}
            <div 
              style={{
                ...styles.featureCard,
                ...(hoveredItem === 'feature-card' ? {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
                } : {})
              }}
              onMouseEnter={() => setHoveredItem('feature-card')}
              onMouseLeave={() => setHoveredItem(null)}
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
              style={{
                ...styles.featureCard,
                ...(hoveredItem === 'audience-card' ? {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
                } : {})
              }}
              onMouseEnter={() => setHoveredItem('audience-card')}
              onMouseLeave={() => setHoveredItem(null)}
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

          {/* Testimonials Section */}
          <section style={styles.testimonialsSection}>
            <h2 style={styles.testimonialsTitle}>💬 Khách hàng nói gì về chúng tôi</h2>
            <div style={styles.testimonialCard}>
              <div style={styles.testimonialText}>
                "{testimonials[currentTestimonial].text}"
              </div>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div style={styles.authorInfo}>
                  <div style={styles.authorName}>{testimonials[currentTestimonial].author}</div>
                  <div style={styles.authorRole}>{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px'}}>
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: index === currentTestimonial ? '#667eea' : '#ddd',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section style={styles.pricingSection}>
            <h2 style={styles.pricingTitle}>💰 Gói dịch vụ linh hoạt</h2>
            <p style={styles.pricingSubtitle}>
              Chọn gói phù hợp với nhu cầu và quy mô của bạn
            </p>
            <div style={styles.pricingGrid}>
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  style={{
                    ...styles.pricingCard,
                    ...(index === 1 ? {
                      transform: 'scale(1.05)',
                      border: '3px solid #667eea',
                      position: 'relative'
                    } : {}),
                    ...(hoveredItem === `plan-${index}` ? {
                      transform: index === 1 ? 'scale(1.1)' : 'translateY(-10px)',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
                    } : {})
                  }}
                  onMouseEnter={() => setHoveredItem(`plan-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {index === 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      🔥 Phổ biến nhất
                    </div>
                  )}
                  <div style={styles.planName}>{plan.name}</div>
                  <div style={styles.planPrice}>{plan.price}</div>
                  <ul style={styles.planFeatures}>
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} style={styles.planFeature}>
                        ✅ {feature}
                      </li>
                    ))}
                  </ul>
                  <button style={{
                    ...styles.primaryButton,
                    width: '100%',
                    marginTop: '20px',
                    background: index === 1 ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
                  }}>
                    {index === 2 ? 'Liên hệ' : 'Bắt đầu ngay'}
                  </button>
                </div>
              ))}
            </div>
          </section>

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

          {/* FAQ Section */}
          <section style={styles.faqSection}>
          <h2 style={styles.faqTitle}>❓ Câu hỏi thường gặp</h2>
            <div style={styles.faqContainer}>
              {faqs.map((faq, index) => (
                <div key={index} style={styles.faqItem}>
                  <div 
                    style={{
                      ...styles.faqQuestion,
                      ...(hoveredItem === `faq-${index}` ? {
                        background: 'linear-gradient(90deg, #667eea, #764ba2)',
                        color: 'white'
                      } : {})
                    }}
                    onMouseEnter={() => setHoveredItem(`faq-${index}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {faq.question}
                  </div>
                  <div style={styles.faqAnswer}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section style={styles.ctaSection}>
            <h2 style={styles.ctaTitle}>🎯 Sẵn sàng trải nghiệm?</h2>
            <p style={styles.ctaSubtitle}>
              Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng FX Rate Dashboard!<br/>
              Đăng ký ngay để nhận 30 ngày dùng thử miễn phí gói Professional.
            </p>
            <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
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
                🚀 Đăng ký miễn phí
              </a>
              <a 
                href="/contact" 
                style={{
                  ...styles.ctaButton,
                  background: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  ...(hoveredItem === 'contact-button' ? {
                    transform: 'translateY(-3px)',
                    background: 'white',
                    color: '#2c3e50'
                  } : {})
                }}
                onMouseEnter={() => setHoveredItem('contact-button')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                📞 Liên hệ tư vấn
              </a>
            </div>
            
            {/* Additional CTA Info */}
            <div style={{
              marginTop: '40px',
              padding: '30px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)'
            }}>
             
            </div>
          </section>
        </main>
      </div>
    </>
  );
}; 

export default Home