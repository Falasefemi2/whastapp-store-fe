import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteConfirmationDialogProps {
    open: boolean
    title: string
    description: string
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
}

export function DeleteConfirmationDialog({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    isLoading = false,
}: DeleteConfirmationDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={(newOpen) => !newOpen && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center justify-end gap-3">
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
