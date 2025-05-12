"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import { FormWrapper } from "@/components/ui/common/FormWrapper";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    try {
      // supabase.auth.updateUser() を使用してパスワード更新
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setMessageType("error");
        setMessage(error.message || "パスワード更新に失敗しました。");
        return;
      }
      setMessageType("success");
      setMessage("パスワードを更新しました。");
      setTimeout(() => {
        router.push("/auth/user/login");
      }, 1500);
    } catch (err) {
      setMessageType("error");
      setMessage("サーバーエラーが発生しました。");
      console.error("Update password error:", err);
    }
  };

  return (
    <FormWrapper title="新しいパスワードを設定">
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block mb-1">新しいパスワード</label>
          <input
            id="newPassword"
            type="password"
            className="border w-full p-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" type="submit">
          パスワードを更新
        </button>
      </form>
    </FormWrapper>
  );
}
