import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Sync as SyncIcon,
  MoreVert as MoreIcon,
  PowerSettingsNew as DisconnectIcon
} from '@mui/icons-material';
import Iconify from '../ui/Iconify';
import { apiget, apidelete } from '../../services/api';

interface GoogleCalendarConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

export default function GoogleCalendarConnect({ onConnectionChange }: GoogleCalendarConnectProps) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      setLoading(true);
      const response = await apiget('calendar/google/status');
      if (response.status === 200) {
        setConnected(response.data.connected);
        if (onConnectionChange) onConnectionChange(response.data.connected);
      }
    } catch (error) {
      console.error('Error checking Google Calendar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setSnackbar({ open: true, message: 'Google Calendar integration is not available in demo mode', severity: 'info' });
  };

  const handleDisconnect = async () => {
    handleMenuClose();
    
    if (!window.confirm('Disconnect Google Calendar? Your Google events will no longer appear here.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await apidelete('calendar/google/disconnect');
      if (response.status === 200) {
        setConnected(false);
        if (onConnectionChange) onConnectionChange(false);
        setSnackbar({ open: true, message: 'Google Calendar disconnected', severity: 'info' });
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      setSnackbar({ open: true, message: 'Failed to disconnect', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    handleMenuClose();
    await checkConnectionStatus();
    setSnackbar({ open: true, message: 'Status refreshed', severity: 'success' });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && !connected) {
    return (
      <Chip
        icon={<CircularProgress size={16} />}
        label="Checking..."
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    );
  }

  return (
    <>
      {connected ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Google Calendar Connected" arrow>
            <Chip
              icon={<Iconify icon="logos:google-calendar" width={18} />}
              label="Google Calendar"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          </Tooltip>
          <Tooltip title="Manage connection">
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                width: 24,
                height: 24,
                '&:hover': {
                  background: 'rgba(66, 133, 244, 0.1)'
                }
              }}
            >
              <MoreIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 0.5,
                minWidth: 200,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Google Calendar
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" fontWeight={600}>
                  Connected
                </Typography>
              </Box>
            </Box>
            
            <MenuItem onClick={handleRefresh}>
              <ListItemIcon>
                <SyncIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Refresh Status</ListItemText>
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleDisconnect} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DisconnectIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Disconnect</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Tooltip title="Google Calendar integration available in full version" arrow>
          <Button
            variant="outlined"
            size="small"
            startIcon={loading ? <CircularProgress size={14} /> : <Iconify icon="logos:google-calendar" width={18} />}
            onClick={handleConnect}
            disabled={loading}
            sx={{
              borderColor: '#4285f4',
              color: '#4285f4',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#357ae8',
                background: 'rgba(66, 133, 244, 0.04)'
              }
            }}
          >
            {loading ? 'Connecting...' : 'Connect Google Calendar'}
          </Button>
        </Tooltip>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
