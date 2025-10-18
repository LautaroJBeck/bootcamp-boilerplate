import './ExampleDashboard.css'
import pets from './examplepets.json' 
import { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import SharedHeader from './SharedHeader.jsx'
import FloatingAddButton from './FloatingAddButton'
import AddPetForm from './AddPetForm'

interface Pet {
  _id: string
  name: string
  breed: string
  age: string
  url?: string
}

function ExampleDashboard() {
  const [petsList, setPetsList] = useState<Pet[]>(pets)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const handleAddPet = (newPet: Omit<Pet, '_id'>) => {
    const petWithId: Pet = {
      ...newPet,
      _id: `pet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    setPetsList(prev => [...prev, petWithId])
  }

  const petCards = petsList.map((pet: Pet) => { //for local json file: change "data" to "pets" and uncomment the json import line 
    return (
      <div key={pet._id} className="pet-grid-item">
        <Card className="pet-card" sx={{height: '100%', position: 'relative'}}>
          {pet.url ? (
            <CardMedia sx={{height: 220}} image={pet.url} />
          ) : (
            <Box sx={{ height: 220, display: 'flex', alignItems: 'center', 
                justifyContent: 'center', backgroundColor: '#f3f4f6'}}>
              <Typography variant="subtitle1" color="text.secondary">
                No pet picture 
              </Typography>
            </Box>
          )}
          <CardContent>
            <Typography gutterBottom variant="h6">
              {pet.name}
            </Typography>
            <Typography gutterBottom variant="body2" color="text.secondary">
              {pet.breed}{pet.age ? `, ${pet.age} yrs` : ''}
            </Typography>
            <Button variant="contained">Learn more!</Button>
          </CardContent>
        </Card>
      </div>
    )
  })

  return (
    <>
      <SharedHeader />
  
      <Box>
        <TextField fullWidth label="Search puppies (name, breed, age)…" />
      </Box>
      
      <Container maxWidth="lg">
        <Box className="dashboard" sx={{py: 4}}>
          <div className="pet-grid">
            {petCards}
          </div>
        </Box>
      </Container>

      <FloatingAddButton onClick={() => setIsAddFormOpen(true)} />
      
      <AddPetForm 
        open={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAddPet={handleAddPet}
      />
    </>
  )
}

export default ExampleDashboard
