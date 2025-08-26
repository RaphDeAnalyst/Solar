import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Database helper functions
export const db = {
  // Products
  async getProducts(category?: string) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('availability', true)
      .order('name')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Bundles
  async getBundles() {
    const { data, error } = await supabase
      .from('bundles')
      .select('*')
      .eq('availability', true)
      .order('price_min')

    if (error) throw error
    return data
  },

  async getBundleByLoad(dailyLoadWh: number, peakLoadW: number) {
    const { data, error } = await supabase
      .from('bundles')
      .select('*')
      .eq('availability', true)
      .gte('daily_load_max', dailyLoadWh)
      .gte('peak_load_max', peakLoadW)
      .order('price_min')
      .limit(1)

    if (error) throw error
    return data[0] || null
  },

  // Appliances
  async getAppliances() {
    const { data, error } = await supabase
      .from('appliances')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name')

    if (error) throw error
    return data
  },

  // Settings
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')

    if (error) throw error
    
    // Convert to key-value object
    const settings: Record<string, any> = {}
    data?.forEach(setting => {
      settings[setting.key] = setting.value
    })
    
    return settings
  },

  async getSetting(key: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error) throw error
    return data?.value
  },

  // Leads
  async createLead(leadData: any) {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateLead(id: string, updates: any) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getLeads(status?: string) {
    let query = supabase
      .from('leads')
      .select(`
        *,
        bundles:recommended_bundle_id(*)
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Solar Generators
  async getSolarGenerators() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'solar_generator')
      .eq('availability', true)
      .order('specifications->battery_capacity_wh')

    if (error) throw error
    return data
  },

  async getSolarGeneratorByLoad(dailyLoadWh: number, peakLoadW: number) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'solar_generator')
      .eq('availability', true)
      .gte('specifications->battery_capacity_wh', dailyLoadWh)
      .gte('specifications->max_output_w', peakLoadW)
      .order('specifications->battery_capacity_wh')
      .limit(1)

    if (error) throw error
    return data[0] || null
  }
}