import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Pegar parâmetros da URL
  const url = request.nextUrl
  const authToken = url.searchParams.get('auth')
  const tokenExpiry = url.searchParams.get('expiry')
  
  // Se não tem token, redirecionar para login
  if (!authToken || !tokenExpiry) {
    // Verificar se tem cookie de autenticação
    const cookieToken = request.cookies.get('authToken')?.value
    const cookieExpiry = request.cookies.get('tokenExpiry')?.value
    
    if (!cookieToken || !cookieExpiry) {
      return NextResponse.redirect('https://rw-tips.netlify.app/index.html')
    }
    
    // Verificar se o token expirou
    const expiryDate = parseInt(cookieExpiry)
    if (Date.now() > expiryDate) {
      const response = NextResponse.redirect('https://rw-tips.netlify.app/index.html')
      response.cookies.delete('authToken')
      response.cookies.delete('tokenExpiry')
      return response
    }
    
    // Token válido, continuar
    return NextResponse.next()
  }
  
  // Se tem token na URL, validar e salvar em cookie
  const expiryDate = parseInt(tokenExpiry)
  
  if (Date.now() > expiryDate) {
    // Token expirado
    return NextResponse.redirect('https://rw-tips.netlify.app/index.html')
  }
  
  // Token válido, salvar em cookie e redirecionar sem parâmetros na URL
  const response = NextResponse.redirect(url.origin + url.pathname)
  
  // Salvar cookies por 24 horas
  response.cookies.set('authToken', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 86400 // 24 horas
  })
  
  response.cookies.set('tokenExpiry', tokenExpiry, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 86400
  })
  
  return response
}

// Configurar quais rotas serão protegidas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}