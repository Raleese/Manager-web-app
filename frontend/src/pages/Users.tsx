import { useEffect, useState } from 'react';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import type { User } from '../types/Item_user_types';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    fetch('http://localhost:5067/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to load users', err));
  }, []);

  const addUser = () => {
    const newUser = { firstName: firstName.trim(), lastName: lastName.trim(), identifier: identifier.trim() };
    fetch('http://localhost:5067/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers([...users, data]);
        setFirstName('');
        setLastName('');
        setIdentifier('');
      })
      .catch((err) => console.error('Failed to add user', err));
  };

  return (
    <Container sx={{ mt: 4, pb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Container sx={{ width: '80%', display: 'flex', flexDirection: 'row', gap: 2}}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          label="Identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <Button sx={{ color: 'white', backgroundColor: 'gray' }} onClick={addUser}>
          Add
        </Button>
      </Container>
      
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
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.firstName}</TableCell>
                <TableCell>{u.lastName}</TableCell>
                <TableCell>{u.identifier}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
