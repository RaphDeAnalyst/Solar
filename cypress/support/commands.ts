/// <reference types="cypress" />

// Custom command to select by data-testid
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Custom command to mock Supabase
Cypress.Commands.add('mockSupabase', () => {
  cy.intercept('GET', '**/rest/v1/appliances*', { 
    fixture: 'appliances.json' 
  }).as('getAppliances')
  
  cy.intercept('GET', '**/rest/v1/bundles*', { 
    fixture: 'bundles.json' 
  }).as('getBundles')
  
  cy.intercept('POST', '**/rest/v1/leads*', {
    statusCode: 201,
    body: { id: 'test-lead-id' }
  }).as('createLead')
})

// Custom command to quickly complete basic calculator flow
Cypress.Commands.add('completeBasicCalculation', () => {
  // Navigate to calculator
  cy.get('button:contains("Run Solar Calculator")').click()
  
  // Select full system
  cy.get('div:contains("Full Solar System")').click()
  cy.get('button:contains("Continue")').click()
  
  // Select quick mode
  cy.get('div:contains("Quick Mode")').click()
  cy.get('button:contains("Continue")').click()
  
  // Add basic appliances
  cy.get('button').contains('LED Bulb').first().click()
  cy.get('button').contains('Ceiling Fan').first().click()
  cy.get('button').contains('TV').first().click()
  
  // Continue to configuration
  cy.get('button:contains("Continue to System Configuration")').click()
  
  // Calculate
  cy.get('button:contains("Calculate My Solar System")').click()
})

export {}