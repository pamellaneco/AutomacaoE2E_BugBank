Cypress.Commands.add('cadastro', (nome, email, senha) => {
    cy.visit('/');
    cy.contains('button', 'Registrar').click();
    
    cy.get('.card__register input[name="email"]').type(email, {force: true});
    cy.get('.card__register input[name="name"]').type(nome, {force: true});
    cy.get('.card__register input[name="password"]').type(senha, {force: true});
    cy.get('.card__register input[name="passwordConfirmation"]').type(senha, {force: true});
    
    cy.get('#toggleAddBalance').click({force: true});
    cy.contains('button', 'Cadastrar').click({force: true});
    
    cy.get('#modalText', { timeout: 10000 }).should('contain', 'criada com sucesso');
    cy.get('#btnCloseModal').click();
});

Cypress.Commands.add('login', (email, senha) => {
    cy.url().then((url) => {
        if (!url.includes('bugbank.netlify.app')) {
            cy.visit('/');
        }
    });

    cy.get('.card__login input[name="email"]').type(email, {force: true});
    cy.get('.card__login input[name="password"]').type(senha, {force: true});
    cy.contains('button', 'Acessar').click();
    
    cy.url({ timeout: 10000 }).should('include', '/home');
});