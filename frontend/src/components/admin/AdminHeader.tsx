import { useState } from "react";

interface AdminHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: string;
}

function AdminHeader({ title, actionLabel, onAction, actionIcon = "add" }: AdminHeaderProps) {
  const [hasNotification] = useState(true);
}

export default AdminHeader;