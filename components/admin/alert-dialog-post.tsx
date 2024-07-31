import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AlertDialogPost({ Icode }: { Icode: string }) {
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <AlertDialog
      open={openAlert}
      onOpenChange={setOpenAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Voici le Code unique de l'annonce</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col space-y-6">
              <p>
                Ce code est le code unique de l'annonce. Il sera utilisé pour
                supprimer l'annonce rapidement. Noté le sur le produit.
              </p>
              <strong className="text-secondary font-bold text-3xl text-center">
                {" "}
                {Icode}
              </strong>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Fermer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
