"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  tarefaNome: string
  isDeleting: boolean
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  tarefaNome,
  isDeleting,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription className="mt-2">
                Tem certeza que deseja excluir a tarefa <span className="font-semibold">"{tarefaNome}"</span>?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
          <p className="text-sm text-red-800">
            Esta ação não pode ser desfeita. A tarefa será permanentemente removida.
          </p>
        </div>

        <DialogFooter className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Excluindo..." : "Excluir tarefa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
