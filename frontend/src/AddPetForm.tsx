import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material'
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material'

interface Pet {
  _id: string
  name: string
  breed: string
  age: string
  url?: string
}

interface AddPetFormProps {
  open: boolean
  onClose: () => void
  onAddPet: (pet: Omit<Pet, '_id'>) => void
}

const AddPetForm: React.FC<AddPetFormProps> = ({ open, onClose, onAddPet }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    url: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.breed.trim()) {
      newErrors.breed = 'Breed is required'
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required'
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      newErrors.age = 'Please enter a valid age'
    }
    
    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      await onAddPet({
        name: formData.name.trim(),
        breed: formData.breed.trim(),
        age: formData.age.trim(),
        url: formData.url.trim() || undefined
      })
      
      // Reset form
      setFormData({ name: '', breed: '', age: '', url: '' })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error adding pet:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '', breed: '', age: '', url: '' })
      setErrors({})
      onClose()
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={{ xs: true, sm: false }}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          boxShadow: { 
            xs: 'none', 
            sm: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          },
          margin: { xs: 0, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1,
        borderBottom: '1px solid #e5e7eb'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Pet
          </Typography>
        </Box>
        <IconButton 
          onClick={handleClose} 
          disabled={loading}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Pet Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <TextField
              label="Breed"
              value={formData.breed}
              onChange={handleInputChange('breed')}
              error={!!errors.breed}
              helperText={errors.breed}
              fullWidth
              required
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <TextField
              label="Age"
              type="number"
              value={formData.age}
              onChange={handleInputChange('age')}
              error={!!errors.age}
              helperText={errors.age}
              fullWidth
              required
              disabled={loading}
              inputProps={{ min: 0, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <TextField
              label="Image URL (optional)"
              value={formData.url}
              onChange={handleInputChange('url')}
              error={!!errors.url}
              helperText={errors.url || 'Enter a URL to an image of your pet'}
              fullWidth
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{ 
              borderRadius: 2,
              px: 3,
              fontWeight: 600
            }}
          >
            {loading ? 'Adding...' : 'Add Pet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddPetForm
