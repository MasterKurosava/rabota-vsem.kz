import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  whatsappLink: string;
}

export function PhoneVerificationBanner({ whatsappLink }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-gradient-to-br",
        "from-amber-50 via-amber-100 to-amber-50",
        "dark:from-amber-900/30 dark:via-amber-900/15 dark:to-amber-900/25",
        "border-amber-300/50 dark:border-amber-400/40",
        "p-6 shadow-lg"
      )}
    >
      <div className="flex flex-col items-center text-center gap-3">

        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold tracking-wide">
            Сделайте профиль официальным
          </span>
        </div>

        <p className="text-sm text-foreground-secondary leading-relaxed max-w-[480px]">
          После подтверждения номера вам будет присвоен статус
          <span className="font-semibold text-amber-700 dark:text-amber-200">
            {" "}«Проверенный партнёр»
          </span>.
          Это повышает доверие клиентов и увеличивает количество заказов 🚀
        </p>

        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-200 text-sm">
          <ShieldCheck className="h-4 w-4" />
          <span>Проверка выполняется вручную администратором</span>
        </div>

        <Button
          asChild
          size="lg"
          className="mt-3 px-6 gap-2 shadow-xl font-medium bg-amber-600 hover:bg-amber-700 text-white"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Написать в WhatsApp для подтверждения
          </a>
        </Button>
      </div>
    </div>
  );
}
