import { useEffect, useMemo, useState } from 'react';
import { Container, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import type { Item } from '../types/item_user_types';

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [commentFilter, setCommentFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    fetch('http://localhost:5067/api/inventory')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('Failed to load items', err));
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedCommentFilter = commentFilter.trim().toLowerCase();
    const normalizedUserFilter = userFilter.trim().toLowerCase();

    return items.filter((item) => {
      const matchesType = typeFilter === '' || item.type === typeFilter;
      const matchesComment = normalizedCommentFilter === '' || item.comment.toLowerCase().includes(normalizedCommentFilter);
      const userName = item.user ? `${item.user.firstName} ${item.user.lastName} ${item.user.identifier}` : 'unassigned';
      const matchesUser = normalizedUserFilter === '' || userName.toLowerCase().includes(normalizedUserFilter);

      return matchesType && matchesComment && matchesUser;
    });
  }, [items, typeFilter, commentFilter, userFilter]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          fullWidth
          label="Type"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          <MenuItem value="">All types</MenuItem>
          <MenuItem value="Tablet">Tablet</MenuItem>
          <MenuItem value="Phone">Phone</MenuItem>
          <MenuItem value="SIMCard">SIMCard</MenuItem>
          <MenuItem value="Laptop">Laptop</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Comment"
          value={commentFilter}
          onChange={(event) => setCommentFilter(event.target.value)}
        />

        <TextField
          fullWidth
          label="User"
          value={userFilter}
          onChange={(event) => setUserFilter(event.target.value)}
        />
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'gray' }}>
              <TableCell>Type</TableCell>
              <TableCell>Identifier</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Assigned User</TableCell>
              <TableCell>Purchase Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.identifier}</TableCell>
                <TableCell>{item.comment}</TableCell>
                <TableCell>{item.user ? `${item.user.firstName} ${item.user.lastName}`.trim() : 'Unassigned'}</TableCell>
                <TableCell>{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No items match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
