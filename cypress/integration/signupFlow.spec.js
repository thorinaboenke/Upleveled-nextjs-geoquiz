describe('Singup Flow', () => {

  it('Signs up a user, changes profile picture, ', () => {
    cy.visit('http://localhost:3000/login');
    cy.contains("Don't have an account?");
  });
}