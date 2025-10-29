import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get('authToken')?.value
    const tokenExpiry = cookieStore.get('tokenExpiry')?.value

    if (!authToken || !tokenExpiry) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verificar se o token expirou
    const expiryDate = parseInt(tokenExpiry)
    if (Date.now() > expiryDate) {
      // Limpar cookies expirados
      const response = NextResponse.json({ authenticated: false }, { status: 401 })
      response.cookies.delete('authToken')
      response.cookies.delete('tokenExpiry')
      return response
    }

    return NextResponse.json({ authenticated: true }, { status: 200 })
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}