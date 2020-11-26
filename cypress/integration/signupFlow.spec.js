const username = 'groot';
const password = 'groot';
const filePath = 'profilePicture.jpg';

before(() => {
  cy.visit('/signup');
  cy.focused().should('have.id', 'username');
  cy.get('#username').type(username).should('have.value', username);
  cy.get('#password').type(password).should('have.value', password);
  cy.get('[type="submit"]').click();
  cy.contains('Difficulty');
});

beforeEach(() => {
  cy.visit('/logout');
  cy.visit('/login');
  cy.get('#username').type(username).should('have.value', username);
  cy.get('#password').type(password).should('have.value', password);
  cy.get('[type="submit"]').click();
});

// after(() => {
//   cy.visit('/profile');
//   cy.get('#delete-account').should('be.visible').click();
//   cy.contains('Your account was successfully deleted');
// });

describe('User interactions Flow', () => {
  it('Upload profile picture ', () => {
    cy.visit('/profile');
    cy.get('#upload-modal').click();
    cy.get('#file').should('be.visible').attachFile(filePath);
    cy.get('#save').click();
    cy.contains('Profile Picture updated');

    cy.visit('/profile');
    cy.get('#delete-account').should('be.visible').click();
    cy.contains('Your account was successfully deleted');
  });
});
