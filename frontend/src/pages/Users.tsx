import { useEffect, useState } from 'react';
import { Button, Container, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { createUser, getUsers } from '../api/managerApi';
import type { User } from '../types/item_user_types';

const USERS_PER_PAGE = 7;

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to load users', err));
  }, []);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(users.length / USERS_PER_PAGE));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [users, currentPage]);

  const addUser = () => {
    const newUser = { firstName: firstName.trim(), lastName: lastName.trim(), identifier: identifier.trim() };
    createUser(newUser)
      .then((data) => {
        setUsers((prev) => [...prev, data]);
        setFirstName('');
        setLastName('');
        setIdentifier('');
      })
      .catch((err) => console.error('Failed to add user', err));
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
          p: 1.5,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
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
      </Paper>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'gray' }}>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Identifier</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.firstName}</TableCell>
                <TableCell>{u.lastName}</TableCell>
                <TableCell>{u.identifier}</TableCell>
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
