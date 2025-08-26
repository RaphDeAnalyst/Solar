describe('Solar Calculator E2E Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('completes full calculator flow - quick mode', () => {
    // Homepage
    cy.get('[data-testid="calculator-button"]')
      .or('button:contains("Run Solar Calculator")')
      .click()

    // Step 1: Calculation Type
    cy.get('[data-testid="full-system-option"]')
      .or('div:contains("Full Solar System")')
      .click()
    
    cy.get('button:contains("Continue")').click()

    // Step 2: Input Mode
    cy.get('[data-testid="quick-mode-option"]')
      .or('div:contains("Quick Mode")')
      .click()
    
    cy.get('button:contains("Continue")').click()

    // Step 3: Appliance Selection
    // Add LED Bulbs
    cy.get('button:contains("LED Bulb")').first().click()
    
    // Add Ceiling Fan
    cy.get('button:contains("Ceiling Fan")').first().click()
    
    // Add TV
    cy.get('button:contains("TV")').first().click()

    // Verify appliances are selected
    cy.get('[data-testid="selected-appliances"]')
      .or('.card:contains("Selected Appliances")')
      .should('contain', 'LED Bulb')
      .should('contain', 'Ceiling Fan')
      .should('contain', 'TV')

    cy.get('button:contains("Continue to System Configuration")').click()

    // Step 4: System Configuration
    // Select location (Lagos should be default)
    cy.get('input[value="lagos"]').should('be.checked')
    
    // Select battery type (Lead Acid should be default)
    cy.get('input[value="lead_acid"]').should('be.checked')

    // Calculate system
    cy.get('button:contains("Calculate My Solar System")').click()

    // Step 5: Results
    cy.url().should('not.contain', 'calculating')
    
    // Check for results elements
    cy.get('[data-testid="system-requirements"]')
      .or('.card:contains("System Requirements")')
      .should('exist')

    // Verify main results are displayed
    cy.contains(/\d+(\.\d+)?kW/).should('exist') // Inverter size
    cy.contains(/\d+x\d+Ah/).should('exist') // Batteries
    cy.contains(/\d+x\d+W/).should('exist') // Panels

    // Check for generator comparison
    cy.get('[data-testid="generator-comparison"]')
      .or('.card:contains("Solar vs Generator")')
      .should('exist')

    // Check for action buttons
    cy.contains('Share on WhatsApp').should('exist')
    cy.contains('Call Expert').should('exist')
    cy.contains('Request Quote').should('exist')
  })

  it('completes expert mode flow with custom appliance', () => {
    // Start calculator
    cy.get('button:contains("Run Solar Calculator")').click()

    // Choose full system
    cy.get('div:contains("Full Solar System")').click()
    cy.get('button:contains("Continue")').click()

    // Choose expert mode
    cy.get('div:contains("Expert Mode")').click()
    cy.get('button:contains("Continue")').click()

    // Add some preset appliances
    cy.get('button:contains("LED Bulb")').first().click()
    
    // Add custom appliance
    cy.get('button:contains("Add Custom")').click()
    
    cy.get('input[placeholder*="Gaming Console"]').type('Gaming Console')
    cy.get('input[placeholder="150"]').type('150')
    cy.get('input[placeholder="4"]').type('4')
    
    cy.get('button:contains("Add Appliance")').click()

    // Verify custom appliance is added
    cy.contains('Gaming Console').should('exist')

    // Continue with flow
    cy.get('button:contains("Continue to System Configuration")').click()

    // Use advanced settings in expert mode
    cy.get('select').first().select('24') // Change to 24V system
    
    cy.get('button:contains("Calculate My Solar System")').click()

    // Verify results
    cy.contains('System Requirements').should('exist')
  })

  it('handles lead capture flow', () => {
    // Complete quick calculation first
    cy.get('button:contains("Run Solar Calculator")').click()
    cy.get('div:contains("Full Solar System")').click()
    cy.get('button:contains("Continue")').click()
    cy.get('div:contains("Quick Mode")').click()
    cy.get('button:contains("Continue")').click()
    
    // Add appliances quickly
    cy.get('button').contains('LED Bulb').first().click()
    cy.get('button').contains('Ceiling Fan').first().click()
    cy.get('button:contains("Continue to System Configuration")').click()
    cy.get('button:contains("Calculate My Solar System")').click()

    // Request quote
    cy.get('button:contains("Request Quote")').click()

    // Fill lead form
    cy.get('input[placeholder*="full name"]').type('John Doe')
    cy.get('input[placeholder*="801 234 5678"]').type('+2348012345678')
    cy.get('input[placeholder*="email"]').type('john@example.com')
    cy.get('textarea[placeholder*="requirements"]')
      .type('I need installation in Lagos by next month')

    // Submit form
    cy.get('button:contains("Submit Request")').click()

    // Should show confirmation
    cy.contains('Quote request submitted').should('exist')
  })

  it('handles WhatsApp sharing', () => {
    // Complete calculation
    cy.get('button:contains("Run Solar Calculator")').click()
    cy.get('div:contains("Full Solar System")').click()
    cy.get('button:contains("Continue")').click()
    cy.get('div:contains("Quick Mode")').click()
    cy.get('button:contains("Continue")').click()
    cy.get('button').contains('LED Bulb').first().click()
    cy.get('button:contains("Continue to System Configuration")').click()
    cy.get('button:contains("Calculate My Solar System")').click()

    // Mock window.open to prevent actual WhatsApp opening
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen')
    })

    // Click WhatsApp share
    cy.get('button:contains("Share on WhatsApp")').click()

    // Verify WhatsApp URL was called
    cy.get('@windowOpen').should('have.been.calledWith', 
      Cypress.sinon.match(/wa\.me\/.*text=.*Daily Energy.*Peak Load/))
  })

  it('validates form inputs and shows errors', () => {
    // Start calculator but don't select anything
    cy.get('button:contains("Run Solar Calculator")').click()

    // Try to continue without selection
    cy.get('button:contains("Continue")').should('be.disabled')

    // Select option and continue
    cy.get('div:contains("Full Solar System")').click()
    cy.get('button:contains("Continue")').should('not.be.disabled').click()

    // Try expert mode with invalid custom appliance
    cy.get('div:contains("Expert Mode")').click()
    cy.get('button:contains("Continue")').click()

    cy.get('button:contains("Add Custom")').click()
    
    // Try to add without required fields
    cy.get('button:contains("Add Appliance")').click()
    
    // Should not add appliance (form validation)
    cy.get('input[placeholder*="Gaming Console"]').should('be.visible')

    // Fill required fields
    cy.get('input[placeholder*="Gaming Console"]').type('Test Device')
    cy.get('input[placeholder="150"]').type('100')
    cy.get('input[placeholder="4"]').type('2')
    cy.get('button:contains("Add Appliance")').click()

    // Should add successfully
    cy.contains('Test Device').should('exist')
  })

  it('works on mobile viewport', () => {
    cy.viewport('iphone-x')
    
    // Should show mobile bottom bar on homepage
    cy.get('[data-testid="mobile-bottom-bar"]')
      .or('div:contains("Calculator")')
      .should('be.visible')

    // Click calculator from mobile bar
    cy.get('button:contains("Calculator")').last().click()

    // Should work through the flow on mobile
    cy.get('div:contains("Full Solar System")').click()
    cy.get('button:contains("Continue")').click()
    cy.get('div:contains("Quick Mode")').click()
    cy.get('button:contains("Continue")').click()

    // Mobile appliance selection
    cy.get('button').contains('LED Bulb').first().click()
    
    // Should show mobile-optimized layout
    cy.get('.mobile-full').should('exist')
  })

  it('handles solar generator calculation', () => {
    cy.get('button:contains("Run Solar Calculator")').click()

    // Choose solar generator
    cy.get('div:contains("Solar Generator")').click()
    cy.get('button:contains("Continue")').click()

    // Quick mode for solar generator
    cy.get('div:contains("Quick Mode")').click()
    cy.get('button:contains("Continue")').click()

    // Add appliances
    cy.get('button').contains('LED Bulb').first().click()
    cy.get('button').contains('Phone Charger').first().click()

    cy.get('button:contains("Continue to System Configuration")').click()

    // Solar generator specific settings
    cy.get('button:contains("Calculate My Solar System")').click()

    // Should show solar generator recommendations
    cy.contains('Solar Generator').should('exist')
    cy.contains('Portable').should('exist')
  })
})