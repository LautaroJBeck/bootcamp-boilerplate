import './ExampleDashboard.css'
import { useState, useMemo, useEffect } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import SharedHeader from './SharedHeader.jsx'
import FloatingAddButton from './FloatingAddButton'
import AddPetForm from './AddPetForm'
import { getPets, createPet } from './ExampleApi'

interface Pet {
  _id: string
  name: string
  breed: string
  age: string
  url?: string
}

function ExampleDashboard() {
  const [petsList, setPetsList] = useState<Pet[]>([])
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [selectedBreed, setSelectedBreed] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({
    minAge: null as number | null,
    maxAge: null as number | null,
    breed: ''
  })

  // Load pets from database on component mount
  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true)
        setError('')
        console.log('Loading pets from API...')
        const petsData = await getPets()
        console.log('Pets loaded:', petsData)
        setPetsList(petsData || [])
      } catch (err) {
        console.error('Error loading pets:', err)
        setError('Failed to load pets. Please try again.')
        // Set some dummy data for testing
        setPetsList([
          { _id: '1', name: 'Test Pet', breed: 'Test Breed', age: '3', url: '' }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadPets()
  }, [])

  // Get unique breeds from pets list
  const uniqueBreeds = useMemo(() => {
    const breeds = petsList.map(pet => pet.breed).filter(Boolean)
    const uniqueBreedsList = [...new Set(breeds)].sort()
    console.log('Unique breeds:', uniqueBreedsList)
    return uniqueBreedsList
  }, [petsList])

  const handleAddPet = async (newPet: Omit<Pet, '_id'>) => {
    try {
      setError('')
      const response = await createPet(newPet)
      
      if (response.status === 200 || response.status === 201) {
        // Reload pets from database to get the new pet with proper ID
        const updatedPets = await getPets()
        setPetsList(updatedPets || [])
      } else {
        throw new Error('Failed to create pet')
      }
    } catch (err) {
      console.error('Error adding pet:', err)
      setError('Failed to add pet. Please try again.')
      throw err // Re-throw so the form can handle the error
    }
  }

  const applyFilters = () => {
    setAppliedFilters({
      minAge: minAge ? Number(minAge) : null,
      maxAge: maxAge ? Number(maxAge) : null,
      breed: selectedBreed
    })
  }

  const clearFilters = () => {
    setMinAge('')
    setMaxAge('')
    setSelectedBreed('')
    setSearchQuery('')
    setAppliedFilters({
      minAge: null,
      maxAge: null,
      breed: ''
    })
  }

  // Filter and search logic
  const filteredPets = useMemo(() => {
    let filtered = petsList

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(pet => 
        pet.name.toLowerCase().includes(query) ||
        pet.breed.toLowerCase().includes(query) ||
        pet.age.includes(query)
      )
    }

    // Age range filter
    if (appliedFilters.minAge !== null || appliedFilters.maxAge !== null) {
      filtered = filtered.filter(pet => {
        const age = Number(pet.age)
        if (isNaN(age)) return false
        
        if (appliedFilters.minAge !== null && age < appliedFilters.minAge) return false
        if (appliedFilters.maxAge !== null && age > appliedFilters.maxAge) return false
        return true
      })
    }

    // Breed filter
    if (appliedFilters.breed) {
      filtered = filtered.filter(pet => pet.breed === appliedFilters.breed)
    }

    return filtered
  }, [petsList, searchQuery, appliedFilters])

  const petCards = filteredPets.map((pet: Pet) => { //for local json file: change "data" to "pets" and uncomment the json import line 
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

  console.log('ExampleDashboard rendering, petsList length:', petsList.length)
  console.log('Loading:', loading, 'Error:', error)

  return (
    <>
      <SharedHeader />
  
      <Box>
        <TextField 
          fullWidth 
          label="Search puppies (name, breed, age)…" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          py: 4,
          flexDirection: { xs: 'column', lg: 'row' }
        }}>
          {/* Main content area */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 2, color: 'red' }}>
              DEBUG: Main content area
            </Typography>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            )}
            {!loading && error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {!loading && !error && (
              <div className="pet-grid">
                {petCards.length > 0 ? petCards : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No pets found. Add some pets to get started!
                    </Typography>
                  </Box>
                )}
              </div>
            )}
          </Box>

          {/* Filter Sidebar */}
          <Box
            component="aside"
            sx={{
              width: { xs: '100%', lg: 300 },
              alignSelf: 'flex-start',
              position: { xs: 'static', lg: 'sticky' },
              top: 100,
              borderLeft: { xs: 'none', lg: '3px solid #ff0000' },
              borderTop: { xs: '3px solid #ff0000', lg: 'none' },
              pl: { xs: 2, lg: 3 },
              pr: { xs: 2, lg: 1 },
              py: 2,
              backgroundColor: '#ffff00',
              borderRadius: 2,
              height: 'fit-content',
              order: { xs: -1, lg: 0 },
              minHeight: '400px'
            }}
            onLoad={() => console.log('Filter sidebar rendered')}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'red' }}>
              DEBUG: Filter Sidebar
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
              🔍 Filter Pets
            </Typography>

            {/* Age Range Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Age Range
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  type="number"
                  label="Min Age"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  sx={{ width: '45%' }}
                  inputProps={{ min: 0, step: 0.1 }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Max Age"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  sx={{ width: '45%' }}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Breed Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Breed
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Select Breed</InputLabel>
                <Select
                  value={selectedBreed}
                  onChange={(e) => setSelectedBreed(e.target.value)}
                  label="Select Breed"
                >
                  <MenuItem value="">
                    <em>All Breeds</em>
                  </MenuItem>
                  {uniqueBreeds.map((breed) => (
                    <MenuItem key={breed} value={breed}>
                      {breed}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Active Filters Display */}
            {(appliedFilters.minAge !== null || appliedFilters.maxAge !== null || appliedFilters.breed) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                  Active Filters:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {appliedFilters.minAge !== null && (
                    <Chip 
                      label={`Min: ${appliedFilters.minAge} yrs`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  )}
                  {appliedFilters.maxAge !== null && (
                    <Chip 
                      label={`Max: ${appliedFilters.maxAge} yrs`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  )}
                  {appliedFilters.breed && (
                    <Chip 
                      label={appliedFilters.breed} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={applyFilters}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                  py: 1.5
                }}
              >
                🔍 Search
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={clearFilters}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                  py: 1.5
                }}
              >
                🗑️ Clear Filters
              </Button>
            </Box>

            {/* Results Count */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredPets.length} of {petsList.length} pets
              </Typography>
            </Box>
          </Box>
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
