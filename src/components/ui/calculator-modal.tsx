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
import { CustomSelect } from './select-custom';
import { LiquidFilters } from './liquid-filters';

interface CalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type CalculatorSection = 'motor' | 'fire' | 'life';

export function CalculatorModal({ isOpen, onClose }: CalculatorModalProps) {
    const [section, setSection] = useState<CalculatorSection>('motor');

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
        { label: 'Comprehensive', value: 'comprehensive' },
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
            size="xl"
            className="overflow-visible"
        >
            <LiquidFilters />
            <div className="relative px-2">
                {/* Section Selector */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {[
                        { id: 'motor', icon: Car, label: 'Motor' },
                        { id: 'fire', icon: Flame, label: 'Fire' },
                        { id: 'life', icon: Heart, label: 'Life' }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setSection(btn.id as CalculatorSection)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 backdrop-blur-md border",
                                section === btn.id
                                    ? "bg-primary-500 text-white border-primary-400 shadow-lg scale-110"
                                    : "bg-white/40 text-slate-500 border-slate-200 hover:bg-white/60"
                            )}
                        >
                            <btn.icon size={14} className={cn(section === btn.id ? "animate-pulse" : "")} />
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Header with Icon */}
                <div className="flex items-center justify-center gap-2 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-8 h-8 rounded-full bg-success-50 text-success-500 flex items-center justify-center border border-success-100 shadow-sm">
                        <ShieldCheck size={18} fill="currentColor" fillOpacity={0.1} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                        {section.charAt(0).toUpperCase() + section.slice(1)} Quote Calculator
                    </h2>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {section === 'motor' && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-0.5">Number of Passengers</label>
                            <div className="relative group">
                                <Input
                                    type="number"
                                    placeholder="Enter number of passengers"
                                    value={passengers}
                                    onChange={(e) => setPassengers(e.target.value)}
                                    className="h-11 bg-white/30 backdrop-blur-xl border-slate-200 hover:border-warning-300 focus:border-warning-400 transition-all duration-500 rounded-xl shadow-sm group-hover:shadow-md"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 text-slate-300 group-focus-within:text-warning-500 transition-colors">
                                    <ChevronRight size={10} className="-rotate-90" />
                                    <ChevronRight size={10} className="rotate-90" />
                                </div>
                            </div>
                        </div>
                    )}

                    {section === 'motor' && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-0.5">Registration Year</label>
                            <Input
                                type="number"
                                placeholder="Enter registration year"
                                value={regYear}
                                onChange={(e) => setRegYear(e.target.value)}
                                className="h-11 bg-white/30 backdrop-blur-xl border-slate-200 hover:border-slate-300 focus:border-primary-400 transition-all duration-500 rounded-xl shadow-sm"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5">
                            {section === 'life' ? 'Sum Assured' : "Value to be Insured"}
                        </label>
                        <div className="relative group">
                            <Input
                                type="number"
                                placeholder={`Enter ${section === 'life' ? 'sum assured' : 'insured value'}`}
                                value={insuredValue}
                                onChange={(e) => setInsuredValue(e.target.value)}
                                className="h-11 bg-white/30 backdrop-blur-xl border-slate-200 hover:border-warning-300 focus:border-warning-400 transition-all duration-500 rounded-xl shadow-sm"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 text-slate-300 group-focus-within:text-warning-500 transition-colors">
                                <ChevronRight size={10} className="-rotate-90" />
                                <ChevronRight size={10} className="rotate-90" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 flex items-center gap-1">
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

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 flex items-center gap-1">
                            Cover Type <span className="text-danger-500">*</span>
                        </label>
                        <CustomSelect
                            options={
                                section === 'motor' ? motorCoverTypes :
                                    section === 'fire' ? fireCoverTypes :
                                        lifeCoverTypes
                            }
                            value={coverType}
                            onChange={(val) => setCoverType(val)}
                            placeholder="Select cover type"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 flex items-center gap-1">
                            {section === 'life' ? 'Product Category' : 'Risk Type'} <span className="text-danger-500">*</span>
                        </label>
                        <CustomSelect
                            options={
                                section === 'motor' ? motorRiskTypes :
                                    section === 'fire' ? fireRiskTypes :
                                        lifeProductTypes
                            }
                            value={riskType}
                            onChange={(val) => setRiskType(val)}
                            placeholder={`Select ${section === 'life' ? 'product' : 'risk type'}`}
                            className="w-full"
                        />
                    </div>

                    {section === 'motor' && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-0.5">Extra Third Party Property Damage Limit</label>
                            <Input
                                placeholder="Enter extra TPPDL"
                                value={extraTppdl}
                                onChange={(e) => setExtraTppdl(e.target.value)}
                                className="h-11 bg-white/30 backdrop-blur-xl border-slate-200 rounded-xl shadow-sm"
                            />
                        </div>
                    )}

                    {section === 'motor' && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-0.5">Umbrella Limit</label>
                            <Input
                                placeholder="Enter umbrella limit"
                                value={umbrellaLimit}
                                onChange={(e) => setUmbrellaLimit(e.target.value)}
                                className="h-11 bg-white/30 backdrop-blur-xl border-slate-200 rounded-xl shadow-sm"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 flex items-center gap-1">
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

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 flex items-center gap-1">
                            Start Date <span className="text-danger-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-11 bg-white/30 backdrop-blur-xl border-slate-200 rounded-xl shadow-sm pr-10 appearance-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5 flex items-center gap-1">
                            End Date <span className="text-danger-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-11 bg-white/30 backdrop-blur-xl border-slate-200 rounded-xl shadow-sm pr-10 appearance-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-0.5">Total Days</label>
                        <div className="h-11 bg-slate-100/50 backdrop-blur-md border border-slate-200 rounded-xl flex items-center px-4 text-slate-500 font-bold tracking-tight shadow-inner transition-all duration-500">
                            {totalDays}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-12 flex justify-end border-t border-slate-100/50 pt-8 animate-in fade-in zoom-in duration-1000">
                    <button
                        onClick={() => alert(`Calculating ${section} quote...`)}
                        className={cn(
                            "flex items-center gap-2 px-7 py-3 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg relative overflow-hidden group border-none outline-none",
                            "bg-gradient-to-r from-warning-400 to-warning-500 text-slate-900"
                        )}
                        style={{ filter: 'url(#liquid-glass-refraction)' }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                        Check Quote
                        <Calculator size={16} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Global Style for Date Inputs */}
            <style jsx global>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    opacity: 0.4;
                    cursor: pointer;
                    transition: all 0.2s;
                    padding: 5px;
                }
                input[type="date"]::-webkit-calendar-picker-indicator:hover {
                    opacity: 0.8;
                    transform: scale(1.2);
                }
            `}</style>
        </Modal>
    );
}
