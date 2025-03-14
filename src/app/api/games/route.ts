import { NextRequest, NextResponse } from 'next/server';
import { getGameData } from '@/utils/i18n';

export async function GET(request: NextRequest) {
  try {
    // 从URL参数中获取locale
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // 获取游戏数据
    const { gameList } = await getGameData(locale);
    
    // 返回游戏列表
    return NextResponse.json({ games: gameList });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
} 