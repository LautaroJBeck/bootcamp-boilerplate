import './ExampleDashboard.css'
import {useState, useEffect, useMemo} from 'react'
//import pets from './examplepets.json' 
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import {getPets} from './ExampleApi'
import Button from '@mui/material/Button'
import ExampleSubmitComponent from './ExampleSubmitComponent'
import ExampleEditComponent from './ExampleEditComponent'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

type PetProps = {
  _id: string;
  name: string;
  breed: string;
  age: string;
  url?: string;
}
function ExampleDashboard() {

  const [data, setData] = useState<Array<PetProps>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [query, setQuery] = useState<string>('')
  const [addOpen, setAddOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [selectedPet, setSelectedPet] = useState<any>(null)
  
  // Filter states
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [selectedBreed, setSelectedBreed] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({
    minAge: null as number | null,
    maxAge: null as number | null,
    breed: ''
  })

  const refreshPets = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getPets()
      if (data) {
        setData(data)
      } else {
        setError('Failed to load pets')
      }
    } catch (e: any) {
      setError('Error: ' + e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshPets();
  }, [])

  // Get unique breeds from pets list
  const uniqueBreeds = useMemo(() => {
    const breeds = data.map(pet => pet.breed).filter(Boolean)
    return [...new Set(breeds)].sort()
  }, [data])

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
    setQuery('')
    setAppliedFilters({
      minAge: null,
      maxAge: null,
      breed: ''
    })
  }

  const filtered = useMemo(() => {
    let filtered = data

    // Text search
    const q = query.trim()
    if (q) {
      filtered = filtered.filter((pet: any) => {
        const name = String(pet.name || '').toLowerCase()
        const breed = String(pet.breed || '').toLowerCase()
        return name.includes(q.toLowerCase()) || breed.includes(q.toLowerCase())
      })
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
  }, [data, query, appliedFilters])

  const petCards = filtered.map((pet: any) => { //for local json file: change "data" to "pets" and uncomment the json import line 
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
            <IconButton
              sx={{position: 'absolute', top: 8, right: 8}}
              onClick={() => {
                setSelectedPet(pet)
                setEditOpen(true)
              }}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </CardContent>
        </Card>
      </div>
    )
  })

  return (
    <>
      <AppBar position="sticky" elevation={0} color="transparent">
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow: 1}}>Pet Dashboard</Typography>
          <TextField
            size="small"
            placeholder="Search by name or breed"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{minWidth: 260, margin: '10px'}}
          />
          <Button variant="outlined" color="primary" onClick={refreshPets} sx={{mr: 1}}>Refresh</Button>
          <Button variant="contained" color="primary" onClick={() => setAddOpen(true)}>Add Pet</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          py: 4,
          flexDirection: { xs: 'column', lg: 'row' }
        }}>
          {/* Main content area */}
          <Box sx={{ flex: 1 }}>
            {loading && (
              <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
                <CircularProgress />
              </Box>
            )}

            {!loading && error && (
              <Alert severity="error">{error}</Alert>
            )}

            {!loading && !error && (
              <div className="pet-grid">
                {petCards}
              </div>
            )}
          </Box>

          {/* Filter Sidebar */}
          <Box
            component="aside"
            sx={{
              width: { xs: '100%', lg: 200 },
              alignSelf: 'flex-start',
              position: { xs: 'static', lg: 'sticky' },
              top: 100,
              borderLeft: { xs: 'none', lg: '1px solid #d97706' },
              borderTop: { xs: '1px solid #d97706', lg: 'none' },
              pl: { xs: 1.5, lg: 1.5 },
              pr: { xs: 1.5, lg: 1 },
              py: 1.5,
              backgroundColor: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: 2,
              height: 'fit-content',
              order: { xs: -1, lg: 0 },
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f59e0b'
            }}
          >
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 700, 
              mb: 1.5, 
              color: '#92400e',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              🍂 Filters
            </Typography>

            {/* Age Range Filter */}
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ 
                fontWeight: 600, 
                mb: 0.5, 
                color: '#92400e',
                fontSize: '0.75rem',
                display: 'block'
              }}>
                🎂 Age
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <TextField
                  size="small"
                  type="number"
                  placeholder="Min"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  sx={{ 
                    width: '45%',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      backgroundColor: '#ffffff',
                      fontSize: '0.75rem',
                      height: '32px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d97706'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b45309'
                      }
                    }
                  }}
                  inputProps={{ min: 0, step: 0.1 }}
                />
                <TextField
                  size="small"
                  type="number"
                  placeholder="Max"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  sx={{ 
                    width: '45%',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      backgroundColor: '#ffffff',
                      fontSize: '0.75rem',
                      height: '32px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d97706'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#b45309'
                      }
                    }
                  }}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ 
              mb: 1.5, 
              borderColor: '#d97706',
              opacity: 0.3
            }} />

            {/* Breed Filter */}
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ 
                fontWeight: 600, 
                mb: 0.5, 
                color: '#92400e',
                fontSize: '0.75rem',
                display: 'block'
              }}>
                🐕 Breed
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedBreed}
                  onChange={(e) => setSelectedBreed(e.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: 1.5,
                    backgroundColor: '#ffffff',
                    fontSize: '0.75rem',
                    height: '32px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d97706'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#b45309'
                    }
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                    <em>All Breeds</em>
                  </MenuItem>
                  {uniqueBreeds.map((breed) => (
                    <MenuItem key={breed} value={breed} sx={{ fontSize: '0.75rem' }}>
                      {breed}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ 
              mb: 1.5, 
              borderColor: '#d97706',
              opacity: 0.3
            }} />

            {/* Active Filters Display */}
            {(appliedFilters.minAge !== null || appliedFilters.maxAge !== null || appliedFilters.breed) && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ 
                  fontWeight: 600, 
                  mb: 0.5, 
                  color: '#92400e',
                  fontSize: '0.7rem',
                  display: 'block'
                }}>
                  ✨ Active:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                  {appliedFilters.minAge !== null && (
                    <Chip 
                      label={`${appliedFilters.minAge}+`} 
                      size="small" 
                      sx={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #d97706',
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        height: '20px'
                      }}
                    />
                  )}
                  {appliedFilters.maxAge !== null && (
                    <Chip 
                      label={`${appliedFilters.maxAge}-`} 
                      size="small" 
                      sx={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #d97706',
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        height: '20px'
                      }}
                    />
                  )}
                  {appliedFilters.breed && (
                    <Chip 
                      label={appliedFilters.breed.length > 8 ? appliedFilters.breed.substring(0, 8) + '...' : appliedFilters.breed} 
                      size="small" 
                      sx={{
                        backgroundColor: '#fde68a',
                        color: '#92400e',
                        border: '1px solid #b45309',
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        height: '20px'
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={applyFilters}
                size="small"
                sx={{ 
                  borderRadius: 1.5,
                  fontWeight: 600,
                  py: 0.8,
                  fontSize: '0.75rem',
                  background: 'linear-gradient(45deg, #d97706, #b45309)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #b45309, #92400e)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                🔍 Search
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={clearFilters}
                size="small"
                sx={{ 
                  borderRadius: 1.5,
                  fontWeight: 600,
                  py: 0.8,
                  fontSize: '0.75rem',
                  borderColor: '#d97706',
                  color: '#92400e',
                  '&:hover': {
                    borderColor: '#b45309',
                    backgroundColor: '#fef3c7',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                🍂 Clear
              </Button>
            </Box>

            {/* Results Count */}
            <Box sx={{ 
              mt: 1.5, 
              textAlign: 'center',
              p: 1,
              backgroundColor: '#fef3c7',
              borderRadius: 1.5,
              border: '1px solid #fde68a'
            }}>
              <Typography variant="caption" sx={{ 
                color: '#92400e',
                fontWeight: 500,
                fontSize: '0.7rem'
              }}>
                🐾 {filtered.length}/{data.length}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      <ExampleSubmitComponent
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={refreshPets}
      />
      
      <ExampleEditComponent
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={refreshPets}
        pet={selectedPet}
      />
    </>
  )
}

export default ExampleDashboard