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
import { jsPDF } from "jspdf"; // ← Muhim: jsPDF ni import qilish kerak!
import styles from "./AddDocuments.module.css";
import Notification from "../../components/notification/Notification";

function AddDocuments() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isNotification, setIsNotification] = useState({
    text: "",
    isactiv: false,
    severity: "warning",
  });

  const fileInputRef = useRef(null);

  // Fayl hajmini formatlash
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Fayl qo'shish (tanlash orqali)
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    processFiles(selectedFiles);
  };

  // Drag & drop orqali fayllar
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  // Umumiy fayl filtrlash va qo'shish
  const processFiles = (inputFiles) => {
    const acceptedFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    const validFiles = inputFiles.filter((file) => {
      const ext = "." + file.name.split(".").pop().toLowerCase();
      return acceptedFormats.includes(ext);
    });

    if (validFiles.length === 0 && inputFiles.length > 0) {
      setIsNotification({
        text: "Faqat rasm fayllari (JPG, PNG, GIF, BMP, WebP) qabul qilinadi!",
        isactiv: true,
        severity: "warning",
      });
      return;
    }

    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  };

  const addFiles = (newFiles) => {
    const formatted = newFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      sizeBytes: file.size,
    }));
    setFiles((prev) => [...prev, ...formatted]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Drag handlers
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  // Asosiy konvertatsiya funksiyasi
  const handleConvert = async () => {
    if (files.length === 0) {
      setIsNotification({
        text: "Iltimos, kamida bitta rasm yuklang!",
        isactiv: true,
        severity: "warning",
      });
      return;
    }

    setIsConverting(true);

    const pdf = new jsPDF();
    let loadedCount = 0;

    const processImage = (fileObj, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgData = e.target.result;
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Sifatni biroz pasaytirib, hajmni kamaytirish mumkin
            const quality = 0.95;
            const optimizedImgData = canvas.toDataURL("image/jpeg", quality);

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth - 20; // 10px margin har tomondan
            const imgHeight = (img.height * imgWidth) / img.width;

            if (index > 0) pdf.addPage();
            pdf.addImage(optimizedImgData, "JPEG", 10, 10, imgWidth, imgHeight);

            loadedCount++;
            if (loadedCount === files.length) {
              // Yakuniy fayl nomi
              const outputName =
                files.length === 1
                  ? files[0].name.replace(/\.[^/.]+$/, "") + ".pdf"
                  : `rasmlar_${Date.now()}.pdf`;

              const pdfBlob = pdf.output("blob");
              const downloadUrl = URL.createObjectURL(pdfBlob);

              setConvertedFile({
                name: outputName,
                size: formatFileSize(pdfBlob.size),
                downloadUrl,
                blob: pdfBlob,
              });

              setIsConverting(false);
            }
            resolve();
          };
          img.src = imgData;
        };
        reader.readAsDataURL(fileObj.file);
      });
    };

    // Barcha rasmlarni ketma-ket qayta ishlash
    for (let i = 0; i < files.length; i++) {
      await processImage(files[i], i);
    }
  };

  const handleDownload = () => {
    if (convertedFile && convertedFile.downloadUrl) {
      const a = document.createElement("a");
      a.href = convertedFile.downloadUrl;
      a.download = convertedFile.name;
      a.click();

      setIsNotification({
        text: `"${convertedFile.name}" fayli yuklab olindi!`,
        isactiv: true,
        severity: "success",
      });
    }
  };

  const handleNewConversion = () => {
    setFiles([]);
    setConvertedFile(null);
  };

  const handleUploadClick = () => fileInputRef.current.click();

  // Notification ni yopish uchun (agar Notification komponentida props bo'lsa)
  const closeNotification = () => {
    setIsNotification({ ...isNotification, isactiv: false });
  };

  return (
    <div className={styles.addDocumentsContainer}>
      <div className={styles.addDocumentsContent}>
        {/* Konversiya turi */}
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
            <div className={styles.uploadSection}>
              <h3 className={styles.uploadTitle}>Rasmlarni yuklang</h3>
              <p className={styles.uploadSubtitle}>JPG, PNG yoki boshqa rasm formatlarini tanlang</p>

              <div
                className={`${styles.uploadCard} ${dragging ? styles.dragging : ""}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <IoCloudUploadOutline className={styles.uploadIcon} />
                <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-md)" }}>
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

              {files.length > 0 && (
                <div className={styles.selectedFiles}>
                  <h4 className={styles.filesTitle}>
                    <IoImageOutline />
                    Tanlangan rasmlar ({files.length} ta)
                  </h4>
                  <div className={styles.filesList}>
                    {files.map((file) => (
                      <div key={file.id} className={styles.fileItem}>
                        <div className={styles.fileIcon}><IoImageOutline /></div>
                        <div className={styles.fileInfo}>
                          <div className={styles.fileName}>{file.name}</div>
                          <div className={styles.fileSize}>{file.size}</div>
                        </div>
                        <button
                          className={styles.removeButton}
                          onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                        >
                          <IoClose />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                className={styles.convertButton}
                onClick={handleConvert}
                disabled={files.length === 0 || isConverting}
              >
                <IoDocumentTextOutline />
                PDFga Konvertatsiya qilish
              </button>
            </div>
          </>
        ) : isConverting ? (
          <div className={styles.conversionAnimation}>
            <div className={styles.animationContainer}>
              <div className={styles.imageCircle}></div>
              <div className={styles.spinner}>
                <div className={styles.spinnerSegment}></div>
              </div>
              <IoDocumentTextOutline className={styles.pdfIcon} />
            </div>
            <h3 className={styles.progressText}>Konvertatsiya qilinmoqda...</h3>
            <p className={styles.progressSubtext}>{files.length} ta rasm PDFga aylantirilmoqda</p>
          </div>
        ) : (
          <div className={styles.resultSection}>
            <IoCheckmarkCircleOutline className={styles.successIcon} />
            <h3 className={styles.resultTitle}>Konvertatsiya muvaffaqiyatli tugadi!</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-lg)" }}>
              Rasmlaringiz PDF fayliga aylantirildi
            </p>

            <div className={styles.resultFile}>
              <div className={styles.resultFlex}>
                <div className={styles.fileIcon}><IoDocumentTextOutline /></div>
                <div className={styles.resultFileName}>
                  {convertedFile.name}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Hajmi: {convertedFile.size}
                  </div>
                </div>
              </div>
              <button className={styles.downloadButton} onClick={handleDownload}>
                <IoDownloadOutline />
                Yuklab olish
              </button>
            </div>

            <button className={styles.newConversionButton} onClick={handleNewConversion}>
              <IoReloadOutline />
              Yangi konvertatsiya
            </button>
          </div>
        )}
      </div>

      {isNotification.isactiv && (
        <Notification
          severity={isNotification.severity}
          text={isNotification.text}
          onClose={closeNotification} // agar Notification komponenti onClose ni qo‘llab-quvvatlasa
        />
      )}
    </div>
  );
}

export default AddDocuments;