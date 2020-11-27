describe('Play Quiz not logged in', () => {
  it('plays quiz', () => {
    //play quiz
    cy.visit('/');
    cy.get('[data-cy=btn-start-quiz]').click();
    cy.contains('Score');
    cy.get('[data-cy=answer-button]').first().click();
    cy.contains('Question 2/5').then(() => {
      cy.get('[data-cy=answer-button]').should('be.visible').first().click();
    });
    cy.contains('Question 3/5').then(() => {
      cy.get('[data-cy=answer-button]').should('be.visible').first().click();
    });
    cy.contains('Question 4/5').then(() => {
      cy.wait(11000);
    });
    cy.contains('Question 5/5').then(() => {
      cy.get('[data-cy=answer-button]').should('be.visible').first().click();
    });
    cy.contains('Your Answer');
  });
});
