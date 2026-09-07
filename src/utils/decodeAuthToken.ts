import { jwtPayloadSchema } from '../schemas/auth.schema.ts'

export function decodeAuthToken(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) return null
    const encoded = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')
    const json = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(padded), (char) => char.charCodeAt(0)))
    const parsed = jwtPayloadSchema.safeParse(JSON.parse(json))
    if (!parsed.success || parsed.data.exp * 1000 <= Date.now()) return null
    // Structural validation is only for UI state. The backend verifies the signature.
    return parsed.data
  } catch {
    return null
  }
}
