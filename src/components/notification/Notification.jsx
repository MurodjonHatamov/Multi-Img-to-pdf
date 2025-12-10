import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import styles from "./Notification.module.css";

function Notification({ text, severity = 'success' }) {


    
  return (
    // Fixed position, tepada markazda
    <div className={styles.toast}>
      <Stack className={styles.stack} spacing={2}>
        <Alert className={styles.alert} severity={severity}>
          {text}
        </Alert>
      </Stack>
    </div>
  );
}

export default Notification;

// success
// info
// warning
// error