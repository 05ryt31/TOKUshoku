"use client";
import { useRouter } from "next/navigation";
import { FormWrapper } from "@/components/ui/common/FormWrapper";

export default function StoreLogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("storeToken");
    router.push("/auth/store/login");
  };

  return (
    <FormWrapper title="店舗ログアウト確認">
      <div className="flex flex-col items-center">
        <p className="mb-4">本当にログアウトしますか？</p>
        <div>
          <button className="bg-gray-200 px-4 py-2 mr-2 rounded" onClick={() => router.back()}>
            キャンセル
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </div>
    </FormWrapper>
  );
}
