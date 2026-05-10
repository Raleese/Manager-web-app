import { Box, Paper, Typography } from '@mui/material';

export default function Home() {
	return (
		<Box
			component="main"
			sx={{
				minHeight: '70vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				px: 2,
			}}
		>
			<Paper
				elevation={3}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					textAlign: 'center',
					p: { xs: 3, sm: 4 },
					borderRadius: 3,
				}}
			>
				<Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700}}>
					Inventory Manager
				</Typography>
				<Typography variant="body1">
					This is a web application designed to manage inventory and users.
				</Typography>
				<Typography variant="body1">
					You can view, add, delete users and inventory items, as well as filter inventory based on type, comment, or assigned user.
				</Typography>
				<Typography variant="body1">
					Use the navigation links above to get started.
				</Typography>
			</Paper>
		</Box>
	);
}
