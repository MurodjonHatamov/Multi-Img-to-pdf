import React, { useState, useRef } from "react";
import {
  IoChevronBack,
  IoCloudUploadOutline,
  IoImageOutline,
  IoDocumentTextOutline,
  IoClose,
  IoDownloadOutline,
  IoReloadOutline,
  IoCheckmarkCircleOutline,
  IoArrowForwardOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import styles from "./AddDocuments.module.css";
import Notification from "../../components/notification/Notification";

function AddDocuments() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);
const [isNotification,setIsNotification]=useState({
    text:"salom",
    isactiv:false,
    severity:"warning"
});



  const fileInputRef = useRef(null);

  // Fayl hajmini format qilish
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Fayl qo'shish
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const acceptedFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

    const validFiles = selectedFiles.filter((file) => {
      const extension = "." + file.name.split(".").pop().toLowerCase();
      return acceptedFormats.includes(extension);
    });

    if (validFiles.length !== selectedFiles.length) {

      setIsNotification({
        text:"Faqat JPG, PNG, GIF, BMP, WebP formatlari qabul qilinadi!",
        isactiv:true,
        severity:"warning"
    })
    }

    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  };

  // Fayllarni qo'shish
  const addFiles = (newFiles) => {
    const formattedFiles = newFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: formatFileSize(file.size),
      sizeBytes: file.size,
    }));

    setFiles((prev) => [...prev, ...formattedFiles]);
  };

  // Faylni o'chirish
  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  // Drag & drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const acceptedFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    const validFiles = droppedFiles.filter((file) => {
      const extension = "." + file.name.split(".").pop().toLowerCase();
      return acceptedFormats.includes(extension);
    });

    if (validFiles.length > 0) {
      addFiles(validFiles);
    } else {
setIsNotification({
    text:"Faqat rasm fayllari qabul qilinadi!",
    isactiv:true,
    severity:"warning"
})
    
    }
  };

  // Konvertatsiya qilish
  const handleConvert = () => {
    if (files.length === 0) {
    
      setIsNotification({
        text:"Iltimos, kamida bitta rasm yuklang!",
        isactiv:true,
        severity:"warning"
    })
      return;
    }

    setIsConverting(true);

    // Simulate conversion (3 seconds)
    setTimeout(() => {
      setIsConverting(false);

      // Create output filename
      const outputFileName =
        files.length === 1
          ? files[0].name.replace(/\.[^/.]+$/, "") + ".pdf"
          : "images_" + Date.now() + ".pdf";

      // Calculate total size (simulated)
      const totalSize = files.reduce((acc, file) => acc + file.sizeBytes, 0);
      const pdfSize = totalSize * 0.7; // PDF is usually smaller

      setConvertedFile({
        name: outputFileName,
        size: formatFileSize(pdfSize),
        downloadUrl: "#",
      });
    }, 3000);
  };

  // Faylni yuklab olish
  const handleDownload = () => {
    if (convertedFile) {
     
      setIsNotification({
        text:`"${convertedFile.name}" fayli yuklab olindi!`,
        isactiv:true,
        severity:"success"
    })
    }
  };

  // Yangi konversiya
  const handleNewConversion = () => {
    setFiles([]);
    setConvertedFile(null);
  };



  // Fayl yuklash tugmasi
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.addDocumentsContainer}>
      <div className={styles.addDocumentsContent}>
        {/* Conversion type (fixed) */}
        <div className={styles.conversionType}>
          <div className={styles.typeLabel}>Konversiya turi</div>
          <div className={styles.typeCard}>
            <IoImageOutline className={styles.typeIcon} />
            <span className={styles.typeText}>RASM</span>
            <IoArrowForwardOutline className={styles.typeArrow} />
            <IoDocumentTextOutline className={styles.typeIcon} />
            <span className={styles.typeText}>PDF</span>
          </div>
        </div>

        {!isConverting && !convertedFile ? (
          <>
            {/* Upload section */}
            <div className={styles.uploadSection}>
              <h3 className={styles.uploadTitle}>Rasmlarni yuklang</h3>
              <p className={styles.uploadSubtitle}>
                JPG, PNG yoki boshqa rasm formatlarini tanlang
              </p>

              <div
                className={`${styles.uploadCard} ${
                  dragging ? styles.dragging : ""
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <IoCloudUploadOutline className={styles.uploadIcon} />
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Fayllarni bu yerga sudrab tashlang yoki
                </p>
                <button className={styles.uploadButton}>
                  <IoAddCircleOutline />
                  Rasm tanlash
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className={styles.fileInput}
                  onChange={handleFileSelect}
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                />
              </div>

              {/* Selected files */}
              {files.length > 0 && (
                <div className={styles.selectedFiles}>
                  <h4 className={styles.filesTitle}>
                    <IoImageOutline />
                    Tanlangan rasmlar ({files.length} ta)
                  </h4>

                  <div className={styles.filesList}>
                    {files.map((file) => (
                      <div key={file.id} className={styles.fileItem}>
                        <div className={styles.fileIcon}>
                          <IoImageOutline />
                        </div>
                        <div className={styles.fileInfo}>
                          <div className={styles.fileName}>{file.name}</div>
                          <div className={styles.fileSize}>{file.size}</div>
                        </div>
                        <button
                          className={styles.removeButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          title="O'chirish"
                        >
                          <IoClose />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Convert button */}
              <button
                className={styles.convertButton}
                onClick={handleConvert}
                disabled={files.length === 0}
              >
                <IoDocumentTextOutline />
                PDFga Konvertatsiya qilish
              </button>
            </div>
          </>
        ) : isConverting ? (
          /* Conversion animation */
          <div className={styles.conversionAnimation}>
            <div className={styles.animationContainer}>
              <div className={styles.imageCircle}></div>
              <div className={styles.spinner}>
                <div className={styles.spinnerSegment}></div>
              </div>
              <IoDocumentTextOutline className={styles.pdfIcon} />
            </div>
            <h3 className={styles.progressText}>Konvertatsiya qilinmoqda...</h3>
            <p className={styles.progressSubtext}>
              {files.length} ta rasm PDFga aylantirilmoqda
            </p>
          </div>
        ) : (
          /* Result section */
          <div className={styles.resultSection}>
            <IoCheckmarkCircleOutline className={styles.successIcon} />
            <h3 className={styles.resultTitle}>
              Konvertatsiya muvaffaqiyatli tugadi!
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              Rasmlaringiz PDF fayliga aylantirildi
            </p>

            <div className={styles.resultFile}>
   <div className={styles.resultFlex}>
   <div className={styles.fileIcon}>
                <IoDocumentTextOutline />
              </div>
              <div className={styles.resultFileName}>
                {convertedFile.name}
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                  }}
                >
                  Hajmi: {convertedFile.size}
                </div>
              </div>
   </div>
              <button
                className={styles.downloadButton}
                onClick={handleDownload}
              >
                <IoDownloadOutline />
                Yuklab olish
              </button>
            </div>

            <button
              className={styles.newConversionButton}
              onClick={handleNewConversion}
            >
              <IoReloadOutline />
              Yangi konvertatsiya
            </button>
          </div>
        )}

      </div>
      { 
        isNotification.isactiv &&
        <Notification severity={isNotification.severity} text={ isNotification.text}/>
      
      }
    </div>
  );
}

export default AddDocuments;
