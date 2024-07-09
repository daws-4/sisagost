import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwt = request.cookies.get("TokenLogin");

  // if (!jwt) return NextResponse.redirect(new URL("/login", request.url));



 try {
  const { payload } = await jwtVerify(
    jwt.value,
    new TextEncoder().encode("secret")
  );
  if(request.nextUrl.pathname.includes('/login')){
   return NextResponse.redirect(new URL("/contratos", request.url));
  }
  return NextResponse.next();
 } catch (error) {
  if(request.nextUrl.pathname.includes('/login')){
      return NextResponse.next();
  }else{
    return NextResponse.redirect(new URL("/login", request.url));
  }
 }

    
    
}
export const config = {
  matcher: ["/contratos/:path*",
    '/login'
  ],
};
