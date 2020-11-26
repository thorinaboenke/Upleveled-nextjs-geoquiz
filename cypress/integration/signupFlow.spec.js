const username = 'groot';
const password = 'groot';
const filePath = 'profilePicture.jpg';

before(() => {
  cy.visit('http://localhost:3000/signup');
  cy.focused().should('have.id', 'username');
  cy.get('#username').type(username).should('have.value', username);
  cy.get('#password').type(password).should('have.value', password);
  cy.get('[type="submit"]').click();
  cy.contains('Difficulty');
});

beforeEach(() => {
  cy.visit('http://localhost:3000/logout');
  cy.visit('http://localhost:3000/login');
  cy.get('#username').type(username).should('have.value', username);
  cy.get('#password').type(password).should('have.value', password);
  cy.get('[type="submit"]').click();
});

after(() => {
  cy.get('[data-cy=header-link-profile]').should('be.visible').click();
  cy.get('#delete-account').click();
  cy.contains('Your account was successfully deleted');
});

describe('User interactions Flow', () => {
  it('Upload profile picture ', () => {
    cy.visit('http://localhost:3000/profile');
    cy.get('#upload-modal').click();
    cy.get('#file').should('be.visible').attachFile(filePath);
    cy.get('#save').click();
    cy.contains('Profile Picture updated');
  });

  it('plays quiz', () => {
    //play quiz
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=btn-start-quiz]').click();
    cy.contains('Score');
    cy.get('[data-cy=answer-button]').first().click();
    cy.contains('Question 2/ 5').then(() => {
      cy.get('[data-cy=answer-button]').should('be.visible').first().click();
    });
    cy.contains('Question 3/ 5').then(() => {
      cy.get('[data-cy=answer-button]').should('be.visible').first().click();
    });
    cy.contains('Question 4/ 5').then(() => {
      cy.wait(11000);
    });
    cy.contains('Question 5/ 5').then(() => {
      cy.get('[data-cy=answer-button]').should('be.visible').first().click();
    });
    cy.contains('Your Answer');
  });
});
