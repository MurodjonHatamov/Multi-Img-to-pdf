import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styles from './Buttons.module.css';

function Buttons({ text, variant }) {
  return (
    <Stack spacing={2} direction="row">
      <Button
        variant="text"
        sx={{ color: 'var(--primary-color)' }}
      >
        Text
      </Button>
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          '&:hover': { backgroundColor: 'var(--secondary-color)' },
        }}
      >
        Contained
      </Button>
      <Button
        variant="outlined"
        sx={{
          borderColor: 'var(--primary-color)',
          color: 'var(--primary-color)',
          '&:hover': { borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' },
        }}
      >
        Outlined
      </Button>
    </Stack>
  );
}

export default Buttons;

// text
// contained
// outlined