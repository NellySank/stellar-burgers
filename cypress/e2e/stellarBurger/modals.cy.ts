import { TIngredient } from '@utils-types';

describe('Проверка работы модального окна по клику на ингридиент', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients/all-ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('при клике на ингридиет должно открыться модальное окно', () => {
    cy.wait('@getIngredients').then((interception) => {
      const ingredients: TIngredient[] = interception?.response?.body.data;
      const targetIngredient: TIngredient | undefined = ingredients.find(
        (ing) => ing.name === 'Биокотлета из марсианской Магнолии'
      );

      if (!targetIngredient) {
        throw new Error(
          'Ингредиент "Биокотлета из марсианской Магнолии" не найден в all-ingredients.json'
        );
      }

      cy.contains(targetIngredient.name).click();

      cy.contains('Детали ингридиента').should('be.visible');
      cy.contains(targetIngredient.name).should('be.visible');

      // Описание ингридиента
      cy.contains(targetIngredient.calories).should('be.visible');
      cy.contains(targetIngredient.proteins).should('be.visible');
      cy.contains(targetIngredient.fat).should('be.visible');
      cy.contains(targetIngredient.carbohydrates).should('be.visible');
    });
  });

  it('при клике на кнопку закрытия модального окна оно закроется', () => {
    cy.wait('@getIngredients').then((interception) => {
      const ingredients: TIngredient[] = interception?.response?.body.data;
      const targetIngredient: TIngredient | undefined = ingredients.find(
        (ing) => ing.name === 'Биокотлета из марсианской Магнолии'
      );

      if (!targetIngredient) {
        throw new Error(
          'Ингредиент "Биокотлета из марсианской Магнолии" не найден в all-ingredients.json'
        );
      }

      cy.contains(targetIngredient.name).click();

      cy.contains('Детали ингридиента').should('be.visible');
      cy.contains(targetIngredient.name).should('be.visible');

      // Находим и нажимаем кнопку закрытия
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  it('при клике на оверлей модальное окно закроется', () => {
    cy.wait('@getIngredients').then((interception) => {
      const ingredients: TIngredient[] = interception?.response?.body.data;
      const targetIngredient: TIngredient | undefined = ingredients.find(
        (ing) => ing.name === 'Биокотлета из марсианской Магнолии'
      );

      if (!targetIngredient) {
        throw new Error(
          'Ингредиент "Биокотлета из марсианской Магнолии" не найден в all-ingredients.json'
        );
      }

      cy.contains(targetIngredient.name).click();

      cy.contains('Детали ингридиента').should('be.visible');
      cy.contains(targetIngredient.name).should('be.visible');

      // Нажимаем за пределами модального окна
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.contains('Детали ингредиента').should('not.exist');
    });
  });
});
