"use client";

import {
  Loader2,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Check,
  Sun,
  Moon,
  Pencil,
  Trash,
  Edit,
  Plus,
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  File,
  MoreVertical,
} from "lucide-react";

export type IconKeys = keyof typeof Icons;

export const Icons = {
  spinner: Loader2,
  user: User,
  logout: LogOut,
  settings: Settings,
  chevronDown: ChevronDown,
  check: Check,
  sun: Sun,
  moon: Moon,
  pencil: Pencil,
  trash: Trash,
  edit: Edit,
  plus: Plus,
  arrowLeft: ArrowLeft,
  eye: Eye,
  eyeOff: EyeOff,
  post: FileText,
  draft: File,
  ellipsis: MoreVertical,
};
