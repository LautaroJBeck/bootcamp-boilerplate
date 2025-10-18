import React from 'react'
import { Fab, Tooltip } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

interface FloatingAddButtonProps {
  onClick: () => void
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <Tooltip title="Add New Pet" placement="left">
      <Fab
        color="primary"
        aria-label="add pet"
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1000,
          boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)',
          '&:hover': {
            boxShadow: '0 12px 20px rgba(37, 99, 235, 0.4)',
            transform: 'scale(1.05)'
          },
          '&:active': {
            transform: 'scale(0.95)'
          },
          transition: 'all 0.2s ease-in-out',
          width: { xs: 48, sm: 56 },
          height: { xs: 48, sm: 56 }
        }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  )
}

export default FloatingAddButton
