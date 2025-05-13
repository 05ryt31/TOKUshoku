"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormWrapper } from "@/components/ui/common/FormWrapper";

export default function UserSignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
    postalCode: "",
    prefecture: "",
    city: "",
    streetAddress: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post("/api/auth/signup", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: {
          postalCode: formData.postalCode,
          prefecture: formData.prefecture,
          city: formData.city,
          streetAddress: formData.streetAddress,
        },
      });
      if (response.status === 200) {
        setMessageType("success");
        setMessage("登録が成功しました。ログインしてください。");
        router.push("/auth/user/login");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setMessageType("error");
        setMessage(err.response.data.error || "サインアップに失敗しました。");
      } else {
        setMessageType("error");
        setMessage("サインアップに失敗しました。");
      }
    }
  };

  return (
    <FormWrapper
      title="ユーザー登録"
      description="アカウントを作成して、お得なお買い物を始めましょう"
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
        <div>
          <label htmlFor="name" className="block mb-1">ユーザー名</label>
          <input
            id="name"
            type="text"
            className="border w-full p-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block mb-1">電話番号</label>
          <input
            id="phoneNumber"
            type="text"
            className="border w-full p-2"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="postalCode" className="block mb-1">郵便番号</label>
          <input
            id="postalCode"
            type="text"
            className="border w-full p-2"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="prefecture" className="block mb-1">都道府県</label>
          <input
            id="prefecture"
            type="text"
            className="border w-full p-2"
            value={formData.prefecture}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="city" className="block mb-1">市区町村</label>
          <input
            id="city"
            type="text"
            className="border w-full p-2"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="streetAddress" className="block mb-1">それ以降の住所</label>
          <input
            id="streetAddress"
            type="text"
            className="border w-full p-2"
            value={formData.streetAddress}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          サインアップ
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/auth/user/login" className="text-blue-600 hover:underline">
          ログイン
        </Link>
      </div>
    </FormWrapper>
  );
}
