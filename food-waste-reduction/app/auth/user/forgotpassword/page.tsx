"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormWrapper } from "@/components/ui/common/FormWrapper";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessageType("error");
        setMessage(data.error || "エラーが発生しました");
        return;
      }
      setMessageType("success");
      setMessage("認証コードを送信しました。メールをご確認ください。");
    } catch (err) {
      setMessageType("error");
      setMessage("サーバーエラーが発生しました");
    }
  };

  return (
    <FormWrapper
      title="パスワード再設定"
      description="登録したメールアドレスを入力してください。パスワードリセットリンクを送信します。"
      message={message}
      messageType={messageType}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">メールアドレス</label>
          <input
            id="email"
            type="email"
            className="border w-full p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" type="submit">
          リセットメールを送信
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        <button onClick={() => router.push("/auth/user/login")} className="text-blue-600 hover:underline">
          ログインへ戻る
        </button>
      </div>
    </FormWrapper>
  );
}
