"use client";

import type { Classroom, Staff } from "@/types/api";
import {useToast} from "@/app/_components/toast-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import {useState} from "react";
import Field from "@/app/_components/field";
import ModalActions from "./modal-actions";
import {TeacherSelect} from "./teacher-select";
import Modal from "@/app/_components/modal";

export default function SubjectFormModal({
  classroom,
  staff,
  onClose,
}: {
  classroom: Classroom;
  staff: Staff[];
  onClose: () => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState(String(staff[0]?.user.id ?? ""));

  const mutation = useMutation({
    mutationFn: () => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Subject name is required");
      if (!teacherId) throw new Error("Select a teacher");

      return clientFetch("staff/subject/", {
        method: "POST",
        body: {
          name: trimmed,
          teacher: teacherId,
          classroom: classroom.id,
        },
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["subjects", classroom.id] }),
        queryClient.invalidateQueries({ queryKey: ["classrooms"] }),
      ]);
      toast.success("Subject added successfully");
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to add subject"),
  });

  return (
    <Modal title="Add New Subject" onClose={onClose}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Subject">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input"
            placeholder="Subject"
          />
        </Field>
        <Field label="Teacher">
          <TeacherSelect staff={staff} value={teacherId} onChange={setTeacherId} />
        </Field>
      </div>
      <ModalActions
        submitLabel={mutation.isPending ? "Uploading..." : "Upload"}
        disabled={mutation.isPending}
        onSubmit={() => mutation.mutate()}
      />
    </Modal>
  );
}