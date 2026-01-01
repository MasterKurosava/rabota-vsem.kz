"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, CheckCircle, XCircle, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ru, enUS, kk } from "date-fns/locale";
import {
  updateUserVerificationAction,
  deleteUserAction,
} from "@/server/actions/admin/users";
import type { AdminUser } from "@/server/queries/admin/users";

const localeMap = {
  ru: ru,
  en: enUS,
  kk: kk,
};

interface UsersManagerProps {
  users: AdminUser[];
}

export function UsersManager({ users: initialUsers }: UsersManagerProps) {
  const t = useTranslations("admin.users");
  const locale = useLocale() as "ru" | "en" | "kk";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState(initialUsers);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;

    startTransition(async () => {
      const result = await deleteUserAction(userToDelete);
      if (result.success) {
        setUsers(users.filter((u) => u.id !== userToDelete));
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        router.refresh();
      }
    });
  };

  const handleTogglePhoneVerification = (userId: string, currentValue: boolean) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("phoneVerified", (!currentValue).toString());
      const result = await updateUserVerificationAction(userId, formData);
      if (result.success) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, phoneVerified: !currentValue } : u
          )
        );
        router.refresh();
      }
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && user.phoneVerified) ||
      (verificationFilter === "unverified" && !user.phoneVerified);

    return matchesSearch && matchesRole && matchesVerification;
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">{t("title")}</h1>
        <p className="text-foreground-secondary">{t("subtitle")}</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder") || "Поиск по имени, email или телефону..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("roleFilter") || "Роль"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allRoles") || "Все роли"}</SelectItem>
            <SelectItem value="USER">{t("userRole") || "Пользователь"}</SelectItem>
            <SelectItem value="ADMIN">{t("adminRole") || "Админ"}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("verificationFilter") || "Верификация"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all") || "Все"}</SelectItem>
            <SelectItem value="verified">{t("verified") || "Подтвержден"}</SelectItem>
            <SelectItem value="unverified">{t("unverified") || "Не подтвержден"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.email")}</TableHead>
              <TableHead>{t("table.phone")}</TableHead>
              <TableHead>{t("table.role")}</TableHead>
              <TableHead>{t("table.anketas")}</TableHead>
              <TableHead>{t("table.comments")}</TableHead>
              <TableHead>{t("table.verified")}</TableHead>
              <TableHead>{t("table.joined")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user._count.anketa}</TableCell>
                  <TableCell>{user._count.commentsRecv}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleTogglePhoneVerification(user.id, user.phoneVerified)
                      }
                      disabled={isPending}
                      className={user.phoneVerified ? "border-green-500 hover:bg-green-50" : ""}
                    >
                      {user.phoneVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "dd MMM yyyy", {
                      locale: localeMap[locale],
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(user.id)}
                      disabled={isPending}
                      className="border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  {searchQuery || roleFilter !== "all" || verificationFilter !== "all"
                    ? t("noResults") || "Пользователи не найдены"
                    : t("noUsers")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDialog.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isPending}>
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}



