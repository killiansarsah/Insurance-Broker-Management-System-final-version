import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
  Repeat as RepeatIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { apipost, apiput } from '../../services/api';

interface GoogleCalendarDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: string | null;
  editData?: any;
  isEditMode?: boolean;
  initialTab?: number;
}

export default function GoogleCalendarDialog({ 
  open, 
  onClose, 
  selectedDate, 
  editData, 
  isEditMode = false, 
  initialTab = 0 
}: GoogleCalendarDialogProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [guests, setGuests] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#1a73e8');

  const colorOptions = [
    { name: 'Tomato', color: '#d50000' },
    { name: 'Flamingo', color: '#e67c73' },
    { name: 'Tangerine', color: '#f4511e' },
    { name: 'Banana', color: '#f6bf26' },
    { name: 'Sage', color: '#33b679' },
    { name: 'Basil', color: '#0b8043' },
    { name: 'Peacock', color: '#039be5' },
    { name: 'Blueberry', color: '#3f51b5' },
    { name: 'Lavender', color: '#7986cb' },
    { name: 'Grape', color: '#8e24aa' },
    { name: 'Graphite', color: '#616161' },
    { name: 'Default Blue', color: '#1a73e8' }
  ];

  const formattedDate = selectedDate ? format(new Date(selectedDate), 'EEEE, MMMM d, yyyy') : '';

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      
      if (isEditMode && editData) {
        setTitle(editData.subject || editData.title || '');
        setDescription(editData.description || editData.note || '');
        setLocation(editData.location || '');
        setSelectedColor(editData.backgroundColor || '#1a73e8');
        
        if (editData.startDate) {
          const startDate = new Date(editData.startDate);
          setStartTime(format(startDate, 'HH:mm'));
        }
        if (editData.endDate) {
          const endDate = new Date(editData.endDate);
          setEndTime(format(endDate, 'HH:mm'));
        }
      }
    }
  }, [isEditMode, editData, open, initialTab]);

  const handleSave = async () => {
    try {
      const isEvent = activeTab === 0;
      
      const isEditing = isEditMode && editData && editData._id;
      const endpoint = isEditing 
        ? (isEvent ? `meeting/edit/${editData._id}` : `task/edit/${editData._id}`)
        : (isEvent ? 'meeting/add' : 'task/add');
      
      const eventData = isEvent ? {
        subject: title,
        startDate: selectedDate + (isAllDay ? 'T00:00:00' : `T${startTime}:00`),
        endDate: selectedDate + (isAllDay ? 'T23:59:59' : `T${endTime}:00`),
        duration: '1 hour',
        location: location || 'Not specified',
        status: 'Planned',
        relatedTo: 'Contact',
        note: description || 'No description',
        createdBy: 'user1',
        contact_id: '',
        lead_id: '',
        backgroundColor: selectedColor,
        textColor: '#ffffff'
      } : {
        subject: title,
        startDate: selectedDate + (isAllDay ? 'T00:00:00' : `T${startTime}:00`),
        endDate: selectedDate + (isAllDay ? 'T23:59:59' : `T${endTime}:00`),
        description: description || '',
        note: description || '',
        location: location || '',
        backgroundColor: selectedColor,
        textColor: '#ffffff',
        status: 'Not Started',
        priority: 'Medium',
        assignTo: 'user1',
        relatedTo: 'Contact',
        createdBy: 'user1',
        contact_id: '',
        lead_id: ''
      };

      const response = isEditing 
        ? await apiput(endpoint, eventData)
        : await apipost(endpoint, eventData);
      
      if (response && (response.status === 200 || response.status === 201)) {
        handleCloseDialog();
        window.dispatchEvent(new CustomEvent('calendarRefresh'));
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleCloseDialog = () => {
    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setGuests('');
    setLocation('');
    setDescription('');
    setIsAllDay(false);
    setSelectedColor('#1a73e8');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          maxWidth: '540px',
          minHeight: '600px'
        }
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%', 
              bgcolor: selectedColor,
              border: '2px solid #fff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
            }} />
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#3c4043' }}>
              {isEditMode ? 'Edit event' : (activeTab === 0 ? 'New event' : 'New task')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ color: '#5f6368' }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleCloseDialog} size="small" sx={{ color: '#5f6368' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 3, flex: 1 }}>
          {/* Title Input */}
          <TextField
            fullWidth
            placeholder="Add title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                fontSize: '16px',
                '& fieldset': {
                  borderColor: '#dadce0',
                },
                '&:hover fieldset': {
                  borderColor: '#1a73e8',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1a73e8',
                  borderWidth: '2px'
                }
              }
            }}
          />

          {/* Event Type Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                minHeight: '36px',
                '& .MuiTab-root': {
                  minHeight: '36px',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  px: 2,
                  minWidth: 'auto',
                  color: '#5f6368',
                  '&.Mui-selected': {
                    color: '#1a73e8',
                    bgcolor: '#e8f0fe',
                    borderRadius: '16px'
                  }
                },
                '& .MuiTabs-indicator': {
                  display: 'none'
                }
              }}
            >
              <Tab label="Event" />
              <Tab label="Task" />
            </Tabs>
          </Box>

          {/* Date/Time Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <ScheduleIcon sx={{ color: '#5f6368', fontSize: 20 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: '#3c4043', fontWeight: 500 }}>
                  {formattedDate}
                </Typography>
                {!isAllDay && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <TextField
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        width: '120px',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '14px',
                          height: '36px'
                        }
                      }}
                    />
                    <Typography sx={{ color: '#5f6368', mx: 1 }}>–</Typography>
                    <TextField
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        width: '120px',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '14px',
                          height: '36px'
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#1a73e8',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#1a73e8',
                      },
                    }}
                  />
                }
                label="All day"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px',
                    color: '#5f6368'
                  }
                }}
              />
            </Box>
            
            {/* Repeat */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <RepeatIcon sx={{ color: '#5f6368', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#5f6368', fontSize: '14px' }}>
                Does not repeat
              </Typography>
            </Box>
          </Box>

          {/* Guests */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PeopleIcon sx={{ color: '#5f6368', fontSize: 20 }} />
              <TextField
                fullWidth
                placeholder="Add guests"
                variant="outlined"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    '& fieldset': {
                      borderColor: '#dadce0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1a73e8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a73e8',
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Location */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationIcon sx={{ color: '#5f6368', fontSize: 20 }} />
              <TextField
                fullWidth
                placeholder="Add location"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    '& fieldset': {
                      borderColor: '#dadce0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1a73e8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a73e8',
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <NotesIcon sx={{ color: '#5f6368', fontSize: 20, mt: 1 }} />
              <TextField
                fullWidth
                placeholder="Add description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    '& fieldset': {
                      borderColor: '#dadce0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1a73e8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a73e8',
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Color Picker */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#5f6368', mb: 2, fontSize: '14px' }}>
              Color
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {colorOptions.map((colorOption) => (
                <Box
                  key={colorOption.color}
                  onClick={() => setSelectedColor(colorOption.color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: colorOption.color,
                    cursor: 'pointer',
                    border: selectedColor === colorOption.color ? '3px solid #1a73e8' : '2px solid transparent',
                    boxShadow: selectedColor === colorOption.color 
                      ? '0 0 0 2px #fff, 0 0 0 4px #1a73e8'
                      : '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }
                  }}
                  title={colorOption.name}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 3,
          py: 2,
          borderTop: '1px solid #e0e0e0'
        }}>
          <Button
            sx={{
              textTransform: 'none',
              color: '#1a73e8',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#e8f0fe'
              }
            }}
          >
            More options
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!title.trim()}
            sx={{
              textTransform: 'none',
              bgcolor: '#1a73e8',
              color: 'white',
              fontWeight: 500,
              px: 3,
              borderRadius: '4px',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#1557b0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
              },
              '&:disabled': {
                bgcolor: '#f1f3f4',
                color: '#80868b'
              }
            }}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
