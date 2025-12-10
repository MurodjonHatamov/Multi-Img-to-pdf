import React, { useState, useEffect } from 'react';
import { 
  IoChevronBack,
  IoSearch,
  IoClose,
  IoDownloadOutline,
  IoTrashOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoDocumentAttachOutline,
  IoStatsChartOutline,
  IoCloudOfflineOutline,
  IoFileTrayOutline,
  IoDocumentOutline
} from 'react-icons/io5';
import { 
  FcDocument,
  FcPicture,
  FcFile,
  FcStatistics,
  FcTodoList
} from 'react-icons/fc';
import styles from './Documents.module.css';

function Documents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);

  // Fayl ma'lumotlari (mock data)
  const mockFiles = [
    {
      id: 1,
      name: 'Shartnoma.pdf',
      type: 'pdf',
      size: '2.4 MB',
      date: '2024-10-15',
      sizeBytes: 2516582
    },
    {
      id: 2,
      name: 'Hisobot_2024.docx',
      type: 'word',
      size: '1.8 MB',
      date: '2024-10-14',
      sizeBytes: 1887436
    },
    {
      id: 3,
      name: 'Moliyaviy_plan.xlsx',
      type: 'excel',
      size: '3.2 MB',
      date: '2024-10-13',
      sizeBytes: 3355443
    },
    {
      id: 4,
      name: 'Logo_dizayn.png',
      type: 'image',
      size: '1.5 MB',
      date: '2024-10-12',
      sizeBytes: 1572864
    },
    {
      id: 5,
      name: 'Pasport_skan.jpg',
      type: 'image',
      size: '2.1 MB',
      date: '2024-10-11',
      sizeBytes: 2202009
    },
    {
      id: 6,
      name: 'Qoidalar.pdf',
      type: 'pdf',
      size: '850 KB',
      date: '2024-10-10',
      sizeBytes: 870400
    },
    {
      id: 7,
      name: 'Maqsadlar.docx',
      type: 'word',
      size: '980 KB',
      date: '2024-10-09',
      sizeBytes: 1003520
    },
    {
      id: 8,
      name: 'Xarajatlar.xlsx',
      type: 'excel',
      size: '1.2 MB',
      date: '2024-10-08',
      sizeBytes: 1258291
    },
    {
      id: 9,
      name: 'Imzo_skan.jpg',
      type: 'image',
      size: '1.8 MB',
      date: '2024-10-07',
      sizeBytes: 1887436
    },
    {
      id: 10,
      name: 'Litsenziya.pdf',
      type: 'pdf',
      size: '3.5 MB',
      date: '2024-10-06',
      sizeBytes: 3670016
    }
  ];

  // Statistika hisoblash
  const stats = {
    total: mockFiles.length,
    pdf: mockFiles.filter(f => f.type === 'pdf').length,
    word: mockFiles.filter(f => f.type === 'word').length,
    excel: mockFiles.filter(f => f.type === 'excel').length,
    image: mockFiles.filter(f => f.type === 'image').length
  };

  // Fayllarni filter qilish
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFiles(mockFiles);
    } else {
      const filtered = mockFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchQuery]);

  // Fayl yuklab olish
  const handleDownload = (file) => {
    console.log('Yuklab olinmoqda:', file.name);
    // Bu yerda haqiqiy yuklab olish logikasi bo'ladi
    alert(`${file.name} fayli yuklab olindi`);
  };

  // Fayl o'chirish
  const handleDelete = (fileId) => {
    if (window.confirm('Bu faylni o\'chirmoqchimisiz?')) {
      console.log('O\'chirilmoqda:', fileId);

      setFiles(prev => prev.filter(f => f.id !== fileId));
      alert('Fayl o\'chirildi');
    }
  };

  // Fayl turi bo'yicha icon
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FcDocument />;
      case 'word':
        return <IoDocumentTextOutline />;
      case 'excel':
        return <FcStatistics />;
      case 'image':
        return <FcPicture />;
      default:
        return <FcFile />;
    }
  };

  // Fayl turini o'zbek tilida
  const getFileTypeName = (type) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'word':
        return 'Word';
      case 'excel':
        return 'Excel';
      case 'image':
        return 'Rasm';
      default:
        return 'Fayl';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Orqaga qaytish
  const handleBack = () => {
    window.history.back();
  };

  // Qidiruvni tozalash
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className={styles.documentsContainer}>
      <div className={styles.documentsContent}>
        {/* Header */}
   

        {/* Qidiruv */}
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <IoSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Fayl nomi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearSearch} onClick={clearSearch}>
                <IoClose />
              </button>
            )}
          </div>
        </div>

        {/* Fayllar ro'yxati */}
        <div className={styles.filesSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Barcha fayllar</h3>
            <span className={styles.filesCount}>
              {filteredFiles.length} ta fayl
            </span>
          </div>

          {filteredFiles.length > 0 ? (
            <div className={styles.filesList}>
              {filteredFiles.map((file) => (
                <div key={file.id} className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <div className={`${styles.fileIcon} ${styles[file.type]}`}>
                      {getFileIcon(file.type)}
                    </div>
                    <div className={styles.fileDetails}>
                      <div className={styles.fileName}>{file.name}</div>
                      <div className={styles.fileMeta}>
                        <span className={styles.fileType}>
                          {getFileTypeName(file.type)}
                        </span>
                        <span className={styles.fileSize}>{file.size}</span>
                        <span className={styles.fileDate}>
                          {formatDate(file.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.fileActions}>
                    <button
                      className={`${styles.actionButton} ${styles.downloadButton}`}
                      onClick={() => handleDownload(file)}
                      title="Yuklab olish"
                    >
                      <IoDownloadOutline />
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDelete(file.id)}
                      title="O'chirish"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <IoCloudOfflineOutline />
              </div>
              <div className={styles.emptyText}>
                {searchQuery ? 'Hech narsa topilmadi' : 'Fayllar mavjud emas'}
              </div>
              {searchQuery && (
                <div className={styles.emptySubtext}>
                  "{searchQuery}" nomli fayl topilmadi. Boshqa nom bilan qidiring.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Documents;