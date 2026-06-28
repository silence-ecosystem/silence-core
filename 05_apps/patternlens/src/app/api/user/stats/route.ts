import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function GET() {
  try {
    const supabase=await createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return NextResponse.json({error:'Unauthorized'},{status:401});
    const {count:total}=await supabase.from('objects').select('*',{count:'exact',head:true}).eq('user_id',user.id).is('deleted_at',null);
    const weekAgo=new Date();weekAgo.setDate(weekAgo.getDate()-7);
    const {count:week}=await supabase.from('objects').select('*',{count:'exact',head:true}).eq('user_id',user.id).is('deleted_at',null).gte('created_at',weekAgo.toISOString());
    const {count:patterns}=await supabase.from('patterns').select('*',{count:'exact',head:true}).eq('user_id',user.id);
    const {data:profile}=await supabase.from('profiles').select('tier,locale').eq('id',user.id).single();
    return NextResponse.json({totalObjects:total||0,thisWeek:week||0,patterns:patterns||0,tier:profile?.tier||'FREE',locale:profile?.locale||'pl'});
  }catch{return NextResponse.json({error:'Failed'},{status:500});}
}
