import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const databaseMap: Record<string, string> = {
  user: process.env.NOTION_DB_USERS!,
  vendor: process.env.NOTION_DB_VENDORS!,
  contractor: process.env.NOTION_DB_CONTRACTORS!,
  property: process.env.NOTION_DB_PROPERTIES!,
  booking: process.env.NOTION_DB_BOOKINGS!,
  task: process.env.NOTION_DB_TASKS!,
  finance: process.env.NOTION_DB_FINANCE!,
  guest: process.env.NOTION_DB_GUESTS!,
  owner: process.env.NOTION_DB_OWNERS!,
  report: process.env.NOTION_DB_REPORTS!,
  message: process.env.NOTION_DB_MESSAGES!,
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, org, lang, role } = body

  const databaseId = databaseMap[role]
  if (!databaseId) {
    return NextResponse.json({ error: `Invalid role: ${role}` }, { status: 400 })
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email },
        Organization: { rich_text: [{ text: { content: org } }] },
        Language: { select: { name: lang } },
        Role: { select: { name: role } },
      },
    })

    return NextResponse.json({ success: true, notion_response: response })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create Notion page' }, { status: 500 })
  }
}

