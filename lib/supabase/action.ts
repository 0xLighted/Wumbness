'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { embedSymptomsAndSpecialties } from '@/lib/matcher/embed'
import { createClient } from '@/lib/supabase/server'

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must include lowercase letters (a-z)')
  .regex(/[A-Z]/, 'Password must include uppercase letters (A-Z)')
  .regex(/\d/, 'Password must include at least one digit (0-9)')
  .trim()

const loginSchema = z.object({
  email: z.email('Please enter a valid email address').trim(),
  password: z.string().min(1, 'Password is required').trim(),
})

const patientSignupSchema = z.object({
  role: z.literal('patient'),
  email: z.email('Please enter a valid email address').trim(),
  password: passwordSchema,
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
})

const counselorSignupSchema = z.object({
  role: z.literal('counselor'),
  email: z.email('Please enter a valid email address').trim(),
  password: passwordSchema,
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  specialties: z.array(z.string().trim().min(1)).min(1, 'Please select at least one specialty'),
})

const signupSchema = z.discriminatedUnion('role', [
  patientSignupSchema,
  counselorSignupSchema,
])

function toVectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`
}

function encodeErrorToUrl(message: string): string {
  return encodeURIComponent(message)
}

function extractFirstError(error: z.ZodError): string {
  const firstIssue = error.issues[0]
  if (firstIssue) {
    return firstIssue.message || 'Validation failed'
  }
  return 'Validation failed'
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const parsed = loginSchema.safeParse({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (!parsed.success) {
    const errorMsg = extractFirstError(parsed.error)
    redirect(`/auth?toast=login-error&errorDetails=${encodeErrorToUrl(errorMsg)}`)
  }

  const data = {
    email: parsed.data.email,
    password: parsed.data.password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    const errorMsg = error.message === 'Invalid login credentials' 
      ? 'Invalid email or password'
      : error.message || 'Sign in failed'
    redirect(`/auth?toast=login-error&errorDetails=${encodeErrorToUrl(errorMsg)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/?toast=login-success')
}

export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/auth')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const rawInput = {
    role: formData.get('role') === 'counselor' ? 'counselor' : 'patient',
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: (formData.get('fullName') as string | null)?.trim() || undefined,
    specialties: formData
      .getAll('specialties')
      .filter((entry): entry is string => typeof entry === 'string')
      .map((entry) => entry.trim())
      .filter(Boolean),
  }

  const parsed = signupSchema.safeParse(rawInput)
  if (!parsed.success) {
    const errorMsg = extractFirstError(parsed.error)
    redirect(`/auth?toast=signup-error&errorDetails=${encodeErrorToUrl(errorMsg)}`)
  }

  const specialties = parsed.data.role === 'counselor' ? parsed.data.specialties : []

  const data = {
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        role: parsed.data.role,
        fullName: parsed.data.fullName ?? null,
        specialties,
      },
    },
  }

  const { data: signupData, error } = await supabase.auth.signUp(data)

  if (error) {
    const errorMsg = error.message === 'User already registered' 
      ? 'This email is already registered'
      : error.message || 'Sign up failed'
    redirect(`/auth?toast=signup-error&errorDetails=${encodeErrorToUrl(errorMsg)}`)
  }

  const userId = signupData.user?.id

  if (!userId) {
    redirect(`/auth?toast=signup-error&errorDetails=${encodeErrorToUrl('Failed to create account')}`)
  }

  const role = parsed.data.role === 'counselor' ? 'COUNSELOR' : 'PATIENT'
  const userSpecialties = parsed.data.role === 'counselor' ? parsed.data.specialties : []

  let embedding: string | null = null

  if (parsed.data.role === 'counselor') {
    const counselorEmbedding = await embedSymptomsAndSpecialties(parsed.data.specialties)
    embedding = toVectorLiteral(counselorEmbedding)
  }

  const { error: userInsertError } = await supabase.from('users').upsert(
    {
      id: userId,
      role,
      fullname: parsed.data.fullName,
      specialties: userSpecialties,
      embedding,
    },
    { onConflict: 'id' },
  )

  if (userInsertError) {
    const errorMsg = 'Failed to save profile information'
    redirect(`/auth?toast=signup-error&errorDetails=${encodeErrorToUrl(errorMsg)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/?toast=signup-success')
}