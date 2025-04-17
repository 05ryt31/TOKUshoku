"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormWrapper } from "@/components/ui/common/FormWrapper";

export default function StoreLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        "/api/auth/store/login",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );
      if (response.status < 400) {
        router.push("/admin");
      } else {
        setMessageType("error");
        setMessage(response.data.message || "ログインに失敗しました。");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setMessageType("error");
        setMessage(err.response.data.message || "ログインに失敗しました。");
      } else {
        setMessageType("error");
        setMessage("ログインに失敗しました。");
      }
    }
  };

  return (
    <FormWrapper title="店舗ログイン" description="店舗アカウントにログインして、店舗管理画面へアクセスします。" message={message} messageType={messageType}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">メールアドレス</label>
          <input
            id="email"
            type="email"
            className="border w-full p-2"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">パスワード</label>
          <input
            id="password"
            type="password"
            className="border w-full p-2"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" type="submit">
          ログイン
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        <Link href="/auth/store/signup" className="text-blue-600 hover:underline">
          店舗アカウントを作成
        </Link>
      </div>
      <div className="mt-4 text-center text-sm">
        <Link href="/auth/user/forgotpassword" className="text-blue-600 hover:underline">
            パスワードをお忘れの方
        </Link>
      </div>
    </FormWrapper>
  );
}
