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
					textAlign: 'center',
					p: { xs: 3, sm: 4 },
					borderRadius: 3,
				}}
			>
				<Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700}}>
					Welcome to Inventory Manager
				</Typography>
				<Typography variant="body1">
					This is a web application designed to manage your inventory and users efficiently.
				</Typography>
			</Paper>
		</Box>
	);
}
