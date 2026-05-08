import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Users from './pages/Users'
import Inventory from './pages/Inventory'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventory Manager
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          <Button color="inherit" component={Link} to="/inventory">
            Inventory
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
