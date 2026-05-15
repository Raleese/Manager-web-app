import { useEffect, useState } from 'react';
import { Box, Button, Container, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { createUser, getUsers, deleteUser } from '../api/managerApi';
import type { User } from '../types/item_user_types';

// For pagination and consistent table height
const USERS_PER_PAGE = 7;
const ROW_HEIGHT = 52;

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState('');

  // Load users
  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to load users', err));
  }, []);

  // Ensure current page is valid after users change
  useEffect(() => {
    // If the current page is empty after users update then set it to the last page
    const totalPages = Math.max(1, Math.ceil(users.length / USERS_PER_PAGE));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [users, currentPage]);

  // Add user
  const addUser = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedIdentifier = identifier.trim();

    // Basic validation for whitespaces
    if (trimmedFirstName === '' || trimmedLastName === '' || trimmedIdentifier === '') {
      alert('Please fill in all fields');
      return;
    }

    // Check for duplicate identifier
    const duplicateIdentifier = users.some(
      (user) => user.identifier.trim() === trimmedIdentifier
    );

    // Checking for duplicate identifier
    if (duplicateIdentifier) {
      alert('Error: a user with this identifier already exists.');
      return;
    }

    const newUser = { firstName: trimmedFirstName, lastName: trimmedLastName, identifier: trimmedIdentifier };
    createUser(newUser)
      .then((data) => {
        setUsers((prev) => [...prev, data]);
        setFirstName('');
        setLastName('');
        setIdentifier('');
      })
      .catch((err) => {
        console.error('Failed to create user', err);
        alert('Failed to create user. Please try again.');
      });
  };

  // Remove user
  const removeUser = (id: number) => {
    deleteUser(id)
      .then(() => setUsers((prev) => prev.filter((u) => u.id !== id)))
      .catch((err) => console.error('Failed to delete user', err));
  };

  const totalPages = Math.max(1, Math.ceil(users.length / USERS_PER_PAGE));
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const pagedUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);

  return (
    <Container 
      sx={{ 
        mt: 4, 
        pb: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2 
      }}
    >
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Paper
        sx={{
          py: 1,
          px: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Add new user:
        </Typography>

        <Box
          sx={{
            display: 'flex',
            // Smaller screens - vertical layout, larger screens - horizontal layout
            flexDirection: { xs: 'column', md: 'row' },
            gap: 1,
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={addUser}
            sx={{
              minWidth: { xs: '100%', md: 112 },
              height: 40,
              backgroundColor: '#6b7280',
              '&:hover': {
                backgroundColor: '#4b5563'
              }
            }}
          >
            Add User
          </Button>
        </Box>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'gray' }}>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Identifier</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedUsers.map((u) => (
              <TableRow
                key={u.id}
                sx={{ height: ROW_HEIGHT }}
              >
                <TableCell>{u.firstName}</TableCell>
                <TableCell>{u.lastName}</TableCell>
                <TableCell>{u.identifier}</TableCell>
                <TableCell sx={{ padding: 0, width: 'fit-content', whiteSpace: 'nowrap' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => removeUser(u.id)}
                    sx={{ width: 'fit-content' }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {/* Filling with empty rows for consistent table height */}
            {Array.from({ length: Math.max(0, USERS_PER_PAGE - pagedUsers.length) }).map((_, idx) => (
              <TableRow key={idx} sx={{ height: ROW_HEIGHT }}>
                {/* NOTE: &nbsp - non-breaking space. Allows the cell to have content and keep its height */ }
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Container
        sx={{
          display: 'flex', 
          justifyContent: 'center', 
          mt: 1 
          }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          sx={{ color: 'gray' }}
        />
      </Container>
    </Container>
  );
}
