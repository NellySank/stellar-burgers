import { TOrder } from '@utils-types';

describe('Процесс оформления заказа', () => {
  const testAccessToken = 'test-access-token-123';
  const testRefreshToken = 'test-refresh-token-456';

  beforeEach(() => {
    cy.setCookie('accessToken', testAccessToken);
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', testRefreshToken);
    });

    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients/all-ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');

    cy.intercept('POST', 'api/orders', {
      fixture: 'orders/order-success.json'
    }).as('setOrder');

    cy.intercept('GET', 'api/auth/user', {
      email: 'test@mail.ru',
      name: 'testUser'
    }).as('loginRequest');

    cy.wait('@loginRequest');
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
    cy.clearCookie('accessToken');
  });

  it('Оформление заказа', () => {
    // Добавляем булку
    cy.contains('[data-cy="ingredient-item"]', 'Краторная булка N-200i').within(
      () => {
        cy.contains('button', 'Добавить').click();
      }
    );
    // Добавляем начинку
    cy.contains(
      '[data-cy="ingredient-item"]',
      'Биокотлета из марсианской Магнолии'
    ).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // нажимаем оформление заказа
    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@setOrder').then((interception) => {
      const order: TOrder = interception?.response?.body.order;
      const orderNumber = order.number;

      cy.contains(orderNumber).should('be.visible');
    });

    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });
});
