'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Briefcase,
    CheckCircle2,
    Clock,
    AlertCircle,
    Filter,
    Plus,
    MoreVertical,
    Calendar,
    Check,
    Tag,
    Trash2,
    ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button, Modal } from '@/components/ui';
import { CustomSelect } from '@/components/ui/select-custom';
import { toast } from 'sonner';
import { StickyNoteTask } from '@/components/features/tasks/sticky-note-task';
import { RecycleBin } from '@/components/features/tasks/recycle-bin';
import { ArchiveModal } from '@/components/features/tasks/archive-modal';

import { AnimatePresence, motion } from 'framer-motion';

// Enhanced Mock Data including Priorities
interface Task {
    id: string;
    title: string;
    priority: 'hot' | 'warm' | 'cold';
    status: 'pending' | 'under_review' | 'registered';
    due: string;
    type: string;
    description: string;
    link: string;
    isCompleted?: boolean;
}

const INITIAL_TASKS: Task[] = [
    { id: 'task-1', title: 'Renewal: Acme Corp Policy #9882', priority: 'hot', status: 'pending', due: 'Today', type: 'General Insurance', description: 'Client needs renewal confirmation by COP to avoid gap in coverage.', link: '/dashboard/policies/pol-001' },
    { id: 'task-2', title: 'Claim Review: John Doe - Auto Incident', priority: 'warm', status: 'under_review', due: 'Tomorrow', type: 'Motor Insurance', description: 'Verify documents uploaded by the client matches NIC requirements.', link: '/dashboard/claims/clm-001' },
    { id: 'task-3', title: 'Follow-up: New Lead - TechStart Inc.', priority: 'cold', status: 'registered', due: 'Feb 18', type: 'Professional Liability', description: 'Initial intake completed. Waiting for risk assessment results.', link: '/dashboard/leads/ld-001' },
    { id: 'task-4', title: 'Endorsement: Goldfields Mining - Add Equipment', priority: 'hot', status: 'pending', due: 'Today', type: 'Engineering Insurance', description: 'Client purchased new excavation equipment worth GHS 2.4M. Needs immediate cover.', link: '/dashboard/policies/pol-002' },
    { id: 'task-5', title: 'Premium Collection: Sunrise Hotels Overdue', priority: 'hot', status: 'pending', due: 'Today', type: 'Fire Insurance', description: 'Premium 45 days overdue. Risk of policy cancellation per NIC guidelines.', link: '/dashboard/finance' },
    { id: 'task-6', title: 'Claim: Kwame Asante - Flood Damage', priority: 'hot', status: 'under_review', due: 'Today', type: 'Property Insurance', description: 'Heavy rainfall caused warehouse flooding. Loss adjuster report pending.', link: '/dashboard/claims/clm-002' },
    { id: 'task-7', title: 'KYC Update: Mensah Brothers Ltd', priority: 'warm', status: 'pending', due: 'Tomorrow', type: 'Compliance', description: 'Annual KYC refresh due. Request updated company registration documents.', link: '/dashboard/clients/CL-003' },
    { id: 'task-8', title: 'Quote: Ghana Ports Authority - Marine Cargo', priority: 'warm', status: 'under_review', due: 'Tomorrow', type: 'Marine Insurance', description: 'Prepare competitive quote for annual marine cargo coverage. GHS 15M sum insured.', link: '/dashboard/quotes' },
    { id: 'task-9', title: 'Renewal: Volta Aluminum Co. - Group Life', priority: 'hot', status: 'pending', due: 'Today', type: 'Life Insurance', description: 'Group life policy for 340 employees expires in 3 days. Urgent renewal needed.', link: '/dashboard/policies/pol-003' },
    { id: 'task-10', title: 'Document Upload: Adjei Transport Fleet', priority: 'cold', status: 'registered', due: 'Mar 2', type: 'Motor Insurance', description: 'Client submitted 12 new vehicle registration cards. Upload to system.', link: '/dashboard/documents' },
    { id: 'task-11', title: 'Commission Reconciliation: Q4 2025', priority: 'warm', status: 'under_review', due: 'Feb 28', type: 'Finance', description: 'Reconcile commission statements from SIC, Enterprise, and Star Assurance.', link: '/dashboard/commissions' },
    { id: 'task-12', title: 'Claim Settlement: Osei Farms - Crop Damage', priority: 'hot', status: 'under_review', due: 'Today', type: 'Agricultural Insurance', description: 'Loss adjuster approved GHS 180K settlement. Awaiting insurer transfer.', link: '/dashboard/claims/clm-003' },
    { id: 'task-13', title: 'New Client Onboarding: Tema Steel Works', priority: 'warm', status: 'registered', due: 'Feb 27', type: 'Industrial Insurance', description: 'Complete risk survey and proposal form for multi-peril industrial cover.', link: '/dashboard/clients/CL-004' },
    { id: 'task-14', title: 'Policy Delivery: Accra Mall - All Risks', priority: 'cold', status: 'registered', due: 'Mar 1', type: 'Property Insurance', description: 'Policy document ready. Schedule delivery to client management office.', link: '/dashboard/policies/pol-004' },
    { id: 'task-15', title: 'Renewal Notice: Ecobank Branch Network', priority: 'warm', status: 'pending', due: 'Feb 28', type: 'Bankers Blanket Bond', description: 'Send 30-day renewal notice for BBB covering 85 branches nationwide.', link: '/dashboard/renewals' },
    { id: 'task-16', title: 'Claim: Nana Ama - Motor Accident Kumasi', priority: 'hot', status: 'pending', due: 'Today', type: 'Motor Insurance', description: 'Client involved in accident on Kumasi-Accra highway. Police report obtained.', link: '/dashboard/claims/clm-004' },
    { id: 'task-17', title: 'Risk Survey: Takoradi Oil Refinery', priority: 'warm', status: 'under_review', due: 'Mar 3', type: 'Energy Insurance', description: 'Joint survey with loss control engineer. Prepare inspection checklist.', link: '/dashboard/leads/ld-002' },
    { id: 'task-18', title: 'Premium Financing: AngloGold Ashanti', priority: 'cold', status: 'registered', due: 'Mar 5', type: 'Premium Finance', description: 'Structure quarterly payment plan for GHS 4.2M annual premium.', link: '/dashboard/premium-financing' },
    { id: 'task-19', title: 'Complaint: Delayed Claim - Mrs. Boateng', priority: 'hot', status: 'pending', due: 'Today', type: 'Customer Service', description: 'Client escalated to NIC. Claim pending 60+ days. Immediate resolution required.', link: '/dashboard/complaints' },
    { id: 'task-20', title: 'Reinsurance Placement: Cocoa Board', priority: 'warm', status: 'under_review', due: 'Mar 4', type: 'Treaty Reinsurance', description: 'Facultative placement for excess layer. Approach Munich Re and Swiss Re.', link: '/dashboard/policies/pol-005' },
    { id: 'task-21', title: 'Staff Training: NIC Regulatory Update', priority: 'cold', status: 'registered', due: 'Mar 10', type: 'Internal', description: 'Prepare training materials on new NIC market conduct guidelines.', link: '/dashboard/team' },
    { id: 'task-22', title: 'Quote: University of Ghana - Group PA', priority: 'warm', status: 'pending', due: 'Feb 28', type: 'Personal Accident', description: 'Group personal accident cover for 2,500 students. Compare 4 insurer quotes.', link: '/dashboard/quotes' },
    { id: 'task-23', title: 'Renewal: MTN Ghana - Cyber Liability', priority: 'hot', status: 'pending', due: 'Tomorrow', type: 'Cyber Insurance', description: 'Annual cyber liability renewal. GHS 50M limit. Broker market for best terms.', link: '/dashboard/renewals' },
    { id: 'task-24', title: 'Claim Documents: Adom Logistics Fleet', priority: 'warm', status: 'under_review', due: 'Mar 1', type: 'Motor Insurance', description: 'Collate repair invoices and photos for 3 vehicle claims submitted this month.', link: '/dashboard/claims/clm-005' },
    { id: 'task-25', title: 'Client Meeting: Stanbic Bank Treasury', priority: 'cold', status: 'registered', due: 'Mar 6', type: 'Financial Lines', description: 'Presentation on Directors & Officers liability coverage options.', link: '/dashboard/calendar' },
    { id: 'task-26', title: 'Policy Amendment: GNPC - Increase Limit', priority: 'hot', status: 'pending', due: 'Today', type: 'Energy Insurance', description: 'Client acquired new offshore platform. Increase liability limit to USD 200M.', link: '/dashboard/policies/pol-006' },
    { id: 'task-27', title: 'Debit Note: Newmont Mining - Q1 2026', priority: 'warm', status: 'pending', due: 'Feb 28', type: 'Finance', description: 'Issue debit note for Q1 premium installment. GHS 890K due.', link: '/dashboard/finance' },
    { id: 'task-28', title: 'Lead Follow-up: Zipline Ghana Drones', priority: 'cold', status: 'registered', due: 'Mar 7', type: 'Aviation Insurance', description: 'Interested in drone fleet insurance. Prepare hull and liability proposal.', link: '/dashboard/leads/ld-003' },
    { id: 'task-29', title: 'Claim: Cape Coast Stadium Roof Collapse', priority: 'hot', status: 'under_review', due: 'Today', type: 'Contractors All Risk', description: 'Major loss event. Coordinate with loss adjusters and reinsurers immediately.', link: '/dashboard/claims/clm-006' },
    { id: 'task-30', title: 'Compliance: AML Report Submission', priority: 'hot', status: 'pending', due: 'Tomorrow', type: 'Compliance', description: 'Quarterly anti-money laundering report due to Financial Intelligence Centre.', link: '/dashboard/compliance' },
    { id: 'task-31', title: 'Renewal Pack: Vodafone Ghana - All Lines', priority: 'warm', status: 'under_review', due: 'Mar 2', type: 'Multi-Line', description: 'Prepare comprehensive renewal pack covering property, liability, motor, and marine.', link: '/dashboard/renewals' },
    { id: 'task-32', title: 'Quote: ECG - Public Liability', priority: 'cold', status: 'registered', due: 'Mar 8', type: 'Liability Insurance', description: 'Public liability cover for electrical infrastructure. High-risk exposure.', link: '/dashboard/quotes' },
    { id: 'task-33', title: 'Premium Reminder: Melcom Group 2nd Installment', priority: 'warm', status: 'pending', due: 'Mar 1', type: 'Property Insurance', description: 'Second quarterly installment due. Send friendly reminder to CFO.', link: '/dashboard/finance' },
    { id: 'task-34', title: 'Claim Rejection Appeal: Kumasi Brewery', priority: 'hot', status: 'under_review', due: 'Tomorrow', type: 'Business Interruption', description: 'Insurer rejected BI claim. Prepare appeal with supporting documentation.', link: '/dashboard/claims/clm-007' },
    { id: 'task-35', title: 'New Product: Parametric Weather Insurance', priority: 'cold', status: 'registered', due: 'Mar 12', type: 'Agricultural Insurance', description: 'Develop parametric product proposal for smallholder farmers program.', link: '/dashboard/leads/ld-004' },
    { id: 'task-36', title: 'Broker Agreement: Allianz Partnership', priority: 'warm', status: 'under_review', due: 'Mar 3', type: 'Business Development', description: 'Review and sign updated brokerage agreement with Allianz Insurance.', link: '/dashboard/documents' },
    { id: 'task-37', title: 'Renewal: Tullow Oil Ghana - Offshore', priority: 'hot', status: 'pending', due: 'Today', type: 'Energy Insurance', description: 'USD 500M offshore energy program. London market placement required.', link: '/dashboard/renewals' },
    { id: 'task-38', title: 'Client Visit: Tema Harbour Authority', priority: 'cold', status: 'registered', due: 'Mar 9', type: 'Marine Insurance', description: 'Annual portfolio review meeting. Prepare loss history and market update.', link: '/dashboard/calendar' },
    { id: 'task-39', title: 'Certificate Request: Dangote Cement Ghana', priority: 'warm', status: 'pending', due: 'Feb 28', type: 'Property Insurance', description: 'Client needs insurance certificate for bank loan application. Urgent.', link: '/dashboard/documents' },
    { id: 'task-40', title: 'Claim: GRIDCo Transformer Explosion', priority: 'hot', status: 'pending', due: 'Today', type: 'Engineering Insurance', description: 'Major transformer failure at Aboadze substation. Estimated loss GHS 8M.', link: '/dashboard/claims/clm-008' },
    { id: 'task-41', title: 'Underwriting Info: Kasapreko Expansion', priority: 'warm', status: 'under_review', due: 'Mar 2', type: 'Property Insurance', description: 'New bottling plant construction. Gather fire protection and building specs.', link: '/dashboard/leads/ld-005' },
    { id: 'task-42', title: 'Commission Follow-up: Enterprise Insurance', priority: 'cold', status: 'registered', due: 'Mar 5', type: 'Finance', description: 'Outstanding commission of GHS 45K for 3 months. Escalate to management.', link: '/dashboard/commissions' },
    { id: 'task-43', title: 'Policy Wording Review: Fidelity Bond', priority: 'warm', status: 'under_review', due: 'Mar 1', type: 'Financial Lines', description: 'Review updated fidelity guarantee wording from Hollard Insurance.', link: '/dashboard/documents' },
    { id: 'task-44', title: 'Renewal: Ghana Cocobod - Warehouse Stock', priority: 'hot', status: 'pending', due: 'Tomorrow', type: 'Stock Insurance', description: 'Warehouse stock cover for 600K metric tons of cocoa beans. High season.', link: '/dashboard/renewals' },
    { id: 'task-45', title: 'Lead: Jospong Group - Waste Management', priority: 'cold', status: 'registered', due: 'Mar 11', type: 'Environmental Liability', description: 'Environmental liability and fleet cover for waste management operations.', link: '/dashboard/leads/ld-006' },
    { id: 'task-46', title: 'Claim Update: Hotel Kempinski Accra', priority: 'warm', status: 'under_review', due: 'Mar 3', type: 'Property Insurance', description: 'Water damage claim. Specialist restoration company engaged. Update client.', link: '/dashboard/claims/clm-009' },
    { id: 'task-47', title: 'Quote Comparison: Ghana Airport Co.', priority: 'hot', status: 'pending', due: 'Tomorrow', type: 'Aviation Insurance', description: 'Compare quotes from 5 insurers for airport operators liability cover.', link: '/dashboard/quotes' },
    { id: 'task-48', title: 'NIC Returns: Monthly Statistical Report', priority: 'warm', status: 'pending', due: 'Mar 1', type: 'Compliance', description: 'Compile and submit monthly production statistics to NIC portal.', link: '/dashboard/compliance' },
    { id: 'task-49', title: 'Renewal: GOIL Filling Stations Network', priority: 'warm', status: 'under_review', due: 'Mar 4', type: 'Fire Insurance', description: 'Property and BI cover for 350+ filling stations. Negotiate improved terms.', link: '/dashboard/renewals' },
    { id: 'task-50', title: 'Client Complaint: Slow Response - Adom Group', priority: 'hot', status: 'pending', due: 'Today', type: 'Customer Service', description: 'Client unhappy with claim handling turnaround. Schedule urgent meeting.', link: '/dashboard/complaints' },
    { id: 'task-51', title: 'Travel Insurance: Parliament Delegation', priority: 'cold', status: 'registered', due: 'Mar 8', type: 'Travel Insurance', description: 'Group travel cover for 15-member delegation to Brussels. Depart in 2 weeks.', link: '/dashboard/policies/pol-007' },
    { id: 'task-52', title: 'Loss Control: Accra Brewery Fire Safety', priority: 'warm', status: 'under_review', due: 'Mar 3', type: 'Risk Management', description: 'Annual fire safety audit and loss control recommendations report.', link: '/dashboard/documents' },
    { id: 'task-53', title: 'Renewal: Standard Chartered - BBB & PI', priority: 'hot', status: 'pending', due: 'Tomorrow', type: 'Financial Lines', description: "Bankers Blanket Bond and Professional Indemnity. Combined limit USD 25M.", link: '/dashboard/renewals' },
    { id: 'task-54', title: 'New Vehicle Addition: Bolt Ghana Fleet', priority: 'cold', status: 'registered', due: 'Mar 6', type: 'Motor Insurance', description: 'Add 50 new vehicles to existing fleet policy. Process endorsement.', link: '/dashboard/policies/pol-008' },
    { id: 'task-55', title: 'Reinsurance Treaty: Proportional Review', priority: 'warm', status: 'under_review', due: 'Mar 5', type: 'Treaty Reinsurance', description: 'Annual proportional treaty review with reinsurance brokers in London.', link: '/dashboard/policies/pol-009' },
    { id: 'task-56', title: 'Claim: Shoprite Accra Mall Theft', priority: 'hot', status: 'pending', due: 'Today', type: 'All Risks Insurance', description: 'Armed robbery incident. Stock and cash loss estimated at GHS 320K.', link: '/dashboard/claims/clm-010' },
    { id: 'task-57', title: 'Proposal: Ghana Water Company', priority: 'cold', status: 'registered', due: 'Mar 10', type: 'Public Liability', description: 'Comprehensive public liability and asset cover for water infrastructure.', link: '/dashboard/leads/ld-007' },
    { id: 'task-58', title: 'Premium Allocation: Multi-Line Package', priority: 'warm', status: 'pending', due: 'Mar 1', type: 'Finance', description: 'Allocate premiums across property, motor, and liability for Unilever Ghana.', link: '/dashboard/finance' },
    { id: 'task-59', title: 'Claim Follow-up: Maxmart Warehouse Fire', priority: 'hot', status: 'under_review', due: 'Today', type: 'Fire Insurance', description: 'Major fire loss. Loss adjuster interim report expected this week.', link: '/dashboard/claims/clm-011' },
    { id: 'task-60', title: 'Client Retention: Nestle Ghana Lapsing', priority: 'hot', status: 'pending', due: 'Tomorrow', type: 'Corporate Account', description: 'Client considering switching brokers. Schedule executive-level meeting.', link: '/dashboard/clients/CL-010' },
    { id: 'task-61', title: 'Quote: Meridian Port Services - Liability', priority: 'warm', status: 'under_review', due: 'Mar 4', type: 'Marine Insurance', description: 'Port operators liability and stevedoring cover. High-value exposure.', link: '/dashboard/quotes' },
    { id: 'task-62', title: 'Document Archival: 2025 Expired Policies', priority: 'cold', status: 'registered', due: 'Mar 15', type: 'Administration', description: 'Archive expired 2025 policy documents per NIC record retention rules.', link: '/dashboard/documents' },
    { id: 'task-63', title: 'Renewal: Ghana Armed Forces - Group Life', priority: 'hot', status: 'pending', due: 'Today', type: 'Life Insurance', description: 'Group life and PA cover for 15,000 personnel. Sensitive government account.', link: '/dashboard/renewals' },
    { id: 'task-64', title: 'Market Intelligence: Motor Tariff Changes', priority: 'cold', status: 'registered', due: 'Mar 12', type: 'Research', description: 'NIC proposing revised motor tariff structure. Analyze impact on portfolio.', link: '/dashboard/reports' },
    { id: 'task-65', title: 'Endorsement: Calbank - Add New Branch', priority: 'warm', status: 'pending', due: 'Mar 2', type: 'Property Insurance', description: 'New Takoradi branch opened. Add to existing property schedule.', link: '/dashboard/policies/pol-010' },
];

function MetricCard({ label, value, icon, colorClass, status, trend }: { label: string; value: string; icon: React.ReactNode; colorClass: string; status: string; trend?: string }) {
    return (
        <Card padding="md" className="relative overflow-hidden group hover:border-primary-300 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">{label}</p>
                    <h3 className={cn("text-3xl font-bold mt-1 tracking-tight", colorClass)}>{value}</h3>
                </div>
                <div className={cn("p-2 rounded-lg bg-surface-50 group-hover:bg-primary-50 transition-colors", status === 'urgent' ? 'text-danger-500' : status === 'pending' ? 'text-accent-500' : 'text-success-500')}>
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-success-600 bg-success-50 px-1.5 py-0.5 rounded">↑ {trend || '12%'}</span>
                <span className="text-[10px] text-surface-400 font-medium italic">vs last month</span>
            </div>
        </Card>
    );
}

export default function TasksPage() {
    const [taskList, setTaskList] = useState<Task[]>(INITIAL_TASKS);
    const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
    const [completedCount, setCompletedCount] = useState(28);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'desk' | 'list'>('desk');
    const [crumplingTaskId, setCrumplingTaskId] = useState<string | null>(null);
    const [binHovered, setBinHovered] = useState(false);
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [justTrashed, setJustTrashed] = useState(false);
    const binRef = useRef<HTMLDivElement>(null);
    const deskScrollRef = useRef<HTMLDivElement>(null);
    // Filters State

    // Filters State
    const [activeFilters, setActiveFilters] = useState({
        priority: 'all',
        status: 'all',
        type: 'all'
    });

    // New Task Form State
    const [newTask, setNewTask] = useState<{
        title: string;
        priority: 'hot' | 'warm' | 'cold';
        type: string;
        description: string;
        due: string;
    }>({
        title: '',
        priority: 'warm',
        type: '',
        description: '',
        due: 'Next Week'
    });

    const filteredTasks = taskList.filter(task => {
        if (activeFilters.priority !== 'all' && task.priority !== activeFilters.priority) return false;
        if (activeFilters.status !== 'all' && task.status !== activeFilters.status) return false;
        if (activeFilters.type !== 'all' && !task.type.toLowerCase().includes(activeFilters.type.toLowerCase())) return false;
        return true;
    });

    const handleDeskScroll = () => {
        if (!deskScrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = deskScrollRef.current;
        const hasMore = scrollHeight - scrollTop - clientHeight > 20;
        setShowScrollIndicator(hasMore);
    };

    useEffect(() => {
        if (viewMode === 'desk') {
            handleDeskScroll();
            const container = deskScrollRef.current;
            if (container) {
                container.addEventListener('scroll', handleDeskScroll);
                return () => container.removeEventListener('scroll', handleDeskScroll);
            }
        }
    }, [filteredTasks, viewMode]);

    const handleComplete = (taskId: string) => {
        const task = taskList.find(t => t.id === taskId);
        if (task) {
            setTaskList(prev => prev.filter(t => t.id !== taskId));
            setArchivedTasks(prev => [{ ...task, isCompleted: true }, ...prev]);
            setCompletedCount(prev => prev + 1);

            // Remove from selection if it was selected
            if (selectedTaskIds.has(taskId)) {
                const newSelection = new Set(selectedTaskIds);
                newSelection.delete(taskId);
                setSelectedTaskIds(newSelection);
            }

            toast.success('Task Archived', {
                description: task.title,
                icon: <CheckCircle2 className="text-success-500" />
            });
        }
    };

    const handleDelete = (taskId: string) => {
        const task = taskList.find(t => t.id === taskId);
        if (task) {
            setTaskList(prev => prev.filter(t => t.id !== taskId));

            // Remove from selection if it was selected
            if (selectedTaskIds.has(taskId)) {
                const newSelection = new Set(selectedTaskIds);
                newSelection.delete(taskId);
                setSelectedTaskIds(newSelection);
            }

            toast.error('Task Deleted', {
                description: task.title,
                icon: <Trash2 className="text-danger-500" />
            });
        }
    };

    const toggleTaskSelection = (taskId: string) => {
        setSelectedTaskIds(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            } else {
                next.add(taskId);
            }
            return next;
        });
    };

    const toggleAllSelection = () => {
        if (selectedTaskIds.size === filteredTasks.length) {
            setSelectedTaskIds(new Set());
        } else {
            setSelectedTaskIds(new Set(filteredTasks.map(t => t.id)));
        }
    };

    const handleBulkArchive = () => {
        const selectedTasks = taskList.filter(t => selectedTaskIds.has(t.id));
        setTaskList(prev => prev.filter(t => !selectedTaskIds.has(t.id)));
        setArchivedTasks(prev => [...selectedTasks.map(t => ({ ...t, isCompleted: true })), ...prev]);
        setCompletedCount(prev => prev + selectedTasks.length);
        setSelectedTaskIds(new Set());
        toast.success(`Archived ${selectedTasks.length} tasks`);
    };

    const handleBulkDelete = () => {
        const count = selectedTaskIds.size;
        setTaskList(prev => prev.filter(t => !selectedTaskIds.has(t.id)));
        setSelectedTaskIds(new Set());
        toast.error(`Deleted ${count} tasks`);
    };

    const handleRestore = (taskId: string) => {
        const task = archivedTasks.find(t => t.id === taskId);
        if (task) {
            setArchivedTasks(prev => prev.filter(t => t.id !== taskId));
            setTaskList(prev => [{ ...task, isCompleted: false }, ...prev]);
            setCompletedCount(prev => Math.max(0, prev - 1));

            toast.success('Task Restored', {
                description: task.title,
                icon: <Plus className="text-primary-500" />
            });
        }
    };

    const handleEmptyBin = () => {
        setArchivedTasks([]);
        toast.error('Bin Emptied', {
            description: 'All archived records have been permanently removed.'
        });
    };

    const handleDrag = (point: { x: number; y: number }, taskId: string) => {
        if (!binRef.current) return;
        const binRect = binRef.current.getBoundingClientRect();

        // info.point is in PAGE coords (includes scroll); getBoundingClientRect is in VIEWPORT coords.
        // Normalise by subtracting scroll offset.
        const viewportX = point.x - window.scrollX;
        const viewportY = point.y - window.scrollY;

        const centerX = binRect.left + binRect.width / 2;
        const centerY = binRect.top + binRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(viewportX - centerX, 2) +
            Math.pow(viewportY - centerY, 2)
        );

        // gasping threshold — bin "notices" the note approaching
        if (distance < 250) {
            setCrumplingTaskId(taskId);
        } else {
            setCrumplingTaskId(null);
        }

        // isOver threshold — note is close enough to drop
        const isOver = distance < 120;
        if (isOver !== binHovered) {
            setBinHovered(isOver);
        }
    };

    const handleDragEnd = (taskId: string, point: { x: number; y: number }) => {
        setBinHovered(false);

        if (!binRef.current) {
            setCrumplingTaskId(null);
            return;
        }
        const binRect = binRef.current.getBoundingClientRect();

        // Normalise page → viewport coords (same fix as handleDrag)
        const viewportX = point.x - window.scrollX;
        const viewportY = point.y - window.scrollY;

        const centerX = binRect.left + binRect.width / 2;
        const centerY = binRect.top + binRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(viewportX - centerX, 2) +
            Math.pow(viewportY - centerY, 2)
        );

        // Match the 120px threshold used in handleDrag
        if (distance < 120) {
            // Keep crumpling active so the note visually shrinks before removal
            setCrumplingTaskId(taskId);
            setJustTrashed(true);
            setTimeout(() => {
                handleComplete(taskId);
                setCrumplingTaskId(null);
            }, 500);
            setTimeout(() => setJustTrashed(false), 1000);
        } else {
            setCrumplingTaskId(null);
        }
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        const entry: Task = {
            id: `task-${Date.now()}`,
            title: newTask.title || 'Untitled Task',
            priority: newTask.priority,
            status: 'pending',
            due: newTask.due,
            type: newTask.type || 'General',
            description: newTask.description,
            link: '/dashboard/tasks',
            isCompleted: false
        };

        setTaskList([entry, ...taskList]);
        setIsCreateModalOpen(false);
        setNewTask({ title: '', priority: 'warm', type: '', description: '', due: 'Next Week' });
        toast.success('New task created', {
            description: entry.title
        });
    };

    const resetFilters = () => {
        setActiveFilters({ priority: 'all', status: 'all', type: 'all' });
        setIsFilterModalOpen(false);
        toast.info('Filters cleared', {
            description: 'Showing all active workflow tasks.'
        });
    };

    return (
        <div className="space-y-6 animate-fade-in w-full" style={{ maxWidth: '72rem', margin: '0 auto' }}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[var(--radius-lg)] shadow-sm border border-surface-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-inner">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">My Desk</h1>
                        <p className="text-sm text-surface-500 mt-1">Operational Command Center & Workflow queue</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex items-center bg-surface-100 p-1 rounded-lg border border-surface-200 mr-2">
                        <button
                            onClick={() => setViewMode('desk')}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-300",
                                viewMode === 'desk' ? "bg-white text-primary-600 shadow-sm" : "text-surface-500 hover:text-surface-700"
                            )}
                        >
                            Desk
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-300",
                                viewMode === 'list' ? "bg-white text-primary-600 shadow-sm" : "text-surface-500 hover:text-surface-700"
                            )}
                        >
                            List
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Filter size={14} />}
                            onClick={() => setIsFilterModalOpen(true)}
                            className={cn(Object.values(activeFilters).some(v => v !== 'all') && "border-primary-500 bg-primary-50 text-primary-700")}
                        >
                            Filter {Object.values(activeFilters).some(v => v !== 'all') && '•'}
                        </Button>
                        <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsCreateModalOpen(true)}>Create Task</Button>
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Urgent Tasks"
                    value={taskList.filter(t => t.priority === 'hot' && !t.isCompleted).length.toString().padStart(2, '0')}
                    status="urgent"
                    icon={<AlertCircle size={20} />}
                    colorClass="text-danger-600"
                />
                <MetricCard
                    label="Pending Review"
                    value={taskList.filter(t => !t.isCompleted).length.toString().padStart(2, '0')}
                    status="pending"
                    icon={<Clock size={20} />}
                    colorClass="text-accent-600"
                />
                <MetricCard
                    label="Closed (Monthly)"
                    value={completedCount.toString()}
                    status="completed"
                    icon={<CheckCircle2 size={20} />}
                    colorClass="text-success-600"
                    trend="5%"
                />
            </div>


            {/* Conditional Interface Rendering */}
            {viewMode === 'desk' ? (
                /* Interactive Desk Area - Scrollable */
                <div className="relative h-[700px] bg-surface-50/50 rounded-[40px] border border-surface-200/50 shadow-inner overflow-hidden flex flex-col group/desk">
                    {/* Desk Background Decoration */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

                    {/* Scrollable Workspace Container */}
                    <div
                        ref={deskScrollRef}
                        onScroll={handleDeskScroll}
                        className="flex-1 overflow-y-auto custom-scrollbar-subtle scroll-smooth p-8 pt-0 relative"
                        id="desk-scroll-container"
                    >
                        {/* Sticky Header Wrapper */}
                        <div className="sticky top-0 z-30 pt-8 pb-4">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                    <h2 className="text-xl font-bold text-surface-900 tracking-tight">Daily Workspace</h2>
                                    <p className="text-xs text-surface-500 font-medium italic opacity-70">
                                        Drag and crumple papers into the glass bin when finished
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {selectedTaskIds.size > 0 && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50/80 backdrop-blur-md rounded-xl border border-primary-200/50 shadow-sm animate-in zoom-in-95 duration-200 relative z-20">
                                            <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest mr-2">
                                                {selectedTaskIds.size} Marked
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-3 bg-white border-primary-200 text-primary-600 hover:bg-primary-50 font-bold text-[9px] uppercase tracking-wider"
                                                onClick={handleBulkArchive}
                                            >
                                                Archive
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-3 bg-white border-danger-200 text-danger-600 hover:bg-danger-50 font-bold text-[9px] uppercase tracking-wider"
                                                onClick={handleBulkDelete}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )}

                                    {/* Animated Recycle Bin */}
                                    <div ref={binRef} className="relative mr-8">
                                        {/* Localized blur backdrop behind bin */}
                                        <div className="absolute -inset-6 -top-8 -bottom-4 rounded-3xl bg-gradient-to-b from-surface-50/90 via-surface-50/70 to-surface-50/20 backdrop-blur-md -z-10" />
                                        <div className="absolute -inset-6 -top-8 -bottom-4 rounded-3xl bg-gradient-to-t from-transparent via-transparent to-surface-100/40 -z-10 pointer-events-none" />
                                        <RecycleBin
                                            isOver={binHovered}
                                            isEmpty={archivedTasks.length === 0}
                                            onClick={() => setIsArchiveModalOpen(true)}
                                            isGasping={crumplingTaskId !== null}
                                            justTrashed={justTrashed}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Task Notes Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-8">
                            <AnimatePresence>
                                {filteredTasks.map((task) => (
                                    <StickyNoteTask
                                        key={task.id}
                                        task={task}
                                        isCrumpled={crumplingTaskId === task.id}
                                        isSelected={selectedTaskIds.has(task.id)}
                                        onToggleSelection={toggleTaskSelection}
                                        onDelete={handleDelete}
                                        onDrag={handleDrag}
                                        onDragEnd={handleDragEnd}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <AnimatePresence>
                        {showScrollIndicator && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                onClick={() => {
                                    deskScrollRef.current?.scrollBy({ top: 300, behavior: 'smooth' });
                                }}
                                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-md border border-surface-200 shadow-lg px-4 py-2 rounded-full flex items-center gap-2 text-primary-600 hover:bg-primary-50 transition-all group"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">More Tasks Below</span>
                                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div className="p-4 border-t border-surface-100 bg-white/40 backdrop-blur-sm text-center relative z-10">
                        <div className="flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                            <span className="text-[10px] font-black text-surface-500 uppercase tracking-widest">
                                Real-time Operational Sync Active
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                /* Classic Dashboard List View - Completely different interface */
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <div>
                            <h2 className="text-xl font-bold text-surface-900 tracking-tight">Active Workflow Pipeline</h2>
                            <p className="text-sm text-surface-500 mt-1">Manage and track your operational task queue</p>
                        </div >
                        <div className="flex items-center gap-2">
                            {selectedTaskIds.size > 0 && (
                                <div className="flex items-center gap-2 mr-4 px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100 animate-in fade-in slide-in-from-right-4">
                                    <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest mr-2">
                                        {selectedTaskIds.size} Selected
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-3 bg-white border-primary-200 text-primary-600 hover:bg-primary-50 font-bold text-[9px] uppercase tracking-wider"
                                        onClick={handleBulkArchive}
                                    >
                                        Archive All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-3 bg-white border-danger-200 text-danger-600 hover:bg-danger-50 font-bold text-[9px] uppercase tracking-wider"
                                        onClick={handleBulkDelete}
                                    >
                                        Delete All
                                    </Button>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white"
                                onClick={() => setIsArchiveModalOpen(true)}
                            >
                                View Archive ({archivedTasks.length})
                            </Button>
                        </div>
                    </div >

                    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-surface-50/50 border-b border-surface-200 grid grid-cols-12 gap-4 text-[10px] font-black text-surface-400 uppercase tracking-widest items-center">
                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={toggleAllSelection}
                                    className={cn(
                                        "w-4 h-4 rounded border transition-all flex items-center justify-center",
                                        selectedTaskIds.size === filteredTasks.length && filteredTasks.length > 0
                                            ? "bg-primary-600 border-primary-600 text-white"
                                            : "bg-white border-surface-300 hover:border-primary-400"
                                    )}
                                >
                                    {selectedTaskIds.size === filteredTasks.length && filteredTasks.length > 0 && <Check size={10} strokeWidth={4} />}
                                </button>
                            </div>
                            <div className="col-span-5">Task Details</div>
                            <div className="col-span-2">Category</div>
                            <div className="col-span-2">Due Date</div>
                            <div className="col-span-2 text-right px-2">Actions</div>
                        </div>

                        <div className="divide-y divide-surface-100">
                            <AnimatePresence mode="popLayout">
                                {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className={cn(
                                            "grid grid-cols-12 gap-4 p-4 items-center transition-colors group",
                                            selectedTaskIds.has(task.id) ? "bg-primary-50/30" : "hover:bg-surface-50"
                                        )}
                                    >
                                        <div className="col-span-1 flex justify-center">
                                            <button
                                                onClick={() => toggleTaskSelection(task.id)}
                                                className={cn(
                                                    "w-4 h-4 rounded border transition-all flex items-center justify-center",
                                                    selectedTaskIds.has(task.id)
                                                        ? "bg-primary-600 border-primary-600 text-white"
                                                        : "bg-white border-surface-300 hover:border-primary-400"
                                                )}
                                            >
                                                {selectedTaskIds.has(task.id) && <Check size={10} strokeWidth={4} />}
                                            </button>
                                        </div>

                                        <div className="col-span-5 flex items-center gap-3">
                                            <div className={cn(
                                                "w-1 h-8 rounded-full flex-shrink-0",
                                                task.priority === 'hot' ? "bg-danger-500" : task.priority === 'warm' ? "bg-accent-500" : "bg-primary-500"
                                            )} />
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-surface-900 leading-none truncate">{task.title}</h4>
                                                <p className="text-[10px] text-surface-400 mt-1 truncate max-w-[250px] font-medium italic">{task.description}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <span className="px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 font-bold text-[9px] uppercase tracking-wider">
                                                {task.type}
                                            </span>
                                        </div>

                                        <div className="col-span-2">
                                            <span className="text-[11px] font-semibold text-surface-600 flex items-center gap-1.5">
                                                <Clock size={10} className="text-surface-400" />
                                                {task.due}
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex justify-end gap-1 px-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 text-success-600 hover:bg-success-50"
                                                onClick={() => handleComplete(task.id)}
                                                title="Mark as Done"
                                            >
                                                <Check size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 text-danger-400 hover:bg-danger-50 hover:text-danger-600"
                                                onClick={() => handleDelete(task.id)}
                                                title="Delete Permanently"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-surface-300 hover:text-surface-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="py-20 text-center">
                                        <p className="text-surface-400 font-bold uppercase tracking-widest text-xs">No active tasks found</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div >
            )
            }

            {/* Enhanced Create Task Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Workflow Task"
                description="Assign a new operational task to your dashboard queue."
                size="xl"
                className="overflow-visible"
                footer={
                    <div className="flex justify-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="py-3 px-8 rounded-[var(--radius-2xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer text-sm"
                        >
                            Discard
                        </button>
                        <button
                            form="create-task-form"
                            type="submit"
                            className="py-3 px-12 rounded-[var(--radius-2xl)] bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer text-sm"
                        >
                            Create Task
                        </button>
                    </div>
                }
            >
                <form id="create-task-form" onSubmit={handleAddTask} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Tag size={12} className="text-primary-500" />
                                Task Title
                            </label>
                            <input
                                autoFocus
                                placeholder="e.g., Renewal: XYZ Corp"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                required
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-900 shadow-sm placeholder:text-surface-400 bg-white/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Briefcase size={12} className="text-primary-500" />
                                Insurance Type / Category
                            </label>
                            <input
                                placeholder="e.g., Motor Comprehensive, Health, Life..."
                                value={newTask.type}
                                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 bg-white/50 shadow-sm placeholder:text-surface-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <AlertCircle size={12} className="text-danger-500" />
                                Priority
                            </label>
                            <CustomSelect
                                options={[
                                    { label: '🔥 Hot (Urgent)', value: 'hot' },
                                    { label: '⚡ Warm (Normal)', value: 'warm' },
                                    { label: '❄️ Cold (Low)', value: 'cold' },
                                ]}
                                value={newTask.priority}
                                onChange={(v) => setNewTask({ ...newTask, priority: v as 'hot' | 'warm' | 'cold' })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Calendar size={12} className="text-accent-500" />
                                Due Date
                            </label>
                            <input
                                placeholder="e.g., Today, Feb 20"
                                value={newTask.due}
                                onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 shadow-sm placeholder:text-surface-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <MoreVertical size={12} className="text-surface-400" />
                            Description & Context
                        </label>
                        <textarea
                            placeholder="Provide details about the required action..."
                            rows={4}
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 bg-white/50 shadow-sm placeholder:text-surface-400 resize-none"
                        />
                    </div>
                </form>
            </Modal>

            {/* NEW Filter Modal */}
            <Modal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                title="Filter Workflow Queue"
                description="Refine your active tasks based on operational criteria."
                size="md"
                footer={
                    <div className="flex justify-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="py-3 px-8 rounded-[var(--radius-2xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer text-sm"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => setIsFilterModalOpen(false)}
                            className="py-3 px-10 rounded-[var(--radius-2xl)] bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer text-sm"
                        >
                            Apply Filters
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Priority Level</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['all', 'hot', 'warm', 'cold'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setActiveFilters({ ...activeFilters, priority: p as 'all' | 'hot' | 'warm' | 'cold' })}
                                    className={cn(
                                        "px-3 py-2.5 text-xs font-black rounded-xl border transition-all uppercase tracking-tight",
                                        activeFilters.priority === p
                                            ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/20"
                                            : "bg-surface-50 border-surface-200 text-surface-600 hover:bg-white hover:border-primary-300"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Process State</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['all', 'pending', 'under_review', 'registered'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setActiveFilters({ ...activeFilters, status: s as 'all' | 'pending' | 'under_review' | 'registered' })}
                                    className={cn(
                                        "px-4 py-3 text-xs font-black rounded-xl border transition-all uppercase tracking-tight text-left flex justify-between items-center",
                                        activeFilters.status === s
                                            ? "bg-primary-50 border-primary-500 text-primary-700 shadow-sm"
                                            : "bg-surface-50 border-surface-200 text-surface-600 hover:bg-white hover:border-surface-300"
                                    )}
                                >
                                    {s.replace('_', ' ')}
                                    {activeFilters.status === s && <Check size={14} className="text-primary-600" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Line of Business</label>
                        <input
                            placeholder="e.g., Motor, General, Tech..."
                            value={activeFilters.type === 'all' ? '' : activeFilters.type}
                            onChange={(e) => setActiveFilters({ ...activeFilters, type: e.target.value || 'all' })}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 shadow-sm placeholder:text-surface-400"
                        />
                    </div>
                </div>
            </Modal>

            {/* Archive View Modal */}
            <ArchiveModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                archivedTasks={archivedTasks}
                onRestore={handleRestore}
                onClearAll={handleEmptyBin}
            />
        </div >
    );
}
