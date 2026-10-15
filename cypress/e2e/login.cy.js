/**
 * Skenario Pengujian E2E Login:
 *
 * - Skenario 1: Menampilkan halaman login dan elemen form (input email, password, tombol submit)
 * - Skenario 2: Menampilkan alert kegagalan ketika kredensial tidak sesuai
 * - Skenario 3: Berhasil masuk ketika kredensial valid, token tersimpan di browser, dan pengguna diarahkan ke beranda dengan info nama/avatar di navbar
 */

describe('Login Flow Spec', () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    // Intercept common initial requests for threads and users
    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: { status: 'success', data: { threads: [] } },
    }).as('getThreads');

    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: { status: 'success', data: { users: [] } },
    }).as('getUsers');
  });

  it('harus menampilkan halaman login dan seluruh elemen form dengan benar', () => {
    cy.visit('/login');

    cy.get('h1').should('contain', 'Masuk ke Akun');
    cy.get('input#email').should('be.visible').and('have.attr', 'placeholder', 'email@example.com');
    cy.get('input#password').should('be.visible').and('have.attr', 'placeholder', '••••••••');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Masuk');
  });

  it('harus menampilkan alert kegagalan ketika kredensial tidak sesuai', () => {
    const errorMessage = 'email or password is wrong';

    cy.intercept('POST', '**/login', {
      statusCode: 400,
      body: {
        status: 'fail',
        message: errorMessage,
      },
    }).as('loginFailed');

    cy.visit('/login');

    const onAlert = cy.stub();
    cy.on('window:alert', onAlert);

    cy.get('input#email').type('invalid@example.com');
    cy.get('input#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFailed');
    cy.then(() => {
      expect(onAlert).to.be.calledWith(errorMessage);
    });
  });

  it('harus berhasil masuk ketika kredensial valid, token tersimpan, dan navigasi ke beranda dengan profil di navbar', () => {
    const mockToken = 'mock-cypress-access-token';
    const mockUser = {
      id: 'user-cypress-123',
      name: 'Cypress Tester',
      email: 'cypress@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Cypress+Tester',
    };

    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          token: mockToken,
        },
      },
    }).as('loginSuccess');

    cy.intercept('GET', '**/users/me', (req) => {
      const authHeader = req.headers.authorization || '';
      if (authHeader.includes(mockToken)) {
        req.reply({
          statusCode: 200,
          body: {
            status: 'success',
            message: 'ok',
            data: {
              user: mockUser,
            },
          },
        });
      } else {
        req.reply({
          statusCode: 401,
          body: {
            status: 'fail',
            message: 'Unauthorized',
          },
        });
      }
    }).as('getProfile');

    cy.visit('/login');

    cy.get('input#email').should('be.visible').type('cypress@example.com');
    cy.get('input#password').should('be.visible').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    cy.wait('@getProfile');

    // Assert URL navigates to '/'
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    // Assert token stored in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.equal(mockToken);
    });

    // Assert navbar renders authenticated user profile and logout button
    cy.get('header').should('contain', 'Cypress Tester');
    cy.get('header img[alt="Cypress Tester"]').should('be.visible');
    cy.get('header button[aria-label="Logout"]').should('be.visible').and('contain', 'Keluar');
  });
});
