'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReceiveCommission } from '@/hooks/api/use-finance';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
    receivedAmount: z.number().min(0.01, 'Amount must be greater than 0'),
    receivedDate: z.string().min(1, 'Date is required'),
    reference: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReceiveCommissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    commission: {
        id: string;
        policyNumber: string;
        commissionAmount: number;
        clientName: string;
    } | null;
}

export function ReceiveCommissionModal({
    isOpen,
    onClose,
    commission,
}: ReceiveCommissionModalProps) {
    const { mutateAsync: receiveCommission, isPending } = useReceiveCommission();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            receivedAmount: commission?.commissionAmount || 0,
            receivedDate: new Date().toISOString().split('T')[0],
            reference: '',
        },
    });

    // Reset default values when commission changes
    useEffect(() => {
        if (commission) {
            reset({
                receivedAmount: Number(commission.commissionAmount),
                receivedDate: new Date().toISOString().split('T')[0],
                reference: '',
            });
        }
    }, [commission, reset]);


    const onSubmit = async (data: FormValues) => {
        if (!commission) return;

        try {
            await receiveCommission({
                id: commission.id,
                data: {
                    receivedAmount: data.receivedAmount,
                    receivedDate: new Date(data.receivedDate).toISOString(),
                    reference: data.reference,
                },
            });

            toast.success('Commission marked as paid and transaction recorded');
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to receive commission');
        }
    };

    if (!commission) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="text-primary-600" size={20} />
                        Receive Commission
                    </DialogTitle>
                    <DialogDescription>
                        Mark the commission for policy <strong>{commission.policyNumber}</strong> ({commission.clientName}) as paid by the insurer.
                        This will automatically generate a corresponding bank transaction.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Expected Amount</Label>
                        <div className="p-3 bg-surface-50 border border-surface-200 rounded-lg text-lg font-bold text-surface-900 tabular-nums">
                            {formatCurrency(commission.commissionAmount)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="receivedAmount">Actual Received Amount <span className="text-danger-500">*</span></Label>
                        <Input
                            id="receivedAmount"
                            type="number"
                            step="0.01"
                            {...register('receivedAmount', { valueAsNumber: true })}
                        />
                        {errors.receivedAmount && (
                            <p className="text-xs text-danger-500">{errors.receivedAmount.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="receivedDate">Date Received <span className="text-danger-500">*</span></Label>
                        <Input
                            id="receivedDate"
                            type="date"
                            {...register('receivedDate')}
                        />
                        {errors.receivedDate && (
                            <p className="text-xs text-danger-500">{errors.receivedDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reference">Insurer / Bank Reference (Optional)</Label>
                        <Input
                            id="reference"
                            placeholder="e.g. TXN-12345"
                            {...register('reference')}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isPending}>
                            Confirm Receipt
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
