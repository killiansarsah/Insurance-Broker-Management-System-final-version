import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Stack,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  Chip,
  alpha,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Checkbox
} from '@mui/material';
import {
  DeleteOutline,
  EditOutlined,
  VisibilityOutlined,
  MoreVertOutlined,
  SearchOutlined,
  EmailOutlined,
  CalendarTodayOutlined
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import Iconify from '../../components/ui/Iconify';
import { getEmailTemplates, deleteManyEmailTemplates, deleteEmailTemplate } from '../../services/emailTemplateApi';
import DeleteModal from '../../components/ui/DeleteModal';
import { EmailTemplate } from '../../types';

const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<EmailTemplate[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTemplateId, setMenuTemplateId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const fetchData = async () => {
    try {
      const result = await getEmailTemplates();
      if (result && result.status === 200) {
        const data = result?.data?.result || [];
        setTemplates(data);
        setFilteredTemplates(data);
      } else {
        setTemplates([]);
        setFilteredTemplates([]);
      }
    } catch (error) {
      console.error('Error fetching email templates:', error);
      setTemplates([]);
      setFilteredTemplates([]);
    }
  };

  const deleteManyTemplates = async () => {
    try {
      const result = await deleteManyEmailTemplates(selectedIds);
      if (result && result.status === 200) {
        toast.success(result.data.message);
        setSelectedIds([]);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting templates:', error);
      toast.error('Failed to delete templates');
    }
    handleCloseDelete();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTemplates(filtered);
    }
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuTemplateId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTemplateId(null);
  };

  const handleDeleteSingle = async () => {
    if (!menuTemplateId) return;
    try {
      const result = await deleteEmailTemplate(menuTemplateId);
      if (result && result.status === 200) {
        toast.success(result.data.message);
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
    handleMenuClose();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <DeleteModal
        open={openDelete}
        onClose={handleCloseDelete}
        onDelete={deleteManyTemplates}
        itemCount={selectedIds.length}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/email-templates/view/${menuTemplateId}`);
          handleMenuClose();
        }}>
          <VisibilityOutlined sx={{ mr: 1, fontSize: 20 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/email-templates/edit/${menuTemplateId}`);
          handleMenuClose();
        }}>
          <EditOutlined sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteSingle} sx={{ color: 'error.main' }}>
          <DeleteOutline sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          color: 'white'
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Email Templates
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Create and manage professional email templates with our drag-and-drop editor
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/email-templates/add')}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: alpha('#ffffff', 0.9),
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Create Template
          </Button>
        </Stack>
      </Box>

      {/* Search and Actions Bar */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        <TextField
          fullWidth
          size="small"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: 'background.paper',
              '& fieldset': { borderColor: 'divider' }
            }
          }}
        />
        {selectedIds.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutline />}
            onClick={handleOpenDelete}
            sx={{ minWidth: 180, borderRadius: 2 }}
          >
            Delete ({selectedIds.length})
          </Button>
        )}
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Stack spacing={1}>
              <EmailOutlined sx={{ fontSize: 40, opacity: 0.9 }} />
              <Typography variant="h4" fontWeight={700}>
                {templates.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Templates
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Stack spacing={1}>
              <CalendarTodayOutlined sx={{ fontSize: 40, opacity: 0.9 }} />
              <Typography variant="h4" fontWeight={700}>
                {templates.filter(t => {
                  const created = new Date(t.createdOn);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return created > weekAgo;
                }).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Created This Week
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'divider'
          }}
        >
          <EmailOutlined sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {searchQuery ? 'No templates found' : 'No templates yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Get started by creating your first email template'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/email-templates/add')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 1.5
              }}
            >
              Create Your First Template
            </Button>
          )}
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template._id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedIds.includes(template._id) ? 'primary.main' : 'divider',
                  boxShadow: selectedIds.includes(template._id)
                    ? '0 8px 24px rgba(102, 126, 234, 0.25)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'scale(1.005)',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    zIndex: 10
                  }
                }}
                onClick={() => navigate(`/email-templates/view/${template._id}`)}
              >
                {/* Template Preview */}
                <Box
                  sx={{
                    height: 180,
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    position: 'relative'
                  }}
                >
                  <Checkbox
                    checked={selectedIds.includes(template._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template._id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'background.paper' }
                    }}
                  />
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, template._id)}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <MoreVertOutlined />
                  </IconButton>
                  <EmailOutlined sx={{ fontSize: 60, color: 'primary.main', opacity: 0.3 }} />
                </Box>

                {/* Template Info */}
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {template.name}
                  </Typography>

                  {template.subject && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {template.subject}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1} mb={2}>
                    <Chip
                      label={new Date(template.createdOn).toLocaleDateString()}
                      size="small"
                      sx={{
                        bgcolor: alpha('#667eea', 0.1),
                        color: '#667eea',
                        fontWeight: 500
                      }}
                    />
                    {template.modifiedOn && (
                      <Chip
                        label="Modified"
                        size="small"
                        sx={{
                          bgcolor: alpha('#f5576c', 0.1),
                          color: '#f5576c',
                          fontWeight: 500
                        }}
                      />
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/email-templates/view/${template._id}`);
                      }}
                      sx={{ flex: 1, borderRadius: 2 }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/email-templates/edit/${template._id}`);
                      }}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      Edit
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default EmailTemplates;
