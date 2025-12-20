"use client";

import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface CommentEmptyProps {
  className?: string;
}

export function CommentEmpty({ className }: CommentEmptyProps) {
  const t = useTranslations("comments");

  return (
    <div className={cn("py-12 text-center", className)}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
        <MessageSquare className="h-8 w-8 text-white/30" />
      </div>
      <h3 className="text-lg font-medium text-white">{t("noComments")}</h3>
      <p className="mt-1 text-sm text-white/50">
        {t("beFirst")}
      </p>
    </div>
  );
}
