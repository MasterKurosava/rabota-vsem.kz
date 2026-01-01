import { requireAuth } from "@/lib/auth";
import { getAnketas, getUserAnketaCount } from "@/server/queries/anketas";
import { AnketaListWrapper } from "@/components/account/AnketaListWrapper";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AnketaPage() {
  const session = await requireAuth();
  const t = await getTranslations("anketa");

  const [anketa, count] = await Promise.all([
    getAnketas({ userId: session.userId }),
    getUserAnketaCount(session.userId),
  ]);

  const canCreate = count < 3;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{t("myAnketas")}</h1>

        {canCreate && (
          <Button asChild>
            <Link href="/account/anketa/new">{t("createAnketa")}</Link>
          </Button>
        )}
      </div>

      <AnketaListWrapper anketa={anketa} />
    </div>
  );
}
