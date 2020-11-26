describe('Simple site navigation', () => {
  it('Navigate to footer links', () => {
    cy.visit('/');
    cy.contains('Difficulty');
    cy.get('[data-cy=footer-link-about]').click();
    cy.contains('Hello there');
    cy.get('[data-cy=footer-link-contact]').click();
    cy.contains('Send your comments and feedback!');
    cy.get('[data-cy=footer-link-impressum]').click();
    cy.contains('Impressum - Legal Disclosure');
  });
  it('Navigate to header links that redirect to the login page if not logged in', () => {
    cy.visit('/');
    cy.contains('Difficulty');
    cy.get('[data-cy=header-link-login]').click();
    cy.contains("Don't have an account?");
    cy.get('[data-cy=header-link-stats]').click();
    cy.contains("Don't have an account?");
    cy.get('[data-cy=header-link-profile]').click();
    cy.contains("Don't have an account?");
  });
});
