/**
 * /app/api/auth/signup/route.ts
 * 
 * サインアップエンドポイント
 * "POST /api/auth/signup" で{email, password}を受け取り、
 * Supabse Auth の　signUp() メソッドを利用してサインアップを行う
 * 
 * 
 * 
 */


import { NextRequest, NextResponse } from 'next/server';
import  { createServerSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try{
        //リクエストボディから各パラメータを取得
        const {
            email, 
            password,
            name,
            phoneNumber,
            address,
        } = await request.json();

        console.log('Received data:', {
            email,
            password,
            name,
            phoneNumber,
            address,
        });

        //バリデーション
        //!address.buildingName ||   未定
        if (
            !email || 
            !password ||
            !name ||
            !phoneNumber ||
            !address ||
            !address.postalCode ||
            !address.prefecture ||
            !address.city ||
            !address.streetAddress //||
          //!address.buildingName ||   未定
        ) {
            return NextResponse.json({message: '必須項目が不足しています。'}, {status:400});
        }
        
        //Supabase AuthのsignUp()メソッドを利用してサインアップ
        const supabase = createServerSupabase();
        const {data: authData,error: authError} = await supabase.auth.signUp({email, password});
        if (authError) {
            console.error('Supabase Auth signUp error:', authError);
            return NextResponse.json({UserSignUperror: authError.message}, {status:400});
        }
        console.log('authData:', authData);

        //supabaseAuthにより生成されたユーザーIDを取得
        const userId = authData.user?.id;
        if (!userId) {
            return NextResponse.json({message: 'ユーザーIDが取得できませんでした。'}, {status:500});
        }
        console.log('userId:', userId);
        
        //ユーザー情報をusersテーブルに登録
        const {data: userInsertData, error: userInsertError} = await supabase
            .from('users')
            .insert({
                user_id: userId,
                name,
                email,
                phone: phoneNumber,
                postal_code: address.postalCode,
                prefecture: address.prefecture,
                city: address.city,
                street_address: address.streetAddress,
                    //building_name: address.buildingName, 未定
            
            })
            .select();
        if (userInsertError ) {
            return NextResponse.json({userinsertederror: userInsertError.message}, {status:400});
        }
        console.log('userInsertData:', userInsertData);
        //登録成功時のレスポンス
        if (!userInsertData || userInsertData.length === 0) {
            return NextResponse.json({message: 'ユーザー情報の登録に失敗しました。'}, {status:500});
        }
        const createdUser = userInsertData[0];
        return NextResponse.json({
            status: 'success',
            data: {
                userId: createdUser.user_id,
                email: createdUser.email,
                name: createdUser.name,
                createdAt: createdUser.created_at,
            },
        }, {status: 200});
        
    } catch (err) {
        console.error('Signup error:', err);
        return NextResponse.json({message: 'Server error'}, {status:500});
    }
}