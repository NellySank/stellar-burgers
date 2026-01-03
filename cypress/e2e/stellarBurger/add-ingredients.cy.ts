describe('Добавление ингредиентов из списка ингредиентов в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients/all-ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('начинка должна добавиться в конструктор', () => {
    // Добавляем начинку
    cy.contains(
      '[data-cy="ingredient-item"]',
      'Биокотлета из марсианской Магнолии'
    ).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    cy.get('.constructor-element')
      .should('contain', 'Биокотлета из марсианской Магнолии')
      .and('be.visible');
  });

  it('булка должна добавиться в размере 2шт', () => {
    // Добавялем булку
    cy.contains('[data-cy="ingredient-item"]', 'Краторная булка N-200i').within(
      () => {
        cy.contains('button', 'Добавить').click();
      }
    );

    cy.get('.constructor-element:contains("Краторная булка N-200i")').should(
      'have.length',
      2
    );
  });
});
