import React, { Dispatch, SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AlertDialogPost({
  icode,
  value,
  set,
}: {
  icode: string;
  value: boolean;
  set: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <AlertDialog
      open={value}
      onOpenChange={set}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Voici le Code unique de l'annonce</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="flex flex-col space-y-6">
              <span>
                Ce code est le code unique de l'annonce. Il sera utilisé pour
                supprimer l'annonce rapidement. Noté le sur le produit.
              </span>
              <strong className="text-secondary font-bold text-3xl text-center">
                {icode}
              </strong>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Fermer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
