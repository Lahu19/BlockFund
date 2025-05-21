import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';

const KycVerification = () => {
  const { contract, address, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [verificationNote, setVerificationNote] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userCount = await contract.userCount();
      const usersData = [];

      for (let i = 0; i < userCount; i++) {
        const userAddress = await contract.getUserAddress(i);
        const user = await contract.getUser(userAddress);
        usersData.push({
          address: userAddress,
          fullName: user[0],
          userRole: user[1],
          isKycVerified: user[2],
          isActive: user[3]
        });
      }

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && isAdmin) {
      fetchUsers();
    }
  }, [contract, isAdmin]);

  const handleVerifyKyc = async (userAddress) => {
    try {
      const tx = await contract.verifyKyc(userAddress);
      await tx.wait();
      toast.success('KYC verified successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error verifying KYC:', error);
      toast.error('Failed to verify KYC');
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setVerificationNote('');
  };

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Access Denied: Admin privileges required
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, backgroundColor: '#1c1c24', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          KYC Verification Dashboard
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>User Address</TableCell>
                <TableCell sx={{ color: 'white' }}>Full Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Role</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.address}>
                  <TableCell sx={{ color: 'white' }}>
                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{user.fullName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{user.userRole}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isKycVerified ? 'Verified' : 'Pending'}
                      color={user.isKycVerified ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={<Visibility />}
                      onClick={() => handleViewDetails(user)}
                      sx={{ color: 'white', mr: 1 }}
                    >
                      View
                    </Button>
                    {!user.isKycVerified && (
                      <Button
                        startIcon={<CheckCircle />}
                        onClick={() => handleVerifyKyc(user.address)}
                        sx={{ color: '#1dc071' }}
                      >
                        Verify
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1c1c24', color: 'white' }}>
          User Details
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1c1c24', color: 'white' }}>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedUser.fullName}
              </Typography>
              <Typography>Address: {selectedUser.address}</Typography>
              <Typography>Role: {selectedUser.userRole}</Typography>
              <Typography>
                KYC Status:{' '}
                <Chip
                  label={selectedUser.isKycVerified ? 'Verified' : 'Pending'}
                  color={selectedUser.isKycVerified ? 'success' : 'warning'}
                />
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Verification Notes"
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                sx={{ mt: 2, '& .MuiInputLabel-root': { color: 'white' } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1c1c24' }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KycVerification; 