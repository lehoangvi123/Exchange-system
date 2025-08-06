import React, { useState, useEffect } from 'react';
// import  CurrencyConverter  from './CurrencyConverterHome'
// import Home, { CurrencyConverter } from './Home';
import { useTheme } from '../contexts/themeContexts';
import ThemeToggle from '../components/ThemeToggle';
import { CurrencyConverter } from './CurrencyConverterHome';

// Currency Converter Component
import '../css/Home.css'
const Home = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [counters, setCounters] = useState({
    users: 0,
    transactions: 0,
    currencies: 0,
    countries: 0
  }); 

  // code of converter 
  const [exchangeRates, setExchangeRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
 
  // Get theme from context
  const { isDark } = useTheme();
 
  // Popular currencies for quick access
  
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
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

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          setExchangeRates(data.rates);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchExchangeRates();

    // Then fetch every 60 seconds (API updates once per day, but we check more frequently)
    const ratesInterval = setInterval(fetchExchangeRates, 60000);

    return () => clearInterval(ratesInterval);
  }, []);

  // Helper function to calculate rate changes (mock data since API doesn't provide change)
  const getRateChange = (currentRate, currency) => {
    // Mock rate changes for demonstration - in real app, you'd store previous rates
    const mockChanges = {
      EUR: 0.0023,
      GBP: -0.0089,
      JPY: 1.45,
      VND: 15,
      CNY: -0.0234,
      AUD: 0.0056
    };
    
    const change = mockChanges[currency] || (Math.random() - 0.5) * 0.02;
    const percentage = ((change / currentRate) * 100).toFixed(2);
    return {
      change: change.toFixed(currency === 'JPY' || currency === 'VND' ? 0 : 4),
      percentage: percentage,
      isPositive: change >= 0
    };
  };

  // Format currency value
  const formatCurrency = (value, currency) => {
    if (!value) return 'Loading...';
    
    if (currency === 'JPY') {
      return value.toFixed(2);
    } else if (currency === 'VND') {
      return (value * 1000).toLocaleString();
    } else {
      return value.toFixed(4);
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      width: '100%',
      background: isDark 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      margin: 0,
      padding: 0,
      transition: 'all 0.3s ease'
    },

    // Theme Toggle Position
    themeToggleContainer: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderRadius: '50px',
      padding: '10px',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
      transition: 'all 0.3s ease'
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
      background: isDark 
        ? 'rgba(255,255,255,0.05)' 
        : 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(15px)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    heroTitle: {
      fontSize: 'clamp(3rem, 6vw, 5rem)',
      color: isDark ? '#ffffff' : 'white',
      fontWeight: 'bold',
      marginBottom: '30px',
      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      transition: 'all 0.3s ease'
    },
    heroIcon: {
      fontSize: '4rem',
      // animation: 'rotate 3s linear infinite'
    },
    heroSubtitle: {
      fontSize: '1.4rem',
      color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)',
      lineHeight: 1.6,
      maxWidth: '800px',
      margin: '0 auto 40px',
      transition: 'all 0.3s ease'
    },
    heroButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '40px'
    },
    primaryButton: {
      background: isDark 
        ? 'linear-gradient(45deg, #e74c3c, #3498db)'
        : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
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
      color: isDark ? '#ffffff' : 'white',
      border: `2px solid ${isDark ? '#ffffff' : 'white'}`,
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
      background: isDark 
        ? 'rgba(30,30,30,0.95)' 
        : 'rgba(255,255,255,0.95)',
      padding: '60px 40px',
      marginBottom: '60px',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    statCard: {
      background: isDark 
        ? 'linear-gradient(135deg, #2c3e50, #34495e)'
        : 'linear-gradient(135deg, #667eea, #764ba2)',
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
      background: isDark 
        ? 'rgba(30,30,30,0.95)' 
        : 'rgba(255,255,255,0.95)',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: isDark 
        ? '0 20px 40px rgba(0,0,0,0.3)'
        : '0 20px 40px rgba(0,0,0,0.1)',
      transition: 'all 0.4s ease',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
      position: 'relative',
      overflow: 'hidden'
    },
    featureTitle: {
      fontSize: '2rem',
      color: isDark ? '#ffffff' : '#2c3e50',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      transition: 'all 0.3s ease'
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
      background: isDark 
        ? 'linear-gradient(90deg, #2c3e50, #34495e)'
        : 'linear-gradient(90deg, #f8f9fa, #e9ecef)',
      margin: '15px 0',
      padding: '18px 25px',
      borderRadius: '12px',
      borderLeft: `4px solid ${isDark ? '#3498db' : '#4ecdc4'}`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      fontSize: '1rem',
      lineHeight: 1.5,
      color: isDark ? '#ffffff' : '#2c3e50'
    },

    // Technology section
    techSection: {
      background: isDark 
        ? 'rgba(10,10,10,0.9)' 
        : 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '80px 40px',
      marginBottom: '60px',
      textAlign: 'center',
      transition: 'all 0.3s ease'
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
      background: isDark 
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      padding: '30px',
      borderRadius: '15px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
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

    // Exchange rates section
    exchangeRatesSection: {
      background: isDark 
        ? 'rgba(30,30,30,0.95)' 
        : 'rgba(255,255,255,0.95)',
      padding: '80px 40px',
      marginBottom: '60px',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    exchangeRatesTitle: {
      fontSize: '2.5rem',
      color: isDark ? '#ffffff' : '#2c3e50',
      marginBottom: '15px',
      transition: 'all 0.3s ease'
    },
    exchangeRatesSubtitle: {
      fontSize: '1.1rem',
      color: isDark ? 'rgba(255,255,255,0.7)' : '#666',
      marginBottom: '50px',
      opacity: 0.8,
      transition: 'all 0.3s ease'
    },
    ratesGrid: {
      display: 'grid',
      gap: '40px',
      maxWidth: '1400px',
      margin: '0 auto 50px'
    },
    rateCategory: {
      marginBottom: '40px'
    },
    categoryTitle: {
      fontSize: '1.5rem',
      color: isDark ? '#ffffff' : '#2c3e50',
      marginBottom: '20px',
      textAlign: 'left',
      fontWeight: 'bold',
      transition: 'all 0.3s ease'
    },
    rateCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    rateCard: {
      background: isDark ? '#2c3e50' : 'white',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: isDark 
        ? '0 5px 15px rgba(0,0,0,0.3)'
        : '0 5px 15px rgba(0,0,0,0.1)',
      border: `1px solid ${isDark ? '#34495e' : '#e5e7eb'}`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },
    rateCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: isDark 
        ? '0 15px 35px rgba(0,0,0,0.4)'
        : '0 15px 35px rgba(0,0,0,0.15)',
      borderColor: isDark ? '#3498db' : '#667eea'
    },
    currencyPair: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '15px'
    },
    currencyFlag: {
      fontSize: '1.5rem'
    },
    currencyCode: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#2c3e50',
      transition: 'all 0.3s ease'
    },
    rateValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#1f2937',
      marginBottom: '8px',
      transition: 'all 0.3s ease'
    },
    rateChange: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#10b981',
      padding: '4px 8px',
      borderRadius: '12px',
      background: 'rgba(16, 185, 129, 0.1)'
    },
    marketStatus: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '40px',
      maxWidth: '1000px',
      margin: '40px auto'
    },
    statusItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '20px',
      background: isDark ? '#2c3e50' : 'white',
      borderRadius: '12px',
      boxShadow: isDark 
        ? '0 3px 10px rgba(0,0,0,0.3)'
        : '0 3px 10px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    statusIcon: {
      fontSize: '1.2rem'
    },
    statusText: {
      fontSize: '1rem',
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#2c3e50',
      flex: 1,
      transition: 'all 0.3s ease'
    },
    statusTime: {
      fontSize: '0.9rem',
      color: isDark ? 'rgba(255,255,255,0.7)' : '#666',
      opacity: 0.8,
      transition: 'all 0.3s ease'
    },
    ratesFooter: {
      textAlign: 'center',
      marginTop: '40px'
    },
    disclaimerText: {
      fontSize: '0.9rem',
      color: isDark ? 'rgba(255,255,255,0.7)' : '#666',
      lineHeight: 1.6,
      marginBottom: '25px',
      opacity: 0.8,
      transition: 'all 0.3s ease'
    },
    viewAllRatesBtn: {
      background: isDark 
        ? 'linear-gradient(45deg, #e74c3c, #3498db)'
        : 'linear-gradient(45deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: isDark 
        ? '0 10px 25px rgba(231, 76, 60, 0.3)'
        : '0 10px 25px rgba(102, 126, 234, 0.3)'
    },

    // Loading styles
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      minHeight: '200px'
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: `4px solid ${isDark ? '#34495e' : '#f3f4f6'}`,
      borderTop: `4px solid ${isDark ? '#3498db' : '#667eea'}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    },
    loadingText: {
      fontSize: '1.1rem',
      color: isDark ? 'rgba(255,255,255,0.7)' : '#666',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },

    // Pricing section
    pricingSection: {
      padding: '80px 40px',
      marginBottom: '60px',
      textAlign: 'center',
      background: isDark 
        ? 'rgba(255,255,255,0.05)' 
        : 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    },
    pricingTitle: {
      fontSize: '2.5rem',
      color: isDark ? '#ffffff' : 'white',
      marginBottom: '20px',
      transition: 'all 0.3s ease'
    },
    pricingSubtitle: {
      fontSize: '1.2rem',
      color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.8)',
      marginBottom: '50px',
      transition: 'all 0.3s ease'
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    pricingCard: {
      background: isDark ? '#2c3e50' : 'white',
      padding: '40px 30px',
      borderRadius: '20px',
      boxShadow: isDark 
        ? '0 20px 40px rgba(0,0,0,0.3)'
        : '0 20px 40px rgba(0,0,0,0.1)',
      position: 'relative',
      transition: 'all 0.3s ease'
    },
    planName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#2c3e50',
      marginBottom: '10px',
      transition: 'all 0.3s ease'
    },
    planPrice: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: isDark ? '#3498db' : '#667eea',
      marginBottom: '20px',
      transition: 'all 0.3s ease'
    },
    planFeatures: {
      listStyle: 'none',
      padding: 0,
      margin: '20px 0',
      textAlign: 'left'
    },
    planFeature: {
      padding: '10px 0',
      borderBottom: `1px solid ${isDark ? '#34495e' : '#eee'}`,
      color: isDark ? 'rgba(255,255,255,0.8)' : '#666',
      transition: 'all 0.3s ease'
    },

    // Steps section
    stepsSection: {
      width: '100%',
      background: isDark 
        ? 'rgba(30,30,30,0.95)' 
        : 'rgba(255,255,255,0.95)',
      padding: '80px 40px',
      marginBottom: '60px',
      boxShadow: isDark 
        ? '0 25px 50px rgba(0,0,0,0.3)'
        : '0 25px 50px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    stepsTitle: {
      fontSize: '2.5rem',
      color: isDark ? '#ffffff' : '#2c3e50',
      textAlign: 'center',
      marginBottom: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      transition: 'all 0.3s ease'
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px'
    },
    stepCard: {
      background: isDark 
        ? 'linear-gradient(135deg, #2c3e50, #34495e)'
        : 'linear-gradient(135deg, #667eea, #764ba2)',
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
      background: isDark 
        ? 'linear-gradient(45deg, #e74c3c, #3498db)'
        : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
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
      background: isDark 
        ? 'rgba(30,30,30,0.95)' 
        : 'rgba(255,255,255,0.95)',
      padding: '80px 40px',
      marginBottom: '60px',
      transition: 'all 0.3s ease'
    },
    faqTitle: {
      fontSize: '2.5rem',
      color: isDark ? '#ffffff' : '#2c3e50',
      textAlign: 'center',
      marginBottom: '50px',
      transition: 'all 0.3s ease'
    },
    faqContainer: {
      maxWidth: '800px',
      margin: '0 auto'
    },
    faqItem: {
      background: isDark ? '#2c3e50' : 'white',
      marginBottom: '20px',
      borderRadius: '15px',
      boxShadow: isDark 
        ? '0 5px 15px rgba(0,0,0,0.3)'
        : '0 5px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    faqQuestion: {
      padding: '25px',
      cursor: 'pointer',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#2c3e50',
      background: isDark 
        ? 'linear-gradient(90deg, #34495e, #2c3e50)'
        : 'linear-gradient(90deg, #f8f9fa, #e9ecef)',
      transition: 'all 0.3s ease'
    },
    faqAnswer: {
      padding: '25px',
      color: isDark ? 'rgba(255,255,255,0.8)' : '#666',
      lineHeight: 1.6,
      borderTop: `1px solid ${isDark ? '#34495e' : '#eee'}`,
      transition: 'all 0.3s ease'
    },

    // CTA section
    ctaSection: {
      width: '100%',
      background: isDark 
        ? 'linear-gradient(135deg, #e74c3c, #3498db)'
        : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
      padding: '80px 40px',
      textAlign: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
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
      background: isDark 
        ? 'linear-gradient(45deg, rgba(231,76,60,0.1), rgba(52,152,219,0.1))'
        : 'linear-gradient(45deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1))',
      animation: 'float 8s ease-in-out infinite',
      transition: 'all 0.3s ease'
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

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
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
      name: 'Professional (to be countinue...)',
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
      name: 'Enterprise (to be countinue...)',
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
              <a href="/rates" style={styles.primaryButton}>
                🚀 Theo dõi tỷ giá
              </a>
              
            </div> 
          </section>

          {/* Lồng đoạn quy đổi tiền tệ vô trong đây*/}
         {/* Currency converter add in this blank */}
        <section style={styles.converterSection}>
          <div className="Section_converter">
          <CurrencyConverter /> 
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
                      background: isDark 
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(255,255,255,0.2)'
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
                  boxShadow: isDark 
                    ? '0 30px 60px rgba(0,0,0,0.4)'
                    : '0 30px 60px rgba(0,0,0,0.2)'
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
                        borderLeftColor: isDark ? '#3498db' : '#ff6b6b',
                        boxShadow: isDark 
                          ? '0 5px 15px rgba(0,0,0,0.3)'
                          : '0 5px 15px rgba(0,0,0,0.1)'
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
                  boxShadow: isDark 
                    ? '0 30px 60px rgba(0,0,0,0.4)'
                    : '0 30px 60px rgba(0,0,0,0.2)'
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
                        borderLeftColor: isDark ? '#3498db' : '#ff6b6b',
                        boxShadow: isDark 
                          ? '0 5px 15px rgba(0,0,0,0.3)'
                          : '0 5px 15px rgba(0,0,0,0.1)'
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

          {/* Live Exchange Rates Section */}
          <section style={styles.exchangeRatesSection}>
            <h2 style={styles.exchangeRatesTitle}>💱 Tỷ giá thế giới hôm nay</h2>
            <p style={styles.exchangeRatesSubtitle}>
              {lastUpdated ? (
                <>
                  Cập nhật lần cuối: {lastUpdated.toLocaleTimeString('vi-VN')} • 
                  Dữ liệu từ ExchangeRate-API
                </>
              ) : (
                'Đang tải dữ liệu thời gian thực...'
              )}
            </p>
            
            {isLoading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Đang tải tỷ giá thời gian thực...</p>
              </div>
            ) : (
              <div style={styles.ratesGrid}>
                {/* Major Currencies */}
                <div style={styles.rateCategory}>
                  <h3 style={styles.categoryTitle}>🌟 Tiền tệ chính</h3>
                  <div style={styles.rateCards}>
                    <div style={{...styles.rateCard, ...(hoveredItem === 'rate-eur' ? styles.rateCardHover : {})}}
                         onMouseEnter={() => setHoveredItem('rate-eur')}
                         onMouseLeave={() => setHoveredItem(null)}>
                      <div style={styles.currencyPair}>
                        <span style={styles.currencyFlag}>🇪🇺</span>
                        <span style={styles.currencyCode}>EUR/USD</span>
                      </div>
                      <div style={styles.rateValue}>
                        {exchangeRates ? formatCurrency(exchangeRates.EUR, 'EUR') : 'Loading...'}
                      </div>
                      {exchangeRates && (() => {
                        const change = getRateChange(exchangeRates.EUR, 'EUR');
                        return (
                          <div style={{
                            ...styles.rateChange,
                            color: change.isPositive ? '#10b981' : '#ef4444',
                            background: change.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}>
                            {change.isPositive ? '+' : ''}{change.change} ({change.isPositive ? '+' : ''}{change.percentage}%)
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div style={{...styles.rateCard, ...(hoveredItem === 'rate-gbp' ? styles.rateCardHover : {})}}
                         onMouseEnter={() => setHoveredItem('rate-gbp')}
                         onMouseLeave={() => setHoveredItem(null)}>
                      <div style={styles.currencyPair}>
                        <span style={styles.currencyFlag}>🇬🇧</span>
                        <span style={styles.currencyCode}>GBP/USD</span>
                      </div>
                      <div style={styles.rateValue}>
                        {exchangeRates ? formatCurrency(exchangeRates.GBP, 'GBP') : 'Loading...'}
                      </div>
                      {exchangeRates && (() => {
                        const change = getRateChange(exchangeRates.GBP, 'GBP');
                        return (
                          <div style={{
                            ...styles.rateChange,
                            color: change.isPositive ? '#10b981' : '#ef4444',
                            background: change.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}>
                            {change.isPositive ? '+' : ''}{change.change} ({change.isPositive ? '+' : ''}{change.percentage}%)
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div style={{...styles.rateCard, ...(hoveredItem === 'rate-jpy' ? styles.rateCardHover : {})}}
                         onMouseEnter={() => setHoveredItem('rate-jpy')}
                         onMouseLeave={() => setHoveredItem(null)}>
                      <div style={styles.currencyPair}>
                        <span style={styles.currencyFlag}>🇯🇵</span>
                        <span style={styles.currencyCode}>USD/JPY</span>
                      </div>
                      <div style={styles.rateValue}>
                        {exchangeRates ? formatCurrency(exchangeRates.JPY, 'JPY') : 'Loading...'}
                      </div>
                      {exchangeRates && (() => {
                        const change = getRateChange(exchangeRates.JPY, 'JPY');
                        return (
                          <div style={{
                            ...styles.rateChange,
                            color: change.isPositive ? '#10b981' : '#ef4444',
                            background: change.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}>
                            {change.isPositive ? '+' : ''}{change.change} ({change.isPositive ? '+' : ''}{change.percentage}%)
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Asian Currencies */}
                <div style={styles.rateCategory}>
                  <h3 style={styles.categoryTitle}>🌏 Châu Á - Thái Bình Dương</h3>
                  <div style={styles.rateCards}>
                    <div style={{...styles.rateCard, ...(hoveredItem === 'rate-vnd' ? styles.rateCardHover : {})}}
                         onMouseEnter={() => setHoveredItem('rate-vnd')}
                         onMouseLeave={() => setHoveredItem(null)}>
                      <div style={styles.currencyPair}>
                        <span style={styles.currencyFlag}>🇻🇳</span>
                        <span style={styles.currencyCode}>USD/VND</span>
                      </div>
                      <div style={styles.rateValue}>
                        {exchangeRates ? formatCurrency(exchangeRates.VND, 'VND') : 'Loading...'}
                      </div>
                      {exchangeRates && (() => {
                        const change = getRateChange(exchangeRates.VND, 'VND');
                        return (
                          <div style={{
                            ...styles.rateChange,
                            color: change.isPositive ? '#10b981' : '#ef4444',
                            background: change.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}>
                            {change.isPositive ? '+' : ''}{change.change} ({change.isPositive ? '+' : ''}{change.percentage}%)
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div style={{...styles.rateCard, ...(hoveredItem === 'rate-cny' ? styles.rateCardHover : {})}}
                         onMouseEnter={() => setHoveredItem('rate-cny')}
                         onMouseLeave={() => setHoveredItem(null)}>
                      <div style={styles.currencyPair}>
                        <span style={styles.currencyFlag}>🇨🇳</span>
                        <span style={styles.currencyCode}>USD/CNY</span>
                      </div>
                      <div style={styles.rateValue}>
                        {exchangeRates ? formatCurrency(exchangeRates.CNY, 'CNY') : 'Loading...'}
                      </div>
                      {exchangeRates && (() => {
                        const change = getRateChange(exchangeRates.CNY, 'CNY');
                        return (
                          <div style={{
                            ...styles.rateChange,
                            color: change.isPositive ? '#10b981' : '#ef4444',
                            background: change.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}>
                            {change.isPositive ? '+' : ''}{change.change} ({change.isPositive ? '+' : ''}{change.percentage}%)
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div style={{...styles.rateCard, ...(hoveredItem === 'rate-aud' ? styles.rateCardHover : {})}}
                         onMouseEnter={() => setHoveredItem('rate-aud')}
                         onMouseLeave={() => setHoveredItem(null)}>
                      <div style={styles.currencyPair}>
                        <span style={styles.currencyFlag}>🇦🇺</span>
                        <span style={styles.currencyCode}>AUD/USD</span>
                      </div>
                      <div style={styles.rateValue}>
                        {exchangeRates ? formatCurrency(exchangeRates.AUD, 'AUD') : 'Loading...'}
                      </div>
                      {exchangeRates && (() => {
                        const change = getRateChange(exchangeRates.AUD, 'AUD');
                        return (
                          <div style={{
                            ...styles.rateChange,
                            color: change.isPositive ? '#10b981' : '#ef4444',
                            background: change.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}>
                            {change.isPositive ? '+' : ''}{change.change} ({change.isPositive ? '+' : ''}{change.percentage}%)
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Commodities & Popular */}
                <div style={styles.rateCategory}>
                  <h3 style={styles.categoryTitle}>💎 Tiền tệ phổ biến khác</h3>
                  <div style={styles.rateCards}>
                    <div style={{...styles.rateCard, ...(hoveredItem === 'rate-cad' ? styles.rateCardHover : {})}}
                         onMouseEnter={() => setHoveredItem('rate-cad')}
                         onMouseLeave={() => setHoveredItem(null)}>
                      <div style={styles.currencyPair}>
                        <span style={styles.currencyFlag}>🇨🇦</span>
                        <span style={styles.currencyCode}>CAD/USD</span>
                      </div>
                      <div style={styles.rateValue}>
                        {exchangeRates ? formatCurrency(exchangeRates.CAD, 'CAD') : 'Loading...'}
                      </div>
                      {exchangeRates && (() => {
                        const change = getRateChange(exchangeRates.CAD, 'CAD');
                        return (
                          <div style={{
                            ...styles.rateChange,
                            color: change.isPositive ? '#10b981' : '#ef4444',
                            background: change.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}>
                            {change.isPositive ? '+' : ''}{change.change} ({change.isPositive ? '+' : ''}{change.percentage}%)
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div style={{...styles.rateCard, ...(hoveredItem === 'rate-chf' ? styles.rateCardHover : {})}}
                         onMouseEnter={() => setHoveredItem('rate-chf')}
                         onMouseLeave={() => setHoveredItem(null)}>
                      <div style={styles.currencyPair}>
                        <span style={styles.currencyFlag}>🇨🇭</span>
                        <span style={styles.currencyCode}>CHF/USD</span>
                      </div>
                      <div style={styles.rateValue}>
                        {exchangeRates ? formatCurrency(exchangeRates.CHF, 'CHF') : 'Loading...'}
                      </div>
                      {exchangeRates && (() => {
                        const change = getRateChange(exchangeRates.CHF, 'CHF');
                        return (
                          <div style={{
                            ...styles.rateChange,
                            color: change.isPositive ? '#10b981' : '#ef4444',
                            background: change.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}>
                            {change.isPositive ? '+' : ''}{change.change} ({change.isPositive ? '+' : ''}{change.percentage}%)
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div style={{...styles.rateCard, ...(hoveredItem === 'rate-sgd' ? styles.rateCardHover : {})}}
                         onMouseEnter={() => setHoveredItem('rate-sgd')}
                         onMouseLeave={() => setHoveredItem(null)}>
                      <div style={styles.currencyPair}>
                        <span style={styles.currencyFlag}>🇸🇬</span>
                        <span style={styles.currencyCode}>SGD/USD</span>
                      </div>
                      <div style={styles.rateValue}>
                        {exchangeRates ? formatCurrency(exchangeRates.SGD, 'SGD') : 'Loading...'}
                      </div>
                      {exchangeRates && (() => {
                        const change = getRateChange(exchangeRates.SGD, 'SGD');
                        return (
                          <div style={{
                            ...styles.rateChange,
                            color: change.isPositive ? '#10b981' : '#ef4444',
                            background: change.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                          }}>
                            {change.isPositive ? '+' : ''}{change.change} ({change.isPositive ? '+' : ''}{change.percentage}%)
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Market Status */}
            <div style={styles.marketStatus}>
              <div style={styles.statusItem}>
                <span style={styles.statusIcon}>🟢</span>
                <span style={styles.statusText}>API Status: Hoạt động</span>
                <span style={styles.statusTime}>Cập nhật mỗi 15 phút (bản free)</span>
              </div>
              <div style={styles.statusItem}>
                <span style={styles.statusIcon}>📡</span>
                <span style={styles.statusText}>Nguồn dữ liệu: ExchangeRate-API</span>
                <span style={styles.statusTime}>Miễn phí & đáng tin cậy</span>
              </div>
              <div style={styles.statusItem}>
                <span style={styles.statusIcon}>⏰</span>
                <span style={styles.statusText}>Cập nhật API: Hàng ngày</span>
                <span style={styles.statusTime}>Dữ liệu từ ngân hàng trung ương</span>
              </div>
            </div>

            <div style={styles.ratesFooter}>
              <p style={styles.disclaimerText}>
                📊 Dữ liệu từ ExchangeRate-API • Cập nhật tự động mỗi 60 giây<br/>
                ⚠️ Tỷ giá chỉ mang tính chất tham khảo, không dùng cho giao dịch thực
              </p>
              <button 
                style={styles.viewAllRatesBtn}
                onClick={() => window.open('/rates', '_blank')}
              >
                🔍 Xem tất cả {exchangeRates ? Object.keys(exchangeRates).length : '160+'} tỷ giá
              </button>
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
                      border: `3px solid ${isDark ? '#3498db' : '#667eea'}`,
                      position: 'relative'
                    } : {}),
                    ...(hoveredItem === `plan-${index}` ? {
                      transform: index === 1 ? 'scale(1.1)' : 'translateY(-10px)',
                      boxShadow: isDark 
                        ? '0 30px 60px rgba(0,0,0,0.4)'
                        : '0 30px 60px rgba(0,0,0,0.2)'
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
                      background: isDark 
                        ? 'linear-gradient(45deg, #e74c3c, #3498db)'
                        : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
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
                    background: index === 1 
                      ? (isDark 
                          ? 'linear-gradient(45deg, #2c3e50, #34495e)' 
                          : 'linear-gradient(45deg, #667eea, #764ba2)')
                      : (isDark 
                          ? 'linear-gradient(45deg, #e74c3c, #3498db)'
                          : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)')
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
                        background: isDark 
                          ? 'linear-gradient(90deg, #2c3e50, #34495e)'
                          : 'linear-gradient(90deg, #667eea, #764ba2)',
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
                href="/" 
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
                🚀 Trải nghiệm ngay
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
              background: isDark 
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{fontSize: '1.1rem', marginBottom: '20px'}}>
                🎁 <strong>Ưu đãi đặc biệt cho khách hàng mới:</strong>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', fontSize: '0.95rem'}}>
                <div>✨ 30 ngày dùng thử Professional miễn phí</div>
                <div>🎯 Setup & training miễn phí</div>
                <div>📧 Email support không giới hạn</div>
                <div>🔄 Hủy bất cứ lúc nào</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}; 


export default Home;
export { CurrencyConverter };