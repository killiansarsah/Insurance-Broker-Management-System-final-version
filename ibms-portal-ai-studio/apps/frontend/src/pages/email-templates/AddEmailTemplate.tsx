import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  FormLabel,
  Paper,
  Card,
  alpha,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import { toast } from 'react-toastify';
import { EmailEditor } from 'react-email-editor';
import { addEmailTemplate } from '../../services/emailTemplateApi';

const AddEmailTemplate: React.FC = () => {
  const emailEditorRef = useRef<any>(null);
  const [name, setName] = useState('');
  const [preview, setPreview] = useState(false);
  const navigate = useNavigate();

  const togglePreview = () => {
    if (preview) {
      emailEditorRef.current?.editor?.hidePreview();
      setPreview(false);
    } else {
      emailEditorRef.current?.editor?.showPreview('desktop');
      setPreview(true);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Template name is required');
      return;
    }

    const editor = emailEditorRef.current?.editor;
    if (!editor || !editor.exportHtml) {
      toast.error('Email editor is not ready. Please wait a moment and try again.');
      return;
    }

    editor.exportHtml(async (data: any) => {
      const { html, design } = data;

      try {
        const result = await addEmailTemplate({
          name,
          html,
          design: JSON.stringify(design),
          createdBy: 'user1'
        });

        if (result && result.status === 201) {
          toast.success(result.data.message);
          navigate('/email-templates');
        }
      } catch (error) {
        console.error('Error saving template:', error);
        toast.error('Failed to save template');
      }
    });
  };

  return (
    <Box>
      {/* Header Section */}
      <Card
        sx={{
          background: '#137fec',
          color: 'white',
          p: 4,
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(19, 127, 236, 0.15)'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: alpha('#ffffff', 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <EmailOutlined sx={{ fontSize: 36 }} />
          </Box>
          <Box flex={1}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Create Email Template
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95 }}>
              Design professional email templates using our drag-and-drop editor
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} mb={4} justifyContent="flex-end" flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/email-templates')}
          sx={{
            borderColor: alpha('#137fec', 0.3),
            color: '#137fec',
            px: 3,
            py: 1.25,
            fontSize: '0.95rem',
            fontWeight: 500,
            borderRadius: 2,
            borderWidth: 1.5,
            textTransform: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#137fec',
              bgcolor: alpha('#137fec', 0.08),
              borderWidth: 1.5,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(19, 127, 236, 0.15)'
            }
          }}
        >
          Back to Templates
        </Button>
        <Button
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={togglePreview}
          sx={{
            borderColor: alpha('#137fec', 0.3),
            color: '#137fec',
            px: 3,
            py: 1.25,
            fontSize: '0.95rem',
            fontWeight: 500,
            borderRadius: 2,
            borderWidth: 1.5,
            textTransform: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#137fec',
              bgcolor: alpha('#137fec', 0.08),
              borderWidth: 1.5,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(19, 127, 236, 0.15)'
            }
          }}
        >
          {preview ? 'Hide Preview' : 'Show Preview'}
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            bgcolor: '#137fec',
            color: 'white',
            px: 4,
            py: 1.25,
            fontSize: '0.95rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(19, 127, 236, 0.35)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: '#0f6bd0',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(19, 127, 236, 0.45)'
            },
            '&:active': {
              transform: 'translateY(0px)',
              boxShadow: '0 2px 8px rgba(19, 127, 236, 0.35)'
            }
          }}
        >
          Save Template
        </Button>
      </Stack>

      {/* Template Name Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Stack spacing={2}>
          <Box>
            <FormLabel
              sx={{
                fontWeight: 600,
                fontSize: '0.95rem',
                mb: 1.5,
                display: 'block',
                color: 'text.primary'
              }}
            >
              Template Name *
            </FormLabel>
            <TextField
              fullWidth
              placeholder="Enter a descriptive name for your template"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '1rem',
                  '&:hover fieldset': {
                    borderColor: '#137fec'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#137fec',
                    borderWidth: 2
                  }
                }
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Editor Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            bgcolor: alpha('#137fec', 0.04),
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#137fec'
              }}
            />
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Email Template Editor
            </Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            height: '680px',
            bgcolor: '#f5f5f5'
          }}
        >
          <EmailEditor ref={emailEditorRef} />
        </Box>
      </Paper>

      {/* Help Section */}
      <Card
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          bgcolor: alpha('#137fec', 0.04),
          border: '1px solid',
          borderColor: alpha('#137fec', 0.1)
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: '#137fec',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              ?
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
              Getting Started
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Use the drag-and-drop editor to create professional email templates. Add content blocks from the right panel,
              customize text and images, and preview your design before saving. Your template will be saved with both the
              visual design and HTML code for easy editing later.
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Contact Developer Section */}
      <Card
        sx={{
          mt: 3,
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #137fec 0%, #0f6bd0 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: alpha('#ffffff', 0.1)
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: alpha('#ffffff', 0.08)
          }}
        />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" position="relative">
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              bgcolor: alpha('#ffffff', 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Need a Complex Custom Template?
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.95, lineHeight: 1.7 }}>
              Our development team can create sophisticated, custom email templates tailored to your business needs.
              Get professional assistance with advanced designs, dynamic content, and enterprise-level templates.
            </Typography>
          </Box>
          <Button
            variant="contained"
            href="mailto:support@ibms.com?subject=Custom Email Template Request&body=Hello, I would like to request a custom email template for my organization."
            sx={{
              bgcolor: 'white',
              color: '#137fec',
              px: 4,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(255, 255, 255, 0.25)',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              '&:hover': {
                bgcolor: alpha('#ffffff', 0.95),
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(255, 255, 255, 0.35)'
              },
              '&:active': {
                transform: 'translateY(0px)',
                boxShadow: '0 2px 8px rgba(255, 255, 255, 0.25)'
              }
            }}
          >
            Contact Developer
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default AddEmailTemplate;

