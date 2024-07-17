import {env} from 'process'

export const JWT_TOKEN = env.JWT_TOKEN as string
export const PORT = env.PORT
export const RESEND_URL = env.RESEND_URL as string