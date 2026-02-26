
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Rating,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { apipost } from '../../services/api';
import { LeadStatus, LeadPriority, LeadSource } from '../../types';
import Iconify from '../../components/ui/Iconify';

interface AddLeadProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  phoneNumber: yup
    .string()
    .matches(/^[+]?[0-9\s-]{9,15}$/, 'Phone number is invalid')
    .required('Phone number is required'),
  emailAddress: yup.string().email('Invalid email').required('Email is required'),
  typeOfInsurance: yup.string().required('Insurance type is required'),
  assignedAgent: yup.string().required('Assigned Agent is required')
});

const AddLead: React.FC<AddLeadProps> = ({ open, onClose, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      emailAddress: '',
      address: '',
      leadSource: '',
      leadStatus: LeadStatus.New,
      leadScore: 0,
      typeOfInsurance: '',
      desiredCoverageAmount: '',
      leadPriority: LeadPriority.Medium,
      assignedAgent: 'user1',
      createdBy: 'user1'
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await apipost('lead/add', values);
        if (result && result.status === 201) {
          toast.success(result.data.message);
          formik.resetForm();
          onClose();
          onSuccess();
        }
      } catch (error) {
        console.error('Error adding lead:', error);
        toast.error('Failed to add lead');
      }
    }
  });

  const insuranceTypes = [
    { value: 'Motor', label: 'Motor Insurance', icon: 'hugeicons:car-02' },
    { value: 'Life', label: 'Life Insurance', icon: 'hugeicons:favourite' },
    { value: 'Health', label: 'Health Insurance', icon: 'hugeicons:hospital-02' },
    { value: 'Property', label: 'Property Insurance', icon: 'hugeicons:home-02' },
    { value: 'Travel', label: 'Travel Insurance', icon: 'hugeicons:airplane-01' },
    { value: 'Business', label: 'Business Insurance', icon: 'hugeicons:briefcase-02' },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          bgcolor: 'rgb(255, 255, 255)',
          '.dark &': { bgcolor: 'rgb(15, 23, 42)' }
        }
      }}
    >
      {/* Premium Header */}
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Iconify icon="hugeicons:user-add-01" className="text-8xl" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black uppercase tracking-tight">Create New Lead</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Insurance Pipeline Entry</p>
          </div>
          <button 
            onClick={onClose}
            className="size-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
          >
            <Iconify icon="hugeicons:cancel-01" className="text-xl" />
          </button>
        </div>
      </div>
      
      <DialogContent sx={{ p: 6, bgcolor: 'transparent' }}>
        <form className="flex flex-col gap-10">
          {/* Section 1: Contact Information */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Iconify icon="hugeicons:user-group" className="text-lg" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Personal & Contact Info</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name *</label>
                <input 
                  name="firstName"
                  className={`h-14 px-5 rounded-2xl border ${formik.touched.firstName && formik.errors.firstName ? 'border-rose-500 bg-rose-50/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'} font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                  placeholder="e.g. John" 
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                />
                {formik.touched.firstName && formik.errors.firstName && <span className="text-[10px] font-bold text-rose-500 ml-1">{formik.errors.firstName}</span>}
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name *</label>
                <input 
                  name="lastName"
                  className={`h-14 px-5 rounded-2xl border ${formik.touched.lastName && formik.errors.lastName ? 'border-rose-500 bg-rose-50/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'} font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                  placeholder="e.g. Mensah" 
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                />
                {formik.touched.lastName && formik.errors.lastName && <span className="text-[10px] font-bold text-rose-500 ml-1">{formik.errors.lastName}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number *</label>
                <div className="relative">
                  <Iconify icon="hugeicons:smart-phone-01" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="phoneNumber"
                    className={`w-full h-14 pl-12 pr-5 rounded-2xl border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-rose-500 bg-rose-50/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'} font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                    placeholder="+233..." 
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && <span className="text-[10px] font-bold text-rose-500 ml-1">{formik.errors.phoneNumber}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                <div className="relative">
                  <Iconify icon="hugeicons:mail-01" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="emailAddress"
                    className={`w-full h-14 pl-12 pr-5 rounded-2xl border ${formik.touched.emailAddress && formik.errors.emailAddress ? 'border-rose-500 bg-rose-50/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'} font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                    placeholder="example@email.com" 
                    value={formik.values.emailAddress}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.touched.emailAddress && formik.errors.emailAddress && <span className="text-[10px] font-bold text-rose-500 ml-1">{formik.errors.emailAddress}</span>}
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Address</label>
                <textarea 
                  name="address"
                  rows={2}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="Enter full physical address..." 
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

          {/* Section 2: Requirements & Evaluation */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Iconify icon="hugeicons:property-search" className="text-lg" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Requirements & Evaluation</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Insurance Type *</label>
                <select 
                  name="typeOfInsurance"
                  className={`h-14 px-5 rounded-2xl border ${formik.touched.typeOfInsurance && formik.errors.typeOfInsurance ? 'border-rose-500 bg-rose-50/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'} font-bold focus:border-primary transition-all`}
                  value={formik.values.typeOfInsurance}
                  onChange={formik.handleChange}
                >
                  <option value="">Select type...</option>
                  {insuranceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {formik.touched.typeOfInsurance && formik.errors.typeOfInsurance && <span className="text-[10px] font-bold text-rose-500 ml-1">{formik.errors.typeOfInsurance}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Desired Coverage (GH₵)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">GH₵</span>
                  <input 
                    type="number"
                    name="desiredCoverageAmount"
                    className="w-full h-14 pl-12 pr-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:border-primary transition-all"
                    placeholder="0.00" 
                    value={formik.values.desiredCoverageAmount}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Source</label>
                <select 
                  name="leadSource"
                  className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:border-primary transition-all"
                  value={formik.values.leadSource}
                  onChange={formik.handleChange}
                >
                  <option value="">Select source...</option>
                  {Object.values(LeadSource).map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                <select 
                  name="leadPriority"
                  className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:border-primary transition-all shadow-sm"
                  value={formik.values.leadPriority}
                  onChange={formik.handleChange}
                >
                  {Object.values(LeadPriority).map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Lead Rating</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Evaluate the potential of this lead</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Rating
                      name="leadScore"
                      precision={0.5}
                      value={formik.values.leadScore}
                      onChange={(_, newValue) => formik.setFieldValue('leadScore', newValue)}
                      sx={{ 
                        '& .MuiRating-iconFilled': { color: '#fbbf24' },
                        fontSize: '2rem'
                      }}
                    />
                    <span className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm">{formik.values.leadScore || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
      
      <DialogActions sx={{ p: 4, bgcolor: 'transparent', gap: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <button 
          onClick={() => { formik.resetForm(); onClose(); }} 
          className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={() => formik.handleSubmit()} 
          className="h-14 px-12 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Save & Register Lead
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLead;
