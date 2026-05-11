import { useEffect, useMemo, useState } from 'react';
import { Button, Container, MenuItem, Pagination, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { getInventory, createInventoryItem, getUsers } from '../api/managerApi';
import type { Item, User } from '../types/item_user_types';

const ITEMS_PER_PAGE = 7;
const ROW_HEIGHT = 52;

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [commentFilter, setCommentFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const [users, setUsers] = useState<User[]>([]);

  const [type, setType] = useState('Tablet');
  const [identifier, setIdentifier] = useState('');
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  const addItem = () => {
    const trimmedIdentifier = identifier.trim();
    const trimmedComment = comment.trim();

    if (trimmedIdentifier === '' || trimmedComment === '') {
      alert('Please fill in all fields');
      return;
    }

    const newItem = {
      type: type as 'Tablet' | 'Phone' | 'SIMCard' | 'Laptop',
      identifier: trimmedIdentifier,
      comment: trimmedComment,
      userId: userId === '' ? null : parseInt(userId),
      purchaseDate: purchaseDate === '' ? null : purchaseDate,
    };

    createInventoryItem(newItem)
      .then(() => getInventory())
      .then((data) => {
        setItems(data);
        setIdentifier('');
        setComment('');
        setUserId('');
        setPurchaseDate('');
      })
      .catch((err) => console.error('Failed to add item', err));
  }

  // Ensure current page is valid after item change
  useEffect(() => {
    // If the current page is empty after items update then set it to the last page
    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [items, currentPage]);

  useEffect(() => {
    getInventory()
      .then((data) => setItems(data))
      .catch((err) => console.error('Failed to load items', err));
  }, []);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to load users', err));
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

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Container 
      sx={{ 
        mt: 4,
        pb: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Inventory
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
          Add new item:
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
            select
            fullWidth
            label="Type"
            size="small"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <MenuItem value="Tablet">Tablet</MenuItem>
            <MenuItem value="Phone">Phone</MenuItem>
            <MenuItem value="SIMCard">SIMCard</MenuItem>
            <MenuItem value="Laptop">Laptop</MenuItem>
          </TextField>

          <TextField           
            size="small"
            label="Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            fullWidth
          />

          <TextField           
            size="small"
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />

          <TextField
            select
            fullWidth
            label="User"
            size="small"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.identifier})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="Purchase Date"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            onClick={addItem}
            sx={{
              minWidth: { xs: '100%', md: 112 },
              height: 40,
              backgroundColor: '#6b7280',
              '&:hover': {
                backgroundColor: '#4b5563'
              }
            }}
          >
            Add Item
          </Button>
        </Box>
      </Paper>

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
          Filter:
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
            select
            fullWidth
            size="small"
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
            size="small"
            label="Comment"
            value={commentFilter}
            onChange={(event) => setCommentFilter(event.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            label="User"
            value={userFilter}
            onChange={(event) => setUserFilter(event.target.value)}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'gray' }}>
              <TableCell>Type</TableCell>
              <TableCell>Identifier</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Assigned User</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.identifier}</TableCell>
                <TableCell>{item.comment}</TableCell>
                <TableCell>{item.user ? `${item.user.firstName} ${item.user.lastName} (${item.user.identifier})` : 'Unassigned'}</TableCell>
                <TableCell>{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell sx={{ padding: 0, width: 'fit-content', whiteSpace: 'nowrap' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    //onClick={() => removeItem(item.id)}
                    sx={{ width: 'fit-content' }}
                  >
                    Delete
                  </Button>
                  <Button>
                    Soft Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {/* Filling with empty rows for consistent table height */}
            {Array.from({ length: Math.max(0, ITEMS_PER_PAGE - pagedItems.length) }).map((_, idx) => (
              <TableRow key={idx} sx={{ height: ROW_HEIGHT }}>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
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
