import { NextRequest, NextResponse } from 'next/server';
import { FetchClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new FetchClient(config, customHeaders);

    const response = await client.fetch(url);

    // 提取文本内容
    const textContent = response.content
      .filter((item): item is { type: 'text'; text: string } => item.type === 'text' && !!item.text)
      .map(item => item.text)
      .join('\n');

    return NextResponse.json({
      success: true,
      title: response.title,
      content: textContent,
      fileType: response.filetype,
    });
  } catch (error) {
    console.error('Fetch URL error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch URL' },
      { status: 500 }
    );
  }
}
