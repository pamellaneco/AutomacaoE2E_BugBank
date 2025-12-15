describe('Funcionalidades de Acesso (Cadastro e Login)', () => {
  let usuario;

  beforeEach(() => {
    usuario = {
      nome: 'QA Acesso',
      email: `acesso.${Date.now()}@bugbank.com`,
      senha: 'senha123'
    };
    cy.cadastro(usuario.nome, usuario.email, usuario.senha);
  });

  it('TTCW-1: Validar cadastro de novo usuário com saldo na conta', () => {
    // O comando 'cadastro' já valida a criação, então aqui valida o estado pós-cadastro
    cy.get('.card__login').should('be.visible');
    cy.get('.card__login input[name="email"]').should('have.value', '');
  });

  it('TTCW-2: Realizar login com credenciais válidas', () => {
    cy.login(usuario.email, usuario.senha);
    cy.contains(`Olá ${usuario.nome}`).should('be.visible');
    cy.contains('Sair').should('be.visible');
  });

  it('TTCW-3: Realizar login com credenciais incorretas', () => {
    cy.get('.card__login input[name="email"]').type(usuario.email, {force: true});
    cy.get('.card__login input[name="password"]').type('senhaErrada', {force: true});
    cy.contains('button', 'Acessar').click();

    // Validação (modal com mensagem de erro)
    cy.get('#modalText').should('be.visible');
    cy.get('#modalText').should('contain', 'Usuário ou senha inválido');
    cy.get('#btnCloseModal').click();
  });
});