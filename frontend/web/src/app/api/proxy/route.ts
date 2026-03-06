import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  await fetch('https://s3-url', {
    method: 'PUT',
    body: buffer,
    headers: {
      'Content-Type': file.type,
    },
  });

  return NextResponse.json({ success: true });
}
