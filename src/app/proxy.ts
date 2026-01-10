import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 3600
export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const resource = searchParams.get('resource')

  switch (resource) {
    case 'apps':
      return NextResponse.json({
        apps: [
          { id: 'chrome', name: 'Chrome', icon: '🌐', backgroundColor: '#4285f4' },
          { id: 'files', name: 'Files', icon: '📁', backgroundColor: '#1a73e8' },
          { id: 'calculator', name: 'Calculator', icon: '🧮', backgroundColor: '#34a853' },
          { id: 'settings', name: 'Settings', icon: '⚙️', backgroundColor: '#5f6368' },
          { id: 'terminal', name: 'Terminal', icon: '💻', backgroundColor: '#202124' },
        ],
      })

    case 'settings':
      return NextResponse.json({
        theme: 'auto',
        wallpaper: 'default',
        showShelf: true,
      })

    default:
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const resource = body.resource

  switch (resource) {
    case 'settings':
      return NextResponse.json({
        success: true,
        settings: body.settings,
      })

    default:
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }
}
