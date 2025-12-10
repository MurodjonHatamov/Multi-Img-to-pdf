import React, { useState, useEffect } from 'react';
import { 
  IoPersonOutline, 
  IoPerson, 
  IoAdd, 
  IoDocumentTextOutline,
  IoDocumentText
} from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TabBar.module.css';

function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // URL bo'yicha faol tabni aniqlash
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/' || path === '/profile') {
      setActiveTab('profile');
    } else if (path === '/documents' || path.includes('/documents')) {
      setActiveTab('documents');
    } else {
      setActiveTab(''); // Boshqa sahifalarda hech qaysi tab faol emas
    }
  }, [location.pathname]);

  const tabs = [
    {
      id: 'profile',
      label: 'Profil',
      link: '/',
      icon: activeTab === 'profile' ? <IoPerson /> : <IoPersonOutline />,
    },
    {
      id: 'documents',
      label: 'Hujjatlarim',
      link: '/documents',
      icon: activeTab === 'documents' ? <IoDocumentText /> : <IoDocumentTextOutline />,
    }
  ];

  const handleTabClick = (tabId, link) => {
    setActiveTab(tabId);
    navigate(link);
  };

  const handleAddClick = () => {
    navigate('/adddocuments');
  };

  return (
    <div className={styles.tabBar}>
      <div className={styles.tabItemsContainer}>
        {tabs.map((tab, index) => (
          <div 
            key={tab.id}
            className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.id, tab.link)}
            style={{ 
              marginRight: index === 0 ? 'auto' : '0',
              marginLeft: index === 1 ? 'auto' : '0'
            }}
          >
            <div className={styles.activeIndicator}></div>
            <div className={styles.tabIcon}>{tab.icon}</div>
            <span className={styles.tabLabel}>{tab.label}</span>
          </div>
        ))}
        
        {/* Plus button in the middle */}
        <div 
          className={styles.plusButton}
          onClick={handleAddClick}
          title="Yangi fayl qo'shish"
        >
          <IoAdd className={styles.plusIcon} />
        </div>
      </div>
    </div>
  );
}

export default TabBar;