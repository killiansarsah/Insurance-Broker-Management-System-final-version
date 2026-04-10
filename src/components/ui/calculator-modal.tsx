'use client';

import { useState, useMemo } from 'react';
import { Modal } from './modal';
import {
    Calculator,
    ShieldCheck,
    ChevronRight,
    Car,
    Flame,
    Heart
} from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CustomSelect } from './select-custom';
import { LiquidFilters } from './liquid-filters';

interface CalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type CalculatorSection = 'MOTOR' | 'FIRE' | 'LIFE';

export function CalculatorModal({ isOpen, onClose }: CalculatorModalProps) {
    const [section, setSection] = useState<CalculatorSection>('MOTOR');

    // Form State (Shared and Specific)
    const [passengers, setPassengers] = useState<string>('');
    const [regYear, setRegYear] = useState<string>('');
    const [insuredValue, setInsuredValue] = useState<string>('');
    const [insuranceCompany, setInsuranceCompany] = useState<string | number | null>('');
    const [coverType, setCoverType] = useState<string | number | null>('');
    const [riskType, setRiskType] = useState<string | number | null>('');
    const [extraTppdl, setExtraTppdl] = useState<string>('');
    const [umbrellaLimit, setUmbrellaLimit] = useState<string>('');
    const [currency, setCurrency] = useState<string | number | null>('GHS');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Derived State
    const totalDays = useMemo(() => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = (end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return isNaN(diffDays) || diffDays < 0 ? 0 : diffDays;
    }, [startDate, endDate]);

    // Researched Data for Ghana (NIC Regulated)
    const companies = [
        { label: 'Enterprise Insurance', value: 'enterprise' },
        { label: 'Star Assurance', value: 'star' },
        { label: 'Hollard Ghana', value: 'hollard' },
        { label: 'SIC Insurance', value: 'sic' },
        { label: 'Vanguard Assurance', value: 'vanguard' },
        { label: 'GUA Insurance', value: 'gua' },
        { label: 'Phoenix Insurance', value: 'phoenix' },
        { label: 'Prime Insurance', value: 'prime' },
        { label: 'GLICO General', value: 'glico_general' },
        { label: 'Sunu Assurances', value: 'sunu' },
    ];

    const motorRiskTypes = [
        { label: 'Private Individual', value: 'private_individual' },
        { label: 'Private Corporate', value: 'private_corporate' },
        { label: 'Commercial - Taxi', value: 'taxi' },
        { label: 'Commercial - Mini Bus (TroTro)', value: 'mini_bus' },
        { label: 'Commercial - Bus', value: 'bus' },
        { label: 'Commercial - Truck/Tanker', value: 'truck' },
        { label: 'Ride-Hailing (Uber/Bolt)', value: 'ride_hailing' },
        { label: 'Motorcycle / Courier', value: 'motorcycle' },
        { label: 'Ambulance / Hearse', value: 'special_purpose' },
        { label: 'Driving School Vehicle', value: 'driving_school' },
    ];

    const fireRiskTypes = [
        { label: 'Commercial Building (Compulsory)', value: 'commercial_compulsory' },
        { label: 'Private Dwelling (Home)', value: 'private_dwelling' },
        { label: 'Industrial / Factory', value: 'industrial' },
        { label: 'Warehouse / Storage', value: 'warehouse' },
        { label: 'Public Building (Church/School)', value: 'public_building' },
        { label: 'Hotel / Restaurant', value: 'hospitality' },
    ];

    const lifeProductTypes = [
        { label: 'Term Life Assurance', value: 'term_life' },
        { label: 'Whole Life Policy', value: 'whole_life' },
        { label: 'Endowment Plan', value: 'endowment' },
        { label: 'Universal Life (Investment)', value: 'universal_life' },
        { label: 'Funeral Finance Plan', value: 'funeral' },
        { label: 'Mortgage Protection', value: 'mortgage' },
        { label: 'Group Life Scheme', value: 'group_life' },
    ];

    const motorCoverTypes = [
        { label: 'Third Party Only (TPO)', value: 'tpo' },
        { label: 'Third Party Fire & Theft (TPFT)', value: 'tpft' },
        { label: 'Comprehensive', value: 'COMPREHENSIVE' },
    ];

    const fireCoverTypes = [
        { label: 'Fire & Allied Perils', value: 'fire_allied' },
        { label: 'Assets All Risk (AAR)', value: 'aar' },
        { label: 'Homeowners Policy', value: 'homeowners' },
        { label: 'Fire & Burglary', value: 'fire_burglary' },
    ];

    const lifeCoverTypes = [
        { label: 'Standard Coverage', value: 'standard' },
        { label: 'Double Accident Benefit', value: 'double_accident' },
        { label: 'Critical Illness Rider', value: 'critical_illness' },
        { label: 'Waiver of Premium', value: 'waiver_premium' },
    ];

    const currencies = [
        { label: 'GHS - Ghana Cedi', value: 'GHS' },
        { label: 'USD - US Dollar', value: 'USD' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            className="overflow-visible"
        >
            <LiquidFilters />
            
            <div className="relative px-2 sm:px-6 pt-4 pb-8 flex flex-col min-h-full">
                
                {/* Header Decoration */}
                
                <div className="flex items-center gap-3 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Calculator size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                            Premium Calculator
                        </h2>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[2px] mt-1">Real-time Policy Quotes</p>
                    </div>
                </div>

                {/* Premium Tab Selector */}
                <div className="flex w-full mb-10 overflow-hidden rounded-[var(--radius-xl)] bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 p-1.5 shadow-inner backdrop-blur-md relative z-10">
                    {[
                        { id: 'MOTOR', icon: Car, label: 'Motor Vehicle' },
                        { id: 'FIRE', icon: Flame, label: 'Fire & Property' },
                        { id: 'LIFE', icon: Heart, label: 'Life Assurance' }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setSection(btn.id as CalculatorSection)}
                            className={cn(
                                "flex-1 relative flex items-center justify-center gap-2.5 py-4 text-xs font-black uppercase tracking-widest transition-all duration-500 z-10 rounded-[calc(var(--radius-xl)-6px)] outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                                section === btn.id
                                    ? "text-primary-700 dark:text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                            )}
                        >
                            {section === btn.id && (
                                <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[calc(var(--radius-xl)-6px)] -z-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/50 dark:border-slate-700 animate-in zoom-in-95 duration-300" />
                            )}
                            <btn.icon size={18} className={cn("transition-all duration-500", section === btn.id ? "scale-110 drop-shadow-md text-primary-500" : "opacity-70")} />
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 relative z-20">
                    {section === 'MOTOR' && (
                        <div className="space-y-2.5 group">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">Number of Passengers</label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={passengers}
                                    onChange={(e) => setPassengers(e.target.value)}
                                    className="h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary-500/20 text-lg font-bold rounded-2xl shadow-sm transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all text-primary-500">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    )}

                    {section === 'MOTOR' && (
                        <div className="space-y-2.5 group">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">Registration Year</label>
                            <Input
                                type="number"
                                placeholder="e.g. 2024"
                                value={regYear}
                                onChange={(e) => setRegYear(e.target.value)}
                                className="h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary-500/20 text-lg font-bold rounded-2xl shadow-sm transition-all"
                            />
                        </div>
                    )}

                    <div className="space-y-2.5 group md:col-span-2">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">
                            {section === 'LIFE' ? 'Sum Assured' : "Value to be Insured"} <span className="text-danger-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg pointer-events-none">
                                {currency === 'GHS' ? 'GH₵' : currency === 'USD' ? '$' : ''}
                            </span>
                            <Input
                                type="number"
                                placeholder={`Enter ${section === 'LIFE' ? 'sum assured' : 'insured value'}`}
                                value={insuredValue}
                                onChange={(e) => setInsuredValue(e.target.value)}
                                className="h-16 pl-[4.5rem] bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary-500/20 text-2xl font-black rounded-[var(--radius-xl)] shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5 group relative z-40">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">
                            Insurance Company <span className="text-danger-500">*</span>
                        </label>
                        <CustomSelect
                            options={companies}
                            value={insuranceCompany}
                            onChange={(val) => setInsuranceCompany(val)}
                            placeholder="Select Insurer"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2.5 group relative z-30">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">
                            Cover Type <span className="text-danger-500">*</span>
                        </label>
                        <CustomSelect
                            options={
                                section === 'MOTOR' ? motorCoverTypes :
                                    section === 'FIRE' ? fireCoverTypes :
                                        lifeCoverTypes
                            }
                            value={coverType}
                            onChange={(val) => setCoverType(val)}
                            placeholder="Select cover type"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2.5 group md:col-span-2 relative z-20">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">
                            {section === 'LIFE' ? 'Product Category' : 'Risk Type'} <span className="text-danger-500">*</span>
                        </label>
                        <CustomSelect
                            options={
                                section === 'MOTOR' ? motorRiskTypes :
                                    section === 'FIRE' ? fireRiskTypes :
                                        lifeProductTypes
                            }
                            value={riskType}
                            onChange={(val) => setRiskType(val)}
                            placeholder={`Select ${section === 'LIFE' ? 'product' : 'risk type'}`}
                            className="w-full"
                        />
                    </div>

                    {section === 'MOTOR' && (
                        <div className="space-y-2.5 group">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">Extra TPPDL</label>
                            <Input
                                placeholder="Enter extra TPPDL limit"
                                value={extraTppdl}
                                onChange={(e) => setExtraTppdl(e.target.value)}
                                className="h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary-500/20 text-base font-bold rounded-2xl shadow-sm transition-all"
                            />
                        </div>
                    )}

                    {section === 'MOTOR' && (
                        <div className="space-y-2.5 group">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">Umbrella Limit</label>
                            <Input
                                placeholder="Enter umbrella limit"
                                value={umbrellaLimit}
                                onChange={(e) => setUmbrellaLimit(e.target.value)}
                                className="h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary-500/20 text-base font-bold rounded-2xl shadow-sm transition-all"
                            />
                        </div>
                    )}

                    <div className="space-y-2.5 group md:col-span-2 relative z-10">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">
                            Currency <span className="text-danger-500">*</span>
                        </label>
                        <CustomSelect
                            options={currencies}
                            value={currency}
                            onChange={(val) => setCurrency(val)}
                            placeholder="GHS"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2.5 group">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">
                            Start Date <span className="text-danger-500">*</span>
                        </label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary-500/20 text-base font-bold rounded-2xl shadow-sm transition-all pr-4"
                        />
                    </div>

                    <div className="space-y-2.5 group">
                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary-500 transition-colors">
                            End Date <span className="text-danger-500">*</span>
                        </label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary-500/20 text-base font-bold rounded-2xl shadow-sm transition-all pr-4"
                        />
                    </div>
                </div>
                
                {/* Duration Receipt Box */}
                <div className="mt-10 bg-gradient-to-br from-primary-500/10 dark:from-primary-500/5 to-transparent p-6 sm:p-8 rounded-[var(--radius-xl)] border border-primary-500/20 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left transition-all hover:bg-primary-500/15 duration-500 shadow-inner group">
                    <div>
                        <h4 className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Total Duration</h4>
                        <p className="text-xs font-bold uppercase tracking-[2px] text-slate-500 mt-1">Based on selected dates</p>
                    </div>
                    <div className="text-6xl font-black text-primary-600 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)] tracking-tighter">
                        {totalDays} <span className="text-xl opacity-40 tracking-widest uppercase font-bold relative -top-3 ml-1">days</span>
                    </div>
                </div>

                <div className="mt-auto pt-10 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100/50 dark:border-slate-800/50">
                    <button
                        onClick={onClose}
                        className="px-8 py-5 rounded-[var(--radius-xl)] font-black uppercase tracking-[3px] text-xs transition-all duration-300 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => toast.success('Quote Calculated', { description: `Your ${section} quote has been generated successfully.` })}
                        className="shimmer-button flex-1 sm:flex-none flex items-center justify-center gap-3 px-12 py-5 rounded-[var(--radius-xl)] font-black uppercase tracking-[3px] text-sm text-white shadow-xl hover:-translate-y-1 transition-all active:scale-95 group focus:ring-4 focus:ring-primary-500/30 outline-none"
                    >
                        Calculate Quote
                        <ChevronRight size={18} strokeWidth={4} className="group-hover:translate-x-1.5 transition-transform" />
                    </button>
                </div>
            </div>
            


            <style jsx global>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    opacity: 0.5;
                    cursor: pointer;
                    transition: all 0.2s;
                    padding: 4px;
                    border-radius: 4px;
                }
                input[type="date"]::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                    background-color: var(--color-surface-200);
                    transform: scale(1.1);
                }
                .theme-dark input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    opacity: 0.7;
                }
            `}</style>
        </Modal>
    );
}
