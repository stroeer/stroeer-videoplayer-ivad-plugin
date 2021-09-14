/// <reference types="cypress" />

context('UIButtons', () => {
  beforeEach(() => {
    cy.visit('cypress/static/ui.html')
  })

  it('should click on play button', () => {
    cy.get('.buttons .play').click().should('not.be.visible')
    cy.get('video').its('currentTime').should('not.eq', 0)
    cy.get('.buttons .pause').should('be.visible')
  })

  it('should click on play, pause and play button again', () => {
    cy.get('.buttons .play').click().should('not.be.visible')
    cy.get('.buttons .pause').should('be.visible').click()
    cy.get('.buttons .play').should('be.visible')
    cy.get('.buttons .pause').should('not.be.visible')
  })

  it('should click on mute and unmute', () => {
    cy.get('.buttons .mute').click().should('not.be.visible')
    cy.get('video').should((els) => {
      let muted = false
      els.each((i, el) => {
        muted = el.muted
      })
      expect(muted).to.eq(true)
    })
    cy.get('.buttons .unmute').should('be.visible').click()
    cy.get('video').should((els) => {
      let muted = true
      els.each((i, el) => {
        muted = el.muted
      })
      expect(muted).to.eq(false)
    })
  })

  // it('should trigger fullscreen', () => {
  //   cy.get('.buttons .enterFullscreen').click()
  //   cy.document().its('fullscreenElement').should('not.equal', null)
  // })
})
