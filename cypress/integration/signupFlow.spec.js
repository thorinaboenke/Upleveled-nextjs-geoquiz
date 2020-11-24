describe('SingUp Flow', () => {
  // make function that is always the same to signup user
  // to login User
  // to delete user after the test
  it('Signs up a user ', () => {
    const username = 'IAmGroot';
    const password = 'IAmGroot';
    const filePath = 'profilePicture.jpg';
    cy.visit('http://localhost:3000/signup');
    cy.focused().should('have.id', 'username');
    cy.get('#username').type(username).should('have.value', username);
    cy.get('#password').type(password).should('have.value', password);
    cy.get('[type="submit"]').click();
    cy.contains('Difficulty');
    cy.contains('Flag');
    cy.get('[data-cy=header-link-logout]').click();
    cy.contains(
      'Create a free account to play more categories and see your statistics',
    );
    cy.get('[data-cy=header-link-login]').click();
    cy.get('#username').type(username).should('have.value', username);
    cy.get('#password').type(password).should('have.value', password);
    cy.get('[type="submit"]').click();

    cy.get('[data-cy=header-link-profile]').click();
    cy.get('#upload-modal').click();

    cy.get('#file').should('be.visible').attachFile(filePath);
    cy.get('#save').click();
    cy.contains('Profile Picture updated');
    cy.get('#delete-account').click();
    cy.contains('Your account was successfully deleted');
  });
  it('Changes Profile picture ', () => {
    cy.visit('http://localhost:3000/login');
    it('focuses input on load', () => {
      cy.focused().should('have.id', 'username');
    });
  });

  it('Logs out a user ', () => {
    cy.get('[data-cy=header-link-logout]').click();
    cy.contains('Difficulty');
  });

  it.only('plays quiz', () => {
    //play quiz
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=btn-start-quiz]').click();
    cy.contains('Score');
    cy.get('[data-cy=answer-button]').first().click();
    cy.contains('Question 2/ 5').then(() => {
      cy.get('[data-cy=answer-button]').should('be.visible').first().click();
    });
  });
});
