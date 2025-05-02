"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/app/components/navigation";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

type Store = {
  store_id: string;
  name: string;
  prefecture: string;
  city: string;
  street_address: string;
  phone: string;
};
export default function AdminStoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/stores", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          console.error("Failed to fetch stores:", response.statusText);
          return;
        }
        const data = await response.json();
        const normalized = Array.isArray(data) ? data : [data];
        setStores(normalized as Store[]);
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/auth/store/login");
        return;
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);
  
  return (
    <>
      <Navigation isAdmin />
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">店舗情報管理</h1>
            <Button asChild>
              <Link href="/admin/stores/Edit">＋ 新規作成</Link>
            </Button>
          </div>

          <Table className="bg-white rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>店舗名</TableHead>
                <TableHead>住所</TableHead>
                <TableHead>電話番号</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((s: Store) => (
                <TableRow key={s.store_id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{`${s.prefecture}${s.city}${s.street_address}`}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/stores/Edit?id=${s.store_id}`}>編集</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
