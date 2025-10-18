import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { createPet } from './ExampleApi'

type ExampleSubmitComponentProps = {
  open: boolean;
  onClose: () => void;
  onAdded: () => Promise<void> | void;
}

function ExampleSubmitComponent({ open, onClose, onAdded }: ExampleSubmitComponentProps) {

  const [newName, setNewName] = useState<string>('')
  const [newBreed, setNewBreed] = useState<string>('')
  const [newAge, setNewAge] = useState<string>('')
  const [newUrl, setNewUrl] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const handleSubmit = async () => {
    if (!newName || !newBreed || !newAge || !newUrl) return
    try {
      setSubmitting(true)
      await createPet({ name: newName, breed: newBreed, age: newAge, url: newUrl}); 
      setNewName(''); setNewBreed(''); setNewAge(''); setNewUrl(' '); onClose();
      await onAdded()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    
    <Dialog open={open} onClose={() => !submitting && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>Add a new pet</DialogTitle>
      <DialogContent dividers>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
          <TextField
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <TextField
            label="Breed"
            value={newBreed}
            onChange={(e) => setNewBreed(e.target.value)}
            required
          />
          <TextField
            label="Age"
            value={newAge}
            onChange={(e) => setNewAge(e.target.value)}
            required
          />
          <TextField
            label="Picture URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            //not required but if it is provided, it will be added to the pet
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !newName || !newBreed || !newAge}
        >
          {submitting ? 'Adding...' : 'Add Pet'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExampleSubmitComponent


