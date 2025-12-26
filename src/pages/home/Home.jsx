import React, { useState, useEffect } from 'react';
import { IoCopyOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import { HiOutlineCheck } from 'react-icons/hi';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Notification from '../../components/notification/Notification';

function Home({ setTheme, theme }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const navigate = useNavigate();

  // FAQ ma'lumotlari
  const faqItems = [
    {
      question: "Hujjatlarim sahifasiga qanday o'tish mumkin?",
      answer: "Hujjatlar soni bo'limidagi 'Hujjatlarga o'tish' tugmasini bosing yoki pastki navigatsiyadan 'Hujjatlarim' bo'limini tanlang."
    },
    {
      question: "Yangi fayl qo'shish uchun qanday amal bajarish kerak?",
      answer: "Pastki navigatsiyaning o'rtasidagi '+' tugmasini bosing va 'IMG to PDF' konvertatsiyasini tanlang."
    },
    {
      question: "Fayl formatlari qanday cheklovlar mavjud?",
      answer: "IMG to PDF konvertatsiyasi uchun JPG, PNG, GIF, BMP, WebP formatlari qabul qilinadi. "
    },
    {
      question: "Hisobni qanday to'ldirish mumkin?",
      answer: "Profil sahifasida 'Hisobni to'ldirish' bo'limi mavjud. U yerda turli to'lov usullaridan foydalanishingiz mumkin."
    },
    {
      question: "Qo'llab-quvvatlash xizmatiga qanday murojaat qilish mumkin?",
      answer: "FAQ bo'limida ko'rsatilgan kontakt ma'lumotlar yoki ilova ichidagi qo'llab-quvvatlash bo'limi orqali bog'lanishingiz mumkin."
    }
  ];

  // darkMode holati
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    
  };

  // id copy qilish funksiyasi
  const copyToClipboard = () => {
    navigator.clipboard.writeText('123456789');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Hujjatlarga o'tish
  const handleGoToDocuments = () => {
    navigate('/documents');
  };

  // FAQ ochish/yopish
  const toggleFaq = () => {
    setIsFaqOpen(!isFaqOpen);
  };
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.ready();           // Telegramga signal
      tg.expand();          // Full screen (ixtiyoriy)

      const tgUser = tg.initDataUnsafe?.user;
      setUser(tgUser);
    } else {
      console.log("Telegram WebApp emas");
    }
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Profile section */}
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <img 
              src="/imgs/profile_img.png" 
              alt="Profile" 
              className={styles.profileImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/120x120/4f46e5/ffffff?text=HM";
              }}
            />
          </div>
          
          <div className={styles.profileInfo}>
            <h3 className={styles.profileName}>Hatamov Murodjon</h3>
          </div>
          
          <Stack spacing={2} direction="row">
            <Button 
              onClick={copyToClipboard}  
              className={styles.profileId}   
              variant="outlined"
            >
               {user ? (
        <>
          <h1>Salom, {user.first_name} 👋</h1>
          <p>Telegram ID: {user.id}</p>
          <p>Username: @{user.username}</p>
        </>
      ) : (
        <p>Iltimos, ilovani Telegram ichida oching</p>
      )}
              {
                isCopied ? 
                  <HiOutlineCheck className={styles.copyIcon}/> 
                  : 
                  <IoCopyOutline className={styles.copyIcon} />
              }
            </Button>
          </Stack>
        </div>
        {/* End profile section */}

        {/* Theme toggle section */}
        <div className={styles.themeToggle}>
          <div className={styles.themeInfo}>
            <h4 className={styles.themeTitle}>
              {theme === 'light' ? "Qorong'ulik rejmi" : "Yorug'lik rejmi"}
            </h4>
          </div>
          
          <div className={styles.themeSwitch}>
            <div onClick={toggleTheme} className={styles.themeIcons}>
              {theme === 'light' ? (
                <IoMoon className={styles.themeIcon} />
              ) : (
                <IoSunny className={styles.themeIcon} />
              )}
            </div>
          </div>
        </div>

        {/* Hujatlar soni */}
        <div className={styles.documentsSection}>
          <div className={styles.documentHeder}>
            <h4 className={styles.documentsTitle}>Hujjatlar soni</h4>
            <p className={styles.documentsCount}>25 ta</p> 
          </div>
          
          <Stack spacing={2} direction="row">
            <Button 
              className={styles.documentsButton} 
              startIcon={<IoDocumentTextOutline />}
              variant="contained"
              onClick={handleGoToDocuments}
            >
              Hujatlarga o'tish
            </Button>
          </Stack>
        </div>

        {/* FAQ section */}
        <div className={styles.faqSection} onClick={toggleFaq}>
          <div className={styles.faqFlex}>
            <h4 className={styles.documentsTitle}>FAQ</h4>
            <MdOutlineKeyboardDoubleArrowRight 
              className={styles.faqIcon}
              style={{ 
                transform: isFaqOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </div>
          
          <div className={`${styles.faqLists} ${isFaqOpen ? styles.open : ''}`}>
            {faqItems.map((item, index) => (
              <div key={index} className={styles.faqItem}>
                <div className={styles.faqQuestion}>
                  {index + 1}. {item.question}
                </div>
                <div className={styles.faqAnswer}>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Notification Container */}
      <div className={styles.notificationContainer}>
        {isCopied && (
          <Notification 
            text={"ID nusxa olindi  "}
            severity="success"
          />
        )}
      </div>
    </div>
  );
}

export default Home;