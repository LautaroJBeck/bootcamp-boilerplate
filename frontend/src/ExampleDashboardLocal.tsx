import './ExampleDashboard.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import pets from './examplepets.json' 
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import logo from './logo.png'

function ExampleDashboard() {
  const petCards = pets.map((pet: any) => { //for local json file: change "data" to "pets" and uncomment the json import line 
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
    <Box sx={{ mb: 4 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
      component="img"
      src={logo}
      alt="Pawgrammer Logo"
      sx={{
        height: 40,
        mr: 2,  // margin-right adds space between logo and text
        borderRadius: '8px' // optional for rounded corners
      }}
    />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pawgrammer Puppies 🐶
          </Typography>
          <Button sx={{color: 'blue', backgroundColor: 'white', '&:hover': { backgroundColor: 'blue', color: 'white'}, m: 1}} >About Us</Button>
          <Button sx={{color: 'blue', backgroundColor: 'white', '&:hover': { backgroundColor: 'blue', color: 'white'}, m: 1}}>Plan Your Visit</Button>
          <Button sx={{color: 'blue', backgroundColor: 'white', '&:hover': { backgroundColor: 'blue', color: 'white'}, m: 1}}>Meet the Puppies</Button>
          <Button color="inherit">Login</Button>
          <Box/>
        </Toolbar>
      </AppBar>
  </Box>
  
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
    </>
  )
}

export default ExampleDashboard
