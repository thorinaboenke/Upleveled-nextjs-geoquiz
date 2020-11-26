describe('Test Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });
  it('focuses input on load', () => {
    cy.focused().should('have.id', 'name');
  });
  // it('submits a message via the contact form', () => {
  //   const name = 'Cypress Test';
  //   const email = 'cypress@test.email';
  //   const message = 'cypress test message from geoquiz';
  //   cy.get('#name').type(name).should('have.value', name).type('{enter}');
  //   cy.focused()
  //     .should('have.id', 'email')
  //     .type(email)
  //     .should('have.value', email)
  //     .type('{enter}');
  //   cy.focused()
  //     .should('have.id', 'message')
  //     .type(message)
  //     .should('have.value', message)
  //     .type('{enter}');
  //   cy.get('.send-form-button').click();
  //   cy.get('#name').should('have.value', '');
  //   cy.get('#email').should('have.value', '');
  //   cy.get('#message').should('have.value', '');
  //   cy.contains('Thank you');
  // });

  it('clear form button', () => {
    const name = 'Cypress Test';
    const email = 'cypress@test.email';
    const message = 'cypress test contact from geoquiz';
    cy.get('#name').type(name);
    cy.get('#email').type(email);
    cy.get('#message').type(message);
    cy.get('.clear-form-button').click();
    cy.get('#name').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#message').should('have.value', '');
  });
  it('tests form error messages on invalid inputs', () => {
    const name = 'Cypress Test';
    const noEmail = 'novalidemail';
    const email = 'cypress@test.email';
    cy.get('.send-form-button').click();
    cy.get('#name').then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.');
    });
    cy.get('#name').type(name);
    cy.get('#email').then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.');
    });
    cy.get('#email').type(noEmail);
    cy.get('#email').then(($input) => {
      expect($input[0].validationMessage).to.eq(
        `Please include an '@' in the email address. '${noEmail}' is missing an '@'.`,
      );
    });
    cy.get('#email').clear().type(email);
    cy.get('#message').then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.');
    });
  });
});
