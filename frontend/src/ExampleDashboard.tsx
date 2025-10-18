import './ExampleDashboard.css'
import { useState, useEffect, useMemo } from 'react'
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
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

type PetProps = {
  _id: string;
  name: string;
  breed: string;
  age: string;   // stored as string in your data
  url?: string;
}

function ExampleDashboard() {
  const [data, setData] = useState<Array<PetProps>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const [query, setQuery] = useState<string>('')

  const [addOpen, setAddOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [selectedPet, setSelectedPet] = useState<PetProps | null>(null)

  const [sortBy, setSortBy] = useState<'name' | 'age' | 'breed'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Sidebar age inputs + applied filter values (set when clicking Find!)
  const [minAgeInput, setMinAgeInput] = useState<string>('')
  const [maxAgeInput, setMaxAgeInput] = useState<string>('')
  const [appliedMinAge, setAppliedMinAge] = useState<number | null>(null)
  const [appliedMaxAge, setAppliedMaxAge] = useState<number | null>(null)

  const applyAgeFilter = () => {
    const min = minAgeInput.trim() === '' ? null : Number(minAgeInput)
    const max = maxAgeInput.trim() === '' ? null : Number(maxAgeInput)
    setAppliedMinAge(Number.isFinite(min as number) ? (min as number) : null)
    setAppliedMaxAge(Number.isFinite(max as number) ? (max as number) : null)
  }


  // Helpers
  const getAgeNum = (s?: string) => {
    const n = parseFloat(s ?? '')
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
  }

  const filteredAndSorted = useMemo(() => {
    let list = data

    // text search (case-insensitive) across name/breed
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(p => {
        const name = String(p.name ?? '').toLowerCase()
        const breed = String(p.breed ?? '').toLowerCase()
        return name.includes(q) || breed.includes(q)
      })
    }

    // age filter (only if one or both bounds are applied)
    if (appliedMinAge !== null || appliedMaxAge !== null) {
      list = list.filter(p => {
        const ageNum = Number(p.age)
        if (!Number.isFinite(ageNum)) return false
        if (appliedMinAge !== null && ageNum < appliedMinAge) return false
        if (appliedMaxAge !== null && ageNum > appliedMaxAge) return false
        return true
      })
    }

    // sort
    const arr = [...list]
    arr.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'name') {
        cmp = String(a.name ?? '').localeCompare(String(b.name ?? ''), undefined, { sensitivity: 'base' })
      } else if (sortBy === 'breed') {
        cmp = String(a.breed ?? '').localeCompare(String(b.breed ?? ''), undefined, { sensitivity: 'base' })
      } else {
        // 'age': youngest first; missing ages go last
        cmp = getAgeNum(a.age) - getAgeNum(b.age)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [data, query, sortBy, sortDir, appliedMinAge, appliedMaxAge])

  const petCards = filteredAndSorted.map((pet: PetProps) => (
    <div key={pet._id} className="pet-grid-item">
      <Card className="pet-card" sx={{ height: '100%', position: 'relative' }}>
        {pet.url ? (
          <CardMedia sx={{ height: 220 }} image={pet.url} />
        ) : (
          <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            <Typography variant="subtitle1" color="text.secondary">
              No pet picture
            </Typography>
          </Box>
        )}
        <CardContent>
          <Typography gutterBottom variant="h6">{pet.name}</Typography>
          <Typography gutterBottom variant="body2" color="text.secondary">
            {pet.breed}{pet.age ? `, ${pet.age} yrs` : ''}
          </Typography>
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => { setSelectedPet(pet); setEditOpen(true) }}
            size="small"
          >
            <EditIcon />
          </IconButton>
        </CardContent>
      </Card>
    </div>
  ))

  return (
    <>
      <AppBar position="sticky"
  color="default"
  elevation={0}
  sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Pet Dashboard</Typography>

          <TextField
            size="small"
            placeholder="Search by name or breed"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 260, mr: 1 }}
          />

          <FormControl size="small" sx={{ minWidth: 160, mr: 1 }}>
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value as 'name' | 'age' | 'breed')}
            >
              <MenuItem value="name">Name (A–Z)</MenuItem>
              <MenuItem value="age">Age (young → old)</MenuItem>
              <MenuItem value="breed">Breed (A–Z)</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel id="sort-dir-label">Order</InputLabel>
            <Select
              labelId="sort-dir-label"
              value={sortDir}
              label="Order"
              onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="asc">Asc</MenuItem>
              <MenuItem value="desc">Desc</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => setAddOpen(true)}>Add Pet</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Main grid (left) */}
          <Box sx={{ flex: 1, py: 1 }}>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            )}
            {!loading && error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && <div className="pet-grid">{petCards}</div>}
          </Box>

          {/* Sidebar (right) */}
          <Box
            component="aside"
            sx={{
              width: 260,
              alignSelf: 'flex-start',
              position: 'sticky',
              top: 120, // sits below your header paragraph when scrolling
              borderLeft: '1px solid #e5e7eb',
              pl: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Search 4 PAWsome Puppies
            </Typography>

            {/* Age Range */}
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              Age Range
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                value={minAgeInput}
                onChange={(e) => setMinAgeInput(e.target.value)}
                sx={{ width: 90 }}
                inputProps={{ min: 0 }}
              />
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                value={maxAgeInput}
                onChange={(e) => setMaxAgeInput(e.target.value)}
                sx={{ width: 90 }}
                inputProps={{ min: 0 }}
              />
            </Box>

            <Button variant="contained" fullWidth onClick={applyAgeFilter}>
              Find!
            </Button>
          </Box>
        </Box>
      </Container>


    </>
  )
}

export default ExampleDashboard
