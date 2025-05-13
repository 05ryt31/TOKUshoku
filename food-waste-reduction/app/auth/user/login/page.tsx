"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormWrapper } from "@/components/ui/common/FormWrapper";

export default function UserLoginPage() {
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
        "/api/auth/login",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );
      if (response.status < 400) {
        router.push("/user/mypage");
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
    <FormWrapper
      title="ユーザーログイン"
      description="アカウントにログインして、お得なお買い物を始めましょう"
      message={message}
      messageType={messageType}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            メールアドレス
          </label>
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
          <label htmlFor="password" className="block mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            className="border w-full p-2"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <Link href="/auth/user/forgotpassword" className="text-blue-600 hover:underline">
            パスワードをお忘れの方
          </Link>
          <Link href="/auth/user/signup" className="text-blue-600 hover:underline">
            アカウント作成
          </Link>
        </div>
        <button
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          type="submit"
        >
          ログイン
        </button>
      </form>
    </FormWrapper>
  );
}
