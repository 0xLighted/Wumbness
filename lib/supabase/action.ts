'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(1).trim(),
})

const patientSignupSchema = z.object({
  role: z.literal('patient'),
  email: z.email().trim(),
  password: z.string().min(8).trim(),
  fullName: z.string().trim().min(4),
})

const counselorSignupSchema = z.object({
  role: z.literal('counselor'),
  email: z.email().trim(),
  password: z.string().min(8).trim(),
  fullName: z.string().trim().min(4),
  specialties: z.array(z.string().trim().min(1)).min(1),
})

const signupSchema = z.discriminatedUnion('role', [
  patientSignupSchema,
  counselorSignupSchema,
])

export async function login(formData: FormData) {
  const supabase = await createClient()

  const parsed = loginSchema.safeParse({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (!parsed.success) {
    redirect('/auth?toast=login-error')
  }

  const data = {
    email: parsed.data.email,
    password: parsed.data.password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/auth?toast=login-error')
  }

  revalidatePath('/', 'layout')
  redirect('/?toast=login-success')
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
    redirect('/auth?toast=signup-error')
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

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/auth?toast=signup-error')
  }

  revalidatePath('/', 'layout')
  redirect('/?toast=signup-success')
}