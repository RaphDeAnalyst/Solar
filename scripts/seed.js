const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seed() {
  try {
    console.log('🌱 Starting database seeding...')

    // Read and execute the main seed file
    console.log('📦 Seeding products and appliances...')
    const seedSql = fs.readFileSync(
      path.join(__dirname, '../supabase/seed/seed.sql'),
      'utf8'
    )
    
    const { error: seedError } = await supabase.rpc('exec_sql', { 
      sql: seedSql 
    })
    
    if (seedError) {
      console.error('Error seeding products:', seedError)
    } else {
      console.log('✅ Products and appliances seeded successfully')
    }

    // Read and execute the bundles seed file
    console.log('📦 Seeding bundles...')
    const bundlesSql = fs.readFileSync(
      path.join(__dirname, '../supabase/seed/bundles.sql'),
      'utf8'
    )
    
    const { error: bundlesError } = await supabase.rpc('exec_sql', { 
      sql: bundlesSql 
    })
    
    if (bundlesError) {
      console.error('Error seeding bundles:', bundlesError)
    } else {
      console.log('✅ Bundles seeded successfully')
    }

    console.log('🎉 Database seeding completed!')
    
    // Verify the seeding
    console.log('\n📊 Verifying seeded data...')
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('category, count(*)')
      .group('category')
    
    if (!productsError && products) {
      console.log('Products by category:')
      products.forEach(p => console.log(`  ${p.category}: ${p.count}`))
    }
    
    const { count: bundleCount } = await supabase
      .from('bundles')
      .select('*', { count: 'exact', head: true })
    
    console.log(`Bundles: ${bundleCount}`)
    
    const { count: applianceCount } = await supabase
      .from('appliances')
      .select('*', { count: 'exact', head: true })
    
    console.log(`Appliances: ${applianceCount}`)

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Alternative seeding method using direct SQL execution
async function seedDirect() {
  try {
    console.log('🌱 Starting direct database seeding...')

    // Seed appliances first
    const { DEFAULT_APPLIANCES } = require('../src/data/appliances')
    
    console.log('📦 Seeding appliances...')
    const { error: appliancesError } = await supabase
      .from('appliances')
      .insert(DEFAULT_APPLIANCES.map(appliance => ({
        ...appliance,
        id: undefined // Let database generate UUID
      })))
    
    if (appliancesError) {
      console.error('Error seeding appliances:', appliancesError)
    } else {
      console.log('✅ Appliances seeded successfully')
    }

    console.log('🎉 Direct seeding completed!')

  } catch (error) {
    console.error('❌ Direct seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
if (process.argv.includes('--direct')) {
  seedDirect()
} else {
  seed()
}